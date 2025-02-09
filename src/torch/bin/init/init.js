import fs from "fs";
import { tailwindInit } from "./tailwind.js";
import { addComponent } from "../add.js";
export async function initConfig(CONFIG_FILE) {
  const defaultConfig = { path: "src/components" };

  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
    console.log("✅ Created torch.json configuration file");
  } else {
    console.log("⚠️ torch.json already exists, skipping creation.");
  }

  // Initialize Tailwind CSS config if not exists
  tailwindInit();
  // Add utils file
  await addComponent("utils", ".ts");
}
