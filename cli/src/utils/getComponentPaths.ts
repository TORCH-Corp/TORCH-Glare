import path from "path";
import { Config } from "../types/main";

/**
 * Get the source and target paths for the component.
 * @param {string} component - The name of the component.
 * @param {object} config - Configuration object.
 * @returns {object} - Object containing source and target directory paths.
 */
export function getComponentPaths(
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