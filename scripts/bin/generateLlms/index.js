import path from "path";
import fs from "fs";
import {
    ROOT,
    readPackageJson,
    loadRegistry,
    components,
    itemsOfType,
    extractVariants,
    resolveDoc,
    resolveExample,
} from "../../utils/libMeta.js";

/**
 * Generate the AI-facing docs from source of truth (package.json + registry + component
 * source + real examples): llms.txt, llms-manifest.json, llms-full.txt.
 *
 * Deterministic (no timestamps/randomness) so the CI staleness gate works. Regenerate with:
 *   node scripts/bin/generateLlms/index.js   (or `pnpm run llms`)
 */

const pkg = readPackageJson();
const registry = loadRegistry();
const repoUrl = (pkg.repository && pkg.repository.url) || "";

const comps = components(registry);
const hooks = itemsOfType(registry, "hooks");
const providers = itemsOfType(registry, "providers");
const utils = itemsOfType(registry, "utils");
const layouts = itemsOfType(registry, "layouts");

// ---- shared building blocks -------------------------------------------------

const INSTALL_BLOCK = `TORCH Glare is a **copy-in** component library (like shadcn/ui). The CLI copies component
source directly into your project — you do **not** import components from the \`torch-glare\`
npm package.

\`\`\`bash
# 1. Set up glare.json + Tailwind (run once per project)
npx torch-glare@latest init

# 2. Add a component — copies it AND its dependencies into your project
npx torch-glare@latest add Button
\`\`\`

Then import from your local path (the alias configured in \`glare.json\`, e.g. \`@/*\`):

\`\`\`tsx
import { Button } from "@/components/Button";

export function Example() {
  return <Button variant="PrimeStyle">Click me</Button>;
}
\`\`\`

Component names are **case-sensitive PascalCase** (e.g. \`add DatePicker\`, not \`add datepicker\`).`;

const CLI_COMMANDS = [
    ["init", "create glare.json and set up Tailwind"],
    ["add [Component]", "copy a component and its dependencies into your project"],
    ["hook [hook]", "add a hook (usually pulled in automatically as a dependency)"],
    ["util [util]", "add a utility (usually pulled in automatically)"],
    ["layout [layout]", "add a layout"],
    ["provider [provider]", "add a provider (e.g. ThemeProvider)"],
    ["update", "re-sync installed items with the latest templates"],
];

function variantSummary(v) {
    const parts = [];
    if (v.variant && v.variant.length) parts.push(`variants: ${v.variant.join(", ")}`);
    if (v.size && v.size.length) parts.push(`sizes: ${v.size.join(", ")}`);
    return parts.join(" · ");
}

// ---- llms.txt (concise index) ----------------------------------------------

function buildLlmsTxt() {
    const L = [];
    L.push(`# TORCH Glare`);
    L.push("");
    L.push(`> ${pkg.description}`);
    L.push("");
    L.push(
        `**Version:** ${pkg.version} | **License:** ${pkg.license} | ` +
            `**Components:** ${comps.length} | **Distribution:** copy-in via CLI (you own the source)`,
    );
    L.push("");
    L.push(`## Installation`);
    L.push("");
    L.push(INSTALL_BLOCK);
    L.push("");
    L.push(`## CLI Commands`);
    L.push("");
    L.push(`Run any command without an argument to pick from an interactive list.`);
    L.push("");
    for (const [cmd, desc] of CLI_COMMANDS) L.push(`- \`npx torch-glare ${cmd}\` — ${desc}`);
    L.push("");
    L.push(`## Theme`);
    L.push("");
    L.push(
        `Every component accepts a \`theme\` prop, applied as \`data-theme\`: ` +
            `\`"light" | "dark" | "default"\`. Wrap your app in \`ThemeProvider\` for global theming.`,
    );
    L.push("");
    L.push(`## Components (${comps.length})`);
    L.push("");
    for (const c of comps) {
        const v = variantSummary(extractVariants(c));
        const doc = resolveDoc(c.name);
        const bits = [`\`npx torch-glare add ${c.name}\``];
        if (c.npmDependencies.length) bits.push(`deps: ${c.npmDependencies.join(", ")}`);
        if (v) bits.push(v);
        if (doc) bits.push(`[docs](${doc})`);
        L.push(`- **${c.name}** — ${bits.join(" · ")}`);
    }
    L.push("");
    L.push(`## Hooks (${hooks.length})`);
    L.push("");
    for (const h of hooks) L.push(`- **${h.name}** — \`npx torch-glare hook ${h.name}.ts\``);
    L.push("");
    L.push(`## Providers (${providers.length})`);
    L.push("");
    for (const p of providers)
        L.push(`- **${p.name}** — \`npx torch-glare provider ${p.name}.tsx\``);
    L.push("");
    L.push(`## Resources`);
    L.push("");
    if (pkg.homepage) L.push(`- Homepage: ${pkg.homepage}`);
    if (repoUrl) L.push(`- Repository: ${repoUrl}`);
    L.push(`- npm: https://www.npmjs.com/package/${pkg.name}`);
    L.push("");
    return L.join("\n");
}

// ---- llms-manifest.json (machine-readable) ---------------------------------

