"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import BeforeAfterSlider from "./BeforeAfterSlider";

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[240px] rounded-[2.8rem] bg-gradient-to-b from-[#e2e5ec] via-[#aab0c2] to-[#7d8399] p-[3px] shadow-[10px_10px_0_rgba(35,38,46,0.12)] sm:w-[260px]">
      <div className="rounded-[2.7rem] bg-charcoalDeep p-[10px]">
        <div className="absolute -left-[3px] top-24 h-8 w-[3px] rounded-l bg-[#8a90a3]" />
        <div className="absolute -left-[3px] top-36 h-12 w-[3px] rounded-l bg-[#8a90a3]" />
        <div className="absolute -right-[3px] top-28 h-16 w-[3px] rounded-r bg-[#8a90a3]" />

        <div className="relative overflow-hidden rounded-[2rem] bg-white">
          <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-charcoalDeep" />
          {children}
        </div>
      </div>
    </div>
  );
}

export default function PhoneShowcase() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const hoverRef = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent) {
    const rect = hoverRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  useEffect(() => {
    let raf = 0;

    function update() {
      const el = wrapRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = (vh - rect.top) / (vh + rect.height);
        const clamped = Math.min(1, Math.max(0, progress));
        setRotation(clamped * 180);
      }
      raf = requestAnimationFrame(update);
    }

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={wrapRef} className="flex justify-center" style={{ perspective: "1200px" }}>
      <div
        className="relative"
        style={{
          transform: `rotateY(${rotation}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div style={{ backfaceVisibility: "hidden" }}>
          <div
            ref={hoverRef}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onMouseMove={handleMove}
            className="relative cursor-none"
          >
            <PhoneFrame>
              <div className="px-5 pb-6 pt-9">
                <p className="text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-steel">
                  Før &amp; efter
                </p>
                <h4 className="mt-1.5 text-center font-display text-base font-black leading-tight text-ink">
                  Se forskellen med egne øjne
                </h4>

                <div className="mt-4">
                  <BeforeAfterSlider
                    before="/assets/case-vni-before.webp"
                    after="/assets/case-vni-after.webp"
                    beforeAlt="VN Isolering før"
                    afterAlt="VN Isolering efter"
                    aspectClass="aspect-[4/3]"
                  />
                </div>
                <p className="mt-2.5 text-center text-xs text-muted">
                  Facaderenovering udført af VN Isolering
                </p>
              </div>
            </PhoneFrame>

            <div
              className="pointer-events-none absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-beige text-center text-[10px] font-bold uppercase leading-tight tracking-wide text-navyDeep transition-transform duration-200"
              style={{
                left: pos.x,
                top: pos.y,
                transform: `translate(-50%, -50%) scale(${hover ? 1 : 0})`,
              }}
            >
              Træk for at se
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <PhoneFrame>
            <div className="flex aspect-[9/16] items-center justify-center">
              <Image
                src="/assets/advio-logo.png"
                alt="Advio"
                width={40}
                height={40}
                className="opacity-80"
              />
            </div>
          </PhoneFrame>
        </div>
      </div>
    </div>
  );
}
