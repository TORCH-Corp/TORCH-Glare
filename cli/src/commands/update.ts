import fs from "fs";
import path from "path";
import { getConfig } from "../shared/getConfig.js";
import { CONFIG_FILE } from "./init.js";
import { Config } from "../types/main.js";
import { getInstallPaths } from "../shared/getInstallPaths.js";
import { tailwindInit } from "../shared/tailwindInit.js";
import { fileURLToPath } from "url";
import readline from "readline";
import { copyComponentsRecursively } from "../shared/copyComponentsRecursively.js";
import { getAvailableFiles } from "../shared/getAvailableFiles.js";

const __filename = fileURLToPath(import.meta.url);

// Get the current file and directory paths
const __dirname = path.dirname(__filename);

// Define the path to the templates directory
const templatesDir = path.resolve(__dirname, "../../../lib");

/**
 * Update all installed components, hooks, and utility files by syncing them with the latest templates.
 */
export async function updateInstalledComponents(): Promise<void> {
    const targetFile = getConfig(CONFIG_FILE) as Config;

    // Ask the user if they are sure about updating
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const answer = await new Promise<string>((resolve) => {
        rl.question("Are you sure you want to update all installed components, hooks, and utils? (y/n): ", (input) => {
            resolve(input.trim().toLowerCase());
        });
    });

    rl.close();

    if (answer !== "y") {
        console.log("Update cancelled.");
        return;
    }

    // Update components
    await updateItems("components", targetFile);

    // Update hooks
    await updateItems("hooks", targetFile);

    // Update utils
    await updateItems("utils", targetFile);

    // Reinitialize Tailwind CSS configuration
    tailwindInit();
    console.log("✅ All installed items have been updated.");
}

/**
 * Update items (components, hooks, or utils) by syncing them with the latest templates.
 * @param {string} type - The type of items to update (e.g., "components", "hooks", "utils").
 * @param {object} config - Configuration object.
 */
async function updateItems(type: string, config: any): Promise<void> {
    const installedItemsDir = getInstalledItemsDir(config, type);

    // Exit if no installed items are found
    if (!checkIfItemsExist(installedItemsDir, type)) {
        return;
    }

    // Get the list of installed items
    const installedItems = getAvailableFiles(installedItemsDir);

    // Exit if there are no items to update
    if (installedItems.length === 0) {
        console.log(`✅ No ${type} to update.`);
        return;
    }

    console.log(`🔄 Updating installed ${type}...`);

    // Update each installed item
    installedItems.forEach((item) => {
        updateItem(item, config, type);
    });
}

/**
 * Get the directory path for installed items (components, hooks, or utils).
 * @param {object} config - Configuration object.
 * @param {string} type - The type of items (e.g., "components", "hooks", "utils").
 * @returns {string} - Path to the installed items directory.
 */
function getInstalledItemsDir(config: any, type: string): string {
    const normalizedPath = config.path.replace("@/", "");
    return path.join(process.cwd(), normalizedPath, type);
}

/**
 * Check if the installed items directory exists.
 * @param {string} installedItemsDir - Path to the installed items directory.
 * @param {string} type - The type of items being checked.
 * @returns {boolean} - True if the directory exists, false otherwise.
 */
function checkIfItemsExist(installedItemsDir: string, type: string): boolean {
    if (!fs.existsSync(installedItemsDir)) {
        console.log(`❌ No installed ${type} found.`);
        return false;
    }
    return true;
}


/**
 * Update a single item (component, hook, or utility file) by syncing it with the latest template.
 * @param {string} item - The name of the item to update.
 * @param {object} config - Configuration object.
 * @param {string} type - The type of item (e.g., "components", "hooks", "utils").
 */
function updateItem(item: string, config: any, type: string): void {
    const { source, targetDir } = getInstallPaths(item, config, `${templatesDir}/${type}`, type);
    copyComponentsRecursively(source, targetDir);
}