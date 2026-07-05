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
  /** Source path relative to apps/lib, e.g. "components/Select.tsx". */
  path: string;
  /** External npm packages this item imports (normalized install names). */
  npmDependencies: string[];
  /** Internal deps as `type/name` refs, e.g. "utils/cn". */
  registryDependencies: string[];
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
      [
        path.resolve(PACKAGE_ROOT, "apps", "lib"),
        path.resolve(MONOREPO_ROOT, "apps", "lib"),
      ],
      path.resolve(MONOREPO_ROOT, "apps", "lib"),
    );

    try {
      const raw = await fs.readFile(registryPath, "utf-8");
      const registry: Registry = JSON.parse(raw);
      this.version = registry.version;
      this.items = registry.items;
      for (const item of this.items) {
        this.byRef.set(`${item.type}/${item.name}`, item);
        const list = this.byName.get(item.name.toLowerCase()) ?? [];
        list.push(item);
        this.byName.set(item.name.toLowerCase(), list);
      }
    } catch {
      // Registry unavailable — install tools degrade gracefully to "not found".
    }
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
    for (const m of source.matchAll(/export\s+(?:default\s+)?(?:async\s+)?(?:const|function|class|enum)\s+([A-Za-z_$][\w$]*)/g)) {
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

  /** Read an item's source file (shared by getSource/getExports). */
  private async readSource(item: RegistryItem): Promise<string | null> {
    try {
      return await fs.readFile(path.resolve(this.sourceRoot, item.path), "utf-8");
    } catch {
      return null;
    }
  }

  /** Read the actual source file the CLI copies into a consumer's project. */
  async getSource(name: string): Promise<{ path: string; code: string } | null> {
    const item = this.getItemByName(name);
    if (!item) return null;
    const code = await this.readSource(item);
    return code === null ? null : { path: item.path, code };
  }
}
