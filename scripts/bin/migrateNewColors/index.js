// Regenerates the two color Tailwind v3 plugins from the new source data
// in `new-colors/` so `apps/` keeps working with zero component changes.
//
// Inputs (new-colors/):
//   - core-color/index.css   raw palette, tokens named `--<color>-mode-1`
//   - themes/index.css       all 3 themes in one file, tokens `--*-torch` suffixed
//   - mapingcolor/index.css  alias layer: `--<name>: var(--<name>-{default,light,dark})`
//
// Outputs:
//   - plugins/torchMode/index.cjs
//       Raw palette injected into :root. Mirrors the structure of the
//       current hand-maintained file (see existing torchMode/index.cjs).
//       All palette colors land here with their `-mode-1` suffix stripped
//       (e.g. `--purple-500: #AE71FFFF`) so consumers and the themes
//       layer can reference them directly.
//
//   - plugins/mappingColorSystem/index.cjs
//       Exports `{ plugin, mappingVars }`.
//       `plugin` adds three :root blocks keyed on `data-theme` (dark / light
//       / default) that set bare names like `--background-system-body-base`
//       to whichever variant applies.
//       `mappingVars` is a flat JS object mapping each bare token name to
//       `var(--<name>)` so Tailwind's `theme.extend.colors` can spread it
//       and generate `bg-*`, `text-*`, `border-*` utilities.
//
// Bridges handled at generation time:
//   - `-torch` suffix: themes file defines `--X-torch`, other files reference `--X`.
//   - `-mode-1` suffix: palette defines `--X-mode-1`, other files reference `--X`.
//   Both are flattened before emission so generated plugins are self-consistent.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..", "..");

const CORE = path.join(ROOT, "new-colors", "core-color", "index.css");
const THEMES = path.join(ROOT, "new-colors", "themes", "index.css");
const MAPPING = path.join(ROOT, "new-colors", "mapingcolor", "index.css");

const OUT_TORCH = path.join(ROOT, "plugins", "torchMode", "index.cjs");
const OUT_MAPPING = path.join(ROOT, "plugins", "mappingColorSystem", "index.cjs");
const OUT_V4_PLUGIN = path.join(ROOT, "plugins", "mappingColorSystemV4", "index.cjs");
const OUT_V4_CSS = path.join(ROOT, "plugins", "mappingColorSystemV4", "tailwindVars.css");

const VAR_DEF_RE = /--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
const SINGLE_VAR_RE = /^var\(\s*--([a-zA-Z0-9_-]+)\s*\)$/;
const MODES = ["default", "light", "dark"];
const BRIDGE_SUFFIXES = ["torch", "mode-1"];

function extractDefs(file) {
  const content = fs.readFileSync(file, "utf8");
  const defs = new Map();
  let m;
  VAR_DEF_RE.lastIndex = 0;
  while ((m = VAR_DEF_RE.exec(content)) !== null) {
    if (!defs.has(m[1])) defs.set(m[1], m[2].trim());
  }
  return defs;
}

// -- Load sources -----------------------------------------------------------

const coreDefs = extractDefs(CORE);
const themesDefs = extractDefs(THEMES);
const mappingDefs = extractDefs(MAPPING);

// Merged value map for chain resolution.
const valueMap = new Map();
for (const [k, v] of coreDefs) valueMap.set(k, v);
for (const [k, v] of themesDefs) if (!valueMap.has(k)) valueMap.set(k, v);
for (const [k, v] of mappingDefs) if (!valueMap.has(k)) valueMap.set(k, v);

// Apply bridges: any reference to `--X` where only `--X-torch` or `--X-mode-1`
// exists gets aliased. We pre-fill those in valueMap so resolveLiteral follows them.
for (const [, rawValue] of [...valueMap]) {
  let m;
  const re = /var\(\s*--([a-zA-Z0-9_-]+)\s*\)/g;
  while ((m = re.exec(rawValue)) !== null) {
    const ref = m[1];
    if (valueMap.has(ref)) continue;
    for (const suffix of BRIDGE_SUFFIXES) {
      if (valueMap.has(`${ref}-${suffix}`)) {
        valueMap.set(ref, `var(--${ref}-${suffix})`);
        break;
      }
    }
  }
}

// -- Chain resolver to literal ---------------------------------------------

function resolveLiteral(name, seen = new Set()) {
  if (seen.has(name)) return null;
  seen.add(name);
  const value = valueMap.get(name);
  if (!value) return null;
  const m = value.match(SINGLE_VAR_RE);
  if (m) return resolveLiteral(m[1], seen);
  return value;
}

