import path from "path";
import { DependenciesInfo } from "../types/main";
import * as fs from "fs";
/**
 * Get the installed dependencies from the project's package.json.
 * @returns {Set<string>} - Set of installed dependencies.
 */
export function getCurrentInstalledDependencies(): DependenciesInfo {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    if (!fs.existsSync(packageJsonPath)) {
        console.error("❌ No package.json found. Run `npm init` or `yarn init` first.");
        process.exit(1);
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    const depsNames = new Set([
        ...Object.keys(packageJson.dependencies || {}),
        ...Object.keys(packageJson.devDependencies || {}),
    ]);

    const depsNamesAndVersions = {
        ...(packageJson.dependencies || {}),
        ...(packageJson.devDependencies || {}),
    };
    return { depsNames, depsNamesAndVersions };
}
