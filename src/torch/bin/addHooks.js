import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { getConfig } from "./cli.js";
import { fileURLToPath } from "url";
import { installDependencies, ensureDirectoryExists } from "./addComponent.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the hooks templates directory
const hooksTemplatesDir = path.resolve(__dirname, "../templates/hooks");

// Flag to disable logs (used for conditional logging)
let disableLogs = false;

/**
 * Main function to add a hook and its dependencies.
 * @param {string} hook - The name of the hook to add.
 */
export async function addHook(hook) {
    const config = getConfig();
    const availableHooks = getAvailableHooks(hooksTemplatesDir);

    // If no hook is provided, prompt the user to select one
    if (!hook) {
        hook = await promptHookSelection(availableHooks);
    }

    // Validate if the hook exists in the hooks templates directory
    if (!availableHooks.includes(hook)) {
        console.error(`❌ Hook "${hook}" not found.`);
        return;
    }

    const { source, targetDir } = getHookPaths(hook, config, hooksTemplatesDir);
    const target = path.join(targetDir, hook);

    // Check if the hook already exists and handle replacement
    if (await handleHookReplacement(hook, target)) {
        return;
    }

    // Ensure the target directory exists
    ensureDirectoryExists(targetDir);

    // Copy the hook (file) and install dependencies
    copyHook(source, target, hooksTemplatesDir);

    !disableLogs && console.log(`✅ ${hook} has been added to ${config.path}!`);
}

/**
 * Get a list of available hooks from the hooks templates directory.
 * @param {string} hooksTemplatesDir - Path to the hooks templates directory.
 * @returns {string[]} - Array of hook names.
 */
function getAvailableHooks(hooksTemplatesDir) {
    return fs.readdirSync(hooksTemplatesDir).map((file) => path.basename(file));
}

/**
 * Prompt the user to select a hook from a list.
 * @param {string[]} availableHooks - Array of available hooks.
 * @returns {string} - The selected hook.
 */
async function promptHookSelection(availableHooks) {
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

/**
 * Get the source and target paths for the hook.
 * @param {string} hook - The name of the hook.
 * @param {object} config - Configuration object.
 * @returns {object} - Object containing source and target directory paths.
 */
function getHookPaths(hook, config, hooksTemplatesDir) {
    const source = path.join(hooksTemplatesDir, `${hook}`);
    const normalizedPath = config.path.replace("@/", "");
    const targetDir = path.join(process.cwd(), normalizedPath, "hooks"); // Store hooks in a "hooks" subdirectory
    return { source, targetDir };
}

/**
 * Handle hook replacement if it already exists.
 * @param {string} hook - The name of the hook.
 * @param {string} target - The target path of the hook.
 * @returns {boolean} - True if the user skips replacement, false otherwise.
 */
async function handleHookReplacement(hook, target) {
    if (fs.existsSync(target)) {
        disableLogs = true;
        const { shouldReplace } = await inquirer.prompt([
            {
                type: "confirm",
                name: "shouldReplace",
                message: `⚠️ Hook "${hook}" is already installed. Do you want to replace it?`,
                default: true,
            },
        ]);

        if (!shouldReplace) {
            !disableLogs && console.log(`❌ Skipping installation of "${hook}".`);
            return true;
        }

        // Remove the existing hook
        fs.rmSync(target, { recursive: true, force: true });
        !disableLogs && console.log(`🔄 Replacing "${hook}"...`);
    }
    return false;
}

/**
 * Copy a hook (file) and install its dependencies.
 * @param {string} source - The source path of the hook.
 * @param {string} target - The target path of the hook.
 */
function copyHook(source, target, hooksTemplatesDir) {
    fs.copyFileSync(source, target);
    installDependencies(source, hooksTemplatesDir);
}