// -- Step 1: torchMode — raw palette as literal values ---------------------
//
// Everything from new-colors/core-color/index.css with `-mode-1` stripped.
// The old torchMode plugin also inlines some theme-layer vars that happened
// to be colors (not aliases) — we include any var that resolves to a
// literal hex/rgb.

const torchEntries = [];
const torchNames = new Set();

for (const [name] of coreDefs) {
  // Strip `-mode-1` tail for the final name.
  const outName = name.endsWith("-mode-1") ? name.slice(0, -"-mode-1".length) : name;
  const literal = resolveLiteral(name);
  if (!literal || literal.includes("var(")) continue;
  if (torchNames.has(outName)) continue;
  torchNames.add(outName);
  torchEntries.push([outName, literal]);
}

// Also inline every theme-layer var (both literal and alias) at generation
// time. The runtime plugin injects bare `:root` values so all mapped
// variables find a terminal hex in the browser's cascade. We resolve the
// chain ourselves to avoid relying on CSS cascade for tokens that live
// behind a `-torch` / `-mode-1` suffix gap in the source data.
for (const [name] of themesDefs) {
  const outName = name.endsWith("-torch") ? name.slice(0, -"-torch".length) : name;
  if (torchNames.has(outName)) continue;
  const literal = resolveLiteral(name);
  if (!literal || literal.includes("var(")) continue;
  torchNames.add(outName);
  torchEntries.push([outName, literal]);
}

torchEntries.sort((a, b) => a[0].localeCompare(b[0]));

const torchJsObject = torchEntries
  .map(([k, v]) => `            "--${k}": "${v}",`)
  .join("\n");

const torchSrc = `const plugin = require('tailwindcss/plugin');
// AUTO-GENERATED by scripts/bin/migrateNewColors. Do not hand-edit.
module.exports = plugin(function ({ addBase }) {
    const mode = {
        ':root': {
${torchJsObject}
        },
    };
    addBase(mode);
});
`;

// -- Step 2: mappingColorSystem plugin + mappingVars ------------------------
//
// Replicates the current plugin's runtime behavior:
//   plugin: addBase with 3 :root blocks switched by data-theme
//   mappingVars: flat { "<name>": "var(--<name>)" } for Tailwind theme.colors
//
// Source of truth for the per-theme :root blocks is `themes/index.css`,
// which has every token declared with a theme-tagged name:
//   --background-system-default-body-base-torch
//   --background-system-light-body-base-torch
//   --background-system-dark-body-base-torch
//
// We also use `mapingcolor/index.css` which provides the canonical bare name
// for each token (e.g. `--background-system-body-base`) and maps it to its
// per-theme variants via `--background-system-body-base-default` / -light / -dark.

// Extract mapping entries: bareName -> { default, light, dark } each pointing
// at a var() reference.
const bareEntries = new Map(); // bareName -> { default?, light?, dark? }

for (const [name, value] of mappingDefs) {
  for (const mode of MODES) {
    const suffix = `-${mode}`;
    if (!name.endsWith(suffix)) continue;
    const bare = name.slice(0, -suffix.length);
    const ref = value.match(SINGLE_VAR_RE);
    if (!ref) continue;
    if (!bareEntries.has(bare)) bareEntries.set(bare, {});
    bareEntries.get(bare)[mode] = ref[1]; // canonical target name, no var()
  }
}

const sortedBares = [...bareEntries.keys()].sort();

// Build each per-theme :root block.
function buildThemeBlock(mode) {
  const lines = [];
  for (const bare of sortedBares) {
    const target = bareEntries.get(bare)[mode] || bareEntries.get(bare).default || bareEntries.get(bare).dark || bareEntries.get(bare).light;
    if (!target) continue;
    // The mapping file references e.g. `--background-system-dark-body-base`
    // (without the `-torch` suffix). We know themes/ declares these with
    // `-torch`, so we also add a fallback to the bridged name.
    const resolvedTargetName = valueMap.has(target) ? target : (valueMap.has(`${target}-torch`) ? `${target}-torch` : target);
    lines.push(`            "--${bare}": "var(--${resolvedTargetName})",`);
  }
  return lines.join("\n");
}

const darkBlock = buildThemeBlock("dark");
const lightBlock = buildThemeBlock("light");
const defaultBlock = buildThemeBlock("default");

