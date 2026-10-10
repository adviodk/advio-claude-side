import Image from "next/image";
import Link from "next/link";
import { serif, mono } from "./fonts";
import { services } from "./Services";
import Seesaw from "./Seesaw";
import TrackedLink from "./TrackedLink";

const heading = `${serif.className} text-[2rem] font-normal leading-none tracking-[-0.01em] sm:text-[2.2rem]`;
const box = "rounded-[3px] bg-white p-7 shadow-[0_22px_44px_-20px_rgba(20,22,20,0.45)]";

/**
 * Closing footer: the canal-house drawing fills the footer, and the four
 * columns sit on it as white boxes — each one hung over its own house, a
 * little staggered, like windows in the facades.
 */
export default function Footer() {
  return (
    <footer id="kontakt" className="relative overflow-hidden">
      {/* Canal-house facades, multiplied into the page colour so the paper disappears */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-multiply [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_12%)] [mask-image:linear-gradient(to_bottom,transparent,black_12%)]"
      >
        <Image src="/hero/ink/facader.webp" alt="" fill quality={90} sizes="100vw" className="object-cover object-[50%_45%]" />
      </div>

      <div className="relative px-4 pb-6 pt-24 sm:px-6 sm:pt-32">
        <div className="mx-auto grid max-w-[1300px] gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-start lg:gap-10">
          {/* Brand */}
          <div className={`${box} lg:mt-0`}>
            <Link href="/" aria-label="Advio – forside">
              <Image src="/assets/ADVIOLOGONYT.png" alt="Advio" width={2000} height={667} className="h-5 w-auto brightness-0" />
            </Link>
            <div className="mt-6 aspect-square w-[150px] border-[5px] border-[var(--ink)] text-[var(--ink)]">
              <Seesaw className="h-full w-full" />
            </div>
            <p className={`${serif.className} mt-6 text-[1.15rem]`}>Information</p>
            <ul className="mt-1 space-y-1 text-[14px] text-[var(--ink)]/80">
              <li>
                <Link href="/privatlivspolitik" className="transition-opacity hover:opacity-60">
                  Privatlivspolitik
                </Link>
              </li>
              <li>CVR-nr. 46287088</li>
            </ul>
          </div>

          {/* Services */}
          <div className={`${box} lg:mt-2`}>
            <h2 className={heading}>Ydelser</h2>
            <ul className="mt-6 space-y-1.5 text-[15px] font-medium">
              {services.map((s) => (
                <li key={s.title}>
                  <a href="#ydelser" className="transition-opacity hover:opacity-60">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className={`${box} lg:mt-8`}>
            <h2 className={heading}>Kontakt os</h2>
            <ul className="mt-6 space-y-1.5 text-[15px] font-medium">
              <li>
                <a href="tel:+4522494295" className="transition-opacity hover:opacity-60">
                  22 49 42 95
                </a>
              </li>
              <li>
                <a href="mailto:simon@advio.dk" className="transition-opacity hover:opacity-60">
                  simon@advio.dk
                </a>
              </li>
            </ul>
            <p className={`${serif.className} mt-6 text-[1.15rem]`}>Frederiksberg</p>
            <p className="text-[14px] leading-relaxed text-[var(--ink)]/80">
              Alhambravej 11 st.
              <br />
              1826 Frederiksberg
            </p>
          </div>

          {/* The one call to action */}
          <div className={`${box} lg:mt-16`}>
            <h2 className={heading}>Gratis udkast</h2>
            <p className="mt-6 text-[15px] leading-relaxed text-[var(--ink)]/80">
              Fortæl kort om din virksomhed, så laver vi et gratis udkast til din nye hjemmeside. Du betaler kun,
              hvis du er tilfreds.
            </p>
            <TrackedLink
              href="/formular"
              location="footer"
              className={`${mono.className} mt-6 inline-flex items-center gap-2 rounded-[3px] bg-[var(--ink)] px-6 py-3.5 text-[12px] uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90`}
            >
              Se mit gratis udkast <span aria-hidden>→</span>
            </TrackedLink>
          </div>
        </div>

        <div className="mx-auto mt-20 flex max-w-[1300px] justify-end sm:mt-40 lg:mt-56">
          <div className="rounded-[3px] bg-white px-5 py-3 text-right text-[12px] leading-snug text-[var(--ink)]/70">
            <p>Copyright {new Date().getFullYear()} · Advio</p>
            <p>Alle rettigheder forbeholdes</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
