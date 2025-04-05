#!/usr/bin/env node
import fs from "fs";
import { fileURLToPath } from "url";
import { Command } from "commander";
import { add } from "../src/commands/add.js";
import { initConfig } from "../src/commands/init.js";
import { addHook } from "../src/commands/hook.js";
import { addLayout } from "../src/commands/layout.js";
import { addUtil } from "../src/commands/utils.js";
import { addProvider } from "../src/commands/provider.js";
import { updateInstalledComponents } from "../src/commands/update.js";

const program = new Command();
const __filename = fileURLToPath(import.meta.url);
const CONFIG_FILE = "glare.json";

export function getConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    console.error('❌ glare.json not found. Run "npx torch-glare@latest init" first');
    process.exit(1);
  }

  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
  } catch (error: any) {
    console.error("❌ Error reading glare.json:", error.message);
    process.exit(1);
  }
}

program
  .name("torch-glare")
  .description("Torch Glare for managing React components")
  .version("0.0.0");

program
  .command("init")
  .description("Initialize torch.json configuration file")
  .action(() => initConfig(CONFIG_FILE));

program
  .command("add [component]")
  .description("Add a component interactively or install a specified one")
  .action((component) => add(component && `${component}.tsx`));

program
  .command("hook [hook]")
  .description("Add a hook interactively or install a specified one")
  .action((hook) => addHook(hook && `${hook}`));

program
  .command("layout [layout]")
  .description("Add a Layout interactively or install a specified one")
  .action((layout) => addLayout(layout && `${layout}.tsx`));

program
  .command("util [util]")
  .description("Add a utils interactively or install a specified one")
  .action((util) => addUtil(util && `${util}.ts`));

program
  .command("provider [provider]")
  .description("Add a provider interactively or install a specified one")
  .action((provider) => addProvider(provider && `${provider}`));

program
  .command("update")
  .description("Update everything installed")
  .action(() => updateInstalledComponents());

program.parse(process.argv);

export { CONFIG_FILE, __filename };
