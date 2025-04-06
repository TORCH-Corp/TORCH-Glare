/**
 * Ensure the target directory exists.
 * @param {string} targetDir - The target directory path.
 */
import * as fs from 'fs';

export function ensureDirectoryExists(targetDir: string): void {
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
}