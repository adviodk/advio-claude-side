/** Wobbly concentric rings around a "summit", like height curves on a map. */
export function contourPaths(cx: number, cy: number, rings: number, seed: number, step = 34) {
  const paths: string[] = [];
  for (let k = 1; k <= rings; k++) {
    const r = k * step;
    const pts: string[] = [];
    for (let a = 0; a <= 64; a++) {
      const t = (a / 64) * Math.PI * 2;
      const wobble =
        1 +
        0.14 * Math.sin(3 * t + seed + k * 0.35) +
        0.08 * Math.sin(5 * t - seed * 1.7 + k * 0.2) +
        0.05 * Math.cos(7 * t + k * 0.5);
      const x = cx + Math.cos(t) * r * wobble * 1.25;
      const y = cy + Math.sin(t) * r * wobble;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    paths.push(`M${pts.join("L")}Z`);
  }
  return paths;
}
