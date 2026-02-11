import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { Framework, findGlobalCssPath } from "./detectFramework.js";

const V4_PLUGIN_DIRECTIVES = `@import "tailwindcss";
@plugin "glare-torch-mode";
@plugin "tailwind-scrollbar-hide";
@plugin "tailwindcss-animate";
@plugin "glare-typography";
@plugin "mapping-color-system-v4";
@import "mapping-color-system-v4/tailwindVars.css";
`;

const V3_TAILWIND_DIRECTIVES = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

/**
 * Configure the global CSS file based on Tailwind version.
 */
export async function configureGlobalCss(framework: Framework, tailwindVersion: 3 | 4, defaults: boolean = false): Promise<string | null> {
    const existingCss = findGlobalCssPath(framework);

    if (tailwindVersion === 4) {
        return await configureV4Css(existingCss, framework, defaults);
    } else {
        return await configureV3Css(existingCss, framework, defaults);
    }
}

/**
 * Configure global CSS for Tailwind v4 (add @plugin directives).
 */
async function configureV4Css(existingCss: string | null, framework: Framework, defaults: boolean = false): Promise<string | null> {
    if (!existingCss) {
        // Create new CSS file
        const cssPath = framework === "next" ? "app/globals.css" : "src/index.css";
        const fullPath = path.join(process.cwd(), cssPath);
        ensureDir(path.dirname(fullPath));
        fs.writeFileSync(fullPath, V4_PLUGIN_DIRECTIVES + "\n");
        console.log(`  ✅ Created ${cssPath} with Tailwind v4 plugin directives`);
        return cssPath;
    }

    // Check if already configured
    const fullPath = path.join(process.cwd(), existingCss);
    const content = fs.readFileSync(fullPath, "utf-8");

    if (content.includes("glare-torch-mode")) {
        console.log(`  ✅ ${existingCss} already has TORCH Glare plugins`);
        return existingCss;
    }

    // Ask user (skip if defaults mode)
    if (!defaults) {
        const { shouldModify } = await inquirer.prompt([
            {
                type: "confirm",
                name: "shouldModify",
                message: `${existingCss} exists. Add TORCH Glare v4 plugin directives?`,
                default: true,
            },
        ]);

        if (!shouldModify) {
            console.log(`  ⏭️  Skipped modifying ${existingCss}`);
            return existingCss;
        }
    }

    // Backup and modify
    const backupPath = fullPath + ".bak";
    fs.copyFileSync(fullPath, backupPath);
    console.log(`  📋 Backup created: ${existingCss}.bak`);

    // Build the directives to add (only missing ones)
    const lines = V4_PLUGIN_DIRECTIVES.split("\n").filter(line => line.trim());
    const missingLines = lines.filter(line => !content.includes(line.trim()));

    if (missingLines.length > 0) {
        // Replace @import "tailwindcss" if present, or prepend
        let modified = content;
        if (content.includes('@import "tailwindcss"') || content.includes("@import 'tailwindcss'")) {
            // Add plugin directives after the tailwindcss import
            modified = content.replace(
                /(@import\s+["']tailwindcss["'];?\s*\n?)/,
                `$1${missingLines.filter(l => !l.includes('@import "tailwindcss"')).join("\n")}\n`
            );
        } else {
            // Prepend all directives
            modified = missingLines.join("\n") + "\n\n" + content;
        }
        fs.writeFileSync(fullPath, modified);
    }

    console.log(`  ✅ Updated ${existingCss} with Tailwind v4 plugin directives`);
    return existingCss;
}

/**
 * Configure global CSS for Tailwind v3 (ensure @tailwind directives exist).
 */
async function configureV3Css(existingCss: string | null, framework: Framework, defaults: boolean = false): Promise<string | null> {
    if (!existingCss) {
        // Create new CSS file
        const cssPath = framework === "next" ? "app/globals.css" : "src/index.css";
        const fullPath = path.join(process.cwd(), cssPath);
        ensureDir(path.dirname(fullPath));
        fs.writeFileSync(fullPath, V3_TAILWIND_DIRECTIVES + "\n");
        console.log(`  ✅ Created ${cssPath} with Tailwind v3 directives`);
        return cssPath;
    }

    // Check if @tailwind directives already exist
    const fullPath = path.join(process.cwd(), existingCss);
    const content = fs.readFileSync(fullPath, "utf-8");

    if (content.includes("@tailwind base")) {
        console.log(`  ✅ ${existingCss} already has Tailwind directives`);
        return existingCss;
    }

    // Ask user (skip if defaults mode)
    if (!defaults) {
        const { shouldModify } = await inquirer.prompt([
            {
                type: "confirm",
                name: "shouldModify",
                message: `${existingCss} exists but missing @tailwind directives. Add them?`,
                default: true,
            },
        ]);

        if (!shouldModify) {
            return existingCss;
        }
    }

    // Backup and prepend
    const backupPath = fullPath + ".bak";
    fs.copyFileSync(fullPath, backupPath);
    console.log(`  📋 Backup created: ${existingCss}.bak`);

    fs.writeFileSync(fullPath, V3_TAILWIND_DIRECTIVES + "\n" + content);
    console.log(`  ✅ Updated ${existingCss} with Tailwind v3 directives`);
    return existingCss;
}

function ensureDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}
