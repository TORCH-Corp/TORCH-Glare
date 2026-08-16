import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { copyComponentsRecursively } from "./copyComponentsRecursively.js";
import { ensureDirectoryExists } from "./ensureDirectoryExists.js";
import { installNpmPackages } from "./installDependencies.js";
import { isInstalled } from "./resolveEntry.js";
import { loadRegistry } from "./loadRegistry.js";
import { resolveInstallPlan } from "./resolveInstallPlan.js";
import type { Config, RegistryItem } from "../types/main.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** `apps/lib` in the published package — the root every registry `path` is relative to. */
const LIB_DIR = path.resolve(__dirname, "../../../apps/lib");

export interface InstallResult {
    installed: string[];
    skipped: string[];
    npm: string[];
}

/**
 * Install one registry item and everything it needs.
 *
 * Dependencies come from `apps/lib/registry.json` — the same generated graph the docs and the MCP
 * server read — rather than from scanning import statements as files are copied. The old walker had
 * no visited set and no cycle guard, and ran once per copied file, so a 35-file component triggered
 * 35 recursive walks; worse, a dependency skipped because its folder already existed was never
 * descended into, which silently truncated the tree (`add DataViews` installed 16 of 55 items and
 * exited 0).
 *
 * Resolving up front also gives `force` a coherent meaning: it applies to **every** item in the
 * plan, not only the one you named.
 */
export function installFromPlan(
    type: RegistryItem["type"],
    name: string,
    config: Config,
    force: boolean,
): InstallResult | null {
    const registry = loadRegistry();
    const plan = resolveInstallPlan(registry, type, name);
    if (!plan) return null;

    const installed: string[] = [];
    const skipped: string[] = [];

    for (const item of plan.items) {
        const source = path.join(LIB_DIR, item.path);
        if (!fs.existsSync(source)) continue;

        const entry = path.basename(item.path);
        const targetDir = path.join(process.cwd(), config.path.replace("@/", ""), item.type);

        if (isInstalled(targetDir, entry) && !force) {
            skipped.push(`${item.type}/${item.name}`);
            continue;
        }

        // Replacing: clear the old copy first, so a folder that lost files upstream does not keep
        // them locally.
        const target = path.join(targetDir, entry);
        if (force && fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });

        ensureDirectoryExists(targetDir);
        copyComponentsRecursively(source, targetDir);
        installed.push(`${item.type}/${item.name}`);
    }

    // Once, for the union — not once per file, which is what produced five "cn.ts has been added"
    // lines and five separate npm invocations for a single `add`.
    //
    // Pinned to the range the library builds against. Unpinned, `add DataTable` pulled
    // @tanstack/react-table v9 against a component written for v8 — copied code that could not
    // compile on arrival.
    const pinned = [...plan.npmDependencies].map((name) => {
        const range = registry.npmVersions?.[name];
        return range ? `${name}@${range}` : name;
    });
    const npm = installNpmPackages(pinned);

    return { installed, skipped, npm };
}

/** `✅ 55 installed, 0 skipped` — truncation has to be visible, not inferred from silence. */
export function reportInstall(name: string, result: InstallResult, where: string): void {
    const { installed, skipped } = result;
    const total = installed.length + skipped.length;

    if (installed.length === 0 && skipped.length > 0) {
        console.log(`⚠️ ${name} is already installed (${total} items). Use --force to overwrite.`);
        return;
    }

    console.log(
        `✅ ${name} → ${where}: ${installed.length} installed` +
            (skipped.length ? `, ${skipped.length} already present` : "") +
            ` (${total} items).`,
    );
}
