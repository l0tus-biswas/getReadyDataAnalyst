function pageQAHub(){
  if(location.hash==='#quiz'&&!ui.quiz&&!ui.quizAuto){ui.quizAuto=1;startQuiz('all',10)}
  const all=Object.keys(QA).flatMap(qIds),ap=prog(all),fl=all.filter(i=>S.flag[i]).length;
  const hard=all.filter(i=>qOf(i).q.freq>=3).length;
  let h=`<h2>🎤 Interview Prep Hub</h2><p class="lead">Built from real interview reports (Glassdoor: Infosys, Deloitte, Ivanti, AI Variant), SQL platforms (DataLemur, StrataScratch, LeetCode) and product-analyst guides.</p>
  ${quizCard()}
  <div class="card"><div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><div style="flex:1;min-width:220px"><b>${ap.d}/${ap.t}</b> questions prepared across all topics ${bar(ap.p)}<div class="sm" style="margin-top:4px">${hard} are marked 🔥🔥🔥 (asked in most interviews)${fl?` · ⭐ ${fl} flagged for revision`:''}</div></div>
    <button class="btn" data-act="quiz-start:all">🎲 10-question mixed quiz</button></div></div>
  <div class="grid g2">
  <div class="card"><h3 style="margin-top:0">What the process usually looks like</h3><ol>
  <li><b>Online test / aptitude + SQL or Power BI assessment</b> (Infosys, Ivanti reports)</li>
  <li><b>HR / recruiter screen</b>: background, motivation, salary</li>
  <li><b>Technical round(s)</b>: SQL (joins, CTE, subquery, window functions), Excel scenario, Power BI/DAX (net sales, distinct customers), data modeling, sometimes Python</li>
  <li><b>Case study / take-home</b> (some companies)</li>
  <li><b>Manager round</b>: past projects, business cases, work ethic</li>
  </ol><p class="sm">Reports are anonymous and vary by company. Always read the job description to see which tools to weight.</p></div>
  <div class="card"><h3 style="margin-top:0">Most-tested patterns</h3><ul>
  <li>JOIN row counts with duplicate keys, UNION vs UNION ALL</li>
  <li>Window functions: rank, top-N, running total, LAG, NTILE, % of total, gaps</li>
  <li>DAX: CALCULATE, measure vs column, time intelligence</li>
  <li>Star schema and relationships</li>
  <li>Walk through a project end to end</li>
  <li>Cases: "sales dropped 25%", feature success, retention</li>
  <li>Stats: p-value meaning, A/B test design, outliers</li></ul></div></div>
  <div class="grid g2"><div class="card"><h3 style="margin-top:0">Answer frameworks</h3>
  <p><b>STAR</b> for behavioural: Situation, Task, Action, Result (with numbers).</p>
  <p><b>Metric-drop case</b>: validate data → size/timing → decompose (traffic x conversion x AOV) → segment → hypotheses → recommend + monitor.</p>
  <p><b>SQL live round</b>: restate the problem, ask about duplicates/NULLs, outline approach, write it in steps (CTE), test with a tiny example, explain out loud.</p></div>
  <div class="card"><h3 style="margin-top:0">Day-before checklist</h3><ul><li>Re-read your 3 projects and numbers</li><li>Redo flagged ⭐ questions</li><li>5 SQL window problems, timed</li><li>Prepare 3 questions to ask them</li><li>Test mic/camera, keep water ready</li></ul></div></div>
  <h3>Choose a topic</h3><div class="grid g3">`;
  QORDER.forEach(k=>{const p=prog(qIds(k)),fl=qIds(k).filter(i=>S.flag[i]).length;
    h+=`<a href="qa-${k}.html" class="card" style="text-decoration:none;color:inherit;margin:0"><div style="font-size:26px">${QA[k].emoji}</div><b>${QA[k].name}</b><div class="sm">${p.d}/${p.t} prepared${fl?` · ⭐ ${fl} flagged`:''}</div>${bar(p.p)}</a>`});
  h+=`</div><h3>Sources used for this plan</h3><ul class="src">${SOURCES.map(s=>`<li><a href="${s[1]}" target="_blank" rel="noopener">${esc(s[0])}</a></li>`).join('')}</ul>`;
  return h;
}
