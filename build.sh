cd /home/claude/sg
cat shared/i18n/i18n.js shared/data/data.js shared/runtime/core.js apps/control-center/pages_a.js apps/control-center/pages_b.js apps/control-center/pages_c.js shared/runtime/main.js apps/control-center/pages_d.js apps/control-center/pages_e.js apps/control-center/pages_f.js apps/control-center/pages_g.js shared/portal-core.js apps/travel/portal.js apps/vendor/portal.js apps/affiliate/portal.js shared/partner-agent-portal.js apps/mitra/portal.js apps/agen/portal.js apps/traveler/portal.js apps/control-center/agen.js shared/portal-onboarding.js shared/services/segadeals.js shared/services/flows.js shared/services/reviews.js shared/services/sdterms.js shared/services/gateway.js apps/control-center/omni.js shared/runtime/datamode.js shared/services/notify.js shared/services/sync.js shared/runtime/boot.js > _all.js && node --check _all.js || exit 1
{ cat <<'H'
<meta charset="utf-8">
<title>SEGALOKA Control Center</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap">
<style>
H
cat styles.css; echo '</style>'; echo '<div id="root" style="height:100%"></div>'; echo '<script>'; cat _all.js; echo '</script>'; } > segaloka-control-center.html
wc -c segaloka-control-center.html
