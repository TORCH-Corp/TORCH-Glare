/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                ...tailwindVars,
            },
        },
    },
    plugins: [
        require('tailwindcss-animate'),
        require('tailwind-scrollbar-hide'),
        require('glare-typography'),
        require('glare-themes'),
        require('glare-torch-mode'),
        function ({ addVariant }) {
            addVariant("rtl", '&[dir="rtl"]');
            addVariant("ltr", '&[dir="ltr"]');
        },
    ],
};