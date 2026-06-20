#!/usr/bin/env bash
# Generate a fully-resolved static Tailwind stylesheet for design-sync.
# Compiles a CSS entry holding @tailwind directives with apps/tailwind.config.ts, scanning
# apps/lib/** (component source) + .design-sync/previews/** (authored previews) so every
# utility class used by the previews is emitted, plus the plugins' addBase token vars
# (mapping-color-system, glare-torch-mode, glare-typography). Output is design-sync's cfg.cssEntry.
set -euo pipefail
ROOT="/home/haithem/Projects/TORCH-Glare-1"
cd "$ROOT/apps"
# The repo-root plugins/ mirrors `require('tailwindcss/plugin')` but there is no
# node_modules at repo root — point NODE_PATH at apps/node_modules so they resolve.
export NODE_PATH="$ROOT/apps/node_modules"
# cfg.cssEntry is bounded to PKG_DIR (apps/), so the generated stylesheet must live inside apps/.
OUT="$ROOT/apps/.ds-torch-glare.css"
TW="$ROOT/apps/node_modules/.bin/tailwindcss"

# Minimal CSS entry (only the @tailwind directives + chart vars from globals.css base layer).
# We omit the page-chrome rules in globals.css (body bg #eee, swiper, #app height) — those are
# host-app styles, not design-system tokens.
ENTRY="$(mktemp /tmp/ds-tw-entry.XXXXXX.css)"
cat > "$ENTRY" <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
  }
  .dark {
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}
CSS

# Use the design-sync config that wires the LOCAL plugin mirrors (badge token
# vocabulary matches the bundled components; the installed npm v1.2.0 packages
# renamed them). Its `content` already covers lib/ + previews/.
"$TW" \
  --config ./.ds-tailwind.config.cjs \
  --input "$ENTRY" \
  --output "$OUT" \
  --minify
rm -f "$ENTRY"

# Remix Icon font: 20 components render ri-* icon classes; the real app loads
# remixicon from a CDN in app/layout.tsx. We instead append a self-contained
# remixicon stylesheet (@font-face referencing ./.ds-remixicon.woff2 by RELATIVE
# url + all .ri-* class rules). The converter's extractFonts copies the woff2 into
# fonts/ and rewrites the url; rewriteBundleFontFaces keeps the relative face.
# NOTE: do NOT inline the font as a base64 data-URI — a giant data-URI can contain
# a literal "url(" substring that makes rewriteBundleFontFaces drop the whole
# @font-face. The relative-url + sibling-woff2 approach avoids that. See
# .ds-remixicon.css + .ds-remixicon.woff2 (both in apps/).
RICON="$ROOT/apps/.ds-remixicon.css"
if [ -f "$RICON" ]; then
  printf '\n/* --- Remix Icon (self-contained, data-URI font) --- */\n' >> "$OUT"
  cat "$RICON" >> "$OUT"
  echo "appended remixicon ($(wc -c < "$RICON") bytes)"
fi
echo "wrote $OUT ($(wc -c < "$OUT") bytes)"
