import path from "path";
import { Config } from "../types/main.js";

/**
 * Get the source and target paths for the component.
 * @param {string} component - The name of the component.
 * @param {object} config - Configuration object.
 * @param {string} templatesDir - The path to the templates directory.
 * @param {string} saveFolderName - The name of the folder to save the component.
 * @returns {object} - Object containing source and target directory paths.
 */
export function getInstallPaths(
    component: string,
    config: Config,
    templatesDir: string,
    saveFolderName: string
): { source: string; targetDir: string } {
    const source = path.join(templatesDir, `${component}`);
    const normalizedPath = config.path.replace("@/", "");
    const targetDir = path.join(process.cwd(), normalizedPath, saveFolderName);
    return { source, targetDir };
}