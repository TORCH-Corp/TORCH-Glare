import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { detectPackageManager } from "./detectPackageManager.js";
import { getCurrentInstalledDependencies } from "./getCurrentInstalledDependencies.js";

const tailwindConfigPath = path.join(process.cwd(), "tailwind.config.ts");


export function tailwindInit(): void {
  const dependencies = [
    "tailwindcss-animate",
    "tailwind-scrollbar-hide",
    "glare-typography",
    "mapping-color-system",
    "glare-torch-mode",
  ];
  installDependencies(dependencies);

  const { depsNamesAndVersions } = getCurrentInstalledDependencies();
  if (depsNamesAndVersions["tailwindcss"]) {
    const tailwindVersion = depsNamesAndVersions["tailwindcss"];
    if (isTailwindVersionLessThanV4(tailwindVersion)) {
      if (!fs.existsSync(tailwindConfigPath)) {
        createTailwindConfig();
      } else {
        modifyTailwindConfig();
      }
    } else {
      console.error("✅ Tailwind CSS version is greater than v4 Not Supported");
      return;
    }
  }
}





function generatePlugins() {
  return `
    plugin,
    require('tailwindcss-animate'),
    require('tailwind-scrollbar-hide'),
    require('glare-typography'),
    require('glare-torch-mode'),
      function ({ addVariant }: any) {
        addVariant("rtl", '&[dir="rtl"]');
        addVariant("ltr", '&[dir="ltr"]');
      },
  `;
}

/**
 * Installs dependencies using the detected package manager.
 * @param {string[]} dependencies - List of dependencies to install.
 */
function installDependencies(dependencies: string[] = []) {
  if (!dependencies.length) {
    console.warn("⚠️ No dependencies provided to install.");
    return;
  }

  // Detect the package manager
  const packageManager = detectPackageManager();
  console.log(`📦 Detected package manager: ${packageManager}`);

  // Generate the install command based on the package manager
  let installCommand;
  const latestDeps = dependencies.map(dep => `${dep}@latest`).join(" ");

  switch (packageManager) {
    case "pnpm":
      installCommand = `pnpm add ${latestDeps}`;
      break;
    case "yarn":
      installCommand = `yarn add ${latestDeps}`;
      break;
    case "npm":
    default:
      installCommand = `npm install ${latestDeps}`;
      break;
  }

  try {
    // Execute the install command
    execSync(installCommand, { stdio: "inherit" });
    console.log("✅ Dependencies installed successfully.");
  } catch (error: any) {
    console.error("❌ Error installing dependencies:");
    console.error(error.message);

    // Provide additional troubleshooting tips
    if (error.message.includes("EACCES")) {
      console.error(
        "💡 It seems you don't have permission to install packages globally. Try running the command with sudo or fix your npm permissions."
      );
    } else if (error.message.includes("not found")) {
      console.error(
        "💡 The package manager might not be installed. Please ensure it is installed and available in your PATH."
      );
    } else {
      console.error("💡 Check your internet connection and try again.");
    }
  }
}


function createTailwindConfig() {
  const tailwindConfig = `
    import type { Config } from "tailwindcss";
    const { plugin, mappingVars } = require('mapping-color-system')
    export default {
      content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./features/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./layout/**/*.{js,ts,jsx,tsx,mdx}",
      ],
      theme: {
        extend: {
          colors: {
            ...mappingVars,
          },
        },
      },
      screens: {
        sm: "600px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      plugins: [${generatePlugins()}],
    }satisfies Config;
  `;

  fs.writeFileSync(tailwindConfigPath, tailwindConfig);
  console.log("✅ Created tailwind.config.ts");
}


