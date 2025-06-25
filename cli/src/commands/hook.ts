import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";
import { ensureDirectoryExists } from "../shared/ensureDirectoryExists.js";
import { getInstallPaths } from "../shared/getInstallPaths.js";
import { copyComponentsRecursively } from "../shared/copyComponentsRecursively.js";
import { getConfig } from "../shared/getConfig.js";
import { CONFIG_FILE } from "./init.js";
import { Config } from "../types/main.js";
import { isFileExists } from "../shared/isFileExists.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the hooks templates directory
const hooksTemplatesDir: string = path.resolve(__dirname, "../../../apps/lib/hooks");

/**
 * Main function to add a hook and its dependencies.
 * @param {string} hook - The name of the hook to add.
 * @param {boolean} replace - Whether to replace the existing hook.
 */
export async function addHook(hook?: string, replace: boolean = false): Promise<void> {
    const targetFile = getConfig(CONFIG_FILE) as Config;
    const availableHooks: string[] = getAvailableHooks(hooksTemplatesDir);

    // If no hook is provided, prompt the user to select one
    if (!hook) {
        hook = await promptHookSelection(availableHooks);
    }

    // Validate if the hook exists in the hooks templates directory
    if (!availableHooks.includes(hook)) {
        // console.error(`❌ Hook "${hook}" not found.`);
        return;
    }

    // get the path and create the create the target directory
    const { source, targetDir } = getInstallPaths(hook, targetFile, hooksTemplatesDir, "hooks");
    // Ensure the target directory exists
    ensureDirectoryExists(targetDir);

    // Check if hook already exists
    if (isFileExists(targetDir, hook) && !replace) {
        console.log(`⚠️ Hook "${hook}" already exists.`);
        return;
    }
    // Copy the hook (file) and install dependencies
    copyComponentsRecursively(source, targetDir);

    console.log(`✅ ${hook} has been added to ${targetFile.path}!`);
}

/**
 * Get a list of available hooks from the hooks templates directory.
 * @param {string} hooksTemplatesDir - Path to the hooks templates directory.
 * @returns {string[]} - Array of hook names.
 */
function getAvailableHooks(hooksTemplatesDir: string): string[] {
    return fs.readdirSync(hooksTemplatesDir).map((file: string) => path.basename(file));
}

/**
 * Prompt the user to select a hook from a list.
 * @param {string[]} availableHooks - Array of available hooks.
 * @returns {string} - The selected hook.
 */
async function promptHookSelection(availableHooks: string[]): Promise<string> {
    const { selectedHook } = await inquirer.prompt([
        {
            type: "list",
            name: "selectedHook",
            message: "Which hook would you like to add?",
            choices: availableHooks,
        },
    ]);
    return selectedHook;
}


