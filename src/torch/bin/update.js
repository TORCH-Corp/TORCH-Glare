import fs from "fs";
import path from "path";
import { getConfig } from "./cli.js";
import {
  copyDirectorySync,
  installDependencies,
  getComponentPath,
  addComponent,
} from "./add.js";
import { tailwindInit } from "./init/tailwindInit.js";
// Function to update all installed components
export async function updateInstalledComponents() {
  const config = getConfig();
  const normalizedPath = config.path.replace("@/", "");
  const installedComponentsDir = path.join(process.cwd(), normalizedPath);

  // If the directory doesn't exist, exit
  if (!fs.existsSync(installedComponentsDir)) {
    console.log("❌ No installed components found.");
    return;
  }

  // Get the list of installed components
  const installedComponents = fs
    .readdirSync(installedComponentsDir)
    .map((file) => path.basename(file));

  if (installedComponents.length === 0) {
    console.log("✅ No components to update.");
    return;
  }

  console.log("🔄 Updating installed components...");

  installedComponents.forEach((component) => {
    const { source, targetDir } = getComponentPath(component, config);
    const target = path.join(targetDir, `${component}`);

    // If the component exists in templates, update it
    if (fs.existsSync(source)) {
      console.log(`🔄 Updating ${component}...`);
      if (fs.lstatSync(source).isDirectory()) {
        copyDirectorySync(source, target);
      } else {
        fs.copyFileSync(source, target);
      }
      console.log(`✅ ${component} updated.`);
    } else {
      console.log(`⚠️ Template for ${component} not found. Skipping...`);
    }
  });
  tailwindInit();
  console.log("✅ All installed components have been updated.");
}
