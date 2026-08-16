import { execSync } from "child_process";
import { getCurrentInstalledDependencies } from "./getCurrentInstalledDependencies.js";
import { detectPackageManager } from "./detectPackageManager.js";
import { getDependenciesAndInstallNestedComponents } from "./getDependenciesAndInstallNestedComponents.js";
import { getInstallCommand } from "./getInstallCommand.js";

/**
 * Install a set of npm packages, skipping any the project already has.
 *
 * Split out from `installDependencies` so the registry-driven installer can call it **once** with
 * the union of a whole plan's packages. It used to be reachable only as a side effect of copying a
 * file, which meant a 35-file component ran it 35 times.
 *
 * @returns the packages actually installed.
 */
export function installNpmPackages(packages: Iterable<string>): string[] {
    const { depsNames } = getCurrentInstalledDependencies();
    const missing = new Set<string>();
    for (const spec of packages) {
        // A spec may carry a range (`react-hook-form@^7.54.2`); the installed check is by name.
        // The leading `@` of a scoped package is not a separator.
        const at = spec.lastIndexOf("@");
        const name = at > 0 ? spec.slice(0, at) : spec;
        if (!depsNames.has(name)) missing.add(spec);
    }

    if (missing.size === 0) return [];

    const packageManager = detectPackageManager();
    const installCommand = getInstallCommand(packageManager, missing);

    console.log(
        `📦 Installing ${missing.size} missing package(s) using ${packageManager}:`,
        [...missing].join(", "),
    );

    try {
        execSync(installCommand, { stdio: "inherit" });
        return [...missing];
    } catch (error) {
        console.error("❌ Error installing dependencies:", (error as Error).message);
        return [];
    }
}

/**
 * Legacy path: resolve a component's dependencies by scanning its imports.
 *
 * Only reached now for an item that is **not** in `registry.json` — something added to `apps/lib`
 * before `pnpm run registry` was re-run. Everything registered goes through `installFromPlan`,
 * which resolves the whole graph up front instead of discovering it one file at a time.
 *
 * @param {string} componentPath - Path to the component file.
 */
export function installDependencies(componentPath: string): void {
    const { depsNames } = getCurrentInstalledDependencies();

    const dependenciesToInstall = getDependenciesAndInstallNestedComponents(
        componentPath,
        depsNames,
    );

    if (dependenciesToInstall.size > 0) {
        installNpmPackages(dependenciesToInstall);
    }
}
