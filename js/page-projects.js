function pageProjects(){
  let h=`<h2>🧪 Portfolio Projects</h2><p class="lead">3 strong projects beat 10 weak ones. Each: business question → clean → analyse → dashboard → insights → recommendations → README on GitHub. Your survey project is the differentiator.</p>
  <div class="note"><b>What makes a project stand out:</b> starts with a business question, uses messy real data, shows SQL/Python <i>and</i> a dashboard, ends with recommendations that include numbers, and has a clear README with screenshots.</div>`;
  PROJECTS.forEach(p=>{const pr=prog(pIds(p));
    h+=`<details data-k="${p.id}" ${hasOpen(p.id,p.id==='p1')}><summary>${esc(p.name)} ${tagChip(p.tag)} <span class="sm">${pr.d}/${pr.t}</span><span class="mini">${bar(pr.p)}</span></summary><div class="body">
    <p><b>Domain:</b> ${esc(p.domain)} · <b>Tools:</b> ${esc(p.tools)}</p>
    <p><b>Datasets:</b> ${p.data.map(d=>`<a href="${d[1]}" target="_blank" rel="noopener">${esc(d[0])}</a>`).join(' · ')}</p>
    <p><b>Questions to answer:</b> ${esc(p.qs)}</p>
    ${p.steps.map((s,i)=>chk(`${p.id}s${i}`,s,p.tag)).join('')}
    <div class="note"><b>Resume bullet (edit with your real numbers):</b><br>${esc(p.bullet)}</div></div></details>`});
  return h;
}
