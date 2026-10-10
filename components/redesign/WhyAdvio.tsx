import Image from "next/image";
import { serif, mono } from "./fonts";
import TrackedLink from "./TrackedLink";

const pillars = [
  {
    title: "Mindre, men bedre.",
    text: "Rolige layouts, generøs luft og typografi, der får lov at bære. Vi fjerner alt, der ikke styrker dit budskab, så det vigtigste står klart, og din virksomhed fremstår sikker, seriøs og eksklusiv.",
  },
  {
    title: "Forståelse før design.",
    text: "Vi sætter os grundigt ind i din forretning, dine kunder og det, der gør dig til det bedre valg. Først derefter designer vi, så hjemmesiden fortæller din historie og ikke en skabelons.",
  },
  {
    title: "Tæt og personligt samarbejde.",
    text: "Du har én fast kontakt fra første udkast til færdig side. Vi svarer hurtigt, taler uden fagjargon og arbejder med ordentlighed, tillid og respekt for din tid.",
  },
];

/** "Hvorfor Advio?" — a portrait beside a short, personal pitch. */
export default function WhyAdvio() {
  return (
    <section id="hvorfor" className="scroll-mt-4 px-6 pb-12 pt-28 sm:pb-16 sm:pt-40">
      <div className="mx-auto grid max-w-[1100px] items-center gap-12 md:grid-cols-[5fr_7fr] md:gap-16 lg:gap-24">
        <div className="relative mx-auto aspect-[5/6] w-full max-w-[420px] overflow-hidden rounded-[3px] shadow-[0_30px_60px_-24px_rgba(20,22,20,0.35)]">
          <Image
            src="/redesign/simon.webp"
            alt="Simon König fra Advio"
            fill
            quality={90}
            sizes="(min-width: 768px) 420px, 90vw"
            className="object-cover"
          />
        </div>

        <div>
          <h2 className={`${serif.className} text-[2.9rem] font-normal leading-[1] tracking-[-0.01em] sm:text-7xl`}>
            Hvorfor <em className="italic">Advio?</em>
          </h2>
          <p className="mt-7 text-[17px] leading-relaxed text-[var(--ink)]/80 sm:text-[19px]">
            Vi er et specialiseret webbureau, der udelukkende designer stilrene, minimalistiske og
            professionelle hjemmesider til virksomheder, hvor kvalitet er hele forretningen. Når dine
            kunder køber noget af høj værdi, skal deres første indtryk af dig være lige så
            gennemarbejdet som det, du leverer.
          </p>

          <div className="mt-9 space-y-5">
            {pillars.map((p) => (
              <p key={p.title} className="text-[15px] leading-relaxed text-[var(--muted)] sm:text-[16px]">
                <em className={`${serif.className} mr-1.5 text-[1.3rem] italic text-[var(--ink)]`}>{p.title}</em>
                {p.text}
              </p>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
            <TrackedLink
              href="/formular"
              location="hvorfor-advio"
              className={`${mono.className} inline-flex items-center gap-2 rounded-[3px] bg-[var(--ink)] px-7 py-4 text-[13px] uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90`}
            >
              Se mit gratis udkast <span aria-hidden>→</span>
            </TrackedLink>
            <a
              href="#cases"
              className="text-[15px] underline decoration-black/25 underline-offset-[6px] transition-colors hover:decoration-black/70"
            >
              Se, hvordan vi har løftet andre <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
