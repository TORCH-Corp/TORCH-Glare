#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Command } from "commander";
import { add } from "../src/commands/add.js";
import { initConfig } from "../src/commands/init.js";
import { addHook } from "../src/commands/hook.js";
import { addLayout } from "../src/commands/layout.js";
import { addUtil } from "../src/commands/utils.js";
import { addProvider } from "../src/commands/provider.js";
import { updateInstalledComponents } from "../src/commands/update.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Single source of truth: read the version from the published package.json.
const { version } = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../package.json"), "utf-8")
);

const program = new Command();

program
  .name("torch-glare")
  .description("Torch Glare for managing React components")
  .version(version);

program
  .command("init")
  .description("Initialize glare.json configuration file")
  .action(() => initConfig());

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
