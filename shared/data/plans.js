/* Shared subscription plan registry used by Control Center and role runtimes. */
const PLANS = [
  { id: 'PLAN-STARTER', name: 'Starter', price: 0, branches: 2, seats: 3, omni: 'Tidak', ent: 'Website + Marketplace', state: 'active' },
  { id: 'PLAN-GROWTH', name: 'Growth', price: 499000, branches: 2, seats: 10, omni: 'Pesan Aplikasi + WhatsApp', ent: 'Website + Marketplace + CRM', state: 'active' },
  { id: 'PLAN-SCALE', name: 'Scale', price: 1499000, branches: 2, seats: 50, omni: 'Semua channel', ent: 'Semua modul + SLA', state: 'active' }
].map(p => Object.assign(p, { tenants: TRAVELS.filter(x => x.sub.plan === p.name).length }));
