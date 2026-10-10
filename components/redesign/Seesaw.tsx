"use client";

import { useEffect, useRef } from "react";

// A small looping seesaw. The square crouches, jumps in an arc (with a full
// spin) over to the raised end, lands with a squash and a puff of dust, the
// plank tips, and the ball rolls down and bumps into it. Then it all happens
// again in the other direction.
// Drawn in a 100×100 viewBox, animated with requestAnimationFrame.

const PIVOT = { x: 50, y: 80 };
const TILT = 12; // degrees
const END = 31; // where the square sits, along the plank
const REST = 21; // where the ball comes to rest, along the plank
const BALL_R = 4;
const SQ = 10;
const PLANK_T = 3;
const HALF = 2.9; // seconds per half cycle
const JUMP_HEIGHT = 42;

const ease = {
  inQuad: (t: number) => t * t,
  outQuad: (t: number) => 1 - (1 - t) * (1 - t),
  inOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  outBack: (t: number) => 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2),
};
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const phase = (t: number, from: number, to: number) => clamp01((t - from) / (to - from));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** A point `s` along the plank, `h` above its top surface, at tilt `deg`. */
function onPlank(s: number, h: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  const y = -PLANK_T - h;
  return { x: PIVOT.x + s * Math.cos(a) - y * Math.sin(a), y: PIVOT.y + s * Math.sin(a) + y * Math.cos(a) };
}

type Frame = {
  angle: number;
  ball: { x: number; y: number; rot: number };
  sq: { x: number; y: number; rot: number; sx: number; sy: number };
  dust: { x: number; y: number; f: number } | null;
};

/**
 * First half: everything starts on the right (plank down on the right, ball
 * and square there) and ends on the left. The second half mirrors it.
 */
function halfFrame(t: number): Frame {
  // 0–0.25 crouch · 0.25–1.05 jump · 1.05–1.2 land · 1.05–1.45 plank tips ·
  // 1.45–2.2 ball rolls · 2.2–2.45 ball bumps back off the square
  const tip = ease.outBack(phase(t, 1.05, 1.45));
  const angle = lerp(TILT, -TILT, tip);

  const roll = ease.inQuad(phase(t, 1.45, 2.2));
  const bump = Math.sin(Math.PI * phase(t, 2.2, 2.45)) * 2.5;
  const ballS = lerp(REST, -REST, roll) + bump;
  const b = onPlank(ballS, BALL_R, angle);
  const ball = { ...b, rot: ((REST - ballS) / BALL_R) * (-180 / Math.PI) };

  let sq: Frame["sq"];
  let dust: Frame["dust"] = null;
  if (t < 0.25) {
    // Crouch before jumping
    const c = Math.sin(Math.PI * phase(t, 0, 0.25));
    const p = onPlank(END, SQ / 2, TILT);
    sq = { ...p, rot: TILT, sx: 1 + 0.25 * c, sy: 1 - 0.3 * c };
  } else if (t < 1.05) {
    // Arc over to the raised end, spinning a full turn
    const f = phase(t, 0.25, 1.05);
    const from = onPlank(END, SQ / 2, TILT);
    const to = onPlank(-END, SQ / 2, TILT);
    const stretch = 1 - Math.abs(f - 0.5) * 2;
    sq = {
      x: lerp(from.x, to.x, ease.inOutSine(f)),
      y: lerp(from.y, to.y, f) - JUMP_HEIGHT * 4 * f * (1 - f),
      rot: TILT - 360 * ease.inOutSine(f),
      sx: 1 - 0.08 * stretch,
      sy: 1 + 0.08 * stretch,
    };
  } else {
    // Landed: squash, then ride the plank
    const p = onPlank(-END, SQ / 2, angle);
    const s = Math.sin(Math.PI * phase(t, 1.05, 1.25));
    sq = { ...p, rot: angle, sx: 1 + 0.28 * s, sy: 1 - 0.32 * s };
    if (t < 1.6) {
      const base = onPlank(-END, 0, TILT);
      dust = { x: base.x, y: base.y, f: phase(t, 1.05, 1.6) };
    }
  }

  return { angle, ball, sq, dust };
}

