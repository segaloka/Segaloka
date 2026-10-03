/* =====================================================================
   PORTAL EKOSISTEM — Travel · Vendor · Pengguna · Affiliate · Mitra Travel · Agen
   Satu aplikasi, satu database. Setiap portal dibatasi (scoped) ke satu entitas.
   Di produksi: tiap portal = login sendiri + RLS per tenant; di sini: pratinjau "masuk sebagai".
   ===================================================================== */
function ensureLinks() { let n = 0; const h = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7); BOOKINGS.forEach(b => { if (b.mitra || b.lk) return; const ms = MITRA.filter(m => m.travel === b.travel && m.status === 'active'); b.lk = 1; n++; if (!ms.length || !(b.source === 'Mitra Travel' || h(b.id) % 3 === 0)) return; const m = ms[h(b.id) % ms.length]; b.source = 'Mitra Travel'; b.mitra = m.id; const ag = AGEN.filter(a => a.mitra === m.id && a.status === 'active'); if (ag.length && h(b.id) % 2) b.agen = ag[h(b.id) % ag.length].id; }); return n; }
ensureLinks();

const WS = {
  travel: { label: ['Portal Travel', 'Travel Portal', 'بوابة شركة السفر'], icon: 'building', list: () => TRAVELS, sub: x => x.id + ' · ' + x.city, home: '/p/travel' },
  vendor: { label: ['Portal Vendor', 'Vendor Portal', 'بوابة المورد'], icon: 'store', list: () => VENDORS, sub: x => x.id + ' · ' + x.cats.join(', '), home: '/p/vendor' },
  traveler: { label: ['Aplikasi Pengguna', 'Traveler App', 'تطبيق المسافر'], icon: 'user', list: () => TRAVELERS, sub: x => x.id + ' · ' + x.city, home: '/p/traveler' },
  affiliate: { label: ['Portal Affiliate', 'Affiliate Portal', 'بوابة المسوّق'], icon: 'link', list: () => AFFILIATES, sub: x => x.id + ' · ' + x.type, home: '/p/affiliate' },
  mitra: { label: ['Portal Mitra Travel', 'Travel Partner Portal', 'بوابة الشريك'], icon: 'users', list: () => MITRA, sub: x => x.id + ' · ' + (travelById(x.travel) || {}).name, home: '/p/mitra' },
  agen: { label: ['Portal Agen', 'Agent Portal', 'بوابة الوكيل'], icon: 'user', list: () => AGEN, sub: x => x.id + ' · Mitra ' + (MITRA.find(m => m.id === x.mitra) || {}).name, home: '/p/agen' }
};
const PNAV = {
  travel: [['home', ['Beranda', 'Home', 'الرئيسية'], ''], ['package', ['Paket', 'Packages', 'الباقات'], '/packages'], ['calendar', ['Booking', 'Bookings', 'الحجوزات'], '/bookings'], ['plane', ['Keberangkatan', 'Departures', 'الرحلات'], '/departures'], ['users', ['Mitra & Agen', 'Partners & Agents', 'الشركاء والوكلاء'], '/mitra'], ['store', ['Layanan Vendor', 'Vendor Services', 'خدمات الموردين'], '/vendors'], ['wallet', ['Keuangan', 'Finance', 'المالية'], '/finance'], ['filecheck', ['Legalitas', 'Legality', 'الترخيص'], '/legal'], ['refresh', ['Subscription', 'Subscription', 'الاشتراك'], '/subscription']],
  vendor: [['home', ['Beranda', 'Home', 'الرئيسية'], ''], ['package', ['Produk & Layanan', 'Products & Services', 'المنتجات'], '/products'], ['list', ['Order', 'Orders', 'الطلبات'], '/orders'], ['wallet', ['Keuangan', 'Finance', 'المالية'], '/finance'], ['folder', ['Dokumen & Verifikasi', 'Documents & Verification', 'المستندات'], '/documents']],
  traveler: [['home', ['Beranda', 'Home', 'الرئيسية'], ''], ['calendar', ['Booking saya', 'My bookings', 'حجوزاتي'], '/bookings'], ['msg', ['Chat', 'Chat', 'المحادثة'], '/chat'], ['user', ['Profil', 'Profile', 'الملف'], '/profile']],
  affiliate: [['home', ['Beranda', 'Home', 'الرئيسية'], ''], ['link', ['Link referral', 'Referral links', 'روابط الإحالة'], '/links'], ['percent', ['Komisi', 'Commission', 'العمولات'], '/commissions'], ['arrowur', ['Payout', 'Payout', 'الصرف'], '/payout']],
  mitra: [['home', ['Beranda', 'Home', 'الرئيسية'], ''], ['package', ['Paket & Daftar Jamaah', 'Packages & Register', 'الباقات'], '/packages'], ['calendar', ['Booking', 'Bookings', 'الحجوزات'], '/bookings'], ['users', ['Agen saya', 'My agents', 'وكلائي'], '/agen'], ['percent', ['Komisi', 'Commission', 'العمولات'], '/commission']],
  agen: [['home', ['Beranda', 'Home', 'الرئيسية'], ''], ['package', ['Paket & Daftar Jamaah', 'Packages & Register', 'الباقات'], '/packages'], ['calendar', ['Booking', 'Bookings', 'الحجوزات'], '/bookings'], ['percent', ['Komisi', 'Commission', 'العمولات'], '/commission']]
};
const PENT = store.get('pent', {});
const wsOf = r => { const m = (r || S.route).match(/^\/p\/([a-z]+)/); return m && WS[m[1]] ? m[1] : 'admin'; };
function me(ws) { const L = WS[ws].list(); let x = L.find(o => o.id === PENT[ws]); if (!x) { x = L.find(o => !['inactive', 'suspended'].includes(o.status || o.op)) || L[0]; if (x) PENT[ws] = x.id; } return x; }
const wsLabel = ws => ws === 'admin' ? 'Super Admin · ' + t('control_center') : L3(WS[ws].label);
const pAudit = (ws, action, resource, extra) => audit(me(ws).name, action, resource, 'success', Object.assign({ source: L3(WS[ws].label) }, extra || {}));
const pNotif = (cat, tone, title, sub, route) => { NOTIFS.unshift({ id: uid('NTF'), cat, tone, title, sub, route, ts: nowTs(), unread: true }); APP.renderTop(); };
const pApproval = o => { const a = Object.assign({ id: uid('APR'), status: 'waiting', priority: 'p2', assignee: null, ts: nowTs(), risk: 15, docs: [], ctx: [], notes: [], fresh: true }, o); a.history = [{ t: 'Diajukan dari ' + o.source, ts: nowTs(), tone: 'info' }]; delete a.source; APPROVALS.unshift(a); return a; };
const pHead = (ws, title, desc, actions) => phead({ crumbs: [[L3(WS[ws].label), WS[ws].home], [title, '']], title, desc, actions }) + (typeof portalStatusBanner === 'function' ? portalStatusBanner(ws) : '');

