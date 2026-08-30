import Image from "next/image";
import Link from "next/link";

const steps = [
  { n: "01", label: "Firmanavn og branche" },
  { n: "02", label: "Kontaktoplysninger" },
  { n: "03", label: "Hvad siden skal kunne" },
];

const badges = ["Gratis", "Ingen binding", "Tager 2 min"];

function CtaCard() {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-card">
      <h2 className="font-display text-xl font-bold text-ink">
        Klar til flere kunder?
      </h2>
      <p className="mt-2 text-sm text-muted">
        Udfyld et kort skema – vi bygger et gratis udkast til dig på 2 dage.
      </p>

      <ol className="mt-7 divide-y divide-border">
        {steps.map((step) => (
          <li key={step.n} className="flex items-center gap-4 py-3.5">
            <span className="font-display text-xs font-semibold text-navy">
              {step.n}
            </span>
            <span className="text-sm text-ink">{step.label}</span>
          </li>
        ))}
      </ol>

      <Link
        href="/formular"
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-none bg-beige py-4 text-sm font-semibold text-navyDeep transition-colors hover:bg-beigeDeep"
      >
        Få dit gratis udkast
        <span aria-hidden>→</span>
      </Link>

      <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-1.5">
        {badges.map((badge) => (
          <span
            key={badge}
            className="text-xs font-medium uppercase tracking-wide text-mist"
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative scroll-mt-20 overflow-hidden bg-navy-fade"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/assets/hero-ocean-poster.jpg"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
      >
        <source src="/assets/hero-ocean.mp4" type="video/mp4" />
      </video>
      <Image
        src="/assets/hero-ocean-poster.jpg"
        alt=""
        fill
        priority
        aria-hidden="true"
        className="hidden object-cover motion-reduce:block"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-navyDeep/80 via-navyDeep/50 to-navyDeep/85"
      />

      <div className="relative mx-auto grid max-w-page gap-14 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <h1 className="leading-[0.98] tracking-tight">
            <span className="block font-display text-5xl font-bold uppercase text-white sm:text-6xl md:text-7xl">
              Få flere kunder
            </span>
            <span className="block font-display text-4xl font-medium uppercase text-beige sm:text-5xl md:text-6xl">
              med en professionel hjemmeside
            </span>
          </h1>
          <p className="mt-7 max-w-md text-lg text-white/70">
            Du betaler kun hvis du er tilfreds – typisk levering på 2 dage.
          </p>

          <div className="mt-9 md:hidden">
            <CtaCard />
          </div>

          <div className="mt-9 grid grid-cols-2 gap-3 sm:max-w-sm">
            <div className="overflow-hidden rounded-xl shadow-cardSoft">
              <Image
                src="/assets/ref-vvs.png"
                alt="Eksempel på hjemmeside bygget af Advio for en VVS-virksomhed"
                width={480}
                height={253}
                className="h-auto w-full"
              />
            </div>
            <div className="overflow-hidden rounded-xl shadow-cardSoft">
              <Image
                src="/assets/ref-elektriker.png"
                alt="Eksempel på hjemmeside bygget af Advio for en elektriker"
                width={480}
                height={260}
                className="h-auto w-full"
              />
            </div>
          </div>

          <div className="mt-9">
            <a
              href="tel:+4522494295"
              className="inline-flex items-center gap-2 rounded-none bg-beige px-6 py-3.5 text-sm font-semibold text-navyDeep transition-colors hover:bg-beigeDeep"
            >
              Ring til os
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        <div className="hidden md:block">
          <CtaCard />
        </div>
      </div>
    </section>
  );
}
