import Image from "next/image";

// Transparent white versions of the customer logos (generated from the
// supplied navy-background files); inverted to near-black on the light page.
const logos = [
  { src: "/logos/erik-larsen.png", alt: "Erik Larsen & Co. ApS", width: 570 },
  { src: "/logos/proelectric.png", alt: "Proelectric", width: 641 },
  { src: "/logos/vn-isolering.png", alt: "V&N Isolering ApS", width: 466 },
  { src: "/logos/jk-draen.png", alt: "JK Dræn & Kloakspuling", width: 808 },
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-24 pr-24 sm:gap-32 sm:pr-32">
      {logos.map((logo) => (
        <li key={logo.src} className="shrink-0">
          <Image
            src={logo.src}
            alt={hidden ? "" : logo.alt}
            width={logo.width}
            height={160}
            className="h-8 w-auto opacity-60 invert sm:h-10"
          />
        </li>
      ))}
    </ul>
  );
}

export default function LogoMarquee() {
  // Soft fade at both edges so logos glide in and out rather than clip.
  const edgeFade = {
    maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
    WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
  } as React.CSSProperties;

  return (
    <section className="pb-6 pt-12 sm:pb-8 sm:pt-16">
      <div className="overflow-hidden" style={edgeFade}>
        <div className="logo-marquee flex w-max">
          {/* Four identical rows; the track shifts by exactly one row (25%) per
              loop, so it repeats seamlessly even on very wide screens. */}
          <Row />
          <Row hidden />
          <Row hidden />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
