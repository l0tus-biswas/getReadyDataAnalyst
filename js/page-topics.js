/* Topics & skills: tagged Must/Optional/Advanced, with interview weight and a detail card per item */
function pageTopics(){
  ui.tw=!!ui.tw;ui.tn=!!ui.tn;
  const chip=(act,label,on)=>`<button class="chip ${on?'on':''}" data-act="${act}">${label}</button>`;
  let h=`<h2>📚 Topics & Skills</h2><p class="lead">Every topic is labelled <span class="tag M">MUST</span> (needed to crack entry-level interviews), <span class="tag O">OPTIONAL</span> (helps) or <span class="tag A">ADVANCED</span> (not required as a beginner). The 🔥 shows how often it comes up in interviews. Tick items as you learn them; open <b>Details</b> to see how deep to go, why it is asked and a sample question.</p>
  <div class="chips">${[['all','All'],['M','Must'],['O','Optional'],['A','Advanced']].map(([k,l])=>chip('tag:'+k,l,ui.tag===k)).join('')}<span class="sep"></span>${chip('tw','🔥🔥 High priority only',ui.tw)}${chip('tn','Not done yet',ui.tn)}<input type="text" id="tsearch" placeholder="Search topics..." value="${esc(ui.tq)}"></div>`;
  TOPICS.forEach(tp=>{
    const p=prog(tIds(tp.id),true);
    const next=tp.items.find(it=>it[1]==='M'&&!S.done[it.id]);
    h+=`<details data-k="tp${tp.id}" ${hasOpen('tp'+tp.id,tp.id==='sql')}><summary>${tp.emoji} ${esc(tp.name)} <span class="sm">${p.d}/${p.t} must</span><span class="mini">${bar(p.p)}</span>${QA[tp.id]?`<a class="sm" href="qa-${tp.id}.html" onclick="event.stopPropagation()">Interview Qs →</a>`:''}</summary><div class="body">
    <p class="sm">${esc(tp.intro)}</p>${tp.order?`<p class="sm"><b>Suggested order:</b> ${esc(tp.order)}</p>`:''}
    ${next?`<div class="note" style="margin:6px 0">👉 <b>Next up:</b> ${esc(next[0])}</div>`:'<div class="note" style="margin:6px 0">✅ All must-have topics here are done.</div>'}
    ${tp.items.filter(it=>(ui.tag==='all'||it[1]===ui.tag)&&(!ui.tw||it[3].w>=2)&&(!ui.tn||!S.done[it.id])).map(it=>{
      const m=it[3],hasInfo=m.depth||m.why||m.ex||m.q;
      return `<div class="titem" id="${it.id}">${chk(it.id,it[0],it[1],it[2])}
      <div class="tmeta"><span class="fr" title="Interview weight">${flames(m.w)}</span>${m.week?`<a class="sm" href="week-${m.week}.html">Week ${m.week} →</a>`:''}</div>
      ${hasInfo?`<details class="tinfo" data-k="ti-${it.id}" ${hasOpen('ti-'+it.id,false)}><summary>Details</summary><div class="body">
        ${m.depth?`<p><b>How deep:</b> ${esc(m.depth)}</p>`:''}${m.why?`<p><b>Why it matters:</b> ${esc(m.why)}</p>`:''}
        ${m.ex?`<p><b>Example:</b> <code>${esc(m.ex)}</code></p>`:''}${m.q?`<p><b>Sample interview question:</b> ${esc(m.q)}</p>`:''}</div></details>`:''}</div>`}).join('')}
    </div></details>`});
  return h;
}
