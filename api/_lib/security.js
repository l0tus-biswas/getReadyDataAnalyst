/* Password hashing, signed session tokens, cookies and small validators. No third-party code. */
const crypto = require('crypto');

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(String(password), salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p });
  return `s1$${salt.toString('base64')}$${hash.toString('base64')}`;
}

function verifyPassword(password, stored) {
  try {
    const [v, saltB, hashB] = String(stored).split('$');
    if (v !== 's1') return false;
    const salt = Buffer.from(saltB, 'base64'), want = Buffer.from(hashB, 'base64');
    const got = crypto.scryptSync(String(password), salt, want.length, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p });
    return crypto.timingSafeEqual(got, want);
  } catch (e) { return false; }
}

const b64 = (b) => Buffer.from(b).toString('base64url');

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 24) throw new Error('SESSION_SECRET must be set (at least 24 characters)');
  return s;
}

function signToken(payload, ttlSeconds) {
  const body = Object.assign({}, payload, { iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + ttlSeconds });
  const p = b64(JSON.stringify(body));
  const sig = crypto.createHmac('sha256', secret()).update(p).digest('base64url');
  return `${p}.${sig}`;
}

function verifyToken(token) {
  try {
    const [p, sig] = String(token).split('.');
    if (!p || !sig) return null;
    const want = crypto.createHmac('sha256', secret()).update(p).digest();
    const got = Buffer.from(sig, 'base64url');
    if (got.length !== want.length || !crypto.timingSafeEqual(got, want)) return null;
    const body = JSON.parse(Buffer.from(p, 'base64url').toString('utf8'));
    if (!body.exp || body.exp < Math.floor(Date.now() / 1000)) return null;
    return body;
  } catch (e) { return null; }
}

function parseCookies(header) {
  const out = {};
  String(header || '').split(';').forEach((kv) => {
    const i = kv.indexOf('=');
    if (i > 0) out[kv.slice(0, i).trim()] = decodeURIComponent(kv.slice(i + 1).trim());
  });
  return out;
}

function isHttps(req) {
  return (req.headers['x-forwarded-proto'] || '').split(',')[0] === 'https' || process.env.NODE_ENV === 'production';
}

function sessionCookie(req, value, maxAgeSeconds) {
  const parts = [`daq_session=${encodeURIComponent(value)}`, 'Path=/', 'HttpOnly', 'SameSite=Lax', `Max-Age=${maxAgeSeconds}`];
  if (isHttps(req)) parts.push('Secure');
  return parts.join('; ');
}

function randomPassword(len) {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(len || 12);
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
}

const validEmail = (e) => typeof e === 'string' && e.length <= 120 && /^[^\s@]+@[^\s@]+$/.test(e);
const cleanEmail = (e) => String(e || '').trim().toLowerCase();
const cleanName = (n) => String(n || '').replace(/[<>]/g, '').trim().slice(0, 60);
const validPassword = (p) => typeof p === 'string' && p.length >= 8 && p.length <= 200;

module.exports = { hashPassword, verifyPassword, signToken, verifyToken, parseCookies, sessionCookie, randomPassword, validEmail, cleanEmail, cleanName, validPassword };
