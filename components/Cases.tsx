import Image from "next/image";
import Reveal from "./Reveal";

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
      className="group relative block h-[420px] w-full overflow-hidden rounded-2xl sm:h-[480px] md:h-[560px]"
    >
      <Image
        src={c.image}
        alt={c.imageAlt}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${c.tint} to-transparent`} />

      <div className="relative z-10 flex h-full flex-col justify-end p-8 md:p-10">
        <span className="inline-flex w-fit items-center rounded-full bg-beige px-4 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-navyDeep">
          Sådan hjalp vi {c.tag}
        </span>

        <h3 className="mt-5 font-display text-3xl font-medium leading-[1.05] text-white sm:text-4xl">
          {c.name}
        </h3>

        <span className="mt-6 inline-flex w-fit items-center gap-2 border-b border-white/40 pb-1.5 text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors group-hover:border-white">
          Se siden her
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
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
      <div className="mx-auto max-w-page px-6 py-24">
        <Reveal>
          <div className="mb-4 flex items-center gap-4">
            <span className="h-px w-10 bg-steel" />
            <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-white/50">
              Udvalgte projekter
            </h2>
          </div>
          <h3 className="leading-[1.02] tracking-tight">
            <span className="font-sans text-4xl font-black uppercase text-white sm:text-5xl">
              Udvalgte cases
            </span>{" "}
            <span className="font-display text-4xl font-medium uppercase text-beige sm:text-5xl">
              der taler for sig selv
            </span>
          </h3>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {cases.map((c, i) => (
            <Reveal key={c.name} delay={i * 80}>
              <CaseBlock c={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
