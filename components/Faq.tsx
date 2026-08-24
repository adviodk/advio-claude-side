"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";

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
      <div className="mx-auto max-w-page px-6 py-24">
        <Reveal>
          <div className="mb-4 flex items-center gap-4">
            <span className="h-px w-10 bg-steel" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Ofte stillede spørgsmål
            </span>
          </div>
          <h2 className="mb-12 leading-[1.02] tracking-tight">
            <span className="font-sans text-3xl font-black uppercase text-white sm:text-4xl">
              Godt at
            </span>{" "}
            <span className="font-display text-3xl font-medium uppercase text-beige sm:text-4xl">
              vide
            </span>
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="grid items-start gap-x-10 md:grid-cols-2">
            {faqs.map((item, i) => {
              const open = openIndex === i;
              return (
                <div key={item.q} className="border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left text-[15px] font-semibold text-white"
                  >
                    {item.q}
                    <span
                      aria-hidden
                      className={`shrink-0 text-beige transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                      }`}
                    >
                      ⌄
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-5 text-sm leading-relaxed text-white/60">
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
          <div className="mt-14 flex justify-center">
            <Link
              href="/formular"
              className="group inline-flex items-center gap-3 rounded-none bg-beige px-8 py-4 text-xs font-bold uppercase tracking-[0.14em] text-navyDeep transition-colors hover:bg-beigeDeep"
            >
              Klar til dit gratis udkast?
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
