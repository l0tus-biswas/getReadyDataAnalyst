/* My Progress: daily goal, calendar heatmap, weekly summary, weak-spot report, study-time stats */
const AREA_TOPIC={sql:'sql',pbi:'pbi',excel:'excel',py:'py',stats:'stats',biz:'biz',survey:'survey',hr:'career'};

/* ---------- weak spots ---------- */
function weakSpots(){
  const t=todayS();
  return QORDER.map(k=>{
    const ids=qIds(k),total=ids.length;
    const prepared=ids.filter(i=>S.done[i]).length,flagged=ids.filter(i=>S.flag[i]).length;
    const miss=ids.filter(i=>S.sr[i]&&(S.sr[i].miss||0)>0&&S.sr[i].box<=1).length;
    const due=ids.filter(i=>S.sr[i]&&S.sr[i].due<=t).length;
    const tp=prog(tIds(AREA_TOPIC[k]),true);
    // average of this topic's last 5 mock results
    let ms=0,mn=0;S.mocks.slice(0,8).forEach(r=>{if(r.topics&&r.topics[k]&&mn<5*3){ms+=r.topics[k].s;mn+=r.topics[k].n*3}});
    const mock=mn?ms/mn:null;
    const comps=[[.30,1-prepared/total],[.20,Math.min(1,flagged/Math.max(5,total*.15))],[.15,Math.min(1,miss/Math.max(4,total*.1))],[.15,1-tp.p]];
    if(mock!==null)comps.push([.20,1-mock]);
    const wsum=comps.reduce((s,c)=>s+c[0],0),score=Math.round(comps.reduce((s,c)=>s+c[0]*c[1],0)/wsum*100);
    const why=[`${prepared}/${total} questions prepared`,`${tp.d}/${tp.t} must-know topics`];
    if(flagged)why.push(`${flagged} flagged`);if(miss)why.push(`${miss} missed in review`);if(due)why.push(`${due} due for review`);
    why.push(mock!==null?`mock average ${Math.round(mock*100)}%`:'no mock yet');
    return {k,score,why,flagged,due,prepared,total,mock};
  }).sort((a,b)=>b.score-a.score);
}

/* ---------- goals, heatmap, summaries ---------- */
const goalSec=()=>(S.goal||60)*60;
function goalStreak(){
  let n=0,d=new Date();d.setHours(0,0,0,0);
  if(((S.act[iso(d)]||{}).sec||0)<goalSec())d=addDays(d,-1);
  while(((S.act[iso(d)]||{}).sec||0)>=goalSec()){n++;d=addDays(d,-1)}
  return n;
}
function heatLevel(sec){const g=goalSec();return sec<=0?0:sec<g*.25?1:sec<g*.5?2:sec<g?3:4}
function heatmapHtml(){
  const WEEKS_SHOWN=20,today=new Date();today.setHours(0,0,0,0);
  const mon=addDays(today,-((today.getDay()+6)%7)-7*(WEEKS_SHOWN-1));
  let cells='';
  for(let i=0;i<WEEKS_SHOWN*7;i++){
    const d=addDays(mon,i),k=iso(d),a=S.act[k]||{},sec=a.sec||0,future=d>today;
    const rest=S.days[k]==='r',lvl=future?-1:(sec>0||S.days[k]===1)?Math.max(1,heatLevel(sec)):0;
    const tip=`${d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})}: ${future?'':sec?Math.round(sec/60)+' min active':rest?'rest day':'no study'}${a.tasks?` · ${a.tasks} tasks`:''}${a.prac?` · ${a.prac} practice`:''}`;
    cells+=`<i class="hm l${lvl}${rest?' rest':''}" title="${esc(tip)}"></i>`;
  }
  return `<div class="hm-wrap"><div class="hm-days"><span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span><span>Sun</span></div><div class="hm">${cells}</div></div>
  <div class="hm-legend sm">Less <i class="hm l0"></i><i class="hm l1"></i><i class="hm l2"></i><i class="hm l3"></i><i class="hm l4"></i> More (full colour = daily goal reached)</div>`;
}
function calWeekStats(offset){
  const today=new Date();today.setHours(0,0,0,0);
  const mon=addDays(today,-((today.getDay()+6)%7)-7*offset);
  const t={sec:0,tasks:0,prac:0,q:0,rev:0,mock:0,days:0,label:mon.toLocaleDateString('en-GB',{day:'numeric',month:'short'})};
  for(let i=0;i<7;i++){const k=iso(addDays(mon,i)),a=S.act[k];if(a){t.sec+=a.sec||0;t.tasks+=a.tasks||0;t.prac+=a.prac||0;t.q+=a.q||0;t.rev+=a.rev||0;t.mock+=a.mock||0}if((a&&a.sec>0)||S.days[k]===1)t.days++}
  return t;
}
function timeStats(){
  const ks=Object.keys(S.act).filter(k=>(S.act[k].sec||0)>0);
  const total=ks.reduce((s,k)=>s+S.act[k].sec,0);
  const best=ks.reduce((b,k)=>S.act[k].sec>(b?S.act[b].sec:0)?k:b,null);
  return {total,days:ks.length,avg:ks.length?total/ks.length:0,best};
}

