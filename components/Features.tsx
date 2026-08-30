import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { ButtonLink } from "./Button";

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

        <div className="grid gap-px overflow-hidden bg-white/10 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal
              key={f.n}
              delay={i * 80}
              className={i === 0 || i === 3 ? "lg:col-span-2" : ""}
            >
              <div className="group flex h-full min-h-[220px] flex-col justify-between bg-ink/40 p-9 backdrop-blur-2xl transition-colors duration-300 hover:bg-ink/55 sm:min-h-[260px]">
                <span className="font-display text-sm font-medium text-beige/70">
                  {f.n}
                </span>
                <div>
                  <h4 className="font-display text-2xl font-medium leading-snug tracking-tight text-white sm:text-3xl">
                    {f.title}
                  </h4>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/55">
                    {f.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
          <div className="mt-16 flex justify-center">
            <ButtonLink href="/formular">Få dit gratis udkast</ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
