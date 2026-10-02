/* =====================================================================
   CANONICAL DATA ADAPTER — relational public.* -> existing dashboard UI.
   Stage 1 is intentionally read-only. It never writes control_center.*.
   ===================================================================== */
function canonicalMs(v) { const n = v ? Date.parse(v) : NaN; return Number.isFinite(n) ? n : null; }
function canonicalTravelStatus(v) { return v === 'active' ? 'active' : (v === 'pending_verification' ? 'review' : 'inactive'); }
function canonicalSettlementMode(v) { return v === 'via_segaloka' ? 'VIA_SEGALOKA' : 'DIRECT_TO_TRAVEL'; }
function canonicalPackageState(v) { return ({ published:'published', archived:'archived', draft:'draft' })[v] || v || 'draft'; }
function canonicalBookingState(v) {
  return ({ pending:'created', awaiting_payment:'awaiting_payment', partially_paid:'partially_paid', confirmed:'confirmed', processing:'processing', ready:'ready', departed:'departed', completed:'completed', cancelled:'cancelled', refund_requested:'refund_requested', refunded:'refunded', failed:'failed' })[v] || v || 'created';
}
function canonicalPaymentStatus(v) { return v || 'pending'; }

function replaceCanonical(target, rows) {
  target.length = 0;
  target.push(...rows);
}

async function loadCanonicalStage1(ctx) {
  const { sql, SB } = ctx;
  const [orgs, branches, packages, deps, bookings, payments] = await Promise.all([
    sql(`select o.id, o.name, o.legal_name, o.license_type, o.license_number, o.license_expiry, o.settlement_model, o.status, o.support_email, o.support_phone, o.address, o.primary_color, o.created_at, o.updated_at,
      s.status as subscription_status, sp.name as plan_name, s.current_period_end
      from public.organizations o
      left join lateral (select s.* from public.subscriptions s where s.org_id=o.id order by s.created_at desc limit 1) s on true
      left join public.subscription_plans sp on sp.id=s.plan_id
      order by o.created_at desc`),
    sql(`select id, org_id, name, is_hq, address, city, phone, pic_name, status, created_at from public.branches order by created_at`),
    sql(`select id, org_id, name, slug, type, description, duration_days, base_price, inclusions, exclusions, status, created_at, updated_at from public.packages order by created_at desc`),
    sql(`select d.id, d.package_id, p.org_id, d.departure_date, d.return_date, d.quota, d.filled, d.flight_info, d.hotel_info, d.status, d.created_at from public.departures d join public.packages p on p.id=d.package_id order by d.departure_date`),
    sql(`select b.id, b.org_id, b.departure_id, b.code, b.traveler_user_id, b.created_by, b.pax_count, b.total_amount, b.status, b.notes, b.created_at, b.updated_at, d.package_id
      from public.bookings b join public.departures d on d.id=b.departure_id order by b.created_at desc`),
    sql(`select p.id, p.booking_id, b.org_id, p.provider, p.method, p.gross_amount, p.fee_amount, p.net_amount, p.external_ref, p.status, p.paid_at, p.created_at
      from public.payments p join public.bookings b on b.id=p.booking_id order by p.created_at desc`)
  ]);

  const branchCount = {};
  branches.forEach(b => branchCount[b.org_id] = (branchCount[b.org_id] || 0) + 1);
  const bookingByOrg = {};
  bookings.forEach(b => bookingByOrg[b.org_id] = (bookingByOrg[b.org_id] || 0) + 1);
  const paidByBooking = {};
  payments.forEach(p => { if (p.status === 'paid') paidByBooking[p.booking_id] = (paidByBooking[p.booking_id] || 0) + Number(p.gross_amount || 0); });

  replaceCanonical(TRAVELS, orgs.map(o => ({
    id:o.id, name:o.name, legalName:o.legal_name || o.name, city:o.address || '', prov:'',
    lic:o.license_type ? [{ type:o.license_type, no:o.license_number || '', status:o.status === 'active' ? 'verified' : 'under_review', exp:canonicalMs(o.license_expiry) }] : [],
    legal:o.status === 'active' ? 'verified' : 'under_review',
    op:canonicalTravelStatus(o.status),
    payMode:canonicalSettlementMode(o.settlement_model),
    sub:{ plan:o.plan_name || '—', state:o.subscription_status || 'pending', renew:canonicalMs(o.current_period_end), addonBranch:Math.max((branchCount[o.id] || 0)-2,0), price:0 },
    branch:{ used:branchCount[o.id] || 0, quota:Math.max(branchCount[o.id] || 0,2) },
    services:[], contact:{ name:'', role:'', phone:o.support_phone || '', email:o.support_email || '' },
    joined:canonicalMs(o.created_at), gmv30:0, book30:bookingByOrg[o.id] || 0, rating:null,
    color:o.primary_color || '#2447C4'
  })));

  replaceCanonical(BRANCHES, branches.map(b => ({
    id:b.id, travel:b.org_id, name:b.name, hq:!!b.is_hq, address:b.address || '', city:b.city || '',
    phone:b.phone || '', pic:b.pic_name || '', state:b.status || 'active', created:canonicalMs(b.created_at)
  })));

  replaceCanonical(PACKAGES, packages.map(p => ({
    id:p.id, travel:p.org_id, name:p.name, slug:p.slug, cat:p.type, desc:p.description || '',
    days:Number(p.duration_days || 0), price:Number(p.base_price || 0), includes:p.inclusions || [],
    excludes:p.exclusions || [], state:canonicalPackageState(p.status), created:canonicalMs(p.created_at)
  })));

  replaceCanonical(DEPS, deps.map(d => ({
    id:d.id, pkg:d.package_id, travel:d.org_id, date:canonicalMs(d.departure_date), returnDate:canonicalMs(d.return_date),
    quota:Number(d.quota || 0), filled:Number(d.filled || 0), flight:d.flight_info || {}, hotel:d.hotel_info || {},
    state:d.status || 'open', created:canonicalMs(d.created_at)
  })));

  replaceCanonical(BOOKINGS, bookings.map(b => ({
    id:b.id, code:b.code, travel:b.org_id, traveler:b.traveler_user_id, pkg:b.package_id, departure:b.departure_id,
    pax:Number(b.pax_count || 0), total:Number(b.total_amount || 0), paid:paidByBooking[b.id] || 0,
    state:canonicalBookingState(b.status), notes:b.notes || '', ts:canonicalMs(b.created_at)
  })));

  replaceCanonical(PAYMENTS, payments.map(p => ({
    id:p.id, booking:p.booking_id, travel:p.org_id, amount:Number(p.gross_amount || 0),
    fee:Number(p.fee_amount || 0), net:Number(p.net_amount || 0), provider:p.provider || 'manual',
    method:p.method || '', gatewayRef:p.external_ref || '', status:canonicalPaymentStatus(p.status),
    ts:canonicalMs(p.paid_at || p.created_at), flow:''
  })));

  await loadCanonicalPartners(ctx);
  SB.lastPoll = Date.now();
}

