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
const body = (req) => {
  const b = req.body;
  if (b && typeof b === 'object') return b;
  try { return JSON.parse(b || '{}'); } catch (e) { return {}; }
};

module.exports = { getSession, csrfOk, send, body, oid, publicUser };
