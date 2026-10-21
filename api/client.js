// Reads the client's answer even when the AI adds text or code fences around it,
// and asks again (up to 3 tries) before giving up.
function readJson(text) {
  const clean = String(text || '').replace(/```(?:json)?/gi, '');
  const start = clean.indexOf('{');
  if (start === -1) return null;
  for (let end = clean.lastIndexOf('}'); end > start; end = clean.lastIndexOf('}', end - 1)) {
    try { return JSON.parse(clean.slice(start, end + 1)); } catch (e) { /* try a shorter slice */ }
  }
  return null;
}

async function callModel(system, user) {
  let lastText = '';
  for (let attempt = 1; attempt <= 3; attempt++) {
    const reminder = attempt === 1 ? '' :
      '\n\nIMPORTANT: answer with the JSON object only, starting with { and ending with }, for example {"rating": "strong", "reply": "..."}.';
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 700,
        system,
        messages: [{ role: 'user', content: user + reminder }]
      })
    });
    if (!r.ok) throw new Error(`API ${r.status}: ${await r.text()}`);
    const data = await r.json();
    lastText = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
    const parsed = readJson(lastText);
    if (parsed && typeof parsed.rating === 'string') parsed.rating = parsed.rating.toLowerCase().trim();
    if (parsed && ['strong', 'neutral', 'weak'].includes(parsed.rating) && parsed.reply) return parsed;
  }
  throw new Error('No JSON in reply: ' + lastText.slice(0, 200));
}
