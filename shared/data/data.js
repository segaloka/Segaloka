/* =====================================================================
   DEMONSTRATION DATA — PRESENTATION ONLY.
   Semua nama, angka, dan transaksi di bawah adalah fiktif & disimulasikan.
   Di produksi, layer ini digantikan oleh API (single source of truth);
   UI hanya me-render state + permission yang dikirim backend.
   ===================================================================== */
const MOCK = true;
const T0 = new Date('2026-09-24T01:04:00+08:00').getTime();
const LOAD_AT = Date.now();
const nowTs = () => Date.now();
let _seed = 20260924;
const rnd = () => { _seed = (_seed * 1664525 + 1013904223) % 4294967296; return _seed / 4294967296; };
const ri = (a, b) => Math.floor(a + rnd() * (b - a + 1));
const pick = a => a[Math.floor(rnd() * a.length)];
const wpick = (a, w) => { let s = w.reduce((x, y) => x + y, 0), r = rnd() * s; for (let i = 0; i < a.length; i++) { if ((r -= w[i]) < 0) return a[i]; } return a[a.length - 1]; };
const H = 3600e3, D = 24 * H;

const BRAND = { name: 'SEGALOKA', legal: 'PT Segaloka Teknologi Nusantara (demo)', tagline: 'Control Center', color: '#0A6CF0', mark: 'S', typePreset: 'Plus Jakarta Sans', support: 'support@segaloka.example' };

const CITIES = [['Jakarta Selatan','DKI Jakarta'],['Surabaya','Jawa Timur'],['Makassar','Sulawesi Selatan'],['Bandung','Jawa Barat'],['Medan','Sumatera Utara'],['Yogyakarta','DI Yogyakarta'],['Semarang','Jawa Tengah'],['Banjarmasin','Kalimantan Selatan'],['Palembang','Sumatera Selatan'],['Pekanbaru','Riau'],['Mataram','NTB'],['Balikpapan','Kalimantan Timur'],['Banda Aceh','Aceh'],['Depok','Jawa Barat'],['Malang','Jawa Timur']];
const LOGO_COLORS = ['#2F5D50','#3A4F8F','#7A4B2A','#5B3F86','#23606F','#8A3B3B','#4E6A2B','#2B4E72','#6B5431','#3F6F5E'];
const PEOPLE = ['H. Ahmad Fauzan','Hj. Siti Nurhaliza R.','Muhammad Rizky','Dewi Kartika','Abdul Rahman Hakim','Nur Aisyah','Fajar Ramadhan','Rina Marlina','Hendra Saputra','Laila Fitriani','Yusuf Maulana','Indah Permatasari','Ridwan Kamil S.','Aulia Rahma','Bambang Setiawan','Zahra Amelia','Ilham Nugraha','Putri Handayani','Taufik Hidayat','Salsabila Nur','Imam Syafi\'i','Kurniawati','Rudi Hartono','Maya Safitri','Arif Budiman','Nadia Khairunnisa','Hasan Basri','Wulan Sari','Agus Salim','Fitri Ayu'];
const TRAVEL_NAMES = ['Al-Mabrur Safar Nusantara','Baitussalam Travelindo','Cahaya Madinah Wisata','Darul Ihsan Tour','Nur Arafah Mandiri','Raudhah Amanah Tour','Zamzam Barokah Travel','Safa Marwah Indotama','Multazam Cita Wisata','Hijrah Sejahtera Tour','Al-Aqsa Persada Wisata','Assalam Holiday','Rihlah Nusa Tour','Mina Kharisma Travel','Uhud Mulia Perjalanan','Quba Insan Wisata','Thaif Andalan Tour','Jabal Nur Sentosa','Ar-Rayyan Lintas Travel','Kiswah Prima Tour','Sakinah Wisata Utama','Firdaus Jaya Travel','Tanjung Halal Holiday','Nusantara Halal Trip','Borneo Safar Travel','Celebes Hijrah Tour','Andalas Umrah Center','Lombok Amanah Tour','Mahakam Barokah Travel','Pasundan Islami Wisata','Mataram Rihlah Tour','Kalimaya Tour & Travel','Serambi Mekkah Wisata','Bintang Hijaz Travel','Samudra Umrah Indonesia','Pelangi Halal Tour'];
const initials = n => n.replace(/^(PT|CV|H\.|Hj\.)\s*/,'').split(/[\s-]+/).filter(w => /^[A-Za-z]/.test(w)).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const colorFor = s => LOGO_COLORS[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % LOGO_COLORS.length];

