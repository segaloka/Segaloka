/* =============================== BOOT =============================== */
S.route = location.hash.replace(/^#/, '') || APP.home;
applyTheme(); applyLang(); APP.renderShell(); render();
setInterval(realtime, 16000);
sbConnect();

