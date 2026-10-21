// Passcode check. The password is AOI-2026 unless FACILITATOR_PASSCODE is set in Vercel to something else.
const DEFAULT_PASSCODE = 'AOI-2026';

function checkPasscode(req) {
  const expected = process.env.FACILITATOR_PASSCODE || DEFAULT_PASSCODE;
  const given = String(req.headers['x-passcode'] || '').trim();
  return given === expected;
}

module.exports = { checkPasscode };
