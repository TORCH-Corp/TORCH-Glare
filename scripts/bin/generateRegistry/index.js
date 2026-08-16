import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

/**
 * Registry generator for the torch-glare CLI.
 *
 * Walks apps/lib/{components,hooks,utils,layouts,providers}, statically parses the
 * imports of every shippable source file, and emits apps/lib/registry.json describing,
 * for each item:
 *   - npmDependencies:      external packages the file imports (normalized to install names)
 *   - registryDependencies: other torch-glare items it depends on, as "type/name" refs
 *
 * The CLI reads this manifest at install time instead of re-parsing source, so dependency
 * resolution is deterministic and testable. Regenerate whenever library source changes:
 *   node scripts/bin/generateRegistry/index.js
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../../..");
const LIB_DIR = path.join(ROOT, "apps", "lib");
const OUTPUT = path.join(LIB_DIR, "registry.json");

// Folder name -> item "type". The type doubles as the install sub-folder used by the CLI.
const TYPE_DIRS = ["components", "hooks", "utils", "layouts", "providers"];

// Peers every consumer already has; never worth listing as an installable dependency.
const IGNORED_NPM = new Set(["react", "react-dom", "react/jsx-runtime"]);

// Captures both `import ... from "spec"` and side-effect `import "spec"`.
const IMPORT_RE = /import\s+(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/g;

/** Normalize an import specifier to its installable npm package name. */
function toPackageName(spec) {
    if (spec.startsWith("@")) {
        const [scope, name] = spec.split("/");
        return `${scope}/${name}`;
    }
    return spec.split("/")[0];
}

/** True for a bare (non-relative) module specifier. */
function isExternal(spec) {
    return !spec.startsWith(".") && !spec.startsWith("/");
}

/** List shippable source files (skips *-dev.* and non-source files). */
function listSourceFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isFile())
        .map((e) => e.name)
        .filter((name) => /\.(ts|tsx)$/.test(name))
        .filter((name) => !/-dev\.(ts|tsx)$/.test(name))
        .filter((name) => !name.endsWith(".d.ts"));
}

/**
 * List **folder components** — a directory under a type dir holding source files, which the CLI
 * copies whole (`DataViews`, `FormBuilder`, `TreeFolder`, …).
 *
 * These were previously skipped entirely, so the biggest components in the library were absent
 * from the manifest. `add` still copied them, because the CLI lists the templates directory rather
 * than the registry — but `resolveInstallPlan` reads the registry, so they arrived with none of
 * their dependencies.
 */
function listSourceFolders(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
        .filter((name) => collectFolderFiles(path.join(dir, name)).length > 0);
}

/** Every shippable source file inside a folder component, recursively, as absolute paths. */
function collectFolderFiles(folderAbs) {
    const out = [];
    for (const entry of fs.readdirSync(folderAbs, { withFileTypes: true })) {
        const abs = path.join(folderAbs, entry.name);
        if (entry.isDirectory()) {
            out.push(...collectFolderFiles(abs));
            continue;
        }
        if (!/\.(ts|tsx)$/.test(entry.name)) continue;
        if (/-dev\.(ts|tsx)$/.test(entry.name)) continue;
        if (entry.name.endsWith(".d.ts")) continue;
        out.push(abs);
    }
    return out;
}

/** Resolve a relative import to a "type/name" registry ref, or null if outside the registry. */
function resolveRegistryRef(fromFileAbs, spec) {
    const abs = path.resolve(path.dirname(fromFileAbs), spec);
    const rel = path.relative(LIB_DIR, abs); // e.g. "components/Popover"
    const [type, ...rest] = rel.split(path.sep);
    if (!TYPE_DIRS.includes(type) || rest.length === 0) return null;
    const name = rest.join("/").replace(/\.(ts|tsx)$/, "");
    return `${type}/${name}`;
}

function extractImports(content) {
    const specs = [];
    let match;
    IMPORT_RE.lastIndex = 0;
    while ((match = IMPORT_RE.exec(content)) !== null) specs.push(match[1]);
    return specs;
}

