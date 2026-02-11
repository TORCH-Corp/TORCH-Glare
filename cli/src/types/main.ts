export interface Aliases {
    components: string;
    hooks: string;
    utils: string;
    providers: string;
    layouts: string;
}

export interface Config {
    // Legacy support
    path?: string;
    // New fields
    framework?: "next" | "vite" | "react" | "unknown";
    tailwind?: {
        version: 3 | 4;
        config: string;
        css: string;
    };
    aliases?: Aliases;
}

export type Category = "components" | "hooks" | "utils" | "providers" | "layouts";

export interface DependenciesInfo {
    depsNames: Set<string>;
    depsNamesAndVersions: Record<string, string>;
}