async function loadCanonicalPartners(ctx) {
  const { sql } = ctx;
  const [mitraRows, agenRows, affiliateRows, affiliateLinks, earningRows, withdrawalRows] = await Promise.all([
    sql(`select m.id, m.user_id, m.org_id, m.commission_type, m.commission_value, m.status, m.created_at,
      coalesce(u.raw_user_meta_data->>'name', u.email, m.id::text) as name
      from public.mitra m left join auth.users u on u.id=m.user_id order by m.created_at desc`),
    sql(`select a.id, a.user_id, a.mitra_id, a.org_id, a.commission_type, a.commission_value, a.status, a.created_at,
      coalesce(u.raw_user_meta_data->>'name', u.email, a.id::text) as name,
      coalesce(u.raw_user_meta_data->>'phone','') as phone,
      coalesce(u.raw_user_meta_data->>'city','') as city
      from public.agen a left join auth.users u on u.id=a.user_id order by a.created_at desc`),
    sql(`select a.id, a.user_id, a.code, a.status, a.created_at,
      coalesce(u.raw_user_meta_data->>'name', u.email, a.id::text) as name
      from public.affiliates a left join auth.users u on u.id=a.user_id order by a.created_at desc`),
    sql(`select affiliate_id, org_id, commission_type, commission_value, status from public.affiliate_org_links`),
    sql(`select id, org_id, partner_type, partner_id, booking_id, amount, status, release_trigger, release_at, available_at, paid_at, created_at
      from public.partner_earnings order by created_at desc`),
    sql(`select id, org_id, partner_type, partner_id, amount, status, bank_snapshot, requested_at, approved_at, paid_at, rejected_at, provider_ref, note, created_at
      from public.partner_withdrawals order by created_at desc`)
  ]);

  if (typeof MITRA !== 'undefined') replaceCanonical(MITRA, mitraRows.map(m => ({
    id:m.id, user:m.user_id, name:m.name, travel:m.org_id,
    rate:Number(m.commission_value || 0), commissionType:m.commission_type,
    city:'', jamaah30:0, status:m.status || 'active', joined:canonicalMs(m.created_at)
  })));

  if (typeof AGEN !== 'undefined') replaceCanonical(AGEN, agenRows.map(a => ({
    id:a.id, user:a.user_id, name:a.name, mitra:a.mitra_id, travel:a.org_id,
    rate:Number(a.commission_value || 0), commissionType:a.commission_type,
    city:a.city || '', phone:a.phone || '', jamaah30:0,
    status:a.status || 'active', joined:canonicalMs(a.created_at)
  })));

  const linksByAffiliate = {};
  affiliateLinks.forEach(l => {
    if (l.status !== 'active') return;
    (linksByAffiliate[l.affiliate_id] ||= []).push(l.org_id);
  });
  if (typeof AFFILIATES !== 'undefined') replaceCanonical(AFFILIATES, affiliateRows.map(a => ({
    id:a.id, user:a.user_id, name:a.name, type:'Individu', travels:linksByAffiliate[a.id] || [],
    code:a.code, clicks:0, conv:0, gmv:0,
    commission:earningRows.filter(e => e.partner_type === 'affiliate' && e.partner_id === a.id).reduce((s,e)=>s+Number(e.amount||0),0),
    payable:earningRows.filter(e => e.partner_type === 'affiliate' && e.partner_id === a.id && e.status === 'AVAILABLE').reduce((s,e)=>s+Number(e.amount||0),0),
    status:a.status === 'active' ? 'active' : a.status, color:colorFor(a.name)
  })));

  if (typeof COMMISSIONS !== 'undefined') replaceCanonical(COMMISSIONS, earningRows.map(e => ({
    id:e.id, aff:e.partner_type === 'affiliate' ? e.partner_id : null,
    mitra:e.partner_type === 'mitra' ? e.partner_id : null,
    agen:e.partner_type === 'agen' ? e.partner_id : null,
    partnerType:e.partner_type, partner:e.partner_id, travel:e.org_id, booking:e.booking_id,
    amount:Number(e.amount || 0),
    state:({ PENDING:'pending', HELD:'pending', AVAILABLE:'approved', WITHDRAWAL_PENDING:'paid', PAID:'paid', REVERSED:'rejected' })[e.status] || String(e.status || '').toLowerCase(),
    releaseTrigger:e.release_trigger, releaseAt:canonicalMs(e.release_at),
    ts:canonicalMs(e.created_at)
  })));

  if (typeof WITHDRAWALS !== 'undefined') {
    const partyNames = {};
    mitraRows.forEach(x => partyNames['mitra:'+x.id]=x.name);
    agenRows.forEach(x => partyNames['agen:'+x.id]=x.name);
    affiliateRows.forEach(x => partyNames['affiliate:'+x.id]=x.name);
    replaceCanonical(WITHDRAWALS, withdrawalRows.map(w => ({
      id:w.id, party:partyNames[w.partner_type+':'+w.partner_id] || w.partner_id,
      partyType:({ affiliate:'Affiliate', mitra:'Mitra', agen:'Agen' })[w.partner_type] || w.partner_type,
      ref:w.partner_id, travel:w.org_id, amount:Number(w.amount || 0),
      state:({ PENDING:'pending', APPROVED:'approved', PROCESSING:'processing', PAID:'disbursed', REJECTED:'rejected', CANCELLED:'cancelled' })[w.status] || String(w.status || '').toLowerCase(),
      bank:w.bank_snapshot || null, note:w.note || '', transferRef:w.provider_ref || '',
      basis:'Partner earning', ts:canonicalMs(w.requested_at || w.created_at)
    })));
  }
}


function installCanonicalStage1() {
  APP.dataBackend = 'canonical';
  APP.canonicalLoad = loadCanonicalStage1;
  APP.canonicalPoll = loadCanonicalStage1;
  APP.canonicalFlush = null;
}
