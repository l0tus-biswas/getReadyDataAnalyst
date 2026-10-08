/* Admin panel: manage users, view as a user (read-only), activity log. Only admins can load data here. */
const ADM={tab:'users',users:null,audit:null,q:'',msg:null,temp:null,busy:false};
const fmtWhen=(d)=>d?new Date(d).toLocaleString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):'never';
const ACT_TEXT={'user.create':'created user','user.update':'edited user','user.reset-password':'reset password for','user.delete':'deleted user','impersonate.start':'started viewing as','impersonate.stop':'stopped viewing as'};

async function adminLoad(){
  if(typeof AUTH==='undefined'||!AUTH.admin||READONLY||AUTH.mode!=='user')return;
  ADM.busy=true;render();
  try{
    const [u,a]=await Promise.all([api('/api/admin?action=users'),api('/api/admin?action=audit')]);
    if(u.status===401){goLogin();return}
    if(u.status!==200)throw new Error((u.json&&u.json.error)||'Could not load users');
    ADM.users=u.json.users;ADM.audit=a.json&&a.json.audit||[];ADM.msg=null;
  }catch(e){ADM.msg={t:'err',text:e.message}}
  ADM.busy=false;render();
}
async function adminCall(action,body,okText){
  try{
    const r=await api('/api/admin?action='+action,{method:'POST',body:JSON.stringify(body||{})});
    if(r.status===401){goLogin();return null}
    if(r.status>=400){ADM.msg={t:'err',text:(r.json&&r.json.error)||'Request failed'};render();return null}
    if(okText)ADM.msg={t:'ok',text:okText};
    return r.json;
  }catch(e){ADM.msg={t:'err',text:'Network problem: '+e.message};render();return null}
}

function userRow(u,me){
  const s=u.summary,self=u.id===me.id,hay=(u.name+' '+u.email+' '+u.role).toLowerCase();
  const hidden=ADM.q&&!hay.includes(ADM.q.toLowerCase());
  const prog=s?`<div class="bar" style="width:90px"><i style="width:${s.ready}%"></i></div><span class="sm">${s.ready}% · ${s.xp} XP · 🔥${s.streak} · ${s.min7} min/7d · wk ${s.week||'-'}</span>`:'<span class="sm">no activity yet</span>';
  return `<tr class="${hidden?'hide':''}" data-s="${esc(hay)}">
    <td><b>${esc(u.name)}</b><div class="sm">${esc(u.email)}</div></td>
    <td><span class="lvl ${u.role==='admin'?'lvl-M':'lvl-E'}">${u.role==='admin'?'Admin':'Learner'}</span> ${u.disabled?'<span class="lvl lvl-H">Disabled</span>':''}</td>
    <td class="sm">${fmtWhen(u.lastLoginAt)}<br>${s&&s.lastActive?'active '+esc(s.lastActive):''}</td>
    <td>${prog}</td>
    <td class="adm-actions">
      ${!self&&u.role!=='admin'&&!u.disabled?`<button class="chip" data-act="adm-view:${u.id}" title="See the app exactly as this user sees it. Read-only; nothing is recorded.">👁 View as</button>`:''}
      <button class="chip" data-act="adm-edit:${u.id}">✏️ Edit</button>
      <button class="chip" data-act="adm-reset:${u.id}">🔑 Password</button>
      ${self?'':`<button class="chip" data-act="adm-role:${u.id}">${u.role==='admin'?'⬇ Make learner':'⬆ Make admin'}</button>
      <button class="chip" data-act="adm-toggle:${u.id}">${u.disabled?'▶ Enable':'⏸ Disable'}</button>
      <button class="chip" data-act="adm-del:${u.id}">🗑 Delete</button>`}
    </td></tr>`;
}

