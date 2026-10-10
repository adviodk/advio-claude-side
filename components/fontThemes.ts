import { Cormorant_Garamond, Jost } from "next/font/google";

/**
 * Fonts for the redesign and the questionnaire: Cormorant Garamond for
 * headlines, Jost for everything else (body and small labels).
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--ff-cormorant",
});
const jost = Jost({ subsets: ["latin"], variable: "--ff-jost" });

export const fontVariables = `${cormorant.variable} ${jost.variable}`;

/** Maps the three font roles used by the components onto the chosen fonts. */
export const fontRoles = {
  "--f-serif": "var(--ff-cormorant)",
  "--f-sans": "var(--ff-jost)",
  "--f-mono": "var(--ff-jost)",
} as React.CSSProperties;
