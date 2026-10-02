#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

COMMON_HEAD=( shared/i18n/i18n.js shared/data/data.js shared/runtime/core.js )
COMMON_PORTAL=( shared/portal-core.js shared/portal-shell.js shared/portal-topbar.js shared/portal-onboarding.js )
COMMON_SERVICES=( shared/services/segadeals.js shared/services/flows.js shared/services/reviews.js shared/services/sdterms.js shared/services/gateway.js shared/runtime/datamode.js shared/services/notify.js shared/services/canonical-adapter.js shared/services/sync.js shared/runtime/main.js shared/runtime/boot.js )

emit_html() {
  local title="$1" js="$2" out="$3"
  {
    echo '<meta charset="utf-8">'
    echo "<title>$title</title>"
    echo '<link rel="preconnect" href="https://fonts.googleapis.com">'
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
    echo '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap">'
    echo '<style>'
    cat shared/styles/styles.css
    echo '</style>'
    echo '<div id="root" style="height:100%"></div>'
    echo '<script>'
    cat "$js"
    echo '</script>'
  } > "$out"
  wc -c "$out"
}

build_bundle() {
  local name="$1" title="$2" config="$3" portal="$4" extra="${5:-}"
  local js="_${name}.js"
  local files=("${COMMON_HEAD[@]}" "$config" "${COMMON_PORTAL[@]}")
  if [[ -n "$extra" ]]; then files+=("$extra"); fi
  files+=("$portal" "${COMMON_SERVICES[@]}")
  cat "${files[@]}" > "$js"
  node --check "$js"
  emit_html "$title" "$js" "segaloka-${name}.html"
}

CONTROL_FILES=(
  "${COMMON_HEAD[@]}"
  apps/control-center/config.js
  apps/control-center/shell.js
  apps/control-center/topbar.js
  apps/control-center/account.js
  apps/control-center/pages_a.js
  apps/control-center/pages_b.js
  apps/control-center/pages_c.js
  apps/control-center/pages_d.js
  apps/control-center/pages_e.js
  apps/control-center/pages_f.js
  apps/control-center/pages_g.js
  apps/control-center/agen.js
  apps/control-center/omni.js
  shared/services/segadeals.js
  shared/services/flows.js
  shared/services/reviews.js
  shared/services/sdterms.js
  shared/services/gateway.js
  shared/runtime/datamode.js
  shared/services/notify.js
  shared/services/canonical-adapter.js
  shared/services/sync.js
  shared/runtime/main.js
  shared/runtime/boot.js
)
cat "${CONTROL_FILES[@]}" > _control-center.js
node --check _control-center.js
emit_html "SEGALOKA Control Center" _control-center.js segaloka-control-center.html

build_bundle travel "SEGALOKA Travel" apps/travel/config.js apps/travel/portal.js
build_bundle vendor "SEGALOKA Vendor" apps/vendor/config.js apps/vendor/portal.js
build_bundle traveler "SEGALOKA Traveler" apps/traveler/config.js apps/traveler/portal.js
build_bundle affiliate "SEGALOKA Affiliate" apps/affiliate/config.js apps/affiliate/portal.js
build_bundle mitra "SEGALOKA Mitra Travel" apps/mitra/config.js apps/mitra/portal.js shared/partner-agent-portal.js
build_bundle agen "SEGALOKA Agen" apps/agen/config.js apps/agen/portal.js shared/partner-agent-portal.js
