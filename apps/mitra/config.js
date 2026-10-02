APP.renderShell = () => renderShell();
APP.home = '/p/mitra';
APP.actor = 'Mitra Travel';
APP.renderSide = () => renderPortalSide('mitra');
APP.renderTop = () => renderPortalTop();
APP.renderBanners = () => renderPortalBanners();
APP.accountMenu = () => portalAcctHTML();
APP.notificationRoute = () => null;

APP.documentTitle = () => BRAND.name + ' · Mitra Travel';

APP.routeScope = p => p.startsWith('/p/mitra');

APP.actionScope = (name, scopes) => !scopes.length || scopes.includes('mitra');
