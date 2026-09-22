import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

/**
 * Registry generator for the torch-glare CLI.
 *
 * Walks apps/lib/{components,hooks,utils,layouts,providers}, statically parses the
 * imports of every shippable source file, and emits TWO surfaces:
 *
 *   1. apps/lib/registry.json — the manifest the bundled CLI reads today, describing
 *      for each item:
 *        - files:                every source file the item is made of, relative to apps/lib
 *        - npmDependencies:      external packages it imports (normalized to install names)
 *        - registryDependencies: other torch-glare items it depends on, as "type/name" refs
 *
 *   2. registry/ — the **hosted** registry, served over HTTP so the CLI can install
 *      without carrying the library in its tarball:
 *        registry/index.json              the manifest above (same bytes, no file content)
 *        registry/<type>/<name>.json      one item with its file content inlined
 *
 *      An item's URL path is exactly its "type/name" registry ref, so a registryDependencies
 *      entry resolves to a URL with no mapping table.
 *
 * Dependency resolution is deterministic and testable. Regenerate whenever library source
 * changes:
 *   node scripts/bin/generateRegistry/index.js
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../../..");
const LIB_DIR = path.join(ROOT, "apps", "lib");
const OUTPUT = path.join(LIB_DIR, "registry.json");

// The hosted registry. Deliberately at the repo root rather than inside apps/lib: it is a
// generated artifact, not library source, and apps/lib ships in the npm tarball — burying it
// there would add ~1.1 MB to a package whose whole point is to stop carrying the library.
const HOSTED_DIR = path.join(ROOT, "registry");

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
        .filter((name) =>
            collectFolderFiles(path.join(dir, name)).some((f) => !f.endsWith(".d.ts"))
        );
}

/**
 * Every shippable source file inside a folder component, recursively, as absolute paths.
 *
 * `.d.ts` files ARE included here, unlike `listSourceFiles` above, which excludes them so that an
 * ambient declaration never becomes an item of its own. They still have to *ship*:
 * `components/TextEditor/editorjs.d.ts` declares the `@editorjs/*` modules TextEditor imports, so
 * without it the installed TextEditor does not typecheck. The bundled CLI never noticed because it
 * copies whole directories rather than the listed files — a hosted registry ships exactly what is
 * listed, so the omission would become a broken install.
 */
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
        out.push(abs);
    }
    return out.sort();
}

