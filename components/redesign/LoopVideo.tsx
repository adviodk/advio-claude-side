"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A muted looping video laid over a still image (rendered separately, e.g. with
 * next/image, so it stays the LCP element). Loads only after the page has
 * rendered, fades in once it actually plays, and is skipped entirely for
 * reduced motion or data-saver / very slow connections.
 */
export default function LoopVideo({
  src,
  mobileSrc,
  className = "",
}: {
  src: string;
  mobileSrc: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const connection = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } })
      .connection;
    if (connection?.saveData || ["slow-2g", "2g"].includes(connection?.effectiveType ?? "")) return;

    const start = () => {
      video.src = window.matchMedia("(max-width: 767px)").matches ? mobileSrc : src;
      video.load();
      video.play().catch(() => {});
    };
    const t = setTimeout(start, 300);
    return () => clearTimeout(t);
  }, [src, mobileSrc]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      onPlaying={() => setPlaying(true)}
      className={`transition-opacity duration-700 ease-out ${playing ? "opacity-100" : "opacity-0"} ${className}`}
    />
  );
}
