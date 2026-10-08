/* Notes: a text box under every plan day, plus a general scratchpad. Saved in this browser. */
function noteBox(key,rows){
  const n=S.notes[key];
  return `<textarea class="note-box" data-note="${esc(key)}" rows="${rows||3}" placeholder="Write what confused you, a shortcut you found, or a question for later…">${esc(n?n.t:'')}</textarea><span class="sm note-saved" data-notestat="${esc(key)}">${n&&n.t?'Saved ✓':''}</span>`;
}
let NOTE_T=null;
document.addEventListener('input',e=>{
  const t=e.target;if(!t.matches||!t.matches('textarea[data-note]'))return;
  const key=t.dataset.note,v=t.value;
  if(v.trim())S.notes[key]={t:v,u:Date.now()};else delete S.notes[key];
  const st=document.querySelector(`[data-notestat="${key}"]`);if(st)st.textContent='Saving…';
  clearTimeout(NOTE_T);
  NOTE_T=setTimeout(()=>{save();const s2=document.querySelector(`[data-notestat="${key}"]`);if(s2)s2.textContent=v.trim()?'Saved ✓':''},500);
});
function noteLabel(key){
  if(key==='general')return 'General scratchpad';
  const m=key.match(/^w(\d+)d(\d)$/);
  if(m){const w=+m[1],d=+m[2];return `Week ${w} · ${DAYN[d]} · ${WEEKS[w-1].title}`}
  return key;
}
function pageNotes(){
  const keys=Object.keys(S.notes).filter(k=>k!=='general').sort((a,b)=>S.notes[b].u-S.notes[a].u);
  let h=`<h2>📝 Notes</h2><p class="lead">Your own notes from the plan days, in one place. Add notes inside any day of a week guide.</p>
  <div class="card"><h3 style="margin-top:0">General scratchpad</h3>${noteBox('general',6)}</div>`;
  if(!keys.length)h+=`<div class="note">No day notes yet. Open a week guide and use the "My notes" box under any day.</div>`;
  keys.forEach(k=>{
    const m=k.match(/^w(\d+)d(\d)$/);
    h+=`<div class="card"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b>${esc(noteLabel(k))}</b>${m?`<a class="sm" href="week-${m[1]}.html#day-${m[2]}">Open this day →</a>`:''}</div>
    <div class="sm">${new Date(S.notes[k].u).toLocaleString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</div>${noteBox(k,4)}</div>`});
  return h;
}
