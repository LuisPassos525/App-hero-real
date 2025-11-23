import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0D0D0D",
        surface: {
          DEFAULT: "#1A1A1A",
          alt: "#121212",
        },
        primary: {
          DEFAULT: "#00FF00",
          foreground: "#0D0D0D",
        },
        accent: {
          DEFAULT: "#00FF00",
          foreground: "#0D0D0D",
        },
        foreground: "#FFFFFF",
        secondary: {
          DEFAULT: "#A1A1AA",
          foreground: "#FFFFFF",
        },
        danger: {
          DEFAULT: "#FF3333",
          foreground: "#FFFFFF",
        },
        border: "rgba(255, 255, 255, 0.1)",
        input: "rgba(255, 255, 255, 0.1)",
        ring: "#00FF00",
        card: {
          DEFAULT: "#1A1A1A",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#1A1A1A",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#121212",
          foreground: "#A1A1AA",
        },
        destructive: {
          DEFAULT: "#FF3333",
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-poppins)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 255, 0, 0.2)",
        "glow-md": "0 0 30px rgba(0, 255, 0, 0.3)",
        "glow-lg": "0 0 40px rgba(0, 255, 0, 0.4)",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
};

export default config;