// Build mappingVars object.
const mappingVarsBody = sortedBares
  .map((b) => `        "${b}": "var(--${b})",`)
  .join("\n");

// Also include the raw palette in mappingVars so `bg-purple-500` etc. work.
const paletteEntries = [];
for (const [name] of coreDefs) {
  const outName = name.endsWith("-mode-1") ? name.slice(0, -"-mode-1".length) : name;
  paletteEntries.push(outName);
}
paletteEntries.sort();
const paletteVarsBody = paletteEntries
  .map((n) => `        "${n}": "var(--${n})",`)
  .join("\n");

const mappingSrc = `const plugin = require('tailwindcss/plugin');
// AUTO-GENERATED by scripts/bin/migrateNewColors. Do not hand-edit.
const themePlugin = plugin(function ({ addBase }) {
    const darkTheme = {
        'html:not([data-theme]),[data-theme="dark"],[data-theme="null"]': {
${darkBlock}
        },
    };
    const lightTheme = {
        '[data-theme="light"]': {
${lightBlock}
        },
    };
    const defaultTheme = {
        '[data-theme="default"]': {
${defaultBlock}
        },
    };

    addBase(darkTheme);
    addBase(lightTheme);
    addBase(defaultTheme);
});

module.exports = {
    plugin: themePlugin,
    mappingVars: {
${mappingVarsBody}
${paletteVarsBody}
    },
};
`;

// -- Step 3: mappingColorSystemV4 plugin + tailwindVars.css ----------------
//
// Tailwind v4 consumers don't get a `mappingVars` JS export — instead they
// rely on `tailwindVars.css` (auto-loaded via `@plugin "mapping-color-system-v4"`)
// which declares each token in an `@theme { --color-<bare>: var(--<bare>); }` block,
// and the runtime plugin still injects per-theme `:root` blocks so `var(--<bare>)`
// resolves to the right per-theme target.
//
// We reuse darkBlock / lightBlock / defaultBlock from above — same data,
// the v4 plugin is structurally identical to v3 minus the `mappingVars`
// export and the surrounding `module.exports = { plugin, mappingVars }` wrapper.

const v4PluginSrc = `const plugin = require('tailwindcss/plugin');
// AUTO-GENERATED by scripts/bin/migrateNewColors. Do not hand-edit.
module.exports = plugin(function ({ addBase }) {
    const darkTheme = {
        'html:not([data-theme]),[data-theme="dark"],[data-theme="null"]': {
${darkBlock}
        },
    };
    const lightTheme = {
        '[data-theme="light"]': {
${lightBlock}
        },
    };
    const defaultTheme = {
        '[data-theme="default"]': {
${defaultBlock}
        },
    };

    addBase(darkTheme);
    addBase(lightTheme);
    addBase(defaultTheme);
});
`;

const v4CssLines = [];
for (const bare of sortedBares) {
  v4CssLines.push(`  --color-${bare}: var(--${bare});`);
}
for (const name of paletteEntries) {
  v4CssLines.push(`  --color-${name}: var(--${name});`);
}
const v4CssSrc = `/* AUTO-GENERATED by scripts/bin/migrateNewColors. Do not hand-edit. */
@theme {
${v4CssLines.join("\n")}
}
`;

// -- Write ------------------------------------------------------------------

fs.mkdirSync(path.dirname(OUT_TORCH), { recursive: true });
fs.mkdirSync(path.dirname(OUT_V4_PLUGIN), { recursive: true });
fs.writeFileSync(OUT_TORCH, torchSrc);
fs.writeFileSync(OUT_MAPPING, mappingSrc);
fs.writeFileSync(OUT_V4_PLUGIN, v4PluginSrc);
fs.writeFileSync(OUT_V4_CSS, v4CssSrc);

console.log(`Wrote ${OUT_TORCH}`);
console.log(`  ${torchEntries.length} raw palette + literal theme vars`);
console.log(`Wrote ${OUT_MAPPING}`);
console.log(`  ${sortedBares.length} semantic tokens (3 themes each)`);
console.log(`  ${paletteEntries.length} palette names exposed to Tailwind theme.colors`);
console.log(`  ${sortedBares.length + paletteEntries.length} total mappingVars entries`);
console.log(`Wrote ${OUT_V4_PLUGIN}`);
console.log(`  ${sortedBares.length} semantic tokens (3 themes each)`);
console.log(`Wrote ${OUT_V4_CSS}`);
console.log(`  ${sortedBares.length + paletteEntries.length} @theme entries (semantic + palette)`);
