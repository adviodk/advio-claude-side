"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function BeforeAfterSlider({
  before,
  after,
  beforeAlt,
  afterAlt,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
}) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function updateFromClientX(clientX: number) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, ratio)));
  }

  function handlePointerDown(e: React.PointerEvent) {
    dragging.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  }

  function handlePointerUp() {
    dragging.current = false;
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative aspect-[9/16] w-full touch-none select-none overflow-hidden rounded-[1.6rem] bg-ink"
    >
      <Image
        src={after}
        alt={afterAlt}
        fill
        sizes="280px"
        className="pointer-events-none object-cover"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={before}
          alt={beforeAlt}
          fill
          sizes="280px"
          className="object-cover"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-white"
        style={{ left: `${position}%` }}
      />
      <div
        className="absolute top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-charcoalDeep shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
        style={{ left: `${position}%` }}
      >
        <span aria-hidden className="text-xs leading-none">◂▸</span>
      </div>

      <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-charcoalDeep/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
        Før
      </span>
      <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-emerald-600/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
        Efter
      </span>
    </div>
  );
}
