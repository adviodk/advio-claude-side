import Link from "next/link";
import Reveal from "./Reveal";

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
    <section id="features" className="scroll-mt-20 bg-navyDeep">
      <div className="mx-auto max-w-page px-6 py-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.n} delay={i * 80}>
              <div className="rounded-2xl border border-white/10 bg-white shadow-cardSoft">
                <div
                  className={`h-1.5 rounded-t-2xl ${
                    Number(f.n) % 2 === 0 ? "bg-steel" : "bg-navy"
                  }`}
                />
                <div className="p-7">
                  <span className="font-display text-xs font-semibold text-navy">
                    {f.n}
                  </span>
                  <h4 className="mt-3 font-display text-lg font-black text-ink">
                    {f.title}
                  </h4>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">
                    {f.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
          <div className="mt-12 flex justify-center">
            <Link
              href="/formular"
              className="group inline-flex items-center gap-3 rounded-full bg-beige px-8 py-4 text-sm font-semibold text-navyDeep transition-colors hover:bg-beigeDeep"
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
