import fs from 'fs';
import path from 'path';

// Function to copy files and directories recursively
export function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    try {
        if (stats.isDirectory()) {
            // Create the directory in the destination
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest);
            }
            // Read the directory contents and copy each item
            fs.readdirSync(src).forEach((item) => {
                if (!item.endsWith('-dev.tsx')) {
                    copyRecursive(path.join(src, item), path.join(dest, item));
                }
            });
        } else {
            // Copy the file
            fs.copyFileSync(src, dest);
            // Preserve file permissions
            fs.chmodSync(dest, stats.mode);
        }
        return true;
    } catch (err) {
        console.error('Error copying files:', err);
        return false;
    }
}