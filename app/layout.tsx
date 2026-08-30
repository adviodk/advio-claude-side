import type { Metadata } from "next";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Advio — Professionel hjemmeside på 2 dage",
  description:
    "Få flere kunder med en professionel hjemmeside. Du betaler kun hvis du er tilfreds – typisk levering på 2 dage.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da">
      <body
        className={`${hankenGrotesk.variable} ${newsreader.variable} font-sans antialiased`}
      >
        {children}
        <CookieConsent />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
