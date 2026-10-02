APP.renderShell = () => renderShell();
APP.home = '/overview';
APP.actor = 'Admin Pusat';
APP.renderSide = () => renderSide();
APP.renderTop = () => renderTop();
APP.renderBanners = () => renderBanners();
APP.accountMenu = () => acctHTML();
APP.closeContext = () => { if (OMNI.showCtx && A['ctx-toggle']) A['ctx-toggle'](); };
APP.afterPoll = () => { const ol = document.getElementById('omni-live'); if (ol && typeof omniLoad === 'function') omniLoad(ol.dataset.ch).catch(() => {}); };
APP.conversationChanged = a => { if (OMNI.active !== a.id) return; const ch = document.getElementById('chat'); if (ch) setTimeout(() => { const x = document.getElementById('chat'); if (x) x.scrollTop = x.scrollHeight; }, 50); };
APP.realtimeTick = () => controlCenterRealtime();
APP.notificationRoute = (kind, d) => ({
  'booking.new': '/booking/' + d.after.id,
  'approval.new': '/approval/' + d.after.id,
  'approval.state': '/approval/' + d.after.id,
  'payment.paid': '/finance/payment/' + d.after.id,
  'conversation.message': '/omni/inbox/' + d.after.id,
  'segadeals.request.new': '/marketplace/segadeals',
  'segadeals.offer.new': '/marketplace/segadeals',
  'segadeals.offer.accepted': '/marketplace/segadeals',
  'withdrawal.new': '/finance/withdrawal',
  'withdrawal.admin': d.after ? '/finance/withdrawal/' + d.after.id : '/finance/withdrawal',
  'package.state': d.after.state === 'review' ? '/marketplace/moderation' : null
}[kind] || null);

APP.adminUI = (kind, d) => {
  if (kind === 'review.actions') { const r = d.review; return permBtn('marketplace.manage', r.state === 'hidden' ? L3(['Tampilkan lagi', 'Show again', 'إظهار']) : L3(['Sembunyikan', 'Hide', 'إخفاء']), 'data-act="rv-mod" data-id="' + r.id + '" data-mut', 'sm ' + (r.state === 'hidden' ? '' : 'badb')); }
  if (kind === 'segadeals.offer.actions') { const o = d.offer; return o.state === 'sent' ? permBtn('marketplace.manage', L3(['Tarik', 'Withdraw', 'سحب']), 'data-act="sd-adm-withdraw" data-id="' + o.id + '" data-mut', 'sm badb') : ''; }
  if (kind === 'segadeals.deposit.actions') { const e = d.entry; return permBtn('finance.withdrawal', L3(['Terima', 'Confirm', 'تأكيد']), 'data-act="sd-dep-ok" data-id="' + e.id + '" data-mut', 'sm primary') + permBtn('finance.withdrawal', t('reject'), 'data-act="sd-dep-no" data-id="' + e.id + '" data-mut', 'sm badb'); }
  if (kind === 'segadeals.settings.action') return permBtn('marketplace.manage', ic('sliders', 'sm') + L3(['Pengaturan', 'Settings', 'الإعدادات']), 'data-act="sd-cfg" data-mut', 'sm');
  if (kind === 'segadeals.travel.actions') { const tr = d.travel; return permBtn('marketplace.manage', L3(['Biaya', 'Fee', 'الرسوم']), 'data-act="sd-trfee" data-id="' + tr.id + '" data-mut', 'sm') + permBtn('marketplace.manage', tr.sdTerms.revoked ? L3(['Pulihkan', 'Restore', 'استعادة']) : L3(['Cabut', 'Revoke', 'إلغاء']), 'data-act="sd-revoke" data-id="' + tr.id + '" data-mut', 'sm ' + (tr.sdTerms.revoked ? '' : 'badb')); }
  return '';
};