function main() {
    const version = JSON.parse(
        fs.readFileSync(path.join(ROOT, "package.json"), "utf-8")
    ).version;

    const items = [];

    for (const type of TYPE_DIRS) {
        const dir = path.join(LIB_DIR, type);
        for (const fileName of listSourceFiles(dir)) {
            const fileAbs = path.join(dir, fileName);
            const content = fs.readFileSync(fileAbs, "utf-8");
            const specs = extractImports(content);

            const npm = new Set();
            const registry = new Set();

            for (const spec of specs) {
                if (isExternal(spec)) {
                    const pkg = toPackageName(spec);
                    if (!IGNORED_NPM.has(pkg)) npm.add(pkg);
                } else {
                    const ref = resolveRegistryRef(fileAbs, spec);
                    if (ref) registry.add(ref);
                }
            }

            items.push({
                name: fileName.replace(/\.(ts|tsx)$/, ""),
                type,
                path: path.posix.join(type, fileName),
                npmDependencies: [...npm].sort(),
                registryDependencies: [...registry].sort(),
            });
        }

        // Folder components: one entry per directory, whose dependencies are the union across
        // every file inside it. Refs that point back into the same folder are dropped — the CLI
        // copies the whole directory, so they are already satisfied.
        for (const folderName of listSourceFolders(dir)) {
            const folderAbs = path.join(dir, folderName);
            const selfRef = `${type}/${folderName}`;

            const npm = new Set();
            const registry = new Set();

            for (const fileAbs of collectFolderFiles(folderAbs)) {
                for (const spec of extractImports(fs.readFileSync(fileAbs, "utf-8"))) {
                    if (isExternal(spec)) {
                        const pkg = toPackageName(spec);
                        if (!IGNORED_NPM.has(pkg)) npm.add(pkg);
                        continue;
                    }
                    const ref = resolveRegistryRef(fileAbs, spec);
                    if (ref && ref !== selfRef && !ref.startsWith(`${selfRef}/`)) registry.add(ref);
                }
            }

            items.push({
                name: folderName,
                type,
                path: path.posix.join(type, folderName),
                npmDependencies: [...npm].sort(),
                registryDependencies: [...registry].sort(),
            });
        }
    }

    items.sort((a, b) =>
        a.type === b.type ? a.name.localeCompare(b.name) : a.type.localeCompare(b.type)
    );

    // Drop refs that don't resolve to a top-level registry item. These point at nested
    // folder modules (e.g. utils/dataViews/*, components/DataViews/*) which the CLI installs
    // via its import-walking resolver; the flat registry only tracks top-level items for the
    // AI docs, so filtering them out (rather than erroring) keeps the manifest self-consistent.
    const known = new Set(items.map((i) => `${i.type}/${i.name}`));

    // A ref into a folder component's internals — `components/DataViews/views/table-view` — is a
    // dependency on that component. Collapse it to the folder root so it survives the filter
    // below instead of being silently dropped.
    const toKnownRoot = (ref) => {
        if (known.has(ref)) return ref;
        const parts = ref.split("/");
        for (let i = parts.length - 1; i > 1; i--) {
            const candidate = parts.slice(0, i).join("/");
            if (known.has(candidate)) return candidate;
        }
        return ref;
    };

    let dropped = 0;
    for (const item of items) {
        const self = `${item.type}/${item.name}`;
        const kept = [...new Set(item.registryDependencies.map(toKnownRoot))]
            .filter((ref) => ref !== self)
            .filter((ref) => known.has(ref));
        dropped += item.registryDependencies.length - kept.length;
        item.registryDependencies = kept;
    }
    if (dropped) {
        console.log(`ℹ️  Dropped ${dropped} nested/folder dependency ref(s) (handled by the CLI resolver).`);
    }

    // The version range the library itself builds against, per package.
    //
    // Without this the CLI installs every dependency unpinned, so an upstream major silently
    // breaks the copied source: `add DataTable` was installing @tanstack/react-table@9, whose API
    // renamed `getCoreRowModel`/`useReactTable`, against a component written for v8 — code that
    // could not compile the moment it landed.
    const declared = {};
    for (const file of ["apps/package.json", "package.json"]) {
        const abs = path.join(ROOT, file);
        if (!fs.existsSync(abs)) continue;
        const pkg = JSON.parse(fs.readFileSync(abs, "utf-8"));
        for (const section of ["dependencies", "devDependencies", "peerDependencies"]) {
            for (const [name, range] of Object.entries(pkg[section] ?? {})) {
                if (!(name in declared)) declared[name] = range;
            }
        }
    }

    const used = new Set(items.flatMap((item) => item.npmDependencies));
    const npmVersions = {};
    for (const name of [...used].sort()) {
        if (declared[name]) npmVersions[name] = declared[name];
    }

    const registry = {
        version,
        generatedBy: "scripts/bin/generateRegistry",
        npmVersions,
        items,
    };

    fs.writeFileSync(OUTPUT, JSON.stringify(registry, null, 2) + "\n");
    console.log(
        `✅ Wrote ${path.relative(ROOT, OUTPUT)} — ${items.length} items ` +
            `(${items.filter((i) => i.type === "components").length} components).`
    );
}

main();