function modifyTailwindConfig() {
  try {
    // Read the current content
    let tailwindConfigContent = fs.readFileSync(tailwindConfigPath, "utf-8");
    console.log("📄 Read tailwind.config.ts file successfully");



    // Make a backup of the original content for debugging
    const originalContent = tailwindConfigContent;

    // if required plugins are not installed, add them
    if (!tailwindConfigContent.includes("glare-typography")) {
      console.log("🔄 Adding plugins to tailwind config...");
      tailwindConfigContent = modifyPlugins(tailwindConfigContent);
    }

    // if required mapping variables are not installed, add them
    if (!tailwindConfigContent.includes("mappingVars")) {
      console.log("🔄 Adding mapping variables to tailwind config...");
      tailwindConfigContent = AddVariablesColors(tailwindConfigContent);
    }

    // Check if content was actually modified
    if (originalContent === tailwindConfigContent) {
      console.log("⚠️ No changes were made to the tailwind config");
    } else {
      // Write the modified content back to the file
      fs.writeFileSync(tailwindConfigPath, tailwindConfigContent);
      console.log("✅ Modified tailwind.config.ts successfully");
    }
  } catch (error) {
    console.error("❌ Error modifying tailwind.config.ts:", error);
  }
}


/**
 * Checks if the installed Tailwind CSS version is less than v4.
 * @param {string} version - The version string of Tailwind CSS.
 * @returns {boolean} - True if the version is less than v4, otherwise false.
 */
function isTailwindVersionLessThanV4(version: string | undefined): boolean {
  if (!version) {
    console.warn("⚠️ Tailwind CSS is not installed.");
    return false; // Assume it needs to be installed
  }

  // Extract the major version number
  const majorVersion = parseInt(version?.replace(/^[^0-9]*/, "").split(".")[0] || "3", 10);
  return majorVersion < 4;
}


const modifyPlugins = (tailwindConfigContent: string): string => {
  try {
    console.log("start modify plugins");
    if (!tailwindConfigContent.includes("plugins")) {
      // If no plugins array exists at all
      return tailwindConfigContent.replace(
        /}(\s*)satisfies(\s*)Config;/,
        `},\n  plugins: [${generatePlugins()}]$1satisfies$2Config;`
      );
    } else {
      // If plugins array exists but doesn't have our plugins
      return tailwindConfigContent.replace(
        /plugins\s*:\s*\[/,
        `plugins: [${generatePlugins()}`
      );
    }
  } catch (error) {
    console.error("❌ Error modifying plugins:", error);
    return tailwindConfigContent; // Return unchanged if error
  }
}


const AddVariablesColors = (tailwindConfigContent: string): string => {
  try {
    // Check if mappingVars import exists, add if not
    if (!tailwindConfigContent.includes("mappingVars")) {
      if (tailwindConfigContent.includes("const { plugin }")) {
        // Update existing plugin import to include mappingVars
        tailwindConfigContent = tailwindConfigContent.replace(
          "const { plugin }",
          "const { plugin, mappingVars }"
        );
      } else {
        // Add the import if it doesn't exist
        tailwindConfigContent = tailwindConfigContent.replace(
          "import type { Config } from",
          "const { plugin, mappingVars } = require('mapping-color-system')\nimport type { Config } from"
        );
      }
    }

    // Add colors configuration
    if (!tailwindConfigContent.includes("colors:")) {
      // If theme.extend exists but no colors
      if (tailwindConfigContent.includes("extend:")) {
        tailwindConfigContent = tailwindConfigContent.replace(
          /extend\s*:\s*{/,
          "extend: {\n          colors: {\n            ...mappingVars,\n          },"
        );
      }
      // If theme exists but no extend
      else if (tailwindConfigContent.includes("theme:")) {
        tailwindConfigContent = tailwindConfigContent.replace(
          /theme\s*:\s*{/,
          "theme: {\n        extend: {\n          colors: {\n            ...mappingVars,\n          },\n        },"
        );
      }
      // If no theme at all
      else {
        tailwindConfigContent = tailwindConfigContent.replace(
          /content\s*:\s*\[/,
          "theme: {\n        extend: {\n          colors: {\n            ...mappingVars,\n          },\n        },\n      },\n      content: ["
        );
      }
    } else if (!tailwindConfigContent.includes("...mappingVars")) {
      // If colors exists but mappingVars not added
      tailwindConfigContent = tailwindConfigContent.replace(
        /colors\s*:\s*{/,
        "colors: {\n            ...mappingVars,"
      );
    }

    return tailwindConfigContent;
  } catch (error) {
    console.error("❌ Error adding mapping variables:", error);
    return tailwindConfigContent; // Return unchanged if error
  }
}