function pageProgress(){
  const a=actOf(),sec=a.sec||0,g=goalSec(),ts=timeStats();
  const w0=calWeekStats(0),w1=calWeekStats(1);
  const weak=weakSpots();
  const delta=(x,y,u)=>x===y?'':`<span class="${x>y?'ok':'bad'}">${x>y?'▲':'▼'} ${Math.abs(x-y)}${u||''}</span>`;
  let h=`<h2>📊 My Progress</h2><p class="lead">Where your time goes, what you keep forgetting, and what to do next.</p>${quizCard()}
  <div class="grid g2"><div class="card" style="margin:0"><h3 style="margin-top:0">🎯 Today's goal</h3>
    <div style="font-size:30px;font-weight:800">${fmtH(sec)} <span class="sm" style="font-size:14px">of ${S.goal||60} min active</span></div>${bar(Math.min(1,sec/g))}
    <p class="sm">${sec>=g?'✅ Goal reached. Everything else today is a bonus.':`${Math.max(1,Math.ceil((g-sec)/60))} more minutes of active study to hit your goal.`} Goal streak: <b>${goalStreak()}</b> day${goalStreak()===1?'':'s'}.</p>
    <label class="sm">Daily goal <select id="goalsel2">${[15,30,45,60,90,120,180].map(m=>`<option value="${m}" ${m===(S.goal||60)?'selected':''}>${m} min</option>`).join('')}</select></label>
    <p class="sm">Only active time counts: tapping, typing, ticking and answering. Scrolling or leaving a tab open does not.</p></div>
  <div class="card" style="margin:0"><h3 style="margin-top:0">⏱ Study time</h3>
    <div class="grid g3" style="gap:8px"><div class="stat"><b>${fmtH(ts.total)}</b><span>total active</span></div><div class="stat"><b>${ts.days}</b><span>days studied</span></div><div class="stat"><b>${fmtH(ts.avg)}</b><span>avg per study day</span></div></div>
    <p class="sm" style="margin-bottom:0">${ts.best?`Best day: ${new Date(ts.best+'T00:00:00').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'short'})} (${fmtH(S.act[ts.best].sec)}).`:'Start studying and your time will show up here.'}</p></div></div>
  <div class="card"><h3 style="margin-top:0">📅 Study calendar</h3>${heatmapHtml()}</div>
  <div class="card"><h3 style="margin-top:0">📈 Weekly summary</h3><div style="overflow:auto"><table><tr><th>Week of</th><th>Active time</th><th>Days</th><th>Tasks</th><th>Practice</th><th>Qs prepared</th><th>Reviews</th><th>Mocks</th></tr>
  ${[0,1,2,3,4,5].map(o=>{const w=calWeekStats(o);return `<tr><td>${w.label}${o===0?' <span class="sm">(this week)</span>':''}</td><td>${fmtH(w.sec)}</td><td>${w.days}/7</td><td>${w.tasks}</td><td>${w.prac}</td><td>${w.q}</td><td>${w.rev}</td><td>${w.mock}</td></tr>`}).join('')}</table></div>
  <p class="sm">This week vs last: active time ${delta(Math.round(w0.sec/60),Math.round(w1.sec/60),' min')||'same'} · tasks ${delta(w0.tasks,w1.tasks)||'same'} · practice ${delta(w0.prac,w1.prac)||'same'}</p></div>
  <div class="card"><h3 style="margin-top:0">🔎 Weak-spot report</h3><p class="sm">Ranked from your own data: questions not yet prepared, flagged or missed in review, must-know topics not finished, and mock results. Highest score = needs the most attention.</p>
  ${weak.map((x,i)=>`<div class="weak ${i<3?'top':''}"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b>${i<3?'🎯 ':''}${QA[x.k].emoji} ${esc(QA[x.k].name)}</b><span class="${x.score>=60?'bad':x.score>=40?'':'ok'}"><b>${x.score}</b> <span class="sm">weakness</span></span></div>
    <div class="bar" style="margin:4px 0"><i style="width:${x.score}%"></i></div><div class="sm">${x.why.join(' · ')}</div>
    ${i<3?`<div class="qa-actions" style="margin:6px 0 0"><button class="chip" data-act="quiz-start:${x.k}">🎲 Quiz me (flagged first)</button><a class="chip" href="qa-${x.k}.html" style="text-decoration:none">📖 Questions</a><a class="chip" href="mock.html" style="text-decoration:none">🎤 Mock</a></div>`:''}</div>`).join('')}</div>`;
  const hist=S.mocks.slice(0,10).reverse();
  if(hist.length)h+=`<div class="card"><h3 style="margin-top:0">🎤 Mock interview scores</h3><div class="spark">${hist.map(r=>`<div class="sp-col" title="${esc(r.name)} ${r.d}: ${r.score}%"><i style="height:${Math.max(4,r.score)}%"></i><span>${r.score}</span></div>`).join('')}</div></div>`;
  return h;
}
document.addEventListener('change',e=>{if(e.target.id==='goalsel2'){S.goal=+e.target.value;save();render()}});
