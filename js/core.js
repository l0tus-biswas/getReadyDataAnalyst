/* =========================================================
   STATE / REGISTRY
   ========================================================= */
const KEY='da-quest-v1';
const defaultState=()=>({done:{},flag:{},prac:{},bonus:{},sr:{},mocks:[],checkins:{},carry:[],notes:{},act:{},goal:60,days:{},apps:[],badges:{},theme:null,start:null,mustOnly:false,lvl:0});
let S=defaultState();
try{const raw=localStorage.getItem(KEY);if(raw)Object.assign(S,JSON.parse(raw))}catch(e){}
let LASTSAVED='';
const save=()=>{try{LASTSAVED=JSON.stringify(S);localStorage.setItem(KEY,LASTSAVED)}catch(e){}};
// another tab may have saved newer progress: re-read it when this tab regains focus
function reloadState(){
  try{const raw=localStorage.getItem(KEY);if(!raw||raw===LASTSAVED)return false;
    const fresh=Object.assign(defaultState(),JSON.parse(raw));
    Object.keys(S).forEach(k=>delete S[k]);Object.assign(S,fresh);LASTSAVED=raw;return true}catch(e){return false}
}
// per-day activity log: active seconds and counters (used by the heatmap, goals and summaries)
function actOf(date){const d=date||todayS();return S.act[d]||(S.act[d]={sec:0,tasks:0,prac:0,q:0,rev:0,mock:0})}
function logAct(field,n){const a=actOf();a[field]=(a[field]||0)+(n||1)}
const ui={open:{},tag:'all',tq:''};
/* Normalise shapes: questions may be old arrays [q,a] or new objects; topic items may lack meta. */
const QDEF={short:'',lvl:'M',freq:2,follow:[],mistake:'',tags:[]};
Object.keys(QA).forEach(k=>{QA[k].list=QA[k].list.map(q=>Array.isArray(q)?Object.assign({},QDEF,{q:q[0],a:q[1]}):Object.assign({},QDEF,q))});
TOPICS.forEach(tp=>tp.items.forEach(it=>{it[3]=Object.assign({w:2,depth:'',why:'',ex:'',q:'',week:0},it[3]||{})}));
const REG={};
const XPT={M:20,O:10,A:10},XPP={M:8,O:4,A:4},XPQ={E:3,M:4,H:6};
WEEKS.forEach(w=>w.days.forEach(d=>d.forEach(t=>REG[t.id]={kind:'task',tag:t.tag,xp:XPT[t.tag]})));
TOPICS.forEach(tp=>tp.items.forEach((it,i)=>{it.id=`t:${tp.id}:${i}`;REG[it.id]={kind:'topic',tag:it[1],xp:XPP[it[1]],g:tp.id}}));
PROJECTS.forEach(p=>p.steps.forEach((s,i)=>{const id=`${p.id}s${i}`;REG[id]={kind:'proj',tag:p.tag,xp:p.tag==='M'?15:8,g:p.id}}));
// Hard questions are a stretch: optional for readiness, worth more XP.
Object.keys(QA).forEach(k=>QA[k].list.forEach((q,i)=>REG[`q:${k}:${i}`]={kind:'q',tag:q.lvl==='H'?'O':'M',xp:XPQ[q.lvl]||4,g:k}));
JOBS.forEach((j,i)=>REG[`j:${i}`]={kind:'job',tag:'M',xp:10});

/* ---------------- dates ---------------- */
const iso=d=>{const x=new Date(d.getTime()-d.getTimezoneOffset()*60000);return x.toISOString().slice(0,10)};
const pd=s=>new Date(s+'T00:00:00');
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const todayS=()=>iso(new Date());
// Day 1 of the plan is exactly the start date you choose (default: the day you first open the site).
// Older saves normalised the start to a Monday; if nothing has been ticked yet, move it to today.
if(!S.start||(!S.startExact&&!Object.keys(S.done).length&&!Object.keys(S.days).length))S.start=todayS();
if(!S.startExact){S.startExact=true;save()}
const dayIdx=()=>Math.round((pd(todayS())-pd(S.start))/864e5);
const dayDate=(w,d)=>addDays(pd(S.start),(w-1)*7+d).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});
const planEnd=()=>addDays(pd(S.start),12*7-1).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric'});

