"use client";

import { useEffect, useMemo, useState } from "react";

type Availability = {
  timezone: string;
  days: Record<string, string[]>;
};

type Prefill = {
  firma?: string;
  telefon?: string;
  email?: string;
  branche?: string;
  harHjemmeside?: string;
  domaene?: string;
  harFacebook?: string;
  facebookUrl?: string;
  services?: string;
  usp?: string;
  billeder?: string;
};

function formatDateLabel(dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00`);
  return new Intl.DateTimeFormat("da-DK", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

function formatTimeLabel(iso: string) {
  return new Intl.DateTimeFormat("da-DK", {
    timeZone: "Europe/Copenhagen",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

/** Monday=0 .. Sunday=6 index of the 1st of the month. */
function firstWeekdayIndex(year: number, month: number) {
  return (new Date(year, month - 1, 1).getDay() + 6) % 7;
}

const MONTH_LABEL = new Intl.DateTimeFormat("da-DK", { month: "long", year: "numeric" });
const WEEKDAY_LABELS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

export default function BookingCalendar({
  prefill,
  initialAvailability,
}: {
  prefill: Prefill;
  initialAvailability?: Availability | null;
}) {
  const [availability, setAvailability] = useState<Availability | null>(initialAvailability ?? null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    () => Object.keys(initialAvailability?.days ?? {}).sort()[0] ?? null,
  );
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [view, setView] = useState<{ year: number; month: number } | null>(() => {
    const firstDate = Object.keys(initialAvailability?.days ?? {}).sort()[0];
    if (!firstDate) return null;
    const [y, m] = firstDate.split("-").map(Number);
    return { year: y, month: m };
  });

  const [navn, setNavn] = useState("");
  const [email, setEmail] = useState(prefill.email || "");
  const [telefon, setTelefon] = useState(prefill.telefon || "");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [booked, setBooked] = useState<{ meetLink: string; start: string } | null>(null);

  function applyAvailability(data: Availability) {
    setAvailability(data);
    const firstDate = Object.keys(data.days).sort()[0] ?? null;
    setSelectedDate((current) => current ?? firstDate);
    if (firstDate) {
      const [y, m] = firstDate.split("-").map(Number);
      setView((current) => current ?? { year: y, month: m });
    }
  }

  async function loadAvailability() {
    setLoadError(null);
    try {
      const res = await fetch("/api/availability");
      const data = await res.json();
      if (!data.ok) throw new Error("Kunne ikke hente ledige tider");
      applyAvailability(data);
    } catch {
      setLoadError("Kunne ikke hente ledige tider. Prøv at genindlæse siden.");
    }
  }

  useEffect(() => {
    // State above is already seeded from initialAvailability where present;
    // only hit the network here as a fallback when SSR couldn't fetch it.
    if (!initialAvailability) {
      loadAvailability();
    }
    // Only ever run once on mount — re-fetches after that go through
    // loadAvailability() directly (e.g. after a 409 double-booking).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dateKeys = useMemo(
    () => (availability ? Object.keys(availability.days).sort() : []),
    [availability],
  );
  const minDateKey = dateKeys[0];
  const maxDateKey = dateKeys[dateKeys.length - 1];
  const slotsForSelectedDate = selectedDate ? availability?.days[selectedDate] ?? [] : [];

  const calendarCells = useMemo(() => {
    if (!view) return [];
    const total = daysInMonth(view.year, view.month);
    const leading = firstWeekdayIndex(view.year, view.month);
    const cells: (string | null)[] = Array(leading).fill(null);
    for (let day = 1; day <= total; day++) {
      cells.push(
        `${view.year}-${String(view.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      );
    }
    return cells;
  }, [view]);

  function shiftMonth(delta: number) {
    setView((current) => {
      if (!current) return current;
      const d = new Date(current.year, current.month - 1 + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() + 1 };
    });
  }

  const canGoPrev =
    view && minDateKey ? `${view.year}-${String(view.month).padStart(2, "0")}` > minDateKey.slice(0, 7) : false;
  const canGoNext =
    view && maxDateKey ? `${view.year}-${String(view.month).padStart(2, "0")}` < maxDateKey.slice(0, 7) : false;

  async function handleBook() {
    if (submitting || !selectedSlot || !navn.trim() || !email.trim()) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot: selectedSlot,
          navn,
          email,
          telefon,
          firma: prefill.firma,
          branche: prefill.branche,
          harHjemmeside: prefill.harHjemmeside,
          domaene: prefill.domaene,
          harFacebook: prefill.harFacebook,
          facebookUrl: prefill.facebookUrl,
          services: prefill.services,
          usp: prefill.usp,
          billeder: prefill.billeder,
        }),
      });
      const data = await res.json();

      if (!data.ok) {
        setSubmitError(data.error || "Noget gik galt. Prøv igen.");
        if (res.status === 409) {
          setSelectedSlot(null);
          loadAvailability();
        }
        return;
      }

      setBooked({ meetLink: data.meetLink, start: data.start });
    } catch {
      setSubmitError("Noget gik galt. Prøv igen.");
    } finally {
      setSubmitting(false);
    }
  }

  if (booked) {
    const d = new Date(booked.start);
    const dateStr = new Intl.DateTimeFormat("da-DK", {
      timeZone: "Europe/Copenhagen",
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(d);
    const timeStr = formatTimeLabel(booked.start);

    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-card">
        <p className="font-display text-2xl font-bold text-ink">Du er booket!</p>
        <p className="mt-2 text-sm text-muted">
          Mødet er sat i kalenderen {dateStr} kl. {timeStr}. Du modtager en kalenderinvitation på
          email med det samme.
        </p>
        {booked.meetLink && (
          <a
            href={booked.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-none bg-beige px-6 py-3.5 text-sm font-semibold text-navyDeep transition-colors hover:bg-beigeDeep"
          >
            Åbn Google Meet-link
            <span aria-hidden>→</span>
          </a>
        )}
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-card">
        <p className="text-sm text-muted">{loadError}</p>
      </div>
    );
  }

  if (!availability) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-card">
        <p className="text-sm text-muted">Henter ledige tider…</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-8 shadow-card">
      <p className="field-label">Vælg en dato</p>
      {view && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              disabled={!canGoPrev}
              aria-label="Forrige måned"
              className="flex h-9 w-9 items-center justify-center border border-border text-lg font-bold text-ink transition-colors hover:border-navy hover:bg-tint disabled:pointer-events-none disabled:opacity-20"
            >
              ←
            </button>
            <p className="text-sm font-semibold capitalize text-ink">
              {MONTH_LABEL.format(new Date(view.year, view.month - 1, 1))}
            </p>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              disabled={!canGoNext}
              aria-label="Næste måned"
              className="flex h-9 w-9 items-center justify-center border border-border text-lg font-bold text-ink transition-colors hover:border-navy hover:bg-tint disabled:pointer-events-none disabled:opacity-20"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-mist">
            {WEEKDAY_LABELS.map((w) => (
              <div key={w} className="py-1">
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((key, i) => {
              if (!key) return <div key={`blank-${i}`} />;
              const hasSlots = Boolean(availability?.days[key]);
              const day = Number(key.slice(-2));
              return (
                <button
                  key={key}
                  type="button"
                  disabled={!hasSlots}
                  onClick={() => {
                    setSelectedDate(key);
                    setSelectedSlot(null);
                  }}
                  className={`aspect-square text-sm font-medium transition-colors ${
                    selectedDate === key
                      ? "bg-navy text-white"
                      : hasSlots
                        ? "border border-border text-ink hover:border-navy"
                        : "text-mist/40"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedDate && (
        <>
          <p className="field-label mt-6">
            Vælg et tidspunkt — {formatDateLabel(selectedDate)}
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slotsForSelectedDate.map((iso) => (
              <button
                key={iso}
                type="button"
                onClick={() => setSelectedSlot(iso)}
                className={`px-3 py-2.5 text-sm font-medium transition-colors ${
                  selectedSlot === iso
                    ? "bg-navy text-white"
                    : "border border-border text-ink hover:border-navy"
                }`}
              >
                {formatTimeLabel(iso)}
              </button>
            ))}
          </div>
        </>
      )}

      {selectedSlot && (
        <div className="mt-8 space-y-5 border-t border-border pt-6">
          <label className="block">
            <span className="field-label">Navn</span>
            <input
              required
              type="text"
              value={navn}
              onChange={(e) => setNavn(e.target.value)}
              className="field"
            />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="field-label">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
              />
            </label>
            <label className="block">
              <span className="field-label">Telefon</span>
              <input
                type="tel"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                className="field"
              />
            </label>
          </div>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

          <button
            type="button"
            disabled={submitting || !navn.trim() || !email.trim()}
            onClick={handleBook}
            className="inline-flex w-full items-center justify-center gap-2 rounded-none bg-beige py-3.5 text-sm font-semibold text-navyDeep transition-colors hover:bg-beigeDeep disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Booker…" : "Bekræft booking"}
            <span aria-hidden>→</span>
          </button>
        </div>
      )}
    </div>
  );
}
