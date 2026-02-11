import path from "path";
import { Config, Category } from "../types/main.js";

/**
 * Get the source and target paths for a file.
 * Supports both new aliases-based config and legacy path-based config.
 * @param {string} fileName - The name of the file.
 * @param {Config} config - Configuration object.
 * @param {string} templatesDir - The path to the templates directory.
 * @param {Category} category - The category (components, hooks, utils, providers, layouts).
 * @returns {object} - Object containing source and target directory paths.
 */
export function getInstallPaths(
    fileName: string,
    config: Config,
    templatesDir: string,
    category: Category
): { source: string; targetDir: string } {
    const source = path.join(templatesDir, `${fileName}`);

    let targetDir: string;

    if (config.aliases && config.aliases[category]) {
        // New format: resolve from aliases
        const aliasPath = config.aliases[category];
        const normalizedPath = aliasPath.replace("@/", "").replace(/^\.\//, "");
        targetDir = path.join(process.cwd(), normalizedPath);
    } else {
        // Legacy format: use path + category folder
        const normalizedPath = (config.path || "./").replace("@/", "");
        targetDir = path.join(process.cwd(), normalizedPath, category);
    }

    return { source, targetDir };
}
