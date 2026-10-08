/* Optional cloud sync: saves your progress to MongoDB through /api/progress (Vercel).
   Works only on the deployed site (https). Opened from a file, the site stays local-only.
   Rule: the newest copy wins (compared by timestamp). Your sync passphrase is kept in this browser only. */
var SYNC={key:'',status:'off',msg:'',timer:null,last:0};   // var: save() may run before this file loads
try{SYNC.key=localStorage.getItem('da-quest-key')||''}catch(e){}
const syncOnline=()=>location.protocol==='http:'||location.protocol==='https:';

function syncBadge(){
  const m={ok:'☁️ synced',busy:'☁️ syncing…',bad:'🔒 wrong key',err:'⚠️ sync offline',local:'💾 local only'}[SYNC.status];
  return m?`<span class="pill" title="${esc(SYNC.msg||'')}">${m}</span>`:'';
}
function syncSet(status,msg){SYNC.status=status;SYNC.msg=msg||'';if(typeof renderChrome==='function')renderChrome();const el=document.getElementById('syncstat');if(el)el.innerHTML=syncText()}
function syncText(){
  if(!syncOnline())return '💾 You opened this from a file, so cloud sync is off. It works on the deployed website.';
  if(!SYNC.key)return 'Not connected. Progress is saved only in this browser.';
  return {ok:'✅ Connected. Progress is saved to your cloud database.',busy:'Syncing…',bad:'🔒 The server rejected this key. Check the passphrase.',err:'⚠️ Could not reach the server. Your progress is still saved in this browser and will sync later.'}[SYNC.status]||'Connected.';
}
async function syncReq(method,body){
  const r=await fetch('/api/progress',{method,headers:{'x-sync-key':SYNC.key,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});
  let j={};try{j=await r.json()}catch(e){}
  return {status:r.status,j};
}
function syncApply(state,t){
  Object.keys(S).forEach(k=>delete S[k]);Object.assign(S,state);S._t=t;
  try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
  if(typeof render==='function')render();
}
async function syncPush(){
  const t=S._t||Date.now();
  const {status,j}=await syncReq('PUT',{state:S,updatedAt:t});
  if(status===409&&j.state){syncApply(j.state,j.updatedAt);return}   // the cloud copy is newer
  if(status===401){syncSet('bad');return}
  if(status!==200)throw new Error('push failed '+status);
}
async function syncPull(){
  if(!SYNC.key||!syncOnline()){syncSet(syncOnline()?'off':'local');return}
  syncSet('busy');
  try{
    const {status,j}=await syncReq('GET');
    if(status===401){syncSet('bad');return}
    if(status!==200)throw new Error('pull failed '+status);
    const local=S._t||0;
    if(j.state&&j.updatedAt>local)syncApply(j.state,j.updatedAt);
    else if(!j.state||local>j.updatedAt)await syncPush();
    SYNC.last=Date.now();syncSet('ok');
  }catch(e){syncSet('err',e.message)}
}
function syncSoon(){
  if(!SYNC||!SYNC.key||!syncOnline())return;
  clearTimeout(SYNC.timer);
  SYNC.timer=setTimeout(async()=>{
    syncSet('busy');
    try{await syncPush();if(SYNC.status!=='bad')syncSet('ok')}catch(e){syncSet('err',e.message)}
  },1500);
}
async function syncConnect(key){
  if(!syncOnline()){toast('Cloud sync works on the deployed website, not from a file.');return}
  if(!key){toast('Enter your sync passphrase first.');return}
  SYNC.key=key;
  syncSet('busy');
  try{
    const {status,j}=await syncReq('GET');
    if(status===401){SYNC.key='';syncSet('bad');toast('Wrong passphrase.');return}
    if(status!==200)throw new Error('server '+status);
    try{localStorage.setItem('da-quest-key',key)}catch(e){}
    const hasLocal=Object.keys(S.done||{}).length>0;
    if(j.state&&hasLocal){
      if(confirm('Your cloud database already has saved progress, and this device has progress too.\n\nOK = use the CLOUD copy (this device is replaced)\nCancel = overwrite the cloud with THIS device'))syncApply(j.state,j.updatedAt);
      else{S._t=Date.now();await syncPush()}
    }else if(j.state)syncApply(j.state,j.updatedAt);
    else{S._t=Date.now();await syncPush()}
    syncSet('ok');toast('☁️ Connected');
  }catch(e){syncSet('err',e.message)}
}
function syncDisconnect(){SYNC.key='';try{localStorage.removeItem('da-quest-key')}catch(e){}syncSet('off');toast('Disconnected. Your progress stays in this browser.')}

document.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;
  if(b.dataset.act==='sync-connect'){const i=document.getElementById('synckey');syncConnect(i?i.value.trim():'')}
  else if(b.dataset.act==='sync-now')syncPull();
  else if(b.dataset.act==='sync-off')syncDisconnect();
});
window.addEventListener('load',()=>{syncPull()});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&SYNC.key&&Date.now()-SYNC.last>30000)syncPull()});
