import { addFromRegistry } from "../shared/addFromRegistry.js";

/**
 * Add a provider and everything it needs.
 *
 * @param {string} name - The name of the provider to add.
 * @param {boolean} replace - Overwrite what is already there, dependencies included.
 */
export async function addProvider(name?: string, replace: boolean = false): Promise<void> {
    await addFromRegistry("providers", name, replace);
}
