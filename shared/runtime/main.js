/* =============================== INTERACTION LAYER =============================== */
Object.assign(A, {
  nav: el => { closeOverlays(); go(el.dataset.r); },
  close: () => closeOverlays(),
  'toast-x': el => el.closest('.toast').remove(),
  'tg-group': el => { const g = el.dataset.g; const open = el.getAttribute('aria-expanded') === 'true'; if (open) { S.openG.delete(g); S.openG.add('__x' + g); } else { S.openG.add(g); S.openG.delete('__x' + g); } store.set('openG', [...S.openG]); APP.renderSide(); const b = document.querySelector(`[data-g="${g}"]`); if (b) b.focus(); },
  'tg-mod': el => { if (S.collapsed && innerWidth > 900) { showFly(el); return; } const m = el.dataset.m; if (el.getAttribute('aria-expanded') === 'true') { S.openM.delete(m); S.openM.add('__x' + m); } else { S.openM.add(m); S.openM.delete('__x' + m); } store.set('openM', [...S.openM]); APP.renderSide(); const b = document.querySelector(`[data-m="${m}"]`); if (b) b.focus(); },
  collapse: () => { S.collapsed = !S.collapsed; store.set('collapsed', S.collapsed); document.getElementById('app').classList.toggle('collapsed', S.collapsed); hideTip(); APP.renderSide(); },
  drawer: () => document.getElementById('app').classList.toggle('drawer-open'),
  search: () => openSearch(),
  notif: el => popAt(el, notifHTML()),
  acct: el => popAt(el, APP.accountMenu()),
  lang: el => { S.lang = el.dataset.v; store.set('lang', S.lang); applyLang(); closeOverlays(); APP.renderTop(); APP.renderBanners(); rerender(); },
  theme: el => { S.theme = el.dataset.v; store.set('theme', S.theme); applyTheme(); APP.renderTop(); const p = document.getElementById('pop'); if (p) document.querySelectorAll('#pop [data-act="theme"]').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.theme)); },
  role: el => { S.role = el.dataset.v; store.set('role', S.role); closeOverlays(); APP.renderTop(); APP.renderBanners(); rerender(); toast('info', L3(['Permission dimuat ulang dari backend', 'Permissions reloaded from backend', 'أُعيد تحميل الصلاحيات']), ROLES[S.role].label + ' · ' + ROLES[S.role].perms.length + ' permission'); },
  ux: el => { S.ux = el.dataset.v; closeOverlays(); APP.renderBanners(); rerender(); },
  signout: () => { closeOverlays(); toast('info', L3(['Demo: sesi tetap aktif', 'Demo: session stays active', 'عرض: الجلسة نشطة']), L3(['Di produksi, sign out mencabut token di server.', 'In production, sign-out revokes the token server-side.', 'في الإنتاج يُلغى الرمز من الخادم.'])); },
  'cmd-scope': el => { CMD.scope = el.dataset.v; CMD.i = 0; document.querySelectorAll('[data-act="cmd-scope"]').forEach(b => b.setAttribute('aria-pressed', b === el)); drawCmd(); document.getElementById('cmdq').focus(); },
  'cmd-go': el => { closeOverlays(); go(el.dataset.r); },
  ncat: el => { NCAT = el.dataset.v; document.getElementById('pop').innerHTML = notifHTML(); },
  'notif-read': () => { (typeof myNotifs === 'function' ? myNotifs() : NOTIFS).forEach(n => n.unread = false); document.getElementById('pop').innerHTML = notifHTML(); APP.renderTop(); },
  'notif-go': el => { const n = NOTIFS[+el.dataset.i]; n.unread = false; APP.renderTop(); closeOverlays(); go(n.route); },
  copy: el => { const v = el.dataset.v; try { navigator.clipboard.writeText(v).then(() => toast('ok', L3(['Disalin', 'Copied', 'تم النسخ']), v), () => toast('info', v, L3(['Salin manual', 'Copy manually', 'انسخ يدوياً']))); } catch (e) { toast('info', v, ''); } closeOverlays(); },

});
['role', 'ux'].forEach(name => { if (!actionAllowed(name, ['control-center'])) delete A[name]; });
A['confirm-ok'] = el => { const need = el.dataset.need === '1'; const ta = document.getElementById('cf-reason'); const r = ta ? ta.value.trim() : ''; if (need && !r) { ta.focus(); ta.style.borderColor = 'var(--bad)'; document.getElementById('cf-hint').style.color = 'var(--bad)'; return; } const cb = confirmCb; confirmCb = null; closeOverlays(); if (cb) cb(r || null); };

