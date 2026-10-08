function pageRes(){
  return `<h2>🔗 Resources</h2><p class="lead">Free and popular. Do not collect resources; pick one per topic and finish it.</p><div class="grid g3">`+
  RES.map(r=>`<div class="card" style="margin:0"><h3 style="margin-top:0">${r[0]}</h3><ul>${r[1].map(l=>`<li><a href="${l[1]}" target="_blank" rel="noopener">${esc(l[0])}</a></li>`).join('')}</ul></div>`).join('')+
  `</div><h3>Interview-experience sources used</h3><ul class="src">${SOURCES.map(s=>`<li><a href="${s[1]}" target="_blank" rel="noopener">${esc(s[0])}</a></li>`).join('')}</ul>
  <p class="sm">Glassdoor reviews are anonymous and self-reported. Verify company-specific details yourself.</p>`;
}
