import * as fs from "fs";
import path from "path";

/**
 * Detect the package manager used in the project.
 * @returns {string} - The detected package manager (pnpm, yarn, npm, bun, etc).
 */
export function detectPackageManager(): string {
    if (fs.existsSync(path.join(process.cwd(), "pnpm-lock.yaml"))) return "pnpm";
    if (fs.existsSync(path.join(process.cwd(), "yarn.lock"))) return "yarn";
    if (fs.existsSync(path.join(process.cwd(), "package-lock.json"))) return "npm";
    if (fs.existsSync(path.join(process.cwd(), "bun.lockb"))) return "bun";
    if (fs.existsSync(path.join(process.cwd(), ".yarnrc.yml"))) return "yarn";
    return "npm"; // Default to npm if no lock file is found
}

