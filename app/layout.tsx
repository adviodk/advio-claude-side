import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
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
        className={`${inter.variable} ${sourceSerif.variable} font-sans antialiased`}
      >
        {children}
        <CookieConsent />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
