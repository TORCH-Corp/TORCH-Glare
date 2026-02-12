import fs from "fs";
import path from "path";
import { Framework } from "./detectFramework.js";

export interface Aliases {
    components: string;
    hooks: string;
    utils: string;
    providers: string;
    layouts: string;
}

/**
 * Resolve the base path and aliases for the project.
 * Parses tsconfig.json/jsconfig.json to find path aliases,
 * then builds the aliases map for each category.
 */
export function resolveAliases(framework: Framework): { basePath: string; aliases: Aliases; aliasPrefix: string } {
    const { basePath, aliasPrefix } = resolveBasePath(framework);

    // Store actual filesystem paths (not alias paths) so getInstallPaths resolves correctly
    const normalizedBase = basePath.replace(/\/$/, "");
    const aliases: Aliases = {
        components: `${normalizedBase}/components`,
        hooks: `${normalizedBase}/hooks`,
        utils: `${normalizedBase}/utils`,
        providers: `${normalizedBase}/providers`,
        layouts: `${normalizedBase}/layouts`,
    };

    return { basePath, aliases, aliasPrefix };
}

/**
 * Resolve the base path from tsconfig paths or directory structure.
 */
function resolveBasePath(framework: Framework): { basePath: string; aliasPrefix: string } {
    // Try to parse tsconfig.json or jsconfig.json for path aliases
    const tsconfigPath = findTsConfig();
    if (tsconfigPath) {
        const tsconfig = parseTsConfig(tsconfigPath);
        const paths = tsconfig?.compilerOptions?.paths;

        if (paths) {
            // Look for @/* alias
            const aliasKey = Object.keys(paths).find(key => key.endsWith("/*"));
            if (aliasKey) {
                const aliasTargets = paths[aliasKey];
                if (aliasTargets && aliasTargets.length > 0) {
                    const target = aliasTargets[0].replace("/*", "/");
                    const prefix = aliasKey.replace("/*", "/");
                    return { basePath: target, aliasPrefix: prefix };
                }
            }
        }
    }

    // Fallback: detect based on directory structure
    if (fs.existsSync(path.join(process.cwd(), "src"))) {
        return { basePath: "./src/", aliasPrefix: "./src/" };
    }

    // Next.js without src/ directory
    if (framework === "next") {
        return { basePath: "./", aliasPrefix: "./" };
    }

    return { basePath: "./src/", aliasPrefix: "./src/" };
}

/**
 * Find tsconfig.json or jsconfig.json in the project root.
 */
function findTsConfig(): string | null {
    const candidates = ["tsconfig.json", "jsconfig.json"];
    for (const candidate of candidates) {
        const fullPath = path.join(process.cwd(), candidate);
        if (fs.existsSync(fullPath)) {
            return fullPath;
        }
    }
    return null;
}

/**
 * Parse tsconfig.json, handling comments and trailing commas.
 */
function parseTsConfig(filePath: string): any {
    try {
        const content = fs.readFileSync(filePath, "utf-8");
        // Strip single-line comments and trailing commas for JSON.parse
        const cleaned = content
            .replace(/\/\/.*$/gm, "")
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/,(\s*[}\]])/g, "$1");
        return JSON.parse(cleaned);
    } catch {
        return null;
    }
}

/**
 * Resolve an alias path to a filesystem path.
 * e.g. "@/components" with basePath "./lib/" → "./lib/components"
 */
export function resolveAliasToPath(aliasPath: string, basePath: string): string {
    // Handle @/ prefix
    if (aliasPath.startsWith("@/")) {
        return path.join(basePath, aliasPath.slice(2));
    }
    // Handle ./ prefix
    if (aliasPath.startsWith("./")) {
        return aliasPath;
    }
    return path.join(basePath, aliasPath);
}
