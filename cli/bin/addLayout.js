import fs from "fs";
import path from "path";
import { getConfig } from "./cli.js";
import { fileURLToPath } from "url";
import { ensureDirectoryExists, getComponentPaths, copyComponent } from "./addComponent.js";
import inquirer from "inquirer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the layouts templates directory
const layoutsTemplatesDir = path.resolve(__dirname, "../../lib/layouts");

/**
 * Main function to add a layout and its dependencies.
 * @param {string} layout - The name of the layout to add.
 */
export async function addLayout(layout) {
    const config = getConfig();
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
    const { source, targetDir } = getComponentPaths(layout, config, layoutsTemplatesDir, "layouts");
    const target = path.join(targetDir, layout);
    fs.rmSync(target, { recursive: true, force: true });

    // Ensure the target directory exists
    ensureDirectoryExists(targetDir);

    // Copy the layout (file) and install dependencies
    copyComponent(source, target, addLayout);

    console.log(`✅ ${layout} has been added to ${config.path}!`);
}

/**
 * Get a list of available layouts from the layouts templates directory.
 * @param {string} layoutsTemplatesDir - Path to the layouts templates directory.
 * @returns {string[]} - Array of layout names.
 */
function getAvailableLayouts(layoutsTemplatesDir) {
    return fs.readdirSync(layoutsTemplatesDir).map((file) => path.basename(file));
}

/**
 * Prompt the user to select a layout from a list.
 * @param {string[]} availableLayouts - Array of available layouts.
 * @returns {string} - The selected layout.
 */
async function promptLayoutSelection(availableLayouts) {
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