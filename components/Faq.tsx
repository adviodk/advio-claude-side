"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { ButtonLink } from "./Button";

const faqs = [
  {
    q: "Hvor lang er leveringstiden?",
    a: "Typisk levering er 2 dage. Du modtager et færdigt udkast, som du kan gennemgå sammen med os.",
  },
  {
    q: "Er det gratis?",
    a: "Ja – selve hjemmesideudkastet er 100% gratis at se. Vi tager først betaling, når den skal sættes op på dit domæne.",
  },
  {
    q: "Tilbyder I annoncering (ads)?",
    a: "Ja, vi tilbyder yderligere Facebook Ads og Google Ads, så din nye hjemmeside også får trafik fra dag ét.",
  },
  {
    q: "Er der servicegebyr eller binding?",
    a: "Vi kører normalt ikke med vedligeholdelseskontrakter eller bindingsperioder. På større projekter kan vi dog drifte din hjemmeside for dig til en fast månedlig pris.",
  },
  {
    q: "Hvad hvis jeg allerede har en hjemmeside?",
    a: "Intet problem. Vi laver et nyt udkast med udgangspunkt i din nuværende side, så du kan se forskellen, før du beslutter dig.",
  },
  {
    q: "Hvem ejer hjemmesiden bagefter?",
    a: "Det gør du. Når siden er sat op på dit domæne, er den 100% din.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="scroll-mt-20 bg-navy-fade">
      <div className="mx-auto max-w-page px-6 py-24 sm:py-32">
        <SectionHeading
          eyebrow="Ofte stillede spørgsmål"
          lead="Godt at"
          accent="vide"
          className="mb-14 sm:mb-16"
        />

        <Reveal delay={80}>
          <div className="mx-auto max-w-3xl divide-y divide-white/10 border-t border-white/10">
            {faqs.map((item, i) => {
              const open = openIndex === i;
              return (
                <div key={item.q}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    className="group flex w-full items-center justify-between gap-8 py-6 text-left transition-colors"
                  >
                    <span
                      className={`font-display text-lg font-medium transition-colors sm:text-xl ${
                        open ? "text-white" : "text-white/70 group-hover:text-white"
                      }`}
                    >
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      className="relative h-3 w-3 shrink-0"
                    >
                      <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-beige" />
                      <span
                        className={`absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-beige transition-transform duration-300 ${
                          open ? "rotate-90 scale-0" : ""
                        }`}
                      />
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-xl pb-6 text-[15px] leading-relaxed text-white/55">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-16 flex justify-center">
            <ButtonLink href="/formular">Klar til dit gratis udkast?</ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
