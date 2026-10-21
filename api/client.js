// POST /api/client
// Body: { scenarioId, exchange (1 to 4), transcript: [{ speaker: 'client' | 'team', text }], ratings: ['strong' | 'neutral' | 'weak', ...] }
// Returns: { rating, reply, ending (only after exchange 4) }
const { SCENARIOS } = require('./_scenarios');
const { checkPasscode } = require('./_auth');

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5';

// Same rule as the facilitator document: the ending depends on how many strong
// questions the team asked and whether the worry was found (exchange 2) and sized (exchange 3).
function decideEnding(ratings) {
  const strong = ratings.filter(r => r === 'strong').length;
  if (strong >= 3 && ratings[1] === 'strong' && ratings[2] === 'strong') return 'commits';
  if (strong >= 2) return 'postpones';
  return 'declines';
}

function buildSystemPrompt(s, exchange) {
  const ex = s.exchanges[exchange - 1];
  const script = s.exchanges.map((e, i) =>
    `Exchange ${i + 1}. The team should: ${e.aim}.\n` +
    `  Example of a strong question: "${e.strongQuestion}"\n` +
    `  Your reply if strong: "${e.strong}"\n` +
    `  Your reply if weak (${e.weakTrigger}): "${e.weak}"`
  ).join('\n');

  return `You are playing a client of DCDM, an accounting, tax, payroll and advisory firm in Mauritius, in a live training exercise. A team of three DCDM professionals is talking to you. They must discover your hidden worry using questions only.

WHO YOU ARE
${s.card}

YOUR HIDDEN WORRY (never state it outright unless the team has earned it)
Category: ${s.worry}. ${s.hidden}

YOUR OPENING LINE WAS
"${s.opening}"

THE SCRIPT YOU FOLLOW (stay close to these lines and this order of disclosure)
${script}

THIS IS EXCHANGE ${exchange} OF 4. The team should now: ${ex.aim}.

HOW TO RATE THE TEAM'S LATEST MESSAGE
- "strong": a genuine, open question that helps uncover or size your worry, or offers a next step that answers it (at exchange 4). It does not pitch, discount, defend the fee or over-explain. A strong question on a later rung also counts as strong.
- "neutral": polite but general ("Can you tell me more?"), or a closed question, or a question that ignores what you just said.
- "weak": a pitch, a discount, a defence of the fee, a reassurance ("we are very experienced"), a long explanation, a solution offered before the worry is known, or no question at all.

HOW TO REPLY
- Stay in character as the client. Plain, natural English, one or two sentences, 40 words at most.
- If strong: open up, close to the "reply if strong" line for this exchange, revealing only what that line reveals.
- If neutral: stay polite, reveal nothing new, gently repeat your surface position.
- If weak: close down a little, close to the "reply if weak" line for this exchange, and reveal nothing new.
- Never mention ratings, rungs, the exercise or that you are an AI.${exchange === 4 ? `

THIS IS THE LAST EXCHANGE. After your rating, you also conclude the conversation with a decision:
- "commits": you agree to go ahead. Close to: "${s.endings.commits}"
- "postpones": you ask for something in writing and delay. Close to: "${s.endings.postpones}"
- "declines": you politely say no. Close to: "${s.endings.declines}"
The decision will be given to you in the user message. Your reply must answer the team's last message and end with that decision, in two or three sentences, 55 words at most.` : ''}

OUTPUT
Return only a JSON object, with no other text: {"rating": "strong" | "neutral" | "weak", "reply": "<your words as the client>"}`;
}

function transcriptText(transcript) {
  return transcript.map(t => (t.speaker === 'client' ? 'CLIENT: ' : 'TEAM: ') + t.text).join('\n');
}

async function callModel(system, user) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 400,
      system,
      messages: [{ role: 'user', content: user }]
    })
  });
  if (!r.ok) throw new Error(`API ${r.status}: ${await r.text()}`);
  const data = await r.json();
  const text = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in reply');
  const parsed = JSON.parse(match[0]);
  if (!['strong', 'neutral', 'weak'].includes(parsed.rating) || !parsed.reply) throw new Error('Bad JSON shape');
  return parsed;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }
  if (!checkPasscode(req)) { res.status(401).json({ error: 'passcode' }); return; }
  if (!process.env.ANTHROPIC_API_KEY) { res.status(503).json({ error: 'no_api_key' }); return; }

  const { scenarioId, exchange, transcript = [], ratings = [] } = req.body || {};
  const s = SCENARIOS.find(x => x.id === scenarioId);
  const n = Number(exchange);
  if (!s || !(n >= 1 && n <= 4)) { res.status(400).json({ error: 'bad_request' }); return; }

  const system = buildSystemPrompt(s, n);
  const convo = transcriptText(transcript.slice(-12));

  try {
    if (n < 4) {
      const out = await callModel(system, `Conversation so far:\n${convo}\n\nRate the team's last message and reply as the client.`);
      res.status(200).json({ rating: out.rating, reply: out.reply.trim() });
      return;
    }
    // Exchange 4: first rate, then write the conclusion that matches the ending rule.
    const rated = await callModel(system, `Conversation so far:\n${convo}\n\nFirst, only rate the team's last message. Put "-" as the reply.`);
    const ending = decideEnding([...ratings.slice(0, 3), rated.rating]);
    let reply;
    try {
      const out = await callModel(system, `Conversation so far:\n${convo}\n\nThe team's last message is rated "${rated.rating}". Your decision is "${ending}". Reply as the client and conclude with that decision. Keep "rating" as "${rated.rating}".`);
      reply = out.reply.trim();
    } catch (e) {
      reply = s.endings[ending];
    }
    res.status(200).json({ rating: rated.rating, reply, ending });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'ai_failed', detail: String(err.message || err).slice(0, 300) });
  }
};
