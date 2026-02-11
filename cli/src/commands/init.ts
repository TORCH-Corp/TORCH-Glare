import fs from "fs";
import inquirer from "inquirer";
import { detectFramework, detectTailwindVersion, findGlobalCssPath } from "../shared/detectFramework.js";
import { detectPackageManager } from "../shared/detectPackageManager.js";
import { resolveAliases } from "../shared/resolveAliases.js";
import { tailwindInit } from "../shared/tailwindInit.js";
import { configureTailwindV3 } from "../shared/configureTailwind.js";
import { configureGlobalCss } from "../shared/configureGlobalCss.js";
import { configureFonts } from "../shared/configureFonts.js";
import { installBaseUtils } from "../shared/installBaseUtils.js";
import { Config } from "../types/main.js";

export const CONFIG_FILE = "glare.json";

/**
 * Initialize TORCH Glare in the project.
 * Auto-detects framework, Tailwind version, package manager, and path aliases.
 * Configures everything needed so user can immediately run `torch-glare add`.
 */
export async function initConfig(defaults: boolean = false): Promise<void> {
    console.log("\n🔥 TORCH Glare — Initializing...\n");

    // Step 1: Auto-detect environment
    const framework = detectFramework();
    const packageManager = detectPackageManager();
    const tailwindVersion = detectTailwindVersion() ?? 4;
    const { basePath, aliases, aliasPrefix } = resolveAliases(framework);

    const frameworkLabel = framework === "next" ? "Next.js"
        : framework === "vite" ? "Vite"
        : framework === "react" ? "React"
        : "Unknown";

    // Step 2: Show summary and confirm
    console.log("  Detected configuration:");
    console.log(`    Framework:       ${frameworkLabel}`);
    console.log(`    Tailwind CSS:    v${tailwindVersion}`);
    console.log(`    Package manager: ${packageManager}`);
    console.log(`    Base path:       ${basePath} (alias: ${aliasPrefix})`);
    console.log(`    Components:      ${aliases.components}`);
    console.log(`    Hooks:           ${aliases.hooks}`);
    console.log(`    Utils:           ${aliases.utils}`);
    console.log(`    Providers:       ${aliases.providers}`);
    console.log(`    Layouts:         ${aliases.layouts}`);
    console.log("");

    if (!defaults) {
        const { proceed } = await inquirer.prompt([
            {
                type: "confirm",
                name: "proceed",
                message: "Proceed with this configuration?",
                default: true,
            },
        ]);

        if (!proceed) {
            console.log("  Aborted.\n");
            return;
        }
    }

    // Step 3: Install Tailwind plugin dependencies
    console.log("\n📦 Step 1/5 — Installing Tailwind plugins...\n");
    tailwindInit();

    // Step 4: Install base utilities (cn.ts, types.ts, clsx, tailwind-merge, cva)
    console.log("\n🛠️  Step 2/5 — Installing base utilities...\n");
    installBaseUtils(basePath);

    // Step 5: Configure Tailwind
    console.log("\n⚙️  Step 3/5 — Configuring Tailwind CSS...\n");
    let tailwindConfig = "";
    let cssPath = "";

    if (tailwindVersion === 3) {
        tailwindConfig = await configureTailwindV3(basePath, defaults);
    }

    // Step 6: Configure global CSS
    console.log("\n🎨 Step 4/5 — Configuring global CSS...\n");
    const resolvedCss = await configureGlobalCss(framework, tailwindVersion, defaults);
    cssPath = resolvedCss || findGlobalCssPath(framework) || "";

    // Step 7: Configure fonts
    console.log("\n✏️  Step 5/5 — Configuring fonts...\n");
    await configureFonts(framework, defaults);

    // Step 8: Write glare.json
    const config: Config = {
        framework,
        tailwind: {
            version: tailwindVersion,
            config: tailwindConfig,
            css: cssPath,
        },
        aliases,
    };

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    console.log(`\n  ✅ Created ${CONFIG_FILE}`);

    // Success message
    console.log("\n" + "─".repeat(50));
    console.log("  🎉 TORCH Glare initialized successfully!");
    console.log("─".repeat(50));
    console.log("\n  Next steps:");
    console.log("    npx torch-glare@latest add          # Add a component");
    console.log("    npx torch-glare@latest add Button    # Add a specific component");
    console.log("    npx torch-glare@latest hook          # Add a hook");
    console.log("    npx torch-glare@latest provider      # Add a provider");
    console.log("");
}
