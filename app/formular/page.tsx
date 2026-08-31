"use client";

import { useRef, useState, FormEvent, KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, ButtonSubmit } from "@/components/Button";

const TOTAL_STEPS = 9;

const badges = ["Gratis udkast", "Typisk levering 2 dage", "Ingen binding"];

const brancher = [
  "Tømrer",
  "Elektriker",
  "VVS",
  "Maler",
  "Murer",
  "Anlægsgartner",
  "Andet",
];

const billedeValg = [
  "Ja, jeg uploader nu",
  "Ja, men jeg sender dem senere",
  "Nej, ikke endnu – brug gerne stockbilleder",
];

const indholdValg = [
  "Kontaktformular",
  "Prisliste",
  "Om os-side",
  "Kundeanmeldelser / referencer",
  "Online booking",
  "Billedgalleri af udført arbejde",
  "Nyheder / blog",
  "Andet",
];

type FormState = {
  firma: string;
  branche: string;
  telefon: string;
  email: string;
  harHjemmeside: string;
  domaene: string;
  harFacebook: string;
  facebookUrl: string;
  billeder: string;
  indhold: string[];
  services: string;
  usp: string;
};

const initialState: FormState = {
  firma: "",
  branche: "",
  telefon: "",
  email: "",
  harHjemmeside: "",
  domaene: "",
  harFacebook: "",
  facebookUrl: "",
  billeder: "",
  indhold: [],
  services: "",
  usp: "",
};

function isValidFacebookUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    return /(^|\.)(facebook|fb)\.com$/i.test(url.hostname);
  } catch {
    return false;
  }
}

