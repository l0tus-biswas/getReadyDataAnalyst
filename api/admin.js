/* /api/admin?action=...   (admins only; refused while impersonating, except stop-impersonate)
     GET  users                  all users with progress summaries
     GET  audit                  recent admin actions
     POST create       { name, email, password?, role? }   -> returns the temporary password once
     POST update       { id, name?, email?, role?, disabled? }
     POST reset        { id, password? }                    -> returns the new temporary password once
     POST delete       { id, confirm }                      (confirm = the user's email)
     POST impersonate  { id }                               read-only "view as user"
     POST stop-impersonate
   Impersonation never writes to the viewed user's data. Each start and stop is recorded in the audit log. */
const { db, audit } = require('./_lib/db');
const { hashPassword, signToken, sessionCookie, randomPassword, validEmail, cleanEmail, cleanName, validPassword } = require('./_lib/security');
const { getSession, csrfOk, send, body, oid, publicUser } = require('./_lib/guard');

const MONTH = 60 * 60 * 24 * 30, IMP_TTL = 60 * 60 * 2;

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const action = (req.query && req.query.action) || '';
  try {
    const d = await db();
    const s = await getSession(req, d);
    if (!s) return send(res, 401, { error: 'not signed in' });
    if (s.user.role !== 'admin') return send(res, 403, { error: 'admins only' });
    if (req.method !== 'GET' && !csrfOk(req)) return send(res, 403, { error: 'bad request origin' });
    const users = d.collection('users');
    const admin = s.user;

    if (action === 'stop-impersonate' && req.method === 'POST') {
      if (s.imp) await audit(d, admin, 'impersonate.stop', s.imp);
      res.setHeader('Set-Cookie', sessionCookie(req, signToken({ u: String(admin._id), sv: admin.sv }, MONTH), MONTH));
      return send(res, 200, { ok: true });
    }
    if (s.imp) return send(res, 403, { error: 'Exit "view as user" first.' });

    if (action === 'users' && req.method === 'GET') {
      const list = await users.find({}, { projection: { passHash: 0 } }).sort({ createdAt: 1 }).toArray();
      const prog = await d.collection('progress').find({}, { projection: { summary: 1, updatedAt: 1 } }).toArray();
      const byId = {}; prog.forEach((p) => { byId[p._id] = p; });
      return send(res, 200, {
        users: list.map((u) => Object.assign(publicUser(u), {
          createdAt: u.createdAt, lastLoginAt: u.lastLoginAt || null,
          summary: byId[String(u._id)] ? byId[String(u._id)].summary || null : null,
          savedAt: byId[String(u._id)] ? byId[String(u._id)].updatedAt : null,
        })),
      });
    }

    if (action === 'audit' && req.method === 'GET') {
      const rows = await d.collection('audit').find({}).sort({ ts: -1 }).limit(60).toArray();
      return send(res, 200, { audit: rows.map((r) => ({ ts: r.ts, actor: r.actor, action: r.action, target: r.target, meta: r.meta })) });
    }

    if (req.method !== 'POST') return send(res, 405, { error: 'method not allowed' });
    const b = body(req);

    if (action === 'create') {
      const email = cleanEmail(b.email), name = cleanName(b.name) || email.split('@')[0];
      if (!validEmail(email)) return send(res, 400, { error: 'Enter a valid email.' });
      const temp = b.password ? String(b.password) : randomPassword(12);
      if (!validPassword(temp)) return send(res, 400, { error: 'Password must be at least 8 characters.' });
      const role = b.role === 'admin' ? 'admin' : 'user';
      try {
        const r = await users.insertOne({ email, name, role, passHash: hashPassword(temp), disabled: false, sv: 1, createdAt: new Date(), lastLoginAt: null });
        await audit(d, admin, 'user.create', { _id: r.insertedId, email }, { role });
        return send(res, 200, { ok: true, id: String(r.insertedId), email, tempPassword: temp });
      } catch (e) {
        if (e && e.code === 11000) return send(res, 409, { error: 'A user with that email already exists.' });
        throw e;
      }
    }

    const id = oid(b.id);
    const target = id ? await users.findOne({ _id: id }) : null;
    if (!target) return send(res, 404, { error: 'user not found' });
    const isSelf = String(target._id) === String(admin._id);
    const otherAdmins = await users.countDocuments({ role: 'admin', disabled: { $ne: true }, _id: { $ne: target._id } });

    if (action === 'update') {
      const set = {};
      if (typeof b.name === 'string') set.name = cleanName(b.name) || target.name;
      if (typeof b.email === 'string') {
        const e = cleanEmail(b.email);
        if (!validEmail(e)) return send(res, 400, { error: 'Enter a valid email.' });
        set.email = e;
      }
      if (b.role === 'admin' || b.role === 'user') {
        if (b.role !== target.role && target.role === 'admin' && !otherAdmins) return send(res, 400, { error: 'There must be at least one admin.' });
        if (b.role !== target.role && isSelf) return send(res, 400, { error: 'You cannot change your own role.' });
        set.role = b.role;
      }
      if (typeof b.disabled === 'boolean') {
        if (b.disabled && isSelf) return send(res, 400, { error: 'You cannot disable your own account.' });
        if (b.disabled && target.role === 'admin' && !otherAdmins) return send(res, 400, { error: 'There must be at least one active admin.' });
        set.disabled = b.disabled;
      }
      if (!Object.keys(set).length) return send(res, 400, { error: 'nothing to update' });
      const inc = (set.disabled || set.role) ? { sv: 1 } : undefined;   // signs the user out of every device
      try { await users.updateOne({ _id: target._id }, inc ? { $set: set, $inc: inc } : { $set: set }); }
      catch (e) { if (e && e.code === 11000) return send(res, 409, { error: 'That email is already used.' }); throw e; }
      await audit(d, admin, 'user.update', target, set);
      return send(res, 200, { ok: true });
    }

    if (action === 'reset') {
      const temp = b.password ? String(b.password) : randomPassword(12);
      if (!validPassword(temp)) return send(res, 400, { error: 'Password must be at least 8 characters.' });
      await users.updateOne({ _id: target._id }, { $set: { passHash: hashPassword(temp) }, $inc: { sv: 1 } });
      await audit(d, admin, 'user.reset-password', target);
      if (isSelf) {
        const me = await users.findOne({ _id: admin._id });
        res.setHeader('Set-Cookie', sessionCookie(req, signToken({ u: String(me._id), sv: me.sv }, MONTH), MONTH));
      }
      return send(res, 200, { ok: true, tempPassword: temp });
    }

    if (action === 'delete') {
      if (isSelf) return send(res, 400, { error: 'You cannot delete your own account.' });
      if (target.role === 'admin' && !otherAdmins) return send(res, 400, { error: 'There must be at least one admin.' });
      if (cleanEmail(b.confirm) !== target.email) return send(res, 400, { error: 'Type the user\'s email to confirm.' });
      await users.deleteOne({ _id: target._id });
      await d.collection('progress').deleteOne({ _id: String(target._id) });
      await audit(d, admin, 'user.delete', target);
      return send(res, 200, { ok: true });
    }

    if (action === 'impersonate') {
      if (isSelf) return send(res, 400, { error: 'You are already you.' });
      if (target.role === 'admin') return send(res, 400, { error: 'You cannot view as another admin.' });
      if (target.disabled) return send(res, 400, { error: 'This account is disabled.' });
      await audit(d, admin, 'impersonate.start', target);
      res.setHeader('Set-Cookie', sessionCookie(req, signToken({ u: String(admin._id), sv: admin.sv, imp: String(target._id) }, IMP_TTL), IMP_TTL));
      return send(res, 200, { ok: true });
    }

    return send(res, 404, { error: 'unknown action' });
  } catch (e) {
    console.error('admin error:', e && e.message);
    return send(res, 500, { error: 'server error' });
  }
};
