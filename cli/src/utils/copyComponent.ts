import { installDependencies } from "../utils/installDependencies.ts";
import fs from "fs";
import { copyDirectorySync } from "./copyDirectorySync.ts";

/**
 * Copy a component (directory or file) and install its dependencies.
 * @param {string} source - The source path of the component.
 * @param {string} target - The target path of the component.
 */
export function copyComponent(
    source: string,
    target: string,
): void {
    if (fs.lstatSync(source).isDirectory()) {
        copyDirectorySync(source, target);
    } else {
        fs.copyFileSync(source, target);
        installDependencies(source);
    }
}