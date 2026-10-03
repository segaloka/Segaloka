/* Shared subscription plan registry used by Control Center and role runtimes. */
const PLANS = [
  { id: 'PLAN-STARTER', name: 'Starter', price: 0, branches: 2, seats: 3, omni: 'Tidak', ent: 'Website + Marketplace', state: 'active' },
  { id: 'PLAN-GROWTH', name: 'Growth', price: 499000, branches: 2, seats: 10, omni: 'Pesan Aplikasi + WhatsApp', ent: 'Website + Marketplace + CRM', state: 'active' },
  { id: 'PLAN-SCALE', name: 'Scale', price: 1499000, branches: 2, seats: 50, omni: 'Semua channel', ent: 'Semua modul + SLA', state: 'active' }
].map(p => Object.assign(p, { tenants: TRAVELS.filter(x => x.sub.plan === p.name).length }));

/* Shared paid add-on registry used by Control Center and role runtimes. */
const ADDONS = [
  ['Cabang tambahan', 450000, '/cabang/bln', TRAVELS.reduce((s, x) => s + x.sub.addonBranch, 0)],
  ['Seat CRM tambahan', 75000, '/seat/bln', 38],
  ['Nomor WhatsApp tambahan', 350000, '/nomor/bln', 9],
  ['Kredit push tambahan', 350000, '/10rb push', 0],
  ['Kredit broadcast 10.000', 900000, '/paket', 21]
].map((a, i) => ({ id: 'ADD-' + (1 + i), name: a[0], price: a[1], unit: a[2], active: a[3], state: 'active' }));
