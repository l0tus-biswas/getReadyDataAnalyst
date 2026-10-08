/* App shell: navigation, rendering, gamification checks, events */
const NAV=[['index','🏠','Dashboard'],['plan','📅','12-Week Plan'],['review','🔁','Review'],['mock','🎤','Mock Interview'],['interview','💬','Interview Q&A'],['interview.html#quiz','🎲','Quick Quiz'],['topics','📚','Topics & Skills'],['progress','📊','My Progress'],['checkin','📋','Weekly Check-in'],['notes','📝','Notes'],['sql-lab','⌨️','SQL Lab'],['search','🔍','Search'],['profile','👤','Profile'],['projects','🧪','Projects'],['jobs','💼','Job Hunt'],['resources','🔗','Resources'],['settings','⚙️','Settings']];
let PAGE=null,CUR='';
// which plan week needs a check-in (0 = none): Day 6-7 of a week, or an earlier week never checked in
function ciDue(){
  const idx=dayIdx();if(idx<0||idx>=91)return 0;
  const wk=Math.min(12,Math.floor(idx/7)+1),day=idx%7;
  if(day>=5&&!S.checkins[wk])return wk;
  for(let w=1;w<wk;w++)if(!S.checkins[w])return w;
  return 0;
}
function navBadge(p){
  if(p==='review'){const n=srCounts().due;return n?`<span class="nbadge">${n}</span>`:''}
  if(p==='checkin')return ciDue()?'<span class="nbadge">!</span>':'';
  return '';
}
function renderSide(){
  const inQA=CUR==='interview'||CUR.startsWith('qa-'),inPlan=CUR==='plan'||CUR.startsWith('week-');
  const nav=NAV.slice();
  if(typeof AUTH!=='undefined'&&AUTH.admin&&!READONLY)nav.splice(nav.length-1,0,['admin','🛠️','Admin panel']);
  const foot=(typeof AUTH!=='undefined'&&AUTH.mode==='user'&&AUTH.user&&!READONLY)?`<div class="sidefoot"><div class="sf-name">👤 ${esc(AUTH.user.name)}</div><div class="sm">${esc(AUTH.user.email)}</div><button type="button" class="btn ghost" data-act="logout">Sign out</button></div>`:'';
  $('#side').innerHTML='<h1>🎯 DA Quest</h1>'+nav.map(n=>{
    const on=CUR===n[0]||(n[0]==='interview'&&inQA)||(n[0]==='plan'&&inPlan);
    return '<a class="nav '+(on?'on':'')+'" href="'+(n[0].includes('.')?n[0]:n[0]+'.html')+'">'+n[1]+' '+n[2]+navBadge(n[0])+'</a>'+
      (n[0]==='interview'&&inQA?'<div class="sub">'+QORDER.map(k=>'<a class="'+(CUR==='qa-'+k?'on':'')+'" href="qa-'+k+'.html">'+QA[k].emoji+' '+QA[k].name+'</a>').join('')+'</div>':'')+
      (n[0]==='plan'&&inPlan?'<div class="sub">'+WEEKS.map(w=>'<a class="'+(CUR==='week-'+w.n?'on':'')+'" href="week-'+w.n+'.html">W'+w.n+' · '+w.title+'</a>').join('')+'</div>':'')}).join('')+foot}
