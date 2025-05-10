/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        crema: "#F6EBE7",             // Color crema más claro
        "crema-oscuro": "#e0c9b1",    // Mantener el crema oscuro
        marron: "#6f553b",            // Color marrón más fuerte/oscuro
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};
