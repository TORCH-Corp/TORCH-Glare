import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { Framework, findLayoutPath } from "./detectFramework.js";

const FONT_LINKS = [
    `<link href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css" rel="stylesheet" />`,
    `<link rel="stylesheet" href="https://cdn.statically.io/gh/TORCH-Corp/SF-PRO-FONT/main/font/fonts.css" />`,
    `<link rel="preload" href="https://cdn.statically.io/gh/TORCH-Corp/SF-PRO-FONT/main/font/SF-Pro.woff2" as="font" type="font/woff2" crossOrigin="" />`,
];

/**
 * Configure font links in the project's layout or HTML file.
 */
export async function configureFonts(framework: Framework, defaults: boolean = false): Promise<void> {
    const layoutPath = findLayoutPath(framework);

    if (!layoutPath) {
        console.log("  ⚠️  Could not find layout file. Add font links manually:");
        printManualFontInstructions();
        return;
    }

    const fullPath = path.join(process.cwd(), layoutPath);
    const content = fs.readFileSync(fullPath, "utf-8");

    // Check if fonts are already added
    if (content.includes("remixicon") && content.includes("SF-PRO-FONT")) {
        console.log(`  ✅ ${layoutPath} already has TORCH Glare font links`);
        return;
    }

    // Ask user (skip if defaults mode)
    if (!defaults) {
        const { shouldModify } = await inquirer.prompt([
            {
                type: "confirm",
                name: "shouldModify",
                message: `Add TORCH Glare font links (RemixIcon + SF Pro) to ${layoutPath}?`,
                default: true,
            },
        ]);

        if (!shouldModify) {
            console.log("  ⏭️  Skipped adding font links. Add them manually:");
            printManualFontInstructions();
            return;
        }
    }

    // Backup
    const backupPath = fullPath + ".bak";
    fs.copyFileSync(fullPath, backupPath);
    console.log(`  📋 Backup created: ${layoutPath}.bak`);

    // Inject based on file type
    if (layoutPath.endsWith(".html")) {
        injectIntoHtml(fullPath, content);
    } else {
        injectIntoJsxLayout(fullPath, content);
    }

    console.log(`  ✅ Added font links to ${layoutPath}`);
}

/**
 * Inject font links into an HTML file (Vite/React).
 */
function injectIntoHtml(filePath: string, content: string): void {
    const indent = "    ";
    const fontLinksStr = FONT_LINKS.map(link => `${indent}${link}`).join("\n");

    let modified: string;
    if (content.includes("</head>")) {
        modified = content.replace(
            "</head>",
            `${fontLinksStr}\n  </head>`
        );
    } else {
        // No </head> found, prepend
        modified = `<head>\n${fontLinksStr}\n</head>\n${content}`;
    }

    fs.writeFileSync(filePath, modified);
}

/**
 * Inject font links into a JSX/TSX layout file (Next.js App Router).
 */
function injectIntoJsxLayout(filePath: string, content: string): void {
    const indent = "        ";
    const fontLinksJsx = FONT_LINKS.map(link => `${indent}${link}`).join("\n");

    let modified: string;

    // Try to find <head> tag in the JSX
    if (content.includes("<head>") || content.includes("<head ")) {
        // Insert after <head> opening tag
        modified = content.replace(
            /(<head[^>]*>)/,
            `$1\n${fontLinksJsx}`
        );
    } else if (content.includes("</head>")) {
        modified = content.replace(
            "</head>",
            `${fontLinksJsx}\n${indent}</head>`
        );
    } else if (content.includes("<html")) {
        // Next.js layout without explicit <head> — add <head> tag
        modified = content.replace(
            /(<html[^>]*>)/,
            `$1\n      <head>\n${fontLinksJsx}\n      </head>`
        );
    } else {
        // Fallback: can't figure out where to inject
        console.log("  ⚠️  Could not determine injection point. Add font links manually:");
        printManualFontInstructions();
        return;
    }

    fs.writeFileSync(filePath, modified);
}

function printManualFontInstructions(): void {
    console.log("\n  Add these to your <head>:");
    for (const link of FONT_LINKS) {
        console.log(`    ${link}`);
    }
    console.log("");
}
