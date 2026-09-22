import inquirer from "inquirer";
import { getConfig } from "./getConfig.js";
import { installFromPlan, reportInstall } from "./installFromPlan.js";
import { loadRegistry } from "./loadRegistry.js";
import { RegistryError } from "./registryClient.js";
import { resolveEntry } from "./resolveEntry.js";
import { suggestOtherCommand } from "./suggestOtherCommand.js";
import { CONFIG_FILE } from "../commands/init.js";
import type { Config, Registry, RegistryItem } from "../types/main.js";

type ItemType = RegistryItem["type"];

const NOUN_FOR_TYPE: Record<ItemType, string> = {
    components: "component",
    hooks: "hook",
    utils: "util",
    layouts: "layout",
    providers: "provider",
};

/**
 * The body shared by `add`, `hook`, `util`, `layout` and `provider`.
 *
 * These were five near-identical copies of the same six steps, each with its own private
 * `readdirSync` of a templates directory and its own verbatim copy of a ~15-line "not in the
 * registry" fallback. That fallback existed because the CLI listed the filesystem and the registry
 * could disagree with it; the registry is now the only source of truth for what exists, so the
 * disagreement — and the fallback — cannot happen.
 */
export async function addFromRegistry(
    type: ItemType,
    requested: string | undefined,
    force: boolean,
): Promise<void> {
    const config = getConfig(CONFIG_FILE) as Config;

    try {
        const registry = await loadRegistry();
        const available = namesOfType(registry, type);
        if (available.length === 0) {
            console.error(`❌ The registry lists no ${NOUN_FOR_TYPE[type]}s.`);
            process.exitCode = 1;
            return;
        }

        const name = requested ?? (await promptSelection(type, available));

        const resolved = resolveEntry(name, available);
        if (!resolved) {
            console.error(`❌ ${capitalize(NOUN_FOR_TYPE[type])} "${name}" not found.`);
            // It may well exist under another type. Say which command to use rather than leaving
            // the caller to guess.
            const hint = suggestOtherCommand(registry, name, type);
            if (hint) console.error(`   ${hint}`);
            // Non-zero so `torch-glare add Buton && next build` stops rather than building
            // against a component that was never installed.
            process.exitCode = 1;
            return;
        }

        const result = await installFromPlan(type, resolved, config, force);
        if (!result) {
            // resolveEntry matched against this same index, so the item is present by construction.
            console.error(`❌ "${resolved}" is in the registry index but has no entry to install.`);
            process.exitCode = 1;
            return;
        }
        reportInstall(resolved, result, config.path);
    } catch (error) {
        if (error instanceof RegistryError) {
            console.error(`❌ ${error.message}`);
            process.exitCode = 1;
            return;
        }
        throw error;
    }
}

/** Installable names of one type, sorted for a stable prompt. */
export function namesOfType(registry: Registry, type: ItemType): string[] {
    return registry.items
        .filter((item) => item.type === type)
        .map((item) => item.name)
        .sort((a, b) => a.localeCompare(b));
}

async function promptSelection(type: ItemType, available: string[]): Promise<string> {
    const { selected } = await inquirer.prompt([
        {
            type: "list",
            name: "selected",
            message: `Which ${NOUN_FOR_TYPE[type]} would you like to add?`,
            choices: available,
        },
    ]);
    return selected;
}

function capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
