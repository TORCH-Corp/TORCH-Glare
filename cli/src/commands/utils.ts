import fs from "fs";
import path from "path";
import { getConfig } from "../../bin/index.js";
import { fileURLToPath } from "url";
import { ensureDirectoryExists } from "../utils/ensureDirectoryExists.js";
import { getComponentPaths } from "../utils/getComponentPaths.js";
import { copyComponent } from "../utils/copyComponent.js";
import inquirer from "inquirer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the utils templates directory
const utilsTemplatesDir: string = path.resolve(__dirname, "../../../lib/utils");

/**
 * Main function to add a utility file and its dependencies.
 * @param {string} util - The name of the utility file to add.
 */
export async function addUtil(util?: string): Promise<void> {
    const config = getConfig();
    const availableUtils: string[] = getAvailableUtils(utilsTemplatesDir);

    // If no utility file is provided, prompt the user to select one
    if (!util) {
        util = await promptUtilSelection(availableUtils);
    }

    // Validate if the utility file exists in the utils templates directory
    if (!availableUtils.includes(util)) {
        console.error(`❌ Utility file "${util}" not found.`);
        return;
    }

    // get the path and create the create the target directory
    const { source, targetDir } = getComponentPaths(util, config, utilsTemplatesDir, "utils");
    const target: string = path.join(targetDir, util);

    fs.rmSync(target, { recursive: true, force: true });

    // Ensure the target directory exists
    ensureDirectoryExists(targetDir);

    // Copy the utility file and install dependencies
    copyComponent(source, target);

    console.log(`✅ ${util} has been added to ${config.path}!`);
}

/**
 * Get a list of available utility files from the utils templates directory.
 * @param {string} utilsTemplatesDir - Path to the utils templates directory.
 * @returns {string[]} - Array of utility file names.
 */
function getAvailableUtils(utilsTemplatesDir: string): string[] {
    return fs.readdirSync(utilsTemplatesDir).map((file) => path.basename(file));
}

/**
 * Prompt the user to select a utility file from a list.
 * @param {string[]} availableUtils - Array of available utility files.
 * @returns {string} - The selected utility file.
 */
async function promptUtilSelection(availableUtils: string[]): Promise<string> {
    const { selectedUtil } = await inquirer.prompt([
        {
            type: "list",
            name: "selectedUtil",
            message: "Which utility file would you like to add?",
            choices: availableUtils,
        },
    ]);
    return selectedUtil;
}
