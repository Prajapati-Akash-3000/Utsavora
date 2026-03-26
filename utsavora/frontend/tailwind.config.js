/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
            DEFAULT: "#5B5FFF",
            hover: "#4F46E5",
            light: "#818CF8",
            50: "#EEF2FF",
        },
        secondary: {
            DEFAULT: "#6EE7B7", 
        },
        accent: {
            DEFAULT: "#F59E0B",
        },
        "background-light": "#F8FAFC",
        "background-dark": "#0F172A",
      },
      fontFamily: {
          display: ["Inter", "sans-serif"],
          sans: ["Inter", "sans-serif"],
      },
      transitionTimingFunction: {
        ui: "cubic-bezier(0.4, 0, 0.2, 1)",
        press: "cubic-bezier(0.2, 0, 0, 1)",
        exit: "cubic-bezier(0.4, 0, 1, 1)",
        success: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      transitionDuration: {
        fast: "120ms",
        ui: "240ms",
        page: "280ms",
        slow: "600ms",
      },
      scale: {
        press: "0.95",
      },
      boxShadow: {
        "glow-sm": "0 0 15px -3px rgba(91, 95, 255, 0.3)",
        "glow": "0 0 30px -5px rgba(91, 95, 255, 0.35)",
        "glow-lg": "0 0 60px -10px rgba(91, 95, 255, 0.4)",
        "card": "0 4px 24px -4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 12px 40px -8px rgba(0,0,0,0.12), 0 4px 6px rgba(0,0,0,0.05)",
        "glass": "0 8px 32px -8px rgba(0,0,0,0.08)",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200px 0" },
          "100%": { backgroundPosition: "200px 0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
        "slide-up": {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -30px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
        },
      },
      animation: {
        shake: "shake 120ms cubic-bezier(0.4, 0, 0.2, 1)",
        shimmer: "shimmer 1.4s infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 4s ease-in-out infinite",
        "slide-up": "slide-up 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "float-slow": "float-slow 20s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-mesh": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
    },
  },
  plugins: [],
};
