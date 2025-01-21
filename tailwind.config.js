/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "fade-gradient":
          "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, var(--background-presentation-form-field-primary) 28%)",
        "fade-gradient-reverse":
          "linear-gradient(280deg, rgba(255, 255, 255, 0) 0%, var(--background-presentation-form-field-primary) 28%)",
        "fade-gradient-system-style":
          "linear-gradient(90deg, #00000000 0%, #000000 28%)",
        "fade-gradient-system-style-reverse":
          "linear-gradient(280deg, #00000000 0%, var(--background-presentation-form-field-primary) 28%)",
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
    require("tailwindcss-animate"),
    require("tailwind-scrollbar-hide"),
    function ({ addVariant }) {
      addVariant("rtl", '&[dir="rtl"]');
      addVariant("ltr", '&[dir="ltr"]');
    },
    function ({ addComponents }) {
      addComponents({
        ".typography-display-large-bold": {
          fontSize: "34px",
          lineHeight: "120%",
          letterSpacing: "-0.34px",
          fontWeight: "700",
        },
        ".typography-display-large-semibold": {
          fontSize: "34px",
          lineHeight: "120%",
          letterSpacing: "-0.34px",
          fontWeight: "590",
        },
        ".typography-display-large-medium": {
          fontSize: "34px",
          lineHeight: "120%",
          letterSpacing: "-0.34px",
          fontWeight: "510",
        },
        ".typography-display-large-regular": {
          fontSize: "34px",
          lineHeight: "120%",
          letterSpacing: "-0.34px",
          fontWeight: "400",
        },

        ".typography-display-medium-bold": {
          fontSize: "28px",
          lineHeight: "120%",
          letterSpacing: "-0.28px",
          fontWeight: "700",
        },
        ".typography-display-medium-semibold": {
          fontSize: "28px",
          lineHeight: "120%",
          letterSpacing: "-0.28px",
          fontWeight: "590",
        },
        ".typography-display-medium-medium": {
          fontSize: "28px",
          lineHeight: "120%",
          letterSpacing: "-0.28px",
          fontWeight: "510",
        },
        ".typography-display-medium-regular": {
          fontSize: "28px",
          lineHeight: "120%",
          letterSpacing: "-0.28px",
          fontWeight: "400",
        },

        ".typography-display-small-bold": {
          fontSize: "22px",
          lineHeight: "120%",
          letterSpacing: "-0.22px",
          fontWeight: "700",
        },
        ".typography-display-small-semibold": {
          fontSize: "22px",
          lineHeight: "120%",
          letterSpacing: "-0.22px",
          fontWeight: "590",
        },
        ".typography-display-small-medium": {
          fontSize: "22px",
          lineHeight: "120%",
          letterSpacing: "-0.22px",
          fontWeight: "510",
        },
        ".typography-display-small-regular": {
          fontSize: "22px",
          lineHeight: "120%",
          letterSpacing: "-0.22px",
          fontWeight: "400",
        },

        ".typography-headers-large-bold": {
          fontSize: "20px",
          lineHeight: "132%",
          letterSpacing: "-0.2px",
          fontWeight: "700",
        },
        ".typography-headers-large-semibold": {
          fontSize: "20px",
          lineHeight: "132%",
          letterSpacing: "-0.2px",
          fontWeight: "590",
        },
        ".typography-headers-large-medium": {
          fontSize: "20px",
          lineHeight: "132%",
          letterSpacing: "-0.2px",
          fontWeight: "510",
        },
        ".typography-headers-large-regular": {
          fontSize: "20px",
          lineHeight: "132%",
          letterSpacing: "-0.2px",
          fontWeight: "400",
        },

        ".typography-headers-medium-bold": {
          fontSize: "18px",
          lineHeight: "132%",
          letterSpacing: "-0.18px",
          fontWeight: "700",
        },
        ".typography-headers-medium-semibold": {
          fontSize: "18px",
          lineHeight: "132%",
          letterSpacing: "-0.18px",
          fontWeight: "590",
        },
        ".typography-headers-medium-medium": {
          fontSize: "18px",
          lineHeight: "132%",
          letterSpacing: "-0.18px",
          fontWeight: "510",
        },
        ".typography-headers-medium-regular": {
          fontSize: "18px",
          lineHeight: "132%",
          letterSpacing: "-0.18px",
          fontWeight: "400",
        },

        ".typography-headers-small-bold": {
          fontSize: "16px",
          lineHeight: "132%",
          letterSpacing: "-0.16px",
          fontWeight: "700",
        },
        ".typography-headers-small-semibold": {
          fontSize: "16px",
          lineHeight: "132%",
          letterSpacing: "-0.16px",
          fontWeight: "590",
        },
        ".typography-headers-small-medium": {
          fontSize: "16px",
          lineHeight: "132%",
          letterSpacing: "-0.16px",
          fontWeight: "510",
        },
        ".typography-headers-small-regular": {
          fontSize: "16px",
          lineHeight: "132%",
          letterSpacing: "-0.16px",
          fontWeight: "400",
        },

        ".typography-labels-large-bold": {
          fontSize: "11px",
          lineHeight: "142%",
          letterSpacing: "0.22px",
          fontWeight: "700",
        },
        ".typography-labels-large-semibold": {
          fontSize: "11px",
          lineHeight: "142%",
          letterSpacing: "0.22px",
          fontWeight: "590",
        },
        ".typography-labels-large-medium": {
          fontSize: "11px",
          lineHeight: "142%",
          letterSpacing: "0.22px",
          fontWeight: "510",
        },
        ".typography-labels-large-regular": {
          fontSize: "11px",
          lineHeight: "142%",
          letterSpacing: "0.22px",
          fontWeight: "400",
        },

        ".typography-labels-medium-bold": {
          fontSize: "10px",
          lineHeight: "142%",
          letterSpacing: "0.2px",
          fontWeight: "700",
        },
        ".typography-labels-medium-semibold": {
          fontSize: "10px",
          lineHeight: "142%",
          letterSpacing: "0.2px",
          fontWeight: "590",
        },
        ".typography-labels-medium-medium": {
          fontSize: "10px",
          lineHeight: "142%",
          letterSpacing: "0.2px",
          fontWeight: "510",
        },
        ".typography-labels-medium-regular": {
          fontSize: "10px",
          lineHeight: "142%",
          letterSpacing: "0.2px",
          fontWeight: "400",
        },
        ".typography-labels-small-bold": {
          fontSize: "9px",
          lineHeight: "142%",
          letterSpacing: "0.18px",
          fontWeight: "700",
        },
        ".typography-labels-small-semibold": {
          fontSize: "9px",
          lineHeight: "142%",
          letterSpacing: "0.18px",
          fontWeight: "590",
        },
        ".typography-labels-small-medium": {
          fontSize: "9px",
          lineHeight: "142%",
          letterSpacing: "0.18px",
          fontWeight: "510",
        },
        ".typography-labels-small-regular": {
          fontSize: "9px",
          lineHeight: "142%",
          letterSpacing: "0.18px",
          fontWeight: "400",
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