/* ---------- Travel tenants ---------- */
const TRAVELS = TRAVEL_NAMES.map((name, i) => {
  const [city, prov] = CITIES[i % CITIES.length];
  const umrah = i % 7 !== 5, haji = i % 3 === 0, tour = true;
  const licState = () => wpick(['verified','under_review','submitted','expired','rejected','expiring'], [66, 10, 6, 6, 3, 9]);
  const lic = [];
  lic.push({ type: 'BPW', no: `BPW/${ri(100,999)}/${ri(2019,2024)}`, status: i < 3 ? 'verified' : licState(), exp: T0 + ri(-40, 900) * D });
  if (umrah) lic.push({ type: 'PPIU', no: `U.${ri(100,899)} TAHUN ${ri(2018,2024)}`, status: i === 1 ? 'under_review' : licState(), exp: T0 + ri(-30, 1000) * D });
  if (haji) lic.push({ type: 'PIHK', no: `PIHK/${ri(10,99)}/${ri(2019,2024)}`, status: licState(), exp: T0 + ri(20, 1100) * D });
  lic.forEach(l => { if (l.status === 'expired') l.exp = T0 - ri(3, 60) * D; if (l.status === 'expiring') l.exp = T0 + ri(5, 28) * D; });
  const has = s => lic.some(l => l.status === s);
  const legal = has('rejected') ? 'rejected' : has('expired') ? 'expired' : (has('under_review') || has('submitted')) ? 'under_review' : has('expiring') ? 'expiring' : 'verified';
  const subState = i === 4 ? 'grace' : i === 9 ? 'suspended' : wpick(['active','grace','suspended','expired','pending','cancelled','trial'], [74, 6, 3, 4, 5, 2, 4]);
  const plan = wpick(['Starter','Growth','Scale'], [40, 42, 18]);
  const addonBranch = plan === 'Scale' ? ri(1, 6) : wpick([0, 1, 2], [70, 20, 10]);
  const quota = 2 + addonBranch;
  const branches = subState === 'pending' ? 0 : Math.min(quota, ri(1, quota));
  let op = legal === 'verified' || legal === 'expiring' ? 'active' : legal === 'under_review' ? 'review' : 'inactive';
  if (subState === 'suspended' || subState === 'expired' || subState === 'cancelled') op = 'inactive';
  if (i === 0 || i === 2) op = 'active';
  const payMode = wpick(['VIA_SEGALOKA','DIRECT_TO_TRAVEL'], [62, 38]);
  const contact = PEOPLE[(i * 7) % PEOPLE.length];
  return {
    id: 'TRV-' + String(10231 + i * 47).padStart(5, '0'), name, city, prov, lic, legal, op, payMode,
    sub: { plan, state: subState, renew: T0 + ri(-20, 300) * D, addonBranch, price: { Starter: 0, Growth: 499000, Scale: 1499000 }[plan] },
    branch: { used: branches, quota }, services: [umrah && 'Umrah', haji && 'Haji', tour && 'Halal Tour'].filter(Boolean),
    contact: { name: contact, role: 'Direktur Utama', phone: '+62 8' + ri(11, 59) + ' ' + ri(1000, 9999) + ' ' + ri(1000, 9999), email: contact.toLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '') + '@' + name.toLowerCase().replace(/[^a-z]+/g, '').slice(0, 14) + '.example' },
    npwp: `${ri(10,99)}.${ri(100,999)}.${ri(100,999)}.${ri(1,9)}-${ri(100,999)}.000`, nib: String(ri(1e12, 9e12)),
    joined: T0 - ri(40, 1200) * D, gmv30: op === 'inactive' ? ri(0, 200) * 1e6 : ri(600, 14000) * 1e6, book30: op === 'inactive' ? ri(0, 3) : ri(8, 180), rating: (ri(38, 50) / 10).toFixed(1),
    color: colorFor(name), website: name.toLowerCase().replace(/[^a-z]+/g, '').slice(0, 16) + '.segaloka.site'
  };
});
const travelById = id => TRAVELS.find(x => x.id === id);

/* ---------- Branches ---------- */
const BRANCHES = [];
TRAVELS.forEach(tr => { for (let b = 0; b < tr.branch.used; b++) { const [c] = CITIES[(TRAVELS.indexOf(tr) + b + 3) % CITIES.length]; BRANCHES.push({ id: tr.id.replace('TRV', 'BR') + '-' + (b + 1), travel: tr.id, name: b === 0 ? 'Kantor Pusat ' + tr.city : 'Cabang ' + c, city: b === 0 ? tr.city : c, head: pick(PEOPLE), status: b >= 2 ? 'active' : (tr.op === 'inactive' ? 'inactive' : 'active'), paid: b >= 2 }); } });

