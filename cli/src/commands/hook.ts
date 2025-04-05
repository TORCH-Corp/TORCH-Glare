import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";
import { ensureDirectoryExists } from "../utils/ensureDirectoryExists.js";
import { getComponentPaths } from "../utils/getComponentPaths.js";
import { copyComponentsRecursively } from "../utils/copyComponentsRecursively.js";
import { getConfig } from "../utils/getConfig.js";
import { CONFIG_FILE } from "./init.js";
import { Config } from "../types/main.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the hooks templates directory
const hooksTemplatesDir: string = path.resolve(__dirname, "../../../lib/hooks");

/**
 * Main function to add a hook and its dependencies.
 * @param {string} hook - The name of the hook to add.
 */
export async function addHook(hook?: string): Promise<void> {
    const config = getConfig(CONFIG_FILE) as Config;
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
    const { source, targetDir } = getComponentPaths(hook, config, hooksTemplatesDir, "hooks");
    const target: string = path.join(targetDir, hook);
    fs.rmSync(target, { recursive: true, force: true });

    // Ensure the target directory exists
    ensureDirectoryExists(targetDir);

    // Copy the hook (file) and install dependencies
    copyComponentsRecursively(source, target);

    console.log(`✅ ${hook} has been added to ${config.path}!`);
}

/**
 * Get a list of available hooks from the hooks templates directory.
 * @param {string} hooksTemplatesDir - Path to the hooks templates directory.
 * @returns {string[]} - Array of hook names.
 */
function getAvailableHooks(hooksTemplatesDir: string): string[] {
    return fs.readdirSync(hooksTemplatesDir).map((file) => path.basename(file));
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


