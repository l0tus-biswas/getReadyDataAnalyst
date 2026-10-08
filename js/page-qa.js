/* Interview Q&A for one topic: filters, levels, spoken answer first, follow-ups, mistakes, quiz mode */
function pageQA(k){
  const T=QA[k];if(!T)return '<p>Unknown topic.</p>';
  ui.ql=ui.ql||'all';ui.qs=ui.qs||'all';ui.qf=!!ui.qf;
  const ids=qIds(k),p=prog(ids);
  const byL=l=>{const a=ids.filter((id,i)=>T.list[i].lvl===l);return {d:a.filter(i=>S.done[i]).length,t:a.length}};
  const E=byL('E'),Mx=byL('M'),H=byL('H');
  const flagged=ids.filter(i=>S.flag[i]).length;
  const visible=T.list.map((q,i)=>({q,i,id:`q:${k}:${i}`})).filter(x=>
    (ui.ql==='all'||x.q.lvl===ui.ql)&&
    (!ui.qf||x.q.freq>=3)&&
    (ui.qs==='all'||(ui.qs==='todo'&&!S.done[x.id])||(ui.qs==='flag'&&S.flag[x.id])||(ui.qs==='done'&&S.done[x.id])));
  const chip=(act,label,on)=>`<button class="chip ${on?'on':''}" data-act="${act}">${label}</button>`;
  let h=`<p class="sm"><a href="interview.html">← Interview hub</a></p><h2>${T.emoji} ${esc(T.name)} Interview Q&A</h2>
  <p class="lead">${p.d}/${p.t} prepared · ${T.list.length} questions · answer aloud first, then check. Each card gives a <b>30-second spoken answer</b>, the full answer, likely follow-ups and the most common mistake.</p>
  <div class="grid g4" style="margin-bottom:12px">
    <div class="card stat" style="margin:0"><b>${p.d}/${p.t}</b><span>prepared</span>${bar(p.p)}</div>
    <div class="card stat" style="margin:0"><b>${E.d}/${E.t}</b><span>${lvlBadge('E')}</span></div>
    <div class="card stat" style="margin:0"><b>${Mx.d}/${Mx.t}</b><span>${lvlBadge('M')}</span></div>
    <div class="card stat" style="margin:0"><b>${H.d}/${H.t}</b><span>${lvlBadge('H')} (stretch)</span></div>
  </div>
  ${quizCard()}
  ${T.schema?`<details class="schema" data-k="schema-${k}" ${hasOpen('schema-'+k,false)}><summary>🧰 Practice data used in these answers (copy it into your tool)</summary><div class="body">${T.schema}${k==='sql'&&T.schemaSql?'<p><a class="btn" href="sql-lab.html" style="text-decoration:none;display:inline-block">▶ Open SQL Lab (run queries in your browser)</a></p>':''}</div></details>`:''}
  <div class="chips">
    ${chip('qlvl:all','All levels',ui.ql==='all')}${chip('qlvl:E','Easy',ui.ql==='E')}${chip('qlvl:M','Medium',ui.ql==='M')}${chip('qlvl:H','Hard',ui.ql==='H')}
    <span class="sep"></span>
    ${chip('qst:all','All',ui.qs==='all')}${chip('qst:todo','Not prepared',ui.qs==='todo')}${chip('qst:flag','⭐ Flagged ('+flagged+')',ui.qs==='flag')}${chip('qst:done','Prepared',ui.qs==='done')}
    <span class="sep"></span>
    ${chip('qfreq','🔥 Most asked',ui.qf)}
  </div>
  <div class="chips"><input type="text" id="qsearch" placeholder="Search questions..." value="${esc(ui.qq||'')}" style="flex:1;min-width:180px">
    <button class="btn" data-act="quiz-start:${k}">🎲 Quiz me (10)</button>
    <button class="btn ghost" data-act="openall:${k}">Expand / collapse all</button></div>
  <p class="sm">Showing ${visible.length} of ${T.list.length} questions.</p>`;
  if(!visible.length)h+=`<div class="note">No questions match these filters. Change a filter above.</div>`;
  visible.forEach(({q,i,id})=>{
    const dn=!!S.done[id],fl=!!S.flag[id];
    h+=`<details class="qitem" data-k="${id}" data-s="${esc((q.q+' '+(q.tags||[]).join(' ')).toLowerCase())}" id="${id.replace(/:/g,'-')}" ${hasOpen(id,false)}>
    <summary><span class="sm">Q${i+1}</span>${lvlBadge(q.lvl)}<span class="fr" title="How often it is asked">${flames(q.freq)}</span><span style="flex:1">${esc(q.q)}</span>${dn?'<span class="ok">✓</span>':''}${fl?'⭐':''}</summary>
    <div class="body">
      ${q.short?`<div class="say"><b>🗣️ Say it like this (30 sec):</b><br>${q.short}</div>`:''}
      <div class="full"><b>📘 Full answer</b>${q.a}</div>
      ${q.follow&&q.follow.length?`<div class="fu"><b>↪ Likely follow-ups</b><ul>${q.follow.map(f=>`<li>${f}</li>`).join('')}</ul></div>`:''}
      ${q.mistake?`<div class="mis"><b>⚠️ Common mistake:</b> ${q.mistake}</div>`:''}
      ${q.tags&&q.tags.length?`<div class="tags">${q.tags.map(t=>`<span class="chip sm">#${esc(t)}</span>`).join('')}</div>`:''}
      <div class="qa-actions"><label class="row ${dn?'done':''}" style="padding:4px 8px"><input type="checkbox" data-id="${id}" ${dn?'checked':''}><span class="box"></span><span class="txt">Prepared</span><span class="xp">+${REG[id].xp}</span></label>
        <button class="chip" data-act="flag:${id}">${fl?'⭐ Flagged':'☆ Flag for revision'}</button>
        ${k==='sql'&&q.run?`<a class="chip" href="sql-lab.html?q=${i}" style="text-decoration:none">▶ Try in SQL Lab</a>`:''}</div>
    </div></details>`;
  });
  return h;
}
