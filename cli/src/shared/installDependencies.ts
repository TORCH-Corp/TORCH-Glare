import { execSync } from "child_process";
import { getCurrentInstalledDependencies } from "./getCurrentInstalledDependencies.js";
import { detectPackageManager } from "./detectPackageManager.js";
import { getDependenciesAndInstallNestedComponents } from "./getDependenciesAndInstallNestedComponents.js";
import { getInstallCommand } from "./getInstallCommand.js";

/**
 * Install dependencies for a component.
 * @param {string} componentPath - Path to the component file.
 */
export function installDependencies(
    componentPath: string,
): void {
    // get current installed dependencies on your package.json
    const { depsNames } = getCurrentInstalledDependencies();

    // get dependencies used in the component and it's nested components.
    // also copy component to the target directory with it's nested components.
    const dependenciesToInstall = getDependenciesAndInstallNestedComponents(
        componentPath,
        depsNames,
    );

    // if there are dependencies to install, install them
    if (dependenciesToInstall.size > 0) {
        // detect package manager
        const packageManager = detectPackageManager();
        // get full install command
        const installCommand = getInstallCommand(packageManager, dependenciesToInstall);

        console.log(
            `📦 Installing missing dependencies using ${packageManager}:`,
            [...dependenciesToInstall].join(", ")
        );

        // execute install command
        try {
            execSync(installCommand, { stdio: "inherit" });
            console.log("✅ Dependencies installed successfully.");
        } catch (error) {
            console.error("❌ Error installing dependencies:", (error as Error).message);
        }
    } else {
        console.log("✅ All dependencies are already installed.");
    }
}
