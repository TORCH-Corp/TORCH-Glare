import fs from "fs";
import { tailwindInit } from "../shared/tailwindInit.js";
import { wireStylesheet } from "../shared/wireStylesheet.js";

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

    // Install the Tailwind packages, then actually wire them into the project's stylesheet.
    // Installing them and stopping — which is what this did — leaves a project that builds fine
    // and renders every design token unstyled, with no error to explain it.
    const { isV3 } = tailwindInit();
    wireStylesheet(isV3);
}
