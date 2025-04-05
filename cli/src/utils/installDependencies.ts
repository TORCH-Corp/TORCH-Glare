import { execSync } from "child_process";
import { getCurrentInstalledDependencies } from "./getCurrentInstalledDependencies.js";
import { detectPackageManager } from "./detectPackageManager.js";
import { getDependenciesToInstall } from "./getDependenciesToInstall.js";
import { getInstallCommand } from "./getInstallCommand.js";

/**
 * Install dependencies for a component.
 * @param {string} componentPath - Path to the component file.
 */
export function installDependencies(
    componentPath: string,
): void {
    const { depsNames } = getCurrentInstalledDependencies();
    const dependenciesToInstall = getDependenciesToInstall(
        componentPath,
        depsNames,
    );

    if (dependenciesToInstall.size > 0) {
        const packageManager = detectPackageManager();
        const installCommand = getInstallCommand(packageManager, dependenciesToInstall);

        console.log(
            `📦 Installing missing dependencies using ${packageManager}:`,
            [...dependenciesToInstall].join(", ")
        );

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
