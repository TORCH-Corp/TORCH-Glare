import { addFromRegistry } from "../shared/addFromRegistry.js";

/**
 * Add a component and everything it needs.
 *
 * @param {string} name - The name of the component to add.
 * @param {boolean} replace - Overwrite what is already there, dependencies included.
 */
export async function add(name?: string, replace: boolean = false): Promise<void> {
    await addFromRegistry("components", name, replace);
}
