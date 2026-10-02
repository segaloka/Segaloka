function hijri() { try { return new Intl.DateTimeFormat((S.lang === 'ar' ? 'ar-SA' : S.lang === 'en' ? 'en' : 'id') + '-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }).format(nowTs()); } catch (e) { return ''; } }
function renderTop() {
  const unread = (typeof myNotifs === 'function' ? myNotifs() : NOTIFS).filter(n => n.unread).length; const r = ROLES[S.role];
  document.getElementById('top').innerHTML = `
    <button class="iconbtn mob-only" data-act="drawer" aria-label="Menu">${ic('menu')}</button>
    <div class="wsbtn" aria-label="${esc(wsOf() === 'admin' ? 'Super Admin' : L3(WS[wsOf()].label))}">${ic(wsOf() === 'admin' ? 'shieldc' : WS[wsOf()].icon, 'sm')}<span class="wsl">${esc(wsOf() === 'admin' ? 'Super Admin' : L3(WS[wsOf()].label))}</span></div>
    <button class="searchbtn" data-act="search" aria-label="${esc(t('search'))}">${ic('search')}<span>${esc(t('search_ph'))}</span><kbd>Ctrl K</kbd></button>
    <div class="top-sp"></div>
    <button class="envpill" id="sync-pill" data-act="sync-info" title="Sync status"><i></i><span class="envtext">${esc(t('env_demo'))}</span></button>
    <div class="hijri"><b>${esc(fD(nowTs(), { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }))}</b>${esc(hijri())}</div>
    <div class="seg lang" role="group" aria-label="${esc(t('language'))}">${['id', 'en', 'ar'].map(l => `<button data-act="lang" data-v="${l}" aria-pressed="${S.lang === l}">${{ id: 'ID', en: 'EN', ar: 'AR' }[l]}</button>`).join('')}</div>
    <div class="seg theme" role="group" aria-label="${esc(t('theme'))}">${[['light', 'sun'], ['dark', 'moon'], ['system', 'monitor']].map(([v, i]) => `<button data-act="theme" data-v="${v}" aria-pressed="${S.theme === v}" aria-label="${esc(t('theme_' + v))}" data-tip="${esc(t('theme_' + v))}">${ic(i, 'sm')}</button>`).join('')}</div>
    <button class="iconbtn" data-act="notif" aria-label="${esc(t('notifications'))}" id="bellbtn">${ic('bell')}${unread ? `<span class="nbadge alert">${unread}</span>` : ''}</button>
    <button class="acctbtn" data-act="acct" aria-haspopup="menu"><span class="avatar">SA</span><span class="who"><b>Admin Pusat</b><span>${esc(r.label)}</span></span>${ic('chevD', 'sm')}</button>`;
  if (typeof paintSync === 'function') paintSync();
}
function renderBanners() {
  const b = document.getElementById('banners'); let h = '';
  if (S.ux === 'offline') h += `<div class="banner warn" role="status">${ic('wifioff')}<span style="flex:1">${esc(t('offline_b'))}</span><span class="live off"><i></i>Reconnecting · 3</span></div>`;
  if (S.role !== 'super_admin') h += `<div class="banner info" role="status">${ic('lock')}<span style="flex:1">${esc(L3(['Mode simulasi permission: ', 'Permission simulation: ', 'محاكاة الصلاحيات: ']))}<b>${esc(ROLES[S.role].label)}</b> — ${esc(L3(['menu & aksi mengikuti permission granular dari backend, bukan nama role.', 'menus & actions follow granular backend permissions, not role names.', 'القوائم والإجراءات تتبع صلاحيات الخادم التفصيلية.']))}</span><button class="btn sm" data-act="role" data-v="super_admin">${esc(L3(['Kembali ke Super Admin', 'Back to Super Admin', 'العودة للمشرف العام']))}</button></div>`;
  b.innerHTML = h;
}