function renderBottomNav(){
  let b=document.getElementById('bnav');
  if(!b){b=document.createElement('nav');b.id='bnav';b.setAttribute('aria-label','Quick navigation');document.body.appendChild(b)}
  const items=[['index','🏠','Home'],['plan','📅','Plan'],['review','🔁','Review'],['mock','🎤','Mock']];
  b.innerHTML=items.map(n=>`<a class="${CUR===n[0]||(n[0]==='plan'&&CUR.startsWith('week-'))?'on':''}" href="${n[0]}.html"><span>${n[1]}</span>${n[2]}${navBadge(n[0])}</a>`).join('')+`<button type="button" data-act="nav-toggle"><span>☰</span>More</button>`;
}
function renderAvatar(){
  const a=document.getElementById('avatar');if(!a)return;
  const u=(typeof AUTH!=='undefined'&&AUTH.user)?AUTH.user:null;
  a.hidden=!(u&&AUTH.mode==='user');
  if(u){a.textContent=initials(u.name);a.title=(READONLY?'Viewing as ':'Signed in as ')+u.name+' ('+u.email+')';a.classList.toggle('imp',!!READONLY);a.classList.toggle('on',CUR==='profile')}
}
function renderChrome(){renderAvatar();const c=calc(),L=LEVELS[level(c.ready)];
  $('#chrome').innerHTML=(typeof timerPill==='function'?timerPill():'')+(typeof userPill==='function'?userPill():'')+'<span class="pill hide-sm">'+L[2]+' '+L[1]+'</span><span class="pill hide-sm">⭐ '+c.xp+' XP</span><span class="pill">🔥 '+streak()+'</span><span class="pill hide-sm">🎯 '+pct(c.ready)+'% ready</span>'}
function applySearch(){
  if($('#tsearch')){const q=ui.tq.trim().toLowerCase();document.querySelectorAll('#view .row[data-s]').forEach(r=>(r.closest('.titem')||r).classList.toggle('hide',!!q&&!r.dataset.s.includes(q)))}
  if($('#qsearch')){const q=(ui.qq||'').trim().toLowerCase();document.querySelectorAll('#view .qitem').forEach(r=>r.classList.toggle('hide',!!q&&!r.dataset.s.includes(q)))}
}
function setTopH(){
  const t=document.querySelector('.top'),ib=document.getElementById('impbar'),r=document.documentElement.style;
  const th=t?t.offsetHeight:0,ih=ib?ib.offsetHeight:0;
  r.setProperty('--topH',th+'px');r.setProperty('--impH',ih+'px');r.setProperty('--stick',(th+ih)+'px');
}
function render(){const y=window.scrollY;$('#view').innerHTML=PAGE();renderSide();renderChrome();renderBottomNav();applySearch();if(typeof enhanceCode==='function')enhanceCode();setTopH();window.scrollTo(0,y)}
async function boot(cur,fn){
  CUR=cur;
  const ok=await authInit();   // redirects to the login page when not signed in
  if(!ok)return;
  PAGE=fn;
  const dark=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme=S.theme||(dark?'dark':'light');
  if(READONLY&&!document.getElementById('impbar')){const w=document.createElement('div');w.innerHTML=impBar();document.body.insertBefore(w.firstChild,document.body.firstChild)}
  render();
  // jump to #hash targets and open every collapsed section around them
  const hid=decodeURIComponent(location.hash.slice(1)),el=hid&&document.getElementById(hid);
  if(el){for(let p=el;p&&p!==document.body;p=p.parentElement){if(p.tagName==='DETAILS'){p.open=true;if(p.dataset.k)ui.open[p.dataset.k]=true}}el.scrollIntoView()}
  // offline support (needs https or localhost)
  if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('sw.js').catch(()=>{});
}
window.addEventListener('resize',setTopH);
document.addEventListener('keydown',e=>{
  if(e.key!=='/'||e.ctrlKey||e.metaKey||e.altKey)return;
  const t=e.target;if(t&&t.matches&&t.matches('input,textarea,select'))return;
  const i=document.getElementById('bigsearch')||document.getElementById('topsearch');if(i){e.preventDefault();i.focus()}
});

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

