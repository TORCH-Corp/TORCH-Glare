import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { typographyClasses } from "../utils.js";
import { detectPackageManager } from "../add.js";

const tailwindConfigPath = path.join(process.cwd(), "tailwind.config.ts");

function generateTypographyClasses() {
  return typographyClasses
    .map(
      (typography) => `
        "${typography.className}": {
          fontSize: "${typography.fontSize}",
          lineHeight: "${typography.lineHeight}",
          fontWeight: "${typography.fontWeight}",
          ${
            typography.letterSpacing
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
    plugins: [
      require('tailwindcss-animate'),
      require('tailwind-scrollbar-hide'),
      function ({ addVariant }) {
        addVariant("rtl", '&[dir="rtl"]');
        addVariant("ltr", '&[dir="ltr"]');
      },
      function ({ addComponents }) {
        addComponents({
          ${generateTypographyClasses()}
        });
      },
    ],
  `;
}

function installDependencies() {
  const packageManager = detectPackageManager();
  const installCommand =
    packageManager === "pnpm"
      ? `pnpm add tailwindcss-animate tailwind-scrollbar-hide`
      : packageManager === "yarn"
      ? `yarn add tailwindcss-animate tailwind-scrollbar-hide`
      : `npm install tailwindcss-animate tailwind-scrollbar-hide`;

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
    /** @type {import('tailwindcss').Config} */
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
      ${generatePlugins()}
    };
  `;

  fs.writeFileSync(tailwindConfigPath, tailwindConfig);
  console.log("✅ Created tailwind.config.ts");
}

function modifyTailwindConfig() {
  console.log("⚠️ Tailwind config already exists, modifying...");
  let tailwindConfigContent = fs.readFileSync(tailwindConfigPath, "utf-8");

  if (!tailwindConfigContent.includes("typography-display-large-bold")) {
    tailwindConfigContent = tailwindConfigContent.replace(
      "plugins: [",
      `plugins: [${generatePlugins()}`
    );
  }

  fs.writeFileSync(tailwindConfigPath, tailwindConfigContent);
  console.log("✅ Modified tailwind.config.ts");
}

export function tailwindInit() {
  installDependencies();
  if (!fs.existsSync(tailwindConfigPath)) {
    createTailwindConfig();
  } else {
    modifyTailwindConfig();
  }
}
