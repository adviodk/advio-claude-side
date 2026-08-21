"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Keyframes are real photos of the same physical phone at three angles.
// Each has a slightly different visible bounding box due to perspective
// foreshortening (measured from the source 853x1844 renders), so every
// keyframe gets a small fixed correction to keep it centered/consistently
// sized when it crossfades with its neighbour — without this, switching
// between frames would visibly "pop".
const FRAMES = [
  { src: "/assets/phone-start.png", offsetX: -2.87, offsetY: 1.74, scale: 1.008 },
  { src: "/assets/phone-middle.png", offsetX: 0, offsetY: 0, scale: 1 },
  { src: "/assets/phone-end.png", offsetX: -0.23, offsetY: 0.84, scale: 0.982 },
];

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

export default function PhoneScrollRotation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0.5);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;

    function update() {
      const el = sectionRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height - vh;
        const scrolled = -rect.top;
        const raw = total > 0 ? scrolled / total : 0;
        setProgress(Math.min(1, Math.max(0, raw)));
      }
      raf = requestAnimationFrame(update);
    }

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  const g = reducedMotion ? 0.5 : progress;
  const inFirstHalf = g < 0.5;
  const localRaw = inFirstHalf ? g / 0.5 : (g - 0.5) / 0.5;
  const localP = smoothstep(localRaw);

  const fromIndex = inFirstHalf ? 0 : 1;
  const toIndex = inFirstHalf ? 1 : 2;

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 640 : false;
  const tiltRange = isMobile ? 12 : 22; // deg, continuous sweep across the whole scroll
  const driftRange = isMobile ? 8 : 16; // px
  const tilt = (g - 0.5) * tiltRange;
  const drift = (g - 0.5) * -driftRange;
  const breathe = 1 - Math.abs(g - 0.5) * 0.06;

  const sharedTransform = `rotateY(${tilt}deg) translateX(${drift}px) scale(${breathe})`;

  return (
    <section
      ref={sectionRef}
      className="relative bg-navyDeep"
      style={{ height: reducedMotion ? undefined : "260vh" }}
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-steel">
          Før &amp; efter
        </p>
        <h3 className="mb-10 max-w-md text-center font-display text-2xl font-black text-white sm:text-3xl">
          Se forskellen med egne øjne
        </h3>

        <div
          className="relative w-[220px] sm:w-[280px]"
          style={{ perspective: "1400px", aspectRatio: "853 / 1844" }}
        >
          {FRAMES.map((frame, i) => {
            let opacity = 0;
            if (reducedMotion) {
              opacity = i === 1 ? 1 : 0;
            } else if (i === fromIndex) {
              opacity = 1 - localP;
            } else if (i === toIndex) {
              opacity = localP;
            }

            if (opacity <= 0.001) return null;

            return (
              <div
                key={frame.src}
                className="absolute inset-0"
                style={{
                  opacity,
                  transform: reducedMotion ? undefined : sharedTransform,
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    transform: `translate(${frame.offsetX}%, ${frame.offsetY}%) scale(${frame.scale})`,
                  }}
                >
                  <Image
                    src={frame.src}
                    alt="Advio-hjemmeside vist på en telefon med før/efter-billeder"
                    fill
                    sizes="(min-width: 640px) 280px, 220px"
                    className="object-contain"
                    priority={i === 1}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
