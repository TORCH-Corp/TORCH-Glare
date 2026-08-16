import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LIB_DIR = path.resolve(__dirname, "../../../apps/lib");

/** Which command installs which folder. */
const KINDS: { dir: string; command: string; label: string }[] = [
    { dir: "hooks", command: "hook", label: "hook" },
    { dir: "utils", command: "util", label: "utility" },
    { dir: "layouts", command: "layout", label: "layout" },
    { dir: "providers", command: "provider", label: "provider" },
];

/**
 * A name that is not a component may still be something we ship.
 *
 * `torch-glare add useDragDrop` answering only "Component not found" is technically correct and
 * practically useless — it *is* installable, just by a different command. Look before saying no.
 */
export function suggestOtherCommand(input: string): string | null {
    const bare = input.replace(/\.(tsx|ts)$/, "").toLowerCase();

    for (const kind of KINDS) {
        const dir = path.join(LIB_DIR, kind.dir);
        if (!fs.existsSync(dir)) continue;

        for (const entry of fs.readdirSync(dir)) {
            if (entry.replace(/\.(tsx|ts)$/, "").toLowerCase() === bare) {
                const name = entry.replace(/\.(tsx|ts)$/, "");
                return `"${name}" is a ${kind.label} — try \`torch-glare ${kind.command} ${name}\`.`;
            }
        }
    }
    return null;
}
