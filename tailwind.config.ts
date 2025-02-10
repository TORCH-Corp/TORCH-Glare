
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

        ".typography-display-large-bold": {
          fontSize: "34px",
          lineHeight: "120%",
          fontWeight: "700",
          letterSpacing: "-0.34px",
        },

        ".typography-display-large-semibold": {
          fontSize: "34px",
          lineHeight: "120%",
          fontWeight: "590",
          letterSpacing: "-0.34px",
        },

        ".typography-display-large-medium": {
          fontSize: "34px",
          lineHeight: "120%",
          fontWeight: "510",
          letterSpacing: "-0.34px",
        },

        ".typography-display-large-regular": {
          fontSize: "34px",
          lineHeight: "120%",
          fontWeight: "400",
          letterSpacing: "-0.34px",
        },

        ".typography-display-medium-bold": {
          fontSize: "28px",
          lineHeight: "120%",
          fontWeight: "700",
          letterSpacing: "-0.28px",
        },

        ".typography-display-medium-semibold": {
          fontSize: "28px",
          lineHeight: "120%",
          fontWeight: "590",
          letterSpacing: "-0.28px",
        },

        ".typography-display-medium-medium": {
          fontSize: "28px",
          lineHeight: "120%",
          fontWeight: "510",
          letterSpacing: "-0.28px",
        },

        ".typography-display-medium-regular": {
          fontSize: "28px",
          lineHeight: "120%",
          fontWeight: "400",
          letterSpacing: "-0.28px",
        },

        ".typography-display-small-bold": {
          fontSize: "22px",
          lineHeight: "120%",
          fontWeight: "700",
          letterSpacing: "-0.22px",
        },

        ".typography-display-small-semibold": {
          fontSize: "22px",
          lineHeight: "120%",
          fontWeight: "590",
          letterSpacing: "-0.22px",
        },

        ".typography-display-small-medium": {
          fontSize: "22px",
          lineHeight: "120%",
          fontWeight: "510",
          letterSpacing: "-0.22px",
        },

        ".typography-display-small-regular": {
          fontSize: "22px",
          lineHeight: "120%",
          fontWeight: "400",
          letterSpacing: "-0.22px",
        },

        ".typography-headers-large-bold": {
          fontSize: "20px",
          lineHeight: "132%",
          fontWeight: "700",
          letterSpacing: "-0.2px",
        },

        ".typography-headers-large-semibold": {
          fontSize: "20px",
          lineHeight: "132%",
          fontWeight: "590",
          letterSpacing: "-0.2px",
        },

        ".typography-headers-large-medium": {
          fontSize: "20px",
          lineHeight: "132%",
          fontWeight: "510",
          letterSpacing: "-0.2px",
        },

        ".typography-headers-large-regular": {
          fontSize: "20px",
          lineHeight: "132%",
          fontWeight: "400",
          letterSpacing: "-0.2px",
        },

        ".typography-headers-medium-bold": {
          fontSize: "18px",
          lineHeight: "132%",
          fontWeight: "700",
          letterSpacing: "-0.18px",
        },

        ".typography-headers-medium-semibold": {
          fontSize: "18px",
          lineHeight: "132%",
          fontWeight: "590",
          letterSpacing: "-0.18px",
        },

        ".typography-headers-medium-medium": {
          fontSize: "18px",
          lineHeight: "132%",
          fontWeight: "510",
          letterSpacing: "-0.18px",
        },

        ".typography-headers-medium-regular": {
          fontSize: "18px",
          lineHeight: "132%",
          fontWeight: "400",
          letterSpacing: "-0.18px",
        },

        ".typography-headers-small-bold": {
          fontSize: "16px",
          lineHeight: "132%",
          fontWeight: "700",
          letterSpacing: "-0.16px",
        },

        ".typography-headers-small-semibold": {
          fontSize: "16px",
          lineHeight: "132%",
          fontWeight: "590",
          letterSpacing: "-0.16px",
        },

        ".typography-headers-small-medium": {
          fontSize: "16px",
          lineHeight: "132%",
          fontWeight: "510",
          letterSpacing: "-0.16px",
        },

        ".typography-headers-small-regular": {
          fontSize: "16px",
          lineHeight: "132%",
          fontWeight: "400",
          letterSpacing: "-0.16px",
        },

        ".typography-labels-large-bold": {
          fontSize: "11px",
          lineHeight: "142%",
          fontWeight: "700",
          letterSpacing: "0.22px",
        },

        ".typography-labels-large-semibold": {
          fontSize: "11px",
          lineHeight: "142%",
          fontWeight: "590",
          letterSpacing: "0.22px",
        },

        ".typography-labels-large-medium": {
          fontSize: "11px",
          lineHeight: "142%",
          fontWeight: "510",
          letterSpacing: "0.22px",
        },

        ".typography-labels-large-regular": {
          fontSize: "11px",
          lineHeight: "142%",
          fontWeight: "400",
          letterSpacing: "0.22px",
        },

        ".typography-labels-medium-bold": {
          fontSize: "10px",
          lineHeight: "142%",
          fontWeight: "700",
          letterSpacing: "0.2px",
        },

        ".typography-labels-medium-semibold": {
          fontSize: "10px",
          lineHeight: "142%",
          fontWeight: "590",
          letterSpacing: "0.2px",
        },

        ".typography-labels-medium-medium": {
          fontSize: "10px",
          lineHeight: "142%",
          fontWeight: "510",
          letterSpacing: "0.2px",
        },

        ".typography-labels-medium-regular": {
          fontSize: "10px",
          lineHeight: "142%",
          fontWeight: "400",
          letterSpacing: "0.2px",
        },

        ".typography-labels-small-bold": {
          fontSize: "9px",
          lineHeight: "142%",
          fontWeight: "700",
          letterSpacing: "0.18px",
        },

        ".typography-labels-small-semibold": {
          fontSize: "9px",
          lineHeight: "142%",
          fontWeight: "590",
          letterSpacing: "0.18px",
        },

        ".typography-labels-small-medium": {
          fontSize: "9px",
          lineHeight: "142%",
          fontWeight: "510",
          letterSpacing: "0.18px",
        },

        ".typography-labels-small-regular": {
          fontSize: "9px",
          lineHeight: "142%",
          fontWeight: "400",
          letterSpacing: "0.18px",
        },

        ".typography-body-large-bold": {
          fontSize: "16px",
          lineHeight: "148%",
          fontWeight: "700",

        },

        ".typography-body-large-semibold": {
          fontSize: "16px",
          lineHeight: "148%",
          fontWeight: "590",

        },

        ".typography-body-large-medium": {
          fontSize: "16px",
          lineHeight: "148%",
          fontWeight: "510",

        },

        ".typography-body-large-regular": {
          fontSize: "16px",
          lineHeight: "147.5%",
          fontWeight: "400",

        },

        ".typography-body-medium-bold": {
          fontSize: "14px",
          lineHeight: "148%",
          fontWeight: "700",

        },

        ".typography-body-medium-semibold": {
          fontSize: "14px",
          lineHeight: "148%",
          fontWeight: "590",

        },

        ".typography-body-medium-medium": {
          fontSize: "14px",
          lineHeight: "148%",
          fontWeight: "510",

        },

        ".typography-body-medium-regular": {
          fontSize: "14px",
          lineHeight: "147.5%",
          fontWeight: "400",

        },

        ".typography-body-small-bold": {
          fontSize: "12px",
          lineHeight: "148%",
          fontWeight: "700",

        },

        ".typography-body-small-semibold": {
          fontSize: "12px",
          lineHeight: "148%",
          fontWeight: "590",

        },

        ".typography-body-small-medium": {
          fontSize: "12px",
          lineHeight: "148%",
          fontWeight: "510",

        },

        ".typography-body-small-regular": {
          fontSize: "12px",
          lineHeight: "147.5%",
          fontWeight: "400",

        },

      });
    },
  ],

};
