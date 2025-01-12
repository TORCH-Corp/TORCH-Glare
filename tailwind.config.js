/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	screens: {
		sm: '600px',
		md: '768px',
		lg: '1024px',
		xl: '1280px',
		'2xl': '1536px'
	},
	plugins: [require("tailwindcss-animate", 'tailwind-scrollbar-hide')],
}