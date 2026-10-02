#!/bin/sh
set -e
cd /home/claude/sg

OUT_DIR=dist/affiliate
JS_OUT="$OUT_DIR/app.js"
HTML_OUT="$OUT_DIR/index.html"

mkdir -p "$OUT_DIR"

cat \
  shared/i18n/i18n.js \
  shared/data/data.js \
  shared/runtime/core.js \
  shared/portal-core.js \
  shared/portal-shell.js \
  shared/portal-topbar.js \
  apps/affiliate/portal.js \
  shared/portal-onboarding.js \
  shared/services/flows.js \
  shared/services/reviews.js \
  shared/services/sdterms.js \
  shared/services/gateway.js \
  shared/runtime/datamode.js \
  shared/services/notify.js \
  shared/services/sync.js \
  shared/runtime/main.js \
  apps/affiliate/config.js \
  shared/runtime/boot.js > "$JS_OUT"

node --check "$JS_OUT"

{
  cat <<'H'
<meta charset="utf-8">
<title>SEGALOKA Affiliate</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap">
<style>
H
  cat shared/styles/styles.css
  echo '</style>'
  echo '<div id="root" style="height:100%"></div>'
  echo '<script>'
  cat "$JS_OUT"
  echo '</script>'
} > "$HTML_OUT"

wc -c "$HTML_OUT"