/* ---------- Vendors ---------- */
const VENDOR_CATS = ['Hotel','Tiket','Visa','Catering','Transportasi','Land Arrangement','Akomodasi','Perlengkapan'];
const VENDOR_NAMES = [['Al-Kiswah Hospitality',['Hotel','Akomodasi']],['Rawdah Transport Co.',['Transportasi']],['Hijaz Visa Services',['Visa']],['Taibah Catering',['Catering']],['Nusa Seat Consolidator',['Tiket']],['Anwar Land Arrangement',['Land Arrangement','Transportasi','Hotel']],['Masyair Bus Lines',['Transportasi']],['Qasr Ajyad Residence',['Hotel']],['Jeddah Link Transfer',['Transportasi']],['Sidrah Hotels Group',['Hotel','Akomodasi','Catering']],['Ihram Supplies ID',['Perlengkapan']],['Medina Pearl Stay',['Hotel']],['Faruq Ground Handling',['Land Arrangement']],['Barakah Catering KSA',['Catering']],['Sky Seat Aggregator',['Tiket','Visa']],['Istanbul Halal DMC',['Land Arrangement','Hotel']]];
const VENDORS = VENDOR_NAMES.map(([name, cats], i) => ({ id: 'VND-' + String(3101 + i * 13), name, cats, country: i % 4 === 0 ? 'Indonesia' : i === 15 ? 'Turki' : 'Arab Saudi', verif: wpick(['verified','under_review','submitted','rejected'], [70, 14, 10, 6]), status: 'active', products: ri(3, 42), orders30: ri(4, 260), gmv30: ri(90, 5200) * 1e6, balance: ri(10, 900) * 1e6, rating: (ri(38, 50) / 10).toFixed(1), sla: ri(82, 99), color: colorFor(name), joined: T0 - ri(30, 900) * D }));
VENDORS.forEach(v => { if (v.verif !== 'verified') v.status = v.verif === 'rejected' ? 'inactive' : 'review'; });

/* ---------- Shared marketplace/vendor product data ---------- */
const licFor = { Umrah: 'PPIU', Haji: 'PIHK', 'Halal Tour': 'BPW', Tour: 'BPW' };
const licOk = (tr, cat) => { const l = tr.lic.find(x => x.type === licFor[cat]); return l && ['verified', 'expiring'].includes(l.status); };


const VP_TPL = { Hotel: ['Kamar Quad', 'Kamar Double'], Tiket: ['Seat CGK–JED PP', 'Seat SUB–MED PP'], Visa: ['Visa Umrah (e-visa)'], Catering: ['Paket makan 3×/hari'], Transportasi: ['Bus Makkah–Madinah', 'Transfer bandara'], 'Land Arrangement': ['LA 9 hari', 'LA 12 hari'], Akomodasi: ['Apartemen keluarga'], Perlengkapan: ['Kit ihram & koper'] };
const VPRODUCTS = []; VENDORS.forEach(v => v.cats.forEach(c => (VP_TPL[c] || []).forEach(n => VPRODUCTS.push({ id: 'VP-' + (40100 + VPRODUCTS.length * 3), name: n + ' · ' + v.name.split(' ')[0], vendor: v.id, cat: c, price: ri(3, 90) * 1e5 * (c === 'Tiket' ? 40 : c === 'Land Arrangement' ? 30 : 1), unit: { Hotel: '/malam', Tiket: '/pax', Visa: '/pax', Catering: '/pax/hari', Transportasi: '/trip', 'Land Arrangement': '/pax', Akomodasi: '/malam', Perlengkapan: '/set' }[c], allot: ri(10, 400), state: v.verif !== 'verified' ? 'draft' : wpick(['published', 'review', 'draft', 'unpublished'], [60, 15, 10, 15]) }))));

