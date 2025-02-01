import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";
import { getConfig } from "./cli.js";

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
}
