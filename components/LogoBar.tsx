import Image from "next/image";

const logos = [
  { src: "/assets/case-eriklarsen-logo-sm.png", alt: "Erik Larsen & Co. VVS" },
  { src: "/assets/case-proelectric-logo-sm.png", alt: "Proelectric" },
  { src: "/assets/case-vni-logo-sm.png", alt: "VN Isolering" },
];

function Row({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-16 pr-16"
      aria-hidden={ariaHidden}
    >
      {logos.map((logo) => (
        <Image
          key={logo.alt}
          src={logo.src}
          alt={logo.alt}
          width={120}
          height={40}
          className="h-8 w-auto grayscale invert opacity-50 transition hover:opacity-90"
        />
      ))}
      <span className="whitespace-nowrap font-display text-lg font-semibold text-white/50 transition hover:text-white/90">
        JK Dræn &amp; Kloakspuling
      </span>
    </div>
  );
}

export default function LogoBar() {
  return (
    <section className="border-y border-navyDeep bg-navyDeep py-10">
      <div className="overflow-hidden">
        <div className="marquee-track flex w-max">
          <Row />
          <Row ariaHidden />
          <Row ariaHidden />
          <Row ariaHidden />
        </div>
      </div>
    </section>
  );
}
