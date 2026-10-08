/* /api/auth?action=...
     GET  me        who is signed in (and who they are viewing as, if impersonating)
     POST login     { email, password }
     POST logout
   There is no sign-up, no "forgot password" and no change-password form: an admin creates accounts and sets or resets passwords. */
const { db } = require('./_lib/db');
const { verifyPassword, signToken, sessionCookie, cleanEmail } = require('./_lib/security');
const { getSession, csrfOk, send, body, publicUser } = require('./_lib/guard');

const WEEK = 60 * 60 * 24 * 30;
const MAX_FAILS = 8;   // failed sign-ins per email or per IP within 15 minutes

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const action = (req.query && req.query.action) || '';
  try {
    const d = await db();

    if (action === 'me' && req.method === 'GET') {
      const s = await getSession(req, d);
      if (!s) return send(res, 401, { error: 'not signed in' });
      return send(res, 200, {
        user: publicUser(s.effective),
        impersonating: !!s.imp,
        admin: s.user.role === 'admin' ? publicUser(s.user) : null,
      });
    }

    if (req.method !== 'POST') return send(res, 405, { error: 'method not allowed' });
    if (!csrfOk(req)) return send(res, 403, { error: 'bad request origin' });
    const b = body(req);

    if (action === 'login') {
      const email = cleanEmail(b.email), ip = String(req.headers['x-forwarded-for'] || req.socket && req.socket.remoteAddress || '').split(',')[0].trim();
      const since = new Date(Date.now() - 15 * 60 * 1000);
      const fails = await d.collection('loginAttempts').countDocuments({ at: { $gte: since }, $or: [{ email }, { ip }] });
      if (fails >= MAX_FAILS) return send(res, 429, { error: 'Too many attempts. Try again in 15 minutes.' });
      const user = email ? await d.collection('users').findOne({ email }) : null;
      const good = user && verifyPassword(b.password, user.passHash);
      if (!good) {
        await d.collection('loginAttempts').insertOne({ at: new Date(), email, ip });
        return send(res, 401, { error: 'Invalid email or password.' });
      }
      if (user.disabled) return send(res, 403, { error: 'This account is disabled. Ask your admin.' });
      await d.collection('users').updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });
      res.setHeader('Set-Cookie', sessionCookie(req, signToken({ u: String(user._id), sv: user.sv }, WEEK), WEEK));
      return send(res, 200, { user: publicUser(user) });
    }

    if (action === 'logout') {
      res.setHeader('Set-Cookie', sessionCookie(req, '', 0));
      return send(res, 200, { ok: true });
    }

    return send(res, 404, { error: 'unknown action' });
  } catch (e) {
    console.error('auth error:', e && e.message);
    return send(res, 500, { error: 'server error' });
  }
};
