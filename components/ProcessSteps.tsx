"use client";

import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "./Button";
import { useInViewOnce } from "@/lib/useInViewOnce";

function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

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

// --- scroll-driven progress (desktop only) --------------------------------

/** Tracks 0→1 scroll progress through `ref`'s element, updated via a
 * single passive rAF-throttled listener. Only active at desktop widths —
 * on mobile it stays 0 and the section renders its simplified stacked
 * layout instead, so no scroll work happens there at all. */
function useSectionProgress(ref: React.RefObject<HTMLDivElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    if (!mql.matches) return;

    let rafId = 0;
    let ticking = false;

    function measure() {
      ticking = false;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? clamp(-rect.top / total) : 0;
      setProgress(p);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [ref]);

  return progress;
}

// --- Step 1: udfyld skema ---------------------------------------------

const step1Fields = [
  { label: "Branche", value: "VVS-installatør" },
  { label: "Navn", value: "Frederiksen VVS ApS" },
  { label: "Beskrivelse", value: "Ny hjemmeside til håndværksvirksomhed" },
];

function Step1Demo({
  progress,
  animated = false,
}: {
  progress: number;
  animated?: boolean;
}) {
  const n = step1Fields.length;
  const t = animated ? "transition-all duration-700 ease-out" : "";
  return (
    <div className="w-full max-w-sm space-y-2.5">
      {step1Fields.map((field, i) => {
        const reveal = clamp((progress - i / n) / (0.6 / n));
        const check = clamp((progress - (i + 0.55) / n) / (0.4 / n));
        return (
          <div
            key={field.label}
            className={`flex items-center justify-between gap-4 border border-white/10 bg-white/[0.03] px-5 py-3.5 ${t}`}
            style={{
              opacity: reveal,
              transform: `translateY(${(1 - reveal) * 10}px)`,
            }}
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                {field.label}
              </p>
              <p className="mt-0.5 text-sm font-medium text-white">
                {field.value}
              </p>
            </div>
            <span
              className={`flex h-6 w-6 flex-none items-center justify-center rounded-full bg-beige text-navyDeep ${t}`}
              style={{ opacity: check, transform: `scale(${0.5 + check * 0.5})` }}
            >
              <CheckIcon />
            </span>
          </div>
        );
      })}
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

function Step2Demo({
  progress,
  animated = false,
}: {
  progress: number;
  animated?: boolean;
}) {
  const n = step2Pages.length;
  let selectedOrder = -1;
  const selectedCount = step2Pages.filter((p) => p.selected).length;
  const t = animated
    ? "transition-[opacity,transform,background-color,border-color,color] duration-700 ease-out"
    : "transition-[background-color,border-color,color] duration-300";

  return (
    <div className="grid w-full max-w-sm grid-cols-2 gap-2.5 sm:grid-cols-3">
      {step2Pages.map((page, i) => {
        if (page.selected) selectedOrder += 1;
        const reveal = clamp((progress - (i * 0.5) / n) / (0.7 / n));
        const selectProgress = page.selected
          ? clamp((progress - 0.35 - (selectedOrder / selectedCount) * 0.5) / 0.18)
          : 0;
        const active = selectProgress > 0.5;
        return (
          <div
            key={page.label}
            className={`flex items-center justify-between gap-2 border px-3.5 py-3 text-xs font-medium ${
              active
                ? "border-beige/60 bg-beige text-navyDeep"
                : "border-white/10 bg-white/[0.03] text-white/45"
            } ${t}`}
            style={{
              opacity: reveal,
              transform: `translateY(${(1 - reveal) * 8}px)`,
            }}
          >
            <span>{page.label}</span>
            {page.selected && (
              <span
                className={`flex h-4 w-4 flex-none items-center justify-center rounded-full bg-navyDeep text-beige ${t}`}
                style={{
                  opacity: selectProgress,
                  transform: `scale(${0.4 + selectProgress * 0.6})`,
                }}
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

function Step3Demo({
  progress,
  animated = false,
}: {
  progress: number;
  animated?: boolean;
}) {
  const reveal = clamp(progress / 0.15);
  const stageFloat = clamp((progress - 0.15) / 0.85) * (step3Stages.length - 1);
  const stage = Math.min(step3Stages.length - 1, Math.round(stageFloat));

  return (
    <div
      className={`flex w-full max-w-sm flex-col ${animated ? "transition-all duration-700 ease-out" : ""}`}
      style={{ opacity: reveal, transform: `translateY(${(1 - reveal) * 8}px)` }}
    >
      {step3Stages.map((label, i) => {
        const status = i < stage ? "done" : i === stage ? "active" : "pending";
        return (
          <div key={label} className="flex flex-col items-start">
            <div
              className={`inline-flex items-center gap-2.5 border px-5 py-3 text-sm font-medium transition-colors duration-500 ${
                status === "active"
                  ? "border-beige/60 bg-beige text-navyDeep"
                  : "border-white/10 bg-white/[0.03] text-white/45"
              }`}
            >
              <span
                className={`h-2 w-2 flex-none rounded-full transition-colors duration-500 ${
                  status === "active"
                    ? "bg-navyDeep"
                    : status === "done"
                      ? "bg-beige/70"
                      : "bg-white/20"
                }`}
              />
              {label}
            </div>
            {i < step3Stages.length - 1 && (
              <span className="ml-6 h-6 w-px bg-white/10" />
            )}
          </div>
        );
      })}
      <p
        className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-white/40 transition-opacity duration-700"
        style={{ opacity: stage === step3Stages.length - 1 ? 1 : 0 }}
      >
        Klar inden for 48 timer
      </p>
    </div>
  );
}

// --- shared step metadata --------------------------------------------------

const steps = [
  {
    eyebrow: "Trin 1",
    title: "Udfyld spørgeskemaet på 5 minutter.",
    body: null as string | null,
    cta: true,
  },
  {
    eyebrow: "Trin 2",
    title: "Hvad vil du have med?",
    body: "Du vælger selv, hvilke sider din hjemmeside skal have.",
    cta: false,
  },
  {
    eyebrow: "Trin 3",
    title: "Vi laver hjemmesiden.",
    body: "Din nye side er klar til kunderne inden for 48 timer.",
    cta: false,
  },
];

function StepText({ eyebrow, title, body, cta }: (typeof steps)[number]) {
  return (
    <div className="max-w-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-beige/70">
        {eyebrow}
      </p>
      <h3 className="mt-3 font-display text-2xl font-medium leading-[1.1] tracking-tight text-white sm:text-3xl">
        {title}
      </h3>
      {body && <p className="mt-3 text-[15px] leading-relaxed text-white/55">{body}</p>}
      {cta && (
        <ButtonLink href="/formular" className="mt-6">
          Start skemaet
        </ButtonLink>
      )}
    </div>
  );
}

function ProgressRail({ progress }: { progress: number }) {
  return (
    <div className="relative flex flex-col items-center py-2">
      <div className="absolute top-0 h-full w-px bg-white/10" />
      <div
        className="absolute top-0 w-px bg-beige"
        style={{ height: `${progress * 100}%` }}
      />
      {[0, 1, 2].map((i) => {
        const reached = progress >= i / 3 - 0.001;
        return (
          <span
            key={i}
            className="relative z-10 flex h-9 w-9 flex-none items-center justify-center rounded-full border font-display text-sm font-medium transition-colors duration-500"
            style={{
              marginTop: i === 0 ? 0 : "auto",
              marginBottom: i === 2 ? 0 : "auto",
              borderColor: reached ? "transparent" : "rgba(255,255,255,0.15)",
              backgroundColor: reached ? "#e1e2d1" : "rgba(255,255,255,0.04)",
              color: reached ? "#1c2020" : "rgba(255,255,255,0.4)",
            }}
          >
            {i + 1}
          </span>
        );
      })}
    </div>
  );
}

// --- Desktop: cinematic scroll-pinned version -------------------------------

function DesktopProcess() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const progress = useSectionProgress(wrapRef);
  const activeIndex = Math.min(2, Math.floor(progress * 3));

  return (
    <div ref={wrapRef} className="relative hidden lg:block lg:h-[280vh]">
      <div className="sticky top-24 mx-auto flex h-[calc(100vh-6rem)] max-w-page items-center px-6">
        <div className="grid w-full grid-cols-[3rem_1fr] gap-10 lg:gap-16">
          <ProgressRail progress={progress} />

          <div className="relative h-[460px]">
            {steps.map((step, i) => {
              const bandProgress = clamp((progress - i / 3) * 3);
              return (
                <div
                  key={step.title}
                  className="absolute inset-0 flex items-center transition-opacity duration-500"
                  style={{
                    opacity: activeIndex === i ? 1 : 0,
                    pointerEvents: activeIndex === i ? "auto" : "none",
                  }}
                >
                  <div className="flex w-full flex-col justify-center gap-10 border border-white/10 bg-ink/40 p-10 shadow-2xl backdrop-blur-2xl xl:flex-row xl:items-center xl:justify-between xl:gap-16">
                    <StepText {...step} />
                    <div className="flex xl:justify-end">
                      {i === 0 && <Step1Demo progress={bandProgress} />}
                      {i === 1 && <Step2Demo progress={bandProgress} />}
                      {i === 2 && <Step3Demo progress={bandProgress} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Mobile: simplified stacked version -------------------------------------

function MobileStepCard({
  n,
  step,
  demo,
}: {
  n: number;
  step: (typeof steps)[number];
  demo: React.ReactNode;
}) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  return (
    <div ref={ref} className="flex flex-col">
      <div className="mb-6 flex justify-center">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full border font-display text-sm font-medium transition-colors duration-500"
          style={{
            borderColor: inView ? "transparent" : "rgba(255,255,255,0.15)",
            backgroundColor: inView ? "#e1e2d1" : "rgba(255,255,255,0.04)",
            color: inView ? "#1c2020" : "rgba(255,255,255,0.4)",
          }}
        >
          {n}
        </span>
      </div>
      <div className="flex flex-col gap-8 border border-white/10 bg-ink/40 p-8 shadow-xl backdrop-blur-2xl">
        <StepText {...step} />
        <div className="flex">{demo}</div>
      </div>
    </div>
  );
}

function MobileProcess() {
  return (
    <div className="mx-auto flex max-w-page flex-col gap-10 px-6 pb-24 pt-14 lg:hidden">
      <MobileStepCard
        n={1}
        step={steps[0]}
        demo={<Step1DemoMobile />}
      />
      <MobileStepCard
        n={2}
        step={steps[1]}
        demo={<Step2DemoMobile />}
      />
      <MobileStepCard
        n={3}
        step={steps[2]}
        demo={<Step3DemoMobile />}
      />
    </div>
  );
}

function Step1DemoMobile() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  return (
    <div ref={ref}>
      <Step1Demo progress={inView ? 1 : 0} animated />
    </div>
  );
}
function Step2DemoMobile() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  return (
    <div ref={ref}>
      <Step2Demo progress={inView ? 1 : 0} animated />
    </div>
  );
}
function Step3DemoMobile() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  return (
    <div ref={ref}>
      <Step3Demo progress={inView ? 1 : 0} animated />
    </div>
  );
}

// --- Section ---------------------------------------------------------------

export default function ProcessSteps() {
  return (
    <div className="mt-4">
      <DesktopProcess />
      <MobileProcess />
    </div>
  );
}