function frameAt(time: number): Frame {
  const t = time % (2 * HALF);
  const f = halfFrame(t % HALF);
  if (t < HALF) return f;
  return {
    angle: -f.angle,
    ball: { x: 100 - f.ball.x, y: f.ball.y, rot: -f.ball.rot },
    sq: { ...f.sq, x: 100 - f.sq.x, rot: -f.sq.rot },
    dust: f.dust && { ...f.dust, x: 100 - f.dust.x },
  };
}

// Dust puffs: direction (x, y) each one drifts while fading out
const PUFFS = [
  [-9, -3],
  [-6, -7],
  [7, -6],
  [10, -2],
];

const initial = frameAt(0);

export default function Seesaw({ className = "" }: { className?: string }) {
  const plank = useRef<SVGGElement>(null);
  const ball = useRef<SVGGElement>(null);
  const square = useRef<SVGGElement>(null);
  const puffs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    function draw(time: number) {
      const f = frameAt(time);
      plank.current?.setAttribute("transform", `rotate(${f.angle} ${PIVOT.x} ${PIVOT.y})`);
      ball.current?.setAttribute("transform", `translate(${f.ball.x} ${f.ball.y}) rotate(${f.ball.rot})`);
      // Squash from the square's bottom edge, in its own (rotated) frame
      square.current?.setAttribute(
        "transform",
        `translate(${f.sq.x} ${f.sq.y}) rotate(${f.sq.rot}) translate(0 ${((1 - f.sq.sy) * SQ) / 2}) scale(${f.sq.sx} ${f.sq.sy})`,
      );
      puffs.current.forEach((el, i) => {
        if (!el) return;
        if (!f.dust) {
          el.setAttribute("opacity", "0");
          return;
        }
        const e = ease.outQuad(f.dust.f);
        el.setAttribute("cx", String(f.dust.x + PUFFS[i][0] * e));
        el.setAttribute("cy", String(f.dust.y + PUFFS[i][1] * e));
        el.setAttribute("r", String(0.6 + 1.6 * (1 - f.dust.f)));
        el.setAttribute("opacity", String(1 - f.dust.f));
      });
    }

    // Reduced motion: a still frame with everything at rest.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(HALF - 0.1);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      draw((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <g fill="currentColor">
        {/* Fulcrum */}
        <path d={`M${PIVOT.x} ${PIVOT.y} L${PIVOT.x + 7} ${PIVOT.y + 12} L${PIVOT.x - 7} ${PIVOT.y + 12} Z`} />
        <rect x={PIVOT.x - 16} y={PIVOT.y + 12} width={32} height={1.6} />
        <g ref={plank} transform={`rotate(${initial.angle} ${PIVOT.x} ${PIVOT.y})`}>
          <rect x={PIVOT.x - 38} y={PIVOT.y - PLANK_T} width={76} height={PLANK_T} />
        </g>
        {PUFFS.map((_, i) => (
          <circle key={i} ref={(el) => void (puffs.current[i] = el)} r={0} opacity={0} />
        ))}
        <g ref={ball} transform={`translate(${initial.ball.x} ${initial.ball.y})`}>
          <circle r={BALL_R} />
          {/* Small notch so the rolling is visible */}
          <rect x={-0.6} y={-BALL_R + 0.8} width={1.2} height={2} fill="#fff" />
        </g>
        <g ref={square} transform={`translate(${initial.sq.x} ${initial.sq.y}) rotate(${initial.sq.rot})`}>
          <rect x={-SQ / 2} y={-SQ / 2} width={SQ} height={SQ} />
        </g>
      </g>
    </svg>
  );
}
