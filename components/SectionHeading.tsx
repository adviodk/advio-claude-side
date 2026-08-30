import Reveal from "./Reveal";

const leadSizes = {
  default: "text-3xl sm:text-4xl",
  large: "text-4xl sm:text-5xl lg:text-[3.5rem]",
} as const;

/**
 * Shared eyebrow + two-tone heading used across sections. Centralizing
 * this keeps left-edge alignment, spacing and tracking identical
 * everywhere, while `size="large"` reserves the biggest statement for
 * the sections that should carry more visual weight (Cases, Process),
 * so not every section reads as the same template block repeated.
 */
export default function SectionHeading({
  eyebrow,
  lead,
  accent,
  size = "default",
  className = "",
}: {
  eyebrow: string;
  lead: string;
  accent: string;
  size?: "default" | "large";
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <div className="mb-5 flex items-center gap-4">
        <span className="h-px w-9 bg-steel" />
        <span className="text-xs font-medium uppercase tracking-[0.22em] text-white/45">
          {eyebrow}
        </span>
      </div>
      <h2 className="leading-[0.96] tracking-tighter">
        <span
          className={`font-display ${leadSizes[size]} font-bold uppercase text-white`}
        >
          {lead}
        </span>{" "}
        <span
          className={`font-display ${leadSizes[size]} font-medium uppercase text-beige`}
        >
          {accent}
        </span>
      </h2>
    </Reveal>
  );
}
