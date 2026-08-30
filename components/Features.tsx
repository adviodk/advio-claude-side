import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const features = [
  {
    n: "01",
    title: "Responsivt design",
    body: "Din hjemmeside ser skarp ud på mobil, tablet og desktop – uden at noget skubber sig eller bliver klemt sammen.",
  },
  {
    n: "02",
    title: "Hurtig loading",
    body: "Optimeret kode og billeder gør, at siden loader på under et sekund. Dine besøgende bliver – og Google belønner det.",
  },
  {
    n: "03",
    title: "Klar kommunikation",
    body: "Vi skærer ind til benet, så dine kunder med det samme forstår, hvad du tilbyder, og hvorfor de skal vælge dig.",
  },
  {
    n: "04",
    title: "Flere henvendelser",
    body: "Hver sektion er bygget med ét mål for øje: at få besøgende til at ringe, skrive eller booke en tid hos dig.",
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20 bg-navy-fade">
      <div className="mx-auto max-w-page px-6 py-24 sm:py-32">
        <SectionHeading
          eyebrow="Derfor Advio"
          lead="Bygget til at"
          accent="konvertere"
          className="mb-14 sm:mb-16"
        />

        <div className="grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.n} delay={i * 80}>
              <div className="group h-full bg-white p-8 transition-colors duration-300 hover:bg-canvas">
                <span className="font-display text-sm font-semibold text-mist">
                  {f.n}
                </span>
                <h4 className="mt-4 font-display text-xl font-bold leading-snug tracking-tight text-ink">
                  {f.title}
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {f.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
          <div className="mt-12 flex justify-center">
            <Link
              href="/formular"
              className="group inline-flex items-center gap-3 rounded-none bg-beige px-8 py-4 text-sm font-semibold text-navyDeep transition-colors hover:bg-beigeDeep"
            >
              Få dit gratis udkast
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