export default function FormularPage() {
  const [step, setStep] = useState(0);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [data, setData] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const nextFieldRef = useRef<HTMLInputElement>(null);

  const isLastStep = step === TOTAL_STEPS - 1;
  const progress = Math.round(((step + 1) / TOTAL_STEPS) * 100);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function toggleIndhold(value: string) {
    setData((prev) => ({
      ...prev,
      indhold: prev.indhold.includes(value)
        ? prev.indhold.filter((v) => v !== value)
        : [...prev.indhold, value],
    }));
  }

  function canAdvance() {
    switch (step) {
      case 0:
        return data.firma.trim().length > 0;
      case 1:
        return data.branche.length > 0;
      case 2:
        return data.telefon.trim().length > 0 || data.email.trim().length > 0;
      case 3:
        return data.harHjemmeside.length > 0;
      case 4:
        return (
          data.harFacebook.length > 0 &&
          (data.harFacebook !== "Ja" || isValidFacebookUrl(data.facebookUrl))
        );
      case 5:
        return data.billeder.length > 0;
      case 6:
        return data.indhold.length > 0;
      case 7:
        return data.services.trim().length > 0;
      default:
        return true;
    }
  }

  function handleNext() {
    if (!canAdvance()) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Enter" && !isLastStep) {
      e.preventDefault();
      handleNext();
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    // Guards against a rapid double-click submitting (and emailing) the
    // form twice before the native submit navigates away.
    if (submitting) {
      e.preventDefault();
      return;
    }
    setSubmitting(true);

    const params = new URLSearchParams();
    if (data.firma) params.set("firma", data.firma);
    if (data.branche) params.set("branche", data.branche);
    if (data.telefon) params.set("telefon", data.telefon);
    if (data.email) params.set("email", data.email);
    if (data.harHjemmeside) params.set("harHjemmeside", data.harHjemmeside);
    if (data.domaene) params.set("domaene", data.domaene);
    if (data.harFacebook) params.set("harFacebook", data.harFacebook);
    if (data.facebookUrl) params.set("facebookUrl", data.facebookUrl);
    if (data.services) params.set("services", data.services);
    if (data.usp) params.set("usp", data.usp);
    if (data.billeder) params.set("billeder", data.billeder);
    if (nextFieldRef.current) {
      nextFieldRef.current.value = `${window.location.origin}/formular/book?${params.toString()}`;
    }

    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "spørgeskema",
        firma: data.firma,
        telefon: data.telefon,
        email: data.email,
      }),
      keepalive: true,
    }).catch(() => {});

    // No preventDefault: this submits natively (multipart) to FormSubmit,
    // which is required for the file upload to be attached to the email.
    // FormSubmit only redirects to _next once it has processed the POST
    // server-side, so the email is always sent before the booking page loads.
  }

  return (
    <div className="min-h-screen bg-navy-fade">
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
        <h1 className="leading-[0.98] tracking-tighter">
          <span className="block font-display text-4xl font-bold uppercase text-white sm:text-5xl">
            Lad os bygge
          </span>
          <span className="block font-display text-4xl font-medium uppercase text-beige sm:text-5xl">
            din nye hjemmeside
          </span>
        </h1>
        <p className="mt-4 text-white/70">
          Det tager kun 2 minutter at udfylde – vi vender tilbage med et
          skræddersyet professionelt udkast.
        </p>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium uppercase tracking-wide text-white/50">
          {badges.map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>

        <div className="mt-10">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-white/60">
            <span>
              Trin {step + 1} af {TOTAL_STEPS}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full border border-white/20 bg-white/5">
            <div
              className="h-full rounded-full bg-beige transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <form
          action="https://formsubmit.co/simon@advio.dk"
          method="POST"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          className="mt-10 border border-white/10 bg-ink/40 p-8 shadow-2xl backdrop-blur-2xl sm:p-10"
        >
          <input type="hidden" name="_subject" value="Ny henvendelse fra advio.dk" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" ref={nextFieldRef} value="" />

          <div className={step === 0 ? "" : "hidden"}>
            <h2 className="font-display text-xl font-medium text-white">
              Hvad hedder dit firma?
            </h2>
            <p className="mt-1.5 text-sm text-white/55">
              Det navn kunderne kender jer under.
            </p>
            <input
              type="text"
              name="firma"
              placeholder="Fx Hansen VVS ApS"
              value={data.firma}
              onChange={(e) => update("firma", e.target.value)}
              className="field-dark mt-6"
            />
          </div>

          <div className={step === 1 ? "" : "hidden"}>
            <h2 className="font-display text-xl font-medium text-white">
              Hvilken slags håndværker er I?
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {brancher.map((b) => (
                <RadioOption
                  key={b}
                  name="branche"
                  value={b}
                  checked={data.branche === b}
                  onChange={() => update("branche", b)}
                >
                  {b}
                </RadioOption>
              ))}
            </div>
          </div>

          <div className={step === 2 ? "" : "hidden"}>
            <h2 className="font-display text-xl font-medium text-white">
              Hvordan får vi fat i dig?
            </h2>
            <p className="mt-1.5 text-sm text-white/55">
              Udfyld mindst ét felt – vi bruger det kun til at sende dit
              udkast.
            </p>
            <div className="mt-6 space-y-4">
              <Field label="Telefonnummer">
                <input
                  type="tel"
                  name="telefon"
                  placeholder="Fx 22 49 42 95"
                  value={data.telefon}
                  onChange={(e) => update("telefon", e.target.value)}
                  className="field-dark"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  name="email"
                  placeholder="din@email.dk"
                  value={data.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="field-dark"
                />
              </Field>
            </div>
          </div>

          <div className={step === 3 ? "" : "hidden"}>
            <h2 className="font-display text-xl font-medium text-white">
              Har I allerede en hjemmeside?
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {["Ja", "Nej"].map((v) => (
                <RadioOption
                  key={v}
                  name="har_hjemmeside"
                  value={v}
                  checked={data.harHjemmeside === v}
                  onChange={() => update("harHjemmeside", v)}
                >
                  {v}
                </RadioOption>
              ))}
            </div>

            {data.harHjemmeside === "Ja" && (
              <label className="mt-4 block">
                <span className="field-label-dark">Domæne (valgfrit)</span>
                <input
                  type="text"
                  name="domaene"
                  placeholder="fx firmanavn.dk"
                  value={data.domaene}
                  onChange={(e) => update("domaene", e.target.value)}
                  className="field-dark"
                />
              </label>
            )}
          </div>

          <div className={step === 4 ? "" : "hidden"}>
            <h2 className="font-display text-xl font-medium text-white">
              Har I en Facebook-side?
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {["Ja", "Nej"].map((v) => (
                <RadioOption
                  key={v}
                  name="har_facebook"
                  value={v}
                  checked={data.harFacebook === v}
                  onChange={() => update("harFacebook", v)}
                >
                  {v}
                </RadioOption>
              ))}
            </div>

            {data.harFacebook === "Ja" && (
              <label className="mt-4 block">
                <span className="field-label-dark">Indsæt linket til jeres Facebook-side</span>
                <input
                  type="text"
                  name="facebook_url"
                  placeholder="https://facebook.com/virksomhedsnavn"
                  value={data.facebookUrl}
                  onChange={(e) => update("facebookUrl", e.target.value)}
                  className="field-dark"
                />
                {data.facebookUrl.trim().length > 0 && !isValidFacebookUrl(data.facebookUrl) && (
                  <span className="mt-1.5 block text-xs font-medium text-red-400">
                    Indtast venligst et gyldigt Facebook-link (fx https://facebook.com/ditfirma)
                  </span>
                )}
              </label>
            )}
          </div>

          <div className={step === 5 ? "" : "hidden"}>
            <h2 className="font-display text-xl font-medium text-white">
              Har I billeder af jeres arbejde?
            </h2>
            <p className="mt-1.5 text-sm text-white/55">
              Gode billeder af udført arbejde gør en enorm forskel for
              kunderne.
            </p>
            <div className="mt-6 space-y-3">
              {billedeValg.map((v) => (
                <RadioOption
                  key={v}
                  name="billeder"
                  value={v}
                  checked={data.billeder === v}
                  onChange={() => update("billeder", v)}
                  block
                >
                  {v}
                </RadioOption>
              ))}
            </div>

            {data.billeder === "Ja, jeg uploader nu" && (
              <div className="mt-4">
                <label className="block cursor-pointer border border-dashed border-white/20 bg-white/[0.03] px-4 py-6 text-center text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.06]">
                  <input
                    type="file"
                    name="billeder_filer"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      setFileNames(
                        Array.from(e.target.files ?? []).map((f) => f.name),
                      )
                    }
                    className="sr-only"
                  />
                  {fileNames.length > 0
                    ? `${fileNames.length} billede(r) valgt`
                    : "Klik for at vælge billeder"}
                </label>
                {fileNames.length > 0 && (
                  <ul className="mt-2 space-y-0.5 text-xs text-white/50">
                    {fileNames.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className={step === 6 ? "" : "hidden"}>
            <h2 className="font-display text-xl font-medium text-white">
              Hvad skal hjemmesiden indeholde?
            </h2>
            <p className="mt-1.5 text-sm text-white/55">
              Vælg alt hvad der er relevant.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {indholdValg.map((v) => (
                <CheckOption
                  key={v}
                  name="indhold"
                  value={v}
                  checked={data.indhold.includes(v)}
                  onChange={() => toggleIndhold(v)}
                  activeClass="border-beige/60 bg-beige text-navyDeep"
                >
                  {v}
                </CheckOption>
              ))}
            </div>
          </div>

          <div className={step === 7 ? "" : "hidden"}>
            <h2 className="font-display text-xl font-medium text-white">
              Hvilke ydelser tilbyder I?
            </h2>
            <p className="mt-1.5 text-sm text-white/55">
              De vigtigste ydelser jeres virksomhed tilbyder.
            </p>
            <input
              type="text"
              name="services"
              placeholder="Fx facaderenovering, badeværelser, tilbygninger…"
              value={data.services}
              onChange={(e) => update("services", e.target.value)}
              className="field-dark mt-6"
            />
          </div>

          <div className={step === 8 ? "" : "hidden"}>
            <h2 className="font-display text-xl font-medium text-white">
              Hvad gør jer særlige?
            </h2>
            <p className="mt-1.5 text-sm text-white/55">
              <span className="font-semibold text-white/80">Frivilligt</span> — fortæl kort, hvad
              der gør jer anderledes end andre.
            </p>
            <input
              type="text"
              name="unique_selling_points"
              placeholder="Fx 20 års erfaring, lokalt firma, hurtig service, autoriseret, gratis tilbud…"
              value={data.usp}
              onChange={(e) => update("usp", e.target.value)}
              className="field-dark mt-6"
            />
          </div>

          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <Button
                variant="ghost"
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

        <p className="mt-8 text-center text-sm text-white/60">
          Har du spørgsmål? Ring til os på{" "}
          <a href="tel:+4522494295" className="font-medium text-beige">
            22 49 42 95
          </a>
        </p>
      </main>
    </div>
  );
}

function RadioOption({
  name,
  value,
  checked,
  onChange,
  children,
  block = false,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
  block?: boolean;
}) {
  return (
    <label
      className={`cursor-pointer border px-4 py-3.5 text-sm font-medium transition-colors ${
        block ? "block w-full text-left" : "text-center"
      } ${
        checked
          ? "border-beige/60 bg-beige text-navyDeep"
          : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {children}
    </label>
  );
}

function CheckOption({
  name,
  value,
  checked,
  onChange,
  children,
  activeClass,
  block = false,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  activeClass: string;
  block?: boolean;
}) {
  return (
    <label
      className={`cursor-pointer border px-3 py-3.5 text-sm font-medium transition-colors ${
        block ? "block w-full text-left" : ""
      } ${checked ? activeClass : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25"}`}
    >
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      {children}
    </label>
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
      <span className="mb-1.5 block text-sm font-medium text-white/70">
        {label}
      </span>
      {children}
    </label>
  );
}
