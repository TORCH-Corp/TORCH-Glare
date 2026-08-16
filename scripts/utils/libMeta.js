import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

/**
 * Shared, dependency-free helpers for the doc tooling (generateRegistry, fixDocs,
 * checkAiDocs). Everything here is deterministic — no timestamps, no randomness — so the
 * generated output is stable and the CI staleness gate works.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "../..");
export const LIB_DIR = path.join(ROOT, "apps", "lib");
export const DOCS_COMPONENTS_DIR = path.join(ROOT, "docs", "components");
export const EXAMPLES_DIR = path.join(ROOT, "apps", "app", "exmples");

/** Read and parse the root package.json (single source of truth for version/meta). */
export function readPackageJson() {
    return JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf-8"));
}

/** Load the generated component registry. */
export function loadRegistry() {
    return JSON.parse(fs.readFileSync(path.join(LIB_DIR, "registry.json"), "utf-8"));
}

/** Lowercase + strip non-alphanumerics, for robust name<->filename matching. */
export function normalize(s) {
    return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Build a normalized-key -> filename map for a directory, stripping a suffix if given.
 *
 * A component's docs may be one file (`button.md`) or a folder whose `index.md` is the reference
 * and whose siblings are its guide, migration notes and examples — the form a component with more
 * than a page of documentation takes. Both resolve to the same key.
 */
function buildIndex(dir, { ext, stripSuffix } = {}) {
    const map = new Map();
    if (!fs.existsSync(dir)) return map;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const file = entry.name;
        if (entry.isDirectory()) {
            if (ext === ".md" && fs.existsSync(path.join(dir, file, "index.md"))) {
                map.set(normalize(file), path.join(file, "index.md"));
            }
            continue;
        }
        if (ext && !file.endsWith(ext)) continue;
        let base = file.replace(/\.[^.]+$/, "");
        if (stripSuffix && base.toLowerCase().endsWith(stripSuffix.toLowerCase())) {
            base = base.slice(0, base.length - stripSuffix.length);
        }
        map.set(normalize(base), file);
    }
    return map;
}

const docIndex = buildIndex(DOCS_COMPONENTS_DIR, { ext: ".md" });
const exampleIndex = buildIndex(EXAMPLES_DIR, { ext: ".tsx", stripSuffix: "Example" });

/** Resolve a component name to its docs/components/<slug>.md path (relative), or null. */
export function resolveDoc(name) {
    const file = docIndex.get(normalize(name));
    return file ? `docs/components/${file}` : null;
}

/** Resolve a component name to its example file path (relative), or null. */
export function resolveExample(name) {
    const file = exampleIndex.get(normalize(name));
    return file ? `apps/app/exmples/${file}` : null;
}

/**
 * Read a registry item's source.
 *
 * A folder component (`components/DataViews`) has no single file, so its sources are concatenated
 * — everything downstream only scans the text for variant names and identifiers, and one blob
 * answers that as well as a file does.
 */
export function readItemSource(item) {
    const abs = path.join(LIB_DIR, item.path);
    if (!fs.existsSync(abs)) return "";
    if (!fs.statSync(abs).isDirectory()) return fs.readFileSync(abs, "utf-8");

    const read = (dir) =>
        fs
            .readdirSync(dir, { withFileTypes: true })
            .flatMap((entry) => {
                const child = path.join(dir, entry.name);
                if (entry.isDirectory()) return read(child);
                if (!/\.(ts|tsx)$/.test(entry.name)) return [];
                return [fs.readFileSync(child, "utf-8")];
            });
    return read(abs).join("\n");
}

/**
 * Extract the top-level keys of the first `<keyName>: { ... }` object in some source
 * (used to pull CVA variant/size names). Brace/bracket-aware so nested objects are skipped.
 * @returns {string[]} ordered, de-duplicated top-level keys.
 */
export function extractObjectKeys(src, keyName) {
    // Strip block + line comments so a comment before the first key can't corrupt it.
    // Safe for these files: Tailwind class strings contain no // or /* sequences.
    src = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");

    const opener = new RegExp(`\\b${keyName}\\s*:\\s*{`);
    const m = opener.exec(src);
    if (!m) return [];

    // Find the matching close brace, string-aware (brackets inside Tailwind class strings
    // like "h-[18px]" must NOT affect depth).
    let i = m.index + m[0].length;
    const bodyStart = i;
    let depth = 1;
    let str = null;
    for (; i < src.length && depth > 0; i++) {
        const ch = src[i];
        if (str) {
            if (ch === str && src[i - 1] !== "\\") str = null;
            continue;
        }
        if (ch === '"' || ch === "'" || ch === "`") str = ch;
        else if (ch === "{" || ch === "[") depth++;
        else if (ch === "}" || ch === "]") depth--;
    }
    const body = src.slice(bodyStart, i - 1);

    // Walk the body at depth 0, capturing top-level keys. A closed string becomes the current
    // token candidate (so quoted keys work), while string CONTENTS never affect depth/keys.
    const keys = [];
    let d = 0;
    let token = "";
    let strBuf = null;
    let strQuote = null;
    for (let j = 0; j < body.length; j++) {
        const ch = body[j];
        if (strBuf !== null) {
            if (ch === strQuote && body[j - 1] !== "\\") {
                token = strBuf; // closed string is a key candidate iff a ':' follows
                strBuf = null;
            } else strBuf += ch;
            continue;
        }
        if (ch === '"' || ch === "'" || ch === "`") {
            strQuote = ch;
            strBuf = "";
        } else if (ch === "{" || ch === "[" || ch === "(") d++;
        else if (ch === "}" || ch === "]" || ch === ")") d--;
        else if (d === 0 && ch === ":") {
            const key = token.trim();
            // Allow hyphens: quoted CVA keys use kebab typography scales (e.g. "body-medium-regular").
            if (/^[A-Za-z_$][\w$-]*$/.test(key)) keys.push(key);
            token = "";
        } else if (d === 0 && ch === ",") {
            token = "";
        } else if (d === 0 && !/\s/.test(ch)) {
            token += ch;
        }
    }
    return [...new Set(keys)];
}

