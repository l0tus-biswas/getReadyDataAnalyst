/* MongoDB connection (cached between serverless invocations), indexes, admin bootstrap and audit log. */
const { MongoClient } = require('mongodb');
const { hashPassword, cleanEmail, validEmail } = require('./security');

function client() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
  if (!global._daqMongo) {
    global._daqMongo = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
      .connect().catch((e) => { global._daqMongo = null; throw e; });
  }
  return global._daqMongo;
}

async function db() {
  const c = await client();
  const d = process.env.MONGODB_DB ? c.db(process.env.MONGODB_DB) : c.db();
  if (!global._daqReady || global._daqReady.name !== d.databaseName) {
    global._daqReady = { name: d.databaseName, p: prepare(d) };
  }
  await global._daqReady.p;
  return d;
}

async function prepare(d) {
  await Promise.all([
    d.collection('users').createIndex({ email: 1 }, { unique: true }),
    d.collection('loginAttempts').createIndex({ at: 1 }, { expireAfterSeconds: 900 }),
    d.collection('audit').createIndex({ ts: -1 }),
  ]);
  await ensureAdmin(d);
}

// Only when no admin exists yet: create one from ADMIN_EMAIL / ADMIN_PASSWORD.
async function ensureAdmin(d) {
  const users = d.collection('users');
  if (await users.findOne({ role: 'admin' })) return;
  const email = cleanEmail(process.env.ADMIN_EMAIL), pw = process.env.ADMIN_PASSWORD;
  if (!validEmail(email) || !pw || pw.length < 8) return;
  try {
    await users.insertOne({ email, name: 'Admin', role: 'admin', passHash: hashPassword(pw), disabled: false, sv: 1, createdAt: new Date(), lastLoginAt: null });
  } catch (e) { if (!e || e.code !== 11000) throw e; }
}

async function audit(d, actor, action, target, meta) {
  await d.collection('audit').insertOne({
    ts: new Date(),
    actor: actor ? { id: String(actor._id), email: actor.email } : null,
    action,
    target: target ? { id: String(target._id), email: target.email } : null,
    meta: meta || null,
  });
}

module.exports = { db, audit };
