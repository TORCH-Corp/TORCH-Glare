import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { typographyClasses } from "../utils.js";
import { detectPackageManager } from "../addComponent.js";

const tailwindConfigPath = path.join(process.cwd(), "tailwind.config.ts");

function generateTypographyClasses() {
  return typographyClasses
    .map(
      (typography) => `
        "${typography.className}": {
          fontSize: "${typography.fontSize}",
          lineHeight: "${typography.lineHeight}",
          fontWeight: "${typography.fontWeight}",
          ${typography.letterSpacing
          ? `letterSpacing: "${typography.letterSpacing}",`
          : ""
        }
        },
      `
    )
    .join("");
}

function generatePlugins() {
  return `
      require('tailwindcss-animate'),
      require('tailwind-scrollbar-hide'),
      function ({ addVariant }: any) {
        addVariant("rtl", '&[dir="rtl"]');
        addVariant("ltr", '&[dir="ltr"]');
      },
      function ({ addComponents }: any) {
        addComponents({
          ${generateTypographyClasses()}
        });
      },
  `;
}

function installDependencies() {
  const packageManager = detectPackageManager();
  const installCommand =
    packageManager === "pnpm"
      ? `pnpm add tailwindcss-animate tailwind-scrollbar-hide`
      : packageManager === "yarn"
        ? `yarn add tailwindcss-animate tailwind-scrollbar-hide`
        : `npm install tailwindcss-animate@latest tailwind-scrollbar-hide@latest`;

  console.log(`📦 Installing missing dependencies of tailwindcss`);
  try {
    execSync(installCommand, { stdio: "inherit" });
    console.log("✅ Dependencies installed successfully.");
  } catch (error) {
    console.error("❌ Error installing dependencies:", error.message);
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
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
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

  if (!tailwindConfigContent.includes(".typography")) {
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
  installDependencies();
  if (!fs.existsSync(tailwindConfigPath)) {
    createTailwindConfig();
  } else {
    modifyTailwindConfig();
  }
}
