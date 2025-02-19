import fs from "fs";
import path from "path";
import { getConfig } from "./cli.js";
import { fileURLToPath } from "url";
import { ensureDirectoryExists, getComponentPaths, copyComponent } from "./addComponent.js";
import inquirer from "inquirer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the provider templates directory
const providerTemplatesDir = path.resolve(__dirname, "../../lib/providers");

/**
 * Main function to add a provider and its dependencies.
 * @param {string} provider - The name of the provider to add.
 */
export async function addProvider(provider) {
    const config = getConfig();
    const availableProviders = getAvailableProviders(providerTemplatesDir);

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
    const { source, targetDir } = getComponentPaths(provider, config, providerTemplatesDir, "providers");
    const target = path.join(targetDir, provider);
    fs.rmSync(target, { recursive: true, force: true });

    // Ensure the target directory exists
    ensureDirectoryExists(targetDir);

    // Copy the provider (file or directory) and install dependencies
    copyComponent(source, target, addProvider);

    console.log(`✅ ${provider} has been added to ${config.path}!`);
}

/**
 * Get a list of available providers from the provider templates directory.
 * @param {string} providerTemplatesDir - Path to the provider templates directory.
 * @returns {string[]} - Array of provider names.
 */
function getAvailableProviders(providerTemplatesDir) {
    return fs.readdirSync(providerTemplatesDir).map((file) => path.basename(file));
}

/**
 * Prompt the user to select a provider from a list.
 * @param {string[]} availableProviders - Array of available providers.
 * @returns {string} - The selected provider.
 */
async function promptProviderSelection(availableProviders) {
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