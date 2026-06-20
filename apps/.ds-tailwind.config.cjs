// Design-sync Tailwind config. Identical to tailwind.config.ts EXCEPT it wires
// the repo's LOCAL plugin mirrors (../plugins/*) instead of the installed npm
// packages. The installed mapping-color-system / glare-torch-mode (v1.2.0)
// renamed badge tokens to badge-*-solid / badge-*-subtle, but the bundled
// components still use the older badge-* (no suffix) names — so the npm packages
// leave badge colors undefined. The local plugins/ mirrors match the components'
// token vocabulary. See .design-sync/NOTES.md "Token version skew".
const { plugin, mappingVars } = require('../plugins/mappingColorSystem/index.cjs');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './lib/**/*.{js,ts,jsx,tsx}',
    '../.design-sync/previews/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ...mappingVars,
      },
    },
  },
  screens: {
    sm: '600px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  plugins: [
    plugin,
    require('tailwindcss-animate'),
    require('tailwind-scrollbar-hide'),
    require('../plugins/typography/index.cjs'),
    require('../plugins/torchMode/index.cjs'),
    function ({ addVariant }) {
      addVariant('rtl', '&[dir="rtl"]');
      addVariant('ltr', '&[dir="ltr"]');
    },
  ],
};
