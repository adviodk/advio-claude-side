import Link from "next/link";
import Image from "next/image";
import CalendlyEmbed from "@/components/CalendlyEmbed";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ firma?: string }>;
}) {
  const params = await searchParams;

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
        <h1 className="font-display text-2xl font-black text-ink">
          Tak! Vælg en tid der passer dig
        </h1>
        <p className="mt-3 text-muted">
          Vi har modtaget din henvendelse til {params.firma || "jer"} og
          glæder os til at høre fra dig.
        </p>

        <div className="mt-8">
          <CalendlyEmbed />
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-ink bg-blue px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blueDeep"
          >
            Tilbage til forsiden
          </Link>
        </div>
      </main>
    </div>
  );
}
