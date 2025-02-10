import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";
import { getConfig } from "./cli.js";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.resolve(__dirname, "../templates");

// main function to add a component within it's dependencies
export async function addComponent(component) {
  // Get the config file
  const config = getConfig();

  // get the list of available components
  const availableComponents = fs
    .readdirSync(templatesDir)
    .map((file) => path.basename(file));

  // If the user doesn't provide a component, show the list of available components in the console and ask the user to select one
  if (!component) {
    const selectedComponent = await showComponentsOptionsList(
      availableComponents
    );
    component = selectedComponent;
  }

  // If the component is not available, exit
  if (!availableComponents.includes(component)) {
    console.error(`❌ Component "${component}" not found.`);
    process.exit(1);
  }

  // if the user select a component, we get the path to the component
  const { source, targetDir } = getComponentPath(component, config);

  // If the target directory does not exist, create it
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Get the path to the component in the target directory
  const target = path.join(targetDir, `${component}`);

  // Check if the source is a directory or a file and copy it to the target directory
  if (fs.lstatSync(source).isDirectory()) {
    // if it's a directory, we copy it to the target directory
    copyDirectorySync(source, target);
  } else {
    // if it's a file, we copy it to the target directory
    fs.copyFileSync(source, target);
    // install the dependencies
    installDependencies(source);
  }

  console.log(`✅ ${component} has been added to ${config.path}!`);
}

// Detect the package manager used in the project
function detectPackageManager() {
  if (fs.existsSync(path.join(process.cwd(), "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(process.cwd(), "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(process.cwd(), "package-lock.json")))
    return "npm";
  return "npm"; // Default to npm if no lock file is found
}

// Show a list of components with options to select one
async function showComponentsOptionsList(availableComponents) {
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

// Get the path to the component and return the source and the target directory
function getComponentPath(component, config) {
  const source = path.join(templatesDir, `${component}`);
  const normalizedPath = config.path.replace("@/", "");
  const targetDir = path.join(process.cwd(), normalizedPath);
  return { source, targetDir };
}

// Get the installed dependencies of the current project
function getCurrentInstalledDependencies() {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  // If no package.json is found, exit
  if (!fs.existsSync(packageJsonPath)) {
    console.error(
      "❌ No package.json found. Run `npm init` or `yarn init` first."
    );
    return;
  }

  // Get the installed dependencies from the package.json file and return a set of the dependencies
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const installedDependencies = new Set([
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {}), // Check devDependencies too
  ]);
  return installedDependencies;
}

// Get the dependencies to install from the component
function getDependenciesToInstall(componentPath, installedDependencies) {
  const componentContent = fs.readFileSync(componentPath, "utf-8");

  // Extract imported modules
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  const dependenciesToInstall = new Set();

  // Extract imported modules
  while ((match = importRegex.exec(componentContent)) !== null) {
    const moduleName = match[1];

    // if it's not a relative import and it's not installed, add it to the dependencies to install
    if (!moduleName.startsWith(".") && !installedDependencies.has(moduleName)) {
      dependenciesToInstall.add(moduleName);
    } else if (
      moduleName.startsWith(".") &&
      !installedDependencies.has(moduleName) &&
      moduleName.slice(2) !== "utils"
    ) {
      // if it's a relative import install the component
      addComponent(moduleName.slice(2) + ".tsx");
    }
  }

  return dependenciesToInstall;
}

// Install the dependencies of the component
function installDependencies(componentPath) {
  // Get the installed dependencies of the current project
  const installedDependencies = getCurrentInstalledDependencies();

  // Get the dependencies to install from the component
  const dependenciesToInstall = getDependenciesToInstall(
    componentPath,
    installedDependencies
  );

  // If there are dependencies to install, install them
  if (dependenciesToInstall.size > 0) {
    const packageManager = detectPackageManager();
    const installCommand =
      packageManager === "pnpm"
        ? `pnpm add ${[...dependenciesToInstall].join(" ")}`
        : packageManager === "yarn"
        ? `yarn add ${[...dependenciesToInstall].join(" ")}`
        : `npm install ${[...dependenciesToInstall].join(" ")}`;

    console.log(
      `📦 Installing missing dependencies using ${packageManager}:`,
      [...dependenciesToInstall].join(", ")
    );

    // start the installation of the dependencies
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

// this function is used to copy a directory with all it's files and subdirectories
function copyDirectorySync(source, target) {
  // Create the target directory if it doesn't exist
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  // Read the contents of the source directory
  const items = fs.readdirSync(source, { withFileTypes: true });

  for (const item of items) {
    const sourcePath = path.join(source, item.name);
    const targetPath = path.join(target, item.name);

    // if the item is a directory, we copy it recursively
    if (item.isDirectory()) {
      // Recursively copy subdirectories
      copyDirectorySync(sourcePath, targetPath);
    } else {
      // if the item is a file, we copy it to the target directory
      fs.copyFileSync(sourcePath, targetPath);
      installDependencies(sourcePath);
    }
  }
}
