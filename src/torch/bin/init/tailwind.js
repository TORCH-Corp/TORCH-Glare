import path from "path";
import { typographyClasses } from "../utils.js";
import fs from "fs";

export function tailwindInit() {
  const tailwindConfigPath = path.join(process.cwd(), "tailwind.config.js");

  // Define the new plugins section dynamically
  const generateTypographyClasses = typographyClasses
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

  const newPlugins = `
    plugins: [
      require('tailwindcss-animate'),
      require('tailwind-scrollbar-hide'),
      function ({ addVariant }) {
        addVariant("rtl", '&[dir="rtl"]');
        addVariant("ltr", '&[dir="ltr"]');
      },
      function ({ addComponents }) {
        addComponents({
          ${generateTypographyClasses}
        });
      },
    ],
  `;

  if (!fs.existsSync(tailwindConfigPath)) {
    // If the file does not exist, create it with a new configuration
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
      ${newPlugins}
    };
    `;

    fs.writeFileSync(tailwindConfigPath, tailwindConfig);
    console.log("✅ Created tailwind.config.js");
  } else {
    // If the file exists, update the plugins section
    let existingConfig = fs.readFileSync(tailwindConfigPath, "utf-8");

    // Check if the 'plugins' section exists
    if (existingConfig.includes("plugins: [")) {
      // Safely replace the plugins section
      existingConfig = existingConfig.replace(
        /plugins:\s*\[[^\]]*\]/s, // Regex to match the plugins array
        `plugins: [
          require('tailwindcss-animate'),
          require('tailwind-scrollbar-hide'),
          function ({ addVariant }) {
            addVariant("rtl", '&[dir="rtl"]');
            addVariant("ltr", '&[dir="ltr"]');
          },
          function ({ addComponents }) {
            addComponents({
              ${generateTypographyClasses}
            });
          },
        ]`
      );
      fs.writeFileSync(tailwindConfigPath, existingConfig);
      console.log("🔄 Updated plugins in tailwind.config.js");
    } else {
      console.log("⚠️ Plugins section not found, appending new plugins.");

      // If plugins section doesn't exist, append it properly
      const configWithPlugins = existingConfig.replace(
        /(theme:\s*\{[^}]*\})/,
        `$1,\n  ${newPlugins}`
      );
      fs.writeFileSync(tailwindConfigPath, configWithPlugins);
      console.log("🔄 Appended plugins to tailwind.config.js");
    }
  }
}
