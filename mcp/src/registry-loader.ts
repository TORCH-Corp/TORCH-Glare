/**
 * Loads the copy-in registry (apps/lib/registry.json) and exposes the install
 * metadata the CLI uses: the `torch-glare` command to add an item, its import
 * statement, its npm dependencies, and the transitive closure of internal
 * (registry) dependencies the CLI copies. This is what makes the MCP server
 * *actionable* for a copy-in library rather than merely descriptive.
 *
 * The transitive resolution mirrors the CLI's resolveInstallPlan
 * (cli/src/shared/resolveInstallPlan.ts) so the MCP reports exactly what an
 * install would pull in.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Package root: mcp/dist/ -> mcp/ is ..
const PACKAGE_ROOT = path.resolve(__dirname, "..");
// Monorepo root: mcp/ -> project root is ..
const MONOREPO_ROOT = path.resolve(PACKAGE_ROOT, "..");

export interface RegistryItem {
  name: string;
  /** Folder name, which doubles as the CLI install sub-folder. */
  type: "components" | "hooks" | "utils" | "layouts" | "providers";
  /** Source path relative to apps/lib, e.g. "components/Select.tsx" (a folder for folder components). */
  path: string;
  /** External npm packages this item imports (normalized install names). */
  npmDependencies: string[];
  /** Internal deps as `type/name` refs, e.g. "utils/cn". */
  registryDependencies: string[];
  /**
   * `true` for a **folder component** (e.g. `components/FormBuilder/`) — a multi-file compound the
   * flat registry omits by design (the CLI copies the whole directory). Synthesized at load time by
   * scanning the source tree so the MCP can still install/read/relate these (FormBuilder, FormRenderer, …).
   */
  isFolder?: boolean;
  /** For a folder component: its source files, relative to apps/lib (e.g. "components/FormRenderer/detail.tsx"). */
  files?: string[];
}

// Mirrors scripts/bin/generateRegistry so a folder component's reported deps match a real install.
const TYPE_DIRS = ["components", "hooks", "utils", "layouts", "providers"];
const IGNORED_NPM = new Set(["react", "react-dom", "react/jsx-runtime"]);
const IMPORT_RE = /import\s+(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/g;

/** Normalize an import specifier to its installable npm package name. */
function toPackageName(spec: string): string {
  if (spec.startsWith("@")) {
    const [scope, name] = spec.split("/");
    return `${scope}/${name}`;
  }
  return spec.split("/")[0];
}

/** True for a bare (non-relative) module specifier. */
function isExternal(spec: string): boolean {
  return !spec.startsWith(".") && !spec.startsWith("/");
}

interface Registry {
  version: string;
  generatedBy: string;
  items: RegistryItem[];
}

export interface InstallPlan {
  /** Entry item plus every transitive internal dependency, in discovery order. */
  items: RegistryItem[];
  /** Union of all npm dependencies across the plan. */
  npmDependencies: string[];
}

// Registry item type -> the `torch-glare` subcommand that installs it.
const TYPE_TO_CLI_COMMAND: Record<RegistryItem["type"], string> = {
  components: "add",
  hooks: "hook",
  utils: "util",
  layouts: "layout",
  providers: "provider",
};

/** Return the first path that exists, else `fallback`. */
async function firstExisting(candidates: string[], fallback: string): Promise<string> {
  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // try next
    }
  }
  return fallback;
}

export class RegistryLoader {
  private items: RegistryItem[] = [];
  private byRef = new Map<string, RegistryItem>();
  private byName = new Map<string, RegistryItem[]>();
  private version = "";
  private sourceRoot = "";

