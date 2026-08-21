"use client";

import { useRef, useState, FormEvent, KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";

const TOTAL_STEPS = 7;

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
  harFacebook: string;
  billeder: string;
  indhold: string[];
};

const initialState: FormState = {
  firma: "",
  branche: "",
  telefon: "",
  email: "",
  harHjemmeside: "",
  harFacebook: "",
  billeder: "",
  indhold: [],
};

export default function FormularPage() {
  const [step, setStep] = useState(0);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [data, setData] = useState<FormState>(initialState);
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
        return data.harFacebook.length > 0;
      case 5:
        return data.billeder.length > 0;
      case 6:
        return data.indhold.length > 0;
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
    const params = new URLSearchParams();
    if (data.firma) params.set("firma", data.firma);
    if (nextFieldRef.current) {
      nextFieldRef.current.value = `${window.location.origin}/formular/book?${params.toString()}`;
    }
    // No preventDefault: this submits natively (multipart) to FormSubmit,
    // which is required for the file upload to be attached to the email.
    // FormSubmit only redirects to _next once it has processed the POST
    // server-side, so the email is always sent before the Calendly page loads.
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-page items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted hover:text-ink"
          >
            <span aria-hidden>←</span>
            Tilbage til forsiden
          </Link>
          <Image
            src="/assets/advio-logo.png"
            alt="Advio"
            width={26}
            height={26}
          />
        </div>
      </header>

      <main className="mx-auto max-w-xl px-6 py-16">
        <h1 className="font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">
          Lad os bygge din nye hjemmeside
        </h1>
        <p className="mt-4 text-muted">
          Det tager kun 2 minutter at udfylde – vi vender tilbage med et
          skræddersyet professionelt udkast.
        </p>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium uppercase tracking-wide text-mist">
          {badges.map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>

        <div className="mt-10">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted">
            <span>
              Trin {step + 1} af {TOTAL_STEPS}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full border border-ink bg-white">
            <div
              className="h-full bg-blue transition-all duration-300"
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
          className="mt-10 border border-ink bg-white p-8 shadow-cardSoft"
        >
          <input type="hidden" name="_subject" value="Ny henvendelse fra advio.dk" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" ref={nextFieldRef} value="" />

          <div className={step === 0 ? "" : "hidden"}>
            <h2 className="font-display text-xl font-bold text-ink">
              Hvad hedder dit firma?
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              Det navn kunderne kender jer under.
            </p>
            <input
              type="text"
              name="firma"
              placeholder="Fx Hansen VVS ApS"
              value={data.firma}
              onChange={(e) => update("firma", e.target.value)}
              className="field mt-6"
            />
          </div>

          <div className={step === 1 ? "" : "hidden"}>
            <h2 className="font-display text-xl font-bold text-ink">
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
            <h2 className="font-display text-xl font-bold text-ink">
              Hvordan får vi fat i dig?
            </h2>
            <p className="mt-1.5 text-sm text-muted">
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
                  className="field"
                />
              </Field>
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
            </div>
          </div>

          <div className={step === 3 ? "" : "hidden"}>
            <h2 className="font-display text-xl font-bold text-ink">
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
          </div>

          <div className={step === 4 ? "" : "hidden"}>
            <h2 className="font-display text-xl font-bold text-ink">
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
          </div>

          <div className={step === 5 ? "" : "hidden"}>
            <h2 className="font-display text-xl font-bold text-ink">
              Har I billeder af jeres arbejde?
            </h2>
            <p className="mt-1.5 text-sm text-muted">
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
                <label className="block cursor-pointer border border-dashed border-ink bg-tint px-4 py-6 text-center text-sm font-medium text-blue hover:bg-border">
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
                  <ul className="mt-2 space-y-0.5 text-xs text-muted">
                    {fileNames.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className={step === 6 ? "" : "hidden"}>
            <h2 className="font-display text-xl font-bold text-ink">
              Hvad skal hjemmesiden indeholde?
            </h2>
            <p className="mt-1.5 text-sm text-muted">
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
                  activeClass="border-ink bg-yellow text-ink"
                >
                  {v}
                </CheckOption>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex-1 border border-ink py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-tint"
              >
                ← Tilbage
              </button>
            )}
            {isLastStep ? (
              <button
                type="submit"
                disabled={!canAdvance()}
                className="flex flex-1 items-center justify-center gap-2 border border-ink bg-blue py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blueDeep disabled:cursor-not-allowed disabled:opacity-40"
              >
                Send og vælg en tid
                <span aria-hidden>→</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canAdvance()}
                className="flex flex-1 items-center justify-center gap-2 border border-ink bg-blue py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blueDeep disabled:cursor-not-allowed disabled:opacity-40"
              >
                Næste
                <span aria-hidden>→</span>
              </button>
            )}
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          Har du spørgsmål? Ring til Simon på{" "}
          <a href="tel:+4522494295" className="font-medium text-blue">
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
          ? "border-ink bg-blue text-white"
          : "border-border bg-white text-ink hover:border-ink"
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
      } ${checked ? activeClass : "border-border bg-white text-ink hover:border-ink"}`}
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
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </span>
      {children}
    </label>
  );
}