const portalBadge = ws => `<span class="chip" style="background:var(--accent-soft);color:var(--accent-text)">${ic(WS[ws].icon, 'sm')}${esc(L3(WS[ws].label))}</span>`;
const tbl = (head, rows, empty) => rows.length ? `<div class="tbl-wrap"><table class="t"><thead><tr>${head.map(h => `<th class="${/^(Total|Nilai|Harga|Amount|Komisi|Saldo|Pax|Seat|GMV|Klik|Konversi|Rp)/.test(h) ? 'r' : ''}">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>` : stateBlock('empty', empty ? { title: empty } : {});
const rowLink = (href, cells) => `<tr class="clickable" data-href="${href}">${cells}</tr>`;
const portalOpt = a => (a || []).map(x => Array.isArray(x) ? x : [x, x]);
function portalFieldHTML(f, v, pfx) {
  const id = pfx + f.k, val = v == null ? (f.def != null ? f.def : '') : v, req = f.req ? ' *' : '';
  if (f.type === 'select') return `<div class="field"><label for="${id}">${esc(f.label)}${req}</label><select id="${id}">${portalOpt(typeof f.options === 'function' ? f.options() : f.options).map(o => `<option value="${esc(o[0])}" ${String(val) === String(o[0]) ? 'selected' : ''}>${esc(o[1])}</option>`).join('')}</select>${f.hint ? `<span class="hint">${esc(f.hint)}</span>` : ''}</div>`;
  if (f.type === 'textarea') return `<div class="field"><label for="${id}">${esc(f.label)}${req}</label><textarea id="${id}">${esc(val)}</textarea>${f.hint ? `<span class="hint">${esc(f.hint)}</span>` : ''}</div>`;
  if (f.type === 'toggle') return `<label class="field" style="flex-direction:row;align-items:center;gap:8px;font-size:13px"><input type="checkbox" id="${id}" ${val ? 'checked' : ''}> ${esc(f.label)}</label>`;
  return `<div class="field"><label for="${id}">${esc(f.label)}${req}</label><input type="${f.type || 'text'}" id="${id}" value="${esc(val)}" ${f.min != null ? 'min="' + f.min + '"' : ''} ${f.max != null ? 'max="' + f.max + '"' : ''} ${f.step ? 'step="' + f.step + '"' : ''}>${f.hint ? `<span class="hint">${esc(f.hint)}</span>` : ''}</div>`;
}
const fields = (F, pfx) => F.map(f => portalFieldHTML(f, null, pfx)).join('');

