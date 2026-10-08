/* Accounts: sign-in gate, per-user cloud progress, and the read-only "view as user" mode for admins.
   Opened straight from a file (no server) the site still works in local-only mode, as before. */
var READONLY=false;
var AUTH={mode:'local',user:null,admin:null,impersonating:false,sync:'idle',msg:''};
const SERVER=location.protocol==='http:'||location.protocol==='https:';
const HINT_KEY='daq-hint';

async function api(path,opts){
  const r=await fetch(path,Object.assign({credentials:'same-origin',headers:{'Content-Type':'application/json','X-Requested-With':'daq'}},opts||{}));
  let json=null;try{json=await r.json()}catch(e){}
  return {status:r.status,json};
}
const goLogin=()=>{const here=location.pathname.split('/').pop()||'index.html';location.replace('login.html?next='+encodeURIComponent(here+location.hash))};

/* ---------- per-user local copy ---------- */
function replaceState(obj){
  Object.keys(S).forEach(k=>delete S[k]);
  Object.assign(S,defaultState(),obj||{});
  if(!S.start)S.start=todayS();
  S.startExact=true;
}
function switchUser(uid){
  try{localStorage.setItem('daq-uid',uid)}catch(e){}
  const nk=LEGACY_KEY+':'+uid;
  if(KEY===nk)return;
  KEY=nk;
  let raw=null;try{raw=localStorage.getItem(KEY)}catch(e){}
  try{replaceState(raw?JSON.parse(raw):null)}catch(e){replaceState(null)}
  LASTSAVED=raw||'';
}

/* ---------- sync with the account ---------- */
const summary=()=>{
  const c=calc();let min7=0,last='';
  for(let i=0;i<7;i++){const a=S.act[inDays(-i)];if(a)min7+=(a.sec||0)/60}
  Object.keys(S.act).forEach(d=>{if(((S.act[d]||{}).sec||0)>0&&d>last)last=d});
  const idx=dayIdx();
  return {ready:Math.round(c.ready*100),xp:c.xp,streak:streak(),min7:Math.round(min7),week:idx<0?0:Math.min(13,Math.floor(idx/7)+1),lastActive:last};
};
function applyRemote(state,t,persist){
  replaceState(state);S._t=t;
  if(persist!==false&&!READONLY){try{LASTSAVED=JSON.stringify(S);localStorage.setItem(KEY,LASTSAVED)}catch(e){}}
  if(typeof render==='function'&&PAGE)render();
}
function setSync(st,msg){AUTH.sync=st;AUTH.msg=msg||'';if(typeof renderChrome==='function'&&PAGE)renderChrome()}
let SYNC_T=null,SYNC_DIRTY=false;
async function syncPush(){
  if(READONLY||!AUTH||AUTH.mode!=='user')return;
  const r=await api('/api/progress',{method:'PUT',body:JSON.stringify({state:S,updatedAt:S._t||Date.now(),summary:summary()})});
  if(r.status===409&&r.json&&r.json.state){applyRemote(r.json.state,r.json.updatedAt);SYNC_DIRTY=false;return}
  if(r.status===401){goLogin();return}
  if(r.status!==200)throw new Error('save failed ('+r.status+')');
  SYNC_DIRTY=false;
}
function syncSoon(){
  if(READONLY||!AUTH||AUTH.mode!=='user')return;
  SYNC_DIRTY=true;clearTimeout(SYNC_T);
  SYNC_T=setTimeout(async()=>{try{setSync('busy');await syncPush();setSync('ok')}catch(e){setSync('err','Will retry when you are online')}},1800);
}
window.addEventListener('online',()=>{if(SYNC_DIRTY)syncSoon()});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&SYNC_DIRTY&&AUTH.mode==='user')syncPush().catch(()=>{})});

async function syncPull(){
  const r=await api('/api/progress');
  if(r.status===401){goLogin();return false}
  if(r.status!==200)throw new Error('load failed ('+r.status+')');
  if(AUTH.impersonating){replaceState(r.json.state);S._t=r.json.updatedAt||0;return true}   // viewing: memory only
  const local=S._t||0;
  if(r.json.state&&r.json.updatedAt>local){replaceState(r.json.state);S._t=r.json.updatedAt;try{LASTSAVED=JSON.stringify(S);localStorage.setItem(KEY,LASTSAVED)}catch(e){}}
  else if(!r.json.state){
    // brand-new account: offer to bring over progress saved in this browser before accounts existed
    let legacy=null;try{legacy=JSON.parse(localStorage.getItem(LEGACY_KEY)||'null')}catch(e){}
    if(legacy&&legacy.done&&Object.keys(legacy.done).length&&Object.keys(S.done).length===0&&confirm('Bring the progress saved in this browser into your account?')){replaceState(legacy)}
    S._t=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
    await syncPush();
  }else if(local>r.json.updatedAt)await syncPush();
  return true;
}

