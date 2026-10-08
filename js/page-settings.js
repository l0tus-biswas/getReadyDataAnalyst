function pageSettings(){
  const st=typeof syncText==='function'?syncText():'';
  const on=typeof SYNC!=='undefined'&&SYNC.key;
  return `<h2>⚙️ Settings</h2><div class="card"><h3 style="margin-top:0">Plan start date</h3><p class="sm">Week 1 starts on the Monday of this date's week.</p>
  <input type="date" id="startd" value="${S.start}"> <button class="btn" data-act="setstart">Save</button></div>
  <div class="card"><h3 style="margin-top:0">☁️ Cloud sync</h3><p class="sm">Save your progress to your own cloud database so it follows you across laptop and phone. Use the passphrase you set as <code>SYNC_KEY</code> on the server. The newest copy wins.</p>
  <p id="syncstat">${st}</p>
  <div class="qa-actions" style="margin:0"><input type="password" id="synckey" placeholder="${on?'Connected (enter a new key to change)':'Sync passphrase'}" autocomplete="off">
  <button class="btn" data-act="sync-connect">Connect</button>${on?'<button class="btn ghost" data-act="sync-now">Sync now</button><button class="btn ghost" data-act="sync-off">Disconnect</button>':''}</div></div>
  <div class="card"><h3 style="margin-top:0">Backup</h3><p class="sm">Even with cloud sync, export a copy now and then.</p>
  <button class="btn" data-act="export">⬇ Export progress (JSON)</button> <input type="file" id="imp" accept=".json" style="display:none"><button class="btn ghost" data-act="import">⬆ Import</button></div>
  <div class="card"><h3 style="margin-top:0">Reset</h3><p class="sm">If cloud sync is connected, this resets the cloud copy too.</p><button class="btn danger" data-act="reset">Reset all progress</button></div>`;
}
