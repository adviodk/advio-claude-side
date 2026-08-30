"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import Reveal from "./Reveal";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const nextFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (window.location.search.includes("sent=true")) {
      setSent(true);
    }
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    if (nextFieldRef.current) {
      nextFieldRef.current.value = `${window.location.origin}/?sent=true#kontakt`;
    }

    const data = new FormData(e.currentTarget);
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "kontaktformular",
        navn: data.get("navn"),
        kontakt: data.get("kontakt"),
      }),
      keepalive: true,
    }).catch(() => {});

    // No preventDefault: submits natively to FormSubmit, which redirects
    // back to _next once the email has been sent server-side.
  }

  return (
    <section id="kontakt" className="scroll-mt-20 bg-navy-fade">
      <div className="mx-auto max-w-page px-6 py-24">
        <Reveal>
          <div className="mb-4 flex items-center gap-4">
            <span className="h-px w-10 bg-steel" />
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/50">
              Kontakt
            </span>
          </div>
          <h2 className="mb-12 leading-[1.02] tracking-tight">
            <span className="font-display text-3xl font-bold uppercase text-white sm:text-4xl">
              Har du
            </span>{" "}
            <span className="font-display text-3xl font-medium uppercase text-beige sm:text-4xl">
              nogle spørgsmål?
            </span>
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <div className="rounded-2xl bg-white p-8 shadow-card">
              {sent ? (
                <div className="py-10 text-center">
                  <p className="font-display text-xl font-bold text-ink">
                    Tak for din besked!
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Vi vender tilbage hurtigst muligt.
                  </p>
                </div>
              ) : (
                <form
                  action="https://formsubmit.co/simon@advio.dk"
                  method="POST"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <input type="hidden" name="_subject" value="Spørgsmål fra advio.dk" />
                  <input type="hidden" name="_template" value="table" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_next" ref={nextFieldRef} value="" />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="field-label">Navn</span>
                      <input required type="text" name="navn" className="field" />
                    </label>
                    <label className="block">
                      <span className="field-label">Email eller telefon</span>
                      <input required type="text" name="kontakt" className="field" />
                    </label>
                  </div>
                  <label className="block">
                    <span className="field-label">Besked</span>
                    <textarea
                      required
                      name="besked"
                      rows={4}
                      className="field resize-none"
                    />
                  </label>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-none bg-beige py-3.5 text-sm font-semibold text-navyDeep transition-colors hover:bg-beigeDeep"
                  >
                    Send besked
                    <span aria-hidden>→</span>
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-8">
              <div>
                <p className="font-display text-xl font-bold text-white">
                  Foretrækker du at ringe?
                </p>
                <p className="mt-2 text-sm text-white/60">
                  Ring til os på{" "}
                  <a href="tel:+4522494295" className="font-medium text-beige">
                    22 49 42 95
                  </a>
                  .
                </p>
              </div>
              <div className="mt-6">
                <a
                  href="tel:+4522494295"
                  className="inline-flex items-center gap-2 rounded-none bg-beige px-6 py-3.5 text-sm font-semibold text-navyDeep transition-colors hover:bg-beigeDeep"
                >
                  Ring til os
                  <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
