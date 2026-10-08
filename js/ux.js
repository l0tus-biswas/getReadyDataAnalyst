/* Shared learning-UX helpers: flashcard quiz, code highlighting + copy, reading progress */

/* ---------- question helpers ---------- */
const LVL={E:['Easy','lvl-E'],M:['Medium','lvl-M'],H:['Hard','lvl-H']};
const lvlBadge=l=>`<span class="lvl ${(LVL[l]||LVL.M)[1]}">${(LVL[l]||LVL.M)[0]}</span>`;
const flames=n=>'🔥'.repeat(Math.max(1,Math.min(3,n||1)));
function qOf(id){const p=id.split(':');return {k:p[1],i:+p[2],q:QA[p[1]].list[+p[2]]}}
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

/* ---------- quiz (flashcards) ---------- */
function startQuiz(scope,n){
  if(scope==='review'){
    const due=srDue(15);
    if(!due.length){toast('Nothing due for review. You are all caught up! 🎉');return false}
    ui.quiz={ids:due,i:0,show:false,got:0,rev:0,scope,mode:'review'};return true;
  }
  let ids=scope==='all'?Object.keys(QA).flatMap(qIds):qIds(scope);
  ids=ids.filter(i=>!S.done[i]);
  if(scope!=='all'&&ui.ql&&ui.ql!=='all')ids=ids.filter(i=>qOf(i).q.lvl===ui.ql);
  // flagged first, then most-asked, then random
  const w=i=>(S.flag[i]?2:0)+(qOf(i).q.freq||2)/3+Math.random();
  ids=ids.sort((a,b)=>w(b)-w(a)).slice(0,n||10);
  if(!ids.length){toast('Nothing left to quiz. All prepared! 🎉');return false}
  ui.quiz={ids:shuffle(ids),i:0,show:false,got:0,rev:0,scope};return true;
}
function quizCard(){
  const z=ui.quiz;if(!z)return '';
  if(z.i>=z.ids.length){
    return `<div class="card quiz" id="quiz"><h3 style="margin-top:0">🏁 ${z.mode==='review'?'Review':'Quiz'} finished</h3><p>✅ Got it: <b>${z.got}</b> · 🔁 Need revision: <b>${z.rev}</b></p>
    <div class="qa-actions"><button class="btn" data-act="quiz-new">Another round</button><button class="btn ghost" data-act="quiz-end">Close</button></div></div>`}
  const {k,q}=qOf(z.ids[z.i]);
  return `<div class="card quiz" id="quiz"><div class="sm">${z.mode==='review'?'🔁 REVIEW':'🎲 QUIZ'} · ${z.i+1} of ${z.ids.length} · ${QA[k].emoji} ${esc(QA[k].name)} · ${lvlBadge(q.lvl)} <span class="sm">(keys: Space = show, 1 = got it, 2 = revise, S = skip, Esc = close)</span></div>
  <h3 class="qtext">${esc(q.q)}</h3>
  ${z.show?`${q.short?`<div class="say"><b>🗣️ Say it like this:</b><br>${q.short}</div>`:''}<div class="full">${q.a}</div>
    <div class="qa-actions"><button class="btn" data-act="quiz-got">✅ Got it (1)</button><button class="btn ghost" data-act="quiz-rev">🔁 Need revision (2)</button></div>`
  :`<p class="sm">Say your answer out loud first. Then reveal.</p><div class="qa-actions"><button class="btn" data-act="quiz-show">Show answer (Space)</button><button class="btn ghost" data-act="quiz-skip">Skip (S)</button><button class="btn ghost" data-act="quiz-end">Close</button></div>`}
  </div>`;
}
function quizFinished(z){
  const n=z.ids.length,perfect=z.got===n&&n>0;
  celebrate({big:perfect,emoji:perfect?'💯':'🎉',title:z.mode==='review'?(perfect?'Review: all remembered!':'Review complete!'):(perfect?'Perfect round!':'Quiz complete!'),sub:`${z.got} of ${n} answered confidently${z.rev?`, ${z.rev} flagged for revision`:''}.`,xp:z.got>=Math.ceil(n/2)?bonus('quiz'+Date.now(),perfect?15:5):0});
}
function quizAct(a){
  const z=ui.quiz;if(!z)return;
  const id=z.ids[z.i];
  if(a==='quiz-show')z.show=!z.show;
  else if(a==='quiz-got'&&id){
    const qb=document.querySelector('#quiz .btn'),rect=qb?qb.getBoundingClientRect():null,first=!S.done[id],b=doneStates(id);
    S.done[id]=1;S.days[todayS()]=1;srGood(id);z.got++;z.i++;z.show=false;
    if(first){logAct('q');celebrateItem(id,b,rect)}else{logAct('rev');miniBurst(rect,cheer()+' 🔁')}
    if(z.i>=z.ids.length)quizFinished(z);afterChange()}
  else if(a==='quiz-rev'&&id){srBad(id);logAct('rev');S.days[todayS()]=1;z.rev++;z.i++;z.show=false;save();if(z.i>=z.ids.length)quizFinished(z)}
  else if(a==='quiz-skip'){z.i++;z.show=false;if(z.i>=z.ids.length)quizFinished(z)}
  else if(a==='quiz-end')ui.quiz=null;
  render();const el=document.getElementById('quiz');if(el)el.scrollIntoView({block:'nearest'});
}
document.addEventListener('keydown',e=>{
  if(!ui.quiz)return;const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.tagName==='SELECT'))return;
  const m={' ':'quiz-show','Enter':'quiz-show','1':'quiz-got','2':'quiz-rev','s':'quiz-skip','S':'quiz-skip','Escape':'quiz-end'}[e.key];
  if(m){e.preventDefault();quizAct(m)}
});