/* ---------- start-up gate (called by boot) ---------- */
async function authInit(){
  if(!SERVER){AUTH.mode='local';return true}
  let r;
  try{r=await api('/api/auth?action=me')}
  catch(e){   // offline: carry on with the last signed-in account's saved copy
    let h=null;try{h=JSON.parse(localStorage.getItem(HINT_KEY)||'null')}catch(x){}
    if(h&&h.id){AUTH.mode='user';AUTH.user=h;switchUser(h.id);setSync('err','Offline. Changes are saved on this device and sync later.');SYNC_DIRTY=true;return true}
    document.getElementById('view').innerHTML='<div class="card"><h3>You are offline</h3><p>Connect once and sign in to use the app offline afterwards.</p></div>';return false;
  }
  if(r.status===401){goLogin();return false}
  if(r.status!==200){document.getElementById('view').innerHTML='<div class="card"><h3>Something went wrong</h3><p>The server returned '+r.status+'. Try again in a moment.</p></div>';return false}
  AUTH.mode='user';AUTH.user=r.json.user;AUTH.admin=r.json.admin;AUTH.impersonating=!!r.json.impersonating;
  if(AUTH.impersonating){
    READONLY=true;document.body.classList.add('ro');
    try{await syncPull()}catch(e){replaceState(null)}
    return true;
  }
  try{localStorage.setItem(HINT_KEY,JSON.stringify(AUTH.user))}catch(e){}
  switchUser(AUTH.user.id);
  try{await syncPull();setSync('ok')}catch(e){setSync('err','Offline. Changes are saved on this device and sync later.')}
  return true;
}

async function logout(){
  // push any unsaved change first, then freeze all saving so the page-hide save cannot re-create the local copy
  try{if(SYNC_DIRTY&&AUTH.mode==='user'&&!READONLY)await syncPush()}catch(e){}
  READONLY=true;
  try{await api('/api/auth?action=logout',{method:'POST'})}catch(e){}
  try{localStorage.removeItem(KEY);localStorage.removeItem('daq-uid');localStorage.removeItem(HINT_KEY)}catch(e){}
  location.replace('login.html');
}
async function exitImpersonation(){
  try{await api('/api/admin?action=stop-impersonate',{method:'POST'})}catch(e){}
  location.replace('admin.html');
}

/* ---------- impersonation: nothing may change, nothing is recorded ---------- */
const RO_OK=new Set(['nav-toggle','theme','goday','weekall','jump-cur','tag','tw','tn','qlvl','qst','qfreq','openall','tpanel','imp-exit','logout','ciweek','mock-hard-noop']);
function roToast(){toast('Read-only: you are viewing '+((AUTH.user&&AUTH.user.name)||'this user')+'. Nothing is saved or recorded.')}
function roBlock(e){e.stopImmediatePropagation();e.preventDefault();roToast();if(typeof render==='function'&&PAGE)render()}
document.addEventListener('click',e=>{
  const b=e.target.closest&&e.target.closest('[data-act]');
  if(b&&b.dataset.act==='logout'){e.stopImmediatePropagation();logout();return}
  if(b&&b.dataset.act==='imp-exit'){e.stopImmediatePropagation();exitImpersonation();return}
  if(!READONLY||!b)return;
  const a=b.dataset.act.split(/:(.*)/s)[0];
  if(!RO_OK.has(a)){e.stopImmediatePropagation();e.preventDefault();roToast()}
},true);
['change','input'].forEach(t=>document.addEventListener(t,e=>{
  if(!READONLY)return;
  const el=e.target;
  if(el.id==='topsearch'||el.id==='bigsearch'||el.id==='tsearch'||el.id==='qsearch')return;   // searching is harmless
  roBlock(e);
},true));
document.addEventListener('keydown',e=>{
  if(READONLY&&(e.key===' '||e.key==='1'||e.key==='2')&&typeof ui!=='undefined'&&ui.quiz){e.stopImmediatePropagation()}
},true);

function initials(name){
  const p=String(name||'?').trim().split(/\s+/).filter(Boolean);
  return ((p[0]||'?')[0]+(p.length>1?p[p.length-1][0]:'')).toUpperCase();
}
function impBar(){
  if(!READONLY)return '';
  return `<div class="impbar" id="impbar" role="status">👁 Viewing as <b>${esc(AUTH.user.name)}</b> <span class="hide-sm">(${esc(AUTH.user.email)})</span> · read-only · nothing is saved or recorded <button type="button" class="btn" data-act="imp-exit">Exit</button></div>`;
}
function userPill(){
  if(AUTH.mode!=='user'||!AUTH.user||READONLY||AUTH.sync!=='err')return '';
  return `<a class="pill" href="profile.html" title="${esc(AUTH.msg||'Not synced yet')}">⚠️ Not synced</a>`;
}
