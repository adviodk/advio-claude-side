"use client";

import { useEffect, useRef } from "react";

export default function PhoneScrollVideo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let rafId = 0;

    function setFrameFromScroll() {
      const rect = wrap!.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress =
        scrollable > 0
          ? Math.min(1, Math.max(0, -rect.top / scrollable))
          : 0;
      const duration = video!.duration;
      if (duration) {
        video!.currentTime = progress * duration;
      }
    }

    function loop() {
      setFrameFromScroll();
      rafId = requestAnimationFrame(loop);
    }

    function handleLoaded() {
      // A paused <video> that has never played can fail to paint its
      // current frame in some browsers. Playing then immediately pausing
      // once "warms up" the decoder so later currentTime seeks render.
      video!
        .play()
        .then(() => video!.pause())
        .catch(() => {})
        .finally(() => {
          if (reduceMotion) {
            video!.currentTime = video!.duration;
          } else {
            setFrameFromScroll();
          }
        });
    }

    video.addEventListener("loadedmetadata", handleLoaded);
    if (video.readyState >= 1) handleLoaded();

    if (reduceMotion) {
      return () => video.removeEventListener("loadedmetadata", handleLoaded);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          rafId = requestAnimationFrame(loop);
        } else {
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0 },
    );
    io.observe(wrap);

    return () => {
      io.disconnect();
      cancelAnimationFrame(rafId);
      video.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative motion-safe:h-[170vh]">
      <div className="flex items-center justify-center py-10 motion-safe:sticky motion-safe:top-24 motion-safe:h-[calc(100vh-6rem)] motion-safe:py-0">
        <div className="w-[220px] overflow-hidden rounded-[2.5rem] shadow-card sm:w-[260px] lg:w-[300px]">
          <video
            ref={videoRef}
            src="/assets/phone-rotation.mp4"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="block h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}
