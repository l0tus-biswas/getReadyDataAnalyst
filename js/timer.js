/* Study timer that only counts REAL interaction.
   A second is counted only when ALL of these are true:
   - the tab is visible and the window has focus,
   - you tapped, clicked a control, typed, ticked or answered something in the last 90 seconds,
   - this is the tab you used most recently (two open tabs never double-count).
   Scrolling, moving the mouse and leaving a page open count for nothing. */
var TM={IDLE:90,last:0,state:'idle',why:'Tap, type or tick something to start the timer.',n:0};
const TAB=(()=>{try{let t=sessionStorage.getItem('daq-tab');if(!t){t=Math.random().toString(36).slice(2);sessionStorage.setItem('daq-tab',t)}return t}catch(e){return 'x'}})();
try{TM.last=Number(sessionStorage.getItem('daq-last'))||0}catch(e){}

function tmTouch(){
  TM.last=Date.now();
  try{sessionStorage.setItem('daq-last',String(TM.last));localStorage.setItem('daq-lock',TAB+'|'+TM.last)}catch(e){}
}
const tmInteractive=t=>t&&t.closest&&t.closest('button,a,summary,label,input,select,textarea,[data-act],.row,.chip');
document.addEventListener('click',e=>{if(tmInteractive(e.target))tmTouch()},true);
document.addEventListener('input',tmTouch,true);
document.addEventListener('change',tmTouch,true);
document.addEventListener('keydown',e=>{
  const t=e.target;
  if(t&&t.matches&&t.matches('input,textarea,select'))tmTouch();
  else if((typeof ui!=='undefined'&&ui.quiz)||(typeof mockRunning==='function'&&mockRunning()))tmTouch();
},true);

/* ---------- focus sessions (kept across page navigation in this tab) ---------- */
function focusGet(){try{return JSON.parse(sessionStorage.getItem('daq-focus')||'null')}catch(e){return null}}
function focusSet(f){try{if(f)sessionStorage.setItem('daq-focus',JSON.stringify(f));else sessionStorage.removeItem('daq-focus')}catch(e){}}
function focusStart(min){focusSet({target:min*60,got:0});tmTouch();tmRefresh()}
function focusStop(){focusSet(null);tmRefresh()}

