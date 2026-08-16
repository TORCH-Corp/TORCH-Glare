import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { copyComponentsRecursively } from "../shared/copyComponentsRecursively.js";
import inquirer from "inquirer";
import { getConfig } from "../shared/getConfig.js";
import { getInstallPaths } from "../shared/getInstallPaths.js";
import { ensureDirectoryExists } from "../shared/ensureDirectoryExists.js";
import { CONFIG_FILE } from "./init.js";
import { Config } from "../types/main.js";
import { installFromPlan, reportInstall } from "../shared/installFromPlan.js";
import { isInstalled, resolveEntry } from "../shared/resolveEntry.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the layouts templates directory
const layoutsTemplatesDir = path.resolve(__dirname, "../../../apps/lib/layouts");

/**
 * Main function to add a layout and its dependencies.
 * @param {string} layout - The name of the layout to add.
 * @param {boolean} replace - Whether to replace the existing layout.
 */
export async function addLayout(layout?: string, replace: boolean = false): Promise<void> {
    const targetFile = getConfig(CONFIG_FILE) as Config;
    const availableLayouts = getAvailableLayouts(layoutsTemplatesDir);

    // If no layout is provided, prompt the user to select one
    if (!layout) {
        layout = await promptLayoutSelection(availableLayouts);
    }

    // Resolve the name the way every other command does — a bare `layout` name, a name with
    // its extension, or a folder all reach the same entry.
    const resolved = resolveEntry(layout!, availableLayouts, layoutsTemplatesDir);
    if (!resolved) {
        console.error(`❌ Layout "${layout}" not found.`);
        return;
    }

    // The registry resolves the whole graph in one pass, so `replace` reaches every item — and a
    // dependency is never skipped-and-forgotten the way the per-file walker used to skip it.
    const name = resolved.replace(/\.(tsx|ts)$/, "");
    const result = installFromPlan("layouts", name, targetFile, replace);
    if (result) {
        reportInstall(resolved, result, targetFile.path);
        return;
    }

    // Not in registry.json — copy it alone, and say why the dependencies were not resolved.
    console.warn(
        `⚠️ "${resolved}" is not in registry.json, so its dependencies cannot be resolved.\n` +
            `   Copying the file only. Re-run \`pnpm run registry\` in the library to fix this.`,
    );
    const { source, targetDir } = getInstallPaths(resolved, targetFile, layoutsTemplatesDir, "layouts");
    if (isInstalled(targetDir, resolved) && !replace) {
        console.log(`⚠️ Layout "${resolved}" already exists.`);
        return;
    }
    ensureDirectoryExists(targetDir);
    copyComponentsRecursively(source, targetDir);
    console.log(`✅ ${resolved} has been added to ${targetFile.path}!`);
}

/**
 * Get a list of available layouts from the layouts templates directory.
 * @param {string} layoutsTemplatesDir - Path to the layouts templates directory.
 * @returns {string[]} - Array of layout names.
 */
function getAvailableLayouts(layoutsTemplatesDir: string): string[] {
    return fs.readdirSync(layoutsTemplatesDir).map((file) => path.basename(file));
}

/**
 * Prompt the user to select a layout from a list.
 * @param {string[]} availableLayouts - Array of available layouts.
 * @returns {string} - The selected layout.
 */
async function promptLayoutSelection(availableLayouts: string[]): Promise<string> {
    const { selectedLayout } = await inquirer.prompt([
        {
            type: "list",
            name: "selectedLayout",
            message: "Which layout would you like to add?",
            choices: availableLayouts,
        },
    ]);
    return selectedLayout;
}