function buildManifest() {
    const documented = comps.filter((c) => resolveDoc(c.name)).length;
    const exampled = comps.filter((c) => resolveExample(c.name)).length;

    const componentEntries = comps.map((c) => {
        const v = extractVariants(c);
        const entry = {
            name: c.name,
            add: `npx torch-glare add ${c.name}`,
            import: `import { ${c.name} } from "@/components/${c.name}";`,
            path: c.path,
            npmDependencies: c.npmDependencies,
            registryDependencies: c.registryDependencies,
        };
        if (v.variant) entry.variants = v.variant;
        if (v.size) entry.sizes = v.size;
        const doc = resolveDoc(c.name);
        const ex = resolveExample(c.name);
        entry.doc = doc || null;
        entry.example = ex || null;
        return entry;
    });

    return {
        library: {
            name: pkg.name,
            version: pkg.version,
            description: pkg.description,
            license: pkg.license,
            homepage: pkg.homepage || null,
            repository: repoUrl || null,
        },
        usage: {
            model: "copy-in",
            install: ["npx torch-glare@latest init", "npx torch-glare@latest add <Component>"],
            import: 'import { <Component> } from "@/components/<Component>";',
            note: "Components are copied into your project by the CLI; they are not imported from the npm package.",
            commands: Object.fromEntries(CLI_COMMANDS.map(([c, d]) => [c.split(" ")[0], d])),
        },
        statistics: {
            totalComponents: comps.length,
            totalHooks: hooks.length,
            totalProviders: providers.length,
            totalUtils: utils.length,
            totalLayouts: layouts.length,
            documentedComponents: documented,
            docCoverage: Number(((documented / comps.length) * 100).toFixed(1)),
            exampleCoverage: Number(((exampled / comps.length) * 100).toFixed(1)),
        },
        components: componentEntries,
        hooks: hooks.map((h) => ({ name: h.name, path: h.path })),
        providers: providers.map((p) => ({ name: p.name, path: p.path })),
        utils: utils.map((u) => ({ name: u.name, path: u.path })),
        layouts: layouts.map((l) => ({ name: l.name, path: l.path })),
    };
}

// ---- llms-full.txt (self-contained) ----------------------------------------

function buildLlmsFull() {
    const L = [];
    L.push(`# TORCH Glare — Full AI Reference (v${pkg.version})`);
    L.push("");
    L.push(`> ${pkg.description}`);
    L.push(`> This single file is self-contained: an assistant can use it to write correct`);
    L.push(`> TORCH Glare code without fetching anything else.`);
    L.push("");
    L.push(`## Installation`);
    L.push("");
    L.push(INSTALL_BLOCK);
    L.push("");
    L.push(`## Configuration (glare.json)`);
    L.push("");
    L.push(
        "`glare.json` (created by `init`) sets the destination `path` for copied files. " +
            "Components land in `<path>/components`, hooks in `<path>/hooks`, utils in `<path>/utils`. " +
            'Import them via your project alias, e.g. `import { Button } from "@/components/Button"`.',
    );
    L.push("");
    L.push(`## Theme`);
    L.push("");
    L.push(
        'Every component accepts `theme?: "light" | "dark" | "default"`, applied as a ' +
            "`data-theme` attribute. Use `ThemeProvider` for app-wide theming.",
    );
    L.push("");
    L.push(`## Components (${comps.length})`);
    L.push("");
    for (const c of comps) {
        const v = extractVariants(c);
        L.push(`### ${c.name}`);
        L.push("");
        L.push(`- Add: \`npx torch-glare add ${c.name}\``);
        L.push(`- Import: \`import { ${c.name} } from "@/components/${c.name}";\``);
        if (c.npmDependencies.length) L.push(`- npm dependencies: ${c.npmDependencies.join(", ")}`);
        if (v.variant) L.push(`- Variants: ${v.variant.join(", ")}`);
        if (v.size) L.push(`- Sizes: ${v.size.join(", ")}`);
        const doc = resolveDoc(c.name);
        if (doc) L.push(`- Docs: ${doc}`);
        const ex = resolveExample(c.name);
        if (ex) {
            const src = fs.readFileSync(path.join(ROOT, ex), "utf-8").trim();
            L.push("");
            L.push(`Example (${ex}):`);
            L.push("");
            L.push("```tsx");
            L.push(src);
            L.push("```");
        }
        L.push("");
    }
    L.push(`## Hooks (${hooks.length})`);
    L.push("");
    for (const h of hooks) L.push(`- ${h.name} — \`npx torch-glare hook ${h.name}.ts\``);
    L.push("");
    L.push(`## Providers (${providers.length})`);
    L.push("");
    for (const p of providers) L.push(`- ${p.name} — \`npx torch-glare provider ${p.name}.tsx\``);
    L.push("");
    return L.join("\n");
}

// ---- write ------------------------------------------------------------------

fs.writeFileSync(path.join(ROOT, "llms.txt"), buildLlmsTxt());
fs.writeFileSync(path.join(ROOT, "llms-manifest.json"), JSON.stringify(buildManifest(), null, 2) + "\n");
fs.writeFileSync(path.join(ROOT, "llms-full.txt"), buildLlmsFull());

const documented = comps.filter((c) => resolveDoc(c.name)).length;
const exampled = comps.filter((c) => resolveExample(c.name)).length;
console.log(
    `✅ Generated llms.txt, llms-full.txt, llms-manifest.json — ${comps.length} components ` +
        `(${documented} documented, ${exampled} with examples).`,
);