/* ---------- Affiliates (multi-Travel, terpisah dari Vendor & Mitra) ---------- */
const AFF_NAMES = ['Rumah Hijrah Community','Kajian Pekanbaru Network','Ust. Hanif Maulana','Nadia Travel Notes','Komunitas Muslimah Bandung','Ahmad Fauzi','Siti Rahmawati','Majelis Taklim Al-Ikhlas','Halal Trip Enthusiast','Yayasan Cahaya Umat'];
const AFFILIATES = AFF_NAMES.map((name, i) => { const links = [...new Set([0, 0, 0].map(() => pick(TRAVELS).id))]; const clicks = ri(800, 24000), conv = ri(3, 90); return { id: 'AFF-' + String(701 + i * 9), name, type: i % 3 === 0 ? 'Komunitas' : i % 3 === 1 ? 'Organisasi' : 'Individu', travels: links, code: name.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6) + ri(10, 99), clicks, conv, gmv: conv * ri(28, 45) * 1e6, commission: conv * ri(400, 900) * 1e3, payable: ri(0, 12) * 1e6, status: i === 7 ? 'review' : 'active', color: colorFor(name) }; });

/* ---------- Mitra Travel (terhubung ke tepat SATU Travel) ---------- */
const MITRA = Array.from({ length: 14 }, (_, i) => ({ id: 'MTR-' + (5001 + i), name: pick(PEOPLE), travel: TRAVELS[i % 12].id, city: pick(CITIES)[0], jamaah30: ri(0, 24), status: i % 6 === 5 ? 'inactive' : 'active' }));

const AGEN = [];
MITRA.forEach((m, i) => { for (let k = 0; k < i % 4; k++) AGEN.push({ id: 'AGN-' + (8101 + AGEN.length * 3), name: PEOPLE[(i * 5 + k * 11 + 3) % PEOPLE.length], mitra: m.id, travel: m.travel, city: CITIES[(i + k * 2) % CITIES.length][0], phone: '+62 81' + ((i + k) % 9 + 1) + ' ' + (4100 + i * 37 + k * 11) + ' ' + (2200 + k * 97), jamaah30: (i * 3 + k * 5) % 12, status: m.status === 'inactive' ? 'inactive' : 'active', joined: T0 - (i * 20 + k * 7 + 10) * D }); });
const uid = p => p + '-' + Date.now().toString(36).toUpperCase().slice(-6) + Math.random().toString(36).slice(2, 4).toUpperCase();

/* ---------- Packages / Marketplace ---------- */
const PKG_TPL = [['Umrah Reguler 9 Hari','Umrah',28.9e6,36.5e6],['Umrah Plus Thaif 12 Hari','Umrah',34e6,42e6],['Umrah Ramadhan 15 Hari','Umrah',41e6,58e6],['Umrah VIP Pusat Kota 9 Hari','Umrah',45e6,62e6],['Haji Khusus 1448 H','Haji',185e6,245e6],['Halal Tour Turki 10 Hari','Halal Tour',24e6,33e6],['Halal Tour Jepang 8 Hari','Halal Tour',27e6,36e6],['Tour Uzbekistan 9 Hari','Tour',22e6,29e6],['Umrah Plus Dubai 12 Hari','Umrah',37e6,46e6],['Halal Tour Korea 7 Hari','Halal Tour',19e6,26e6]];
const PACKAGES = [];
TRAVELS.slice(0, 26).forEach((tr, ti) => { const n = ri(1, 3); for (let k = 0; k < n; k++) { const tp = PKG_TPL[(ti + k * 3) % PKG_TPL.length]; if (tp[1] === 'Haji' && !tr.services.includes('Haji')) continue; const st = tr.op !== 'active' ? wpick(['draft','unpublished','archived'], [4, 4, 2]) : wpick(['published','review','draft','unpublished','archived'], [64, 12, 10, 8, 6]); PACKAGES.push({ id: 'PKG-' + String(88000 + PACKAGES.length * 7), name: tp[0], cat: tp[1], travel: tr.id, price: Math.round(ri(tp[2] / 1e5, tp[3] / 1e5)) * 1e5, dep: T0 + ri(12, 220) * D, seats: ri(30, 45), sold: 0, state: st, views30: ri(300, 9000), segadeal: rnd() < .18 && false }); } });

/* ---------- Travelers ---------- */
const TRAVELER_NAMES = ['Aminah Zahra','Budi Santoso','Chairul Anwar','Dian Pertiwi','Eko Prasetyo','Farida Hanum','Gilang Ramadhan','Hanifah Yusuf','Irfan Hakim','Juwita Sari','Khairul Umam','Lestari Wulandari','Mustofa Kamal','Nurul Huda','Oki Setiawan','Pratiwi Anggraini','Qori Amalia','Rahmat Hidayat','Sri Mulyani K.','Teguh Wibowo','Umi Kalsum','Vina Melati','Wahyu Aji','Yuliana Dewi','Zulkifli Hasan R.','Anisa Rahmah','Bayu Firmansyah','Citra Lestari','Dodi Irawan','Endang Susilowati'];
const TRAVELERS = TRAVELER_NAMES.map((n, i) => ({ id: 'TRL-' + (300120 + i * 31), name: n, phone: '+62 81' + ri(1, 9) + ' ' + ri(1000, 9999) + ' ' + ri(100, 9999), email: n.toLowerCase().replace(/[^a-z]+/g, '.') + '@mail.example', city: pick(CITIES)[0], passport: rnd() < .8 ? 'verified' : 'pending', trips: ri(0, 4), since: T0 - ri(10, 1500) * D }));

