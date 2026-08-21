"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";

const cases = [
  {
    name: "Erik Larsen & Co. VVS",
    tag: "VVS · København",
    href: "https://www.eriklarsen.dk",
    image: "/assets/case-eriklarsen-hero.png",
    imageAlt: "Erik Larsen & Co. VVS' team",
    fit: "cover" as const,
  },
  {
    name: "VN Isolering",
    tag: "Facade & isolering · Jylland",
    href: "https://vnisolering.dk",
    image: "/assets/case-vni-after.webp",
    imageAlt: "Facaderenovering udført af VN Isolering",
    fit: "cover" as const,
  },
  {
    name: "Proelectric",
    tag: "Elinstallation · Valby",
    href: "https://proelectric.dk",
    image: "/assets/case-proelectric-logo.png",
    imageAlt: "Proelectric logo",
    fit: "contain" as const,
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
    <a
      href={c.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div
        ref={ref}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={handleMove}
        className="relative aspect-[4/5] w-full cursor-none overflow-hidden rounded-2xl border border-navy/50 bg-steel"
      >
        <Image
          src={c.image}
          alt={c.imageAlt}
          fill
          className={`transition duration-500 group-hover:scale-105 ${
            c.fit === "cover" ? "object-cover" : "object-contain p-6"
          }`}
        />
        <div className="absolute inset-0 bg-navyDeep/0 transition-colors duration-300 group-hover:bg-navyDeep/10" />

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

      <div className="mt-4">
        <h3 className="font-display text-lg font-black text-white">
          {c.name}
        </h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-steel">
          {c.tag}
        </p>
      </div>
    </a>
  );
}

export default function Cases() {
  return (
    <section id="cases" className="scroll-mt-20 bg-navyDeep">
      <div className="mx-auto max-w-page px-6 py-24">
        <Reveal>
          <h2 className="font-display text-3xl font-black text-white sm:text-4xl">
            Cases
          </h2>
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
