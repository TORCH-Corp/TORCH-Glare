import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { getConfig } from "./cli.js";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { addUtil } from "./addUtils.js";
import { addHook } from "./addHooks.js";

const __filename = fileURLToPath(import.meta.url);

// Get the current file and directory paths
const __dirname = path.dirname(__filename);

// Define the path to the templates directory
const templatesDir = path.resolve(__dirname, "../../lib/components");


/**
 * Main function to add a component and its dependencies.
 * @param {string} component - The name of the component to add.
 */
export async function addComponent(component) {
  const config = getConfig();
  const availableComponents = getAvailableComponents(templatesDir);

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

  // replace the component
  fs.rmSync(target, { recursive: true, force: true });
  console.log(`🔄 Replacing "${component}"...`);

  // Ensure the target directory exists
  ensureDirectoryExists(targetDir);

  // Copy the component (directory or file) and install dependencies
  copyComponent(source, target, addComponent);

  console.log(`✅ ${component} has been added to ${config.path}!`);
}

/**
 * Get a list of available components from the templates directory.
 * @param {string} templatesDir - Path to the templates directory.
 * @returns {string[]} - Array of component names.
 */
function getAvailableComponents(templatesDir) {
  return fs.readdirSync(templatesDir).map((file) => path.basename(file));
}

/**
 * Prompt the user to select a component from a list.
 * @param {string[]} availableComponents - Array of available components.
 * @returns {string} - The selected component.
 */
async function promptComponentSelection(availableComponents) {
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

/**
 * Get the source and target paths for the component.
 * @param {string} component - The name of the component.
 * @param {object} config - Configuration object.
 * @returns {object} - Object containing source and target directory paths.
 */
export function getComponentPaths(component, config, templatesDir, saveFolderName) {
  const source = path.join(templatesDir, `${component}`);
  const normalizedPath = config.path.replace("@/", "");
  const targetDir = path.join(process.cwd(), normalizedPath, saveFolderName);
  return { source, targetDir };
}

/**
 * Ensure the target directory exists.
 * @param {string} targetDir - The target directory path.
 */
export function ensureDirectoryExists(targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
}

/**
 * Copy a component (directory or file) and install its dependencies.
 * @param {string} source - The source path of the component.
 * @param {string} target - The target path of the component.
 */
export function copyComponent(source, target, addFunction) {
  if (fs.lstatSync(source).isDirectory()) {
    copyDirectorySync(source, target, addFunction);
  } else {
    fs.copyFileSync(source, target);
    installDependencies(source, addFunction); // Pass addFunction here
  }
}

/**
 * Detect the package manager used in the project.
 * @returns {string} - The detected package manager (pnpm, yarn, or npm).
 */
export function detectPackageManager() {
  if (fs.existsSync(path.join(process.cwd(), "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(process.cwd(), "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(process.cwd(), "package-lock.json"))) return "npm";
  return "npm"; // Default to npm if no lock file is found
}

/**
 * Get the installed dependencies from the project's package.json.
 * @returns {Set<string>} - Set of installed dependencies.
 */
export function getCurrentInstalledDependencies() {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    console.error("❌ No package.json found. Run `npm init` or `yarn init` first.");
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  const depsNames = new Set([
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {}),
  ]);

  const depsNamesAndVersions = {
    ...(packageJson.dependencies || {}),
    ...(packageJson.devDependencies || {}),
  };
  return { depsNames, depsNamesAndVersions }
}

/**
 * Extract dependencies from a component file.
 * @param {string} componentPath - Path to the component file.
 * @param {Set<string>} installedDependencies - Set of installed dependencies.
 * @param {function} addFunction - Function to make add operation
 * @returns {Set<string>} - Set of dependencies to install.
 */
function getDependenciesToInstall(componentPath, installedDependencies, addFunction) {
  const componentContent = fs.readFileSync(componentPath, "utf-8");
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  const dependenciesToInstall = new Set();

  let match;
  while ((match = importRegex.exec(componentContent)) !== null) {
    const moduleName = match[1];

    if (!moduleName.startsWith(".") && !installedDependencies.has(moduleName)) {
      dependenciesToInstall.add(moduleName);
    }

    // install required utils.
    else if (
      moduleName.startsWith("../utils") &&
      !installedDependencies.has(moduleName)
    ) {
      addUtil(moduleName.slice(9) + ".ts"); // Use addFunction here
    }

    // install required hooks.
    else if (
      moduleName.startsWith("../hooks") &&
      !installedDependencies.has(moduleName)
    ) {
      addHook(moduleName.slice(9)); // Use addFunction here
    }
    // install required components
    else if (
      moduleName.startsWith("./") ||
      !moduleName.startsWith("../components") &&
      !installedDependencies.has(moduleName)
    ) {
      addComponent(moduleName.slice(2) + ".tsx"); // Use addFunction here
    }
    // install required for layouts components
    else if (
      moduleName.startsWith("../components") &&
      !installedDependencies.has(moduleName)
    ) {
      addComponent(moduleName.slice(14) + ".tsx"); // Use addFunction here
    }
  }

  return dependenciesToInstall;
}
/**
 * Install dependencies for a component.
 * @param {string} componentPath - Path to the component file.
 */
export function installDependencies(componentPath, addFunction) {
  const { depsNames } = getCurrentInstalledDependencies();
  const dependenciesToInstall = getDependenciesToInstall(
    componentPath,
    depsNames,
    addFunction // Pass addFunction here
  );

  if (dependenciesToInstall.size > 0) {
    const packageManager = detectPackageManager();
    const installCommand = getInstallCommand(packageManager, dependenciesToInstall);

    console.log(
      `📦 Installing missing dependencies using ${packageManager}:`,
      [...dependenciesToInstall].join(", ")
    );

    try {
      execSync(installCommand, { stdio: "inherit" });
      console.log("✅ Dependencies installed successfully.");
    } catch (error) {
      console.error("❌ Error installing dependencies:", error.message);
    }
  } else {
    console.log("✅ All dependencies are already installed.");
  }
}
/**
 * Generate the installation command based on the package manager.
 * @param {string} packageManager - The package manager (pnpm, yarn, or npm).
 * @param {Set<string>} dependencies - Set of dependencies to install.
 * @returns {string} - The installation command.
 */
function getInstallCommand(packageManager, dependencies) {
  const deps = [...dependencies].join(" ");
  switch (packageManager) {
    case "pnpm":
      return `pnpm add ${deps}`;
    case "yarn":
      return `yarn add ${deps}`;
    default:
      return `npm install ${deps}`;
  }
}

/**
 * Copy a directory and its contents recursively.
 * @param {string} source - Source directory path.
 * @param {string} target - Target directory path.
 */
export function copyDirectorySync(source, target, addFunction) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const items = fs.readdirSync(source, { withFileTypes: true });
  for (const item of items) {
    const sourcePath = path.join(source, item.name);
    const targetPath = path.join(target, item.name);

    if (item.isDirectory()) {
      copyDirectorySync(sourcePath, targetPath, addFunction);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
      installDependencies(sourcePath, addFunction); // Pass addFunction here
    }
  }
}