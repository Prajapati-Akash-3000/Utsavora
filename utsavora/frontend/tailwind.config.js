/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
            DEFAULT: "#7C3AED", // purple-600
            hover: "#6D28D9",   // purple-700
            light: "#DDD6FE",   // purple-200
        },
        secondary: "#F3E8FF", // purple-100
      }
    },
  },
  plugins: [],
};
