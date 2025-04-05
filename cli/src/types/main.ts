export interface Config {
    path: string;
    // Add other properties as needed
}

export interface DependenciesInfo {
    depsNames: Set<string>;
    depsNamesAndVersions: Record<string, string>;
}