function pageAdmin(){
  let h=`<h2>🛠️ Admin panel</h2>`;
  if(typeof AUTH==='undefined'||AUTH.mode!=='user')return h+`<div class="note">The admin panel needs the server and a signed-in admin. Run <code>npm run dev</code> or use the deployed site.</div>`;
  if(READONLY)return h+`<div class="note">You are viewing as another user. Exit that view to manage users. <button class="btn" data-act="imp-exit">Exit view</button></div>`;
  if(!AUTH.admin)return h+`<div class="note">This page is for admins only.</div>`;
  const me=AUTH.admin,us=ADM.users||[];
  const week=new Date(Date.now()-7*864e5).toISOString().slice(0,10);
  const active=us.filter(u=>u.summary&&u.summary.lastActive>=week).length;
  h+=`<p class="lead">Create accounts, reset passwords, and look at the app exactly as a user sees it. Viewing as a user is read-only: nothing is saved and nothing is recorded for them.</p>`;
  if(ADM.msg)h+=`<div class="note" style="border-left-color:var(--${ADM.msg.t==='ok'?'ok':'bad'})">${esc(ADM.msg.text)}</div>`;
  if(ADM.temp)h+=`<div class="card tempcard"><b>🔑 Temporary password for ${esc(ADM.temp.email)}</b><div class="temp-pw" id="tempPw">${esc(ADM.temp.pw)}</div>
    <div class="qa-actions" style="margin:6px 0 0"><button class="btn" data-act="adm-copy">Copy</button><button class="btn ghost" data-act="adm-hide-temp">Hide</button></div>
    <p class="sm" style="margin-bottom:0">Shown only once. Share it securely. Users cannot change their own password, so use <b>🔑 Password</b> any time to set a new one.</p></div>`;
  h+=`<div class="grid g4" style="margin-bottom:12px"><div class="card stat" style="margin:0"><b>${us.length}</b><span>users</span></div><div class="card stat" style="margin:0"><b>${active}</b><span>active this week</span></div><div class="card stat" style="margin:0"><b>${us.filter(u=>u.disabled).length}</b><span>disabled</span></div><div class="card stat" style="margin:0"><b>${us.filter(u=>u.summary).length?Math.round(us.filter(u=>u.summary).reduce((s,u)=>s+u.summary.ready,0)/us.filter(u=>u.summary).length):0}%</b><span>average readiness</span></div></div>
  <div class="chips"><button class="chip ${ADM.tab==='users'?'on':''}" data-act="adm-tab:users">👥 Users</button><button class="chip ${ADM.tab==='audit'?'on':''}" data-act="adm-tab:audit">📜 Activity log</button><button class="chip" data-act="adm-refresh">↻ Refresh</button></div>`;
  if(ADM.busy&&!ADM.users)return h+`<p class="sm">Loading…</p>`;
  if(ADM.tab==='users'){
    h+=`<div class="card"><h3 style="margin-top:0">➕ Add a user</h3>
    <div class="adm-form"><input type="text" id="adm_name" placeholder="Full name" autocomplete="off"><input type="text" id="adm_email" placeholder="Email (used to sign in)" autocomplete="off"><input type="text" id="adm_pw" placeholder="Password (empty = generate one)" autocomplete="off"><select id="adm_role"><option value="user">Learner</option><option value="admin">Admin</option></select><button class="btn" data-act="adm-create">Create user</button></div></div>
    <div class="card"><div class="qa-actions" style="margin:0 0 8px"><input type="text" id="adm_q" placeholder="Search users…" value="${esc(ADM.q)}" style="flex:1;min-width:180px"></div>
    <div style="overflow:auto"><table class="adm-table"><tr><th>User</th><th>Role</th><th>Last sign-in</th><th>Progress</th><th>Actions</th></tr>${us.map(u=>userRow(u,me)).join('')||'<tr><td colspan="5" class="sm">No users yet.</td></tr>'}</table></div></div>`;
  }else{
    h+=`<div class="card"><h3 style="margin-top:0">Activity log</h3><p class="sm">Admin actions and every "view as user" session. This is a record of what admins did, not of what learners did.</p><div style="overflow:auto"><table><tr><th>When</th><th>Admin</th><th>Action</th><th>User</th></tr>
    ${(ADM.audit||[]).map(a=>`<tr><td class="sm">${fmtWhen(a.ts)}</td><td>${esc(a.actor?a.actor.email:'')}</td><td>${esc(ACT_TEXT[a.action]||a.action)}</td><td>${esc(a.target?a.target.email:'')}</td></tr>`).join('')||'<tr><td colspan="4" class="sm">Nothing yet.</td></tr>'}</table></div></div>`;
  }
  return h;
}

