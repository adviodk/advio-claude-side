"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CONSENT_EVENT, getStoredConsent, setStoredConsent } from "@/lib/consent";

export default function CalendlyEmbed() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(getStoredConsent() === "accepted");

    function handleConsentChange(e: Event) {
      const detail = (e as CustomEvent<string>).detail;
      setEnabled(detail === "accepted");
    }

    window.addEventListener(CONSENT_EVENT, handleConsentChange);
    return () => window.removeEventListener(CONSENT_EVENT, handleConsentChange);
  }, []);

  if (!enabled) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-white p-8 text-center shadow-card"
        style={{ minHeight: "650px" }}
      >
        <p className="font-display text-lg font-black text-ink">
          Kalenderen kræver cookies
        </p>
        <p className="max-w-xs text-sm text-muted">
          Vi bruger Calendly til at vise ledige tider. Accepter cookies for at
          indlæse kalenderen.
        </p>
        <button
          type="button"
          onClick={() => setStoredConsent("accepted")}
          className="rounded-full bg-beige px-6 py-3 text-sm font-semibold text-navyDeep transition-colors hover:bg-beigeDeep"
        >
          Accepter cookies
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card">
      <div
        className="calendly-inline-widget"
        data-url="https://calendly.com/simon-advio?hide_event_type_details=1&hide_gdpr_banner=1"
        style={{ minWidth: "280px", height: "650px" }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </div>
  );
}
