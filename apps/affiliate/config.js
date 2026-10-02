APP.renderShell = () => renderShell();
APP.home = '/p/affiliate';
APP.actor = 'Affiliate';
APP.renderSide = () => renderPortalSide('affiliate');
APP.renderTop = () => renderPortalTop();
APP.renderBanners = () => renderPortalBanners();
APP.accountMenu = () => portalAcctHTML();
APP.notificationRoute = () => null;

APP.documentTitle = () => BRAND.name + ' · Affiliate';

APP.routeScope = p => p.startsWith('/p/affiliate');

APP.actionScope = (name, scopes) => !scopes.length || scopes.includes('affiliate');
