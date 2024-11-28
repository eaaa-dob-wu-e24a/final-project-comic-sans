/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        pagebackground: "var(--page-background)",
        foreground: "var(--foreground)",
        gradientstart: "var(--gradient-start)",
        gradientend: "var(--gradient-end)",
        primary: "var(--primary)",
        secondary: {
          DEFAULT: "var(--secondary)", // Base secondary color
          hover: "rgba(72, 67, 149, 0.75)", // Hover color with opacity
        },
      },
      fontFamily: {
        "dancing-script": "var(--font-dancing-script)",
      },
      dropShadow: {
        "button-shadow:": "shadow-md",
        "card-shadow": "shadow-sm"
      },
    },
  },
  plugins: [],
};
