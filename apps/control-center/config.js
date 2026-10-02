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
  'package.state': d.after.state === 'review' ? '/marketplace/moderation' : null
}[kind] || null);
