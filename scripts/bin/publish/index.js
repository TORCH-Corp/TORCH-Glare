import { copyRecursive } from "../../utils/copyRecursive.js";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { execSync } from "child_process";

// Convert the module URL to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.resolve(__dirname, '../../apps/lib');
const destDir = path.resolve(__dirname, '../../lib');

// Ensure the destination directory exists 
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}


async function publish() {
    // Start copying
    try {
        if (copyRecursive(sourceDir, destDir)) {
            execSync("npm publish --access public", { stdio: "inherit" });
        }
    } catch (err) {
        console.error('Error copying files:', err);
    }
}

publish();
