export interface Config {
    path: string;
    // Add other properties as needed
}

export interface DependenciesInfo {
    depsNames: Set<string>;
    depsNamesAndVersions: Record<string, string>;
}

/** A single entry in apps/lib/registry.json. */
export interface RegistryItem {
    name: string;
    /** Folder name, which doubles as the CLI install sub-folder. */
    type: "components" | "hooks" | "utils" | "layouts" | "providers";
    /** Source path relative to apps/lib, e.g. "components/Select.tsx". */
    path: string;
    /** External npm packages this item imports (normalized install names). */
    npmDependencies: string[];
    /** Other registry items it depends on, as "type/name" refs. */
    registryDependencies: string[];
}

export interface Registry {
    version: string;
    generatedBy: string;
    items: RegistryItem[];
}

/** Fully resolved set of work needed to install one item. */
export interface InstallPlan {
    /** All items (entry + transitive internal deps) that must be copied. */
    items: RegistryItem[];
    /** Union of every item's npm dependencies. */
    npmDependencies: Set<string>;
}
