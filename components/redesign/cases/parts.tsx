"use client";

import Image from "next/image";
import { serif, mono } from "../fonts";
import type { CaseItem } from "./data";

export const monoLabel = `${mono.className} text-[10px] uppercase tracking-[0.32em]`;

export function CasesTitle({ light = false }: { light?: boolean }) {
  return (
    <div className="text-center">
      <h2
        className={`${serif.className} text-[2.9rem] font-normal leading-[1] tracking-[-0.01em] sm:text-7xl ${
          light ? "text-white" : ""
        }`}
      >
        Udvalgte <em className="italic">cases</em>
      </h2>
    </div>
  );
}

/** A screenshot inside a minimal browser window. */
export function BrowserFrame({
  item,
  className = "",
  sizes = "(min-width: 1024px) 560px, 100vw",
  aspect = "aspect-[16/9]",
}: {
  item: CaseItem;
  className?: string;
  sizes?: string;
  aspect?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_24px_50px_-24px_rgba(0,0,0,0.45)] ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-black/[0.06] bg-[#f4f2ee] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-black/15" />
        <span className="h-2 w-2 rounded-full bg-black/15" />
        <span className="h-2 w-2 rounded-full bg-black/15" />
        <span className={`${mono.className} mx-auto text-[10px] tracking-wide text-black/45`}>
          {item.domain}
        </span>
      </div>
      <div className={`relative ${aspect}`}>
        <Image
          src={item.shot}
          alt={`Forsiden af ${item.domain}`}
          fill
          sizes={sizes}
          quality={90}
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

export function CaseMeta({ item, light = false }: { item: CaseItem; light?: boolean }) {
  return (
    <p className={`${monoLabel} mt-2 ${light ? "text-white/60" : "text-[var(--muted)]"}`}>
      {item.trade} · {item.place}
    </p>
  );
}
