/* Detailed week guide page: what to study, how to do it, example, practice, interview questions */
function pracIds(n){const g=GUIDES[n],a=[];if(g)g.days.forEach((d,di)=>d.practice.forEach((q,i)=>a.push(`pr:${n}:${di}:${i}`)));return a}
function pageWeek(n){
  const w=WEEKS[n-1],g=GUIDES[n];
  const idx=dayIdx(),wk=idx<0?0:Math.floor(idx/7)+1,today=wk===n?idx%7:-1;
  const mp=prog(weekIds(n,true));
  const pids=pracIds(n),pdone=pids.filter(i=>S.prac[i]).length;
  let h=`<p class="sm"><a href="plan.html">← 12-Week Plan</a></p>
  <h2>Week ${n}: ${esc(w.title)}</h2>
  <p class="lead"><b>Goal:</b> ${esc(w.goal)}<br><b>Deliverable:</b> ${esc(w.deliver)}</p>
  <div class="grid g3" style="margin-bottom:12px">
    <div class="card" style="margin:0"><div class="sm">Mandatory tasks</div><b>${mp.d}/${mp.t}</b>${bar(mp.p)}</div>
    <div class="card" style="margin:0"><div class="sm">Practice questions solved</div><b>${pdone}/${pids.length}</b>${bar(pids.length?pdone/pids.length:0)}</div>
    <div class="card" style="margin:0;display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap">
      ${n>1?`<a class="btn ghost" href="week-${n-1}.html" style="text-decoration:none">← Week ${n-1}</a>`:'<span></span>'}
      ${n<12?`<a class="btn" href="week-${n+1}.html" style="text-decoration:none">Week ${n+1} →</a>`:'<span></span>'}
    </div>
  </div>`;
  if(!g){return h+`<div class="note">The detailed guide for this week could not be loaded. Check that <code>js/guide-w${n}.js</code> exists.</div>`}
  h+=`<div class="card guide-intro">${g.intro}</div>
  <div class="chips">${DAYN.map((d,i)=>{const mt=w.days[i].filter(t=>t.tag==='M'),all=mt.length&&mt.every(t=>S.done[t.id]);return `<a class="chip ${i===today?'on':''}" href="#day-${i}" data-act="goday:${i}" style="text-decoration:none">${all?'✓ ':''}${d}</a>`}).join('')}<button class="chip" data-act="weekall:${n}">Expand / collapse all days</button></div>`;
  g.days.forEach((d,di)=>{
    const tasks=w.days[di],td=tasks.filter(t=>S.done[t.id]).length;
    const dp=d.practice.map((q,i)=>`pr:${n}:${di}:${i}`),pd2=dp.filter(i=>S.prac[i]).length;
    const key=`w${n}d${di}`,mAll=tasks.filter(t=>t.tag==='M'),mDone=mAll.length>0&&mAll.every(t=>S.done[t.id]);
    h+=`<details class="gday" data-k="${key}" id="day-${di}" ${hasOpen(key,di===(today<0?0:today))}>
    <summary><span class="dn">${DAYN[di]}</span><span class="sm">${dayDate(n,di)}</span><span style="flex:1">${esc(d.title)}</span>${mDone?'<span class="ok">✓</span>':''}<span class="sm">${esc(d.time)} · tasks ${td}/${tasks.length} · practice ${pd2}/${dp.length}</span></summary>
    <div class="body">
      <nav class="dnav">${[['study','📖 Study'],['how','🛠️ Steps'],['ex','💡 Example'],['prac','✍️ Practice'],['iq','🎤 Interview']].map(s=>`<a href="#${key}-${s[0]}" data-act="goto:${key}-${s[0]}">${s[1]}</a>`).join('')}</nav>
      <div class="gsec"><h4>✅ Plan tasks for ${DAYN[di]}</h4>${tasks.map(t=>chk(t.id,t.text,t.tag)).join('')}</div>
      <div class="gsec" id="${key}-study"><h4>📖 What to study</h4><ul>${d.study.map(s=>`<li>${s}</li>`).join('')}</ul></div>
      <div class="gsec" id="${key}-how"><h4>🛠️ How to do it, step by step</h4><ol class="steps">${d.how.map(s=>`<li>${s}</li>`).join('')}</ol></div>
      <div class="gsec" id="${key}-ex"><h4>💡 Worked example</h4><div class="gex">${d.example}</div></div>
      <div class="gsec" id="${key}-prac"><h4>✍️ Practice questions <span class="sm">(try first, then open the answer)</span></h4>
        ${d.practice.map((q,i)=>{const id=`pr:${n}:${di}:${i}`,sv=!!S.prac[id];
          return `<details class="pq" data-k="${id}" ${hasOpen(id,false)}><summary><span class="sm">P${i+1}</span><span style="flex:1">${q[0]}</span>${sv?'<span class="ok">✓</span>':''}</summary><div class="body">${q[1]}
          <label class="row ${sv?'done':''}" style="margin-top:8px"><input type="checkbox" data-pid="${id}" ${sv?'checked':''}><span class="box"></span><span class="txt">I solved this</span><span class="xp">+3</span></label></div></details>`}).join('')}
      </div>
      <div class="gsec" id="${key}-iq"><h4>🎤 Important interview questions</h4>
        ${d.important.map((q,i)=>`<details class="pq iq" data-k="${key}i${i}" ${hasOpen(key+'i'+i,false)}><summary><span class="sm">Q${i+1}</span><span style="flex:1">${q[0]}</span></summary><div class="body">${q[1]}</div></details>`).join('')}
      </div>
      ${d.resources&&d.resources.length?`<div class="gsec"><h4>🔗 Resources</h4><ul>${d.resources.map(r=>`<li><a href="${r[1]}" target="_blank" rel="noopener">${esc(r[0])}</a></li>`).join('')}</ul></div>`:''}
      <div class="note gdone">🏁 <b>${esc(d.done)}</b></div>
      <div class="qa-actions daybar">
        ${mAll.length&&!mDone?`<button class="btn" data-act="daydone:${n}:${di}">✅ Mark all must-do tasks for ${DAYN[di]} complete</button>`:''}
        ${di<6?`<a class="btn ghost" href="#day-${di+1}" data-act="goday:${di+1}" style="text-decoration:none">Next day →</a>`:(n<12?`<a class="btn" href="week-${n+1}.html" style="text-decoration:none">Start Week ${n+1} →</a>`:'')}
      </div>
    </div></details>`});
  return h;
}