  async load(): Promise<void> {
    // registry.json ships bundled in the package (mcp/registry.json) for npm
    // installs, or is read from the monorepo (apps/lib/registry.json) in dev.
    const registryPath = await firstExisting(
      [
        path.resolve(PACKAGE_ROOT, "registry.json"),
        path.resolve(MONOREPO_ROOT, "apps", "lib", "registry.json"),
      ],
      path.resolve(MONOREPO_ROOT, "apps", "lib", "registry.json"),
    );

    // Component source is resolved from a bundled copy (mcp/apps/lib) or the
    // monorepo source tree, mirroring the docs-dir fallback.
    this.sourceRoot = await firstExisting(
      [path.resolve(PACKAGE_ROOT, "apps", "lib"), path.resolve(MONOREPO_ROOT, "apps", "lib")],
      path.resolve(MONOREPO_ROOT, "apps", "lib"),
    );

    try {
      const raw = await fs.readFile(registryPath, "utf-8");
      const registry: Registry = JSON.parse(raw);
      this.version = registry.version;
      this.items = registry.items;
      for (const item of this.items) this.index(item);
    } catch {
      // Registry unavailable — install tools degrade gracefully to "not found".
    }

    // Fold in folder components (FormBuilder, FormRenderer, DataViews, …) the flat registry omits.
    await this.loadFolderComponents();
  }

  /** Add an item to the `byRef` + `byName` lookup maps. */
  private index(item: RegistryItem): void {
    this.byRef.set(`${item.type}/${item.name}`, item);
    const list = this.byName.get(item.name.toLowerCase()) ?? [];
    list.push(item);
    this.byName.set(item.name.toLowerCase(), list);
  }

  /**
   * Discover **folder components** — `components/<Name>/` directories with an `index.ts(x)` barrel that
   * aren't already flat registry items — and synthesize a `RegistryItem` for each (deps scanned from
   * their files, mirroring generateRegistry). Without this the MCP returns "not found" for the compound
   * components the docs tell users to install (FormBuilder, FormRenderer, …).
   */
  private async loadFolderComponents(): Promise<void> {
    const componentsDir = path.resolve(this.sourceRoot, "components");
    let entries: import("node:fs").Dirent[];
    try {
      entries = await fs.readdir(componentsDir, { withFileTypes: true });
    } catch {
      return; // no source tree available (shouldn't happen; degrade quietly)
    }

    const folderItems: RegistryItem[] = [];
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const name = entry.name;
      // Must have a barrel, and not collide with a flat item of the same name.
      const dirAbs = path.join(componentsDir, name);
      const hasBarrel =
        (await this.exists(path.join(dirAbs, "index.ts"))) ||
        (await this.exists(path.join(dirAbs, "index.tsx")));
      if (!hasBarrel) continue;
      if (this.byRef.has(`components/${name}`)) continue;

      const files = await this.listFolderFiles(dirAbs);
      const { npm, registry } = await this.scanFolderDeps(dirAbs, files, name);

      folderItems.push({
        name,
        type: "components",
        path: `components/${name}`,
        npmDependencies: [...npm].sort(),
        registryDependencies: [...registry].sort(),
        isFolder: true,
        files: files.map((f) => path.posix.join("components", name, f)),
      });
    }

