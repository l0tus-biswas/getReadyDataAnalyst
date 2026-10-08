/* Vercel serverless function: saves and loads your progress in MongoDB.
 *
 * Environment variables (set them in Vercel, never in the repo):
 *   MONGODB_URI          MongoDB Atlas connection string (includes the database name)
 *   SYNC_KEY             a passphrase you choose; the browser sends it as the x-sync-key header
 *   PROGRESS_COLLECTION  optional, defaults to "progress"
 *
 * GET  /api/progress  -> { state, updatedAt }
 * PUT  /api/progress  -> body { state, updatedAt }; stored only if not older than what is saved
 */
const { MongoClient } = require('mongodb');
const crypto = require('crypto');

const MAX_BYTES = 1000000;

function getClient() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
  if (!global._daqMongo) {
    global._daqMongo = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
      .connect()
      .catch((e) => { global._daqMongo = null; throw e; });
  }
  return global._daqMongo;
}

function authorised(req) {
  const key = process.env.SYNC_KEY;
  const got = req.headers['x-sync-key'];
  if (!key || !got) return false;
  const h = (s) => crypto.createHash('sha256').update(String(s)).digest();
  return crypto.timingSafeEqual(h(got), h(key));
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET' && req.method !== 'PUT') {
    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ error: 'method not allowed' });
  }
  if (!authorised(req)) return res.status(401).json({ error: 'unauthorised' });

  try {
    const coll = (await getClient()).db().collection(process.env.PROGRESS_COLLECTION || 'progress');

    if (req.method === 'GET') {
      const doc = await coll.findOne({ _id: 'default' });
      return res.status(200).json({ state: doc ? doc.state : null, updatedAt: doc ? doc.updatedAt : 0 });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const state = body.state;
    if (!state || typeof state !== 'object' || Array.isArray(state)) {
      return res.status(400).json({ error: 'state must be an object' });
    }
    if (JSON.stringify(state).length > MAX_BYTES) return res.status(413).json({ error: 'state too large' });
    const updatedAt = Number(body.updatedAt) || Date.now();

    try {
      // the filter makes sure an older copy never overwrites a newer one
      await coll.updateOne(
        { _id: 'default', updatedAt: { $lte: updatedAt } },
        { $set: { state, updatedAt } },
        { upsert: true }
      );
      return res.status(200).json({ ok: true, updatedAt });
    } catch (e) {
      if (e && e.code === 11000) {
        const doc = await coll.findOne({ _id: 'default' });
        return res.status(409).json({ conflict: true, state: doc.state, updatedAt: doc.updatedAt });
      }
      throw e;
    }
  } catch (e) {
    console.error('progress api error:', e && e.message);
    return res.status(500).json({ error: 'server error' });
  }
};
