/* Session lookup, impersonation, CSRF guard and JSON helpers shared by every endpoint. */
const { ObjectId } = require('mongodb');
const { parseCookies, verifyToken } = require('./security');

const publicUser = (u) => ({ id: String(u._id), email: u.email, name: u.name, role: u.role, disabled: !!u.disabled, createdAt: u.createdAt || null });

function oid(id) { try { return new ObjectId(String(id)); } catch (e) { return null; } }

/* Returns { user, imp, effective } or null.
   user      = the person who is really signed in
   imp       = the user an admin is viewing as (read-only), or null
   effective = the account whose data the app should show */
async function getSession(req, d) {
  const tok = verifyToken(parseCookies(req.headers.cookie).daq_session);
  if (!tok || !tok.u) return null;
  const _id = oid(tok.u);
  if (!_id) return null;
  const user = await d.collection('users').findOne({ _id });
  if (!user || user.disabled || user.sv !== tok.sv) return null;
  let imp = null;
  if (tok.imp) {
    if (user.role !== 'admin') return null;
    const t = oid(tok.imp);
    imp = t ? await d.collection('users').findOne({ _id: t }) : null;
    if (!imp) return null;
  }
  return { user, imp, effective: imp || user };
}

/* Browsers send this custom header only from our own pages, which blocks cross-site form posts. */
function csrfOk(req) {
  return req.method === 'GET' || req.headers['x-requested-with'] === 'daq';
}

const send = (res, code, obj) => res.status(code).json(obj);

/* Turns an unexpected error into a safe, helpful hint for whoever set up the server.
   The full message goes to the server log only; the browser gets a short category. */
function errInfo(e) {
  const m = String((e && e.message) || '');
  if (/MONGODB_URI is not set/i.test(m)) return { code: 'missing-mongodb-uri', hint: 'The MONGODB_URI environment variable is not set on the server. Add it in Vercel, then redeploy.' };
  if (/SESSION_SECRET/i.test(m)) return { code: 'missing-session-secret', hint: 'The SESSION_SECRET environment variable is missing or shorter than 24 characters. Fix it in Vercel, then redeploy.' };
  if (/authentication failed|bad auth|not authorized|Authentication/i.test(m)) return { code: 'db-auth', hint: 'MongoDB rejected the username or password in MONGODB_URI.' };
  if (/Invalid scheme|Invalid connection string|URI|ENOTFOUND|querySrv/i.test(m)) return { code: 'db-uri', hint: 'MONGODB_URI looks wrong or the cluster address cannot be found.' };
  if (/selection|timed out|ECONN|ETIMEDOUT|SSL|TLS|connect/i.test(m)) return { code: 'db-unreachable', hint: 'The server cannot reach MongoDB. In Atlas > Network Access, allow access from anywhere (0.0.0.0/0) so Vercel can connect.' };
  return { code: 'server-error', hint: '' };
}
const fail = (res, e, tag) => { console.error(tag + ' error:', e && e.message); return send(res, 500, Object.assign({ error: 'server error' }, errInfo(e))); };
const body = (req) => {
  const b = req.body;
  if (b && typeof b === 'object') return b;
  try { return JSON.parse(b || '{}'); } catch (e) { return {}; }
};

module.exports = { getSession, csrfOk, send, body, oid, publicUser, fail };
