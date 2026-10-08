function pageSettings(){
  const idx=dayIdx();
  const when=idx<0?`Your plan starts in ${-idx} day${-idx>1?'s':''}.`:idx>=84?'You have finished the 12 weeks.':`Today is <b>Day ${idx+1}</b> of 84 (Week ${Math.floor(idx/7)+1}).`;
  return `<h2>⚙️ Settings</h2><div class="card"><h3 style="margin-top:0">Plan start date</h3>
  <p class="sm"><b>Day 1 is the date you choose</b>, so the plan starts on the day you start. Each week is 7 days. Days 1–5 are short sessions (about 1.5 h) and Days 6–7 are long sessions (about 3.5 h). If you want the long days to fall on a weekend, start on a Monday.</p>
  <div class="qa-actions" style="margin:0"><input type="date" id="startd" value="${S.start}"> <button class="btn" data-act="setstart">Save start date</button><button class="btn ghost" data-act="startoday">Start today</button></div>
  <p style="margin-top:10px">Day 1: <b>${dayDate(1,0)}</b> · Last day (Day 84): <b>${planEnd()}</b><br>${when}</p></div>`;
}
