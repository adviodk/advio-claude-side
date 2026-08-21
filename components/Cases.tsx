import Image from "next/image";
import Reveal from "./Reveal";

type PhotoCase = {
  name: string;
  tag: string;
  href: string;
  image: string;
  imageAlt: string;
  tint: string;
};

type LogoCase = {
  name: string;
  tag: string;
  href: string;
  logo: string;
  logoAlt: string;
};

const cases: (PhotoCase | LogoCase)[] = [
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
  {
    name: "Proelectric",
    tag: "Elinstallation",
    href: "https://proelectric.dk",
    logo: "/assets/case-proelectric-logo.png",
    logoAlt: "Proelectric logo",
  },
];

function CaseContent({ c }: { c: PhotoCase | LogoCase }) {
  return (
    <div className="relative z-10 flex h-full max-w-page flex-col justify-end px-6 pb-12 md:mx-auto md:px-12 md:pb-16">
      <span className="inline-flex w-fit items-center rounded-full bg-beige px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-navyDeep">
        Sådan hjalp vi {c.tag}
      </span>

      <h3 className="mt-5 font-display text-4xl leading-[1.02] text-white sm:text-5xl md:text-6xl">
        {c.name}
      </h3>

      <span className="mt-6 inline-flex w-fit items-center gap-2 border-b border-white/40 pb-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors group-hover:border-white">
        Se casen her
        <span
          aria-hidden
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </div>
  );
}

function CaseBlock({ c }: { c: PhotoCase | LogoCase }) {
  const isPhoto = "image" in c;

  return (
    <a
      href={c.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block h-[420px] w-full overflow-hidden sm:h-[480px] md:h-[560px]"
    >
      {isPhoto ? (
        <>
          <Image
            src={c.image}
            alt={c.imageAlt}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${c.tint} to-transparent`} />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-navy" />
          <div className="absolute inset-0 flex items-center justify-end pr-6 opacity-15 transition-transform duration-700 ease-out group-hover:scale-105 md:pr-24">
            <Image
              src={c.logo}
              alt=""
              width={420}
              height={420}
              className="h-auto w-[260px] object-contain sm:w-[340px] md:w-[420px]"
            />
          </div>
        </>
      )}

      <CaseContent c={c} />
    </a>
  );
}

export default function Cases() {
  return (
    <section id="cases" className="scroll-mt-20 bg-navyDeep">
      <div className="mx-auto max-w-page px-6 py-24">
        <Reveal>
          <div className="mb-4 flex items-center gap-4">
            <span className="h-px w-10 bg-steel" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Udvalgte projekter
            </h2>
          </div>
          <h3 className="leading-[1.05] sm:text-4xl">
            <span className="font-sans text-3xl font-black uppercase text-white sm:text-4xl">
              Cases
            </span>{" "}
            <span className="font-display text-3xl italic text-beige sm:text-4xl">
              der taler for sig selv
            </span>
          </h3>
        </Reveal>
      </div>

      <div className="flex flex-col gap-1">
        {cases.map((c, i) => (
          <Reveal key={c.name} delay={i * 80}>
            <CaseBlock c={c} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
