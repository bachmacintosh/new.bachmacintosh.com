/* eslint-disable @typescript-eslint/no-require-imports
   -- Tailwind uses CommonJS to load plugins
*/
/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ["./app/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				blue: {
					galaxy: "#000D14",
					mariner: "#3B4E78",
					diamond: "#95B2DB",
					racing: "#0E316D",
					ultra: "#0055C4",
					standard: "#001B57",
				},
				wanikani: {
					radical: "#0093dd",
					kanji: "#dd0093",
					vocabulary: "#9300dd",
				},
			},
			spacing: { 256: "64rem" },
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: [
			{
				johan: {
					"base-100": "#000D14",
					primary: "#0E316D",
					"primary-content": "#AFC6E4",
					"primary-focus": "#001B57",
					secondary: "#666666",
					"secondary-content": "#cccccc",
					accent: "#0055C4",
					info: "#0092D6",
					success: "#6CB288",
					warning: "#DAAD58",
					error: "#AB3D30",
					"--rounded-badge": "0px",
					"--rounded-box": "0px",
					"--rounded-btn": "0px",
				},
			},
		],
	},
};
