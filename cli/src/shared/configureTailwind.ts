import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { findTailwindConfigPath } from "./detectFramework.js";

const TAILWIND_V3_TEMPLATE = (contentPaths: string[]) => `\
const { plugin, mappingVars } = require('mapping-color-system')
import type { Config } from "tailwindcss";

export default {
  content: [
${contentPaths.map(p => `    "${p}",`).join("\n")}
  ],
  theme: {
    extend: {
      colors: {
        ...mappingVars,
      },
    },
  },
  plugins: [
    plugin,
    require('tailwindcss-animate'),
    require('tailwind-scrollbar-hide'),
    require('glare-typography'),
    require('glare-torch-mode'),
    function ({ addVariant }: any) {
      addVariant("rtl", '&[dir="rtl"]');
      addVariant("ltr", '&[dir="ltr"]');
    },
  ],
} satisfies Config;
`;

/**
 * Configure Tailwind CSS for v3 projects.
 * If no config exists, creates one from template.
 * If config exists, asks the user then injects TORCH plugins.
 */
export async function configureTailwindV3(basePath: string, defaults: boolean = false): Promise<string> {
    const existingConfig = findTailwindConfigPath();
    const contentPaths = buildContentPaths(basePath);

    if (!existingConfig) {
        // Create new config
        const configPath = "tailwind.config.ts";
        const fullPath = path.join(process.cwd(), configPath);
        fs.writeFileSync(fullPath, TAILWIND_V3_TEMPLATE(contentPaths));
        console.log(`  ✅ Created ${configPath}`);
        return configPath;
    }

    // Config exists - ask user (skip if defaults mode)
    if (!defaults) {
        const { shouldModify } = await inquirer.prompt([
            {
                type: "confirm",
                name: "shouldModify",
                message: `${existingConfig} already exists. Add TORCH Glare plugins to it?`,
                default: true,
            },
        ]);

        if (!shouldModify) {
            console.log(`  ⏭️  Skipped modifying ${existingConfig}`);
            return existingConfig;
        }
    }

    // Create backup
    const fullPath = path.join(process.cwd(), existingConfig);
    const backupPath = fullPath + ".bak";
    fs.copyFileSync(fullPath, backupPath);
    console.log(`  📋 Backup created: ${existingConfig}.bak`);

    // Inject into existing config
    const content = fs.readFileSync(fullPath, "utf-8");
    const modified = injectIntoTailwindConfig(content, contentPaths);
    fs.writeFileSync(fullPath, modified);
    console.log(`  ✅ Updated ${existingConfig} with TORCH Glare plugins`);

    return existingConfig;
}

/**
 * Inject TORCH Glare plugins into an existing Tailwind v3 config.
 */
function injectIntoTailwindConfig(content: string, contentPaths: string[]): string {
    let result = content;

    // Check what's missing based on original content before any modifications
    const needsImport = !content.includes("mapping-color-system");
    const needsMappingVars = !content.includes("...mappingVars");

    // Add mapping-color-system import at the top if not present
    if (needsImport) {
        result = `const { plugin, mappingVars } = require('mapping-color-system')\n${result}`;
    }

    // Add mappingVars to theme.extend.colors if not already spread in colors
    if (needsMappingVars) {
        // Try to find theme.extend.colors
        if (result.includes("extend:")) {
            if (result.includes("colors:")) {
                // Add mappingVars spread into existing colors
                result = result.replace(
                    /(colors:\s*\{)/,
                    "$1\n        ...mappingVars,"
                );
            } else {
                // Replace empty extend: {} or add colors into extend
                result = result.replace(
                    /extend:\s*\{\s*\}/,
                    "extend: {\n      colors: {\n        ...mappingVars,\n      },\n    }"
                );
                // If extend wasn't empty (no replacement happened), inject inside it
                if (!result.includes("...mappingVars")) {
                    result = result.replace(
                        /(extend:\s*\{)/,
                        "$1\n      colors: {\n        ...mappingVars,\n      },"
                    );
                }
            }
        } else if (result.includes("theme:")) {
            result = result.replace(
                /(theme:\s*\{)/,
                "$1\n    extend: {\n      colors: {\n        ...mappingVars,\n      },\n    },"
            );
        }
    }

    // Add plugins if not present (check against original content to avoid false positives)
    const pluginsToAdd = [
        { check: "mapping-color-system", value: "plugin" },
        { check: "tailwindcss-animate", value: "require('tailwindcss-animate')" },
        { check: "tailwind-scrollbar-hide", value: "require('tailwind-scrollbar-hide')" },
        { check: "glare-typography", value: "require('glare-typography')" },
        { check: "glare-torch-mode", value: "require('glare-torch-mode')" },
    ];

    const rtlVariant = `function ({ addVariant }: any) {
      addVariant("rtl", '&[dir="rtl"]');
      addVariant("ltr", '&[dir="ltr"]');
    }`;

    if (result.includes("plugins:") || result.includes("plugins :")) {
        // Insert missing plugins into existing plugins array
        // Use original content for checks to avoid false positives from added require()
        for (const p of pluginsToAdd) {
            if (!content.includes(p.check)) {
                result = result.replace(
                    /(plugins:\s*\[)/,
                    `$1\n    ${p.value},`
                );
            }
        }
        // Add RTL/LTR variant if not present
        if (!content.includes("addVariant")) {
            result = result.replace(
                /(plugins:\s*\[[\s\S]*?)(]\s*[,}])/,
                `$1\n    ${rtlVariant},\n  $2`
            );
        }
    } else {
        // Add plugins array before the closing of the config
        const allPlugins = pluginsToAdd.map(p => `    ${p.value},`).join("\n");
        result = result.replace(
            /}(\s*satisfies|\s*as|\s*;|\s*$)/,
            `  plugins: [\n${allPlugins}\n    ${rtlVariant},\n  ],\n}$1`
        );
    }

    // Add content paths if the component path is missing
    for (const cp of contentPaths) {
        if (!result.includes(cp)) {
            if (result.includes("content:")) {
                result = result.replace(
                    /(content:\s*\[)/,
                    `$1\n    "${cp}",`
                );
            }
        }
    }

    return result;
}

/**
 * Build content paths based on the base installation path.
 */
function buildContentPaths(basePath: string): string[] {
    const normalized = basePath.replace(/^\.\//, "").replace(/\/$/, "");
    const paths = [
        `./${normalized}/**/*.{js,ts,jsx,tsx}`,
    ];

    // Add common patterns
    if (!normalized.includes("app")) {
        paths.push("./app/**/*.{js,ts,jsx,tsx}");
    }

    return paths;
}
