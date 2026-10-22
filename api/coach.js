// POST /api/coach
// Called once a run is complete. For each of the client's four lines (the opening line
// and the next three replies), writes one strong question the team could have asked
// at that rung of the Decision Ladder, fitted to what the client said in this run.
// Body: { scenarioId, transcript: [{ speaker: 'client' | 'team', text, n }] }
// Returns: { source: 'ai' | 'script', suggestions: [{ question, why }] x 4 }
// If there is no API key, or the AI fails, the scripted strong questions are returned instead,
// so the reveal always has something to show.
const { SCENARIOS } = require('./_scenarios');
const { checkPasscode } = require('./_auth');

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5';
const RUNGS = ['Ask what they are deciding', 'Find the worry', 'Size it', 'Offer a next step'];

function scripted(s) {
  return s.exchanges.slice(0, 4).map(e => ({ question: e.strongQuestion, why: e.aim }));
}

// Pair each client line with the team question that answered it.
function pairs(transcript) {
  const out = [];
  let lastClient = null;
  for (const m of transcript) {
    if (m.speaker === 'client') lastClient = m.text;
    else if (m.speaker === 'team' && out.length < 4) out.push({ client: lastClient || '', team: m.text });
  }
  return out;
}

function extractJSON(text) {
  const t = String(text || '').replace(/```(?:json)?/gi, '');
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if (a < 0 || b <= a) throw new Error('No JSON in reply');
  const parsed = JSON.parse(t.slice(a, b + 1));
  const list = parsed.suggestions;
  if (!Array.isArray(list) || list.length !== 4 || !list.every(x => x && typeof x.question === 'string' && x.question.trim())) {
    throw new Error('Bad JSON shape');
  }
  return list.map(x => ({ question: x.question.trim(), why: String(x.why || '').trim() }));
}

async function callModel(system, user) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({ model: MODEL, max_tokens: 1200, system, messages: [{ role: 'user', content: user }] })
  });
  if (!r.ok) throw new Error('Anthropic ' + r.status + ' ' + (await r.text()).slice(0, 200));
  const j = await r.json();
  return (j.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
}

function buildPrompt(s, ps) {
  const script = s.exchanges.slice(0, 4).map((e, i) =>
    `Rung ${i + 1}, ${RUNGS[i]}. Aim: ${e.aim}. Scripted strong question: "${e.strongQuestion}"`).join('\n');
  const lines = ps.map((p, i) =>
    `Rung ${i + 1}, ${RUNGS[i]}\n  The client said: "${p.client}"\n  The team asked: "${p.team}"`).join('\n');

  const system = `You coach a team of DCDM professionals (an accounting, tax, payroll and advisory firm in Mauritius) after a practice conversation with a hesitant client. The team had to find the client's hidden worry using questions only, one question per rung of the Decision Ladder: 1 ask what they are deciding, 2 find the worry, 3 size it, 4 offer a next step that answers the worry.

THE CLIENT
${s.card}

THE HIDDEN WORRY (now revealed to the room)
${s.worry}. ${s.hidden}

THE SCRIPT FOR EACH RUNG
${script}

YOUR TASK
For each of the client's four lines, write ONE strong question the team could have asked in reply, at that rung.
- It must respond to the exact words the client used in that line, not to the script.
- It must only use what the team could know at that point in the conversation. Never name the hidden worry before the client has hinted at it.
- One open question, plain spoken English, 25 words at most. No pitch, no discount, no reassurance, no explanation of DCDM's services.
- At rung 4, the question offers a concrete next step that answers the worry, phrased as a question ("If we..., would that...?").
- "why": one short sentence, 15 words at most, saying what this question does for the client.

Reply with JSON only, no other text:
{"suggestions":[{"question":"...","why":"..."},{"question":"...","why":"..."},{"question":"...","why":"..."},{"question":"...","why":"..."}]}`;

  return { system, user: `The conversation, rung by rung:\n${lines}\n\nWrite the four suggestions now.` };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }
  if (!checkPasscode(req)) { res.status(401).json({ error: 'passcode' }); return; }

  const { scenarioId, transcript = [] } = req.body || {};
  const s = SCENARIOS.find(x => x.id === scenarioId);
  if (!s) { res.status(400).json({ error: 'bad_request' }); return; }

  const fallback = scripted(s);
  const ps = pairs(Array.isArray(transcript) ? transcript : []);
  if (!process.env.ANTHROPIC_API_KEY || ps.length < 4) {
    res.status(200).json({ source: 'script', suggestions: fallback });
    return;
  }

  const { system, user } = buildPrompt(s, ps);
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const suggestions = extractJSON(await callModel(system, user));
      res.status(200).json({ source: 'ai', suggestions });
      return;
    } catch (e) {
      console.error('coach attempt ' + attempt + ' failed:', e.message);
    }
  }
  res.status(200).json({ source: 'script', suggestions: fallback });
};