/* ---------- Bookings ---------- */
const BK_FLOW = ['created','awaiting_payment','partially_paid','confirmed','processing','ready','departed','completed'];
const BK_EXC = ['cancelled','refund_requested','refunded','failed'];
const BOOKINGS = Array.from({ length: 64 }, (_, i) => { const pk = PACKAGES[(i * 5) % PACKAGES.length]; const tr = travelById(pk.travel); const pax = wpick([1, 2, 3, 4, 5], [30, 36, 14, 14, 6]); const total = pk.price * pax; const st = i < 3 ? ['awaiting_payment','partially_paid','confirmed'][i] : wpick([...BK_FLOW, ...BK_EXC], [4, 10, 12, 20, 12, 8, 6, 10, 4, 3, 2, 2]); const paidRatio = { created: 0, awaiting_payment: 0, partially_paid: .3, confirmed: 1, processing: 1, ready: 1, departed: 1, completed: 1, cancelled: 0, refund_requested: 1, refunded: 1, failed: 0 }[st]; pk.sold += pax; return { id: 'BK-26' + String(41200 + i * 17), traveler: TRAVELERS[i % TRAVELERS.length].id, pkg: pk.id, travel: tr.id, pax, total, paid: Math.round(total * paidRatio), state: st, created: T0 - ri(0, 60) * D - ri(0, 23) * H, dep: pk.dep, payMode: tr.payMode, source: wpick(['Marketplace','Website Travel','Affiliate','Campaign','Mitra Travel'], [40, 24, 12, 16, 8]) }; });
BOOKINGS.sort((a, b) => b.created - a.created);
const bookingById = id => BOOKINGS.find(b => b.id === id);

/* ---------- Payments (gateway events) ---------- */
const PROVIDERS = [{ id: 'midtrans', name: 'Midtrans', status: 'healthy', success: 98.6, latency: 420, share: 46 }, { id: 'xendit', name: 'Xendit', status: 'healthy', success: 97.9, latency: 510, share: 38 }, { id: 'doku', name: 'DOKU', status: 'degraded', success: 91.2, latency: 1840, share: 16 }];
const CHANNELS_PAY = ['VA BCA','VA Mandiri','VA BSI','QRIS','Kartu Kredit','VA BRI'];
const PAYMENTS = [];
BOOKINGS.forEach((b, i) => { if (b.state === 'created') return; const parts = b.state === 'partially_paid' ? 1 : (b.paid > 0 ? wpick([1, 2], [60, 40]) : 1); for (let p = 0; p < parts; p++) { const amt = b.paid > 0 ? Math.round((b.paid / parts) / 1000) * 1000 : Math.round(b.total * .3 / 1000) * 1000; const status = b.paid > 0 ? (b.state === 'refunded' ? 'refunded' : 'paid') : (b.state === 'failed' ? 'failed' : wpick(['pending','expired'], [80, 20])); const prov = wpick(PROVIDERS, [46, 38, 16]); const ts = b.created + ri(1, 40) * H; PAYMENTS.push({ id: 'PAY-' + String(7700120 + PAYMENTS.length * 13), booking: b.id, travel: b.travel, payer: b.traveler, amount: amt, provider: prov.name, channel: pick(CHANNELS_PAY), ref: prov.id.slice(0, 3).toUpperCase() + '-' + Math.floor(rnd() * 1e10).toString(36).toUpperCase(), status, ts, recon: status === 'paid' ? wpick(['reconciled','unmatched','mismatch','pending'], [82, 8, 3, 7]) : 'pending', flow: b.payMode, fee: Math.round(amt * .007) }); } });
PAYMENTS.sort((a, b) => b.ts - a.ts);

