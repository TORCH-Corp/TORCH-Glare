import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { copyComponentsRecursively } from "../shared/copyComponentsRecursively.js";
import inquirer from "inquirer";
import { getConfig } from "../shared/getConfig.js";
import { getInstallPaths } from "../shared/getInstallPaths.js";
import { ensureDirectoryExists } from "../shared/ensureDirectoryExists.js";
import { CONFIG_FILE } from "./init.js";
import { Config } from "../types/main.js";
import { isFileExists } from "../shared/isFileExists.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the layouts templates directory
const layoutsTemplatesDir = path.resolve(__dirname, "../../../lib/layouts");

/**
 * Main function to add a layout and its dependencies.
 * @param {string} layout - The name of the layout to add.
 * @param {boolean} replace - Whether to replace the existing layout.
 */
export async function addLayout(layout?: string, replace: boolean = false): Promise<void> {
    const targetFile = getConfig(CONFIG_FILE) as Config;
    const availableLayouts = getAvailableLayouts(layoutsTemplatesDir);

    // If no layout is provided, prompt the user to select one
    if (!layout) {
        layout = await promptLayoutSelection(availableLayouts);
    }

    // Validate if the layout exists in the layouts templates directory
    if (!availableLayouts.includes(layout)) {
        // console.error(`❌ Layout "${layout}" not found.`);
        return;
    }

    // get the path and create the create the target directory
    const { source, targetDir } = getInstallPaths(layout, targetFile, layoutsTemplatesDir, "layouts");
    // Ensure the target directory exists
    ensureDirectoryExists(targetDir);

    // Check if layout already exists
    if (isFileExists(targetDir, layout) && !replace) {
        console.log(`⚠️ Layout "${layout}" already exists.`);
        return;
    }

    // Copy the layout (file) and install dependencies
    copyComponentsRecursively(source, targetDir);

    console.log(`✅ ${layout} has been added to ${targetFile.path}!`);
}

/**
 * Get a list of available layouts from the layouts templates directory.
 * @param {string} layoutsTemplatesDir - Path to the layouts templates directory.
 * @returns {string[]} - Array of layout names.
 */
function getAvailableLayouts(layoutsTemplatesDir: string): string[] {
    return fs.readdirSync(layoutsTemplatesDir).map((file) => path.basename(file));
}

/**
 * Prompt the user to select a layout from a list.
 * @param {string[]} availableLayouts - Array of available layouts.
 * @returns {string} - The selected layout.
 */
async function promptLayoutSelection(availableLayouts: string[]): Promise<string> {
    const { selectedLayout } = await inquirer.prompt([
        {
            type: "list",
            name: "selectedLayout",
            message: "Which layout would you like to add?",
            choices: availableLayouts,
        },
    ]);
    return selectedLayout;
}