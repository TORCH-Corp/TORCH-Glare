import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { detectPackageManager } from "../addComponent.js";

const tailwindConfigPath = path.join(process.cwd(), "tailwind.config.ts");



function generatePlugins() {
  return `
    require('tailwindcss-animate'),
    require('tailwind-scrollbar-hide'),
    require('glare-typography'),
    require('glare-themes'),
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
function installDependencies(dependencies = []) {
  if (!dependencies.length) {
    console.warn("⚠️ No dependencies provided to install.");
    return;
  }

  // Detect the package manager
  const packageManager = detectPackageManager();
  console.log(`📦 Detected package manager: ${packageManager}`);

  // Generate the install command based on the package manager
  let installCommand;
  switch (packageManager) {
    case "pnpm":
      installCommand = `pnpm add ${dependencies.join(" ")}`;
      break;
    case "yarn":
      installCommand = `yarn add ${dependencies.join(" ")}`;
      break;
    case "npm":
    default:
      installCommand = `npm install ${dependencies.join(" ")}`;
      break;
  }

  try {
    // Execute the install command
    execSync(installCommand, { stdio: "inherit" });
    console.log("✅ Dependencies installed successfully.");
  } catch (error) {
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
    export default {
      content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./features/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
      ],
      theme: {
        extend: {},
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

  if (!tailwindConfigContent.includes("glare-typography") && !tailwindConfigContent.includes("glare-themes")) {
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

export function tailwindInit() {
  const dependencies = [
    "tailwindcss-animate",
    "tailwind-scrollbar-hide",
    "glare-typography",
    "glare-themes",
    "glare-torch-mode",
  ];
  installDependencies(dependencies);
  if (!fs.existsSync(tailwindConfigPath)) {
    createTailwindConfig();
  } else {
    modifyTailwindConfig();
  }
}
