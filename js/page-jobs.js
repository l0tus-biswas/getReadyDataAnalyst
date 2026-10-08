function pageJobs(){
  const ids=JOBS.map((j,i)=>`j:${i}`);
  let h=`<h2>💼 Job Hunt</h2><p class="lead">Apply from week 8 even if you feel unready. Apply to many titles, not only "Data Analyst".</p>
  <div class="grid g2"><div class="card"><h3 style="margin-top:0">Checklist</h3>${JOBS.map((j,i)=>chk(`j:${i}`,j,'M')).join('')}</div>
  <div class="card"><h3 style="margin-top:0">Where and how to apply</h3><ul>
  <li><b>Titles:</b> Data Analyst, Business Analyst, Reporting/MIS Analyst, Research/Insights Analyst, Junior BI Developer, Product/Marketing Analyst</li>
  <li><b>Easiest switch:</b> research and survey firms (Kantar, Ipsos, Nielsen, Gartner-type firms) value your survey background</li>
  <li><b>Internal move:</b> ask your company about its analytics/reporting team</li>
  <li><b>Referrals</b> beat cold applications. Message analysts politely with one specific question</li>
  <li>Tailor resume keywords to each JD. Expect 50-100 applications; rejections are normal</li>
  <li>Don't quit until you have an offer</li></ul>
  <h3>Referral message template</h3><div class="note">Hi [Name], I'm a survey programmer with 2+ years of data experience moving into analytics (SQL, Power BI, Python). I saw [Company] is hiring a [Role]. Could you share any advice or a referral? Happy to send my portfolio.</div></div></div>
  <div class="card"><h3 style="margin-top:0">Resume bullets from your current job</h3><ul>
  <li>Validated and cleaned respondent-level data for N surveys, reducing data errors by X%.</li>
  <li>Wrote SQL/Python scripts to automate data-quality checks, saving X hours per project.</li>
  <li>Built Excel/Power Query reports and tables delivered to clients on tight deadlines.</li>
  <li>Implemented complex routing and quota logic, giving a deep understanding of how data is collected.</li></ul></div>
  <div class="card"><h3 style="margin-top:0">Application tracker (${S.apps.length})</h3>
  <div class="qa-actions"><input type="text" id="a_c" placeholder="Company"><input type="text" id="a_r" placeholder="Role"><button class="btn" data-act="app-add">Add</button></div>
  <div style="overflow:auto"><table><tr><th>Company</th><th>Role</th><th>Date</th><th>Status</th><th></th></tr>
  ${S.apps.map((a,i)=>`<tr><td>${esc(a.c)}</td><td>${esc(a.r)}</td><td>${a.d}</td><td><select data-app="${i}">${['Applied','Screening','Technical','Final','Offer','Rejected'].map(s=>`<option ${s===a.status?'selected':''}>${s}</option>`).join('')}</select></td><td><button class="chip" data-act="app-del:${i}">✕</button></td></tr>`).join('')||'<tr><td colspan="5" class="sm">No applications yet.</td></tr>'}</table></div></div>`;
  return h;
}
