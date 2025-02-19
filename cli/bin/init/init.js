import fs from "fs";
import { tailwindInit } from "./tailwindInit.js";
import { addUtil } from "../addUtils.js";
export async function initConfig(CONFIG_FILE) {
  const defaultConfig = { path: "src/" };

  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
    console.log("✅ Created torch.json configuration file");
  } else {
    console.log("⚠️ torch.json already exists, skipping creation.");
  }

  // Initialize Tailwind CSS config if not exists
  tailwindInit();
  // Add utils file
  await addUtil("cn.ts");
}
