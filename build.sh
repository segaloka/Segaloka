#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

COMMON_HEAD=( shared/i18n/i18n.js shared/data/data.js shared/data/plans.js shared/runtime/core.js )
COMMON_PORTAL=( shared/portal-core.js shared/portal-shell.js shared/portal-topbar.js shared/portal-onboarding.js )
COMMON_SERVICES=( shared/services/segadeals.js shared/services/flows.js shared/services/reviews.js shared/services/sdterms.js shared/services/gateway.js shared/runtime/datamode.js shared/services/notify.js shared/services/canonical-adapter.js shared/services/sync.js shared/runtime/main.js shared/runtime/boot.js )

check_js_files() {
  local f
  for f in "$@"; do
    echo "syntax-check: $f"
    node --check "$f"
  done
}


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
  check_js_files "${files[@]}"
  cat "${files[@]}" > "$js"
  echo "syntax-check bundle: $js"
  node --check "$js"
  emit_html "$title" "$js" "segaloka-${name}.html"
}

CONTROL_FILES=(
  "${COMMON_HEAD[@]}"
  shared/portal-shell.js
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
# Hard boundary: Control Center must never embed role portal runtimes.
for forbidden in \
  apps/travel/portal.js \
  apps/vendor/portal.js \
  apps/traveler/portal.js \
  apps/affiliate/portal.js \
  apps/mitra/portal.js \
  apps/agen/portal.js \
  shared/partner-agent-portal.js; do
  for included in "${CONTROL_FILES[@]}"; do
    if [[ "$included" == "$forbidden" ]]; then
      echo "ERROR: Control Center bundle includes role portal runtime: $forbidden" >&2
      exit 1
    fi
  done
done

check_js_files "${CONTROL_FILES[@]}"
cat "${CONTROL_FILES[@]}" > _control-center.js
echo "syntax-check bundle: _control-center.js"
node --check _control-center.js

# Runtime dependency guard: Control Center boot calls APP.renderShell(), which requires renderShell().
if ! grep -Fq "function renderShell" _control-center.js; then
  echo "ERROR: Control Center bundle is missing renderShell runtime dependency" >&2
  exit 1
fi

# Hard UI boundary: Control Center is administration only, never a portal/workspace switcher.
# Role names may legitimately appear in admin data/audit copy, so guard structural switcher markers only.
CONTROL_FORBIDDEN_PATTERNS=(
  "PINDAH WORKSPACE"
  "Pindah Workspace"
)
for pattern in "${CONTROL_FORBIDDEN_PATTERNS[@]}"; do
  if grep -Fq "$pattern" _control-center.js; then
    echo "ERROR: Control Center contains forbidden workspace switcher marker: $pattern" >&2
    exit 1
  fi
done

# The Control Center topbar itself must not contain role-portal navigation/switch handlers.
for pattern in "data-act=\"workspace\"" "data-act=\"switch-workspace\"" "data-act=\"switch-portal\"" "workspace-menu" "workspaceMenu"; do
  if grep -Fq "$pattern" apps/control-center/topbar.js; then
    echo "ERROR: Control Center topbar contains workspace switcher structure: $pattern" >&2
    exit 1
  fi
done

emit_html "SEGALOKA Control Center" _control-center.js segaloka-control-center.html

build_bundle travel "SEGALOKA Travel" apps/travel/config.js apps/travel/portal.js
build_bundle vendor "SEGALOKA Vendor" apps/vendor/config.js apps/vendor/portal.js
build_bundle traveler "SEGALOKA Traveler" apps/traveler/config.js apps/traveler/portal.js
build_bundle affiliate "SEGALOKA Affiliate" apps/affiliate/config.js apps/affiliate/portal.js
build_bundle mitra "SEGALOKA Mitra Travel" apps/mitra/config.js apps/mitra/portal.js shared/partner-agent-portal.js
build_bundle agen "SEGALOKA Agen" apps/agen/config.js apps/agen/portal.js shared/partner-agent-portal.js


# Vercel/static deployment output. Keep standalone root HTML files for local QA.
rm -rf dist
mkdir -p dist
cp segaloka-control-center.html dist/control-center.html
cp segaloka-travel.html dist/travel.html
cp segaloka-vendor.html dist/vendor.html
cp segaloka-traveler.html dist/traveler.html
cp segaloka-affiliate.html dist/affiliate.html
cp segaloka-mitra.html dist/mitra.html
cp segaloka-agen.html dist/agen.html

# Root is a hostname dispatcher, not a Control Center fallback.
# This is a second routing boundary behind Vercel host rewrites: if a platform
# host condition is ever skipped, a role hostname still cannot render Admin Pusat.
cat > dist/index.html <<'HTML'
<!doctype html>
<meta charset="utf-8">
<meta name="robots" content="noindex">
<title>SEGALOKA</title>
<script>
(function () {
  var host = location.hostname.toLowerCase();
  var routes = {
    "dev.dashboard.segaloka.com": "/control-center",
    "dev.travel.segaloka.com": "/travel",
    "dev.vendor.segaloka.com": "/vendor",
    "dev.traveler.segaloka.com": "/traveler",
    "dev.affiliate.segaloka.com": "/affiliate",
    "dev.mitra.segaloka.com": "/mitra",
    "dev.agen.segaloka.com": "/agen"
  };
  location.replace(routes[host] || "/control-center");
})();
</script>
<noscript>JavaScript diperlukan untuk membuka dashboard Segaloka.</noscript>
HTML
