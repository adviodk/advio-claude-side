import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

type CaseItem = {
  name: string;
  tag: string;
  href: string;
  image: string;
  imageAlt: string;
  tint: string;
};

const cases: CaseItem[] = [
  {
    name: "Erik Larsen & Co. VVS",
    tag: "VVS",
    href: "https://www.eriklarsen.dk",
    image: "/assets/case-eriklarsen-hero.png",
    imageAlt: "Erik Larsen & Co. VVS",
    tint: "from-navyDeep/95 via-navyDeep/50",
  },
  {
    name: "VN Isolering",
    tag: "Facade & isolering",
    href: "https://vnisolering.dk",
    image: "/assets/case-vni-after.webp",
    imageAlt: "VN Isolering",
    tint: "from-ink/95 via-ink/45",
  },
];

function CaseBlock({ c }: { c: CaseItem }) {
  return (
    <a
      href={c.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-lg"
    >
      <Image
        src={c.image}
        alt={c.imageAlt}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
      />
      <div
        className={`absolute inset-0 bg-gradient-to-t ${c.tint} to-transparent transition-opacity duration-500 group-hover:opacity-90`}
      />

      <div className="relative z-10 flex h-full flex-col justify-end p-8 md:p-10">
        <span className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-beige">
          <span className="h-px w-5 bg-beige/70" />
          {c.tag}
        </span>

        <h3 className="mt-4 font-display text-3xl font-medium leading-[1.02] tracking-tight text-white sm:text-4xl">
          {c.name}
        </h3>

        <span className="mt-7 inline-flex w-fit items-center gap-2 border-b border-white/30 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 transition-colors duration-300 group-hover:border-white group-hover:text-white">
          Se casen
          <span
            aria-hidden
            className="transition-transform duration-300 ease-out group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </a>
  );
}

export default function Cases() {
  return (
    <section id="cases" className="scroll-mt-20 bg-navy-fade">
      <div className="mx-auto max-w-page px-6 py-24 sm:py-32">
        <SectionHeading
          eyebrow="Udvalgte projekter"
          lead="Cases"
          accent="der taler for sig selv"
          size="large"
          className="mb-14 sm:mb-20"
        />

        <div className="grid gap-6 sm:grid-cols-2 md:gap-8">
          {cases.map((c, i) => (
            <Reveal key={c.name} delay={i * 100}>
              <CaseBlock c={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
