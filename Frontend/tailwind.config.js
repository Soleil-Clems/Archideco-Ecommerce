/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "green-emerald": "#639d87",
        "green-duck": "#1E4347",
        "sweet-pink": "#F9429E",
        "funny-pink": "#FF2A8E",
      },
      width: {
        100: "20rem", // 400px
        0.5: "0.8px",
        0.8: "1px",
      },
      maxWidth: {
        110: "26rem", // 400px
      },
      height: {
        100: "30rem",
      },
      minHeight: {
        100: "30rem",
        "2/3": "75vh",
      },
      maxHeight: {
        100: "30rem",
      },
      fontFamily: {
        Gotham: ["Gotham", "sans-serif"],
        Aquawax: ["Aquawax", "sans-serif"],
      },
      brightness: {
        25: ".25",
        175: "1.75",
      },
    },
  },
  plugins: [
    require("rippleui"),
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-none": {
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    }),
  ],
};
