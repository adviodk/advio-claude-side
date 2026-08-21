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
          className="h-8 w-auto grayscale opacity-60 transition hover:grayscale-0 hover:opacity-100"
        />
      ))}
      <span className="whitespace-nowrap font-display text-lg font-semibold text-mist transition hover:text-ink">
        JK Dræn &amp; Kloakspuling
      </span>
    </div>
  );
}

export default function LogoBar() {
  return (
    <section className="border-y border-border bg-white py-8">
      <div className="mx-auto max-w-page px-6">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.16em] text-mist">
          Hjemmesider vi har bygget
        </p>
      </div>
      <div className="overflow-hidden">
        <div className="marquee-track flex w-max">
          <Row />
          <Row ariaHidden />
        </div>
      </div>
    </section>
  );
}
