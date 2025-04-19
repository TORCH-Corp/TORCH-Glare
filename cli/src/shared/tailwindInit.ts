import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { detectPackageManager } from "./detectPackageManager.js";
import { getCurrentInstalledDependencies } from "./getCurrentInstalledDependencies.js";

const tailwindConfigPath = path.join(process.cwd(), "tailwind.config.ts");



function generatePlugins() {
  return `
    themePlugin,
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
    const { plugin: themePlugin, tailwindVars } = require('mapping-color-system')
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
            ...tailwindVars,
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
  let tailwindConfigContent = fs.readFileSync(tailwindConfigPath, "utf-8");

  if (!tailwindConfigContent.includes("glare-typography") && !tailwindConfigContent.includes("mapping-color-system")) {
    if (!tailwindConfigContent.includes("plugins")) {
      tailwindConfigContent = tailwindConfigContent.replace(
        "],",
        `],plugins: [${generatePlugins()}],`
      );
    } else {
      tailwindConfigContent = tailwindConfigContent.replace(
        "plugins: [",
        `plugins: [${generatePlugins()}`
      );
    }
    console.log("✅ Modified tailwind.config.ts");
  }

  fs.writeFileSync(tailwindConfigPath, tailwindConfigContent);
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
