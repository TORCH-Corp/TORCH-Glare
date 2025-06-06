import fs from "fs";
import { tailwindInit } from "../shared/tailwindInit.js";

interface GlareConfig {
    path: string;
}

export const CONFIG_FILE = "glare.json";


export async function initConfig(): Promise<void> {
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
