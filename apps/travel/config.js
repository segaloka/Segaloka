APP.renderShell = () => renderShell();
APP.home = '/p/travel';
APP.actor = 'Travel';
APP.renderSide = () => renderPortalSide('travel');
APP.renderTop = () => renderPortalTop();
APP.renderBanners = () => renderPortalBanners();
APP.accountMenu = () => portalAcctHTML();
APP.notificationRoute = (kind, d) => ({ 'booking.new': '/p/travel/bookings/' + d.after.id, 'segadeals.request.new': '/p/travel/segadeals', 'segadeals.offer.accepted': '/p/travel/segadeals', 'package.state': '/p/travel/packages' }[kind] || null);

APP.documentTitle = () => BRAND.name + ' · Travel';

APP.routeScope = p => p.startsWith('/p/travel');

APP.actionScope = (name, scopes) => !scopes.length || scopes.includes('travel');
