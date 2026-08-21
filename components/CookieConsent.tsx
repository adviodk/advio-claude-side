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
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink bg-white shadow-card">
      <div className="mx-auto flex max-w-page flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Vi bruger cookies til statistik (Google Analytics), så vi kan forbedre
          siden. Læs mere i vores{" "}
          <Link href="/privatlivspolitik" className="font-medium text-blue hover:text-blueDeep">
            privatlivspolitik
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => choose("declined")}
            className="border border-ink px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-tint"
          >
            Afvis
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="border border-ink bg-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blueDeep"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
