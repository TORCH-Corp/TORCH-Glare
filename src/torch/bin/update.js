import fs from "fs";
import path from "path";
import { getConfig } from "./cli.js";
import { copyDirectorySync, getComponentPaths } from "./addComponent.js";
import { tailwindInit } from "./init/tailwindInit.js";

/**
 * Update all installed components by syncing them with the latest templates.
 */
export async function updateInstalledComponents() {
  const config = getConfig();
  const installedComponentsDir = getInstalledComponentsDir(config);

  // Exit if no installed components are found
  if (!checkIfComponentsExist(installedComponentsDir)) {
    return;
  }

  // Get the list of installed components
  const installedComponents = getInstalledComponents(installedComponentsDir);

  // Exit if there are no components to update
  if (installedComponents.length === 0) {
    console.log("✅ No components to update.");
    return;
  }

  console.log("🔄 Updating installed components...");

  // Update each installed component
  installedComponents.forEach((component) => {
    updateComponent(component, config);
  });

  // Reinitialize Tailwind CSS configuration
  tailwindInit();
  console.log("✅ All installed components have been updated.");
}

/**
 * Get the directory path for installed components.
 * @param {object} config - Configuration object.
 * @returns {string} - Path to the installed components directory.
 */
function getInstalledComponentsDir(config) {
  const normalizedPath = config.path.replace("@/", "");
  return path.join(process.cwd(), normalizedPath);
}

/**
 * Check if the installed components directory exists.
 * @param {string} installedComponentsDir - Path to the installed components directory.
 * @returns {boolean} - True if the directory exists, false otherwise.
 */
function checkIfComponentsExist(installedComponentsDir) {
  if (!fs.existsSync(installedComponentsDir)) {
    console.log("❌ No installed components found.");
    return false;
  }
  return true;
}

/**
 * Get the list of installed components.
 * @param {string} installedComponentsDir - Path to the installed components directory.
 * @returns {string[]} - Array of installed component names.
 */
function getInstalledComponents(installedComponentsDir) {
  return fs.readdirSync(installedComponentsDir).map((file) => path.basename(file));
}

/**
 * Update a single component by syncing it with the latest template.
 * @param {string} component - The name of the component to update.
 * @param {object} config - Configuration object.
 */
function updateComponent(component, config) {
  const { source, targetDir } = getComponentPaths(component, config);
  const target = path.join(targetDir, `${component}`);

  // Check if the component template exists
  if (fs.existsSync(source)) {
    console.log(`🔄 Updating ${component}...`);

    // Copy the component (directory or file)
    if (fs.lstatSync(source).isDirectory()) {
      copyDirectorySync(source, target);
    } else {
      fs.copyFileSync(source, target);
    }

    console.log(`✅ ${component} updated.`);
  } else {
    console.log(`⚠️ Template for ${component} not found. Skipping...`);
  }
}