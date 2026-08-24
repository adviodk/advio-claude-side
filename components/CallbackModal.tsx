"use client";

import { useState } from "react";

export default function CallbackModal({
  label = "Ring os op",
  className = "inline-flex items-center gap-2 rounded-none bg-beige px-6 py-3.5 text-sm font-semibold text-navyDeep transition-colors hover:bg-beigeDeep",
}: {
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [navn, setNavn] = useState("");
  const [telefon, setTelefon] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "ring-mig-op", navn, telefon }),
      });
    } catch {
      // Ignore — we still confirm to the user below.
    }
    setSent(true);
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {label}
        <span aria-hidden>→</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            {sent ? (
              <div className="py-4 text-center">
                <p className="font-display text-lg font-black text-ink">
                  Tak!
                </p>
                <p className="mt-2 text-sm text-muted">
                  Vi ringer dig op hurtigst muligt.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="font-display text-lg font-black text-ink">
                  Ring mig op
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Læg dit nummer, så ringer vi dig op.
                </p>
                <div className="mt-6 space-y-5">
                  <label className="block">
                    <span className="field-label">Navn</span>
                    <input
                      required
                      type="text"
                      name="navn"
                      value={navn}
                      onChange={(e) => setNavn(e.target.value)}
                      className="field"
                    />
                  </label>
                  <label className="block">
                    <span className="field-label">Telefonnummer</span>
                    <input
                      required
                      type="tel"
                      name="telefon"
                      value={telefon}
                      onChange={(e) => setTelefon(e.target.value)}
                      className="field"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="mt-5 w-full rounded-none bg-beige py-3.5 text-sm font-semibold text-navyDeep transition-colors hover:bg-beigeDeep"
                >
                  Ring mig op
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-3 w-full text-center text-sm text-muted hover:text-ink"
                >
                  Luk
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
