/* Profile page: who you are, your numbers, your badges, sign out. While an admin is viewing as a user it shows that user's profile, read-only. */
function avatarHtml(name,size){return `<span class="avatar-lg" style="width:${size}px;height:${size}px;font-size:${Math.round(size*.38)}px" aria-hidden="true">${esc(initials(name))}</span>`}

function pageProfile(){
  const u=(typeof AUTH!=='undefined'&&AUTH.mode==='user'&&AUTH.user)?AUTH.user:null;
  const c=calc(),L=LEVELS[level(c.ready)],ts=typeof timeStats==='function'?timeStats():{total:0,days:0};
  const earned=BADGES.filter(b=>S.badges[b[0]]);
  const idx=dayIdx(),wk=idx<0?0:Math.min(12,Math.floor(idx/7)+1);
  const since=u&&u.createdAt?new Date(u.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}):'';
  let h=`<h2>👤 Profile</h2>`;
  h+=`<div class="card hero profile-hero">${avatarHtml(u?u.name:'You',84)}
    <div style="flex:1;min-width:200px"><div class="big">${esc(u?u.name:'Local learner')}</div>
    <div style="opacity:.92">${u?esc(u.email):'Not signed in (local mode)'}</div>
    <div style="margin-top:6px"><span class="lvl lvl-E" style="background:rgba(255,255,255,.25);color:#fff">${u&&u.role==='admin'?'Admin':'Learner'}</span> <span style="opacity:.92">${L[2]} ${esc(L[1])}</span>${since?` <span style="opacity:.8">· member since ${since}</span>`:''}</div></div></div>
  <div class="grid g4" style="margin-bottom:12px">
    <div class="card stat" style="margin:0"><b>${pct(c.ready)}%</b><span>job ready</span>${bar(c.ready)}</div>
    <div class="card stat" style="margin:0"><b>⭐ ${c.xp}</b><span>XP</span></div>
    <div class="card stat" style="margin:0"><b>🔥 ${streak()}</b><span>day streak (best ${bestStreak()})</span></div>
    <div class="card stat" style="margin:0"><b>${fmtH(ts.total)}</b><span>active study time</span></div>
    <div class="card stat" style="margin:0"><b>${wk?`Week ${wk}`:'Not started'}</b><span>${idx>=0&&idx<84?`Day ${idx+1} of 84`:idx>=84?'plan finished':'plan not started'}</span></div>
    <div class="card stat" style="margin:0"><b>${c.k.q.d}/${c.k.q.t}</b><span>questions prepared</span></div>
    <div class="card stat" style="margin:0"><b>${S.mocks.length}</b><span>mock interviews</span></div>
    <div class="card stat" style="margin:0"><b>${earned.length}/${BADGES.length}</b><span>badges</span></div>
  </div>
  <div class="card"><h3 style="margin-top:0">🏅 Badges earned</h3>${earned.length?`<div class="grid g4">${earned.map(b=>`<div class="badge got"><b>${b[1]}</b><span>${esc(b[2])}</span><small>${esc(b[3])}</small></div>`).join('')}</div>`:'<p class="sm">None yet. Finish a task to earn your first badge.</p>'}</div>
  <div class="card"><h3 style="margin-top:0">⚙️ Account</h3>
    <p class="sm">Plan start: <b>${dayDate(1,0)}</b> · Daily goal: <b>${S.goal||60} min</b> · <a href="settings.html">Change in Settings</a></p>
    ${u?`<p class="sm">Your progress is saved to your account, so it follows you to any device. Passwords are managed by your admin: to get a new one, ask them.</p>`:`<p class="sm">You are using the app without an account, so progress is saved only in this browser. <a href="login.html">Sign in</a></p>`}
    <div class="qa-actions" style="margin:0">${u&&!READONLY?'<button class="btn ghost" data-act="logout">Sign out</button>':''}${u&&AUTH.admin&&!READONLY?'<a class="btn" href="admin.html" style="text-decoration:none">🛠️ Admin panel</a>':''}${READONLY?'<button class="btn" data-act="imp-exit">Exit view</button>':''}</div></div>`;
  return h;
}
