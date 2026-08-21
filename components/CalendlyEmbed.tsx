"use client";

import Script from "next/script";

export default function CalendlyEmbed() {
  return (
    <div className="border border-ink bg-white shadow-cardSoft">
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
