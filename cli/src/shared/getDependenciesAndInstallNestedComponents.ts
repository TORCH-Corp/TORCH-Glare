import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadRegistry } from "./loadRegistry.js";
import { resolveInstallPlan } from "./resolveInstallPlan.js";
import { getConfig } from "./getConfig.js";
import { CONFIG_FILE } from "../commands/init.js";
import { Config } from "../types/main.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Library source root that ships with the package (contains components/, hooks/, ...).
const LIB_DIR = path.resolve(__dirname, "../../../apps/lib");

/**
 * Given a just-copied source file, use the registry to (a) copy every internal dependency
 * (nested components/hooks/utils/...) into the consumer's project and (b) return the set of
 * npm dependencies that still need installing.
 *
 * This reads the generated registry.json instead of re-parsing import statements, so the
 * dependency closure is deterministic and complete (including side-effect/CSS imports).
 *
 * @param {string} componentPath - Absolute path to the source file inside LIB_DIR.
 * @param {Set<string>} installedDependencies - npm packages already present in the project.
 * @returns {Set<string>} - npm dependencies to install.
 */
export function getDependenciesAndInstallNestedComponents(
    componentPath: string,
    installedDependencies: Set<string>
): Set<string> {
    const type = path.basename(path.dirname(componentPath));
    const name = path.basename(componentPath).replace(/\.(ts|tsx)$/, "");

    const plan = resolveInstallPlan(loadRegistry(), type, name);
    const dependenciesToInstall = new Set<string>();

    // Not a registry item (nothing to resolve) — nothing to install.
    if (!plan) return dependenciesToInstall;

    const config = getConfig(CONFIG_FILE) as Config;
    const normalizedPath = config.path.replace("@/", "");

    for (const item of plan.items) {
        // The entry file itself is copied by the caller; only fetch its dependencies here.
        if (item.type === type && item.name === name) continue;

        const source = path.join(LIB_DIR, item.path);
        const targetDir = path.join(process.cwd(), normalizedPath, item.type);
        const target = path.join(targetDir, path.basename(item.path));

        // Never clobber a file the user may have edited.
        if (fs.existsSync(target)) continue;

        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
        fs.copyFileSync(source, target);
        console.log(`  ↳ added ${item.type}/${path.basename(item.path)}`);
    }

    for (const dep of plan.npmDependencies) {
        if (!installedDependencies.has(dep)) dependenciesToInstall.add(dep);
    }

    return dependenciesToInstall;
}
