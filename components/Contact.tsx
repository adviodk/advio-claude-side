"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { ButtonSubmit, ButtonAnchor } from "./Button";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const nextFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (window.location.search.includes("sent=true")) {
      setSent(true);
    }
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    // Non-blocking, same pattern as the /formular submit: never navigate the
    // browser to FormSubmit. Send the notification + the FormSubmit email in
    // the background and show the confirmation locally.
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    if (nextFieldRef.current) {
      // Kept for FormSubmit's own records — we no longer rely on its redirect.
      nextFieldRef.current.value = `${window.location.origin}/?sent=true#kontakt`;
    }
    const data = new FormData(e.currentTarget);

    // Telegram notification — unchanged contract.
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

    // FormSubmit email in the background — same endpoint, same field names +
    // hidden fields => same email. Small text-only body; mode:"no-cors" mirrors
    // how a form POST looks to the browser (opaque response, fire-and-forget).
    fetch("https://formsubmit.co/simon@advio.dk", {
      method: "POST",
      mode: "no-cors",
      body: data,
    }).catch(() => {});

    setSent(true);
  }

  return (
    <section id="kontakt" className="scroll-mt-20 bg-navy-fade">
      <div className="mx-auto max-w-page px-6 py-24 sm:py-32">
        <SectionHeading
          eyebrow="Kontakt"
          lead="Har du"
          accent="nogle spørgsmål?"
          className="mb-14 sm:mb-16"
        />

        <div className="grid gap-16 md:grid-cols-[1fr_1.5fr]">
          <Reveal className="md:pt-2">
            <p className="max-w-xs text-[15px] leading-relaxed text-white/55">
              Foretrækker du at ringe? Vi svarer normalt inden for få timer.
            </p>
            <a
              href="tel:+4522494295"
              className="mt-4 block font-display text-3xl font-medium text-white transition-colors hover:text-beige"
            >
              22 49 42 95
            </a>
            <div className="mt-8">
              <ButtonAnchor href="tel:+4522494295" variant="ghost">
                Ring til os
              </ButtonAnchor>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="border border-white/10 bg-ink/40 p-9 shadow-2xl backdrop-blur-2xl sm:p-12">
              {sent ? (
                <div className="py-10 text-center">
                  <p className="font-display text-2xl font-medium text-white">
                    Tak for din besked!
                  </p>
                  <p className="mt-2 text-sm text-white/55">
                    Vi vender tilbage hurtigst muligt.
                  </p>
                </div>
              ) : (
                <form
                  action="https://formsubmit.co/simon@advio.dk"
                  method="POST"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <input type="hidden" name="_subject" value="Spørgsmål fra advio.dk" />
                  <input type="hidden" name="_template" value="table" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_next" ref={nextFieldRef} value="" />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="block">
                      <span className="field-label-dark">Navn</span>
                      <input required type="text" name="navn" className="field-dark" />
                    </label>
                    <label className="block">
                      <span className="field-label-dark">Email eller telefon</span>
                      <input required type="text" name="kontakt" className="field-dark" />
                    </label>
                  </div>
                  <label className="block">
                    <span className="field-label-dark">Besked</span>
                    <textarea
                      required
                      name="besked"
                      rows={4}
                      className="field-dark resize-none"
                    />
                  </label>
                  <ButtonSubmit disabled={submitting}>
                    {submitting ? "Sender…" : "Send besked"}
                  </ButtonSubmit>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
