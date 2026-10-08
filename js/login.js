/* Sign-in page. Accounts are created by an admin; there is no sign-up and no password reset page. */
(function () {
  const dark = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  const $ = (id) => document.getElementById(id);
  const SERVER = location.protocol === 'http:' || location.protocol === 'https:';
  const safeNext = (n) => (/^[a-z0-9-]+\.html(#[\w:.-]*)?$/i.test(n || '') ? n : 'index.html');
  const next = safeNext(new URLSearchParams(location.search).get('next'));

  if (!SERVER) {
    $('lf').classList.add('hide');
    $('local').innerHTML = 'You opened this page directly from a file, so accounts are not available. You can still use the app on this device without an account, or run <code>npm run dev</code> / open the deployed site to sign in.<br><br><a class="btn" href="index.html" style="text-decoration:none;display:inline-block">Continue without an account</a>';
    return;
  }

  // already signed in? go straight on
  fetch('/api/auth?action=me', { credentials: 'same-origin' }).then((r) => { if (r.ok) location.replace(next); }).catch(() => {});

  $('show').addEventListener('click', () => {
    const p = $('pw'); const show = p.type === 'password';
    p.type = show ? 'text' : 'password';
    $('show').textContent = show ? '🙈' : '👁';
    $('show').setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });

  $('lf').addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = $('err'); err.textContent = '';
    const email = $('email').value.trim(), password = $('pw').value;
    if (!email || !password) { err.textContent = 'Enter your email and password.'; return; }
    const btn = $('go'); btn.disabled = true; btn.textContent = 'Signing in…';
    try {
      const r = await fetch('/api/auth?action=login', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'daq' },
        body: JSON.stringify({ email, password }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok) { location.replace(next); return; }
      err.textContent = j.error || 'Could not sign in. Try again.';
    } catch (x) {
      err.textContent = 'Cannot reach the server. Check your connection.';
    }
    btn.disabled = false; btn.textContent = 'Sign in';
  });
})();
