import path from "path";
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
const templatesDir = path.resolve(__dirname, "../../../lib/components");



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

    // Validate if the component exists in the templates directory
    if (!availableComponents.includes(component)) {
        console.error(`❌ Component "${component}" not found.`);
        return;
    }

    const { source, targetDir } = getInstallPaths(component, targetFile, templatesDir, "components");

    // Check if component already exists
    if (isFileExists(targetDir) && !replace) {
        console.log(`⚠️ Component "${component}" already exists.`);
        return;
    }

    // Ensure the target directory exists
    // if the directory is not exists, create it
    ensureDirectoryExists(targetDir);

    // Copy the component (directory or file) and install dependencies
    copyComponentsRecursively(source, targetDir);

    console.log(`✅ ${component} has been added to ${targetFile.path}!`);
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







