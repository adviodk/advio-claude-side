import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import BookingCalendar from "@/components/BookingCalendar";
import { computeAvailability, type AvailabilityData } from "@/lib/availability";

type Prefill = {
  firma?: string;
  branche?: string;
  telefon?: string;
  email?: string;
  harHjemmeside?: string;
  domaene?: string;
  harFacebook?: string;
};

// Awaits the Google Calendar call in its own component so it can sit behind
// a Suspense boundary — the rest of the page streams in immediately instead
// of waiting on the freebusy request.
async function AvailabilityLoader({ prefill }: { prefill: Prefill }) {
  let initialAvailability: AvailabilityData | null = null;
  try {
    initialAvailability = await computeAvailability();
  } catch {
    // BookingCalendar falls back to fetching client-side if this is null.
  }

  return <BookingCalendar initialAvailability={initialAvailability} prefill={prefill} />;
}

function CalendarSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-card">
      <p className="text-sm text-muted">Henter ledige tider…</p>
    </div>
  );
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{
    firma?: string;
    branche?: string;
    telefon?: string;
    email?: string;
    harHjemmeside?: string;
    domaene?: string;
    harFacebook?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-navy-fade">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-navyDeep/95 backdrop-blur">
        <div className="mx-auto flex max-w-page items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
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
        <h1 className="leading-[1.02] tracking-tight">
          <span className="block font-sans text-2xl font-black uppercase text-white sm:text-3xl">
            Tak!
          </span>
          <span className="block font-display text-2xl font-medium uppercase text-beige sm:text-3xl">
            Vælg en tid der passer dig
          </span>
        </h1>
        <p className="mt-3 text-white/70">
          Vi har modtaget din henvendelse til {params.firma || "jer"} og
          glæder os til at høre fra dig.
        </p>

        <div className="mt-8">
          <Suspense fallback={<CalendarSkeleton />}>
            <AvailabilityLoader
              prefill={{
                firma: params.firma,
                branche: params.branche,
                telefon: params.telefon,
                email: params.email,
                harHjemmeside: params.harHjemmeside,
                domaene: params.domaene,
                harFacebook: params.harFacebook,
              }}
            />
          </Suspense>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-none bg-beige px-6 py-3.5 text-sm font-semibold text-navyDeep transition-colors hover:bg-beigeDeep"
          >
            Tilbage til forsiden
          </Link>
        </div>
      </main>
    </div>
  );
}