const SETTLEMENTS = TRAVELS.filter(t => t.payMode === 'VIA_SEGALOKA').slice(0, 14).map((tr, i) => ({ id: 'STL-2609-' + String(i + 1).padStart(3, '0'), travel: tr.id, gross: ri(300, 6400) * 1e6, fee: 0, reserve: 0, net: 0, state: i === 2 ? 'hold' : i === 5 ? 'failed' : wpick(['scheduled','processing','settled'], [30, 20, 50]), sched: T0 + ri(-3, 3) * D, cycle: 'T+3' }));
SETTLEMENTS.forEach(s => { s.fee = Math.round(s.gross * .025); s.reserve = Math.round(s.gross * .05); s.net = s.gross - s.fee - s.reserve; });
const WITHDRAWALS = [
  ...VENDORS.slice(0, 7).map((v, i) => ({ id: 'WD-' + (55120 + i * 7), party: v.name, partyType: 'Vendor', ref: v.id, amount: ri(20, 480) * 1e6, state: i < 3 ? 'pending' : wpick(['approved','disbursed','hold','rejected'], [20, 60, 12, 8]), basis: 'Order ' + ri(2, 18) + ' transaksi', ts: T0 - ri(1, 200) * H })),
  ...TRAVELS.filter(t => t.payMode === 'VIA_SEGALOKA').slice(0, 5).map((tr, i) => ({ id: 'WD-' + (56220 + i * 11), party: tr.name, partyType: 'Travel', ref: tr.id, amount: ri(100, 1600) * 1e6, state: i === 0 ? 'pending' : wpick(['approved','disbursed','hold'], [30, 60, 10]), basis: 'Saldo settlement', ts: T0 - ri(1, 200) * H })),
  ...AFFILIATES.slice(0, 3).map((a, i) => ({ id: 'WD-' + (57310 + i * 5), party: a.name, partyType: 'Affiliate', ref: a.id, amount: ri(2, 18) * 1e6, state: i === 0 ? 'pending' : 'disbursed', basis: 'Komisi tervalidasi', ts: T0 - ri(1, 200) * H }))
];
const REFUNDS = BOOKINGS.filter(b => ['refund_requested','refunded','cancelled'].includes(b.state)).map((b, i) => ({ id: 'RF-' + (9120 + i * 3), booking: b.id, travel: b.travel, amount: b.paid || Math.round(b.total * .3), reason: pick(['Pembatalan jamaah — sakit','Visa ditolak','Perubahan jadwal oleh Travel','Double payment']), state: b.state === 'refunded' ? 'refunded' : b.state === 'refund_requested' ? 'pending' : 'rejected', ts: b.created + ri(2, 20) * D }));

