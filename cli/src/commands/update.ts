import fs from "fs";
import path from "path";
import { getConfig } from "../shared/getConfig.js";
import { CONFIG_FILE } from "./init.js";
import { Config } from "../types/main.js";
import { tailwindInit } from "../shared/tailwindInit.js";
import readline from "readline";
import { getAvailableFiles } from "../shared/getAvailableFiles.js";
import { loadRegistry } from "../shared/loadRegistry.js";
import { RegistryError } from "../shared/registryClient.js";
import { resolveEntry } from "../shared/resolveEntry.js";
import { namesOfType } from "../shared/addFromRegistry.js";
import type { RegistryItem } from "../types/main.js";
import { add } from "./add.js";
import { addHook } from "./hook.js";
import { addUtil } from "./utils.js";
import { addProvider } from "./provider.js";
import { addLayout } from "./layout.js";

/**
 * Update all installed components, hooks, and utility files by syncing them with the latest templates.
 */
export async function updateInstalledComponents(): Promise<void> {
    const targetFile = getConfig(CONFIG_FILE) as Config;

    // Ask the user if they are sure about updating
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const answer = await new Promise<string>((resolve) => {
        rl.question("Are you sure you want to update all installed components, hooks, and utils? (y/n): ", (input) => {
            resolve(input.trim().toLowerCase());
        });
    });

    rl.close();

    if (answer !== "y") {
        console.log("Update cancelled.");
        return;
    }

    // Fetched once, up front: every `updateItems` pass needs it to tell our items apart from
    // yours, and loadRegistry caches per process anyway.
    let registry;
    try {
        registry = await loadRegistry();
    } catch (error) {
        if (error instanceof RegistryError) {
            console.error(`❌ ${error.message}`);
            process.exitCode = 1;
            return;
        }
        throw error;
    }

    let untouched = 0;
    for (const type of ["components", "hooks", "utils", "providers", "layouts"] as const) {
        untouched += await updateItems(type, targetFile, registry);
    }

    // Your own files live in the same folders as ours, so say plainly that they were left alone
    // rather than leaving you to wonder why the counts do not add up.
    if (untouched > 0) {
        console.log(`ℹ️  Left ${untouched} file(s) alone — not TORCH Glare items.`);
    }

    // Reinitialize Tailwind CSS configuration
    tailwindInit();
    console.log("✅ All installed items have been updated.");
}

/**
 * Re-install the registry items of one type that this project already has.
 *
 * The install directory is **yours**, not ours: `src/components` holds your components alongside
 * the ones Glare installed. Updating used to hand every filename in it to `add`, so each of your
 * own files produced a "not found" error — 22 of them in the Glare website, 8 in products-services
 * — and, once `add` started exiting non-zero on a miss, made a successful update look like a
 * failure. Only names the registry actually contains are ours to update.
 *
 * @returns how many local files were left alone.
 */
async function updateItems(
    type: RegistryItem["type"],
    config: any,
    registry: Awaited<ReturnType<typeof loadRegistry>>,
): Promise<number> {
    const installedItemsDir = getInstalledItemsDir(config, type);

    // Exit if no installed items are found
    if (!checkIfItemsExist(installedItemsDir, type)) {
        return 0;
    }

    // Keep only what the registry knows about; the rest of the folder is the project's own.
    const known = namesOfType(registry, type);
    const present = getAvailableFiles(installedItemsDir);
    const ours: string[] = [];
    let untouched = 0;
    for (const entry of present) {
        const resolved = resolveEntry(entry, known);
        if (resolved) ours.push(resolved);
        else untouched++;
    }

    if (ours.length === 0) {
        console.log(`✅ No ${type} to update.`);
        return untouched;
    }

    console.log(`🔄 Updating installed ${type}...`);

    const installers: Record<string, (name: string, replace: boolean) => Promise<void>> = {
        components: add,
        hooks: addHook,
        utils: addUtil,
        providers: addProvider,
        layouts: addLayout,
    };

    const install = installers[type];
    if (!install) {
        console.log(`❌ Unknown item type: ${type}`);
        return untouched;
    }

    // Sequentially, and awaited. This was a `forEach` over async calls with no `await`, so every
    // item installed at once, out of order, with each rejection unhandled. Copying local files
    // mostly survived that; fetching over HTTP would not — it opens one connection per installed
    // item and races several npm invocations against each other in the same project.
    for (const item of ours) {
        await install(item, true);
    }

    return untouched;
}

/**
 * Get the directory path for installed items (components, hooks, or utils).
 * @param {object} config - Configuration object.
 * @param {string} type - The type of items (e.g., "components", "hooks", "utils").
 * @returns {string} - Path to the installed items directory.
 */
function getInstalledItemsDir(config: any, type: string): string {
    const normalizedPath = config.path.replace("@/", "");
    return path.join(process.cwd(), normalizedPath, type);
}

/**
 * Check if the installed items directory exists.
 * @param {string} installedItemsDir - Path to the installed items directory.
 * @param {string} type - The type of items being checked.
 * @returns {boolean} - True if the directory exists, false otherwise.
 */
function checkIfItemsExist(installedItemsDir: string, type: string): boolean {
    if (!fs.existsSync(installedItemsDir)) {
        console.log(`❌ No installed ${type} found.`);
        return false;
    }
    return true;
}

