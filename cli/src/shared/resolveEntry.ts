import fs from "fs";
import path from "path";

/**
 * Resolve a user-provided name to a registry item name.
 *
 * `available` is now the registry's own list of item names, not a `readdirSync` of a templates
 * directory. That inversion matters: resolution used to be filesystem-first, so a name the local
 * listing did not contain was rejected before the registry was ever consulted — which made every
 * component that exists only in the hosted registry unreachable.
 *
 * Registry names carry no extension, so a user typing `Button.tsx` (or copying it out of a file
 * tree) has it stripped rather than failing to match.
 *
 * Tries, in order: exact · extension stripped · case-insensitive.
 */
export function resolveEntry(input: string, available: string[]): string | null {
    const candidates = [input, input.replace(/\.(tsx|ts)$/, "")];

    for (const candidate of candidates) {
        if (available.includes(candidate)) return candidate;
    }

    // `torch-glare add button` should not be a dead end when `Button` is right there.
    for (const candidate of candidates) {
        const match = available.find((name) => name.toLowerCase() === candidate.toLowerCase());
        if (match) return match;
    }

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
