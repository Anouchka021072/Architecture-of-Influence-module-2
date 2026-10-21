// GET /api/scenarios
// Returns the six scenarios to the facilitator screen.
const { SCENARIOS, NEUTRAL } = require('./_scenarios');
const { checkPasscode } = require('./_auth');

module.exports = (req, res) => {
  if (!checkPasscode(req)) {
    res.status(401).json({ error: 'passcode' });
    return;
  }
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    scenarios: SCENARIOS,
    neutral: NEUTRAL,
    aiAvailable: Boolean(process.env.ANTHROPIC_API_KEY)
  });
};
