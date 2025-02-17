#!/usr/bin/env node
import fs from "fs";
import { fileURLToPath } from "url";
import { Command } from "commander";
import { initConfig } from "./init/init.js";
import { addComponent } from "./addComponent.js";
import { addHook } from "./addHooks.js";
import { updateInstalledComponents } from "./update.js";
import { addUtil } from "./addUtils.js";

const program = new Command();
const __filename = fileURLToPath(import.meta.url);
const CONFIG_FILE = "torch.json";

export function getConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    console.error('❌ torch.json not found. Run "npx torchcorp init" first');
    process.exit(1);
  }

  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
  } catch (error) {
    console.error("❌ Error reading torch.json:", error.message);
    process.exit(1);
  }
}

program
  .name("torchcorp")
  .description("TorchCorp CLI for managing React components")
  .version("1.0.0");

program
  .command("init")
  .description("Initialize torch.json configuration file")
  .action(() => initConfig(CONFIG_FILE, templatesDir));

program
  .command("add [component]")
  .description("Add a component interactively or install a specified one")
  .action((component) => addComponent(component && `${component}.tsx`));

program
  .command("add-hook [hook]")
  .description("Add a hook interactively or install a specified one")
  .action((hook) => addHook(hook && `${hook}`));

program
  .command("add-util [util]")
  .description("Add a hook interactively or install a specified one")
  .action((util) => addUtil(util && `${util}.ts`));

program
  .command("theme")
  .description("Add a component interactively or install a specified one")
  .action(() => addComponent("ThemeProvider", templatesDir));

program
  .command("update")
  .description("Update all installed components")
  .action(() => updateInstalledComponents());

program.parse(process.argv);

export { CONFIG_FILE, __filename };
