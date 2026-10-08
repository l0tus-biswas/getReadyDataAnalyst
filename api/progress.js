/* /api/progress  (one document per user)
     GET  -> { state, updatedAt }   the signed-in user's progress. While an admin is impersonating,
                                    this returns the viewed user's progress and changes nothing.
     PUT  -> { state, updatedAt, summary }   stored only if not older than what is saved.
             Always refused with 403 while impersonating, so viewing a user can never alter or record anything. */
const { db } = require('./_lib/db');
const { getSession, csrfOk, send, body } = require('./_lib/guard');

const MAX_BYTES = 1000000;

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET' && req.method !== 'PUT') {
    res.setHeader('Allow', 'GET, PUT');
    return send(res, 405, { error: 'method not allowed' });
  }
  try {
    const d = await db();
    const s = await getSession(req, d);
    if (!s) return send(res, 401, { error: 'not signed in' });
    const coll = d.collection('progress');

    if (req.method === 'GET') {
      const doc = await coll.findOne({ _id: String(s.effective._id) });
      return send(res, 200, { state: doc ? doc.state : null, updatedAt: doc ? doc.updatedAt : 0, readOnly: !!s.imp });
    }

    if (!csrfOk(req)) return send(res, 403, { error: 'bad request origin' });
    if (s.imp) return send(res, 403, { error: 'Read-only while viewing as another user. Nothing is saved.' });
    const b = body(req);
    if (!b.state || typeof b.state !== 'object' || Array.isArray(b.state)) return send(res, 400, { error: 'state must be an object' });
    if (JSON.stringify(b.state).length > MAX_BYTES) return send(res, 413, { error: 'state too large' });
    const updatedAt = Number(b.updatedAt) || Date.now();
    const set = { state: b.state, updatedAt };
    if (b.summary && typeof b.summary === 'object') {   // only replace the admin-visible summary when one is sent
      const sm = b.summary;
      set.summary = {
        ready: Math.max(0, Math.min(100, Number(sm.ready) || 0)),
        xp: Math.max(0, Number(sm.xp) || 0),
        streak: Math.max(0, Number(sm.streak) || 0),
        min7: Math.max(0, Number(sm.min7) || 0),
        week: Math.max(0, Math.min(13, Number(sm.week) || 0)),
        lastActive: typeof sm.lastActive === 'string' ? sm.lastActive.slice(0, 10) : '',
      };
    }
    try {
      await coll.updateOne({ _id: String(s.user._id), updatedAt: { $lte: updatedAt } }, { $set: set }, { upsert: true });
      return send(res, 200, { ok: true, updatedAt });
    } catch (e) {
      if (e && e.code === 11000) {   // a newer copy is already saved (for example from another device)
        const doc = await coll.findOne({ _id: String(s.user._id) });
        return send(res, 409, { conflict: true, state: doc.state, updatedAt: doc.updatedAt });
      }
      throw e;
    }
  } catch (e) {
    console.error('progress error:', e && e.message);
    return send(res, 500, { error: 'server error' });
  }
};
