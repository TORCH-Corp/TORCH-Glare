import fs from "fs";

export function getConfig(CONFIG_FILE: string) {
    if (!fs.existsSync(CONFIG_FILE)) {
        console.error('❌ glare.json not found. Run "npx torch-glare@latest init" first');
        process.exit(1);
    }

    try {
        return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
    } catch (error: any) {
        console.error("❌ Error reading glare.json:", error.message);
        process.exit(1);
    }
}