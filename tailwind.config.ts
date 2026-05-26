import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        md: "2rem",
        lg: "3rem",
        xl: "4rem",
      },
      screens: { "2xl": "1440px" },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0a0a0a",
          50: "#f7f7f7",
          100: "#e5e5e5",
          200: "#cccccc",
          300: "#a3a3a3",
          400: "#737373",
          500: "#525252",
          600: "#404040",
          700: "#262626",
          800: "#171717",
          900: "#0a0a0a",
          950: "#050505",
        },
        paper: {
          DEFAULT: "#f5f3ef",
          50: "#fdfcfb",
          100: "#f5f3ef",
          200: "#e9e6df",
        },
        accent: {
          DEFAULT: "#3B5BDB",
          50: "#eef2fc",
          100: "#dbe2f7",
          200: "#b7c5ef",
          300: "#92a8e7",
          400: "#6e8bdf",
          500: "#3B5BDB",
          600: "#2f49af",
          700: "#233783",
          800: "#172458",
          900: "#0c122c",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "serif"],
        script: ["var(--font-script)", "var(--font-sans)", "cursive"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        "display-2xl": ["clamp(3.5rem, 10vw, 9rem)", { lineHeight: "0.9", letterSpacing: "-0.04em", fontWeight: "700" }],
        "display-xl": ["clamp(3rem, 8vw, 7rem)", { lineHeight: "0.95", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-lg": ["clamp(2.5rem, 6vw, 5rem)", { lineHeight: "1", letterSpacing: "-0.025em", fontWeight: "700" }],
        "display-md": ["clamp(2rem, 4.5vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-sm": ["clamp(1.75rem, 3.5vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.015em", fontWeight: "600" }],
        "h1": ["clamp(2.25rem, 5vw, 3.75rem)", { lineHeight: "1.02", letterSpacing: "-0.03em", fontWeight: "600" }],
        "h2": ["clamp(1.875rem, 4vw, 3rem)", { lineHeight: "1.08", letterSpacing: "-0.02em", fontWeight: "600" }],
        "h3": ["clamp(1.625rem, 2.75vw, 2.125rem)", { lineHeight: "1.18", letterSpacing: "-0.01em", fontWeight: "600" }],
        "h4": ["clamp(1.375rem, 2vw, 1.625rem)", { lineHeight: "1.28", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body": ["1rem", { lineHeight: "1.65" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        "label": ["0.8125rem", { lineHeight: "1.2", letterSpacing: "0.18em", fontWeight: "500" }],
        "caption": ["0.75rem", { lineHeight: "1.3", letterSpacing: "0.12em" }],
      },
      spacing: {
        "xs": "0.25rem",
        "sm": "0.5rem",
        "md": "1rem",
        "lg": "1.5rem",
        "xl": "2.5rem",
        "2xl": "4rem",
        "3xl": "6rem",
        "4xl": "9rem",
        "5xl": "13rem",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.7, 0, 0.2, 1)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "300ms",
        slow: "600ms",
        cinematic: "1200ms",
      },
      maxWidth: {
        prose: "65ch",
        readable: "42rem",
      },
    },
  },
  plugins: [typography],
};

export default config;