document.addEventListener('input',e=>{
  if(e.target.id!=='adm_q')return;
  ADM.q=e.target.value;const q=ADM.q.trim().toLowerCase();
  document.querySelectorAll('.adm-table tr[data-s]').forEach(r=>r.classList.toggle('hide',!!q&&!r.dataset.s.includes(q)));
});
document.addEventListener('click',async e=>{
  const b=e.target.closest&&e.target.closest('[data-act^="adm-"]');if(!b)return;
  const [a,arg]=b.dataset.act.split(/:(.*)/s);
  const u=(ADM.users||[]).find(x=>x.id===arg);
  if(a==='adm-tab'){ADM.tab=arg;render()}
  else if(a==='adm-refresh')adminLoad();
  else if(a==='adm-hide-temp'){ADM.temp=null;render()}
  else if(a==='adm-copy'){try{await navigator.clipboard.writeText(ADM.temp.pw);toast('Copied')}catch(x){toast('Select the password and copy it')}}
  else if(a==='adm-create'){
    const v=id=>(document.getElementById(id)||{}).value||'';
    const r=await adminCall('create',{name:v('adm_name'),email:v('adm_email'),password:v('adm_pw'),role:v('adm_role')},'User created.');
    if(r){ADM.temp={email:r.email,pw:r.tempPassword};await adminLoad()}
  }else if(a==='adm-view'&&u){
    if(confirm('View the app as '+u.name+'?\n\nThis is read-only. Nothing is saved or recorded for them. The start and end of the session are noted in the activity log.')){
      const r=await adminCall('impersonate',{id:u.id});if(r)location.href='index.html';
    }
  }else if(a==='adm-edit'&&u){
    const name=prompt('Name',u.name);if(name===null)return;
    const email=prompt('Email (used to sign in)',u.email);if(email===null)return;
    if(await adminCall('update',{id:u.id,name,email},'User updated.'))adminLoad();
  }else if(a==='adm-reset'&&u){
    const pw=prompt('New password for '+u.name+'.\nLeave empty to generate one. Minimum 8 characters.\nThis signs them out of all devices.','');if(pw===null)return;
    const r=await adminCall('reset',{id:u.id,password:pw.trim()||undefined},'Password reset.');
    if(r){ADM.temp={email:u.email,pw:r.tempPassword};adminLoad()}
  }else if(a==='adm-role'&&u){
    const to=u.role==='admin'?'user':'admin';
    if(confirm('Make '+u.name+' a '+(to==='admin'?'admin (full access to this panel)':'regular learner')+'? They will be signed out and need to sign in again.')&&await adminCall('update',{id:u.id,role:to},'Role changed.'))adminLoad();
  }else if(a==='adm-toggle'&&u){
    if(confirm((u.disabled?'Enable ':'Disable ')+u.name+'?'+(u.disabled?'':' They will be signed out everywhere and cannot sign in until enabled.'))&&await adminCall('update',{id:u.id,disabled:!u.disabled},u.disabled?'User enabled.':'User disabled.'))adminLoad();
  }else if(a==='adm-del'&&u){
    const t=prompt('This permanently deletes '+u.name+' and all their progress. There is no undo.\n\nType their email to confirm:\n'+u.email,'');if(t===null)return;
    if(await adminCall('delete',{id:u.id,confirm:t},'User deleted.'))adminLoad();
  }
});
