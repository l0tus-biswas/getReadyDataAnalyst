function pageSettings(){
  const idx=dayIdx();
  const when=idx<0?`Your plan starts in ${-idx} day${-idx>1?'s':''}.`:idx>=84?'You have finished the 12 weeks.':`Today is <b>Day ${idx+1}</b> of 84 (Week ${Math.floor(idx/7)+1}).`;
  const acct=(typeof AUTH!=='undefined'&&AUTH.mode==='user'&&AUTH.user)?`<div class="card"><h3 style="margin-top:0">👤 Your account</h3><p><b>${esc(AUTH.user.name)}</b><br><span class="sm">${esc(AUTH.user.email)} · ${AUTH.user.role==='admin'?'Admin':'Learner'}</span></p>
  <p class="sm">Your progress is saved to your account, so it follows you to any device. To change your password, ask your admin.${READONLY?'':''}</p>
  <div class="qa-actions" style="margin:0">${READONLY?'':'<button class="btn ghost" data-act="logout">Sign out</button>'}${AUTH.admin&&!READONLY?'<a class="btn" href="admin.html" style="text-decoration:none">🛠️ Admin panel</a>':''}</div></div>`:'';
  return `<h2>⚙️ Settings</h2>${acct}<div class="card"><h3 style="margin-top:0">Plan start date</h3>
  <p class="sm"><b>Day 1 is the date you choose</b>, so the plan starts on the day you start. Each week is 7 days. Days 1–5 are short sessions (about 1.5 h) and Days 6–7 are long sessions (about 3.5 h). If you want the long days to fall on a weekend, start on a Monday.</p>
  <div class="qa-actions" style="margin:0"><input type="date" id="startd" value="${S.start}"> <button class="btn" data-act="setstart">Save start date</button><button class="btn ghost" data-act="startoday">Start today</button></div>
  <p style="margin-top:10px">Day 1: <b>${dayDate(1,0)}</b> · Last day (Day 84): <b>${planEnd()}</b><br>${when}</p></div>
  <div class="card"><h3 style="margin-top:0">🎉 Celebrations</h3><p class="sm">Popups and confetti when you finish a task, day, week, topic, project or quiz, plus bonus XP for each. Turn them off if you prefer a quiet screen. They also switch off automatically if your device is set to reduce motion.</p>
  <div class="qa-actions" style="margin:0"><label class="row ${S.celebrate!==false?'done':''}" style="padding:4px 8px"><input type="checkbox" data-act="celeb" ${S.celebrate!==false?'checked':''}><span class="box"></span><span class="txt">Celebrations on</span></label><button class="btn ghost" data-act="celeb-test">Preview a big win</button></div></div>
  <div class="card" style="border-color:var(--bad)"><h3 style="margin-top:0">🗑️ Reset everything</h3><p class="sm">Clears <b>all</b> progress: ticked tasks, XP, streak, badges, solved practice, flagged questions, applications and the start date (the plan restarts today). Your theme and celebration choice are kept. You will be asked to type RESET, and there is no undo.</p>
  <button class="btn danger" data-act="reset">Reset all progress</button></div>`;
}
