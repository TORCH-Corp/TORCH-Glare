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
import { isFileExists } from "../shared/isFileExists.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the provider templates directory
const providerTemplatesDir: string = path.resolve(__dirname, "../../../lib/providers");

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

    // Validate if the provider exists in the provider templates directory
    if (!availableProviders.includes(provider)) {
        console.error(`❌ Provider "${provider}" not found.`);
        return;
    }

    // Get the path and create the target directory
    const { source, targetDir } = getInstallPaths(provider, targetFile, providerTemplatesDir, "providers");
    // Ensure the target directory exists
    ensureDirectoryExists(targetDir);

    // Check if provider already exists
    if (isFileExists(targetDir) && !replace) {
        console.log(`⚠️ Provider "${provider}" already exists.`);
        return;
    }

    // Copy the provider (file or directory) and install dependencies
    copyComponentsRecursively(source, targetDir);

    console.log(`✅ ${provider} has been added to ${targetFile.path}!`);
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