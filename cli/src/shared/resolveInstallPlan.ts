import type { InstallPlan, Registry, RegistryItem } from "../types/main.js";

/**
 * Resolve the full install plan for a single registry item: the transitive closure of
 * its internal (registry) dependencies plus the union of all npm dependencies along the way.
 *
 * @param {Registry} registry - The loaded registry manifest.
 * @param {string} type - The item type (folder name), e.g. "components".
 * @param {string} name - The item name without extension, e.g. "Select".
 * @returns {InstallPlan | null} The plan, or null if the entry item is not in the registry.
 */
export function resolveInstallPlan(
    registry: Registry,
    type: string,
    name: string
): InstallPlan | null {
    const byRef = new Map<string, RegistryItem>();
    for (const item of registry.items) byRef.set(`${item.type}/${item.name}`, item);

    const entry = byRef.get(`${type}/${name}`);
    if (!entry) return null;

    const items: RegistryItem[] = [];
    const npmDependencies = new Set<string>();
    const visited = new Set<string>();

    const stack = [`${type}/${name}`];
    while (stack.length) {
        const ref = stack.pop() as string;
        if (visited.has(ref)) continue;
        visited.add(ref);

        const item = byRef.get(ref);
        if (!item) continue; // dangling refs are validated at generation time; skip defensively

        items.push(item);
        for (const dep of item.npmDependencies) npmDependencies.add(dep);
        for (const dep of item.registryDependencies) {
            if (!visited.has(dep)) stack.push(dep);
        }
    }

    return { items, npmDependencies };
}
