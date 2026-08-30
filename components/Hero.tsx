import Image from "next/image";
import HeroVideo from "./HeroVideo";
import { ButtonLink, ButtonAnchor } from "./Button";

const steps = [
  { n: "01", label: "Firmanavn og branche" },
  { n: "02", label: "Kontaktoplysninger" },
  { n: "03", label: "Hvad siden skal kunne" },
];

const badges = ["Gratis", "Ingen binding", "Tager 2 min"];

function CtaCard() {
  return (
    <div className="border border-white/10 bg-ink/45 p-9 shadow-2xl backdrop-blur-2xl">
      <h2 className="font-display text-2xl font-medium text-white">
        Klar til flere kunder?
      </h2>
      <p className="mt-2.5 text-[15px] leading-relaxed text-white/60">
        Udfyld et kort skema – vi bygger et gratis udkast til dig på 2 dage.
      </p>

      <ol className="mt-7 divide-y divide-white/10">
        {steps.map((step) => (
          <li key={step.n} className="flex items-center gap-4 py-3.5">
            <span className="font-display text-xs font-semibold text-beige">
              {step.n}
            </span>
            <span className="text-sm text-white/80">{step.label}</span>
          </li>
        ))}
      </ol>

      <ButtonLink href="/formular" className="mt-7 w-full justify-center">
        Få dit gratis udkast
      </ButtonLink>

      <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-1.5">
        {badges.map((badge) => (
          <span
            key={badge}
            className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40"
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
      <HeroVideo />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-navyDeep/85 via-navyDeep/45 to-navyDeep/90"
      />

      <div className="relative mx-auto grid max-w-page gap-16 px-6 py-28 md:grid-cols-[1.25fr_1fr] md:items-center md:py-36 lg:px-10">
        <div className="animate-hero-in">
          <h1 className="leading-[0.92] tracking-tighter">
            <span className="block font-display text-7xl font-bold uppercase text-white sm:text-8xl md:text-[6rem] lg:text-[6.75rem]">
              Få flere kunder
            </span>
            <span className="block font-display text-4xl font-medium uppercase text-beige sm:text-5xl md:text-6xl">
              med en professionel hjemmeside
            </span>
          </h1>
          <p className="mt-9 max-w-md text-lg leading-relaxed text-white/70">
            Du betaler kun hvis du er tilfreds – typisk levering på 2 dage.
          </p>

          <div className="mt-10 md:hidden">
            <CtaCard />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:max-w-sm">
            <div className="overflow-hidden border border-white/10">
              <Image
                src="/assets/ref-vvs.png"
                alt="Eksempel på hjemmeside bygget af Advio for en VVS-virksomhed"
                width={480}
                height={253}
                sizes="(min-width: 640px) 180px, 45vw"
                className="h-auto w-full"
              />
            </div>
            <div className="overflow-hidden border border-white/10">
              <Image
                src="/assets/ref-elektriker.png"
                alt="Eksempel på hjemmeside bygget af Advio for en elektriker"
                width={480}
                height={260}
                sizes="(min-width: 640px) 180px, 45vw"
                className="h-auto w-full"
              />
            </div>
          </div>

          <div className="mt-10">
            <ButtonAnchor href="tel:+4522494295" variant="ghost">
              Ring til os
            </ButtonAnchor>
          </div>
        </div>

        <div className="hidden md:block">
          <CtaCard />
        </div>
      </div>
    </section>
  );
}
