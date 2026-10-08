/* Spaced repetition (Leitner boxes) for interview questions.
   A question enters the review queue when you flag it, mark it prepared, or answer it in a quiz or mock.
   Right answer: it moves up a box and comes back later (3, 7, 14, 30, 60 days). Wrong answer: back to box 0, due tomorrow. */
const SR_DAYS=[1,3,7,14,30,60];
const inDays=n=>iso(addDays(new Date(),n));

function srOnFlag(id){const e=S.sr[id];if(!e)S.sr[id]={box:0,due:todayS(),n:0,miss:0};else{e.box=0;e.due=todayS()}}
function srOnPrepared(id){if(!S.sr[id])S.sr[id]={box:1,due:inDays(SR_DAYS[1]),n:0,miss:0}}
function srGood(id){
  const e=S.sr[id]||(S.sr[id]={box:0,due:todayS(),n:0,miss:0});
  e.box=Math.min(e.box+1,5);e.n++;e.due=inDays(SR_DAYS[e.box]);delete S.flag[id];
}
function srBad(id){
  const e=S.sr[id]||(S.sr[id]={box:0,due:todayS(),n:0,miss:0});
  e.box=0;e.miss=(e.miss||0)+1;e.due=inDays(1);S.flag[id]=1;
}
function srDue(limit){
  const t=todayS();
  return Object.keys(S.sr).filter(id=>S.sr[id].due<=t&&REG[id]).sort((a,b)=>{
    const x=S.sr[a],y=S.sr[b];return x.due.localeCompare(y.due)||x.box-y.box}).slice(0,limit||999);
}
function srCounts(){
  const t=todayS(),t1=inDays(1),t7=inDays(7);let due=0,over=0,tom=0,wk=0,mastered=0;const boxes=[0,0,0,0,0,0];
  Object.keys(S.sr).forEach(id=>{if(!REG[id])return;const e=S.sr[id];boxes[e.box]++;
    if(e.box>=5)mastered++;
    if(e.due<=t){due++;if(e.due<t)over++}else if(e.due===t1)tom++;else if(e.due<=t7)wk++});
  return {due,over,tom,wk,mastered,boxes,total:Object.keys(S.sr).filter(id=>REG[id]).length};
}

function pageReview(){
  const c=srCounts(),ids=srDue();
  const byK={};ids.forEach(id=>{const k=id.split(':')[1];byK[k]=(byK[k]||0)+1});
  const next=Object.keys(S.sr).filter(id=>REG[id]&&S.sr[id].due>todayS()).sort((a,b)=>S.sr[a].due.localeCompare(S.sr[b].due))[0];
  let h=`<h2>🔁 Review</h2><p class="lead">Questions you flagged, prepared or practised come back here just before you would forget them. A few minutes a day beats a long cram.</p>
  ${quizCard()}
  <div class="grid g4" style="margin-bottom:12px">
    <div class="card stat" style="margin:0"><b class="${c.due?'bad':'ok'}">${c.due}</b><span>due today${c.over?` (${c.over} overdue)`:''}</span></div>
    <div class="card stat" style="margin:0"><b>${c.tom}</b><span>due tomorrow</span></div>
    <div class="card stat" style="margin:0"><b>${c.wk}</b><span>later this week</span></div>
    <div class="card stat" style="margin:0"><b>${c.mastered}</b><span>mastered (box 5)</span></div>
  </div>`;
  if(!ui.quiz){
    if(c.due){
      h+=`<div class="card next-card"><b>${Math.min(c.due,15)} question${Math.min(c.due,15)>1?'s':''} ready for a quick review</b> (about ${Math.max(2,Math.round(Math.min(c.due,15)*0.8))} min)
      <div class="qa-actions"><button class="btn" data-act="quiz-start:review">▶ Start review</button></div>
      <p class="sm">Say the answer aloud first, reveal it, then be honest: <b>Got it</b> pushes the question further out, <b>Need revision</b> brings it back tomorrow.</p></div>
      <div class="card"><h3 style="margin-top:0">Due by topic</h3>${Object.keys(byK).map(k=>`<div style="display:flex;justify-content:space-between;padding:4px 0"><span>${QA[k].emoji} ${esc(QA[k].name)}</span><b>${byK[k]}</b></div>`).join('')}</div>`;
    }else{
      h+=`<div class="card next-card"><b>🎉 Nothing due today. You are all caught up.</b>${next?`<p class="sm">Next review: ${new Date(S.sr[next].due+'T00:00:00').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'short'})}.</p>`:'<p class="sm">Flag a question or mark one as prepared and it will show up here.</p>'}
      <div class="qa-actions"><a class="btn ghost" href="interview.html#quiz" style="text-decoration:none">🎲 Take a quick quiz instead</a><a class="btn ghost" href="mock.html" style="text-decoration:none">🎤 Try a mock interview</a></div></div>`;
    }
  }
  const mx=Math.max(1,...c.boxes);
  h+=`<div class="card"><h3 style="margin-top:0">Your boxes</h3><p class="sm">Box 0 = needs work. Box 5 = you have answered it well five times in a row.</p>
  ${c.boxes.map((n,i)=>`<div style="display:flex;gap:10px;align-items:center;margin:4px 0"><span class="sm" style="width:46px">Box ${i}</span><div class="bar" style="flex:1"><i style="width:${Math.round(n/mx*100)}%"></i></div><b style="width:28px;text-align:right">${n}</b></div>`).join('')}
  <p class="sm">${c.total} question${c.total===1?'':'s'} in the review system. Review intervals: 1, 3, 7, 14, 30, then 60 days.</p></div>`;
  return h;
}
