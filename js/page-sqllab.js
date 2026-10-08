/* SQL Lab: run SQL in the browser (sql.js = SQLite compiled to WebAssembly, loaded from cdnjs) */
const LAB={db:null,SQL:null,err:''};
function labQuestions(){return (QA.sql&&QA.sql.list||[]).map((q,i)=>({q,i})).filter(x=>x.q.run)}
function pageSqlLab(){
  const qs=labQuestions();
  const hasSchema=!!(QA.sql&&QA.sql.schemaSql);
  return `<h2>⌨️ SQL Lab</h2><p class="lead">Run real SQL right here. It uses SQLite in your browser with the same practice tables as the SQL interview answers. Nothing is sent anywhere. Press <b>Ctrl + Enter</b> to run.</p>
  <div id="labstatus" class="note">Loading the SQL engine…</div>
  ${hasSchema?'':'<div class="note">The practice schema (<code>QA.sql.schemaSql</code>) is not loaded yet, so the lab starts with an empty database.</div>'}
  <div class="card"><div class="qa-actions" style="margin:0 0 8px">
    <select id="labsample"><option value="">Load a question…</option>${qs.map(x=>`<option value="${x.i}">Q${x.i+1}. ${esc(x.q.q.slice(0,70))}</option>`).join('')}</select>
    <button class="btn" id="labrun">▶ Run</button><button class="btn ghost" id="labreset">↺ Reset database</button></div>
    <textarea id="labsql" spellcheck="false" rows="9" style="width:100%;font-family:ui-monospace,Consolas,monospace;font-size:14px" placeholder="SELECT * FROM customers;"></textarea>
    <div id="labout" style="margin-top:10px"></div></div>
  ${hasSchema?`<details class="schema" data-k="labschema" ${hasOpen('labschema',false)}><summary>🧰 Tables available in this lab</summary><div class="body">${QA.sql.schema||pre(QA.sql.schemaSql)}</div></details>`:''}`;
}
function labShow(res,err){
  const out=document.getElementById('labout');if(!out)return;
  if(err){out.innerHTML=`<div class="note" style="border-left-color:var(--bad)"><b class="bad">Error:</b> ${esc(err)}</div>`;return}
  if(!res.length){out.innerHTML='<div class="note">Statement ran. No rows returned.</div>';return}
  out.innerHTML=res.map(r=>`<div style="overflow:auto;max-height:420px"><table><tr>${r.columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr>${r.values.slice(0,300).map(v=>`<tr>${v.map(x=>`<td>${x===null?'<i class="sm">NULL</i>':esc(x)}</td>`).join('')}</tr>`).join('')}</table></div><p class="sm">${r.values.length} row${r.values.length===1?'':'s'}${r.values.length>300?' (showing first 300)':''}</p>`).join('');
}
function labReset(){
  if(!LAB.SQL)return;
  if(LAB.db)LAB.db.close();
  LAB.db=new LAB.SQL.Database();
  try{if(QA.sql&&QA.sql.schemaSql)LAB.db.exec(QA.sql.schemaSql)}catch(e){labShow(null,'Schema failed to load: '+e.message)}
}
function labRun(){
  if(!LAB.db){labShow(null,'The SQL engine is not ready yet.');return}
  const sql=document.getElementById('labsql').value;
  try{labShow(LAB.db.exec(sql))}catch(e){labShow(null,e.message)}
}
function initSqlLab(){
  const st=document.getElementById('labstatus');
  const fail=m=>{if(st)st.innerHTML=`<b class="bad">Could not start the SQL engine.</b> ${m} The lab needs an internet connection the first time (it loads SQLite from cdnjs). You can also practise at <a href="https://www.db-fiddle.com" target="_blank" rel="noopener">db-fiddle.com</a> using the tables in the SQL Q&A page.`};
  if(typeof initSqlJs!=='function'){fail('The sql.js script did not load.');return}
  initSqlJs({locateFile:f=>'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/'+f}).then(SQL=>{
    LAB.SQL=SQL;labReset();
    if(st){st.className='note';st.innerHTML='✅ SQL engine ready. The practice tables are loaded.'}
    const qi=new URLSearchParams(location.search).get('q');
    if(qi!==null&&QA.sql&&QA.sql.list[+qi]&&QA.sql.list[+qi].run){document.getElementById('labsql').value=QA.sql.list[+qi].run;labRun()}
  }).catch(e=>fail(esc(e&&e.message||e)));
  document.getElementById('labrun').addEventListener('click',labRun);
  document.getElementById('labreset').addEventListener('click',()=>{labReset();labShow([]);toast('Database reset')});
  document.getElementById('labsample').addEventListener('change',e=>{const i=e.target.value;if(i!==''){document.getElementById('labsql').value=QA.sql.list[+i].run}});
  document.getElementById('labsql').addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();labRun()}});
}
