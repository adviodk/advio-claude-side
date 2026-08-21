"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";

const cases = [
  {
    n: "01",
    name: "Erik Larsen & Co. VVS",
    tag: "VVS · København",
    href: "https://www.eriklarsen.dk",
    image: "/assets/case-eriklarsen-logo.png",
    imageAlt: "Erik Larsen & Co. logo",
  },
  {
    n: "02",
    name: "VN Isolering",
    tag: "Facade & isolering · Jylland",
    href: "https://vnisolering.dk",
    image: "/assets/case-vni-logo.png",
    imageAlt: "VN Isolering logo",
  },
  {
    n: "03",
    name: "Proelectric",
    tag: "Elinstallation · Valby",
    href: "https://proelectric.dk",
    image: "/assets/case-proelectric-logo.png",
    imageAlt: "Proelectric logo",
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
        className="relative aspect-[4/5] w-full cursor-none overflow-hidden rounded-3xl border border-white/10 bg-ink transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-white/20 group-hover:shadow-[0_20px_40px_rgba(8,13,24,0.4)]"
      >
        <span className="absolute left-6 top-6 font-display text-xs text-white/30">
          {c.n}
        </span>

        <div className="absolute inset-0 flex items-center justify-center p-12">
          <Image
            src={c.image}
            alt={c.imageAlt}
            fill
            className="object-contain p-12 transition duration-500 group-hover:scale-105"
          />
        </div>

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

      <div className="mt-5 flex items-baseline justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-black text-white">
            {c.name}
          </h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-steel">
            {c.tag}
          </p>
        </div>
        <span
          aria-hidden
          className="shrink-0 text-lg text-beige transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
        >
          ↗
        </span>
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
