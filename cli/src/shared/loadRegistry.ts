import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Registry } from "../types/main.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// registry.json ships alongside the library source (apps/lib), the same location the
// command modules resolve their template dirs from.
const REGISTRY_PATH = path.resolve(__dirname, "../../../apps/lib/registry.json");

let cached: Registry | null = null;

/**
 * Load and cache the generated component registry.
 * @returns {Registry} The parsed registry manifest.
 */
export function loadRegistry(): Registry {
    if (cached) return cached;

    if (!fs.existsSync(REGISTRY_PATH)) {
        console.error(
            "❌ registry.json not found. It is generated from library source via " +
                "`node scripts/bin/generateRegistry/index.js`."
        );
        process.exit(1);
    }

    try {
        cached = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf-8")) as Registry;
        return cached;
    } catch (error) {
        console.error("❌ Error reading registry.json:", (error as Error).message);
        process.exit(1);
    }
}
