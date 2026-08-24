import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      colors: {
        ink: "#1a1c1b",
        navy: "#2f3536",
        navyDeep: "#1c2020",
        steel: "#6d6e69",
        canvas: "#f7f6f2",
        muted: "#54564f",
        mist: "#96968c",
        border: "#e3e2d6",
        tint: "#f0efe6",
        charcoal: "#23262e",
        charcoalDeep: "#181a20",
        beige: "#e1e2d1",
        beigeDeep: "#cfd0c0",
      },
      maxWidth: {
        page: "1180px",
      },
      boxShadow: {
        card: "0 24px 48px -12px rgba(20,22,20,0.45), 0 2px 8px rgba(20,22,20,0.15)",
        cardSoft: "0 12px 32px -8px rgba(20,22,20,0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
