/* Weekly check-in: see how the week went, carry leftovers forward, adjust the plan, reflect. */
const CI_MOODS=['😫','😕','😐','🙂','🤩'];
const CI_BLOCKERS=['Busy at work','Tired or low energy','A topic was hard','Lost motivation','Unwell','Travel or family','Nothing, it went well'];

function ciDefaultWeek(){
  const idx=dayIdx();if(idx<0)return 0;
  const wk=Math.min(12,Math.floor(idx/7)+1),day=idx%7;
  return (day>=5||idx>=84)?wk:Math.max(1,wk-1);
}
const ciWeekNow=()=>ui.ciWeek||ciDefaultWeek()||1;
// the working draft of the form for week n (starts as the saved check-in, if any)
function ciDraft(n){
  if(!ui.ci||ui.ci._w!==n){ui.ci=S.checkins[n]?JSON.parse(JSON.stringify(S.checkins[n])):{mood:0,blockers:[],win:'',change:''};ui.ci._w=n}
  return ui.ci;
}
function weekDates(n){const a=[];for(let i=0;i<7;i++)a.push(iso(addDays(pd(S.start),(n-1)*7+i)));return a}
function weekStats(n){
  const mp=prog(weekIds(n,true)),dates=weekDates(n);
  const t={sec:0,tasks:0,prac:0,q:0,rev:0,mock:0,days:0};
  dates.forEach(d=>{const a=S.act[d];if(a){t.sec+=a.sec||0;t.tasks+=a.tasks||0;t.prac+=a.prac||0;t.q+=a.q||0;t.rev+=a.rev||0;t.mock+=a.mock||0;if((a.sec||0)>0||S.days[d]===1)t.days++}else if(S.days[d]===1)t.days++});
  t.prac=Math.max(t.prac,Object.keys(S.prac).filter(k=>k.startsWith(`pr:${n}:`)).length);
  return Object.assign({must:mp,leftover:weekIds(n,true).filter(id=>!S.done[id])},t);
}
function ciAdvice(c){
  const tips=[];const b=c.blockers||[];
  if(b.includes('Busy at work'))tips.push('Switch on <b>Busy mode</b> (Plan page) so you only see must-do tasks, and protect two fixed slots a week.');
  if(b.includes('Tired or low energy'))tips.push('Lower your daily goal to 30 minutes for a week. Short and consistent beats long and skipped.');
  if(b.includes('A topic was hard'))tips.push('Use <b>Review</b> and the topic drill on the hard area, and write what confused you in that day\'s note.');
  if(b.includes('Lost motivation'))tips.push('Do one 15-minute focus session today and finish one small task. Momentum returns after a win.');
  if(b.includes('Unwell')||b.includes('Travel or family'))tips.push('Use "Shift my plan later" so you do not feel behind. Rest is part of the plan.');
  if(c.mood<=2&&!tips.length)tips.push('A rough week is normal. Pick the single most important task for tomorrow and do only that.');
  if(c.mood>=4)tips.push('Strong week. Keep the same routine and add one mock interview.');
  return tips;
}
function pageCheckin(){
  const cur=Math.min(12,Math.max(0,Math.floor(dayIdx()/7)+1));
  if(dayIdx()<0)return `<h2>📋 Weekly check-in</h2><div class="note">Your plan has not started yet. The first check-in is on Day 6 or 7 of Week 1.</div>`;
  const n=ui.ciWeek||ciDefaultWeek()||1;
  const st=weekStats(n),saved=S.checkins[n],w=WEEKS[n-1];
  const dates=weekDates(n);
  let h=`<h2>📋 Weekly check-in</h2><p class="lead">Two minutes to look back, reset and set up next week. It keeps you honest without making you feel behind.</p>
  <div class="chips">${Array.from({length:Math.min(12,Math.max(cur,1))},(_,i)=>i+1).map(i=>`<button class="chip ${i===n?'on':''}" data-act="ciweek:${i}">${S.checkins[i]?'✓ ':''}Week ${i}</button>`).join('')}</div>
  <div class="card"><h3 style="margin-top:0">Week ${n}: ${esc(w.title)} <span class="sm">${new Date(dates[0]+'T00:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'})} – ${new Date(dates[6]+'T00:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</span></h3>
  <div class="grid g4"><div class="card stat" style="margin:0"><b>${st.must.d}/${st.must.t}</b><span>must-do tasks</span>${bar(st.must.p)}</div>
  <div class="card stat" style="margin:0"><b>${fmtH(st.sec)}</b><span>active study time</span></div>
  <div class="card stat" style="margin:0"><b>${st.days}/7</b><span>days you studied</span></div>
  <div class="card stat" style="margin:0"><b>${st.prac}</b><span>practice solved</span></div>
  <div class="card stat" style="margin:0"><b>${st.q}</b><span>questions prepared</span></div>
  <div class="card stat" style="margin:0"><b>${st.rev}</b><span>reviews done</span></div>
  <div class="card stat" style="margin:0"><b>${st.mock}</b><span>mock interviews</span></div></div>
  <p class="sm" style="margin-bottom:0">Deliverable for this week: ${esc(w.deliver)}</p></div>`;
  if(st.leftover.length){
    const carried=st.leftover.filter(id=>S.carry.includes(id)).length;
    h+=`<div class="card"><h3 style="margin-top:0">🧳 Not finished yet (${st.leftover.length})</h3>${st.leftover.map(id=>{const m=id.match(/^w(\d+)d(\d)t(\d+)$/),t=WEEKS[+m[1]-1].days[+m[2]][+m[3]];return chk(id,t.text,t.tag)}).join('')}
    <div class="qa-actions"><button class="btn" data-act="ci-carry:${n}">Carry these into next week${carried?` (${carried} already carried)`:''}</button></div>
    <p class="sm">Carried tasks appear on your dashboard until you finish them.</p>
    <p><b>Fallen behind?</b> Move the whole plan later so it matches reality:</p>
    <div class="qa-actions" style="margin:0">${[1,2,3,7].map(d=>`<button class="chip" data-act="ci-shift:${d}">Shift plan ${d} day${d>1?'s':''} later</button>`).join('')}</div></div>`;
  }else h+=`<div class="note">🎉 Every must-do task of this week is done.</div>`;
  const c=ciDraft(n);
  h+=`<div class="card"><h3 style="margin-top:0">${saved?'Your check-in (saved)':'How was your week?'}</h3>
  <p class="sm">How did it feel?</p><div class="qa-actions" style="margin:0">${CI_MOODS.map((m,i)=>`<button class="chip mood ${c.mood===i+1?'on':''}" data-act="cimood:${i+1}" aria-label="mood ${i+1}">${m}</button>`).join('')}</div>
  <p class="sm">What got in the way? (pick any)</p><div class="chips">${CI_BLOCKERS.map(b=>`<button class="chip ${(c.blockers||[]).includes(b)?'on':''}" data-act="ciblock:${esc(b)}">${esc(b)}</button>`).join('')}</div>
  <p class="sm">Biggest win this week</p><input type="text" id="ciwin" value="${esc(c.win||'')}" style="width:100%" placeholder="e.g. Finally understood window functions">
  <p class="sm">One thing I will do differently next week</p><input type="text" id="cichange" value="${esc(c.change||'')}" style="width:100%" placeholder="e.g. Study before work, not after">
  <div class="qa-actions"><button class="btn" data-act="ci-save:${n}">${saved?'Update check-in':'Save check-in'}</button></div>
  ${(()=>{const tips=ciAdvice(c);return tips.length&&(saved||c.mood)?`<div class="note"><b>Suggestions:</b><ul style="margin:6px 0 0 18px">${tips.map(t=>`<li>${t}</li>`).join('')}</ul></div>`:''})()}</div>`;
  const past=Object.keys(S.checkins).map(Number).sort((a,b)=>b-a);
  if(past.length)h+=`<div class="card"><h3 style="margin-top:0">Past check-ins</h3>${past.map(k=>{const x=S.checkins[k];return `<div style="padding:6px 0;border-bottom:1px solid var(--line)"><b>Week ${k}</b> ${CI_MOODS[(x.mood||3)-1]} <span class="sm">${x.done}/${x.total} tasks · ${fmtH(x.sec||0)}</span>${x.win?`<div class="sm">🏆 ${esc(x.win)}</div>`:''}${x.change?`<div class="sm">➡ ${esc(x.change)}</div>`:''}</div>`}).join('')}</div>`;
  return h;
}
document.addEventListener('click',e=>{
  const b=e.target.closest&&e.target.closest('[data-act]');if(!b||b.tagName==='INPUT')return;
  const [a,arg]=b.dataset.act.split(/:(.*)/s);
  if(a==='ciweek'){ui.ciWeek=+arg;ui.ci=null;render()}
  else if(a==='cimood'){ciDraft(ciWeekNow()).mood=+arg;render()}
  else if(a==='ciblock'){const d=ciDraft(ciWeekNow()),i=d.blockers.indexOf(arg);if(i>=0)d.blockers.splice(i,1);else d.blockers.push(arg);render()}
  else if(a==='ci-carry'){const n=+arg;const left=weekStats(n).leftover;left.forEach(id=>{if(!S.carry.includes(id))S.carry.push(id)});save();toast(left.length+' task'+(left.length===1?'':'s')+' carried into next week');render()}
  else if(a==='ci-shift'){const d=+arg;S.start=iso(addDays(pd(S.start),d));S.startExact=true;save();toast('Plan shifted '+d+' day'+(d>1?'s':'')+' later. Day 1 is now '+dayDate(1,0));render()}
  else if(a==='ci-save'){
    const n=+arg,st=weekStats(n),c=ciDraft(n);
    if(!c.mood){toast('Pick how the week felt first.');return}
    const first=!S.checkins[n];
    S.checkins[n]={ts:Date.now(),mood:c.mood,blockers:c.blockers.slice(),win:c.win||'',change:c.change||'',done:st.must.d,total:st.must.t,sec:st.sec};
    const x=first?bonus('checkin'+n,15):0;save();
    if(first)celebrate({emoji:'📋',title:`Week ${n} check-in done!`,sub:'Looking back is how you speed up. See you next week.',xp:x});
    else toast('Check-in updated');
    afterChange();render();
  }
});
document.addEventListener('input',e=>{
  if(e.target.id==='ciwin'||e.target.id==='cichange')ciDraft(ciWeekNow())[e.target.id==='ciwin'?'win':'change']=e.target.value;
});
