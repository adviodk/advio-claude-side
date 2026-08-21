import Link from "next/link";
import PhoneShowcase from "./PhoneShowcase";

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
    <section id="features" className="scroll-mt-20 border-t border-border bg-canvas">
      <div className="mx-auto max-w-page px-6 py-24">
        <div className="mb-6 flex items-center gap-4">
          <span className="h-px w-10 bg-steel" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Vi bygger hjemmesider der virker
          </h2>
        </div>

        <h3 className="max-w-2xl leading-[1.05] sm:text-4xl">
          <span className="font-sans text-3xl font-black uppercase text-ink sm:text-4xl">
            Klar til at tage
          </span>{" "}
          <span className="font-display text-3xl italic text-navy sm:text-4xl">
            næste skridt?
          </span>
        </h3>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.n}
                className="border border-ink bg-white shadow-cardSoft"
              >
                <div
                  className={`h-1.5 ${
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
            ))}
          </div>

          <div>
            <PhoneShowcase />
          </div>
        </div>

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
      </div>
    </section>
  );
}
