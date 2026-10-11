"use client";

import { useEffect, useState } from "react";
import { useInViewOnce } from "@/lib/useInViewOnce";
import { serif } from "../fonts";
import { cases } from "./data";
import { contourPaths } from "./contours";
import { MAP_W, MAP_H, denmarkPath, bornholmPath, bornholmInset, project } from "./denmarkMap";
import { BrowserFrame, CaseMeta, CasesTitle, monoLabel } from "./parts";

// Where each pin's label sits, and how far (in map units) the clickable
// marker is pulled away from the real location. Erik Larsen (København N),
// Proelectric (Valby) and Flotsyn (Frederiksberg) are only a few km apart, so
// their markers are spread apart with a thin leader line back to the exact spot.
const pinLayout: { side: "left" | "right"; offset: [number, number] }[] = [
  { side: "left", offset: [-70, -62] },
  { side: "right", offset: [0, 0] },
  { side: "left", offset: [0, 0] },
  { side: "left", offset: [-70, 52] },
  { side: "right", offset: [62, -4] },
];

// Faint height curves inside the land, for a topographic feel.
const terrain = [
  ...contourPaths(260, 470, 11, 2.1, 26),
  ...contourPaths(330, 980, 8, 0.7, 26),
  ...contourPaths(770, 760, 9, 3.3, 24),
  ...contourPaths(520, 860, 6, 5.2, 22),
];

/**
 * C — "Kort": a map of Denmark (Natural Earth coastline) that draws itself
 * when it scrolls into view, with a pin at each customer's real address.
 * The active case cycles on its own; hovering or tapping a pin takes over.
 */
