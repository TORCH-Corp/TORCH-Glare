import { addFromRegistry } from "../shared/addFromRegistry.js";

/**
 * Add a util and everything it needs.
 *
 * @param {string} name - The name of the util to add.
 * @param {boolean} replace - Overwrite what is already there, dependencies included.
 */
export async function addUtil(name?: string, replace: boolean = false): Promise<void> {
    await addFromRegistry("utils", name, replace);
}
