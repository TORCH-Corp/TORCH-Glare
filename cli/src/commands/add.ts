import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import { ensureDirectoryExists } from "../utils/ensureDirectoryExists.js";
import { getComponentPaths } from "../utils/getComponentPaths.js";
import { Config } from "../types/main";
import { copyComponentsRecursively } from "../utils/copyComponentsRecursively.js";
import { getAvailableFiles } from "../utils/getAvailableFiles.js";
import { isComponentExists } from "../utils/isComponentExists.js";
import { getConfig } from "../utils/getConfig.js";
import { CONFIG_FILE } from "./init.js";

const __filename = fileURLToPath(import.meta.url);

// Get the current file and directory paths
const __dirname = path.dirname(__filename);

// Define the path to the templates directory
const templatesDir = path.resolve(__dirname, "../../../lib/components");



/**
 * Main function to add a component and its dependencies.
 * @param {string} component - The name of the component to add.
 */
export async function add(component?: string, replace: boolean = false): Promise<void> {
    const config = getConfig(CONFIG_FILE) as Config;
    const availableComponents = getAvailableFiles(templatesDir);

    // If no component is provided, prompt the user to select one
    if (!component) {
        component = await promptComponentSelection(availableComponents);
    }

    // Validate if the component exists in the templates directory
    if (!availableComponents.includes(component)) {
        console.error(`❌ Component "${component}" not found.`);
        return;
    }

    const { source, targetDir } = getComponentPaths(component, config, templatesDir, "components");
    const target = path.join(targetDir, component);

    // Check if component already exists
    if (isComponentExists(target) && !replace) {
        console.log(`⚠️ Component "${component}" already exists.`);
        return;
    }

    // Ensure the target directory exists
    ensureDirectoryExists(targetDir);

    // Copy the component (directory or file) and install dependencies
    copyComponentsRecursively(source, target);

    console.log(`✅ ${component} has been added to ${config.path}!`);
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