/* ---------------- reset ---------------- */
function resetAll(){
  const v=prompt('This permanently deletes ALL your progress (including the copy saved in your account): ticked tasks, XP, streaks, badges, practice, flagged questions and applications. The plan restarts today.\n\nThere is no undo. Type RESET to confirm:');
  if(v===null)return false;
  if(v.trim().toUpperCase()!=='RESET'){toast('Reset cancelled. You have to type RESET.');return false}
  const keep={theme:S.theme,celebrate:S.celebrate};
  try{localStorage.removeItem(KEY)}catch(e){}
  S=Object.assign(defaultState(),{theme:keep.theme,celebrate:keep.celebrate,start:todayS(),startExact:true});
  ui.open={};ui.quiz=null;ui.tag='all';ui.tw=false;ui.tn=false;ui.ql='all';ui.qs='all';ui.qf=false;ui.tq='';ui.qq='';
  save();render();toast('Everything has been reset. Fresh start! 🌱');
  return true;
}

/* ---------------- events ---------------- */
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.matches('input[data-id]')){
    const id=t.dataset.id;
    if(t.checked){const rect=t.getBoundingClientRect(),before=doneStates(id);S.done[id]=1;S.days[todayS()]=1;const kd=REG[id].kind;if(kd==='task')logAct('tasks');if(kd==='q'){logAct('q');srOnPrepared(id)}celebrateItem(id,before,rect)}else delete S.done[id];
    afterChange();render();
  }else if(t.matches('input[data-pid]')){
    const id=t.dataset.pid;
    if(t.checked){const rect=t.getBoundingClientRect();S.prac[id]=1;S.days[todayS()]=1;logAct('prac');celebratePrac(id,null,rect)}else delete S.prac[id];
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
  else if(a==='daydone'){const [n,d]=arg.split(':').map(Number);const rect=b.getBoundingClientRect(),wkBefore=weekComplete(n);let xp=0;WEEKS[n-1].days[d].forEach(t=>{if(t.tag==='M'&&!S.done[t.id]){S.done[t.id]=1;xp+=REG[t.id].xp}});if(xp){S.days[todayS()]=1;logAct('tasks');const a={w:n,d,day:true,week:weekComplete(n)};const first=WEEKS[n-1].days[d].find(t=>t.tag==='M');celebrateWins(first.id,{day:false,week:wkBefore},a);miniBurst(rect,`+${xp} XP`);afterChange();render()}}
  else if(a==='flag'){if(S.flag[arg])delete S.flag[arg];else{S.flag[arg]=1;srOnFlag(arg)}save();render()}
  else if(a==='rand'){const ids=qIds(arg).filter(i=>!S.done[i]);if(!ids.length){toast('All prepared! 🎉');return}const id=ids[Math.floor(Math.random()*ids.length)];ui.open[id]=true;render();const el=document.getElementById(id.replace(/:/g,'-'));if(el)el.scrollIntoView({behavior:'smooth',block:'center'})}
  else if(a==='openall'){const ids=qIds(arg),any=ids.some(i=>ui.open[i]);ids.forEach(i=>ui.open[i]=!any);render()}
  else if(a==='app-add'){const c=$('#a_c').value.trim(),r=$('#a_r').value.trim();if(!c)return;S.apps.unshift({c,r,d:todayS(),status:'Applied'});S.days[todayS()]=S.days[todayS()]||1;const x=REG['j:8'],n=S.apps.length;if(n>=10)S.done['j:8']=1;if(n>=25)S.done['j:9']=1;if(n>=50)S.done['j:10']=1;afterChange();render()}
  else if(a==='app-del'){S.apps.splice(+arg,1);save();render()}
  else if(a==='setstart'){const v=$('#startd').value;if(v){S.start=v;S.startExact=true;save();toast('Day 1 is now '+dayDate(1,0));render()}}
  else if(a==='celeb-test'){const was=S.celebrate;S.celebrate=true;celebrate({big:true,emoji:'🎉',title:'This is how a win looks!',sub:'Finish a day, week, topic or project to see it for real.',xp:50});S.celebrate=was}
  else if(a==='reset')resetAll();
  else if(a==='startoday'){S.start=todayS();S.startExact=true;save();toast('Day 1 is today. Let\'s go! 🚀');render()}
});
document.addEventListener('click',e=>{if(e.target.closest('#side a'))$('#side').classList.remove('open')});

