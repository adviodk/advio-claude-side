"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useInViewOnce } from "@/lib/useInViewOnce";

function CheckIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StepConnector({ n }: { n: number }) {
  return (
    <div className="flex flex-col items-center">
      <span className="h-8 w-px bg-white/15" />
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-white/15 bg-white/5 font-display text-sm font-bold text-white">
        {n}
      </span>
      <span className="h-8 w-px bg-white/15" />
    </div>
  );
}

function StepCard({
  eyebrow,
  title,
  children,
  demo,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  demo: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8 rounded-2xl border border-white/10 bg-white p-8 shadow-cardSoft md:flex-row md:items-center md:justify-between md:gap-10 md:p-12">
      <div className="max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">
          {eyebrow}
        </p>
        <h3 className="mt-2 font-display text-2xl font-bold leading-[1.1] text-ink sm:text-3xl">
          {title}
        </h3>
        {children}
      </div>
      <div className="flex md:justify-end">{demo}</div>
    </div>
  );
}

// --- Step 1: udfyld skema ---------------------------------------------

const step1Fields = [
  { label: "Branche", value: "VVS-installatør" },
  { label: "Navn", value: "Frederiksen VVS ApS" },
  { label: "Beskrivelse", value: "Ny hjemmeside til håndværksvirksomhed" },
];

function Step1Demo({ inView }: { inView: boolean }) {
  return (
    <div className="w-full max-w-sm space-y-3">
      {step1Fields.map((field, i) => (
        <div
          key={field.label}
          className={`flex items-center justify-between gap-4 border border-border bg-canvas px-5 py-3.5 transition-all duration-500 ease-out ${
            inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
          style={{ transitionDelay: `${i * 280}ms` }}
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-mist">
              {field.label}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-ink">
              {field.value}
            </p>
          </div>
          <span
            className={`flex h-6 w-6 flex-none items-center justify-center rounded-full bg-beige text-navyDeep transition-all duration-300 ease-out ${
              inView ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
            style={{ transitionDelay: `${i * 280 + 400}ms` }}
          >
            <CheckIcon />
          </span>
        </div>
      ))}
    </div>
  );
}

// --- Step 2: hvad skal med -----------------------------------------------

const step2Pages = [
  { label: "Formular", selected: true },
  { label: "Cases", selected: true },
  { label: "Anmeldelser", selected: true },
  { label: "Om os", selected: true },
  { label: "Prisliste", selected: false },
  { label: "FAQ", selected: false },
  { label: "Blog", selected: false },
];

function Step2Demo({ inView }: { inView: boolean }) {
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setSelecting(true), 650);
    return () => clearTimeout(t);
  }, [inView]);

  let selectedOrder = -1;

  return (
    <div className="grid w-full max-w-sm grid-cols-2 gap-2.5 sm:grid-cols-3">
      {step2Pages.map((page, i) => {
        if (page.selected) selectedOrder += 1;
        const active = page.selected && selecting;
        return (
          <div
            key={page.label}
            className={`flex items-center justify-between gap-2 border px-3.5 py-3 text-xs font-semibold transition-all duration-500 ease-out ${
              active
                ? "border-navy bg-navy text-white"
                : "border-border bg-canvas text-muted"
            } ${inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
            style={{ transitionDelay: `${i * 90}ms` }}
          >
            <span>{page.label}</span>
            {page.selected && (
              <span
                className={`flex h-4 w-4 flex-none items-center justify-center rounded-full bg-beige text-navyDeep transition-all duration-300 ease-out ${
                  active ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
                style={{ transitionDelay: `${selectedOrder * 250}ms` }}
              >
                <CheckIcon className="h-2.5 w-2.5" />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// --- Step 3: vi laver hjemmesiden -----------------------------------------

const step3Stages = ["Afventer", "Igangsat", "Færdig"] as const;

function Step3Demo({ inView }: { inView: boolean }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setStage(1), 700);
    const t2 = setTimeout(() => setStage(2), 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [inView]);

  return (
    <div
      className={`flex w-full max-w-sm flex-col transition-all duration-500 ease-out ${
        inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      {step3Stages.map((label, i) => {
        const status = i < stage ? "done" : i === stage ? "active" : "pending";
        return (
          <div key={label} className="flex flex-col items-start">
            <div
              className={`inline-flex items-center gap-2.5 border px-5 py-3 text-sm font-semibold transition-colors duration-500 ${
                status === "active"
                  ? "border-navy bg-navy text-white"
                  : "border-border bg-canvas text-mist"
              }`}
            >
              <span
                className={`h-2 w-2 flex-none rounded-full transition-colors duration-500 ${
                  status === "active"
                    ? "bg-beige"
                    : status === "done"
                      ? "bg-steel"
                      : "bg-border"
                }`}
              />
              {label}
            </div>
            {i < step3Stages.length - 1 && (
              <span className="ml-6 h-6 w-px bg-border" />
            )}
          </div>
        );
      })}
      <p
        className={`mt-4 text-xs font-medium uppercase tracking-[0.14em] text-mist transition-opacity duration-700 ${
          stage === 2 ? "opacity-100" : "opacity-0"
        }`}
      >
        Klar inden for 48 timer
      </p>
    </div>
  );
}

// --- Section ---------------------------------------------------------------

export default function ProcessSteps() {
  const step1 = useInViewOnce<HTMLDivElement>();
  const step2 = useInViewOnce<HTMLDivElement>();
  const step3 = useInViewOnce<HTMLDivElement>();

  return (
    <div className="mt-12 flex flex-col">
      <StepConnector n={1} />
      <div ref={step1.ref}>
        <StepCard
          eyebrow="Trin 1"
          title="Udfyld spørgeskemaet på 5 minutter."
          demo={<Step1Demo inView={step1.inView} />}
        >
          <Link
            href="/formular"
            className="mt-5 inline-flex items-center gap-2 rounded-none bg-beige px-6 py-3 text-sm font-semibold text-navyDeep transition-colors hover:bg-beigeDeep"
          >
            Start skemaet
            <span aria-hidden>→</span>
          </Link>
        </StepCard>
      </div>

      <StepConnector n={2} />
      <div ref={step2.ref}>
        <StepCard
          eyebrow="Trin 2"
          title="Hvad vil du have med?"
          demo={<Step2Demo inView={step2.inView} />}
        >
          <p className="mt-2 text-sm text-muted">
            Du vælger selv, hvilke sider din hjemmeside skal have.
          </p>
        </StepCard>
      </div>

      <StepConnector n={3} />
      <div ref={step3.ref}>
        <StepCard
          eyebrow="Trin 3"
          title="Vi laver hjemmesiden."
          demo={<Step3Demo inView={step3.inView} />}
        >
          <p className="mt-2 text-sm text-muted">
            Din nye side er klar til kunderne inden for 48 timer.
          </p>
        </StepCard>
      </div>
    </div>
  );
}
