import fs from "fs";
import { tailwindInit } from "../utils/tailwindInit.js";

interface GlareConfig {
    path: string;
}

export async function initConfig(CONFIG_FILE: string): Promise<void> {
    const defaultConfig: GlareConfig = { path: "./" };

    if (!fs.existsSync(CONFIG_FILE)) {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
        console.log("✅ Created glare.json configuration file");
    } else {
        console.log("⚠️ glare.json already exists, skipping creation.");
    }

    // Initialize Tailwind CSS config if not exists
    tailwindInit();
}
