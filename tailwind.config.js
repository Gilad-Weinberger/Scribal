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
        // Primary brand colors
        primary: {
          DEFAULT: "#3456b2",
          hover: "#2a4a9a",
          focus: "#3456b2",
        },
        // Background colors
        background: {
          DEFAULT: "#ffffff",
          secondary: "#fcfcfc",
          input: "#f6f6f6",
          hover: "#ededed",
          dark: "#0a0a0a",
        },
        // Border colors
        border: {
          DEFAULT: "#dfdfdf",
          light: "#e2e2e2",
          medium: "#B2B2B2",
        },
        // Text colors
        text: {
          DEFAULT: "#171717",
          secondary: "#525252",
          medium: "#8f8f8f",
          light: "#ededed",
        },
        // Status colors
        error: "#dc2626",
        success: "#16a34a",
        warning: "#ca8a04",
        info: "#2563eb",
      },
      spacing: {
        14: "3.5rem",
        18: "4.5rem",
        42: "10.5rem",
        160: "40rem",
      },
      fontFamily: {
        sans: ["var(--font-rubik)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
