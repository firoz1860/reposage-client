/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#f0fdf4",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          900: "#052e16",
          950: "#011608"
        },
        terminal: "#00ff88",
        void: "#030712"
      }
    }
  },
  plugins: []
};
