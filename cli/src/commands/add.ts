import path from "path";
import fs from "fs";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import { ensureDirectoryExists } from "../shared/ensureDirectoryExists.js";
import { getInstallPaths } from "../shared/getInstallPaths.js";
import { Config } from "../types/main.js";
import { copyComponentsRecursively } from "../shared/copyComponentsRecursively.js";
import { getAvailableFiles } from "../shared/getAvailableFiles.js";
import { isFileExists } from "../shared/isFileExists.js";
import { getConfig } from "../shared/getConfig.js";
import { CONFIG_FILE } from "./init.js";

const __filename = fileURLToPath(import.meta.url);

// Get the current file and directory paths
const __dirname = path.dirname(__filename);

// Define the path to the templates directory
const templatesDir = path.resolve(__dirname, "../../../apps/lib/components");



/**
 * Main function to add a component and its dependencies.
 * @param {string} component - The name of the component to add.
 * @param {boolean} replace - Whether to replace the existing component.
 */
export async function add(component?: string, replace: boolean = false): Promise<void> {
    const targetFile = getConfig(CONFIG_FILE) as Config;
    const availableComponents = getAvailableFiles(templatesDir);

    // If no component is provided, prompt the user to select one
    if (!component) {
        component = await promptComponentSelection(availableComponents);
    }

    // Resolve user input to an actual entry — accepts "Button", "Button.tsx", or "DataViews" (folder).
    const resolved = resolveComponentEntry(component, availableComponents, templatesDir);
    if (!resolved) {
        console.error(`❌ Component "${component}" not found.`);
        return;
    }

    const { source, targetDir } = getInstallPaths(resolved, targetFile, templatesDir, "components");

    // Check if component already exists
    if (isFileExists(targetDir, resolved) && !replace) {
        console.log(`⚠️ Component "${resolved}" already exists.`);
        return;
    }

    // Ensure the target directory exists
    // if the directory is not exists, create it

    ensureDirectoryExists(targetDir);

    // Copy the component (directory or file) and install dependencies
    copyComponentsRecursively(source, targetDir);

    console.log(`✅ ${resolved} has been added to ${targetFile.path}!`);
}


/**
 * Resolve a user-provided component name to an actual entry in the templates
 * directory. Tries (in order):
 *   1. exact match (e.g. "Button.tsx" or "DataViews")
 *   2. with `.tsx` suffix (e.g. user typed "Button")
 *   3. with `.ts`  suffix  (for non-JSX modules)
 * Returns the matching entry name, or null if nothing matches.
 */
function resolveComponentEntry(
    input: string,
    available: string[],
    dir: string,
): string | null {
    if (available.includes(input)) return input;
    const candidates = [`${input}.tsx`, `${input}.ts`];
    for (const c of candidates) {
        if (available.includes(c)) return c;
    }
    // Last-ditch: see if it exists on disk even if `getAvailableFiles` missed it.
    if (fs.existsSync(path.join(dir, input))) return input;
    return null;
}


/**
 * Prompt the user to select a component from a list.
 * @param {string[]} availableComponents - Array of available components.
 * @returns {string} - The selected component.
 */
async function promptComponentSelection(availableComponents: string[]): Promise<string> {
    const { selectedComponent } = await inquirer.prompt([
        {
            type: "list",
            name: "selectedComponent",
            message: "Which component would you like to add?",
            choices: availableComponents,
        },
    ]);
    return selectedComponent;
}
