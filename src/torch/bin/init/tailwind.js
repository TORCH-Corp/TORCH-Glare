import path from "path";
import { typographyClasses } from "../utils.js";
import fs from "fs";

export function tailwindInit() {
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

    // Convert the string content into a JavaScript object
    let tailwindConfigObject = eval(tailwindConfigContent);

    // Modify the object as needed (example: adding a custom theme)
    tailwindConfigObject.plugins = [...tailwindConfigObject.plugins, []];

    // Convert back to a string and write to file
    /*     let updatedConfigContent = `module.exports = ${JSON.stringify(
      tailwindConfigObject,
      null,
      2
    )};`; */

    console.log(tailwindConfigObject, "tailwindConfigObject");
    fs.writeFileSync(tailwindConfigPath, updatedConfigContent);

    console.log("✅ Modified tailwind.config.js");
  }
}
