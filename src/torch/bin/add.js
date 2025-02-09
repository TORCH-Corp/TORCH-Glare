import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";
import { getConfig } from "./cli.js";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.resolve(__dirname, "../templates");

export function listComponents() {
  if (!fs.existsSync(templatesDir)) {
    console.error("❌ Templates directory not found.");
    process.exit(1);
  }

  const components = fs
    .readdirSync(templatesDir)
    .map((file) => path.basename(file, ".tsx"));

  if (components.length === 0) {
    console.log("⚠️ No components available.");
  } else {
    console.log("📦 Available components:");
    components.forEach((comp) => console.log(`- ${comp}`));
  }
}

export async function addComponent(component) {
  const config = getConfig();
  const availableComponents = fs
    .readdirSync(templatesDir)
    .map((file) => path.basename(file, ".tsx"));

  if (!component) {
    const { selectedComponent } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedComponent",
        message: "Which component would you like to add?",
        choices: availableComponents,
      },
    ]);
    component = selectedComponent;
  }

  if (!availableComponents.includes(component)) {
    console.error(`❌ Component "${component}" not found.`);
    listComponents();
    process.exit(1);
  }

  const source = path.join(templatesDir, `${component}.tsx`);
  const normalizedPath = config.path.replace("@/", "");
  const targetDir = path.join(process.cwd(), normalizedPath);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const target = path.join(targetDir, `${component}.tsx`);
  fs.copyFileSync(source, target);
  console.log(`✅ ${component}.tsx has been added to ${config.path}!`);

  installDependencies(source);
}

function detectPackageManager() {
  if (fs.existsSync(path.join(process.cwd(), "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(process.cwd(), "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(process.cwd(), "package-lock.json")))
    return "npm";
  return "npm"; // Default to npm if no lock file is found
}

function installDependencies(componentPath) {
  const packageJsonPath = path.join(process.cwd(), "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    console.error(
      "❌ No package.json found. Run `npm init` or `yarn init` first."
    );
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const installedDependencies = new Set([
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {}), // Check devDependencies too
  ]);

  // Read the component file
  const componentContent = fs.readFileSync(componentPath, "utf-8");

  // Extract imported modules
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  const dependenciesToInstall = new Set();

  while ((match = importRegex.exec(componentContent)) !== null) {
    const moduleName = match[1];

    // Skip relative imports (local files)
    if (!moduleName.startsWith(".") && !installedDependencies.has(moduleName)) {
      dependenciesToInstall.add(moduleName);
    }
  }

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
