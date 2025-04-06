import * as fs from "fs";

/**
 * Check if a file exists at the specified path.
 * @param {string} targetPath - Path to check for file existence.
 * @returns {boolean} - True if file exists, false otherwise.
 */
export function isFileExists(targetPath: string): boolean {
    return fs.existsSync(targetPath);
}
