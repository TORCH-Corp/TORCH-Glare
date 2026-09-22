export interface Config {
    /** Where components are installed, e.g. "./src/app/components/ui". A leading "@/" is stripped. */
    path: string;
}

export interface DependenciesInfo {
    depsNames: Set<string>;
    depsNamesAndVersions: Record<string, string>;
}

/** A single entry in the registry index. */
export interface RegistryItem {
    name: string;
    /** Folder name, which doubles as the CLI install sub-folder. */
    type: "components" | "hooks" | "utils" | "layouts" | "providers";
    /** Path relative to the library root, e.g. "components/Select.tsx". May be a directory. */
    path: string;
    /**
     * Every source file this item is made of, relative to the library root — the expansion of
     * `path` when it is a directory (`components/DataViews` is 34 files).
     *
     * Optional only because a registry generated before this field existed does not carry it.
     */
    files?: string[];
    /** External npm packages this item imports (normalized install names). */
    npmDependencies: string[];
    /** Other registry items it depends on, as "type/name" refs. */
    registryDependencies: string[];
}

/** One file of a hosted registry item, with its content inlined. */
export interface RegistryFile {
    /** Path relative to the library root, e.g. "components/DataViews/index.ts". */
    path: string;
    /** Where it installs, relative to the configured `path`. Equal to `path` for this registry. */
    target: string;
    content: string;
}

/**
 * A single item as served at `<registry>/<type>/<name>.json` — self-contained, so a consumer
 * needs no access to the library source tree.
 */
export interface RegistryItemPayload {
    version: string;
    name: string;
    type: RegistryItem["type"];
    /** npm packages, pinned inline (`react-hook-form@^7.54.2`). */
    dependencies: string[];
    registryDependencies: string[];
    files: RegistryFile[];
}

export interface Registry {
    version: string;
    generatedBy: string;
    /**
     * The version range the library builds each package against, e.g.
     * `{"@tanstack/react-table": "^8.21.3"}`. Installing unpinned means an upstream major can
     * break copied source the day it lands.
     */
    npmVersions?: Record<string, string>;
    items: RegistryItem[];
}

/** Fully resolved set of work needed to install one item. */
export interface InstallPlan {
    /** All items (entry + transitive internal deps) that must be copied. */
    items: RegistryItem[];
    /** Union of every item's npm dependencies. */
    npmDependencies: Set<string>;
}
