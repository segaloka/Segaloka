function renderPortalTop() {
  const ws = wsOf();
  const x = me(ws);
  const unread = (typeof myNotifs === 'function' ? myNotifs() : NOTIFS).filter(n => n.unread).length;
  document.getElementById('top').innerHTML = `
    <button class="iconbtn mob-only" data-act="drawer" aria-label="Menu">${ic('menu')}</button>
    <div class="wsbtn" aria-label="${esc(L3(WS[ws].label))}">${ic(WS[ws].icon, 'sm')}<span class="wsl">${esc(L3(WS[ws].label))}</span></div>
    <button class="searchbtn" data-act="search" aria-label="${esc(t('search'))}">${ic('search')}<span>${esc(t('search_ph'))}</span><kbd>Ctrl K</kbd></button>
    <div class="top-sp"></div>
    <button class="envpill" id="sync-pill" data-act="sync-info" title="Sync status"><i></i><span class="envtext">${esc(L3(['Menghubungkan…', 'Connecting…', 'جارٍ الاتصال…']))}</span></button>
    <div class="hijri"><b>${esc(fD(nowTs(), { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }))}</b>${esc(hijri())}</div>
    <div class="seg lang" role="group" aria-label="${esc(t('language'))}">${['id', 'en', 'ar'].map(l => `<button data-act="lang" data-v="${l}" aria-pressed="${S.lang === l}">${{ id: 'ID', en: 'EN', ar: 'AR' }[l]}</button>`).join('')}</div>
    <div class="seg theme" role="group" aria-label="${esc(t('theme'))}">${[['light', 'sun'], ['dark', 'moon'], ['system', 'monitor']].map(([v, i]) => `<button data-act="theme" data-v="${v}" aria-pressed="${S.theme === v}" aria-label="${esc(t('theme_' + v))}" data-tip="${esc(t('theme_' + v))}">${ic(i, 'sm')}</button>`).join('')}</div>
    <button class="iconbtn" data-act="notif" aria-label="${esc(t('notifications'))}" id="bellbtn">${ic('bell')}${unread ? `<span class="nbadge alert">${unread}</span>` : ''}</button>
    <button class="acctbtn" data-act="acct" aria-haspopup="menu"><span class="avatar">${esc(initials(x ? x.name : L3(WS[ws].label)))}</span><span class="who"><b>${esc(x ? x.name : L3(WS[ws].label))}</b><span>${esc(L3(WS[ws].label))}</span></span>${ic('chevD', 'sm')}</button>`;
  if (typeof paintSync === 'function') paintSync();
}
function renderPortalBanners() {
  const b = document.getElementById('banners'); let h = '';
  if (S.ux === 'offline') h += `<div class="banner warn" role="status">${ic('wifioff')}<span style="flex:1">${esc(t('offline_b'))}</span><span class="live off"><i></i>Reconnecting · 3</span></div>`;
  b.innerHTML = h;
}
function portalAcctHTML() {
  const ws = wsOf(); const x = me(ws);
  return `<div class="menu" style="min-width:270px"><div style="padding:8px 9px 10px;display:flex;gap:10px;align-items:center"><span class="avatar">${esc(initials(x ? x.name : L3(WS[ws].label)))}</span><div><b>${esc(x ? x.name : L3(WS[ws].label))}</b><div class="muted" style="font-size:12px">${esc(L3(WS[ws].label))}</div></div></div><div class="sep"></div><div class="mh">${t('language')} · ${t('theme')}</div><div style="display:flex;gap:6px;padding:4px 9px 8px;flex-wrap:wrap"><div class="seg">${['id', 'en', 'ar'].map(l => `<button data-act="lang" data-v="${l}" aria-pressed="${S.lang === l}">${l.toUpperCase()}</button>`).join('')}</div><div class="seg">${[['light', 'sun'], ['dark', 'moon'], ['system', 'monitor']].map(([v, i]) => `<button data-act="theme" data-v="${v}" aria-pressed="${S.theme === v}" aria-label="${t('theme_' + v)}">${ic(i, 'sm')}</button>`).join('')}</div></div><div class="sep"></div><button class="mi" data-act="signout">${icd('logout', 'sm')}${t('signout')}</button></div>`;
}
