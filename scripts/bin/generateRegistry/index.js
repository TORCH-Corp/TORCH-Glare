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
    }

    items.sort((a, b) =>
        a.type === b.type ? a.name.localeCompare(b.name) : a.type.localeCompare(b.type)
    );

    // Validate every registry ref points at a real item — a dangling ref means the CLI
    // would try to install a file that does not exist.
    const known = new Set(items.map((i) => `${i.type}/${i.name}`));
    const dangling = [];
    for (const item of items) {
        for (const ref of item.registryDependencies) {
            if (!known.has(ref)) dangling.push(`${item.type}/${item.name} -> ${ref}`);
        }
    }
    if (dangling.length) {
        console.error("❌ Dangling registry dependencies (target not found):");
        for (const d of dangling) console.error(`   ${d}`);
        process.exit(1);
    }

    const registry = {
        version,
        generatedBy: "scripts/bin/generateRegistry",
        items,
    };

    fs.writeFileSync(OUTPUT, JSON.stringify(registry, null, 2) + "\n");
    console.log(
        `✅ Wrote ${path.relative(ROOT, OUTPUT)} — ${items.length} items ` +
            `(${items.filter((i) => i.type === "components").length} components).`
    );
}

main();
