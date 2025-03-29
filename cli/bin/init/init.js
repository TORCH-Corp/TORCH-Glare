import fs from "fs";
import { tailwindInit } from "./tailwindInit.js";
export async function initConfig(CONFIG_FILE) {
  const defaultConfig = { path: "./" };

  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
    console.log("✅ Created glare.json configuration file");
  } else {
    console.log("⚠️ glare.json already exists, skipping creation.");
  }

  // Initialize Tailwind CSS config if not exists
  tailwindInit();
}
