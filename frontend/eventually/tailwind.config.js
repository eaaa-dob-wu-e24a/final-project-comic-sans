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
        secondary: "var(--secondary)"
      },
    },
  },
  plugins: [],
};
