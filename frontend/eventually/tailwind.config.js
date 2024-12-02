/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./globals.css",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        pagebackground: "var(--page-background)",
        foreground: "var(--foreground)",
        gradientstart: "var(--gradient-start)",
        gradientend: "var(--gradient-end)",
        primary: {
          DEFAULT: "var(--primary)", // Base primary color
          hover: "rgba(211, 69, 86, 0.75)", // Hover color with opacity
        },
        secondary: {
          DEFAULT: "var(--secondary)", // Base secondary color
          hover: "rgba(72, 67, 149, 0.75)", // Hover color with opacity
        },
        dark: "var(--dark)",
      },
      fontFamily: {
        "dancing-script": "var(--font-dancing-script)",
      },
      boxShadow: {
        buttonshadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", //correspondig to shadow-md
        cardshadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", //correspondig to shadow-sm
      },
    },
  },
  plugins: [],
};
