/* App shell: navigation, rendering, gamification checks, events */
const NAV=[['index','🏠','Dashboard'],['plan','📅','12-Week Plan'],['topics','📚','Topics & Skills'],['interview','🎤','Interview Q&A'],['interview.html#quiz','🎲','Quick Quiz'],['sql-lab','⌨️','SQL Lab'],['projects','🧪','Projects'],['jobs','💼','Job Hunt'],['resources','🔗','Resources'],['settings','⚙️','Settings']];
let PAGE=null,CUR='';
function renderSide(){
  const inQA=CUR==='interview'||CUR.startsWith('qa-'),inPlan=CUR==='plan'||CUR.startsWith('week-');
  $('#side').innerHTML='<h1>🎯 DA Quest</h1>'+NAV.map(n=>{
    const on=CUR===n[0]||(n[0]==='interview'&&inQA)||(n[0]==='plan'&&inPlan);
    return '<a class="nav '+(on?'on':'')+'" href="'+(n[0].includes('.')?n[0]:n[0]+'.html')+'">'+n[1]+' '+n[2]+'</a>'+
      (n[0]==='interview'&&inQA?'<div class="sub">'+QORDER.map(k=>'<a class="'+(CUR==='qa-'+k?'on':'')+'" href="qa-'+k+'.html">'+QA[k].emoji+' '+QA[k].name+'</a>').join('')+'</div>':'')+
      (n[0]==='plan'&&inPlan?'<div class="sub">'+WEEKS.map(w=>'<a class="'+(CUR==='week-'+w.n?'on':'')+'" href="week-'+w.n+'.html">W'+w.n+' · '+w.title+'</a>').join('')+'</div>':'')}).join('')}
function renderChrome(){const c=calc(),L=LEVELS[level(c.ready)];
  $('#chrome').innerHTML='<span class="pill">'+L[2]+' '+L[1]+'</span><span class="pill">⭐ '+c.xp+' XP</span><span class="pill">🔥 '+streak()+'</span><span class="pill">🎯 '+pct(c.ready)+'% ready</span>'}
function applySearch(){
  if($('#tsearch')){const q=ui.tq.trim().toLowerCase();document.querySelectorAll('#view .row[data-s]').forEach(r=>(r.closest('.titem')||r).classList.toggle('hide',!!q&&!r.dataset.s.includes(q)))}
  if($('#qsearch')){const q=(ui.qq||'').trim().toLowerCase();document.querySelectorAll('#view .qitem').forEach(r=>r.classList.toggle('hide',!!q&&!r.dataset.s.includes(q)))}
}
function render(){const y=window.scrollY;$('#view').innerHTML=PAGE();renderSide();renderChrome();applySearch();if(typeof enhanceCode==='function')enhanceCode();window.scrollTo(0,y)}
function boot(cur,fn){
  CUR=cur;PAGE=fn;
  const dark=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme=S.theme||(dark?'dark':'light');
  render();
  const hid=location.hash.slice(1),el=hid&&document.getElementById(hid);
  if(el){if(el.tagName==='DETAILS'){el.open=true;if(el.dataset.k)ui.open[el.dataset.k]=true}el.scrollIntoView()}
}

/* ---------------- gamification checks ---------------- */
function afterChange(){
  const c=calc();let newB=[];
  BADGES.forEach(b=>{if(!S.badges[b[0]]&&b[4](c)){S.badges[b[0]]=todayS();newB.push(b)}});
  const li=level(c.ready);
  if(newB.length>3)celebrate({big:true,emoji:'🏅',title:newB.length+' badges unlocked!',sub:newB.slice(0,5).map(x=>x[2]).join(', ')+(newB.length>5?' and more':'')});
  else newB.forEach(b=>celebrate({big:true,emoji:b[1],title:'Badge unlocked: '+b[2],sub:b[3]}));
  if(li>S.lvl){S.lvl=li;celebrate({big:true,emoji:LEVELS[li][2],title:'Level up! '+LEVELS[li][1],sub:`You are ${pct(c.ready)}% job ready.`})}
  else if(li<S.lvl)S.lvl=li;
  save();
}

