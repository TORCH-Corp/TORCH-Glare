import path from "path";
import fs from "fs";
import {
    ROOT,
    readPackageJson,
    resolveComponentName,
    buildExportIndex,
    resolveImportPath,
} from "../../utils/libMeta.js";

/**
 * Correct the AI-relevant content of ALL docs so they describe the real copy-in usage model:
 *   - docs/components/*.md : Installation/Import blocks (with the REAL PascalCase name),
 *     frontmatter version, and example import paths.
 *   - docs/{tutorials,how-to,reference}/*.md : rewrite every wrong package import to copy-in
 *     local imports (splitting grouped imports, since there is no barrel), fix install
 *     commands and the config filename.
 *
 * Idempotent and deterministic.  node scripts/bin/fixDocs/index.js  (or `pnpm run docs:fix`)
 */

const pkg = readPackageJson();
const exportIndex = buildExportIndex();
const DOCS = path.join(ROOT, "docs");

/** Import specifiers that must be rewritten to local copy-in paths. */
function isBadSpecifier(spec) {
    return (
        spec.startsWith("@torch-ai/") ||
        spec.startsWith("@torch-ui/") ||
        spec.startsWith("torch-glare/lib/") ||
        spec === "torch-glare"
    );
}

/** Rewrite named imports from bad specifiers into per-file local imports (grouped by path). */
function rewriteImports(text) {
    // The leading group also captures an optional diff marker (+/-) used in migration blocks,
    // so those example imports are rewritten too (and the marker preserved).
    const re = /^([ \t]*[+-]?[ \t]*)import\s+(type\s+)?\{([^}]*)\}\s+from\s+['"]([^'"]+)['"];?/gm;
    return text.replace(re, (full, indent, typeKw, body, spec) => {
        if (!isBadSpecifier(spec)) return full;
        const byPath = new Map();
        for (const raw of body.split(",")) {
            const sym = raw.trim();
            if (!sym) continue;
            let isType = Boolean(typeKw);
            let name = sym;
            const inlineType = sym.match(/^type\s+(.+)$/);
            if (inlineType) {
                isType = true;
                name = inlineType[1].trim();
            }
            const base = name.split(/\s+as\s+/)[0].trim();
            const p = resolveImportPath(base, exportIndex);
            if (!byPath.has(p)) byPath.set(p, { value: [], type: [] });
            byPath.get(p)[isType ? "type" : "value"].push(name);
        }
        const lines = [];
        for (const [p, g] of [...byPath.entries()].sort()) {
            if (g.value.length) lines.push(`${indent}import { ${g.value.join(", ")} } from "${p}";`);
            if (g.type.length) lines.push(`${indent}import type { ${g.type.join(", ")} } from "${p}";`);
        }
        return lines.join("\n");
    });
}

function commonFixes(md) {
    md = rewriteImports(md);
    // Package install commands -> copy-in setup.
    md = md.replace(
        /^([ \t]*)(?:npm install|yarn add|pnpm add)\s+[^\n]*torch-glare[^\n]*$/gim,
        "$1npx torch-glare@latest init",
    );
    // Leftover prose references to the fabricated scope -> real package name.
    md = md.replace(/@torch-ai\/torch-glare/g, "torch-glare");
    // Canonical config filename.
    md = md.replace(/torch\.json/g, "glare.json");
    return md;
}

// ---- component-doc specific blocks (Installation / Import) ------------------

function replaceSection(md, heading, newBlock) {
    const re = new RegExp(`## ${heading}\\n[\\s\\S]*?(?=\\n## |\\n# |$)`);
    return re.test(md) ? md.replace(re, newBlock) : md;
}

const installBlock = (name) => `## Installation

TORCH Glare is a copy-in library: the CLI copies this component's source into your project
(you do **not** install it from the npm package). Run \`init\` once, then \`add\`:

\`\`\`bash
npx torch-glare@latest init
npx torch-glare@latest add ${name}
\`\`\`

\`add\` also copies any components, hooks, and utilities that \`${name}\` depends on.
`;

const importBlock = (name) => `## Import

Import from your project's local path — the alias configured in \`glare.json\` (e.g. \`@/*\`):

\`\`\`tsx
import { ${name} } from "@/components/${name}";
\`\`\`
`;

function fixComponentDoc(file) {
    const abs = path.join(DOCS, "components", file);
    let md = fs.readFileSync(abs, "utf-8");
    const before = md;
    const name = resolveComponentName(file) || file.replace(/\.md$/, "");

    const fm = md.match(/^---\n[\s\S]*?\n---\n/);
    if (fm) md = md.replace(fm[0], fm[0].replace(/^version:.*$/m, `version: ${pkg.version}`));

    md = replaceSection(md, "Installation", installBlock(name));
    md = replaceSection(md, "Import", importBlock(name));
    md = commonFixes(md);

    if (md !== before) fs.writeFileSync(abs, md);
    return md !== before;
}

function fixGuideDoc(abs) {
    const md = fs.readFileSync(abs, "utf-8");
    const fixed = commonFixes(md);
    if (fixed !== md) fs.writeFileSync(abs, fixed);
    return fixed !== md;
}

// ---- run --------------------------------------------------------------------

let changed = 0;
const compDir = path.join(DOCS, "components");
for (const f of fs.readdirSync(compDir).filter((f) => f.endsWith(".md"))) {
    if (fixComponentDoc(f)) changed++;
}
// Top-level docs/*.md (README, BLOCKS, changelog) + the guide quadrants.
for (const f of fs.readdirSync(DOCS).filter((f) => f.endsWith(".md"))) {
    if (fixGuideDoc(path.join(DOCS, f))) changed++;
}
for (const sub of ["tutorials", "how-to", "reference", "explanation", "migration"]) {
    const dir = path.join(DOCS, sub);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
        if (fixGuideDoc(path.join(dir, f))) changed++;
    }
}
console.log(`✅ docs:fix — updated ${changed} docs (version ${pkg.version}, copy-in imports).`);
