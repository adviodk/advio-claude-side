type Segment = string | { italic: string };

/**
 * Sets each line of a headline along a gentle arch: characters near the ends
 * of a line drop slightly and tilt outward, the middle stays highest.
 * Driven by the CSS variable --arc (0 = straight, 1 = full arch), so the
 * curve can be switched off where lines wrap differently (small screens).
 */
export default function ArcText({
  lines,
  depth = 0.16,
  tilt = 3.2,
}: {
  lines: Segment[][];
  /** How far the ends drop, in em. */
  depth?: number;
  /** How far the outermost characters tilt, in degrees. */
  tilt?: number;
}) {
  return (
    <>
      {lines.map((segments, li) => {
        // Flatten the line into characters, remembering which are italic.
        const chars = segments.flatMap((seg) =>
          typeof seg === "string"
            ? [...seg].map((c) => ({ c, italic: false }))
            : [...seg.italic].map((c) => ({ c, italic: true })),
        );
        const mid = (chars.length - 1) / 2;

        // Group into words so lines still wrap between words, never inside them.
        const words: { c: string; italic: boolean; i: number }[][] = [[]];
        chars.forEach((ch, i) => {
          if (ch.c === " ") words.push([]);
          else words[words.length - 1].push({ ...ch, i });
        });

        return (
          <span key={li} className="block">
            {words.map((word, wi) => (
              <span key={wi}>
                {wi > 0 && " "}
                <span className="inline-block whitespace-nowrap">
                  {word.map(({ c, italic, i }) => {
                    const t = mid ? (i - mid) / mid : 0; // -1 … 1 across the line
                    return (
                      <span
                        key={i}
                        className={`inline-block ${italic ? "italic" : ""}`}
                        style={{
                          transform: `translateY(calc(var(--arc, 0) * ${(t * t * depth).toFixed(4)}em)) rotate(calc(var(--arc, 0) * ${(t * tilt).toFixed(3)}deg))`,
                        }}
                      >
                        {c}
                      </span>
                    );
                  })}
                </span>
              </span>
            ))}
          </span>
        );
      })}
    </>
  );
}
