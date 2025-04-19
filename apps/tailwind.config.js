/** @type {import('tailwindcss').Config} */
import { plugin as plugin, mappingVars } from 'mapping-color-system'

module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                ...mappingVars,
            },
        },
    },
    plugins: [
        require('tailwindcss-animate'),
        require('tailwind-scrollbar-hide'),
        require('glare-typography'),
        plugin,
        require('glare-torch-mode'),
        function ({ addVariant }) {
            addVariant("rtl", '&[dir="rtl"]');
            addVariant("ltr", '&[dir="ltr"]');
        },
    ],
};