/* ---------- code: highlight + copy ---------- */
const KWS=new Set(('select from where group by having order limit offset distinct as join inner left right full outer cross on and or not in is null like between case when then else end union all intersect except with over partition rows range unbounded preceding following current row asc desc insert into values create table update delete set primary key foreign references count sum avg min max coalesce nullif cast exists any recursive view index drop alter add using natural '
 +'def return import from for while class lambda true false none if elif try except raise print '
 +'var calculate filter divide related allexcept removefilters earlier sumx averagex countrows distinctcount dateadd totalytd sameperiodlastyear datesytd switch values selectedvalue').split(' '));
const HL_RE=/(--[^\n]*|\/\/\s[^\n]*|#\s[^\n]*|#$)|('(?:[^'\n]|'')*'|"(?:[^"\\\n]|\\.)*")|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z_0-9]*)/gm;
function hlCode(src){
  let out='',last=0,m;HL_RE.lastIndex=0;
  while((m=HL_RE.exec(src))){
    out+=esc(src.slice(last,m.index));
    const t=m[0];let c='';
    if(m[1])c='c';else if(m[2])c='s';else if(m[3])c='n';else if(KWS.has(t.toLowerCase()))c='k';
    out+=c?`<span class="tk-${c}">${esc(t)}</span>`:esc(t);last=HL_RE.lastIndex;
  }
  return out+esc(src.slice(last));
}
function enhanceCode(){
  document.querySelectorAll('#view pre').forEach(pre=>{
    if(pre.dataset.enh)return;pre.dataset.enh='1';
    const src=pre.textContent;
    if(src.length<20000)pre.innerHTML=hlCode(src);
    const wrap=document.createElement('div');wrap.className='codewrap';
    pre.parentNode.insertBefore(wrap,pre);wrap.appendChild(pre);
    const b=document.createElement('button');b.type='button';b.className='copybtn';b.textContent='Copy';
    b.addEventListener('click',()=>{
      const done=()=>{b.textContent='Copied ✓';setTimeout(()=>b.textContent='Copy',1500)};
      try{navigator.clipboard.writeText(pre.textContent).then(done,()=>{b.textContent='Select + Ctrl+C'})}catch(e){b.textContent='Select + Ctrl+C'}
    });
    wrap.appendChild(b);
  });
}

/* ---------- reading progress bar ---------- */
(function(){
  const bar=document.createElement('div');bar.id='rprog';document.body.appendChild(bar);
  const upd=()=>{const h=document.documentElement.scrollHeight-window.innerHeight;bar.style.width=(h>0?Math.min(100,window.scrollY/h*100):0)+'%'};
  window.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd);upd();
})();

