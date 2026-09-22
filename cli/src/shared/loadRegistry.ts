import { Registry } from "../types/main.js";
import { fetchRegistryIndex, indexUrl, RegistryError } from "./registryClient.js";

let cached: Registry | null = null;

/**
 * Load and cache the component registry index.
 *
 * Fetched once per process and handed to `resolveInstallPlan`, which walks dependencies locally
 * rather than recursing over the network per item.
 *
 * There is no local fallback. The CLI used to ship the whole library inside its own tarball and
 * could quietly install from that when the network failed; it no longer carries it, so "the
 * registry is unreachable" is a real failure and is reported as one. Silently succeeding from a
 * stale bundle was how a project ended up with component source nobody could account for.
 */
export async function loadRegistry(): Promise<Registry> {
    if (cached) return cached;

    try {
        cached = await fetchRegistryIndex();
    } catch (error) {
        const reason = error instanceof RegistryError ? error.message : String(error);
        throw new RegistryError(`${reason}\n   Registry: ${indexUrl()}`);
    }

    return cached;
}

/** Test seam — the module-level cache would otherwise leak between cases. */
export function resetRegistryCache(): void {
    cached = null;
}
