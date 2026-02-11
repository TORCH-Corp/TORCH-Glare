import fs from "fs";
import { Config, Category } from "../types/main.js";

/**
 * Read and normalize the glare.json config file.
 * Supports both legacy format ({ path: "./src/" }) and new format ({ aliases: {...} }).
 */
export function getConfig(CONFIG_FILE: string): Config {
    if (!fs.existsSync(CONFIG_FILE)) {
        console.error('❌ glare.json not found. Run "npx torch-glare@latest init" first');
        process.exit(1);
    }

    try {
        const raw = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
        return normalizeConfig(raw);
    } catch (error: any) {
        console.error("❌ Error reading glare.json:", error.message);
        process.exit(1);
    }
}

/**
 * Normalize config to ensure aliases exist.
 * If legacy format (only path), derive aliases from path.
 */
function normalizeConfig(raw: any): Config {
    // New format - has aliases
    if (raw.aliases) {
        return raw as Config;
    }

    // Legacy format - only has path
    if (raw.path) {
        const basePath = raw.path.endsWith("/") ? raw.path : raw.path + "/";
        return {
            ...raw,
            aliases: {
                components: `${basePath}components`,
                hooks: `${basePath}hooks`,
                utils: `${basePath}utils`,
                providers: `${basePath}providers`,
                layouts: `${basePath}layouts`,
            },
        };
    }

    // Fallback
    return {
        path: "./",
        aliases: {
            components: "./components",
            hooks: "./hooks",
            utils: "./utils",
            providers: "./providers",
            layouts: "./layouts",
        },
    };
}

/**
 * Get the resolved filesystem path for a given category from the config.
 */
export function getResolvedPath(config: Config, category: Category): string {
    if (config.aliases && config.aliases[category]) {
        return config.aliases[category].replace("@/", "").replace(/^\.\//, "");
    }
    // Legacy fallback
    const basePath = (config.path || "./").replace("@/", "").replace(/^\.\//, "");
    return `${basePath}${category}`;
}
