import fs from "fs";
import path from "path";
import { getConfig } from "./cli.js";
import { addComponent, copyDirectorySync, getComponentPaths, installDependencies } from "./addComponent.js";
import { tailwindInit } from "./init/tailwindInit.js";
import { fileURLToPath } from "url";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);

// Get the current file and directory paths
const __dirname = path.dirname(__filename);

// Define the path to the templates directory
const templatesDir = path.resolve(__dirname, "../../lib");

/**
 * Update all installed components, hooks, and utility files by syncing them with the latest templates.
 */
export async function updateInstalledComponents() {
  const config = getConfig();

  // Ask the user if they are sure about updating
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await new Promise((resolve) => {
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
  await updateItems("components", config);

  // Update hooks
  await updateItems("hooks", config);

  // Update utils
  await updateItems("utils", config);

  // Reinitialize Tailwind CSS configuration
  tailwindInit();
  console.log("✅ All installed items have been updated.");
}

/**
 * Update items (components, hooks, or utils) by syncing them with the latest templates.
 * @param {string} type - The type of items to update (e.g., "components", "hooks", "utils").
 * @param {object} config - Configuration object.
 */
async function updateItems(type, config) {
  const installedItemsDir = getInstalledItemsDir(config, type);

  // Exit if no installed items are found
  if (!checkIfItemsExist(installedItemsDir)) {
    return;
  }

  // Get the list of installed items
  const installedItems = getInstalledItems(installedItemsDir);

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
function getInstalledItemsDir(config, type) {
  const normalizedPath = config.path.replace("@/", "");
  return path.join(process.cwd(), normalizedPath, type);
}

/**
 * Check if the installed items directory exists.
 * @param {string} installedItemsDir - Path to the installed items directory.
 * @returns {boolean} - True if the directory exists, false otherwise.
 */
function checkIfItemsExist(installedItemsDir) {
  if (!fs.existsSync(installedItemsDir)) {
    console.log(`❌ No installed ${path.basename(installedItemsDir)} found.`);
    return false;
  }
  return true;
}

/**
 * Get the list of installed items.
 * @param {string} installedItemsDir - Path to the installed items directory.
 * @returns {string[]} - Array of installed item names.
 */
function getInstalledItems(installedItemsDir) {
  return fs.readdirSync(installedItemsDir).map((file) => path.basename(file));
}

/**
 * Update a single item (component, hook, or utility file) by syncing it with the latest template.
 * @param {string} item - The name of the item to update.
 * @param {object} config - Configuration object.
 * @param {string} type - The type of item (e.g., "components", "hooks", "utils").
 */
function updateItem(item, config, type) {
  const { source, targetDir } = getComponentPaths(item, config, `${templatesDir}/${type}`, type);
  const target = path.join(targetDir, item);

  // Check if the item template exists
  if (fs.existsSync(source)) {
    console.log(`🔄 Updating ${item}...`);

    // Copy the item (directory or file)
    if (fs.lstatSync(source).isDirectory()) {
      copyDirectorySync(source, target, addComponent);
    } else {
      fs.copyFileSync(source, target);
    }

    // Install dependencies for the updated item
    // installDependencies(source, type);

    console.log(`✅ ${item} updated.`);
  } else {
    console.log(`⚠️ Template for ${item} not found. Skipping...`);
  }
}