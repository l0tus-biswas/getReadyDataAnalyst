function pageDashboard(){
  const c=calc(),li=level(c.ready),L=LEVELS[li],nx=LEVELS[li+1];
  const idx=dayIdx();let wk=idx<0?0:Math.floor(idx/7)+1;
  const done=wk>12;
  // today
  let todayHtml='';
  if(idx<0){todayHtml=`<p>Your plan starts on <b>${dayDate(1,0)}</b> (in ${-idx} day${-idx>1?'s':''}). Use the time to set up SQL + GitHub, or change the start date in Settings.</p>`}
  else if(done){todayHtml=`<p>🎉 You've completed the 12-week plan. Keep applying (5 a day) and practising SQL daily.</p>`}
  else{const di=idx%7,tasks=WEEKS[wk-1].days[di].filter(t=>!(S.mustOnly&&t.tag!=='M'));
    todayHtml=`<p class="sm">Week ${wk} · ${DAYN[di]} (${dayDate(wk,di)}) · ${di<5?'~1.5 hrs':'~3.5 hrs'} · <b>${WEEKS[wk-1].title}</b></p>`+tasks.map(t=>chk(t.id,t.text,t.tag)).join('')+
      `<div class="qa-actions"><button class="btn ghost" data-act="rest">😴 Mark today as rest day (keeps streak)</button><a class="btn" href="week-${wk}.html#day-${di}" style="text-decoration:none">📖 Today's detailed guide</a><a class="btn ghost" href="plan.html" style="text-decoration:none">Open full plan</a></div>`}
  // behind/ahead
  let pace='';
  if(idx>=0&&!done){let exp=0,dn=0;WEEKS.forEach(w=>w.days.forEach((d,di)=>d.forEach(t=>{if(t.tag==='M'){if((w.n-1)*7+di<idx)exp++;if(S.done[t.id])dn++}})));
    const diff=dn-exp;pace=diff>=0?`<span class="ok">✅ On track${diff>0?` (+${diff} ahead)`:''}</span>`:`<span class="bad">⚠️ ${-diff} mandatory task${-diff>1?'s':''} behind. Catch up on your next long day (Day 6 or 7).</span>`}
  // journey
  const nodes=WEEKS.map(w=>{const p=prog(weekIds(w.n,true));const cl=p.p===1?'done':(w.n===wk?'cur':'');return `<div class="node ${cl}"><b>${p.p===1?'✓':w.n}</b>W${w.n}</div>`}).join('')+`<div class="node goal"><b>🏆</b>Offer</div>`;
  const rk=28+(c.ready)*(100-0);
  const kt=c.k;
  // next best action: first undone must-do task that is due (or the next one in the plan)
  let nextHtml='';
  {let due=null,nxt=null;
   WEEKS.forEach(w=>w.days.forEach((d,di)=>d.forEach(t=>{if(t.tag==='M'&&!S.done[t.id]){const pos=(w.n-1)*7+di;if(!nxt)nxt=t;if(pos<=idx&&!due)due=t}})));
   const t=due||nxt,fl=Object.keys(S.flag).length;
   nextHtml=`<div class="card next-card"><div class="sm">${due?(due.w*7-7+due.d<idx?'⏪ CATCH UP FIRST':'👉 DO THIS NEXT'):(t?'👉 NEXT IN YOUR PLAN':'')}</div>
   ${t?`<p style="margin:4px 0 10px"><b>Week ${t.w} · ${DAYN[t.d]} (${dayDate(t.w,t.d)}):</b> ${esc(t.text)}</p><div class="qa-actions" style="margin:0"><a class="btn" href="week-${t.w}.html#day-${t.d}" style="text-decoration:none">📖 Open the guide for this</a>`:'<p>🎉 All must-do plan tasks are complete.</p><div class="qa-actions" style="margin:0">'}
   <a class="btn ghost" href="interview.html#quiz" style="text-decoration:none">🎲 5-minute quiz</a>${fl?`<a class="btn ghost" href="review.html" style="text-decoration:none">🔁 Review ${fl} flagged</a>`:''}</div></div>`}
  // extras: daily goal, spaced-repetition reviews, weekly check-in, carried-over tasks
  let extras='';
  {
    const sec=(actOf().sec||0),g=(S.goal||60)*60,rc=srCounts(),cd=ciDue();
    const carried=S.carry.filter(id=>REG[id]&&!S.done[id]).slice(0,6);
    extras=`<div class="grid g2" style="margin-bottom:14px">
      <div class="card" style="margin:0"><div class="sm">🎯 TODAY'S GOAL · active study time</div>
        <div style="font-size:26px;font-weight:800">${fmtH(sec)} <span class="sm" style="font-size:13px">/ ${S.goal||60} min</span></div>${bar(Math.min(1,sec/g))}
        <p class="sm" style="margin:6px 0 0">${sec>=g?'✅ Goal reached!':'Counts only while you tap, type, tick or answer. Scrolling does not count.'} <a href="progress.html">See progress →</a></p></div>
      <div class="card" style="margin:0"><div class="sm">🔁 SPACED REVIEW</div>
        ${rc.due?`<div style="font-size:26px;font-weight:800" class="bad">${rc.due} due</div><p class="sm" style="margin:2px 0 8px">About ${Math.max(2,Math.round(Math.min(rc.due,15)*.8))} minutes. Reviewing on time is what makes answers stick.</p><a class="btn" href="review.html" style="text-decoration:none">▶ Start review</a>`
        :`<div style="font-size:22px;font-weight:800" class="ok">All caught up ✅</div><p class="sm" style="margin:2px 0 0">${rc.total?`${rc.total} questions in rotation, ${rc.tom} due tomorrow.`:'Flag or prepare questions and they will be scheduled here.'}</p>`}</div></div>
    ${cd?`<div class="card next-card" style="border-left-color:var(--brand)"><b>📋 Weekly check-in ready for Week ${cd}</b><p class="sm" style="margin:4px 0 8px">Two minutes to look back, carry leftovers forward and reset.</p><a class="btn" href="checkin.html" style="text-decoration:none">Open check-in</a></div>`:''}
    ${carried.length?`<div class="card"><h3 style="margin-top:0">🧳 Carried over from earlier weeks</h3>${carried.map(id=>{const m=id.match(/^w(\d+)d(\d)t(\d+)$/),t=WEEKS[+m[1]-1].days[+m[2]][+m[3]];return chk(id,t.text,t.tag)}).join('')}</div>`:''}`;
  }
  return `
  <div class="card hero">${ring(c.ready)}
    <div style="flex:1;min-width:230px">
      <div class="sm" style="color:#fff;opacity:.85">JOB READINESS (mandatory items only)</div>
      <div class="big">${L[2]} ${L[1]}</div>
      <div style="margin:8px 0">${bar(nx?(c.ready*100-L[0])/(nx[0]-L[0]):1)}</div>
      <div style="opacity:.9">${nx?`${Math.max(0,Math.ceil(nx[0]-c.ready*100))}% more to reach <b>${nx[2]} ${nx[1]}</b>`:'You made it!'}</div>
      <div style="margin-top:8px;opacity:.95">${wk>0&&!done?`Week <b>${wk}</b> of 12`:''} ${pace?'· '+pace:''}</div>
    </div>
  </div>
  ${nextHtml}
  ${extras}
  <div class="grid g4" style="margin-bottom:14px">
    <div class="card stat"><b>⭐ ${c.xp}</b><span>XP earned</span></div>
    <div class="card stat"><b>🔥 ${streak()}</b><span>day streak (best ${bestStreak()})</span></div>
    <div class="card stat"><b>${kt.task.md}/${kt.task.mt}</b><span>mandatory plan tasks</span></div>
    <div class="card stat"><b>${kt.q.d}/${kt.q.t}</b><span>interview Qs prepared</span></div>
  </div>
  <div class="card"><h3 style="margin-top:0">🗺️ Your journey to the offer</h3><div class="journey"><div class="track"><div class="line"></div><div class="fill" style="width:calc((100% - 56px)*${c.ready})"></div><div class="rocket" style="left:calc(28px + (100% - 56px)*${c.ready})">🚀</div><div class="nodes">${nodes}</div></div></div></div>
  <div class="grid g2">
    <div class="card"><h3 style="margin-top:0">📅 Today's mission</h3>${todayHtml}</div>
    <div class="card"><h3 style="margin-top:0">📈 Progress by area</h3>
      ${[['SQL topics',prog(tIds('sql'),true)],['Power BI topics',prog(tIds('pbi'),true)],['Python topics',prog(tIds('py'),true)],['Stats topics',prog(tIds('stats'),true)],['Projects (mandatory)',prog(PROJECTS.filter(p=>p.tag==='M').flatMap(pIds))],['Interview Q&A',prog(Object.keys(QA).flatMap(qIds))],['Job-hunt checklist',prog(JOBS.map((j,i)=>`j:${i}`))]].map(([n,p])=>`<div style="margin:8px 0"><div style="display:flex;justify-content:space-between"><span>${n}</span><span class="sm">${p.d}/${p.t}</span></div>${bar(p.p)}</div>`).join('')}
    </div>
  </div>
  <div class="card"><h3 style="margin-top:0">🏅 Badges (${Object.keys(S.badges).length}/${BADGES.length})</h3><div class="grid g4">${BADGES.map(b=>`<div class="badge ${S.badges[b[0]]?'got':''}"><b>${b[1]}</b><span>${esc(b[2])}</span><small>${esc(b[3])}</small></div>`).join('')}</div></div>
  <div class="note">💬 ${QUOTES[new Date().getDate()%QUOTES.length]}</div>
  <div class="note"><b>How it works:</b> Tick tasks to earn XP. <span class="tag M">MUST</span> items count toward Job Readiness; <span class="tag O">OPTIONAL</span> and <span class="tag A">ADVANCED</span> are bonus XP and can be skipped for interviews. Days 1-5 of each week are about 1.5 hrs; Days 6-7 are about 3.5 hrs.</div>`;
}