const fmtMS=s=>{s=Math.max(0,Math.round(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const fmtH=s=>{const m=Math.round(s/60);return m>=60?Math.floor(m/60)+'h '+String(m%60).padStart(2,'0')+'m':m+'m'};

function tmWhy(){
  const now=Date.now();
  if(document.visibilityState!=='visible')return 'This tab is hidden.';
  if(typeof document.hasFocus==='function'&&!document.hasFocus())return 'This window is not in focus.';
  if(now-TM.last>TM.IDLE*1000)return 'No interaction for '+TM.IDLE+' seconds. Tap, type or tick something to resume.';
  try{const lk=(localStorage.getItem('daq-lock')||'').split('|');if(lk[0]&&lk[0]!==TAB&&now-Number(lk[1])<TM.IDLE*1000)return 'Another tab is the active one.'}catch(e){}
  return '';
}
function tmTick(){
  if(typeof READONLY!=='undefined'&&READONLY){TM.state='idle';TM.why='Viewing another user (read-only). Nothing is timed.';tmRefresh();return}
  const why=tmWhy();TM.state=why?'idle':'active';TM.why=why;
  if(!why){
    const a=actOf();a.sec=(a.sec||0)+1;TM.n++;
    const f=focusGet();
    if(f){f.got++;
      if(f.got>=f.target){focusSet(null);a.focus=(a.focus||0)+1;
        const x=a.focus<=3?bonus('focus'+todayS()+'-'+a.focus,10):0;
        celebrate({emoji:'🎯',title:'Focus session complete!',sub:`${Math.round(f.target/60)} minutes of real, active study.`,xp:x})}
      else focusSet(f)}
    const g=(S.goal||60)*60;
    if(a.sec===g){const x=bonus('goal'+todayS(),10);celebrate({big:true,emoji:'🏆',title:'Daily goal reached!',sub:`${S.goal||60} minutes of active study today. That is how streaks are built.`,xp:x})}
    if(TM.n%15===0)save();
  }
  tmRefresh();
}
function timerPill(){
  const a=actOf(),f=focusGet(),g=S.goal||60;
  const txt=f?`🎯 ${fmtMS(f.target-f.got)} left`:`⏱ ${Math.floor((a.sec||0)/60)}m / ${g}m`;
  return `<button type="button" class="pill tpill ${TM.state}" id="tpill" data-act="tpanel" title="${esc(TM.state==='active'?'Counting active study time':TM.why)}"><i class="dot"></i>${txt}</button>`;
}
function tmRefresh(){
  const p=document.getElementById('tpill');
  if(p){const a=actOf(),f=focusGet(),g=S.goal||60;
    p.className='pill tpill '+TM.state;
    p.title=TM.state==='active'?'Counting active study time':TM.why;
    p.innerHTML='<i class="dot"></i>'+(f?`🎯 ${fmtMS(f.target-f.got)} left`:`⏱ ${Math.floor((a.sec||0)/60)}m / ${g}m`)}
  const pn=document.getElementById('tpanel');if(pn)pn.innerHTML=tmPanelHtml();
}
function weekSec(){let s=0;for(let i=0;i<7;i++){const a=S.act[inDays(-i)];if(a)s+=a.sec||0}return s}
function tmPanelHtml(){
  const a=actOf(),f=focusGet(),g=S.goal||60,sec=a.sec||0;
  return `<div class="tp-top"><b>Study timer</b><button type="button" class="chip" data-act="tpanel">✕</button></div>
  <div class="tp-big">${fmtH(sec)}<span class="sm"> today</span></div>
  <div class="bar"><i style="width:${Math.min(100,Math.round(sec/(g*60)*100))}%"></i></div>
  <p class="sm">Goal ${g} min · ${Math.min(100,Math.round(sec/(g*60)*100))}% · this week ${fmtH(weekSec())}</p>
  <p class="tp-state ${TM.state}">${TM.state==='active'?'● Counting. You are studying.':'⏸ Paused. '+esc(TM.why)}</p>
  ${f?`<div class="tp-focus"><b>🎯 Focus session</b> ${fmtMS(f.target-f.got)} of active time left<div class="bar"><i style="width:${Math.round(f.got/f.target*100)}%"></i></div><button type="button" class="btn ghost" data-act="focus-stop">Stop session</button></div>`
  :`<div class="tp-focus"><b>Start a focus session</b><div class="qa-actions" style="margin:6px 0 0">${[15,25,45].map(m=>`<button type="button" class="chip" data-act="focus-start:${m}">${m} min</button>`).join('')}</div><p class="sm">The clock only runs while you interact, so it measures real study, not time spent with the page open.</p></div>`}
  <p class="sm"><label>Daily goal <select id="tgoalsel">${[15,30,45,60,90,120,180].map(m=>`<option value="${m}" ${m===g?'selected':''}>${m} min</option>`).join('')}</select></label></p>
  <details class="tp-how"><summary>How the timer counts</summary><ul class="sm"><li>Counts only after you tap, type, tick or answer something, and keeps counting for 90 seconds after your last action.</li><li>Scrolling, moving the mouse or leaving a page open does not count.</li><li>Pauses when the tab is hidden, the window loses focus, or another tab is the active one.</li><li>Quiz, review and mock answers count as interaction.</li></ul></details>`;
}
function tmTogglePanel(){
  let p=document.getElementById('tpanel');
  if(p){p.remove();return}
  p=document.createElement('div');p.id='tpanel';p.className='tpanel';p.innerHTML=tmPanelHtml();document.body.appendChild(p);
}
document.addEventListener('click',e=>{
  const b=e.target.closest&&e.target.closest('[data-act]');
  if(b){const [a,arg]=b.dataset.act.split(/:(.*)/s);
    if(a==='tpanel'){tmTogglePanel();return}
    if(a==='focus-start'){focusStart(+arg);return}
    if(a==='focus-stop'){focusStop();return}}
  const p=document.getElementById('tpanel');
  if(p&&!p.contains(e.target)&&!(e.target.closest&&e.target.closest('#tpill')))p.remove();
});
document.addEventListener('change',e=>{
  if(e.target.id==='tgoalsel'){S.goal=+e.target.value;save();tmRefresh()}
});
setInterval(tmTick,1000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')save()});
window.addEventListener('pagehide',()=>{save()});
window.addEventListener('focus',()=>{
  if(reloadState()){const ae=document.activeElement;if(!(ae&&/INPUT|TEXTAREA/.test(ae.tagName))&&typeof render==='function'&&PAGE)render()}
});
