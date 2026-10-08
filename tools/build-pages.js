/* Generates every HTML page and the offline service worker.
   Run after adding a page or script:   node tools/build-pages.js
   (Pages share one template, so edit this file, not the .html files.) */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const w = (f, s) => fs.writeFileSync(path.join(ROOT, f), s);

// scripts every page loads, in order
const CORE = ['data-plan', 'data-topics', 'data-projects', 'data-qa', 'qa-sql', 'qa-pbi-excel', 'qa-py-stats', 'qa-biz-survey-hr',
  'data-misc', 'core', 'app', 'ux', 'sr', 'notes', 'timer', 'auth'];
const QK = ['sql', 'pbi', 'excel', 'py', 'stats', 'biz', 'survey', 'hr'];
const ALL_GUIDES = Array.from({ length: 12 }, (_, i) => 'guide-w' + (i + 1));

// [file, title, extra scripts, boot call, current-page id]
const PAGES = [
  ['index', 'Dashboard', ['page-dashboard'], 'pageDashboard'],
  ['plan', '12-Week Plan', ['page-plan'], 'pagePlan'],
  ['review', 'Review', [], 'pageReview'],
  ['mock', 'Mock Interview', ['mock'], 'pageMock'],
  ['topics', 'Topics & Skills', ['page-topics'], 'pageTopics'],
  ['interview', 'Interview Prep Hub', ['page-interview'], 'pageQAHub'],
  ['progress', 'My Progress', ['progress'], 'pageProgress'],
  ['checkin', 'Weekly Check-in', ['checkin'], 'pageCheckin'],
  ['notes', 'Notes', [], 'pageNotes'],
  ['search', 'Search', ['guides-init', ...ALL_GUIDES, 'search'], 'pageSearch'],
  ['sql-lab', 'SQL Lab', ['page-sqllab'], 'pageSqlLab'],
  ['projects', 'Projects', ['page-projects'], 'pageProjects'],
  ['jobs', 'Job Hunt', ['page-jobs'], 'pageJobs'],
  ['resources', 'Resources', ['page-resources'], 'pageRes'],
  ['settings', 'Settings', ['page-settings'], 'pageSettings'],
  ['profile', 'Profile', ['page-profile', 'progress'], 'pageProfile'],
  ['admin', 'Admin panel', ['page-admin'], 'pageAdmin'],
];

const head = (title) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title} · Data Analyst Quest</title>
<meta name="theme-color" content="#4f46e5">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="DA Quest">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/features.css">
</head>
<body>
<a class="skip" href="#view">Skip to content</a>
<div class="app">
<aside id="side"></aside>
<main>
  <div class="top">
    <button class="ib" id="burger" data-act="nav-toggle" aria-label="Menu">☰</button>
    <div id="chrome" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"></div>
    <div class="sp"></div>
    <form class="topsearch" action="search.html" method="get" role="search"><input id="topsearch" name="q" type="search" placeholder="Search ( / )" aria-label="Search"></form>
    <button class="ib" data-act="theme" aria-label="Toggle theme">🌓</button>
    <a class="avatar" id="avatar" href="profile.html" aria-label="Your profile" hidden></a>
  </div>
  <div id="view"><p class="sm" style="padding:20px">Loading…</p></div>
</main>
</div>
`;
const tail = (extra, boot, pre = '') =>
  pre + [...CORE, ...extra].map((s) => `<script src="js/${s}.js"></script>`).join('\n') + `\n<script>${boot}</script>\n</body>\n</html>\n`;

const files = [];
PAGES.forEach(([f, title, extra, fn]) => {
  const pre = f === 'sql-lab' ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js"></script>\n' : '';
  const boot = f === 'sql-lab' ? `boot('${f}',${fn}).then(()=>initSqlLab());` : f === 'admin' ? `boot('${f}',${fn}).then(adminLoad);` : `boot('${f}',${fn});`;
  w(f + '.html', head(title) + tail(extra, boot, pre));
  files.push(f + '.html');
});
QK.forEach((k) => {
  w(`qa-${k}.html`, head('Interview Q&A: ' + k.toUpperCase()) + tail(['page-qa'], `boot('qa-${k}',()=>pageQA('${k}'));`));
  files.push(`qa-${k}.html`);
});
for (let n = 1; n <= 12; n++) {
  w(`week-${n}.html`, head(`Week ${n} Guide`) + tail(['guides-init', `guide-w${n}`, 'page-week'], `boot('week-${n}',()=>pageWeek(${n}));`));
  files.push(`week-${n}.html`);
}

// ---------- sign-in page (no app shell) ----------
w('login.html', `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Sign in · Data Analyst Quest</title>
<meta name="theme-color" content="#4f46e5">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/features.css">
</head>
<body class="login-body">
<main class="login-card">
  <div class="login-logo" aria-hidden="true">🎯</div>
  <h1>Get Ready, Data Analyst</h1>
  <p class="sm">Sign in to continue your 12-week plan.</p>
  <form id="lf" novalidate>
    <label>Email<input id="email" type="email" autocomplete="username" inputmode="email" autocapitalize="none" spellcheck="false" required></label>
    <label>Password<span class="pw"><input id="pw" type="password" autocomplete="current-password" required><button type="button" id="show" aria-label="Show password">👁</button></span></label>
    <div id="err" role="alert" aria-live="polite"></div>
    <button class="btn" id="go" type="submit">Sign in</button>
  </form>
  <p id="local" class="sm"></p>
  <p class="sm login-foot">Need an account or a new password? Ask your admin.</p>
</main>
<script src="js/login.js"></script>
</body>
</html>
`);
files.push('login.html');

// ---------- offline service worker ----------
const assets = [
  './', ...files, 'manifest.webmanifest', 'css/style.css', 'css/features.css',
  ...fs.readdirSync(path.join(ROOT, 'js')).filter((f) => f.endsWith('.js')).map((f) => 'js/' + f),
  ...fs.readdirSync(path.join(ROOT, 'icons')).map((f) => 'icons/' + f),
];
const stamp = Date.now().toString(36);
w('sw.js', `/* Generated by tools/build-pages.js. Offline support: pages and scripts are cached;
   when online the network copy is used first, so updates always arrive. */
const CACHE = 'daq-${stamp}';
const ASSETS = ${JSON.stringify(assets, null, 1)};
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE && k !== 'daq-cdn').map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.pathname.startsWith('/api/')) return;   // accounts and progress always go to the network
  if (url.origin === location.origin) {
    // same site: network first (4 s limit), fall back to the cache when offline
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const ctl = new AbortController();
        const t = setTimeout(() => ctl.abort(), 4000);
        const res = await fetch(req, { signal: ctl.signal });
        clearTimeout(t);
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      } catch (err) {
        const hit = await cache.match(req, { ignoreSearch: true });
        if (hit) return hit;
        if (req.mode === 'navigate') return (await cache.match('index.html')) || Response.error();
        return Response.error();
      }
    })());
  } else if (url.hostname === 'cdnjs.cloudflare.com') {
    // SQL Lab engine: cache after first use so the lab works offline
    e.respondWith(caches.open('daq-cdn').then(async (c) => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone());
      return res;
    }));
  }
});
`);
console.log(`built ${files.length} pages and sw.js (${assets.length} cached files)`);
