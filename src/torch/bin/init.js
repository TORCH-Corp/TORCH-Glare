import fs from "fs";
import path from "path";
import { typographyClasses } from "./utils.js";

export async function initConfig(CONFIG_FILE) {
  const defaultConfig = { path: "@/components" };

  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
    console.log("✅ Created torch.json configuration file");
  } else {
    console.log("⚠️ torch.json already exists, skipping creation.");
  }

  // Initialize Tailwind CSS config if not exists
  const tailwindConfigPath = path.join(process.cwd(), "tailwind.config.js");

  if (!fs.existsSync(tailwindConfigPath)) {
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
      plugins: [
        require('tailwindcss-animate'),
        require('tailwind-scrollbar-hide'),
        function ({ addVariant }) {
          addVariant("rtl", '&[dir="rtl"]');
          addVariant("ltr", '&[dir="ltr"]');
        },
        function ({ addComponents }) {
          addComponents({
            ${typographyClasses
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
              .join("")}
          });
        },
      ],
    };
    `;

    fs.writeFileSync(tailwindConfigPath, tailwindConfig);
    console.log("✅ Created tailwind.config.js");
  } else {
    console.log("⚠️ Tailwind config already exists, modifying...");

    // Read the existing tailwind.config.js file as a string
    let tailwindConfigContent = fs.readFileSync(tailwindConfigPath, "utf-8");

    // Check if the plugins section exists and modify it if needed
    // Find the position of the plugins array and insert the new ones
    const pluginsStart =
      tailwindConfigContent.indexOf("plugins: [") + "plugins: [".length;
    const pluginsEnd = tailwindConfigContent.indexOf("],", pluginsStart) + 1;

    let existingPlugins = tailwindConfigContent.substring(
      pluginsStart,
      pluginsEnd
    );

    // Add the required Tailwind plugins (if not already present)
    const newPlugins = `
        tailwindcssAnimate,
        tailwindScrollbarHide,
        function ({ addVariant }) {
          addVariant("rtl", '&[dir="rtl"]');
          addVariant("ltr", '&[dir="ltr"]');
        },
        function ({ addComponents }) {
          addComponents({
            ${typographyClasses
              .map(
                (typography) => `
           " ${typography.className}": {
              "fontSize": "${typography.fontSize}",
              "lineHeight": "${typography.lineHeight}",
              "fontWeight": "${typography.fontWeight}",
               ${
                 typography.letterSpacing
                   ? `"letterSpacing": "${typography.letterSpacing}",`
                   : ""
               }
            },
            `
              )
              .join("")}
          });
        },
      `;

    // Append the new plugins to the existing plugins array
    if (!existingPlugins.includes("typography-display-large-bold")) {
      tailwindConfigContent = tailwindConfigContent.replace(
        "plugins: [",
        `plugins: [${newPlugins}`
      );
    }

    // Save the modified configuration back to the file
    fs.writeFileSync(tailwindConfigPath, tailwindConfigContent);
    console.log("✅ Modified tailwind.config.js");
  }
}
