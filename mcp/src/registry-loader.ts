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

  /** The import statement for the copied item, e.g. `@/components/Button`. */
  importStatement(item: RegistryItem): string {
    const noExt = item.path.replace(/\.[jt]sx?$/, "");
    return `import { ${item.name} } from "@/${noExt}";`;
  }

  /** Read the actual source file the CLI copies into a consumer's project. */
  async getSource(name: string): Promise<{ path: string; code: string } | null> {
    const item = this.getItemByName(name);
    if (!item) return null;
    const abs = path.resolve(this.sourceRoot, item.path);
    try {
      const code = await fs.readFile(abs, "utf-8");
      return { path: item.path, code };
    } catch {
      return null;
    }
  }
}
