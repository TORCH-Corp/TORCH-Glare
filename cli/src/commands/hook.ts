import { addFromRegistry } from "../shared/addFromRegistry.js";

/**
 * Add a hook and everything it needs.
 *
 * @param {string} name - The name of the hook to add.
 * @param {boolean} replace - Overwrite what is already there, dependencies included.
 */
export async function addHook(name?: string, replace: boolean = false): Promise<void> {
    await addFromRegistry("hooks", name, replace);
}
