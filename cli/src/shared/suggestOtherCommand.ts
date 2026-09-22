import type { Registry, RegistryItem } from "../types/main.js";

type ItemType = RegistryItem["type"];

/** Which command installs which type, and what to call it in a sentence. */
const KINDS: Record<ItemType, { command: string; label: string }> = {
    components: { command: "add", label: "component" },
    hooks: { command: "hook", label: "hook" },
    utils: { command: "util", label: "utility" },
    layouts: { command: "layout", label: "layout" },
    providers: { command: "provider", label: "provider" },
};

/**
 * A name that is not a component may still be something we ship.
 *
 * `torch-glare add useDragDrop` answering only "Component not found" is technically correct and
 * practically useless — it *is* installable, just by a different command. Look before saying no.
 *
 * Reads the registry index rather than scanning sibling directories in the installed package, so
 * it keeps working once the library stops shipping in the tarball.
 */
export function suggestOtherCommand(
    registry: Registry,
    input: string,
    exclude: ItemType,
): string | null {
    const bare = input.replace(/\.(tsx|ts)$/, "").toLowerCase();

    const match = registry.items.find(
        (item) => item.type !== exclude && item.name.toLowerCase() === bare,
    );
    if (match) {
        const kind = KINDS[match.type];
        return `"${match.name}" is a ${kind.label} — try \`torch-glare ${kind.command} ${match.name}\`.`;
    }

    // No exact match anywhere: offer the closest names of the type they asked for, which catches
    // the ordinary case of a typo or half-remembered name.
    const near = registry.items
        .filter((item) => item.type === exclude)
        .map((item) => item.name)
        .filter((name) => {
            const lower = name.toLowerCase();
            return lower.includes(bare) || bare.includes(lower);
        })
        .slice(0, 3);

    if (near.length) {
        return `Did you mean: ${near.join(", ")}?`;
    }

    return null;
}