/* ---------------- calc ---------------- */
function calc(){
  let xp=0,mDone=0,mTot=0;const k={};
  for(const id in REG){const r=REG[id],d=!!S.done[id];
    if(d)xp+=r.xp;
    if(r.tag==='M'){mTot+=r.xp;if(d)mDone+=r.xp}
    const o=k[r.kind]||(k[r.kind]={d:0,t:0,md:0,mt:0});o.t++;if(d)o.d++;if(r.tag==='M'){o.mt++;if(d)o.md++}}
  xp+=3*Object.keys(S.prac).length;   // practice questions from the week guides
  xp+=Object.values(S.bonus||{}).reduce((s,v)=>s+v,0);   // completion bonuses (day, week, topic, project, bank)
  return {xp,ready:mTot?mDone/mTot:0,k};
}
function prog(ids,mustOnly){let d=0,t=0;ids.forEach(id=>{const r=REG[id];if(mustOnly&&r.tag!=='M')return;t++;if(S.done[id])d++});return {d,t,p:t?d/t:0}}
const weekIds=(n,must)=>{const w=WEEKS[n-1],a=[];w.days.forEach(d=>d.forEach(t=>a.push(t.id)));return must?a.filter(i=>REG[i].tag==='M'):a};
const qIds=k=>QA[k].list.map((q,i)=>`q:${k}:${i}`);
const tIds=k=>TOPICS.find(t=>t.id===k).items.map(i=>i.id);
const pIds=p=>p.steps.map((s,i)=>`${p.id}s${i}`);
function streak(){let n=0,d=new Date();d.setHours(0,0,0,0);if(!S.days[iso(d)])d=addDays(d,-1);while(S.days[iso(d)]){n++;d=addDays(d,-1)}return n}
function bestStreak(){const ks=Object.keys(S.days).sort();let b=0,c=0,p=null;ks.forEach(k=>{c=(p&&Math.round((pd(k)-pd(p))/864e5)===1)?c+1:1;if(c>b)b=c;p=k});return b}
function level(r){const pc=r*100;let i=0;LEVELS.forEach((l,j)=>{if(pc>=l[0])i=j});return i}
const pct=x=>Math.round(x*100);

/* ---------------- badges ---------------- */
const BADGES=[
 ['first','🎯','First Step','Complete 1 task',c=>c.k.task.d>=1],
 ['s3','🔥','3-Day Streak','Study 3 days in a row',()=>bestStreak()>=3],
 ['s7','🔥','7-Day Streak','7 days in a row',()=>bestStreak()>=7],
 ['s14','⚡','14-Day Streak','14 days in a row',()=>bestStreak()>=14],
 ['s30','🌋','30-Day Streak','30 days in a row',()=>bestStreak()>=30],
 ...WEEKS.map(w=>['w'+w.n,'🏁','Week '+w.n,w.title,()=>{const p=prog(weekIds(w.n,true));return p.t>0&&p.d===p.t}]),
 ['sqlq','🗄️','SQL Interview Ready','All SQL Q&A prepared',()=>prog(qIds('sql')).p===1],
 ['pr25','✍️','Practice Habit','Solve 25 practice questions',()=>Object.keys(S.prac).length>=25],
 ['pr100','🧠','Practice Machine','Solve 100 practice questions',()=>Object.keys(S.prac).length>=100],
 ['q50','🎤','50 Questions','Prepare 50 Q&As',()=>Object.keys(REG).filter(i=>REG[i].kind==='q'&&S.done[i]).length>=50],
 ['topics','📚','Concept Master','All mandatory topics',()=>{const ids=Object.keys(REG).filter(i=>REG[i].kind==='topic'&&REG[i].tag==='M');return ids.every(i=>S.done[i])}],
 ['p1','🧪','Project 1 Shipped','Survey dashboard',()=>prog(pIds(PROJECTS[0])).p===1],
 ['p2','🛒','Project 2 Shipped','E-commerce analytics',()=>prog(pIds(PROJECTS[1])).p===1],
 ['p3','📣','Project 3 Shipped','Martech / Edtech',()=>prog(pIds(PROJECTS[2])).p===1],
 ['a10','📨','10 Applications','Tracker entries',()=>S.apps.length>=10],
 ['a25','📬','25 Applications','Tracker entries',()=>S.apps.length>=25],
 ['half','🚀','Halfway There','50% job readiness',c=>c.ready>=.5],
 ['rdy','🎓','Interview Ready','90% job readiness',c=>c.ready>=.9],
 ['offer','🏆','OFFER!','Mark an application as Offer',()=>S.apps.some(a=>a.status==='Offer')]
];

/* =========================================================
   UI HELPERS
   ========================================================= */
const $=(s,r=document)=>r.querySelector(s);
const tagChip=t=>`<span class="tag ${t}">${{M:'MUST',O:'OPTIONAL',A:'ADVANCED'}[t]}</span>`;
function chk(id,text,tag,desc){const d=!!S.done[id];
  return `<label class="row ${d?'done':''}" data-s="${esc((text+' '+(desc||'')).toLowerCase())}"><input type="checkbox" data-id="${id}" ${d?'checked':''}><span class="box"></span><span class="rt"><span class="txt">${esc(text)}</span>${desc?`<span class="desc">${esc(desc)}</span>`:''}</span>${tagChip(tag)}<span class="xp">+${REG[id].xp}</span></label>`}
const bar=p=>`<div class="bar"><i style="width:${pct(p)}%"></i></div>`;
const isOpen=(k,def)=>ui.open[k]===undefined?def:ui.open[k];
const hasOpen=(k,def)=>isOpen(k,def)?'open':'';
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2600)}
function confetti(){const e=['🎉','⭐','✨','🎊','💫'];for(let i=0;i<26;i++){const s=document.createElement('span');s.className='conf';s.textContent=e[i%e.length];s.style.left=Math.random()*100+'vw';s.style.animationDelay=Math.random()*.6+'s';document.body.appendChild(s);setTimeout(()=>s.remove(),3200)}}
const ring=(p,size=128,sw=12)=>{const r=(size-sw)/2,c=2*Math.PI*r;return `<div class="ring" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="${sw}"/><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#fff" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-p)}"/></svg><div class="n">${pct(p)}%</div></div>`};

