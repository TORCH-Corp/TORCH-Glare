import fs from "fs";
import path from "path";

/**
 * Resolve a user-provided name to an actual entry in a templates directory.
 *
 * `readdirSync` returns names **with** their extensions, so comparing a bare `useDragDrop` against
 * that list never matches — which is why `torch-glare hook useDragDrop` used to do nothing at all.
 * Every command resolves through here now, so a bare name, a name with an extension, and a folder
 * component all work the same way whichever command you reach for.
 *
 * Tries, in order: exact match · `.tsx` · `.ts` · anything on disk the listing missed.
 */
export function resolveEntry(input: string, available: string[], dir: string): string | null {
    if (available.includes(input)) return input;

    for (const candidate of [`${input}.tsx`, `${input}.ts`]) {
        if (available.includes(candidate)) return candidate;
    }

    // Last-ditch: a folder component, or something the listing filtered out.
    if (fs.existsSync(path.join(dir, input))) return input;
    return null;
}

/**
 * Is this item actually installed?
 *
 * Not `existsSync`. A directory that exists but holds no files is a leftover — from a deleted
 * install, an interrupted run, or a user who removed the contents but not the folder — and
 * treating it as installed is what made `add DataViews` refuse to copy anything while reporting
 * "already exists". An empty directory is an absence.
 */
export function isInstalled(targetDir: string, entry: string): boolean {
    const target = path.join(targetDir, entry);
    if (!fs.existsSync(target)) return false;

    if (fs.lstatSync(target).isDirectory()) {
        return hasAnyFile(target);
    }
    return true;
}

function hasAnyFile(dir: string): boolean {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
        if (item.isDirectory()) {
            if (hasAnyFile(path.join(dir, item.name))) return true;
        } else {
            return true;
        }
    }
    return false;
}
