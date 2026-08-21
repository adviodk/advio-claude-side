import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      colors: {
        ink: "#0b0f1a",
        blue: "#1531d8",
        blueDeep: "#0c1f99",
        yellow: "#ffde59",
        canvas: "#f5f6fa",
        muted: "#565b78",
        mist: "#9aa0bf",
        border: "#dfe1ee",
        tint: "#eceefb",
        charcoal: "#23262e",
        charcoalDeep: "#181a20",
        beige: "#efe7d8",
        beigeDeep: "#e2d7c0",
      },
      maxWidth: {
        page: "1180px",
      },
      boxShadow: {
        card: "5px 5px 0 rgba(11,15,26,0.9)",
        cardSoft: "4px 4px 0 rgba(11,15,26,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
