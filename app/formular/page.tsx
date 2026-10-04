"use client";

import { useEffect, useRef, useState, FormEvent, KeyboardEvent } from "react";
import { Quicksand } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, ButtonSubmit } from "@/components/Button";
import BackgroundVideo from "@/components/BackgroundVideo";
import { trackMetaEvent } from "@/lib/metaPixel";

// Scoped to this page's card only — a rounded, friendly sans matching the
// reference design, distinct from the rest of the site's serif/Hanken
// Grotesk type system used elsewhere.
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/simon@advio.dk";

const TOTAL_STEPS = 2;

const brancher = [
  "Håndværker",
  "Frisør & skønhed",
  "Restaurant & café",
  "Butik & webshop",
  "Konsulent & rådgivning",
  "Sundhed & fitness",
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
  if (/tømrer|elektriker|vvs|maler|murer|anlægsgartner|håndværk|byggeri/.test(lower)) {
    return { branche: "Håndværker", brancheAndet: "" };
  }
  if (/frisør|skønhed|salon|kosmetolog/.test(lower)) {
    return { branche: "Frisør & skønhed", brancheAndet: "" };
  }
  if (/restaurant|café|cafe|pizzeria|bar\b/.test(lower)) {
    return { branche: "Restaurant & café", brancheAndet: "" };
  }
  if (/butik|detail|webshop|forhandler/.test(lower)) {
    return { branche: "Butik & webshop", brancheAndet: "" };
  }
  if (/konsulent|rådgivning|advokat|revision/.test(lower)) {
    return { branche: "Konsulent & rådgivning", brancheAndet: "" };
  }
  if (/fitness|sundhed|klinik|terapi|træning/.test(lower)) {
    return { branche: "Sundhed & fitness", brancheAndet: "" };
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
    <div className="relative min-h-screen overflow-hidden bg-navy-fade">
      <div aria-hidden="true" className="absolute inset-0">
        <BackgroundVideo
          desktopSrc="/assets/hero-ocean.mp4"
          mobileSrc="/assets/hero-ocean-mobile.mp4"
          posterSrc="/assets/hero-ocean-poster.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navyDeep/85 via-navyDeep/45 to-navyDeep/90" />
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-navyDeep/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-page items-center justify-between px-6 py-5 lg:px-10">
            <Link
              href="/"
              className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55 transition-colors hover:text-white"
            >
              <span aria-hidden>←</span>
              Tilbage til forsiden
            </Link>
            <Image
              src="/assets/ADVIOLOGONYT.png"
              alt="Advio"
              width={84}
              height={28}
              className="h-7 w-auto"
            />
          </div>
        </header>

        <main className="mx-auto max-w-xl px-6 py-16">
        <div className={`${quicksand.className} animate-hero-in rounded-2xl bg-white p-8 shadow-card sm:p-10`}>
          <h1 className="leading-[1.05] tracking-tight">
            <span className="block text-3xl font-bold text-ink sm:text-4xl">
              Lad os bygge
            </span>
            <span className="block text-3xl font-semibold text-navy sm:text-4xl">
              din nye hjemmeside
            </span>
          </h1>
          <p className="mt-4 text-muted">
            Det tager kun et minut at udfylde – vi vender tilbage med et
            skræddersyet professionelt udkast.
          </p>

          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted">
              <span>
                Trin {step + 1} af {TOTAL_STEPS}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full border border-border bg-tint">
              <div
                className="h-full rounded-full bg-beige transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <form
            action="https://formsubmit.co/simon@advio.dk"
            method="POST"
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            className="mt-8"
          >
          <input type="hidden" name="_subject" value="Ny henvendelse fra advio.dk" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" ref={nextFieldRef} value="" />
          <input type="hidden" name="cvr" value={data.cvr} />

            <div key={`step0-${step}`} className={step === 0 ? "animate-step-in" : "hidden"}>
              <h2 className="text-xl font-semibold text-ink">
                Hvad hedder dit firma?
              </h2>
              <p className="mt-1.5 text-sm text-muted">
                Begynd at skrive, så finder vi jer i CVR-registret.
              </p>
              <div className="relative mt-6">
                <input
                  type="text"
                  name="firma"
                  autoComplete="off"
                  placeholder="Fx Hansen ApS"
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

              <label className="mt-6 block">
                <span className="field-label">Hvilken branche er I i?</span>
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
                    placeholder="Fx bogholderi, tøjbutik, rengøring…"
                    value={data.brancheAndet}
                    onChange={(e) => update("brancheAndet", e.target.value)}
                    className="field"
                  />
                </label>
              )}
            </div>

            <div key={`step1-${step}`} className={step === 1 ? "animate-step-in" : "hidden"}>
              <h2 className="text-xl font-semibold text-ink">
                Hvordan får vi fat i dig?
              </h2>
              <p className="mt-1.5 text-sm text-muted">
                Udfyld navn og mindst ét kontaktfelt – vi bruger det kun til at
                sende dit udkast.
              </p>
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
                      placeholder="Fx 22 49 42 95"
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

          <p className="mt-8 text-center text-sm text-muted">
            Har du spørgsmål? Ring til os på{" "}
            <a href="tel:+4522494295" className="font-medium text-navy">
              22 49 42 95
            </a>
          </p>
        </div>
        </main>
      </div>
    </div>
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
