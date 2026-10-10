"use client";

import { useEffect, useRef, useState, FormEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { trackMetaEvent } from "@/lib/metaPixel";
import { mono } from "./fonts";

type Company = { name: string; cvr?: string; city?: string; industry?: string };

// Cycled through as a typewriter placeholder while the field is empty.
// Fictional example names — not real customers.
const PROMPTS = [
  "Hvad hedder din virksomhed?",
  "Nordkyst Ejendomme A/S",
  "Holm & Vinter Arkitekter",
  "Klinik Strandvejen",
  "…eller dit CVR-nummer",
];

/** Typewriter that types each prompt, pauses, deletes it, and moves on. */
function useTypewriter(active: boolean) {
  const [text, setText] = useState(PROMPTS[0]);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(PROMPTS[0]);
      return;
    }

    let i = 0;
    let len = PROMPTS[0].length; // start fully typed, then delete
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      const word = PROMPTS[i];
      if (!deleting && len === word.length) {
        deleting = true;
        timer = setTimeout(tick, i === 0 ? 2200 : 1400);
        return;
      }
      if (deleting && len === 0) {
        deleting = false;
        i = (i + 1) % PROMPTS.length;
        timer = setTimeout(tick, 350);
        return;
      }
      len += deleting ? -1 : 1;
      setText(PROMPTS[i].slice(0, len));
      timer = setTimeout(tick, deleting ? 28 : 65 + Math.random() * 45);
    }

    timer = setTimeout(tick, 1600);
    return () => clearTimeout(timer);
  }, [active]);

  return text;
}

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<Company[]>([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [selected, setSelected] = useState<Company | null>(null);
  const skipSearch = useRef(false);

  const placeholder = useTypewriter(!focused && query === "");

  // Debounced CVR lookup by company name or CVR number (same-origin proxy).
  // Purely an assist: any failure just means no suggestions.
  useEffect(() => {
    if (skipSearch.current) {
      skipSearch.current = false;
      return;
    }
    const q = query.trim();
    const digits = q.replace(/\s/g, "");
    const isCvr = /^\d{8}$/.test(digits);
    if (q.length < 2 || (/^\d+$/.test(digits) && !isCvr)) {
      setResults([]);
      setOpen(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/cvr?q=${encodeURIComponent(isCvr ? digits : q)}`, {
          signal: controller.signal,
        });
        const json = await res.json();
        const list: Company[] = json.ok ? json.results : [];
        setResults(list);
        setHighlight(isCvr && list.length > 0 ? 0 : -1);
        setOpen(list.length > 0);
      } catch {
        // aborted or failed — keep quiet
      }
    }, 280);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  function choose(c: Company) {
    skipSearch.current = true;
    setSelected(c);
    setQuery(c.name);
    setOpen(false);
    setResults([]);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const company = selected ?? (highlight >= 0 ? results[highlight] : null);
    const params = new URLSearchParams();
    if (company?.name) params.set("firma", company.name);
    else if (query.trim()) params.set("firma", query.trim());
    if (company?.cvr) params.set("cvr", company.cvr);
    // Lets the questionnaire pre-select the industry from CVR.
    if (company?.industry) params.set("industry", company.industry);

    // Same destination and tracking as the previous "Kom i gang" button.
    trackMetaEvent("CTAClick", { location: "hero" });
    const qs = params.toString();
    router.push(qs ? `/formular?${qs}` : "/formular");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h <= 0 ? results.length - 1 : h - 1));
    } else if (e.key === "Enter" && highlight >= 0) {
      e.preventDefault();
      choose(results[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative mx-auto mt-12 w-full max-w-[34rem]" role="search">
      <div className="flex items-center gap-2 rounded-full border border-black/[0.05] bg-white/70 p-1.5 pl-5 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.25)] backdrop-blur-md transition-shadow focus-within:shadow-[0_10px_36px_-12px_rgba(0,0,0,0.35)]">
        <svg aria-hidden viewBox="0 0 20 20" className="h-[18px] w-[18px] flex-none text-black/40" fill="none">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
          <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>

        <div className="relative min-w-0 flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(null);
            }}
            onFocus={() => {
              setFocused(true);
              if (results.length > 0) setOpen(true);
            }}
            onBlur={() => {
              setFocused(false);
              setTimeout(() => setOpen(false), 150);
            }}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            aria-label="Hvad hedder din virksomhed? Skriv navn eller CVR-nummer"
            aria-expanded={open}
            aria-controls="cvr-results"
            role="combobox"
            placeholder={focused ? "Firmanavn eller CVR-nummer" : ""}
            className="w-full bg-transparent py-2.5 text-[15px] text-[var(--ink)] placeholder:text-black/35 focus:outline-none sm:text-base"
          />
          {/* Animated "typing" placeholder */}
          {!focused && query === "" && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center overflow-hidden whitespace-nowrap text-[15px] text-black/35 sm:text-base"
            >
              {placeholder}
              <span className="ml-px inline-block h-[1.1em] w-px animate-pulse bg-black/35" />
            </span>
          )}
        </div>

        <button
          type="submit"
          className={`${mono.className} inline-flex flex-none items-center gap-2 rounded-full bg-[var(--ink)] px-4 py-3 text-[12px] font-medium uppercase tracking-[0.04em] text-[var(--bg)] transition-opacity hover:opacity-90 sm:px-5 sm:text-[13px]`}
        >
          Kom i gang <span aria-hidden>→</span>
        </button>
      </div>

      {open && results.length > 0 && (
        <ul
          id="cvr-results"
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-md border border-black/[0.08] bg-white/95 p-1.5 text-left shadow-[0_18px_40px_-16px_rgba(0,0,0,0.35)] backdrop-blur-md"
        >
          {results.map((c, i) => (
            <li key={`${c.cvr ?? c.name}-${i}`} role="option" aria-selected={i === highlight}>
              <button
                type="button"
                // preventDefault keeps focus in the input, so Enter submits next.
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(c);
                }}
                onMouseEnter={() => setHighlight(i)}
                className={`block w-full rounded-[3px] px-4 py-2.5 text-left transition-colors ${
                  i === highlight ? "bg-black/[0.05]" : ""
                }`}
              >
                <span className="block text-[15px] text-[var(--ink)]">{c.name}</span>
                <span className="mt-0.5 block text-xs text-black/45">
                  {[c.cvr && `CVR ${c.cvr}`, c.city].filter(Boolean).join(" · ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
