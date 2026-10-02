APP.renderShell = () => renderShell();
APP.home = '/p/traveler';
APP.actor = 'Traveler';
APP.renderSide = () => renderPortalSide('traveler');
APP.renderTop = () => renderPortalTop();
APP.renderBanners = () => renderPortalBanners();
APP.accountMenu = () => portalAcctHTML();
APP.notificationRoute = (kind, d) => ({ 'conversation.message': '/p/traveler/chat', 'segadeals.offer.new': '/p/traveler/segadeals/' + d.after.request }[kind] || null);

APP.documentTitle = () => BRAND.name + ' · Traveler';

APP.routeScope = p => p.startsWith('/p/traveler');

APP.actionScope = (name, scopes) => !scopes.length || scopes.includes('traveler');
