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
import { setupMcp } from "../src/commands/mcp.js";

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
  .option("-f, --force", "Overwrite the component if it already exists")
  .action((component, options) => add(component, !!options.force));

program
  .command("hook [hook]")
    .option("-f, --force", "Overwrite it if it already exists")
  .description("Add a hook interactively or install a specified one")
  .action((hook, options) => addHook(hook, !!options.force));

program
  .command("layout [layout]")
    .option("-f, --force", "Overwrite it if it already exists")
  .description("Add a Layout interactively or install a specified one")
  .action((layout, options) => addLayout(layout, !!options.force));

program
  .command("util [util]")
    .option("-f, --force", "Overwrite it if it already exists")
  .description("Add a utils interactively or install a specified one")
  .action((util, options) => addUtil(util, !!options.force));

program
  .command("provider [provider]")
    .option("-f, --force", "Overwrite it if it already exists")
  .description("Add a provider interactively or install a specified one")
  .action((provider, options) => addProvider(provider, !!options.force));

program
  .command("update")
  .description("Update everything installed")
  .action(() => updateInstalledComponents());

program
  .command("mcp")
  .description("Set up TORCH Glare MCP server for your AI client")
  .action(() => setupMcp());

program.parse(process.argv);
