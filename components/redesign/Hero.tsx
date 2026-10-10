import Link from "next/link";
import Image from "next/image";
import { serif, mono } from "./fonts";
import TrackedLink from "./TrackedLink";
import HeroSearch from "./HeroSearch";
import ArcText from "./ArcText";
import LoopVideo from "./LoopVideo";

const nav = [
  { href: "#hvorfor", label: "Hvorfor Advio" },
  { href: "#cases", label: "Cases" },
  { href: "#ydelser", label: "Ydelser" },
  { href: "#kontakt", label: "Kontakt" },
];

export default function Hero() {
  return (
    <section className="relative min-h-[max(100svh,780px)] overflow-hidden">
      {/* Ink drawing of a Copenhagen canal: the canal runs up the middle and the
          houses frame it on both sides. A soft oval clearing is masked out
          behind the headline and search bar, so the text is never covered
          (on phones, where the text spans the full width, the drawing simply
          fades in below it). Its white paper is multiplied into the page
          colour, so only the ink remains. A 5-second loop (water, walkers,
          the man on the quay) fades in over the still drawing once it plays. */}
      <div className="pointer-events-none absolute inset-0 mix-blend-multiply [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,transparent_48%,black_68%)] [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_48%,black_68%)] sm:[-webkit-mask-image:radial-gradient(ellipse_52%_56%_at_50%_0%,transparent_68%,black_100%)] sm:[mask-image:radial-gradient(ellipse_52%_56%_at_50%_0%,transparent_68%,black_100%)]">
        <Image
          src="/hero/ink/kanal.webp"
          alt="Akvarelskitse af en københavnsk kanal med gavlhuse og sejlbåde, en mand der sidder på kajkanten og to der går langs vandet"
          fill
          preload
          quality={90}
          sizes="100vw"
          className="object-cover object-bottom"
        />
        <LoopVideo
          src="/hero/ink/kanal.mp4"
          mobileSrc="/hero/ink/kanal-mobile.mp4"
          className="absolute inset-0 h-full w-full object-cover object-bottom"
        />
      </div>

      <header className="relative z-10 flex items-center justify-between gap-6 px-4 py-5 sm:px-8 sm:py-6">
        <Link
          href="/"
          aria-label="Advio – forside"
          className="rounded-[3px] bg-white px-4 py-3 shadow-[0_10px_24px_-14px_rgba(20,22,20,0.4)] sm:px-5 sm:py-3.5"
        >
          <Image
            src="/assets/ADVIOLOGONYT.png"
            alt="Advio"
            width={2000}
            height={667}
            preload
            className="h-5 w-auto brightness-0 sm:h-6"
          />
        </Link>

        <nav aria-label="Hovedmenu" className="flex items-center gap-1 rounded-[3px] bg-white/80 p-1.5 backdrop-blur-sm">
          {nav.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hidden rounded-[3px] px-3.5 py-2 text-[14px] text-[var(--ink)]/75 transition-colors hover:bg-black/[0.04] hover:text-[var(--ink)] md:block"
            >
              {l.label}
            </a>
          ))}
          <TrackedLink
            href="/formular"
            location="nav"
            className={`${mono.className} rounded-[3px] bg-[var(--ink)] px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90 md:ml-1`}
          >
            Gratis udkast
          </TrackedLink>
        </nav>
      </header>

      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center px-6 pt-6 text-center sm:pt-10">
        <h1
          className={`${serif.className} text-[3.1rem] font-normal leading-[1.02] tracking-[-0.01em] [--arc:0] sm:text-[4.6rem] lg:text-[5.6rem] lg:[--arc:1]`}
        >
          <span className="sr-only">Du leverer i topklasse. Din hjemmeside bør også.</span>
          {/* Set along a gentle arch on wide screens, where each line fits on one row (see ArcText). */}
          <span aria-hidden>
            <ArcText lines={[["Du leverer i topklasse."], ["Din hjemmeside ", { italic: "bør" }, " også."]]} />
          </span>
        </h1>
        <HeroSearch />
      </div>
    </section>
  );
}
