import type { Metadata } from "next";
import Hero from "@/components/redesign/Hero";
import LogoMarquee from "@/components/redesign/LogoMarquee";
import WhyAdvio from "@/components/redesign/WhyAdvio";
// WhyWebsite (the laptop section) is parked for now — kept for later use.
import Cases from "@/components/redesign/cases/Cases";
import Services from "@/components/redesign/Services";
import Footer from "@/components/redesign/Footer";
import FontTheme from "@/components/FontTheme";
import { fontVariables } from "@/components/fontThemes";

// Page-wide tokens for the redesign; --bg matches the sky in the hero photo.
const tokens = {
  "--bg": "#dbd8d4",
  "--ink": "#1a1a1a",
  "--muted": "#5f5d59",
} as React.CSSProperties;

export const metadata: Metadata = {
  title: "Advio — Hjemmesider til virksomheder i topklasse",
  description:
    "Stilrene, minimalistiske og professionelle hjemmesider til virksomheder, hvor kvalitet er hele forretningen. Få et gratis udkast – du betaler kun, hvis du er tilfreds.",
};

export default function Home() {
  return (
    <div style={tokens} className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <FontTheme variables={fontVariables}>
        <Hero />
        <LogoMarquee />
        <WhyAdvio />
        <Cases />
        <Services />
        <Footer />
      </FontTheme>
    </div>
  );
}
