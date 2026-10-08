/* Global search across topics, interview questions, week guides, plan tasks, projects and your notes.
   This page loads every guide file so the whole site is searchable. */
const strip=h=>String(h||'').replace(/<[^>]+>/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
let SIDX=null;
function buildIndex(){
  if(SIDX)return SIDX;
  const a=[];
  TOPICS.forEach(tp=>tp.items.forEach(it=>{const m=it[3];
    a.push({t:'Topic',title:it[0],text:[it[2],m.depth,m.why,m.ex,m.q].join(' '),href:`topics.html#${it.id}`,sub:tp.name+' · '+({M:'Must',O:'Optional',A:'Advanced'}[it[1]])})}));
  Object.keys(QA).forEach(k=>QA[k].list.forEach((q,i)=>
    a.push({t:'Question',title:q.q,text:strip(q.short)+' '+strip(q.a)+' '+(q.tags||[]).join(' '),href:`qa-${k}.html#q-${k}-${i}`,sub:QA[k].name+' · '+(LVL[q.lvl]||LVL.M)[0]})));
  WEEKS.forEach(w=>{
    w.days.forEach((d,di)=>d.forEach(t=>a.push({t:'Plan task',title:t.text,text:'',href:`plan.html#wk${w.n}`,sub:`Week ${w.n} · ${DAYN[di]}`})));
    const g=typeof GUIDES!=='undefined'&&GUIDES[w.n];
    if(g)g.days.forEach((d,di)=>{
      const href=`week-${w.n}.html#day-${di}`,sub=`Week ${w.n} · ${DAYN[di]}`;
      a.push({t:'Guide',title:d.title,text:strip(d.study.join(' ')+' '+d.how.join(' ')+' '+d.example),href,sub});
      d.practice.forEach(q=>a.push({t:'Practice',title:strip(q[0]),text:strip(q[1]),href,sub}));
      d.important.forEach(q=>a.push({t:'Interview Q (guide)',title:strip(q[0]),text:strip(q[1]),href,sub}))})});
  PROJECTS.forEach(p=>a.push({t:'Project',title:p.name,text:p.steps.join(' ')+' '+p.qs,href:'projects.html',sub:p.domain}));
  Object.keys(S.notes).forEach(k=>a.push({t:'My note',title:noteLabel(k),text:S.notes[k].t,href:k==='general'?'notes.html':`week-${k.slice(1).split('d')[0]}.html#day-${k.slice(-1)}`,sub:'Notes'}));
  a.forEach(x=>{x.lc=(x.title+' '+x.text).toLowerCase();x.lt=x.title.toLowerCase()});
  return SIDX=a;
}
function searchRun(q){
  const words=q.toLowerCase().split(/\s+/).filter(w=>w.length>0);if(!words.length)return {};
  const out={};
  buildIndex().forEach(x=>{
    if(!words.every(w=>x.lc.includes(w)))return;
    let s=0;words.forEach(w=>{if(x.lt.includes(w))s+=5;if(x.lt.startsWith(w))s+=2;s+=Math.min(3,x.lc.split(w).length-1)});
    (out[x.t]||(out[x.t]=[])).push({x,s});
  });
  Object.keys(out).forEach(k=>out[k].sort((a,b)=>b.s-a.s));
  return out;
}
const hl=(text,words)=>{let s=esc(text);words.forEach(w=>{if(w.length>1)s=s.replace(new RegExp('('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'),'<mark>$1</mark>')});return s};
function snippet(x,words){
  const full=x.text||'';if(!full)return '';
  const i=Math.max(0,words.map(w=>full.toLowerCase().indexOf(w)).filter(n=>n>=0).sort((a,b)=>a-b)[0]-50);
  return (i>0?'…':'')+full.slice(i,i+170)+(full.length>i+170?'…':'');
}
function pageSearch(){
  const q=new URLSearchParams(location.search).get('q')||ui.sq||'';
  const words=q.toLowerCase().split(/\s+/).filter(Boolean);
  let h=`<h2>🔍 Search</h2><form action="search.html" method="get" class="qa-actions" style="margin:0 0 12px"><input type="text" name="q" id="bigsearch" value="${esc(q)}" placeholder="Try: window function, NPS, p-value, resume…" style="flex:1;min-width:200px" autofocus><button class="btn" type="submit">Search</button></form>`;
  if(!q.trim())return h+`<p class="sm">Searches topics, ${Object.keys(QA).reduce((n,k)=>n+QA[k].list.length,0)} interview questions, all week guides and practice questions, plan tasks, projects and your notes. Press <b>/</b> on any page to jump here.</p>`;
  const res=searchRun(q),types=Object.keys(res);
  const total=types.reduce((n,k)=>n+res[k].length,0);
  h+=`<p class="sm">${total} result${total===1?'':'s'} for <b>${esc(q)}</b></p>`;
  if(!total)h+=`<div class="note">Nothing found. Try fewer or simpler words (for example "join" instead of "inner join duplicates").</div>`;
  ['Question','Topic','Guide','Practice','Interview Q (guide)','Plan task','Project','My note'].filter(t=>res[t]).forEach(t=>{
    const list=res[t];
    h+=`<details data-k="sr-${t}" open><summary>${esc(t)} <span class="sm">${list.length}</span></summary><div class="body">${list.slice(0,t==='Plan task'?8:12).map(({x})=>`<div class="sres"><a href="${x.href}"><b>${hl(x.title.length>150?x.title.slice(0,150)+'…':x.title,words)}</b></a><div class="sm">${esc(x.sub)}</div>${x.text?`<div class="sm">${hl(snippet(x,words),words)}</div>`:''}</div>`).join('')}${list.length>12?`<p class="sm">Showing the top 12 of ${list.length}. Add another word to narrow it down.</p>`:''}</div></details>`});
  return h;
}
