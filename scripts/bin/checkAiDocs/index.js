import path from "path";
import fs from "fs";
import { ROOT, loadRegistry, components, extractVariants, resolveDoc, normalize } from "../../utils/libMeta.js";

/**
 * AI-doc lint: fail if known-bad content appears in the `docs/` markdown that the
 * MCP server serves. Guards the copy-in usage model, canonical config name, real
 * CLI commands, valid import identifiers, and variant/size values that actually
 * exist in source.
 *
 * Also runs a doc↔registry COVERAGE guard so the MCP server never serves a
 * documented-but-uninstallable component, or lists an installable component with
 * no docs, without that gap being explicitly acknowledged in the ALLOWLIST below.
 *
 *   node scripts/bin/checkAiDocs/index.js   (or `pnpm run check:ai-docs`)
 */

const violations = [];

/** Substring/regex patterns that must never appear in AI-facing docs. */
const DENY = [
    { re: /npm install torch-glare/i, msg: "package-install usage — library is copy-in (`npx torch-glare add <Component>`)" },
    { re: /@torch-ai\//, msg: "fabricated npm scope `@torch-ai/…` — package is `torch-glare`, copied in via CLI" },
    { re: /@torch-ui\//, msg: "fabricated npm scope `@torch-ui/…` — import from the local alias `@/components/…`" },
    { re: /torch-glare\/lib\//, msg: "package-path import — use the local alias, e.g. `@/components/<Component>`" },
    { re: /from\s+['"]torch-glare['"]/, msg: "bare package import — components are copied in, not imported from the package" },
    { re: /torch\.json/, msg: "wrong config filename — the CLI uses `glare.json`" },
    { re: /torch-glare\s+theme\s+generate|`theme generate`/, msg: "nonexistent CLI command `theme generate`" },
];

// Valid variant/size values across ALL components (union), from source cva definitions.
const registry = loadRegistry();
const validVariants = new Set();
const validSizes = new Set();
for (const c of components(registry)) {
    const v = extractVariants(c);
    (v.variant || []).forEach((x) => validVariants.add(x));
    (v.size || []).forEach((x) => validSizes.add(x));
}

function walk(dir) {
    const out = [];
    if (!fs.existsSync(dir)) return out;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) out.push(...walk(p));
        else if (e.name.endsWith(".md")) out.push(p);
    }
    return out;
}

const targets = walk(path.join(ROOT, "docs")).filter((f) => fs.existsSync(f));

for (const file of targets) {
    const rel = path.relative(ROOT, file);
    const lines = fs.readFileSync(file, "utf-8").split("\n");
    let inFence = false;
    lines.forEach((line, i) => {
        const at = (msg) => `${rel}:${i + 1}  ${msg}\n      → ${line.trim()}`;

        for (const { re, msg } of DENY) if (re.test(line)) violations.push(at(msg));

        // Invalid identifiers inside `import { ... }` (e.g. `import { date-picker }`).
        const imp = line.match(/import\s+(?:type\s+)?\{([^}]*)\}/);
        if (imp) {
            for (const raw of imp[1].split(",")) {
                const name = raw.trim().replace(/^type\s+/, "").split(/\s+as\s+/)[0].trim();
                if (name && !/^[A-Za-z_$][\w$]*$/.test(name)) {
                    violations.push(at(`invalid import identifier \`${name}\``));
                }
            }
        }

        // Within code fences, validate variant/size literals against source enums.
        if (/^\s*```/.test(line)) inFence = !inFence;
        else if (inFence) {
            for (const m of line.matchAll(/\b(variant|size)\s*=\s*\{?\s*["']([^"']+)["']/g)) {
                const [, prop, val] = m;
                const set = prop === "variant" ? validVariants : validSizes;
                if (!set.has(val)) violations.push(at(`unknown ${prop} value "${val}" (not in any component's source)`));
            }
        }
    });
}

// ── doc ↔ registry coverage guard ───────────────────────────────────────────
//
// Known-intentional gaps. Anything NOT listed here that violates a coverage rule
// fails the check, so new drift is caught while today's deliberate exceptions stay
// green. Keep entries commented — an allowlist without a reason rots into noise.
const COVERAGE_ALLOWLIST = {
    // Registry components with no `docs/components/<slug>.md`.
    componentsWithoutDoc: new Set([
        // Empty: every registry component now has a docs/components/<slug>.md.
    ]),
    // Component docs that resolve to no installable registry item of any type —
    // get-install-info / get-component-source return "not found" for these.
    //
    // Folder components are no longer listed here: `generateRegistry` registers them, so
    // FormBuilder, FormRenderer, TextEditor, DataViews and TreeFolder all resolve. What remains
    // are documented *sub-tools* of a folder component, which are not installable on their own.
    docsWithoutRegistryItem: new Set([
        // Editor.js tools that ship inside components/TextEditor/.
        "chart-block-tool",
        "table-dnd-wrapper",
    ]),
};

// Rule 1: every installable component should have a doc.
for (const c of components(registry)) {
    if (!resolveDoc(c.name) && !COVERAGE_ALLOWLIST.componentsWithoutDoc.has(c.name)) {
        violations.push(
            `coverage: component "${c.name}" (${c.path}) has no docs/components/*.md — ` +
            `add a doc, or allowlist it in checkAiDocs (COVERAGE_ALLOWLIST.componentsWithoutDoc).`,
        );
    }
}

// Rule 2: every component doc should resolve to an installable registry item.
const registryByNorm = new Set(registry.items.map((i) => normalize(i.name)));
const docsComponentsDir = path.join(ROOT, "docs", "components");
if (fs.existsSync(docsComponentsDir)) {
    for (const file of fs.readdirSync(docsComponentsDir).filter((f) => f.endsWith(".md")).sort()) {
        const slug = file.replace(/\.md$/, "");
        if (!registryByNorm.has(normalize(slug)) && !COVERAGE_ALLOWLIST.docsWithoutRegistryItem.has(slug)) {
            violations.push(
                `coverage: docs/components/${file} resolves to no registry item — ` +
                `get-install-info / get-component-source will return "not found". ` +
                `Register the component, or allowlist it (COVERAGE_ALLOWLIST.docsWithoutRegistryItem).`,
            );
        }
    }
}

if (violations.length) {
    console.error(`❌ AI-doc check failed — ${violations.length} issue(s):\n`);
    for (const v of violations) console.error("  " + v);
    console.error("\nFix with `pnpm run docs:fix`, or correct by hand, then re-run.");
    process.exit(1);
}

console.log(`✅ AI-doc check passed — ${targets.length} files scanned, doc↔registry coverage OK.`);
