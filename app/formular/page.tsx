"use client";

import { useEffect, useRef, useState, FormEvent, KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, ButtonSubmit } from "@/components/Button";
import FormularBackground from "@/components/FormularBackground";
import FontTheme from "@/components/FontTheme";
import { fontVariables } from "@/components/fontThemes";
import { trackMetaEvent } from "@/lib/metaPixel";

const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/simon@advio.dk";

const TOTAL_STEPS = 2;

const brancher = [
  "Arkitekt",
  "Psykolog & terapi",
  "Marketing- & kommunikationsbureau",
  "HR & rekruttering",
  "Ejendomsmægler",
  "Advokat & rådgivning",
  "Revision & økonomi",
  "Klinik & sundhed",
  "Andet",
];

type CvrSuggestion = {
  name: string;
  cvr?: string;
  city?: string;
  industry?: string;
};

type FormState = {
  firma: string;
  cvr: string;
  branche: string;
  brancheAndet: string;
  navn: string;
  telefon: string;
  email: string;
};

const initialState: FormState = {
  firma: "",
  cvr: "",
  branche: "",
  brancheAndet: "",
  navn: "",
  telefon: "",
  email: "",
};

/** Best-effort match of a CVR industry description onto one of our fixed
 * branche options — falls back to "Andet" with the raw text kept, rather
 * than guessing wrong. */
function matchBrancheFromIndustry(industry: string | undefined): {
  branche: string;
  brancheAndet: string;
} {
  if (!industry) return { branche: "", brancheAndet: "" };
  const lower = industry.toLowerCase();
  if (/arkitekt/.test(lower)) {
    return { branche: "Arkitekt", brancheAndet: "" };
  }
  if (/psykolog|psykoterapi|terapi/.test(lower)) {
    return { branche: "Psykolog & terapi", brancheAndet: "" };
  }
  if (/reklame|marketing|kommunikation|pr-bureau|mediebureau/.test(lower)) {
    return { branche: "Marketing- & kommunikationsbureau", brancheAndet: "" };
  }
  if (/rekruttering|personale|arbejdsformidling|vikar/.test(lower)) {
    return { branche: "HR & rekruttering", brancheAndet: "" };
  }
  if (/ejendomsmægl|ejendomsformidl/.test(lower)) {
    return { branche: "Ejendomsmægler", brancheAndet: "" };
  }
  if (/advokat|juridisk|rådgivning|konsulent/.test(lower)) {
    return { branche: "Advokat & rådgivning", brancheAndet: "" };
  }
  if (/revision|bogføring|regnskab/.test(lower)) {
    return { branche: "Revision & økonomi", brancheAndet: "" };
  }
  if (/læge|tandlæge|klinik|fysioterapi|kiropraktor|sundhed/.test(lower)) {
    return { branche: "Klinik & sundhed", brancheAndet: "" };
  }
  return { branche: "Andet", brancheAndet: industry };
}

