
const { plugin, mappingVars } = require('mapping-color-system')
// The design tokens plus the shared radius / container / screen scales. Required by path rather
// than by name so local edits take effect without republishing `glare-torch-mode`.
const torchMode = require('../plugins/torchMode')
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
      borderRadius: torchMode.borderRadius,
      containers: torchMode.containers,
    },

  },
  screens: torchMode.screens,
  plugins: [
    plugin,
    require('@tailwindcss/container-queries'),
    require('tailwindcss-animate'),
    require('tailwind-scrollbar-hide'),
    require('glare-typography'),
    torchMode,
    function ({ addVariant }: any) {
      addVariant("rtl", ['&[dir="rtl"]', '[dir="rtl"] &']);
      addVariant("ltr", ['&[dir="ltr"]', '[dir="ltr"] &']);
    },

  ]
} satisfies Config;
