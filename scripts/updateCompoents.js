import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert the module URL to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.resolve(__dirname, '../apps/lib');
const destDir = path.resolve(__dirname, '../lib');

// Ensure the destination directory exists 
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// Function to copy files and directories recursively
function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        // Create the directory in the destination
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        // Read the directory contents and copy each item
        fs.readdirSync(src).forEach((item) => {
            copyRecursive(path.join(src, item), path.join(dest, item));
        });
    } else {
        // Copy the file
        fs.copyFileSync(src, dest);
        // Preserve file permissions
        fs.chmodSync(dest, stats.mode);
    }
}

// Start copying
try {
    copyRecursive(sourceDir, destDir);
    console.log('Files and folders copied successfully!');
} catch (err) {
    console.error('Error copying files:', err);
}