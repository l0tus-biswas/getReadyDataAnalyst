/* Local server: serves the site and runs the /api functions exactly as Vercel would.
   Usage:  npm run dev      then open http://localhost:3000
   Reads settings from .env (MONGODB_URI, SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD). */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = path.join(__dirname, '..');
// tiny .env reader (values already in the environment win)
try {
  fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split(/\r?\n/).forEach((l) => {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !l.trim().startsWith('#') && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  });
} catch (e) { /* no .env: rely on real environment variables */ }

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const HIDDEN = /^\/(api|node_modules|tools|\.git)(\/|$)|\/\.(?!well-known)/;

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = []; let size = 0;
    req.on('data', (c) => { size += c.length; if (size < 2e6) chunks.push(c); });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      try { resolve((req.headers['content-type'] || '').includes('json') && raw ? JSON.parse(raw) : raw); } catch (e) { resolve({}); }
    });
  });
}

async function api(req, res, u) {
  const name = u.pathname.replace(/^\/api\//, '').replace(/[^a-z0-9-]/gi, '');
  const file = path.join(ROOT, 'api', name + '.js');
  if (!name || !fs.existsSync(file)) { res.statusCode = 404; return res.end('{"error":"not found"}'); }
  req.query = u.query;
  req.body = req.method === 'GET' ? undefined : await readBody(req);
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (o) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(o)); };
  await require(file)(req, res);
}

const server = http.createServer(async (req, res) => {
  const u = url.parse(req.url, true);
  try {
    if (u.pathname.startsWith('/api/')) return await api(req, res, u);
    let p = decodeURIComponent(u.pathname);
    if (p.endsWith('/')) p += 'index.html';
    if (HIDDEN.test(p)) { res.statusCode = 404; return res.end('Not found'); }
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.statusCode = 404; return res.end('Not found'); }
    res.setHeader('Content-Type', TYPES[path.extname(file)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    fs.createReadStream(file).pipe(res);
  } catch (e) {
    console.error(e);
    res.statusCode = 500; res.end('Server error');
  }
});

const port = process.env.PORT || 3000;
if (require.main === module) server.listen(port, () => console.log(`Dev server: http://localhost:${port}`));
module.exports = { server };
