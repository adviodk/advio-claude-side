"use client";

import { useEffect, useRef, useState } from "react";

const DESKTOP_SRC = "/assets/hero-ocean.mp4";
const MOBILE_SRC = "/assets/hero-ocean-mobile.mp4";
const MOBILE_QUERY = "(max-width: 767px)";
const POSTER_SRC = "/assets/hero-ocean-poster.jpg";

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

/**
 * Renders the hero background as a permanent, always-visible <img> poster
 * (a real element, not a <video poster>) with the video layered on top,
 * fading in only once it actually has a frame ready to show.
 *
 * This split matters for LCP: mutating a <video>'s src/calling load()
 * after its poster has already painted can make Chrome re-attribute the
 * LCP paint to the new video resource instead of the original poster
 * paint. Keeping the poster as its own untouched <img> means it is the
 * only element competing for LCP, and its paint time never gets reset by
 * the video loading later. The video itself starts at opacity:0, so it
 * never becomes an LCP candidate before it's ready.
 *
 * The video is loaded and played only once the page has had a chance to
 * render everything else (deferred via requestIdleCallback), and is
 * skipped entirely for prefers-reduced-motion or a very slow/data-saver
 * connection — in both cases the poster simply stays as the background.
 */
export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    // Only skip the video for an explicit data-saver preference or a
    // genuinely very slow connection. "3g" is deliberately excluded: the
    // Network Information API's effectiveType is a coarse, conservative
    // heuristic that reports "3g" for a large share of ordinary mobile
    // connections, and blocking video there would defeat the point of
    // having one for most real mobile visitors.
    const connection = (navigator as unknown as { connection?: NetworkInformation })
      .connection;
    const saveData = connection?.saveData;
    const verySlowConnection =
      !!connection?.effectiveType &&
      ["slow-2g", "2g"].includes(connection.effectiveType);
    if (saveData || verySlowConnection) return;

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    function startLoading() {
      const isMobile = window.matchMedia(MOBILE_QUERY).matches;
      video!.src = isMobile ? MOBILE_SRC : DESKTOP_SRC;
      video!.load();
      video!.play().catch(() => {});
    }

    const ric = (
      window as unknown as {
        requestIdleCallback?: (
          cb: () => void,
          opts?: { timeout: number },
        ) => number;
      }
    ).requestIdleCallback;

    if (ric) {
      idleId = ric(startLoading, { timeout: 2000 });
    } else {
      timeoutId = setTimeout(startLoading, 300);
    }

    return () => {
      if (idleId !== undefined) {
        (
          window as unknown as { cancelIdleCallback?: (id: number) => void }
        ).cancelIdleCallback?.(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <img
        src={POSTER_SRC}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        onPlaying={() => setPlaying(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out motion-reduce:hidden ${
          playing ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