export default function FormularPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const nextFieldRef = useRef<HTMLInputElement>(null);

  const [suggestions, setSuggestions] = useState<CvrSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const skipNextSearch = useRef(false);
  // True when the company name arrived from the front-page search bar — then
  // the first step only asks for the industry.
  const [firmaKnown, setFirmaKnown] = useState(false);

  // Prefill from the front-page search (?firma=…&cvr=…&industry=…).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const firma = params.get("firma")?.trim();
    if (!firma) return;
    skipNextSearch.current = true;
    const matched = matchBrancheFromIndustry(params.get("industry") ?? undefined);
    setData((prev) => ({
      ...prev,
      firma,
      cvr: params.get("cvr") ?? "",
      branche: matched.branche,
      brancheAndet: matched.brancheAndet,
    }));
    setFirmaKnown(true);
  }, []);

  const isLastStep = step === TOTAL_STEPS - 1;
  const progress = Math.round(((step + 1) / TOTAL_STEPS) * 100);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  // Debounced CVR-autocomplete — an assist on top of a plain text field,
  // never a requirement. Any failure just means no suggestions appear.
  useEffect(() => {
    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      return;
    }
    const query = data.firma.trim();
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/cvr?q=${encodeURIComponent(query)}`);
        const json = await res.json();
        setSuggestions(json.ok ? json.results : []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.firma]);

  function selectSuggestion(s: CvrSuggestion) {
    skipNextSearch.current = true;
    const matched = matchBrancheFromIndustry(s.industry);
    setData((prev) => ({
      ...prev,
      firma: s.name,
      cvr: s.cvr || "",
      branche: matched.branche || prev.branche,
      brancheAndet: matched.brancheAndet || prev.brancheAndet,
    }));
    setSuggestions([]);
    setShowSuggestions(false);
  }

  function canAdvance() {
    switch (step) {
      case 0:
        return (
          data.firma.trim().length > 0 &&
          data.branche.length > 0 &&
          (data.branche !== "Andet" || data.brancheAndet.trim().length > 0)
        );
      case 1:
        return (
          data.navn.trim().length > 0 &&
          (data.telefon.trim().length > 0 || data.email.trim().length > 0)
        );
      default:
        return true;
    }
  }

  function handleNext() {
    if (!canAdvance()) return;
    setShowSuggestions(false);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Enter" && !isLastStep) {
      e.preventDefault();
      handleNext();
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const form = e.currentTarget;
    const branche =
      data.branche === "Andet" && data.brancheAndet.trim()
        ? data.brancheAndet.trim()
        : data.branche;

    const params = new URLSearchParams();
    if (data.firma) params.set("firma", data.firma);
    if (data.cvr) params.set("cvr", data.cvr);
    if (branche) params.set("branche", branche);
    if (data.navn) params.set("navn", data.navn);
    if (data.telefon) params.set("telefon", data.telefon);
    if (data.email) params.set("email", data.email);
    const bookUrl = `/formular/book?${params.toString()}`;
    if (nextFieldRef.current) {
      nextFieldRef.current.value = `${window.location.origin}${bookUrl}`;
    }

    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "spørgeskema",
        firma: data.firma,
        navn: data.navn,
        telefon: data.telefon,
        email: data.email,
      }),
      keepalive: true,
    }).catch(() => {});

    const textForm = new FormData(form);
    fetch(FORMSUBMIT_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body: textForm,
    }).catch(() => {});

    trackMetaEvent("Lead");

    router.push(bookUrl);
  }

  return (
    <FontTheme variables={fontVariables}>
    <div className="relative min-h-screen overflow-hidden">
      <FormularBackground />

      <div className="relative z-10">
        <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/55 backdrop-blur-md">
          <div className="mx-auto flex max-w-page items-center justify-between px-6 py-5 lg:px-10">
            <Link
              href="/"
              className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55 transition-colors hover:text-black"
            >
              <span aria-hidden>←</span>
              Tilbage til forsiden
            </Link>
            <Image
              src="/assets/ADVIOLOGONYT.png"
              alt="Advio"
              width={84}
              height={28}
              className="h-7 w-auto brightness-0"
            />
          </div>
        </header>

        <main className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-16">
        <div className="animate-hero-in rounded-2xl bg-white p-6 shadow-card sm:p-10">
          <div className="h-1 w-full rounded-full bg-black/[0.06]">
            <div
              className="h-full rounded-full bg-[#1a1a1a] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <form
            action="https://formsubmit.co/simon@advio.dk"
            method="POST"
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            className="mt-5 sm:mt-8"
          >
          <input type="hidden" name="_subject" value="Ny henvendelse fra advio.dk" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" ref={nextFieldRef} value="" />
          <input type="hidden" name="cvr" value={data.cvr} />

            <div key={`step0-${step}`} className={step === 0 ? "animate-step-in" : "hidden"}>
              {firmaKnown ? (
                <>
                  <input type="hidden" name="firma" value={data.firma} />
                  <h2 className="font-th-serif text-[1.7rem] leading-tight text-ink">
                    Hvilken branche er {data.firma} i?
                  </h2>
                </>
              ) : (
              <>
              <h2 className="font-th-serif text-[1.7rem] leading-tight text-ink">
                Hvad hedder dit firma?
              </h2>
              <div className="relative mt-6">
                <input
                  type="text"
                  name="firma"
                  autoComplete="off"
                  placeholder="Fx Holm & Vinter Arkitekter"
                  value={data.firma}
                  onChange={(e) => update("firma", e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  className="field"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="animate-step-in absolute left-0 right-0 top-full z-10 mt-1.5 max-h-60 overflow-y-auto rounded-lg border border-border bg-white shadow-card">
                    {suggestions.map((s) => (
                      <li key={`${s.name}-${s.cvr ?? ""}`}>
                        <button
                          type="button"
                          onMouseDown={() => selectSuggestion(s)}
                          className="block w-full px-4 py-3 text-left text-sm text-ink transition-colors hover:bg-tint"
                        >
                          <span className="block font-medium text-ink">{s.name}</span>
                          {(s.city || s.industry) && (
                            <span className="mt-0.5 block text-xs text-mist">
                              {[s.city, s.industry].filter(Boolean).join(" · ")}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              </>
              )}

              <label className="mt-6 block">
                {!firmaKnown && <span className="field-label">Hvilken branche er I i?</span>}
                <select
                  name="branche"
                  value={data.branche}
                  onChange={(e) => update("branche", e.target.value)}
                  className="field"
                >
                  <option value="" disabled>
                    Vælg branche
                  </option>
                  {brancher.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>

              {data.branche === "Andet" && (
                <label className="mt-4 block">
                  <span className="field-label">Hvilken branche?</span>
                  <input
                    type="text"
                    name="branche_andet"
                    placeholder="Fx ingeniørfirma, kapitalforvaltning, konsulenthus…"
                    value={data.brancheAndet}
                    onChange={(e) => update("brancheAndet", e.target.value)}
                    className="field"
                  />
                </label>
              )}
            </div>

            <div key={`step1-${step}`} className={step === 1 ? "animate-step-in" : "hidden"}>
              <h2 className="font-th-serif text-[1.7rem] leading-tight text-ink">
                Hvordan får vi fat i dig?
              </h2>
              <div className="mt-6 space-y-4">
                <Field label="Navn">
                  <input
                    type="text"
                    name="navn"
                    placeholder="Dit fulde navn"
                    value={data.navn}
                    onChange={(e) => update("navn", e.target.value)}
                    className="field"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Email">
                    <input
                      type="email"
                      name="email"
                      placeholder="din@email.dk"
                      value={data.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="field"
                    />
                  </Field>
                  <Field label="Telefonnummer">
                    <input
                      type="tel"
                      name="telefon"
                      placeholder="Fx 12 34 56 78"
                      value={data.telefon}
                      onChange={(e) => update("telefon", e.target.value)}
                      className="field"
                    />
                  </Field>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              {step > 0 && (
                <Button
                  variant="ghost-light"
                  onClick={() => setStep((s) => s - 1)}
                  className="flex-1"
                >
                  Tilbage
                </Button>
              )}
              {isLastStep ? (
                <ButtonSubmit className="flex-1" disabled={!canAdvance() || submitting}>
                  {submitting ? "Sender…" : "Send og vælg en tid"}
                </ButtonSubmit>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canAdvance()}
                  className="flex-1"
                >
                  Næste
                </Button>
              )}
            </div>
          </form>

          <p className="mt-8 text-center">
            <a href="tel:+4522494295" className="text-xs tracking-wide text-black/25 transition-colors hover:text-black/50">
              22 49 42 95
            </a>
          </p>
        </div>
        </main>
      </div>
    </div>
    </FontTheme>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy">
        {label}
      </span>
      {children}
    </label>
  );
}
