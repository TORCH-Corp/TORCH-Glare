import * as fs from "fs";
import path from "path";

/**
 * Get a list of available components from the templates directory.
 * @param {string} templatesDir - Path to the templates directory.
 * @returns {string[]} - Array of component names.
 */
export function getAvailableFiles(templatesDir: string): string[] {
    return fs
        .readdirSync(templatesDir)
        .map((file) => path.basename(file))
        // "-dev" files are work-in-progress and excluded from the published package,
        // so the CLI must never offer them.
        .filter((file) => !/-dev\.(ts|tsx)$/.test(file));
}
