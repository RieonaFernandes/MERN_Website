/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5ce1e6",
        warning: "#ffbd59",
        accent: "#cb6ce6",
        danger: "#E56B66",
        bgDark: "#0B1326",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
