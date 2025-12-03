/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        text: "var(--color-text)",
        border: "var(--color-border)",
        neutral: "var(--color-neutral)",
        excellent: "var(--state-excellent)",
        good: "var(--state-good)",
        poor: "var(--state-poor)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        mono: "var(--font-mono)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
      maxWidth: {
        content: "var(--content-max-width)",
      },
    },
  },
  plugins: [],
};
