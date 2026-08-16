import fs from "fs";
import path from "path";
import { getConfig } from "../shared/getConfig.js";
import { CONFIG_FILE } from "./init.js";
import { Config } from "../types/main.js";
import { fileURLToPath } from "url";
import { ensureDirectoryExists } from "../shared/ensureDirectoryExists.js";
import { getInstallPaths } from "../shared/getInstallPaths.js";
import inquirer from "inquirer";
import { copyComponentsRecursively } from "../shared/copyComponentsRecursively.js";
import { installFromPlan, reportInstall } from "../shared/installFromPlan.js";
import { isInstalled, resolveEntry } from "../shared/resolveEntry.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the utils templates directory
const utilsTemplatesDir: string = path.resolve(__dirname, "../../../apps/lib/utils");

/**
 * Main function to add a utility file and its dependencies.
 * @param {string} util - The name of the utility file to add.
* @param {boolean} replace - Whether to replace the existing utility file.
 */
export async function addUtil(util?: string, replace: boolean = false): Promise<void> {
    const targetFile = getConfig(CONFIG_FILE) as Config;
    const availableUtils: string[] = getAvailableUtils(utilsTemplatesDir);

    // If no utility file is provided, prompt the user to select one
    if (!util) {
        util = await promptUtilSelection(availableUtils);
    }

    // Resolve user input — accepts "cn", "cn.ts", or a folder name like "dataViews".
    const resolved = resolveEntry(util, availableUtils, utilsTemplatesDir);
    if (!resolved) {
        console.error(`❌ Utility file "${util}" not found.`);
        return;
    }
    util = resolved;

    // The registry resolves the whole graph in one pass, so `replace` reaches every item.
    const name = resolved.replace(/\.(tsx|ts)$/, "");
    const result = installFromPlan("utils", name, targetFile, replace);
    if (result) {
        reportInstall(resolved, result, targetFile.path);
        return;
    }

    // Not in registry.json — copy it alone, and say why the dependencies were not resolved.
    console.warn(
        `⚠️ "${resolved}" is not in registry.json, so its dependencies cannot be resolved.\n` +
            `   Copying the file only. Re-run \`pnpm run registry\` in the library to fix this.`,
    );
    const { source, targetDir } = getInstallPaths(util, targetFile, utilsTemplatesDir, "utils");

    // Check *before* removing anything. This used to `rmSync` the target first, which made the
    // check below permanently false — so every visit re-copied the file and re-printed the success
    // line, which is why one `add` reported "cn.ts has been added" five times.
    if (isInstalled(targetDir, util) && !replace) {
        console.log(`⚠️ Utility file "${util}" already exists.`);
        return;
    }

    const target: string = path.join(targetDir, util);
    if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
    ensureDirectoryExists(targetDir);
    copyComponentsRecursively(source, target);
    console.log(`✅ ${util} has been added to ${targetFile.path}!`);
}

/**
 * Get a list of available utility files from the utils templates directory.
 * @param {string} utilsTemplatesDir - Path to the utils templates directory.
 * @returns {string[]} - Array of utility file names.
 */
function getAvailableUtils(utilsTemplatesDir: string): string[] {
    return fs.readdirSync(utilsTemplatesDir).map((file) => path.basename(file));
}


/**
 * Prompt the user to select a utility file from a list.
 * @param {string[]} availableUtils - Array of available utility files.
 * @returns {string} - The selected utility file.
 */
async function promptUtilSelection(availableUtils: string[]): Promise<string> {
    const { selectedUtil } = await inquirer.prompt([
        {
            type: "list",
            name: "selectedUtil",
            message: "Which utility file would you like to add?",
            choices: availableUtils,
        },
    ]);
    return selectedUtil;
}