/* ---------- Campaigns ---------- */
const OBJECTIVES = { leads: ['Leads','Leads','عملاء محتملون'], booking: ['Booking / Sales','Booking / Sales','الحجوزات / المبيعات'], traffic: ['Traffic','Traffic','الزيارات'], awareness: ['Awareness','Awareness','الوعي'] };
/* Iklan hanya tayang di inventori milik Segaloka: Website Segaloka + Aplikasi Segaloka. Tidak ada platform iklan eksternal. */
const AD_CHANNELS = ['Web · Banner Beranda','Web · Sponsored Pencarian','Web · Halaman Kategori','Web · Rekomendasi Detail Paket','App · Banner Beranda','App · Sponsored Pencarian','App · Rekomendasi Paket','App · Notifikasi In-App'];
const AD_SURF = ch => String(ch).startsWith('App') ? 'Aplikasi Segaloka' : 'Website Segaloka';
const AD_LEGACY = { 'Meta Ads': 'Web · Banner Beranda', 'Google Ads': 'Web · Sponsored Pencarian', 'TikTok Ads': 'App · Banner Beranda', 'Marketplace Placement': 'Web · Halaman Kategori', 'WhatsApp Click-to-Chat': 'App · Rekomendasi Paket', 'Email': 'App · Notifikasi In-App' };
const AD_LANDINGS = { pkg: ['Halaman paket di Segaloka', 'Package page on Segaloka', 'صفحة الباقة في Segaloka'], travel: ['Profil Travel di Segaloka', 'Travel profile on Segaloka', 'ملف الشركة في Segaloka'], chat: ['Chat in-app dengan Travel', 'In-app chat with the Travel', 'محادثة داخل التطبيق'], segadeals: ['Form SegaDeals (ajukan permintaan)', 'SegaDeals form (submit a request)', 'نموذج SegaDeals'] };
const CAMP_NAMES = ['Umrah Akhir Tahun 1448','Early Bird Ramadhan 2027','Halal Tour Jepang Musim Semi','SegaDeals — Ajukan Permintaan Umrah','Retargeting Umrah Reguler','Haji Khusus Waiting List','Umrah Keluarga Libur Sekolah','Awareness Segaloka Marketplace','Promo Umrah Plus Thaif','Lead Gen Komunitas Kajian','Halal Tour Turki Q4','Reaktivasi Traveler 2025'];
const CAMP_STATES = ['active','active','scheduled','active','paused','review','active','completed','draft','active','completed','archived'];
const CAMPAIGNS = CAMP_NAMES.map((name, i) => { const st = CAMP_STATES[i]; const owner = i === 3 || i === 7 ? null : TRAVELS[(i * 3) % 14].id; const pk = owner ? (PACKAGES.find(p => p.travel === owner && p.state === 'published') || PACKAGES[i]) : null; const budget = ri(25, 480) * 1e6; const progress = { active: ri(25, 80) / 100, paused: ri(30, 60) / 100, completed: 1, archived: 1, scheduled: 0, review: 0, draft: 0 }[st]; const spent = Math.round(budget * progress); const impr = Math.round(spent / ri(18, 42)); const reach = Math.round(impr * ri(45, 72) / 100); const clicks = Math.round(impr * ri(8, 26) / 1000); const leads = Math.round(clicks * ri(4, 9) / 100); const bookings = Math.round(leads * ri(8, 20) / 1000); const revenue = bookings * (pk ? pk.price : 32e6) * ri(10, 15) / 10; const chans = [...new Set([AD_CHANNELS[i % 4], AD_CHANNELS[4 + (i + 1) % 4], i % 2 ? 'App · Sponsored Pencarian' : 'Web · Sponsored Pencarian'])]; return { id: 'CMP-' + String(26401 + i * 23), name, objective: ['leads','booking','traffic','awareness','booking','leads'][i % 6], owner, pkg: pk ? pk.id : null, channels: chans, budget, daily: Math.round(budget / 30), spent, impr, reach, clicks, leads, bookings, revenue: Math.round(revenue), state: st, start: T0 + ({ scheduled: 6, draft: 14, review: 9 }[st] || -ri(8, 70)) * D, end: T0 + ri(-5, 60) * D, attribution: 'Last non-direct click · 7d click / 1d view', audience: pick(['Jamaah 30–55 th · Jabodetabek','Komunitas kajian · Sumatera','Retargeting pengunjung paket 30 hari','Keluarga muda · Jawa Timur','Lookalike booking 2025 (1%)']), creatives: ri(2, 6), voucher: i % 3 === 0 ? 'UMRAH1448' : null }; });
const campById = id => CAMPAIGNS.find(c => c.id === id);
BOOKINGS.forEach((b, i) => { if (b.source === 'Campaign') b.campaign = CAMPAIGNS[i % 7].id; });

