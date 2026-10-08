function pagePlan(){
  const idx=dayIdx(),wk=idx<0?0:Math.floor(idx/7)+1;
  let h=`<h2>📅 12-Week Plan</h2><p class="lead">Built for a working professional: Days 1-5 of each week are ~1.5 hrs and Days 6-7 are ~3.5 hrs (about 14.5 hrs a week). Day 1 is <b>${dayDate(1,0)}</b> and Day 84 is <b>${planEnd()}</b>. You can change the start date in Settings. Order follows what interview reports ask most: SQL → Excel → Power BI/DAX → Python → Stats/Cases → Projects → Mocks.</p>
  <div class="chips"><label class="chip ${S.mustOnly?'on':''}" style="cursor:pointer"><input type="checkbox" data-act="mustonly" ${S.mustOnly?'checked':''} style="display:none">🎯 Busy mode: show MUST tasks only</label><button class="chip" data-act="jump-cur">Jump to current week</button></div>`;
  WEEKS.forEach(w=>{const p=prog(weekIds(w.n,true)),all=prog(weekIds(w.n,false));
    h+=`<details data-k="wk${w.n}" id="wk${w.n}" ${hasOpen('wk'+w.n,w.n===wk||(wk===0&&w.n===1))}><summary>Week ${w.n}: ${esc(w.title)} <span class="sm">${p.d}/${p.t} must · ${all.d}/${all.t} total</span><span class="mini">${bar(p.p)}</span>${w.n===wk?'<span class="pill">📍 This week</span>':''}</summary><div class="body">
    <p><b>Goal:</b> ${esc(w.goal)}</p><p><b>Deliverable:</b> ${esc(w.deliver)}</p>
    <p><a class="btn" href="week-${w.n}.html" style="text-decoration:none;display:inline-block">📖 Open detailed Week ${w.n} guide (study, how-to, examples, practice, interview Qs)</a></p>
    <div class="days">${w.days.map((d,di)=>{const ts=d.filter(t=>!(S.mustOnly&&t.tag!=='M'));return `<div class="day ${w.n===wk&&di===idx%7?'today':''}"><h4>${DAYN[di]} · ${dayDate(w.n,di)} · ${di<5?'1.5h':'3.5h'} · <a href="week-${w.n}.html#day-${di}">📖 guide</a></h4>${ts.map(t=>chk(t.id,t.text,t.tag)).join('')||'<div class="sm" style="padding:8px">Optional items hidden</div>'}</div>`}).join('')}</div></div></details>`});
  return h;
}
