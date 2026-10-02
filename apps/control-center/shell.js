function navBadge(n) { if (!n.badge) return ''; const v = n.badge(); if (!v) return ''; return `<span class="nbadge ${n.alert ? 'alert' : 'count'}" aria-label="${v} item">${v}</span>`; }
function renderSide() {
  const pws = typeof wsOf === 'function' ? wsOf() : 'admin'; if (pws !== 'admin') { renderPortalSide(pws); return; }
  const act = activeNavId(S.route), an = NAVIDX[act]; const f = S.navFilter.toLowerCase();
  const match = n => !f || t(n.id).toLowerCase().includes(f) || (n.kids || []).some(k => t(k.id).toLowerCase().includes(f));
  let h = `<div class="side-head"><div class="brandmark" style="--brand:${BRAND.color}">${esc(BRAND.mark)}</div><div class="brandtext"><div class="brandname">${esc(BRAND.name)}</div><div class="brandsub">${esc(t('control_center'))}</div></div></div>
  <div class="side-filter">${ic('search', 'sm')}<input id="navfilter" type="search" placeholder="${esc(t('filter_menu'))}" value="${esc(S.navFilter)}" aria-label="${esc(t('filter_menu'))}"></div>
  <nav class="side-scroll" id="sidenav">`;
  NAV.forEach(g => {
    const items = g.items.filter(m => can(m.p) && match(m)); if (!items.length) return;
    const hasActive = items.some(m => m.id === act || (an && an.parent === m));
    const open = f || S.openG.has(g.g) || (hasActive && !S.openG.has('__x' + g.g)); const alertSum = items.reduce((s, m) => s + (m.alert && m.badge ? m.badge() : 0), 0);
    h += `<div class="nav-group"><button class="nav-gbtn" data-act="tg-group" data-g="${g.g}" aria-expanded="${open}"><span class="gl">${esc(t(g.g))}</span>${!open && alertSum ? `<span class="gcount">${alertSum}</span>` : ''}${ic('chevD', 'sm chev')}</button>`;
    if (open) {
      h += `<ul class="nav-list">`;
      items.forEach(m => {
        if (m.kids) {
          const kidAct = an && an.parent === m; const mo = f || S.openM.has(m.id) || (kidAct && !S.openM.has('__x' + m.id)); const kb = m.kids.reduce((s, k) => s + (k.badge ? k.badge() : 0), 0);
          h += `<li><button class="nav-item ${kidAct ? 'parent-active' : ''}" data-act="tg-mod" data-m="${m.id}" aria-expanded="${mo}" data-label="${esc(t(m.id))}" data-fly="${m.id}">${ic(m.i)}<span class="lbl">${esc(t(m.id))}</span>${!mo && kb ? `<span class="nbadge count">${kb}</span>` : ''}${kb ? '<i class="dot"></i>' : ''}${icd('chevR', 'sm chev')}</button>`;
          if (mo) h += `<ul class="nav-sub">${m.kids.filter(k => !f || t(k.id).toLowerCase().includes(f) || t(m.id).toLowerCase().includes(f)).map(k => `<li><a class="nav-item ${k.id === act ? 'active' : ''}" href="#${k.r}" ${k.id === act ? 'aria-current="page"' : ''}><span class="lbl">${esc(t(k.id))}</span>${navBadge(k)}${k.lvl === 'ph' ? `<span class="nbadge soon" title="${esc(t('lvl_ph'))}">IA</span>` : ''}</a></li>`).join('')}</ul>`;
          h += `</li>`;
        } else {
          h += `<li><a class="nav-item ${m.id === act ? 'active' : ''}" href="#${m.r}" data-label="${esc(t(m.id))}" ${m.id === act ? 'aria-current="page"' : ''}>${ic(m.i)}<span class="lbl">${esc(t(m.id))}</span>${navBadge(m)}${m.badge && m.badge() && m.alert ? '<i class="dot"></i>' : ''}${m.lvl === 'ph' ? `<span class="nbadge soon" title="${esc(t('lvl_ph'))}">IA</span>` : ''}</a></li>`;
        }
      });
      h += `</ul>`;
    }
    h += `</div>`;
  });
  h += `</nav><div class="side-foot"><a class="nav-item ${act === 'iamap' ? 'active' : ''}" href="#/ia" data-label="${esc(t('iamap'))}">${ic('grid')}<span class="lbl">${esc(t('iamap'))}</span></a><button class="iconbtn desk-only" style="color:var(--side-ink-2)" data-act="collapse" aria-label="${esc(S.collapsed ? t('expand') : t('collapse'))}" data-label="${esc(S.collapsed ? t('expand') : t('collapse'))}">${ic('panel')}</button></div>`;
  const side = document.getElementById('side'); const sc = side.querySelector('.side-scroll'); const top = sc ? sc.scrollTop : 0; side.innerHTML = h; side.querySelector('.side-scroll').scrollTop = top;
  const fi = document.getElementById('navfilter'); fi.addEventListener('input', e => { S.navFilter = e.target.value; renderSide(); const n = document.getElementById('navfilter'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); });
}