export default function CasesKort() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>(0.25);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActive((a) => (a + 1) % cases.length), 4500);
    return () => clearInterval(t);
  }, [inView, paused]);

  const current = cases[active];

  return (
    <section className="px-6 py-28 sm:py-40">
      <CasesTitle />

      <div
        ref={ref}
        className="mx-auto mt-14 grid max-w-[1100px] items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16"
      >
        {/* Map */}
        <div
          className="relative mx-auto w-full max-w-[520px]"
          style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}
          onMouseLeave={() => setPaused(false)}
        >
          <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <clipPath id="dk-land">
                <path d={denmarkPath} />
                <path d={bornholmPath} />
              </clipPath>
            </defs>

            {/* Land fills in after the coastline has drawn */}
            <g
              className="transition-opacity delay-700 duration-[1400ms]"
              style={{ opacity: inView ? 1 : 0 }}
            >
              <path d={denmarkPath} fill="#ebe8e3" />
              <path d={bornholmPath} fill="#ebe8e3" />
              <g clipPath="url(#dk-land)" stroke="#1a1a1a" strokeOpacity={0.08} fill="none" strokeWidth={1.2}>
                {terrain.map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </g>
            </g>

            {/* Coastline that draws itself */}
            {[denmarkPath, bornholmPath].map((d, i) => (
              <path
                key={i}
                d={d}
                pathLength={1}
                fill="none"
                stroke="#1a1a1a"
                strokeOpacity={0.7}
                strokeWidth={1.6}
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 1,
                  strokeDashoffset: inView ? 0 : 1,
                  transition: "stroke-dashoffset 2.6s cubic-bezier(0.65, 0, 0.35, 1)",
                }}
              />
            ))}

            {/* Exact locations + leader lines for markers that are pulled aside */}
            <g className="transition-opacity delay-[1600ms] duration-700" style={{ opacity: inView ? 1 : 0 }}>
              {cases.map((c, i) => {
                const [x, y] = project(c.lon, c.lat);
                const [dx, dy] = pinLayout[i].offset;
                if (!dx && !dy) return null;
                const isActive = i === active;
                return (
                  <g key={c.url} stroke="#1a1a1a">
                    <line
                      x1={x}
                      y1={y}
                      x2={x + dx}
                      y2={y + dy}
                      strokeWidth={isActive ? 2 : 1.4}
                      strokeOpacity={isActive ? 0.8 : 0.4}
                    />
                    <circle cx={x} cy={y} r={5} fill="#1a1a1a" stroke="none" />
                  </g>
                );
              })}
            </g>

            <rect
              {...{ x: bornholmInset.x, y: bornholmInset.y, width: bornholmInset.w, height: bornholmInset.h }}
              rx={6}
              fill="none"
              stroke="#1a1a1a"
              strokeOpacity={0.25}
              className="transition-opacity delay-1000 duration-700"
              style={{ opacity: inView ? 1 : 0 }}
            />
          </svg>

          {/* Pins (HTML, so they're focusable and stay crisp) */}
          {cases.map((c, i) => {
            const [px, py] = project(c.lon, c.lat);
            const [x, y] = [px + pinLayout[i].offset[0], py + pinLayout[i].offset[1]];
            const isActive = i === active;
            const label = pinLayout[i];
            return (
              <button
                key={c.url}
                type="button"
                onMouseEnter={() => {
                  setPaused(true);
                  setActive(i);
                }}
                onClick={() => {
                  setPaused(true);
                  setActive(i);
                }}
                aria-label={`${c.name}, ${c.city}`}
                aria-pressed={isActive}
                className="group absolute -translate-x-1/2 -translate-y-1/2 p-2 transition-[opacity,transform] duration-700 ease-out"
                style={{
                  left: `${(x / MAP_W) * 100}%`,
                  top: `${(y / MAP_H) * 100}%`,
                  opacity: inView ? 1 : 0,
                  transitionDelay: inView ? `${1600 + i * 180}ms` : "0ms",
                  zIndex: isActive ? 2 : 1,
                }}
              >
                {/* Dot with a black ring around it, so it reads clearly on the map */}
                <span className="relative block h-4 w-4">
                  {isActive && (
                    <span className="absolute -inset-2 animate-ping rounded-full border-2 border-[var(--ink)]/50 motion-reduce:animate-none" />
                  )}
                  <span
                    className={`absolute inset-0 rounded-full border-2 border-[var(--ink)] shadow-[0_0_0_2px_var(--bg)] transition-all duration-300 ${
                      isActive
                        ? "scale-125 bg-[var(--ink)] ring-2 ring-[var(--ink)] ring-offset-2 ring-offset-[var(--bg)]"
                        : "bg-white group-hover:scale-110"
                    }`}
                  />
                </span>
                <span
                  className={`${monoLabel} pointer-events-none absolute top-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] transition-colors duration-300 ${
                    label.side === "left" ? "right-full mr-1" : "left-full ml-1"
                  } ${isActive ? "bg-[var(--ink)] text-[var(--bg)]" : "bg-white/70 text-black/60 backdrop-blur-sm"}`}
                  style={{ transform: "translateY(-50%)" }}
                >
                  {c.city}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active case */}
        <div>
          <a
            key={current.url}
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block animate-[case-in_700ms_cubic-bezier(0.16,1,0.3,1)]"
          >
            <BrowserFrame item={current} />
            <div className="mt-6 flex items-start justify-between gap-4">
              <div>
                <p className={`${monoLabel} text-[var(--muted)]`}>{current.city}</p>
                <h3 className={`${serif.className} mt-2 text-3xl tracking-tight sm:text-4xl`}>{current.name}</h3>
                <CaseMeta item={current} />
              </div>
              <span className="mt-1 whitespace-nowrap text-sm underline decoration-black/25 underline-offset-4 transition-colors group-hover:decoration-black/70">
                {current.domain} ↗
              </span>
            </div>
          </a>

          <div className="mt-8 flex gap-2" role="tablist" aria-label="Vælg case">
            {cases.map((c, i) => (
              <button
                key={c.url}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={c.name}
                onClick={() => {
                  setPaused(true);
                  setActive(i);
                }}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  i === active ? "bg-[var(--ink)]" : "bg-black/15 hover:bg-black/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
