import fs from "fs";
import path from "path";
import { getConfig } from "../shared/getConfig.js";
import { CONFIG_FILE } from "./init.js";
import { Config } from "../types/main.js";
import { fileURLToPath } from "url";
import { ensureDirectoryExists } from "../shared/ensureDirectoryExists.js";
import { getInstallPaths } from "../shared/getInstallPaths.js";
import { copyComponentsRecursively } from "../shared/copyComponentsRecursively.js";
import inquirer from "inquirer";
import { installFromPlan, reportInstall } from "../shared/installFromPlan.js";
import { isInstalled, resolveEntry } from "../shared/resolveEntry.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the provider templates directory
const providerTemplatesDir: string = path.resolve(__dirname, "../../../apps/lib/providers");

/**
 * Main function to add a provider and its dependencies.
 * @param {string} provider - The name of the provider to add.
* @param {boolean} replace - Whether to replace the existing provider.
 */
export async function addProvider(provider?: string, replace: boolean = false): Promise<void> {
    const targetFile = getConfig(CONFIG_FILE) as Config;
    const availableProviders: string[] = getAvailableProviders(providerTemplatesDir);

    // If no provider is provided, prompt the user to select one
    if (!provider) {
        provider = await promptProviderSelection(availableProviders);
    }

    // Resolve the name the way every other command does — a bare `provider` name, a name with
    // its extension, or a folder all reach the same entry.
    const resolved = resolveEntry(provider!, availableProviders, providerTemplatesDir);
    if (!resolved) {
        console.error(`❌ Provider "${provider}" not found.`);
        return;
    }

    // The registry resolves the whole graph in one pass, so `replace` reaches every item — and a
    // dependency is never skipped-and-forgotten the way the per-file walker used to skip it.
    const name = resolved.replace(/\.(tsx|ts)$/, "");
    const result = installFromPlan("providers", name, targetFile, replace);
    if (result) {
        reportInstall(resolved, result, targetFile.path);
        return;
    }

    // Not in registry.json — copy it alone, and say why the dependencies were not resolved.
    console.warn(
        `⚠️ "${resolved}" is not in registry.json, so its dependencies cannot be resolved.\n` +
            `   Copying the file only. Re-run \`pnpm run registry\` in the library to fix this.`,
    );
    const { source, targetDir } = getInstallPaths(resolved, targetFile, providerTemplatesDir, "providers");
    if (isInstalled(targetDir, resolved) && !replace) {
        console.log(`⚠️ Provider "${resolved}" already exists.`);
        return;
    }
    ensureDirectoryExists(targetDir);
    copyComponentsRecursively(source, targetDir);
    console.log(`✅ ${resolved} has been added to ${targetFile.path}!`);
}

/**
 * Get a list of available providers from the provider templates directory.
 * @param {string} providerTemplatesDir - Path to the provider templates directory.
 * @returns {string[]} - Array of provider names.
 */
function getAvailableProviders(providerTemplatesDir: string): string[] {
    return fs.readdirSync(providerTemplatesDir).map((file) => path.basename(file));
}

/**
 * Prompt the user to select a provider from a list.
 * @param {string[]} availableProviders - Array of available providers.
 * @returns {string} - The selected provider.
 */
async function promptProviderSelection(availableProviders: string[]): Promise<string> {
    const { selectedProvider } = await inquirer.prompt([
        {
            type: "list",
            name: "selectedProvider",
            message: "Which provider would you like to add?",
            choices: availableProviders,
        },
    ]);
    return selectedProvider;
}