/** Extract { variant, size } enum keys for a registry item from its CVA definition. */
export function extractVariants(item) {
    if (item.type !== "components") return {};
    const src = readItemSource(item);
    const variant = extractObjectKeys(src, "variant");
    const size = extractObjectKeys(src, "size");
    const out = {};
    if (variant.length) out.variant = variant;
    if (size.length) out.size = size;
    return out;
}

/** Components only, sorted by name. */
export function components(registry) {
    return registry.items
        .filter((i) => i.type === "components")
        .sort((a, b) => a.name.localeCompare(b.name));
}

export function itemsOfType(registry, type) {
    return registry.items.filter((i) => i.type === type).sort((a, b) => a.name.localeCompare(b.name));
}

// ---- name + export resolution (for the doc fixer) --------------------------

// normalized(component name) -> real PascalCase name, from the registry.
const componentNameIndex = (() => {
    const map = new Map();
    for (const item of loadRegistry().items) {
        if (item.type === "components") map.set(normalize(item.name), item.name);
    }
    return map;
})();

/**
 * Resolve a doc filename (e.g. "date-picker.md") to the real PascalCase component name
 * (e.g. "DatePicker"), or null. Works regardless of the doc's frontmatter template.
 */
export function resolveComponentName(mdFile) {
    const base = mdFile.replace(/\.md$/, "");
    return componentNameIndex.get(normalize(base)) || null;
}

const TYPE_DIRS = ["components", "hooks", "utils", "providers", "layouts"];

/**
 * Scan apps/lib/** for exported symbols and map each to its local import path
 * (e.g. Button -> @/components/Button, cn -> @/utils/cn, useTheme -> @/providers/ThemeProvider).
 * There is no barrel, so every symbol imports from its own file.
 */
export function buildExportIndex() {
    const index = new Map();
    // Form 1: `export const|function|class|type|interface|enum Name`
    const declRe = /export\s+(?:const|function|class|type|interface|enum)\s+([A-Za-z_$][\w$]*)/g;
    // Form 2: `export { A, B as C, ... }` (local re-export block, possibly multiline)
    const blockRe = /export\s*\{([\s\S]*?)\}(\s*from\s*['"][^'"]+['"])?/g;

    const add = (name, localPath) => {
        if (name && !index.has(name)) index.set(name, localPath);
    };

    for (const type of TYPE_DIRS) {
        const dir = path.join(LIB_DIR, type);
        if (!fs.existsSync(dir)) continue;
        for (const file of fs.readdirSync(dir)) {
            if (!/\.(ts|tsx)$/.test(file) || /-dev\.(ts|tsx)$/.test(file)) continue;
            const localPath = `@/${type}/${file.replace(/\.(ts|tsx)$/, "")}`;
            const src = fs.readFileSync(path.join(dir, file), "utf-8");

            let m;
            while ((m = declRe.exec(src)) !== null) add(m[1], localPath);

            while ((m = blockRe.exec(src)) !== null) {
                if (m[2]) continue; // `export { ... } from '...'` re-exports another module; skip
                for (const part of m[1].split(",")) {
                    const name = part.trim().split(/\s+as\s+/).pop().trim();
                    if (/^[A-Za-z_$][\w$]*$/.test(name)) add(name, localPath);
                }
            }
        }
    }
    return index;
}

/**
 * Resolve an imported symbol to a local import path, using the export index with a
 * naming-heuristic fallback for anything not found (use* -> hooks, lowerCamel -> utils,
 * PascalCase -> components) so rewritten examples stay syntactically valid.
 */
export function resolveImportPath(symbol, exportIndex) {
    if (exportIndex.has(symbol)) return exportIndex.get(symbol);
    if (/^use[A-Z]/.test(symbol)) return `@/hooks/${symbol}`;
    if (/^[a-z]/.test(symbol)) return `@/utils/${symbol}`;
    return `@/components/${symbol}`;
}
