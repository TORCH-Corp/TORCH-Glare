import * as fs from "fs";
import { addUtil } from "../commands/utils.js";
import { addHook } from "../commands/hook.js";
import { add } from "../commands/add.js";

/**
 * Extract dependencies from a component file.
 * @param {string} componentPath - Path to the component file.
 * @param {Set<string>} installedDependencies - Set of installed dependencies.
 * @param {function} addFunction - Function to make add operation
 * @returns {Set<string>} - Set of dependencies to install.
 */

export function getDependenciesToInstall(
    componentPath: string,
    installedDependencies: Set<string>,
): Set<string> {
    const componentContent = fs.readFileSync(componentPath, "utf-8");
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    const dependenciesToInstall = new Set<string>();

    let match;
    while ((match = importRegex.exec(componentContent)) !== null) {
        const moduleName = match[1];

        if (!moduleName.startsWith(".") && !installedDependencies.has(moduleName)) {
            dependenciesToInstall.add(moduleName);
        }

        // install required utils.
        else if (
            moduleName.startsWith("../utils") &&
            !installedDependencies.has(moduleName)
        ) {
            addUtil(moduleName.slice(9) + ".ts");
        }

        // install required hooks.
        else if (
            moduleName.startsWith("../hooks") &&
            !installedDependencies.has(moduleName)
        ) {
            addHook(moduleName.slice(9) + ".tsx");
        }
        // install required components
        else if (
            moduleName.startsWith("./") ||
            !moduleName.startsWith("../components") &&
            !installedDependencies.has(moduleName)
        ) {
            add(moduleName.slice(2) + ".tsx");
        }
        // install required for layouts components
        else if (
            moduleName.startsWith("../components") &&
            !installedDependencies.has(moduleName)
        ) {
            add(moduleName.slice(14) + ".tsx");
        }
    }

    return dependenciesToInstall;
}