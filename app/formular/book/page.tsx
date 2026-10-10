import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import BookingCalendar from "@/components/BookingCalendar";
import UploadStatus from "@/components/UploadStatus";
import FormularBackground from "@/components/FormularBackground";
import FontTheme from "@/components/FontTheme";
import { fontVariables } from "@/components/fontThemes";

type AvailabilityData = {
  timezone: string;
  slotMinutes: number;
  days: Record<string, string[]>;
};

type Prefill = {
  firma?: string;
  cvr?: string;
  branche?: string;
  navn?: string;
  telefon?: string;
  email?: string;
};

// Awaits the Advio Automation call in its own component so it can sit behind
// a Suspense boundary — the rest of the page streams in immediately instead
// of waiting on it. This used to be a direct in-process call to
// computeAvailability(); now that availability lives in a separate service,
// it's a server-side fetch instead — still never touches the browser, so no
// CORS and no exposed secrets, just a network hop that didn't exist before.
async function AvailabilityLoader({ prefill }: { prefill: Prefill }) {
  let initialAvailability: AvailabilityData | null = null;
  try {
    const baseUrl = process.env.AUTOMATION_BASE_URL;
    const apiKey = process.env.AUTOMATION_API_KEY;
    if (baseUrl && apiKey) {
      const res = await fetch(`${baseUrl}/api/availability`, {
        headers: { "x-automation-key": apiKey },
        // Don't let a slow/down Automation hold up the page indefinitely —
        // BookingCalendar falls back to fetching client-side if this is null.
        signal: AbortSignal.timeout(5000),
      });
      const data = await res.json();
      if (data.ok) initialAvailability = data;
    }
  } catch {
    // BookingCalendar falls back to fetching client-side if this is null.
  }

  return <BookingCalendar initialAvailability={initialAvailability} prefill={prefill} />;
}

function CalendarSkeleton() {
  return <p className="text-sm text-muted">Henter ledige tider…</p>;
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{
    firma?: string;
    cvr?: string;
    branche?: string;
    navn?: string;
    telefon?: string;
    email?: string;
  }>;
}) {
  const params = await searchParams;

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
            <h1 className="font-th-serif text-[1.7rem] leading-tight text-ink">Tak!</h1>
            <p className="mt-1.5 text-sm text-muted">
              Vi har modtaget din henvendelse til {params.firma || "jer"} — vælg
              en tid der passer dig.
            </p>

            <UploadStatus />

            <div className="mt-6">
              <Suspense fallback={<CalendarSkeleton />}>
                <AvailabilityLoader
                  prefill={{
                    firma: params.firma,
                    cvr: params.cvr,
                    branche: params.branche,
                    navn: params.navn,
                    telefon: params.telefon,
                    email: params.email,
                  }}
                />
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </div>
    </FontTheme>
  );
}