    // Register first so folder→folder refs (FormRenderer → FormBuilder) resolve, then prune any dep
    // that names no known item (nested/self refs) — matching generateRegistry's final filter.
    for (const item of folderItems) {
      this.items.push(item);
      this.index(item);
    }
    const known = new Set(this.items.map((i) => `${i.type}/${i.name}`));
    for (const item of folderItems) {
      item.registryDependencies = item.registryDependencies.filter((ref) => known.has(ref));
    }
  }

  private async exists(p: string): Promise<boolean> {
    try {
      await fs.access(p);
      return true;
    } catch {
      return false;
    }
  }

  /** Recursively list a folder's `.ts/.tsx` source files, as paths relative to the folder. */
  private async listFolderFiles(dirAbs: string, prefix = ""): Promise<string[]> {
    const out: string[] = [];
    const entries = await fs.readdir(dirAbs, { withFileTypes: true });
    for (const e of entries) {
      const rel = prefix ? path.posix.join(prefix, e.name) : e.name;
      if (e.isDirectory()) {
        out.push(...(await this.listFolderFiles(path.join(dirAbs, e.name), rel)));
      } else if (
        /\.(ts|tsx)$/.test(e.name) &&
        !/-dev\.(ts|tsx)$/.test(e.name) &&
        !e.name.endsWith(".d.ts")
      ) {
        out.push(rel);
      }
    }
    return out;
  }

  /**
   * Scan a folder's files for imports → npm deps + internal registry refs. A relative import is
   * resolved against the source tree and collapsed to its top-level `type/name` item (so a nested
   * `../FormBuilder/header` becomes `components/FormBuilder`); imports within this folder are dropped.
   */
  private async scanFolderDeps(
    dirAbs: string,
    files: string[],
    selfName: string,
  ): Promise<{ npm: Set<string>; registry: Set<string> }> {
    const npm = new Set<string>();
    const registry = new Set<string>();
    const selfRef = `components/${selfName}`;

    for (const file of files) {
      const fileAbs = path.join(dirAbs, file);
      let content: string;
      try {
        content = await fs.readFile(fileAbs, "utf-8");
      } catch {
        continue;
      }
      IMPORT_RE.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = IMPORT_RE.exec(content)) !== null) {
        const spec = m[1];
        if (isExternal(spec)) {
          const pkg = toPackageName(spec);
          if (!IGNORED_NPM.has(pkg)) npm.add(pkg);
          continue;
        }
        // Relative → resolve to apps/lib-relative, collapse to the top-level `type/name` item.
        const abs = path.resolve(path.dirname(fileAbs), spec);
        const rel = path.relative(this.sourceRoot, abs).split(path.sep).join("/");
        const [type, first] = rel.split("/");
        if (!TYPE_DIRS.includes(type) || !first) continue;
        const ref = `${type}/${first}`;
        if (ref === selfRef) continue; // intra-folder import
        registry.add(ref);
      }
    }
    return { npm, registry };
  }

  getVersion(): string {
    return this.version;
  }

  /** Every registry item (components, hooks, utils, layouts, providers). */
  getAllItems(): RegistryItem[] {
    return this.items;
  }

  /**
   * Items that list `item` among their `registryDependencies` — i.e. what
   * composes/uses this one (the reverse of resolveInstallPlan's downward view).
   */
  getDependents(item: RegistryItem): RegistryItem[] {
    const ref = `${item.type}/${item.name}`;
    return this.items.filter((i) => i.registryDependencies.includes(ref));
  }

  /**
   * Look up a registry item by bare name (case-insensitive). If multiple types
   * share a name, a component wins.
   */
  getItemByName(name: string): RegistryItem | undefined {
    const list = this.byName.get(name.toLowerCase());
    if (!list || list.length === 0) return undefined;
    return list.find((i) => i.type === "components") ?? list[0];
  }

  getNpmDependencies(name: string): string[] {
    return this.getItemByName(name)?.npmDependencies ?? [];
  }

  /**
   * Resolve the transitive install plan for an item: the entry plus every
   * internal dependency it pulls in, and the union of npm dependencies.
   * Mirrors cli/src/shared/resolveInstallPlan.ts.
   */
  resolveInstallPlan(type: string, name: string): InstallPlan | null {
    const entry = this.byRef.get(`${type}/${name}`);
    if (!entry) return null;

    const items: RegistryItem[] = [];
    const npmDependencies = new Set<string>();
    const visited = new Set<string>();
    const stack = [`${type}/${name}`];

    while (stack.length) {
      const ref = stack.pop() as string;
      if (visited.has(ref)) continue;
      visited.add(ref);

      const item = this.byRef.get(ref);
      if (!item) continue; // dangling refs skipped defensively

      items.push(item);
      for (const dep of item.npmDependencies) npmDependencies.add(dep);
      for (const dep of item.registryDependencies) {
        if (!visited.has(dep)) stack.push(dep);
      }
    }

    return { items, npmDependencies: [...npmDependencies] };
  }

  /** The `torch-glare` command that installs this item. */
  addCommand(item: RegistryItem): string {
    return `npx torch-glare ${TYPE_TO_CLI_COMMAND[item.type]} ${item.name}`;
  }

  /** The module path (no extension) an item is imported from, e.g. `@/utils/cn`. */
  importPath(item: RegistryItem): string {
    return `@/${item.path.replace(/\.[jt]sx?$/, "")}`;
  }

  /**
   * The real named exports of an item's source file. The registry `name` is the
   * *file* name, which is NOT always an export (e.g. `utils/markdownParser`
   * exports `isMarkdown`/`parseMarkdownToBlocks`, not `markdownParser`), so a
   * naive `import { <name> }` would not compile. Returns value exports and
   * type-only exports separately. Falls back to `[name]` if the file can't be read.
   */
  async getExports(item: RegistryItem): Promise<{ values: string[]; types: string[] }> {
    const source = await this.readSource(item);
    if (!source) return { values: [item.name], types: [] };

    const values = new Set<string>();
    const types = new Set<string>();
    // `export const/function/class/enum Foo`, `export default function Foo`
    for (const m of source.matchAll(
      /export\s+(?:default\s+)?(?:async\s+)?(?:const|function|class|enum)\s+([A-Za-z_$][\w$]*)/g,
    )) {
      values.add(m[1]);
    }
    // `export type/interface Foo`
    for (const m of source.matchAll(/export\s+(?:type|interface)\s+([A-Za-z_$][\w$]*)/g)) {
      types.add(m[1]);
    }
    // `export { a, b, type C }`
    for (const m of source.matchAll(/export\s*\{([^}]*)\}/g)) {
      for (const raw of m[1].split(",")) {
        const part = raw.trim().replace(/\s+as\s+.*$/, "");
        if (!part) continue;
        if (part.startsWith("type ")) types.add(part.slice(5).trim());
        else values.add(part);
      }
    }
    return { values: [...values], types: [...types] };
  }

  /** For a folder component, the source-relative path of its `index.ts(x)` barrel (or null). */
  private async folderBarrel(item: RegistryItem): Promise<string | null> {
    for (const ext of ["index.ts", "index.tsx"]) {
      const rel = path.posix.join(item.path, ext);
      if (await this.exists(path.resolve(this.sourceRoot, rel))) return rel;
    }
    return null;
  }

  /** Read an item's source (shared by getSource/getExports). A folder component reads its barrel. */
  private async readSource(item: RegistryItem): Promise<string | null> {
    const rel = item.isFolder ? await this.folderBarrel(item) : item.path;
    if (!rel) return null;
    try {
      return await fs.readFile(path.resolve(this.sourceRoot, rel), "utf-8");
    } catch {
      return null;
    }
  }

  /**
   * Read the actual source the CLI copies into a consumer's project. A flat item returns its file; a
   * folder component returns its barrel prefixed with a file manifest. `getSource("Folder/file")`
   * (e.g. `"FormRenderer/detail"`) fetches a single file inside a folder component.
   */
  async getSource(name: string): Promise<{ path: string; code: string } | null> {
    // Folder sub-path form: "FormRenderer/detail" → components/FormRenderer/detail.tsx
    if (name.includes("/")) {
      const slash = name.indexOf("/");
      const folder = name.slice(0, slash);
      const sub = name.slice(slash + 1);
      const item = this.getItemByName(folder);
      if (item?.isFolder && sub) {
        for (const cand of [sub, `${sub}.tsx`, `${sub}.ts`]) {
          const rel = path.posix.join(item.path, cand);
          try {
            const code = await fs.readFile(path.resolve(this.sourceRoot, rel), "utf-8");
            return { path: rel, code };
          } catch {
            // try next extension
          }
        }
      }
      return null;
    }

    const item = this.getItemByName(name);
    if (!item) return null;
    const code = await this.readSource(item);
    if (code === null) return null;

    if (item.isFolder) {
      const barrel = await this.folderBarrel(item);
      const files = item.files ?? [];
      const example = files.find((f) => !/(^|\/)index\.tsx?$/.test(f));
      const exampleSub = example
        ? `${item.name}/${example.slice(`components/${item.name}/`.length).replace(/\.tsx?$/, "")}`
        : undefined;
      const manifest =
        `// "${item.name}" is a folder component (${files.length} files) — its public barrel is shown below.\n` +
        (exampleSub
          ? `// Fetch one file with get-component-source "${exampleSub}" (any file listed).\n`
          : "") +
        files.map((f) => `//   - ${f}`).join("\n") +
        `\n\n`;
      return { path: barrel ?? item.path, code: manifest + code };
    }
    return { path: item.path, code };
  }
}
