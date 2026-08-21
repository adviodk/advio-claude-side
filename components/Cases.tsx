import Image from "next/image";

const cases = [
  {
    tags: ["VVS", "København"],
    title: "Erik Larsen & Co. VVS fik en digital forside der matcher deres håndværk",
    body: "Autoriseret VVS-firma i København, kåret som finalist/vinder af Årets Håndværker 2013–2025. Ny hjemmeside der samler ydelser, anmeldelser og kontaktvej ét sted.",
    href: "https://www.eriklarsen.dk",
    logo: "/assets/case-eriklarsen-logo.png",
    image: "/assets/case-eriklarsen-hero.png",
    imageAlt: "Erik Larsen & Co. VVS' team",
  },
  {
    tags: ["Facade & isolering", "Jylland"],
    title: "VN Isolering fik en hjemmeside der viser resultaterne frem",
    body: "Facade- og isoleringsfirma med base i Jylland. Ny hjemmeside bygget om før/efter-billeder, så kunderne kan se kvaliteten, før de beder om en vurdering.",
    href: "https://vnisolering.dk",
    logo: "/assets/case-vni-logo.png",
    image: "/assets/case-vni-after.webp",
    imageAlt: "Facaderenovering udført af VN Isolering",
  },
  {
    tags: ["Elinstallation", "Valby"],
    title: "Proelectric fik en hjemmeside der virker fra dag ét",
    body: "Autoriseret elinstallatør i Valby, der udfører el-installationer for private og erhverv. Ny hjemmeside med fokus på faglighed og hurtig kontakt.",
    href: "https://proelectric.dk",
    logo: "/assets/case-proelectric-logo.png",
    image: "/assets/case-proelectric-shot.png",
    imageAlt: "Proelectrics hjemmeside",
  },
];

export default function Cases() {
  return (
    <section id="cases" className="scroll-mt-20 bg-canvas">
      <div className="mx-auto max-w-page px-6 py-24">
        <div className="grid gap-14 lg:grid-cols-3">
          {cases.map((c) => (
            <article key={c.title} className="flex flex-col">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-navyDeep">
                {c.image ? (
                  <Image
                    src={c.image}
                    alt={c.imageAlt}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-navy">
                    <Image
                      src={c.logo}
                      alt={c.tags[0]}
                      width={160}
                      height={70}
                      className="h-auto w-40"
                    />
                  </div>
                )}
                {c.image && (
                  <div className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-2.5 py-1.5 shadow-sm">
                    <Image
                      src={c.logo}
                      alt=""
                      width={90}
                      height={32}
                      className="h-6 w-auto"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">
                  {c.tags.join(" · ")}
                </p>
                <h3 className="mt-3 font-display text-lg font-black leading-snug text-ink">
                  {c.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {c.body}
                </p>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-navyDeep"
                >
                  Se hjemmesiden
                  <span aria-hidden>↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
