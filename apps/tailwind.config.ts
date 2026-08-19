
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
      // Named sizes for the container-query variants (`@md:` …).
      //
      // `md` is 650px rather than the usual 768. The only consumer is `FieldSection`, which marks
      // itself `@container` and flips from a stacked row to `@md:grid-cols-[350px_1fr]` —
      // label beside control. At 768 a field embedded in anything narrower than a full-width page
      // (a drawer, a settings rail, a docs preview frame) never reaches the wide layout, so it
      // stays stacked where there is clearly room for two columns. 650 is where that row actually
      // fits: a 350px label track plus a usable control.
      containers: {
        xs: "320px",
        sm: "600px",
        md: "650px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
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
    require('@tailwindcss/container-queries'),
    require('tailwindcss-animate'),
    require('tailwind-scrollbar-hide'),
    require('glare-typography'),
    require('glare-torch-mode'),
    function ({ addVariant }: any) {
      addVariant("rtl", ['&[dir="rtl"]', '[dir="rtl"] &']);
      addVariant("ltr", ['&[dir="ltr"]', '[dir="ltr"] &']);
    },

  ]
} satisfies Config;
