import * as fs from "fs";

/**
 * Check if a component exists at the specified path.
 * @param {string} targetPath - Path to check for component existence.
 * @returns {boolean} - True if component exists, false otherwise.
 */
export function isComponentExists(targetPath: string): boolean {
    return fs.existsSync(targetPath);
}
