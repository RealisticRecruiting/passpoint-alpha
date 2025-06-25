/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // or 'media' if you prefer
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
};
