import Image from "next/image";

// The photo has a light-grey studio backdrop (#ebebeb). Rather than masking it,
// the laptop sits in a full-width band of that same grey which fades in and
// out vertically, so the photo's edges disappear into it.
const PHOTO_BG = "#ebebeb";
const band = `linear-gradient(to bottom, transparent 0%, ${PHOTO_BG} 12%, ${PHOTO_BG} 84%, transparent 100%)`;

// The photo also has a faint vignette; fading its outermost edges hides it.
const edges =
  "linear-gradient(to right, transparent, black 8%, black 92%, transparent), linear-gradient(to bottom, transparent, black 13%, black 94%, transparent)";
const photoEdgeFade = {
  maskImage: edges,
  WebkitMaskImage: edges,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
} as React.CSSProperties;

export default function WhyWebsite() {
  return (
    <section className="px-6 pb-24 pt-4 sm:pb-32 sm:pt-6">
      <div className="-mx-6 pb-16 sm:pb-24" style={{ background: band }}>
        <div className="mx-auto w-[72%] max-w-[1200px] sm:w-full sm:px-6">
          <Image
            src="/redesign/laptop-stat.webp"
            alt="Laptop med teksten: 7 ud af 10 tjekker din hjemmeside, inden de ringer. Kilde: PR Newswire, 2021."
            width={1448}
            height={1086}
            sizes="(min-width: 1248px) 1200px, (min-width: 640px) 100vw, 72vw"
            className="h-auto w-full"
            style={photoEdgeFade}
          />
        </div>
      </div>
    </section>
  );
}
