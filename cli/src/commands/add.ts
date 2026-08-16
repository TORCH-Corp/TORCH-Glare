import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import { ensureDirectoryExists } from "../shared/ensureDirectoryExists.js";
import { getInstallPaths } from "../shared/getInstallPaths.js";
import { Config } from "../types/main.js";
import { copyComponentsRecursively } from "../shared/copyComponentsRecursively.js";
import { getAvailableFiles } from "../shared/getAvailableFiles.js";
import { installDependencies } from "../shared/installDependencies.js";
import { installFromPlan, reportInstall } from "../shared/installFromPlan.js";
import { isInstalled, resolveEntry } from "../shared/resolveEntry.js";
import { getConfig } from "../shared/getConfig.js";
import { suggestOtherCommand } from "../shared/suggestOtherCommand.js";
import { CONFIG_FILE } from "./init.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatesDir = path.resolve(__dirname, "../../../apps/lib/components");

/**
 * Add a component and everything it needs.
 *
 * @param {string} component - The name of the component to add.
 * @param {boolean} replace - Overwrite what is already there, dependencies included.
 */
export async function add(component?: string, replace: boolean = false): Promise<void> {
    const targetFile = getConfig(CONFIG_FILE) as Config;
    const availableComponents = getAvailableFiles(templatesDir);

    if (!component) {
        component = await promptComponentSelection(availableComponents);
    }

    const resolved = resolveEntry(component, availableComponents, templatesDir);
    if (!resolved) {
        console.error(`❌ Component "${component}" not found.`);
        // It may well exist — as a hook, util, layout or provider. Say which command to use rather
        // than leaving the caller to guess.
        const hint = suggestOtherCommand(component);
        if (hint) console.error(`   ${hint}`);
        return;
    }

    // The registry knows the whole graph, so resolve it in one pass. `replace` reaches every item
    // in the plan, which is what `--force` has always implied and never did.
    const name = resolved.replace(/\.(tsx|ts)$/, "");
    const result = installFromPlan("components", name, targetFile, replace);

    if (result) {
        reportInstall(resolved, result, targetFile.path);
        return;
    }

    // Not in the registry — something added to apps/lib before `pnpm run registry` was re-run.
    // Copy it alone and say so, rather than pretending the dependencies were handled.
    console.warn(
        `⚠️ "${resolved}" is not in registry.json, so its dependencies cannot be resolved.\n` +
            `   Copying the files only. Re-run \`pnpm run registry\` in the library to fix this.`,
    );
    const { source, targetDir } = getInstallPaths(resolved, targetFile, templatesDir, "components");
    if (isInstalled(targetDir, resolved) && !replace) {
        console.log(`⚠️ Component "${resolved}" already exists.`);
        return;
    }
    ensureDirectoryExists(targetDir);
    copyComponentsRecursively(source, targetDir);
    installDependencies(source);
    console.log(`✅ ${resolved} has been added to ${targetFile.path}!`);
}

/**
 * Prompt the user to select a component from a list.
 * @param {string[]} availableComponents - Array of available components.
 * @returns {string} - The selected component.
 */
async function promptComponentSelection(availableComponents: string[]): Promise<string> {
    const { selectedComponent } = await inquirer.prompt([
        {
            type: "list",
            name: "selectedComponent",
            message: "Which component would you like to add?",
            choices: availableComponents,
        },
    ]);
    return selectedComponent;
}