/* ---------------- events ---------------- */
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.matches('input[data-id]')){
    const id=t.dataset.id;
    if(t.checked){const rect=t.getBoundingClientRect(),before=doneStates(id);S.done[id]=1;S.days[todayS()]=1;celebrateItem(id,before,rect)}else delete S.done[id];
    afterChange();render();
  }else if(t.matches('input[data-pid]')){
    const id=t.dataset.pid;
    if(t.checked){const rect=t.getBoundingClientRect();S.prac[id]=1;S.days[todayS()]=1;celebratePrac(id,null,rect)}else delete S.prac[id];
    afterChange();render();
  }else if(t.matches('input[data-act="mustonly"]')){S.mustOnly=t.checked;save();render()}
  else if(t.matches('input[data-act="celeb"]')){S.celebrate=t.checked;save();if(t.checked)miniBurst(t.getBoundingClientRect(),'Celebrations on 🎉')}
  else if(t.matches('select[data-app]')){S.apps[+t.dataset.app].status=t.value;afterChange();render();if(t.value==='Offer')confetti()}
});
document.addEventListener('input',e=>{
  if(e.target.id==='tsearch'){ui.tq=e.target.value;applySearch()}
  else if(e.target.id==='qsearch'){ui.qq=e.target.value;applySearch()}
});
document.addEventListener('toggle',e=>{const d=e.target;if(d.dataset&&d.dataset.k)ui.open[d.dataset.k]=d.open},true);
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b||b.tagName==='INPUT')return;
  const [a,arg]=b.dataset.act.split(/:(.*)/s);
  if(a==='nav-toggle')$('#side').classList.toggle('open');
  else if(a==='theme'){const cur=document.documentElement.dataset.theme==='dark'?'light':'dark';S.theme=cur;document.documentElement.dataset.theme=cur;save()}
  else if(a==='rest'){S.days[todayS()]=S.days[todayS()]||'r';save();toast('Rest day logged. Streak safe 😴');render()}
  else if(a==='jump-cur'){const i=dayIdx(),w=Math.min(12,Math.max(1,Math.floor(i/7)+1));ui.open['wk'+w]=true;render();const el=$('#wk'+w);if(el)el.scrollIntoView({behavior:'smooth'})}
  else if(a==='goday'){ui.open['w'+CUR.slice(5)+'d'+arg]=true;setTimeout(()=>{const el=document.getElementById('day-'+arg);if(el){el.open=true;el.scrollIntoView({behavior:'smooth'})}},0)}
  else if(a==='weekall'){const n=+arg,any=[0,1,2,3,4,5,6].some(d=>ui.open['w'+n+'d'+d]);for(let d=0;d<7;d++)ui.open['w'+n+'d'+d]=!any;render()}
  else if(a==='tag'){ui.tag=arg;render()}
  else if(a==='tw'){ui.tw=!ui.tw;render()}
  else if(a==='tn'){ui.tn=!ui.tn;render()}
  else if(a==='qlvl'){ui.ql=arg;render()}
  else if(a==='qst'){ui.qs=arg;render()}
  else if(a==='qfreq'){ui.qf=!ui.qf;render()}
  else if(a==='quiz-start'){if(startQuiz(arg,10)){render();const el=document.getElementById('quiz');if(el)el.scrollIntoView({behavior:'smooth',block:'start'})}}
  else if(a==='quiz-new'){const sc=ui.quiz?ui.quiz.scope:'all';ui.quiz=null;startQuiz(sc,10);render()}
  else if(a.startsWith('quiz-')){quizAct(a)}
  else if(a==='daydone'){const [n,d]=arg.split(':').map(Number);const rect=b.getBoundingClientRect(),wkBefore=weekComplete(n);let xp=0;WEEKS[n-1].days[d].forEach(t=>{if(t.tag==='M'&&!S.done[t.id]){S.done[t.id]=1;xp+=REG[t.id].xp}});if(xp){S.days[todayS()]=1;const a={w:n,d,day:true,week:weekComplete(n)};const first=WEEKS[n-1].days[d].find(t=>t.tag==='M');celebrateWins(first.id,{day:false,week:wkBefore},a);miniBurst(rect,`+${xp} XP`);afterChange();render()}}
  else if(a==='flag'){if(S.flag[arg])delete S.flag[arg];else S.flag[arg]=1;save();render()}
  else if(a==='rand'){const ids=qIds(arg).filter(i=>!S.done[i]);if(!ids.length){toast('All prepared! 🎉');return}const id=ids[Math.floor(Math.random()*ids.length)];ui.open[id]=true;render();const el=document.getElementById(id.replace(/:/g,'-'));if(el)el.scrollIntoView({behavior:'smooth',block:'center'})}
  else if(a==='openall'){const ids=qIds(arg),any=ids.some(i=>ui.open[i]);ids.forEach(i=>ui.open[i]=!any);render()}
  else if(a==='app-add'){const c=$('#a_c').value.trim(),r=$('#a_r').value.trim();if(!c)return;S.apps.unshift({c,r,d:todayS(),status:'Applied'});S.days[todayS()]=S.days[todayS()]||1;const x=REG['j:8'],n=S.apps.length;if(n>=10)S.done['j:8']=1;if(n>=25)S.done['j:9']=1;if(n>=50)S.done['j:10']=1;afterChange();render()}
  else if(a==='app-del'){S.apps.splice(+arg,1);save();render()}
  else if(a==='setstart'){const v=$('#startd').value;if(v){S.start=v;S.startExact=true;save();toast('Day 1 is now '+dayDate(1,0));render()}}
  else if(a==='celeb-test'){const was=S.celebrate;S.celebrate=true;celebrate({big:true,emoji:'🎉',title:'This is how a win looks!',sub:'Finish a day, week, topic or project to see it for real.',xp:50});S.celebrate=was}
  else if(a==='startoday'){S.start=todayS();S.startExact=true;save();toast('Day 1 is today. Let\'s go! 🚀');render()}
});
document.addEventListener('click',e=>{if(e.target.closest('#side a'))$('#side').classList.remove('open')});

