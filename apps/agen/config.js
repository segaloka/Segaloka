APP.renderShell = () => renderShell();
APP.home = '/p/agen';
APP.actor = 'Agen';
APP.renderSide = () => renderPortalSide('agen');
APP.renderTop = () => renderPortalTop();
APP.renderBanners = () => renderPortalBanners();
APP.accountMenu = () => portalAcctHTML();
APP.notificationRoute = () => null;

APP.documentTitle = () => BRAND.name + ' · Agen';

APP.routeScope = p => p.startsWith('/p/agen');
