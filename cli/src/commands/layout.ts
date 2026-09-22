import { addFromRegistry } from "../shared/addFromRegistry.js";

/**
 * Add a layout and everything it needs.
 *
 * @param {string} name - The name of the layout to add.
 * @param {boolean} replace - Overwrite what is already there, dependencies included.
 */
export async function addLayout(name?: string, replace: boolean = false): Promise<void> {
    await addFromRegistry("layouts", name, replace);
}
