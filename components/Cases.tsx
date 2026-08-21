"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";

const cases = [
  {
    name: "Erik Larsen & Co. VVS",
    tag: "VVS · København",
    body: "Autoriseret VVS-firma i København, kåret som finalist/vinder af Årets Håndværker 2013–2025.",
    href: "https://www.eriklarsen.dk",
    logo: "/assets/case-eriklarsen-logo.png",
    logoAlt: "Erik Larsen & Co. logo",
    logoBg: "bg-ink",
    cardBg: "bg-white",
  },
  {
    name: "VN Isolering",
    tag: "Facade & isolering · Jylland",
    body: "Facade- og isoleringsfirma med base i Jylland, kendt for solidt håndværk og synlige resultater.",
    href: "https://vnisolering.dk",
    logo: "/assets/case-vni-logo.png",
    logoAlt: "VN Isolering logo",
    logoBg: "bg-white",
    cardBg: "bg-beige",
  },
  {
    name: "Proelectric",
    tag: "Elinstallation · Valby",
    body: "Autoriseret elinstallatør i Valby, der udfører el-installationer for private og erhverv.",
    href: "https://proelectric.dk",
    logo: "/assets/case-proelectric-logo.png",
    logoAlt: "Proelectric logo",
    logoBg: "bg-white",
    cardBg: "bg-white",
  },
];

function CaseCard({ c }: { c: (typeof cases)[number] }) {
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <a href={c.href} target="_blank" rel="noopener noreferrer" className="group block">
      <div
        ref={ref}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={handleMove}
        className={`relative cursor-none overflow-hidden rounded-3xl p-8 shadow-cardSoft transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-card ${c.cardBg}`}
      >
        <div
          className={`absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full p-2 ${c.logoBg}`}
        >
          <Image
            src={c.logo}
            alt={c.logoAlt}
            width={80}
            height={80}
            className="h-full w-full object-contain"
          />
        </div>

        <h3 className="mt-16 font-display text-xl font-black text-ink">
          {c.name}
        </h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-navy">
          {c.tag}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted">{c.body}</p>

        <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-navy">
          Se siden
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>

        <div
          className="stained-glass pointer-events-none absolute flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xs font-bold uppercase tracking-wide text-navyDeep transition-transform duration-200"
          style={{
            left: pos.x,
            top: pos.y,
            transform: `translate(-50%, -50%) scale(${hover ? 1 : 0})`,
          }}
        >
          Se siden
        </div>
      </div>
    </a>
  );
}

export default function Cases() {
  return (
    <section id="cases" className="scroll-mt-20 bg-navyDeep">
      <div className="mx-auto max-w-page px-6 py-24">
        <Reveal>
          <div className="mb-4 flex items-center gap-4">
            <span className="h-px w-10 bg-steel" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Udvalgte projekter
            </h2>
          </div>
          <h3 className="leading-[1.05] sm:text-4xl">
            <span className="font-sans text-3xl font-black uppercase text-white sm:text-4xl">
              Cases
            </span>{" "}
            <span className="font-display text-3xl italic text-beige sm:text-4xl">
              der taler for sig selv
            </span>
          </h3>
        </Reveal>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c, i) => (
            <Reveal key={c.name} delay={i * 80}>
              <CaseCard c={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
