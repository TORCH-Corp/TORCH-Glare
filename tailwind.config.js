/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				'fade-gradient': 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, var(--background-presentation-form-field-primary) 28%)',
				'fade-gradient-reverse': 'linear-gradient(280deg, rgba(255, 255, 255, 0) 0%, var(--background-presentation-form-field-primary) 28%)',
				'fade-gradient-system-style': 'linear-gradient(90deg, #00000000 0%, #000000 28%)',
				'fade-gradient-system-style-reverse': 'linear-gradient(280deg, #00000000 0%, var(--background-presentation-form-field-primary) 28%)',
			},
		},
	},
	screens: {
		sm: '600px',
		md: '768px',
		lg: '1024px',
		xl: '1280px',
		'2xl': '1536px'
	},
	plugins: [require("tailwindcss-animate", 'tailwind-scrollbar-hide')],
}