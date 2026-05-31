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
        // If target already exists as a directory, nest the source folder
        // inside it (so `add DataViews` ends up at ./components/DataViews/,
        // not flattened into ./components/). Otherwise the target IS the
        // destination directory (legacy behavior).
        const finalTarget =
            fs.existsSync(target) && fs.lstatSync(target).isDirectory()
                ? path.join(target, path.basename(source))
                : target;
        copyDirectorySync(source, finalTarget);
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
        } else if (isCopyableFile(item.name)) {
            fs.copyFileSync(sourcePath, targetPath);
            installDependencies(sourcePath);
        }
    }
}

/**
 * Decide whether a file should be copied into the user's project. Skips
 * documentation/meta files that live alongside source for maintainers but add
 * noise to a consumer's drop-in (e.g. ARCHITECTURE.md inside a component folder).
 */
function isCopyableFile(fileName: string): boolean {
    return !/\.(md|mdx)$/i.test(fileName);
} 