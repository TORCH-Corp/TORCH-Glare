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

const installCommand = (
  signature: string,
  description: string,
  run: (name: string | undefined, replace: boolean) => Promise<void>,
) =>
  program
    .command(signature)
    .description(description)
    .option("-f, --force", "Overwrite it if it already exists")
    .action((name: string | undefined, options: { force?: boolean }) =>
      run(name, !!options.force),
    );

installCommand(
  "add [component]",
  "Add a component interactively or install a specified one",
  add,
);
installCommand("hook [hook]", "Add a hook interactively or install a specified one", addHook);
installCommand("layout [layout]", "Add a Layout interactively or install a specified one", addLayout);
installCommand("util [util]", "Add a utils interactively or install a specified one", addUtil);
installCommand(
  "provider [provider]",
  "Add a provider interactively or install a specified one",
  addProvider,
);

program
  .command("update")
  .description("Update everything installed")
  .action(() => updateInstalledComponents());

program
  .command("mcp")
  .description("Set up TORCH Glare MCP server for your AI client")
  .action(() => setupMcp());

program.parse(process.argv);
