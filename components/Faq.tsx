"use client";

import { useState } from "react";
import Link from "next/link";

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
    a: "Vi kører normalt ikke med vedligeholdelseskontrakter eller bindingsperioder. På større projekter kan vi dog drifte din hjemmeside for dig – inkl. op til 2 ændringer pr. uge – til en fast månedlig pris.",
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
    <section id="faq" className="scroll-mt-20 border-t border-border bg-white">
      <div className="mx-auto max-w-page px-6 py-24">
        <div className="mb-12 flex items-center gap-4">
          <span className="h-px w-10 bg-blue" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Ofte stillede spørgsmål
          </h2>
        </div>

        <div className="grid gap-x-10 md:grid-cols-2">
          {faqs.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.q} className="border-b border-border">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left text-[15px] font-semibold text-ink"
                >
                  {item.q}
                  <span
                    aria-hidden
                    className={`shrink-0 text-blue transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                  >
                    ⌄
                  </span>
                </button>
                {open && (
                  <p className="pb-5 text-sm leading-relaxed text-muted">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/formular"
            className="group inline-flex items-center gap-3 border border-ink bg-yellow px-8 py-4 text-xs font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-yellow"
          >
            Klar til dit gratis udkast?
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
