/* Mock interview: a timed set of questions picked from your weak spots, self-scored, with a report.
   Picks favour questions you flagged, that are due for review, that you have not prepared yet and that are asked most often. */
const MOCK_PRESETS={
  sql:{name:'SQL sprint',emoji:'🗄️',min:20,quota:{sql:5},desc:'5 SQL questions in 20 minutes.'},
  tech:{name:'Technical round',emoji:'💻',min:35,quota:{sql:3,pbi:2,excel:1,py:1,stats:1},desc:'8 questions: SQL, Power BI/DAX, Excel, Python, statistics. 35 minutes.'},
  loop:{name:'Full interview loop',emoji:'🎯',min:50,quota:{sql:4,pbi:2,excel:1,py:2,stats:2,biz:2,hr:1},desc:'14 questions across every area. 50 minutes.'},
  cases:{name:'Cases and HR',emoji:'🧠',min:25,quota:{biz:3,survey:1,hr:3},desc:'Business cases, survey analytics and behavioural questions. 25 minutes.'}
};
const MK={iv:null};
const SCORE_LABEL=['Missed it','Partly','Good','Nailed it'];
const mockRunning=()=>!!(ui.mock&&ui.mock.phase==='run');

function mockPick(quota,hard){
  const out=[];const seen=S.mockSeen||{};
  Object.keys(quota).forEach(k=>{
    const c=QA[k].list.map((q,i)=>({id:`q:${k}:${i}`,k,i,q})).filter(x=>hard||x.q.lvl!=='H');
    c.forEach(x=>{x.s=(S.flag[x.id]?3:0)+(S.sr[x.id]&&S.sr[x.id].due<=todayS()?2:0)+(!S.done[x.id]?1.5:0)+(x.q.freq||2)/3-(seen[x.id]?1:0)+Math.random()*0.8});
    c.sort((a,b)=>b.s-a.s).slice(0,quota[k]).forEach(x=>out.push({id:x.id,k:x.k,i:x.i,sc:null,ans:'',shown:false,skipped:false,sec:0,t0:0}));
  });
  return out;
}
function mockStart(key){
  let preset=MOCK_PRESETS[key],quota,min,name;
  if(preset){quota=preset.quota;min=preset.min;name=preset.name}
  else if(key.startsWith('topic:')){const k=key.slice(6);quota={[k]:Math.min(6,QA[k].list.length)};min=20;name=QA[k].name+' drill'}
  else return;
  const qs=mockPick(quota,!!ui.mockHard);
  if(!qs.length){toast('No questions available for that set.');return}
  ui.mock={phase:'run',key,name,min,qs,cur:0,start:Date.now(),endAt:Date.now()+min*60000};
  qs[0].t0=Date.now();
  clearInterval(MK.iv);MK.iv=setInterval(mockTick,1000);
  window.onbeforeunload=()=>'Your mock interview is in progress.';
}
function mockTick(){
  const m=ui.mock;if(!m||m.phase!=='run'){clearInterval(MK.iv);return}
  const left=Math.round((m.endAt-Date.now())/1000);
  const el=document.getElementById('mocktime');
  if(el){el.textContent=fmtMS(left);el.classList.toggle('bad',left<=60)}
  if(left<=0)mockFinish('time');
}
function mockNext(){
  const m=ui.mock;const q=m.qs[m.cur];if(q.t0)q.sec=Math.round((Date.now()-q.t0)/1000);
  m.cur++;
  if(m.cur>=m.qs.length)mockFinish('done');else m.qs[m.cur].t0=Date.now();
}
function mockFinish(reason){
  const m=ui.mock;if(!m||m.phase!=='run')return;
  clearInterval(MK.iv);window.onbeforeunload=null;
  const cq=m.qs[m.cur];if(cq&&cq.t0&&!cq.sc&&cq.sc!==0)cq.sec=Math.round((Date.now()-cq.t0)/1000);
  if(!S.mockSeen)S.mockSeen={};
  const topics={};let sum=0;
  m.qs.forEach(q=>{
    const sc=q.sc===null?0:q.sc;sum+=sc;
    const t=topics[q.k]||(topics[q.k]={s:0,n:0});t.s+=sc;t.n++;
    if(q.sc!==null||q.shown){S.mockSeen[q.id]=(S.mockSeen[q.id]||0)+1;if(q.sc!==null&&q.sc>=2)srGood(q.id);else if(q.sc!==null||q.shown)srBad(q.id)}
  });
  const n=m.qs.length,pctScore=Math.round(sum/(3*n)*100),mins=Math.max(1,Math.round((Date.now()-m.start)/60000));
  m.res={score:pctScore,mins,topics,reason,sum,n};
  m.phase='done';
  S.mocks.unshift({d:todayS(),ts:Date.now(),key:m.key,name:m.name,n,score:pctScore,mins,topics});S.mocks=S.mocks.slice(0,40);
  logAct('mock');S.days[todayS()]=1;
  const x=bonus('mock'+todayS(),20);
  celebrate({big:pctScore>=80,emoji:pctScore>=80?'🏆':pctScore>=60?'💪':'🌱',title:`Mock interview done: ${pctScore}%`,sub:pctScore>=80?'Interview-ready on this set. Keep it sharp.':pctScore>=60?'Solid. Tighten the weak spots below.':'Good practice. The review queue now has your misses.',xp:x});
  afterChange();render();
}
function pageMock(){
  const m=ui.mock;
  if(m&&m.phase==='run')return mockRunHtml(m);
  if(m&&m.phase==='done')return mockDoneHtml(m);
  const hist=S.mocks.slice(0,8);
  let h=`<h2>🎤 Mock Interview</h2><p class="lead">A timed run that feels like the real thing. Questions come from your weak spots first. Say or type your answer, reveal the model answer, then score yourself honestly. Misses go straight into your <a href="review.html">review queue</a>.</p>
  <div class="chips"><label class="chip ${ui.mockHard?'on':''}" style="cursor:pointer"><input type="checkbox" data-act="mock-hard" ${ui.mockHard?'checked':''} style="display:none">Include hard questions</label></div>
  <div class="grid g2">${Object.keys(MOCK_PRESETS).map(k=>{const p=MOCK_PRESETS[k];return `<div class="card" style="margin:0"><div style="font-size:30px">${p.emoji}</div><h3 style="margin:4px 0">${esc(p.name)}</h3><p class="sm">${esc(p.desc)}</p><button class="btn" data-act="mock-start:${k}">Start</button></div>`}).join('')}</div>
  <div class="card"><h3 style="margin-top:0">Drill one topic</h3><div class="qa-actions" style="margin:0"><select id="mocktopic">${QORDER.map(k=>`<option value="${k}">${QA[k].emoji} ${esc(QA[k].name)}</option>`).join('')}</select><button class="btn ghost" data-act="mock-topic">Start 6-question drill (20 min)</button></div></div>`;
  if(hist.length){
    h+=`<div class="card"><h3 style="margin-top:0">Your recent mocks</h3>${hist.map(r=>`<div style="display:flex;gap:10px;align-items:center;margin:6px 0"><span class="sm" style="width:84px">${new Date(r.d+'T00:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</span><span style="width:150px;font-size:13px">${esc(r.name)}</span><div class="bar" style="flex:1"><i style="width:${r.score}%"></i></div><b style="width:44px;text-align:right">${r.score}%</b></div>`).join('')}</div>`;
  }
  h+=`<div class="note"><b>Tips:</b> answer out loud as if someone is listening, ask yourself a clarifying question first, and for SQL write the query before revealing. A mock counts toward your study time while you interact.</div>`;
  return h;
}
function mockRunHtml(m){
  const q=m.qs[m.cur],item=QA[q.k].list[q.i];
  const left=Math.round((m.endAt-Date.now())/1000);
  let h=`<div class="mock-head"><div><b>Question ${m.cur+1} of ${m.qs.length}</b> <span class="sm">· ${esc(m.name)}</span></div><div class="mock-time ${left<=60?'bad':''}" id="mocktime">${fmtMS(left)}</div></div>
  <div class="bar" style="margin:6px 0 12px"><i style="width:${Math.round(m.cur/m.qs.length*100)}%"></i></div>
  <div class="card quiz"><div class="sm">${QA[q.k].emoji} ${esc(QA[q.k].name)} · ${lvlBadge(item.lvl)}</div><h3 class="qtext">${esc(item.q)}</h3>
  <textarea id="mockans" class="note-box" rows="${q.k==='sql'||q.k==='py'?7:4}" placeholder="${q.k==='sql'?'Write your query here…':'Type your key points (or just say them out loud)…'}">${esc(q.ans)}</textarea>`;
  if(!q.shown){
    h+=`<div class="qa-actions"><button class="btn" data-act="mock-reveal">Reveal model answer</button><button class="btn ghost" data-act="mock-skip">Skip</button></div>`;
  }else{
    h+=`${item.short?`<div class="say"><b>🗣️ Say it like this:</b><br>${item.short}</div>`:''}<div class="full">${item.a}</div>
    ${item.follow&&item.follow.length?`<div class="fu"><b>↪ Likely follow-ups</b><ul>${item.follow.map(f=>`<li>${f}</li>`).join('')}</ul></div>`:''}
    <p><b>How did you do?</b></p><div class="qa-actions" style="margin-top:0">${SCORE_LABEL.map((l,i)=>`<button class="btn ${i<2?'ghost':''}" data-act="mock-score:${i}">${['😬','🤔','👍','🔥'][i]} ${l}</button>`).join('')}</div>`;
  }
  h+=`</div><div class="qa-actions"><button class="btn ghost" data-act="mock-end">End interview now</button></div>`;
  return h;
}
function mockDoneHtml(m){
  const r=m.res;
  const rows=Object.keys(r.topics).map(k=>({k,p:Math.round(r.topics[k].s/(3*r.topics[k].n)*100),n:r.topics[k].n})).sort((a,b)=>a.p-b.p);
  let h=`<h2>📋 Mock interview report</h2><div class="card hero" style="color:#fff"><div class="big" style="font-size:44px">${r.score}%</div><div><div class="big" style="font-size:20px">${r.score>=80?'Interview-ready on this set':r.score>=60?'Solid, with gaps to close':r.score>=40?'Getting there':'Needs more practice'}</div><div style="opacity:.9">${esc(m.name)} · ${r.n} questions · ${r.mins} min${r.reason==='time'?' · time ran out':''}</div></div></div>
  <div class="card"><h3 style="margin-top:0">By topic</h3>${rows.map(x=>`<div style="display:flex;gap:10px;align-items:center;margin:6px 0"><span style="width:170px">${QA[x.k].emoji} ${esc(QA[x.k].name)}</span><div class="bar" style="flex:1"><i style="width:${x.p}%"></i></div><b style="width:90px;text-align:right">${x.p}% <span class="sm">(${x.n})</span></b></div>`).join('')}
  ${rows[0]&&rows[0].p<70?`<p class="note">Weakest area: <b>${esc(QA[rows[0].k].name)}</b>. <a href="qa-${rows[0].k}.html">Study its questions</a> or run a <button class="chip" data-act="mock-topic2:${rows[0].k}">6-question drill</button>.</p>`:''}</div>
  <div class="card"><h3 style="margin-top:0">Question by question</h3>${m.qs.map(q=>{const it=QA[q.k].list[q.i];const sc=q.sc===null?0:q.sc;return `<div style="display:flex;gap:10px;align-items:flex-start;padding:6px 0;border-bottom:1px solid var(--line)"><span class="lvl ${sc>=2?'lvl-E':sc===1?'lvl-M':'lvl-H'}">${q.sc===null?'Skipped':SCORE_LABEL[sc]}</span><span style="flex:1"><a href="qa-${q.k}.html#q-${q.k}-${q.i}">${esc(it.q)}</a><span class="sm"> · ${q.sec||0}s</span></span></div>`}).join('')}
  <p class="sm">Questions you did not score 2 or higher on have been added to your <a href="review.html">review queue</a>, due tomorrow.</p></div>
  <div class="qa-actions"><button class="btn" data-act="mock-again">Run another mock</button><a class="btn ghost" href="progress.html" style="text-decoration:none">See my progress</a></div>`;
  return h;
}
document.addEventListener('click',e=>{
  const b=e.target.closest&&e.target.closest('[data-act^="mock-"]');if(!b||b.tagName==='INPUT')return;
  const [a,arg]=b.dataset.act.split(/:(.*)/s);const m=ui.mock;
  if(a==='mock-start'){mockStart(arg);render()}
  else if(a==='mock-topic'){const k=document.getElementById('mocktopic').value;mockStart('topic:'+k);render()}
  else if(a==='mock-topic2'){mockStart('topic:'+arg);render()}
  else if(a==='mock-reveal'&&m){m.qs[m.cur].shown=true;render()}
  else if(a==='mock-score'&&m){m.qs[m.cur].sc=+arg;mockNext();if(m.phase==='run')render()}
  else if(a==='mock-skip'&&m){m.qs[m.cur].skipped=true;mockNext();if(m.phase==='run')render()}
  else if(a==='mock-end'&&m){if(confirm('End the interview now? Unanswered questions count as zero.'))mockFinish('ended')}
  else if(a==='mock-again'){ui.mock=null;render()}
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.matches&&t.matches('input[data-act="mock-hard"]')){ui.mockHard=t.checked;render()}
});
document.addEventListener('input',e=>{
  if(e.target.id==='mockans'&&ui.mock&&ui.mock.phase==='run')ui.mock.qs[ui.mock.cur].ans=e.target.value;
});
