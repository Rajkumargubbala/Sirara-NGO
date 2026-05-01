import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#006400",
          light: "#008000",
          dark: "#004d00",
        },
        secondary: {
          DEFAULT: "#5D4037",
          light: "#8d6e63",
          dark: "#3e2723",
        },
        accent: {
          DEFAULT: "#D4AF37",
          light: "#f1c40f",
          dark: "#b8860b",
        },
        background: "#FAF9F6",
        foreground: "#1a1a1a",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      spacing: {
        '8': '8px',
      },
    },
  },
  plugins: [],
};
export default config;
