import * as fs from "fs";
import path from "path";
import { installDependencies } from "./installDependencies.js";

/**
 * Copy a directory and its contents recursively.
 * @param {string} source - Source directory path.
 * @param {string} target - Target directory path.
 */
export function copyDirectorySync(
    source: string,
    target: string,
): void {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    const items = require('fs').readdirSync(source, { withFileTypes: true });
    for (const item of items) {
        const sourcePath = path.join(source, item.name);
        const targetPath = path.join(target, item.name);

        if (item.isDirectory()) {
            copyDirectorySync(sourcePath, targetPath);
        } else {
            fs.copyFileSync(sourcePath, targetPath);
            installDependencies(sourcePath);
        }
    }
} 