/* Quick Quiz link (interview.html#quiz) when already on the hub page */
window.addEventListener('hashchange',()=>{
  if(location.hash==='#quiz'&&CUR==='interview'&&!ui.quiz){if(startQuiz('all',10))render()}
});

/* =========================================================
   CELEBRATIONS: mini bursts on every tick, popups for bigger wins
   ========================================================= */
const CEL={q:[],busy:false};
const CHEER=['Nice!','Boom!','Great job!','Crushed it!','Keep it up!','One step closer!','Yes!','Sharp work!','Locked in!','Well done!'];
const cheer=()=>CHEER[Math.floor(Math.random()*CHEER.length)];
const celOn=()=>S.celebrate!==false;
const calm=()=>window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const COLORS=['#4f46e5','#7c3aed','#16a34a','#f59e0b','#dc2626','#2563eb','#ec4899'];

function confettiBurst(n){
  if(calm())return;
  const box=document.createElement('div');box.className='cf-box';
  for(let i=0;i<n;i++){
    const s=document.createElement('i');s.className='cf';
    s.style.left=(5+Math.random()*90)+'vw';
    s.style.background=COLORS[i%COLORS.length];
    s.style.setProperty('--dx',(Math.random()*240-120)+'px');
    s.style.setProperty('--rot',(Math.random()*720-360)+'deg');
    s.style.animationDuration=(1.6+Math.random()*1.6)+'s';
    s.style.animationDelay=(Math.random()*.35)+'s';
    box.appendChild(s);
  }
  document.body.appendChild(box);setTimeout(()=>box.remove(),3800);
}
function miniBurst(rect,text){
  if(!celOn())return;
  const x=rect?rect.left+rect.width/2:window.innerWidth/2,y=rect?rect.top:window.innerHeight/2;
  const f=document.createElement('div');f.className='xpfloat';f.textContent=text;
  f.style.left=Math.min(Math.max(x,70),window.innerWidth-70)+'px';f.style.top=Math.max(y-6,40)+'px';
  document.body.appendChild(f);setTimeout(()=>f.remove(),1500);
  if(calm())return;
  for(let i=0;i<10;i++){
    const p=document.createElement('i');p.className='cp';
    const a=Math.PI*2*i/10;
    p.style.left=x+'px';p.style.top=y+'px';p.style.background=COLORS[i%COLORS.length];
    p.style.setProperty('--dx',Math.cos(a)*(30+Math.random()*30)+'px');p.style.setProperty('--dy',Math.sin(a)*(30+Math.random()*30)+'px');
    document.body.appendChild(p);setTimeout(()=>p.remove(),900);
  }
}
function celebrate(o){
  if(!celOn())return;
  CEL.q.push(o);if(!CEL.busy)celNext();
}
function celNext(){
  const o=CEL.q.shift();
  if(!o){CEL.busy=false;return}
  CEL.busy=true;
  const d=document.createElement('div');d.className='cel'+(o.big?' big':'');
  d.innerHTML=`<div class="cel-card" role="status" aria-live="polite"><div class="cel-emoji">${o.emoji}</div><div class="cel-title">${esc(o.title)}</div>${o.sub?`<div class="cel-sub">${esc(o.sub)}</div>`:''}${o.xp?`<div class="cel-xp">+${o.xp} XP</div>`:''}<button class="btn" type="button">Keep going 🚀</button></div>`;
  document.body.appendChild(d);
  confettiBurst(o.big?70:36);
  let t;const close=()=>{clearTimeout(t);if(d.classList.contains('out'))return;d.classList.add('out');setTimeout(()=>{d.remove();celNext()},220)};
  t=setTimeout(close,o.big?4600:3200);
  d.addEventListener('click',close);
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const c=document.querySelector('.cel');if(c)c.click()}});