/* ---------- Conversations (Omnichannel) ---------- */
const AGENTS = [{ id: 'ag1', name: 'Rahma (CS)', online: true, load: 6 }, { id: 'ag2', name: 'Fikri (CS)', online: true, load: 4 }, { id: 'ag3', name: 'Salma (Sales)', online: false, load: 2 }, { id: 'ag4', name: 'Dimas (Finance CS)', online: true, load: 3 }];
const CONV_SEED = [
 ['wa','Aminah Zahra','Assalamualaikum, untuk Umrah Akhir Tahun apakah masih ada seat untuk 4 orang? Kami dari Makassar.','open',null,'lead','CMP'],
 ['wa','Budi Santoso','Saya sudah transfer DP lewat VA tapi status di aplikasi masih menunggu pembayaran.','open','ag4','booking','PAY'],
 ['ig','nadia.halaltrip','Halo kak, paket Halal Tour Jepang bulan April itu sudah termasuk visa?','pending','ag3','lead','CMP'],
 ['web','Pengunjung #88213','Bagaimana cara jadi mitra travel di wilayah Balikpapan?','open',null,'lead',null],
 ['email','Farida Hanum','Mohon dikirimkan invoice resmi untuk keperluan kantor (reimbursement).','open','ag1','booking',null],
 ['fb','Gilang Ramadhan','Jadwal manasik untuk keberangkatan November kapan ya?','resolved','ag2','booking',null],
 ['wa','Hanifah Yusuf','Paspor saya baru selesai, fotonya dikirim ke mana?','open','ag1','booking',null],
 ['wa','Irfan Hakim','Refund saya sudah 10 hari belum masuk, tolong dicek.','open','ag4','refund',null],
 ['ig','umi.kalsum.official','Masya Allah, bisa minta pricelist Umrah Ramadhan?','pending',null,'lead','CMP'],
 ['web','Juwita Sari','Apakah bisa cicilan untuk Haji Khusus?','open','ag3','lead',null],
 ['email','Hijaz Visa Services','Konfirmasi batch visa 24 jamaah (BK-2641234) sudah terbit.','closed','ag2','vendor',null],
 ['wa','Khairul Umam','Kamar bisa quad sekeluarga? Anak saya 2.','resolved','ag1','booking',null],
 ['fb','Lestari Wulandari','Promo voucher UMRAH1448 tidak bisa dipakai di checkout.','open',null,'lead','CMP'],
 ['wa','Mustofa Kamal','Ingin reschedule keberangkatan ke Januari.','pending','ag2','booking',null]
];
const CONVERSATIONS = CONV_SEED.map(([ch, who, first, st, ag, kind, link], i) => { const trv = TRAVELERS.find(x => x.name === who); const bk = trv ? BOOKINGS.find(b => b.traveler === trv.id) : null; const camp = link === 'CMP' ? CAMPAIGNS[i % 5 === 0 ? 0 : (i % 7)] : null; const ts = T0 - (i * 23 + ri(2, 20)) * 60e3 - (i > 8 ? ri(2, 30) * H : 0); const msgs = [{ dir: 'in', text: first, ts }]; if (ag && st !== 'open') msgs.push({ dir: 'out', text: 'Waalaikumsalam, terima kasih sudah menghubungi kami. Kami bantu cek ya.', ts: ts + 4 * 60e3, by: AGENTS.find(a => a.id === ag).name }); if (st === 'resolved' || st === 'closed') msgs.push({ dir: 'in', text: 'Baik, terima kasih banyak 🙏', ts: ts + 30 * 60e3 }); return { id: 'CNV-' + (40120 + i * 7), channel: ch, contact: who, traveler: trv ? trv.id : null, booking: bk ? bk.id : null, travel: bk ? bk.travel : TRAVELS[i % 10].id, campaign: camp ? camp.id : null, kind, status: st, assignee: ag, unread: st === 'open' ? ri(1, 3) : 0, tags: [kind === 'lead' ? 'Lead' : kind === 'refund' ? 'Refund' : kind === 'vendor' ? 'Vendor' : 'Booking', i % 4 === 0 ? 'Prioritas' : null].filter(Boolean), sla: st === 'open' ? ri(-6, 25) : null, messages: msgs, ts: msgs[msgs.length - 1].ts }; });
CONVERSATIONS[1].messages.push({ dir: 'sys', text: 'Webhook payment.pending diterima dari Xendit · PAY menunggu konfirmasi bank', ts: CONVERSATIONS[1].ts + 60e3 });

/* ---------- Approvals ---------- */
const AP_TYPES = { travel_verif: ['Travel','Verifikasi Travel','Travel verification'], vendor_verif: ['Vendor','Verifikasi Vendor','Vendor verification'], legal_doc: ['Legalitas','Dokumen legal','Legal document'], withdrawal: ['Keuangan','Withdrawal','Withdrawal'], refund: ['Keuangan','Refund','Refund'], sensitive: ['Keamanan','Perubahan data sensitif','Sensitive change'], campaign: ['Ads','Review campaign','Campaign review'], package: ['Marketplace','Publikasi paket','Package publication'], branch: ['Travel','Cabang tambahan','Additional branch'], trial: ['SaaS','Request trial','Trial request'] };
const ADMINS = [];
const APPROVALS = [];
const AUDIT = [];
const NOTIFS = [];
let AUDIT_SOURCE = 'Web · Application';
const audit = (actor, action, resource, result, extra) => { AUDIT.unshift(Object.assign({ id: 'AUD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(), ts: nowTs(), actor, action, resource, result, source: AUDIT_SOURCE, before: null, after: null, reason: null }, extra || {})); };

/* ---------- Time series (30 hari) ---------- */
const SERIES = (() => { const days = []; for (let d = 89; d >= 0; d--) { const base = 1 + Math.sin((90 - d) / 4.2) * .18 + (90 - d) / 330; days.push({ ts: T0 - d * D, gmv: Math.round((1.9 + rnd() * .7) * base * 1e9), book: Math.round((38 + rnd() * 16) * base), spend: Math.round((9 + rnd() * 5) * base * 1e6), leads: Math.round((120 + rnd() * 60) * base), conv: Math.round((140 + rnd() * 70) * base) }); } return days; })();
