APP.renderShell = () => renderShell();
APP.home = '/p/vendor';
APP.actor = 'Vendor';
APP.renderSide = () => renderPortalSide('vendor');
APP.renderTop = () => renderPortalTop();
APP.renderBanners = () => renderPortalBanners();
APP.accountMenu = () => portalAcctHTML();
APP.notificationRoute = () => null;

APP.documentTitle = () => BRAND.name + ' · Vendor';
