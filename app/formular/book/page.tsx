import { Suspense } from "react";
import { Quicksand } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import BookingCalendar from "@/components/BookingCalendar";
import UploadStatus from "@/components/UploadStatus";
import BackgroundVideo from "@/components/BackgroundVideo";

// Same scoped font as /formular — this page is the next step in the same
// flow and should read as one continuous card-style experience.
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

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

        <main className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-16">
          <div className={`${quicksand.className} animate-hero-in rounded-2xl bg-white p-6 shadow-card sm:p-10`}>
            <h1 className="text-xl font-semibold text-ink">Tak!</h1>
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
  );
}
