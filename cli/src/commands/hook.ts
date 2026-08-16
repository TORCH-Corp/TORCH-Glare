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
import { installFromPlan, reportInstall } from "../shared/installFromPlan.js";
import { isInstalled, resolveEntry } from "../shared/resolveEntry.js";

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

    // Resolve the name the way every other command does — a bare `hook` name, a name with
    // its extension, or a folder all reach the same entry.
    const resolved = resolveEntry(hook!, availableHooks, hooksTemplatesDir);
    if (!resolved) {
        console.error(`❌ Hook "${hook}" not found.`);
        return;
    }

    // The registry resolves the whole graph in one pass, so `replace` reaches every item — and a
    // dependency is never skipped-and-forgotten the way the per-file walker used to skip it.
    const name = resolved.replace(/\.(tsx|ts)$/, "");
    const result = installFromPlan("hooks", name, targetFile, replace);
    if (result) {
        reportInstall(resolved, result, targetFile.path);
        return;
    }

    // Not in registry.json — copy it alone, and say why the dependencies were not resolved.
    console.warn(
        `⚠️ "${resolved}" is not in registry.json, so its dependencies cannot be resolved.\n` +
            `   Copying the file only. Re-run \`pnpm run registry\` in the library to fix this.`,
    );
    const { source, targetDir } = getInstallPaths(resolved, targetFile, hooksTemplatesDir, "hooks");
    if (isInstalled(targetDir, resolved) && !replace) {
        console.log(`⚠️ Hook "${resolved}" already exists.`);
        return;
    }
    ensureDirectoryExists(targetDir);
    copyComponentsRecursively(source, targetDir);
    console.log(`✅ ${resolved} has been added to ${targetFile.path}!`);
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


