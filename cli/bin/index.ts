#!/usr/bin/env node
import { Command } from "commander";
import { add } from "../src/commands/add.js";
import { initConfig } from "../src/commands/init.js";
import { addHook } from "../src/commands/hook.js";
import { addLayout } from "../src/commands/layout.js";
import { addUtil } from "../src/commands/utils.js";
import { addProvider } from "../src/commands/provider.js";
import { updateInstalledComponents } from "../src/commands/update.js";

const program = new Command();

program
  .name("torch-glare")
  .description("TORCH Glare — React component library CLI")
  .version("1.2.8");

program
  .command("init")
  .description("Initialize TORCH Glare in your project (auto-detects and configures everything)")
  .option("-d, --defaults", "Skip prompts and use auto-detected defaults")
  .action((options) => initConfig(options.defaults ?? false));

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
  .description("Add a layout interactively or install a specified one")
  .action((layout) => addLayout(layout && `${layout}.tsx`));

program
  .command("util [util]")
  .description("Add a utility interactively or install a specified one")
  .action((util) => addUtil(util && `${util}.ts`));

program
  .command("provider [provider]")
  .description("Add a provider interactively or install a specified one")
  .action((provider) => addProvider(provider && `${provider}`));

program
  .command("update")
  .description("Update all installed components, hooks, utils, providers, and layouts")
  .action(() => updateInstalledComponents());

program.parse(process.argv);
