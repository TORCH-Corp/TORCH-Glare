import path from "path";
import fs from "fs";
import { ROOT, readPackageJson, loadRegistry, components, extractVariants } from "../../utils/libMeta.js";

/**
 * AI-doc lint: fail if known-bad content appears in the AI-facing docs. Guards the copy-in
 * usage model, canonical config name, real CLI commands, valid import identifiers, and
 * variant/size values that actually exist in source.
 *
 *   node scripts/bin/checkAiDocs/index.js   (or `pnpm run check:ai-docs`)
 */

const pkg = readPackageJson();
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

const targets = [
    path.join(ROOT, "llms.txt"),
    path.join(ROOT, "llms-full.txt"),
    ...walk(path.join(ROOT, "docs")),
].filter((f) => fs.existsSync(f));

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

// Manifest version must match package.json.
const manifestPath = path.join(ROOT, "llms-manifest.json");
if (fs.existsSync(manifestPath)) {
    const m = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    if (m.library?.version !== pkg.version) {
        violations.push(`llms-manifest.json  library.version "${m.library?.version}" != package.json "${pkg.version}"`);
    }
}

// llms.txt must advertise the current version and have only resolvable component-doc links.
const llmsTxt = path.join(ROOT, "llms.txt");
if (fs.existsSync(llmsTxt)) {
    const txt = fs.readFileSync(llmsTxt, "utf-8");
    if (!txt.includes(pkg.version)) violations.push(`llms.txt  does not mention the current version ${pkg.version}`);
    for (const m of txt.matchAll(/\]\((docs\/[^)]+\.md)\)/g)) {
        if (!fs.existsSync(path.join(ROOT, m[1]))) violations.push(`llms.txt  dead doc link → ${m[1]}`);
    }
}

if (violations.length) {
    console.error(`❌ AI-doc check failed — ${violations.length} issue(s):\n`);
    for (const v of violations) console.error("  " + v);
    console.error("\nFix with `pnpm run docs:fix` / `pnpm run llms`, or correct by hand, then re-run.");
    process.exit(1);
}

console.log(`✅ AI-doc check passed — ${targets.length} files scanned, no issues.`);