/** An absolute path under apps/lib, as the posix path used for both `files` and install targets. */
function libRelative(abs) {
    return path.relative(LIB_DIR, abs).split(path.sep).join("/");
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
                files: [libRelative(fileAbs)],
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
            const folderFiles = collectFolderFiles(folderAbs);

            for (const fileAbs of folderFiles) {
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
                files: folderFiles.map(libRelative),
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

    // Only a ref that survives neither `toKnownRoot` nor the self-check is a genuine loss. The
    // old counter here also tallied self-refs and post-collapse duplicates, then blamed the total
    // on "the CLI resolver" — which never resolved them, and which a hosted registry does not have.
    // Report only what is actually unresolvable, and make it a warning.
    const unresolved = [];
    for (const item of items) {
        const self = `${item.type}/${item.name}`;
        const collapsed = [...new Set(item.registryDependencies.map(toKnownRoot))].filter(
            (ref) => ref !== self
        );
        const kept = collapsed.filter((ref) => known.has(ref));
        for (const ref of collapsed) {
            if (!known.has(ref)) unresolved.push(`${self} -> ${ref}`);
        }
        item.registryDependencies = kept;
    }
    if (unresolved.length) {
        console.warn(
            `⚠️  ${unresolved.length} unresolvable registry ref(s) dropped:\n   ` +
                unresolved.join("\n   ")
        );
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

    writeHostedRegistry(registry);
}

/**
 * The published contract for both registry shapes.
 *
 * Emitted from the generator rather than hand-written so it cannot drift from what is actually
 * served. Draft-07, because it is what every validator supports without configuration.
 *
 * The two shapes deliberately differ, and the difference is worth stating plainly for anyone
 * implementing against this:
 *
 *   - The **index** lists `npmDependencies` as bare package names and hoists their ranges into a
 *     single top-level `npmVersions` map. It is fetched whole, on every install, so it stays small.
 *   - An **item** lists `dependencies` as fully pinned specs (`react-hook-form@^7.54.2`). It has to
 *     stand alone — someone fetching one item URL has no `npmVersions` map to consult — and
 *     `dependencies` is the key shadcn registries already use.
 */
function writeSchema() {
    const NAME_PATTERN = "^[A-Za-z0-9][A-Za-z0-9._-]*$";
    const REF_PATTERN = "^(components|hooks|utils|layouts|providers)/[A-Za-z0-9][A-Za-z0-9._-]*$";

    const schema = {
        $schema: "http://json-schema.org/draft-07/schema#",
        $id: "https://raw.githubusercontent.com/TORCH-Corp/TORCH-Glare/main/registry/schema.json",
        title: "TORCH Glare registry",
        description:
            "Both shapes served by a Glare-compatible registry: the index at /index.json and a " +
            "single item at /<type>/<Name>.json. An item's registryDependencies entry is also its " +
            "URL path, so a dependency resolves by concatenation with the registry base.",
        oneOf: [{ $ref: "#/definitions/index" }, { $ref: "#/definitions/item" }],
        definitions: {
            type: {
                enum: ["components", "hooks", "utils", "layouts", "providers"],
                description: "Also the sub-folder the item installs into.",
            },
            ref: {
                type: "string",
                pattern: REF_PATTERN,
                description: 'A "type/name" reference, which doubles as a URL path.',
            },
            index: {
                type: "object",
                required: ["version", "items"],
                properties: {
                    version: { type: "string" },
                    generatedBy: { type: "string" },
                    npmVersions: {
                        type: "object",
                        description: "Package name to semver range, shared across every item.",
                        additionalProperties: { type: "string" },
                    },
                    items: { type: "array", items: { $ref: "#/definitions/indexItem" } },
                },
            },
            indexItem: {
                type: "object",
                required: ["name", "type", "path", "npmDependencies", "registryDependencies"],
                properties: {
                    name: { type: "string", pattern: NAME_PATTERN },
                    type: { $ref: "#/definitions/type" },
                    path: {
                        type: "string",
                        description: "File or directory, relative to the library root.",
                    },
                    files: {
                        type: "array",
                        description: "Every file the item is made of. Expands a directory `path`.",
                        items: { type: "string" },
                    },
                    npmDependencies: {
                        type: "array",
                        description: "Bare package names; ranges live in the index's npmVersions.",
                        items: { type: "string" },
                    },
                    registryDependencies: {
                        type: "array",
                        items: { $ref: "#/definitions/ref" },
                    },
                },
            },
            item: {
                type: "object",
                required: ["name", "type", "dependencies", "registryDependencies", "files"],
                properties: {
                    version: { type: "string" },
                    name: { type: "string", pattern: NAME_PATTERN },
                    type: { $ref: "#/definitions/type" },
                    dependencies: {
                        type: "array",
                        description: 'npm specs with their range inlined, e.g. "clsx@^2.1.1".',
                        items: { type: "string" },
                    },
                    registryDependencies: {
                        type: "array",
                        items: { $ref: "#/definitions/ref" },
                    },
                    files: {
                        type: "array",
                        minItems: 1,
                        items: { $ref: "#/definitions/file" },
                    },
                },
            },
            file: {
                type: "object",
                required: ["path", "target", "content"],
                properties: {
                    path: { type: "string" },
                    target: {
                        type: "string",
                        description:
                            "Where it installs, relative to the configured path. Must stay inside it.",
                    },
                    content: { type: "string" },
                },
            },
        },
    };

    fs.writeFileSync(
        path.join(HOSTED_DIR, "schema.json"),
        JSON.stringify(schema, null, 2) + "\n"
    );
}

/**
 * Emit the hosted registry: an index plus one self-contained JSON per item, with file content
 * inlined so a consumer needs no access to this source tree.
 *
 * Rebuilt from scratch every run — a renamed or deleted component must not leave a stale item
 * being served.
 */
function writeHostedRegistry(registry) {
    fs.rmSync(HOSTED_DIR, { recursive: true, force: true });
    fs.mkdirSync(HOSTED_DIR, { recursive: true });

    // The index is the manifest verbatim: same items, same refs, no file content.
    fs.writeFileSync(
        path.join(HOSTED_DIR, "index.json"),
        JSON.stringify(registry, null, 2) + "\n"
    );

    writeSchema();

    let fileCount = 0;
    let bytes = 0;

    for (const item of registry.items) {
        const payload = {
            version: registry.version,
            name: item.name,
            type: item.type,
            // Pinned inline, so an item fetched on its own still installs the versions the
            // library builds against. The bundled CLI pins from registry.npmVersions at install
            // time; a third party consuming one item URL has no such map.
            dependencies: item.npmDependencies.map((name) =>
                registry.npmVersions[name] ? `${name}@${registry.npmVersions[name]}` : name
            ),
            registryDependencies: item.registryDependencies,
            files: item.files.map((rel) => ({
                path: rel,
                // Identical to `path` for every item today: the install layout mirrors apps/lib
                // exactly, which is precisely why the copied relative imports resolve. Emitted
                // anyway because it is the field a third-party registry uses to relocate a file.
                target: rel,
                content: fs.readFileSync(path.join(LIB_DIR, rel), "utf-8"),
            })),
        };

        const out = path.join(HOSTED_DIR, item.type, `${item.name}.json`);
        fs.mkdirSync(path.dirname(out), { recursive: true });
        const json = JSON.stringify(payload, null, 2) + "\n";
        fs.writeFileSync(out, json);

        fileCount += payload.files.length;
        bytes += Buffer.byteLength(json);
    }

    console.log(
        `✅ Wrote ${path.relative(ROOT, HOSTED_DIR)}/ — ${registry.items.length} item(s), ` +
            `${fileCount} file(s), ${(bytes / 1024 / 1024).toFixed(2)} MiB.`
    );
}

main();