/* ---------- completion detection ---------- */
const dayComplete=(w,d)=>{const m=WEEKS[w-1].days[d].filter(t=>t.tag==='M');return m.length>0&&m.every(t=>S.done[t.id])};
const weekComplete=w=>{const p=prog(weekIds(w,true));return p.t>0&&p.d===p.t};
const groupComplete=(kind,g)=>{
  const ids=kind==='topic'?tIds(g):kind==='proj'?pIds(PROJECTS.find(p=>p.id===g)):qIds(g);
  const p=prog(ids,true);return p.t>0&&p.d===p.t};
function doneStates(id){
  const r=REG[id];
  if(r.kind==='task'){const m=id.match(/^w(\d+)d(\d)t/),w=+m[1],d=+m[2];return {w,d,day:dayComplete(w,d),week:weekComplete(w)}}
  if(r.kind==='topic'||r.kind==='proj'||r.kind==='q')return {grp:groupComplete(r.kind,r.g)};
  return {};
}
function bonus(key,xp){if(!S.bonus)S.bonus={};if(S.bonus[key])return 0;S.bonus[key]=xp;return xp}

/* big wins: returns true if a popup was queued */
function celebrateWins(id,b,a){
  const r=REG[id];
  if(r.kind==='task'){
    if(!b.week&&a.week){
      const x=bonus('week'+a.w,50),w=WEEKS[a.w-1];
      celebrate({big:true,emoji:'🏁',title:`Week ${a.w} complete!`,sub:`${w.title}. Deliverable: ${w.deliver}`,xp:x});return true}
    if(!b.day&&a.day){const x=bonus(`day${a.w}-${a.d}`,10);celebrate({emoji:'🌟',title:`${DAYN[a.d]} of Week ${a.w} complete!`,sub:'All must-do tasks done. Nice consistency.',xp:x});return true}
  }else if(!b.grp&&a.grp){
    const label={topic:()=>TOPICS.find(t=>t.id===r.g).name,proj:()=>PROJECTS.find(p=>p.id===r.g).name,q:()=>QA[r.g].name+' interview questions'}[r.kind]();
    const x=bonus(r.kind+r.g,{topic:20,proj:40,q:30}[r.kind]);
    celebrate({big:r.kind!=='topic',emoji:{topic:'🧠',proj:'🚀',q:'🎤'}[r.kind],title:{topic:'Topic mastered!',proj:'Project shipped!',q:'Question bank complete!'}[r.kind],sub:label,xp:x});return true}
  return false;
}
function celebrateItem(id,before,rect){
  const a=doneStates(id);
  if(!celebrateWins(id,before,a))miniBurst(rect,`${cheer()} +${REG[id].xp} XP`);
  else miniBurst(rect,`+${REG[id].xp} XP`);
}
function celebratePrac(id,before,rect){
  const m=id.match(/^pr:(\d+):(\d):/),n=+m[1],d=+m[2];
  const all=GUIDES[n].days[d].practice.every((q,i)=>S.prac[`pr:${n}:${d}:${i}`]);
  miniBurst(rect,`${cheer()} +3 XP`);
  if(all){const x=bonus(`prac${n}-${d}`,10);if(x)celebrate({emoji:'✍️',title:'All practice solved!',sub:`${DAYN[d]} of Week ${n}`,xp:x})}
}
