import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { detectPackageManager } from "./detectPackageManager.js";
import { getCurrentInstalledDependencies } from "./getCurrentInstalledDependencies.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UTILS_TEMPLATE_DIR = path.resolve(__dirname, "../../../apps/lib/utils");

const BASE_UTILS = ["cn.ts", "types.ts"];

const BASE_DEPENDENCIES = [
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
];

/**
 * Install base utility files (cn.ts, types.ts) and their dependencies.
 */
export function installBaseUtils(basePath: string): void {
    const normalizedPath = basePath.replace("@/", "").replace(/^\.\//, "");
    const utilsTargetDir = path.join(process.cwd(), normalizedPath, "utils");

    // Ensure target directory exists
    if (!fs.existsSync(utilsTargetDir)) {
        fs.mkdirSync(utilsTargetDir, { recursive: true });
    }

    // Copy base utility files
    for (const utilFile of BASE_UTILS) {
        const source = path.join(UTILS_TEMPLATE_DIR, utilFile);
        const target = path.join(utilsTargetDir, utilFile);

        if (!fs.existsSync(source)) {
            console.log(`  ⚠️  Template not found: ${utilFile}`);
            continue;
        }

        if (fs.existsSync(target)) {
            console.log(`  ⏭️  ${utilFile} already exists, skipping`);
            continue;
        }

        fs.copyFileSync(source, target);
        console.log(`  ✅ Installed ${utilFile}`);
    }

    // Install npm dependencies
    installMissingDependencies();
}

/**
 * Install base npm dependencies (clsx, tailwind-merge, cva) if missing.
 */
function installMissingDependencies(): void {
    const { depsNames } = getCurrentInstalledDependencies();
    const missing = BASE_DEPENDENCIES.filter(dep => !depsNames.has(dep));

    if (missing.length === 0) {
        console.log("  ✅ Base dependencies already installed");
        return;
    }

    const packageManager = detectPackageManager();
    const depsStr = missing.map(dep => `${dep}@latest`).join(" ");

    let installCommand: string;
    switch (packageManager) {
        case "pnpm":
            installCommand = `pnpm add ${depsStr}`;
            break;
        case "yarn":
            installCommand = `yarn add ${depsStr}`;
            break;
        case "bun":
            installCommand = `bun add ${depsStr}`;
            break;
        default:
            installCommand = `npm install ${depsStr}`;
    }

    try {
        console.log(`  📦 Installing: ${missing.join(", ")}`);
        execSync(installCommand, { stdio: "inherit" });
        console.log("  ✅ Base dependencies installed");
    } catch (error: any) {
        console.error("  ❌ Error installing base dependencies:", error.message);
    }
}
