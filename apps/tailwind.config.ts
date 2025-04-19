
const { plugin, mappingVars } = require('mapping-color-system')
import type { Config } from "tailwindcss";
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./index.html",
    "./lib/**/*.{js,ts,jsx,tsx}",
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

  ]
} satisfies Config;
