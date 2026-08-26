"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredConsent, setStoredConsent } from "@/lib/consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getStoredConsent() === null);
  }, []);

  function choose(value: "accepted" | "declined") {
    setStoredConsent(value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-navyDeep/70 p-8 shadow-2xl backdrop-blur-2xl">
        <button
          type="button"
          onClick={() => choose("declined")}
          aria-label="Luk"
          className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-none border border-white/20 text-white/70 transition-colors hover:border-white/40 hover:text-white"
        >
          ✕
        </button>

        <h2 className="pr-12 font-sans text-xl font-black text-white">
          Websitet bruger cookies
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-white/70">
          Vi bruger cookies til statistik (Google Analytics), så vi kan
          forbedre siden. Ved at klikke &ldquo;Godkend&rdquo; accepterer du
          brugen af cookies.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="flex-1 rounded-none bg-beige px-5 py-3 text-sm font-semibold text-navyDeep transition-colors hover:bg-beigeDeep"
          >
            Godkend
          </button>
          <button
            type="button"
            onClick={() => choose("declined")}
            className="flex-1 rounded-none border border-white/25 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Afvis
          </button>
        </div>

        <Link
          href="/privatlivspolitik"
          className="mt-6 block text-center text-xs font-medium text-white/50 underline underline-offset-2 transition-colors hover:text-white/80"
        >
          Privatlivspolitik
        </Link>
      </div>
    </div>
  );
}