document.addEventListener('click', e => {
  const dis = e.target.closest('[aria-disabled="true"]:not([data-act])'); if (dis) { e.preventDefault(); toast('warn', dis.dataset.tip || t('no_perm_action'), L3(['Aksi dinonaktifkan sesuai permission/state dari backend.', 'Action disabled per backend permission/state.', 'الإجراء معطل حسب الصلاحيات.'])); return; }
  const el = e.target.closest('[data-act]');
  if (el) { if (el.getAttribute('aria-disabled') === 'true' && !['close'].includes(el.dataset.act)) { e.preventDefault(); toast('warn', el.dataset.tip || t('no_perm_action'), L3(['Aksi dinonaktifkan sesuai permission/state dari backend.', 'Action disabled per backend permission/state.', 'الإجراء معطل حسب الصلاحيات.'])); return; } const fn = A[el.dataset.act]; if (fn) { if (el.tagName === 'INPUT') { fn(el, e); return; } e.preventDefault(); fn(el, e); return; } }
  const row = e.target.closest('tr[data-href]'); if (row && !e.target.closest('a,button,input,select')) { go(row.dataset.href); return; }
  const a = e.target.closest('a[href^="#"]'); if (a && document.getElementById('app').classList.contains('drawer-open')) document.getElementById('app').classList.remove('drawer-open');
});
document.addEventListener('change', e => { const el = e.target; if (el.dataset.actChange === 'tbl-size') { const T = TBL[el.dataset.tbl]; T.size = +el.value; T.page = 1; refreshTable(el.dataset.tbl); } });
document.addEventListener('input', e => { const el = e.target; if (el.dataset.tblq) { const T = TBL[el.dataset.tblq]; T.q = el.value; T.page = 1; refreshTable(el.dataset.tblq, true); } });
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); return; }
  if (e.key === 'Escape') { if (ovl().innerHTML) { closeOverlays(); return; } const app = document.getElementById('app'); if (app.classList.contains('drawer-open')) app.classList.remove('drawer-open'); if (APP.closeContext) APP.closeContext(); const f = document.getElementById('flyout'); if (f) f.remove(); }
  if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
  if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && document.activeElement.closest('#side .side-scroll')) { e.preventDefault(); const items = [...document.querySelectorAll('#side .nav-gbtn, #side .nav-item')]; const i = items.indexOf(document.activeElement); const n = items[i + (e.key === 'ArrowDown' ? 1 : -1)]; if (n) n.focus(); }
  if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && document.activeElement.closest('#pop .menu')) { e.preventDefault(); const items = [...document.querySelectorAll('#pop .mi')]; const i = items.indexOf(document.activeElement); const n = items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]; if (n) n.focus(); }
  if (e.key === 'Tab' && ovl().querySelector('[aria-modal="true"]')) { const m = ovl().querySelector('[aria-modal="true"]'); const f = [...m.querySelectorAll('button,a[href],input,textarea,select')].filter(x => !x.disabled && x.offsetParent); if (!f.length) return; if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); } }
});
document.addEventListener('mouseover', e => { const el = e.target.closest('[data-tip],[data-label]'); if (!el) { if (tipEl) hideTip(); return; } if (el.dataset.fly && S.collapsed && innerWidth > 900) { if (!document.getElementById('flyout')) showFly(el); return; } if (el.dataset.tip) showTip(el, el.dataset.tip, !!el.closest('.chart,.hbar')); else if (el.dataset.label && S.collapsed && innerWidth > 900 && el.closest('#side')) showTip(el, el.dataset.label); });
document.addEventListener('focusin', e => { const el = e.target.closest('[data-label]'); if (el && S.collapsed && innerWidth > 900 && el.closest('#side')) showTip(el, el.dataset.label); });
document.addEventListener('focusout', () => hideTip());
window.addEventListener('hashchange', render);
window.addEventListener('resize', () => hideTip());
try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (S.theme === 'system') applyTheme(); }); } catch (e) {}

