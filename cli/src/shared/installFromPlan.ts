import fs from "fs";
import path from "path";
import { ensureDirectoryExists } from "./ensureDirectoryExists.js";
import { installNpmPackages } from "./installDependencies.js";
import { isInstalled } from "./resolveEntry.js";
import { loadRegistry } from "./loadRegistry.js";
import { fetchRegistryItems, RegistryError } from "./registryClient.js";
import { resolveInstallPlan } from "./resolveInstallPlan.js";
import type { Config, RegistryItem, RegistryItemPayload } from "../types/main.js";

export interface InstallResult {
    installed: string[];
    skipped: string[];
    npm: string[];
}

/** Where this project's files live — `<cwd>/<glare.json path>`, with a leading "@/" stripped. */
export function installRoot(config: Config): string {
    return path.join(process.cwd(), config.path.replace("@/", ""));
}

/**
 * Install one registry item and everything it needs.
 *
 * Dependencies come from the registry index — the same generated graph the docs and the MCP server
 * read — rather than from scanning import statements as files are written. The old walker had no
 * visited set and no cycle guard, and ran once per copied file, so a 35-file component triggered 35
 * recursive walks; worse, a dependency skipped because its folder already existed was never
 * descended into, which silently truncated the tree (`add DataViews` installed 16 of 55 items and
 * exited 0).
 *
 * Resolving up front also gives `force` a coherent meaning: it applies to **every** item in the
 * plan, not only the one you named.
 */
export async function installFromPlan(
    type: RegistryItem["type"],
    name: string,
    config: Config,
    force: boolean,
): Promise<InstallResult | null> {
    const registry = await loadRegistry();
    const plan = resolveInstallPlan(registry, type, name);
    if (!plan) return null;

    const root = installRoot(config);

    // Work out what needs writing before fetching anything — there is no reason to pull 200KB over
    // the network for 55 items only to skip 54 of them as already present.
    const pending: RegistryItem[] = [];
    const skipped: string[] = [];
    for (const item of plan.items) {
        if (isInstalled(path.join(root, item.type), entryOf(item.path)) && !force) {
            skipped.push(`${item.type}/${item.name}`);
        } else {
            pending.push(item);
        }
    }

    const payloads = pending.length
        ? await fetchRegistryItems(pending)
        : new Map<string, RegistryItemPayload>();

    const installed: string[] = [];
    for (const item of pending) {
        const ref = `${item.type}/${item.name}`;
        const payload = payloads.get(ref);
        if (!payload) {
            // The index listed it, so a gap here means the registry is internally inconsistent.
            // The old code `continue`d past a missing source without a word, which is how a
            // partial install passed for a complete one.
            throw new RegistryError(`${ref} is in the registry index but could not be fetched.`);
        }
        writeItem(payload, item.path, root, force);
        installed.push(ref);
    }

    // Once, for the union — not once per file, which is what produced five "cn.ts has been added"
    // lines and five separate npm invocations for a single `add`.
    return {
        installed,
        skipped,
        npm: installNpmPackages(pinRanges(plan.npmDependencies, payloads, registry)),
    };
}

/**
 * Resolve each npm dependency to a spec with its version range attached.
 *
 * Unpinned, `add DataTable` pulled @tanstack/react-table v9 against a component written for v8 —
 * code that could not compile on arrival. Two sources carry the range, and both are consulted:
 * a fetched item payload already has it inlined (`clsx@^2.1.1`), and the index hoists ranges into
 * a shared `npmVersions` map. The payload is preferred because it is the more specific of the two;
 * the index covers items that were skipped and so never fetched.
 *
 * Reading only the index — which is what this did — meant a registry with a sparse `npmVersions`
 * installed everything unpinned in silence, which is the exact failure pinning exists to prevent.
 */
function pinRanges(
    deps: Set<string>,
    payloads: Map<string, RegistryItemPayload>,
    registry: { npmVersions?: Record<string, string> },
): string[] {
    const fromPayloads = new Map<string, string>();
    for (const payload of payloads.values()) {
        for (const spec of payload.dependencies ?? []) {
            // The leading `@` of a scoped package is not a separator.
            const at = spec.lastIndexOf("@");
            if (at > 0) fromPayloads.set(spec.slice(0, at), spec);
        }
    }

    const unpinned: string[] = [];
    const specs = [...deps].map((dep) => {
        const fromPayload = fromPayloads.get(dep);
        if (fromPayload) return fromPayload;

        const range = registry.npmVersions?.[dep];
        if (range) return `${dep}@${range}`;

        unpinned.push(dep);
        return dep;
    });

    if (unpinned.length) {
        console.warn(
            `⚠️  No version range for ${unpinned.join(", ")} — installing the latest. ` +
                `The registry should pin these.`,
        );
    }

    return specs;
}

/** The file or folder an item occupies, e.g. `Button.tsx` or `DataViews`, from its registry path. */
function entryOf(itemPath: string): string {
    return path.basename(itemPath);
}

/** Write one payload's files under `root`, replacing what is there when forced. */
function writeItem(
    payload: RegistryItemPayload,
    itemPath: string,
    root: string,
    force: boolean,
): void {
    const ref = `${payload.type}/${payload.name}`;

    // Replacing: clear the old copy first, so a folder that lost files upstream does not keep
    // them locally.
    const target = path.join(root, payload.type, entryOf(itemPath));
    if (force && fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });

    for (const file of payload.files) {
        const dest = path.join(root, file.target);
        // The target comes off the network, so it is not trusted to stay inside the project.
        // Note there is no `dest !== root` escape hatch: a target of "" or "." normalises to the
        // root itself, which is not a file we should ever write, and letting it through only
        // turned a clear rejection into an EISDIR crash.
        if (!dest.startsWith(root + path.sep)) {
            throw new RegistryError(
                `${ref} wants to write outside the install directory: ${file.target}`
            );
        }
        ensureDirectoryExists(path.dirname(dest));
        fs.writeFileSync(dest, file.content);
    }
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
