import { installDependencies } from "./installDependencies.js";
import fs from "fs";
import path from "path";

/**
 * Copy a component (directory or file) and install its dependencies.
 * @param {string} source - The source path of the component.
 * @param {string} target - The target path of the component.
 */
export function copyComponentsRecursively(source: string, target: string): void {
    if (fs.lstatSync(source).isDirectory()) {
        copyDirectorySync(source, target);
    } else {
        let finalTarget = target;

        if (fs.existsSync(target) && fs.lstatSync(target).isDirectory()) {
            finalTarget = path.join(target, path.basename(source));
        }

        fs.copyFileSync(source, finalTarget);
        installDependencies(source);
    }
}
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

    const items = fs.readdirSync(source, { withFileTypes: true });
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