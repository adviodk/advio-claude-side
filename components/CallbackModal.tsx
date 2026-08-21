"use client";

import { useState } from "react";

export default function CallbackModal() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 border border-ink bg-ink px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blueDeep"
      >
        Ring os op
        <span aria-hidden>→</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm border border-ink bg-white p-7 shadow-card"
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <h3 className="font-display text-lg font-black text-ink">
                  Ring mig op
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Læg dit nummer, så ringer vi dig op.
                </p>
                <div className="mt-5 space-y-3">
                  <input
                    required
                    type="text"
                    placeholder="Dit navn"
                    className="field"
                  />
                  <input
                    required
                    type="tel"
                    placeholder="Dit telefonnummer"
                    className="field"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-5 w-full border border-ink bg-blue py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blueDeep"
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
