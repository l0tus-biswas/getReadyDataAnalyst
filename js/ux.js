/* Shared learning-UX helpers: flashcard quiz, code highlighting + copy, reading progress */

/* ---------- question helpers ---------- */
const LVL={E:['Easy','lvl-E'],M:['Medium','lvl-M'],H:['Hard','lvl-H']};
const lvlBadge=l=>`<span class="lvl ${(LVL[l]||LVL.M)[1]}">${(LVL[l]||LVL.M)[0]}</span>`;
const flames=n=>'🔥'.repeat(Math.max(1,Math.min(3,n||1)));
function qOf(id){const p=id.split(':');return {k:p[1],i:+p[2],q:QA[p[1]].list[+p[2]]}}
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

/* ---------- quiz (flashcards) ---------- */
function startQuiz(scope,n){
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
    return `<div class="card quiz" id="quiz"><h3 style="margin-top:0">🏁 Quiz finished</h3><p>✅ Got it: <b>${z.got}</b> · 🔁 Need revision: <b>${z.rev}</b></p>
    <div class="qa-actions"><button class="btn" data-act="quiz-new">Another round</button><button class="btn ghost" data-act="quiz-end">Close</button></div></div>`}
  const {k,q}=qOf(z.ids[z.i]);
  return `<div class="card quiz" id="quiz"><div class="sm">🎲 QUIZ · ${z.i+1} of ${z.ids.length} · ${QA[k].emoji} ${esc(QA[k].name)} · ${lvlBadge(q.lvl)} <span class="sm">(keys: Space = show, 1 = got it, 2 = revise, S = skip, Esc = close)</span></div>
  <h3 class="qtext">${esc(q.q)}</h3>
  ${z.show?`${q.short?`<div class="say"><b>🗣️ Say it like this:</b><br>${q.short}</div>`:''}<div class="full">${q.a}</div>
    <div class="qa-actions"><button class="btn" data-act="quiz-got">✅ Got it (1)</button><button class="btn ghost" data-act="quiz-rev">🔁 Need revision (2)</button></div>`
  :`<p class="sm">Say your answer out loud first. Then reveal.</p><div class="qa-actions"><button class="btn" data-act="quiz-show">Show answer (Space)</button><button class="btn ghost" data-act="quiz-skip">Skip (S)</button><button class="btn ghost" data-act="quiz-end">Close</button></div>`}
  </div>`;
}
function quizAct(a){
  const z=ui.quiz;if(!z)return;
  const id=z.ids[z.i];
  if(a==='quiz-show')z.show=!z.show;
  else if(a==='quiz-got'&&id){S.done[id]=1;delete S.flag[id];S.days[todayS()]=1;z.got++;z.i++;z.show=false;afterChange()}
  else if(a==='quiz-rev'&&id){S.flag[id]=1;z.rev++;z.i++;z.show=false;save()}
  else if(a==='quiz-skip'){z.i++;z.show=false}
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
