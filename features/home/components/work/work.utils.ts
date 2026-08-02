import { DEPTH, KEN, PASS_BLUR, PASS_SCALE, ROT } from "./work.data";

/**
 * Pure style computations for the Work scrub, transcribed from the old
 * rAF handler. Everything is a function of s = pos - index: negative
 * while the card is incoming, 0 when it owns the stage, positive while
 * it passes behind the next one. The toFixed precisions match the
 * original so the written style strings are identical.
 */

export const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Cubic in-out — the single easing curve the whole scrub runs on. */
export const ease = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* ── Frame (.work__project) ── */

export function frameOpacity(s: number): string {
  if (s <= -1) return "0";
  // Fade in faster than the letterbox opens so the frame never looks washed out.
  if (s < 0) return clamp01(clamp01(s + 1) * 1.6).toFixed(4);
  return "1";
}

export function frameClipPath(s: number): string {
  if (s <= -1) return "inset(50% 0 50% 0 round var(--radius-xl))";
  if (s < 0) {
    const inv = 1 - ease(clamp01(s + 1));
    const inset = (inv * 50).toFixed(3);
    return `inset(${inset}% 0 ${inset}% 0 round var(--radius-xl))`;
  }
  return "inset(0 0 0 0 round var(--radius-xl))";
}

export function frameTransform(s: number): string {
  if (s <= -1) return ""; // fully hidden — no transform, like the old reset
  if (s < 0) {
    const inv = 1 - ease(clamp01(s + 1));
    return (
      `translateZ(${(-inv * DEPTH).toFixed(1)}px) ` +
      `rotateX(${(inv * ROT).toFixed(2)}deg) ` +
      `translateY(${(inv * 4).toFixed(2)}%)`
    );
  }
  const e = ease(clamp01(s));
  return (
    `translateZ(${(-e * DEPTH * 1.3).toFixed(1)}px) ` +
    `translateY(${(-e * 4).toFixed(2)}%) ` +
    `scale(${(1 - e * (1 - PASS_SCALE)).toFixed(4)})`
  );
}

/** Incoming cards stack above the outgoing one; they're transparent until s > -1. */
export function frameZIndex(s: number, total: number): number {
  return Math.round((total - s) * 100);
}

/* ── Media (.work__media) — Ken Burns in, blur/dim out ── */

export function mediaTransform(s: number): string {
  if (s <= -1) return ""; // media reset — bare background, no Ken Burns
  if (s < 0) {
    const inv = 1 - ease(clamp01(s + 1));
    return `scale(${(1 + inv * KEN).toFixed(4)}) translateY(${(inv * -3).toFixed(2)}%)`;
  }
  const e = ease(clamp01(s));
  return `scale(${(1 + e * 0.05).toFixed(4)})`;
}

export function mediaFilter(s: number): string {
  if (s < 0) return ""; // filters only apply on the way out
  const e = ease(clamp01(s));
  return `blur(${(e * PASS_BLUR).toFixed(2)}px) brightness(${(1 - e * 0.5).toFixed(3)})`;
}

/* ── Caption / stat mask reveals — staggered rises out of .work__line ── */

export function nicheTransform(s: number): string {
  if (s >= 0) return "translateY(0%)";
  const r = clamp01(s + 1);
  return `translateY(${((1 - ease(clamp01(r * 1.25))) * 110).toFixed(2)}%)`;
}

export function nameTransform(s: number): string {
  if (s >= 0) return "translateY(0%)";
  const r = clamp01(s + 1);
  return `translateY(${((1 - ease(clamp01(r * 1.25 - 0.18))) * 115).toFixed(2)}%)`;
}

export function statTransform(s: number, statIndex: number): string {
  if (s >= 0) return "translateY(0%)";
  const r = clamp01(s + 1);
  return `translateY(${((1 - ease(clamp01(r * 1.25 - 0.3 - statIndex * 0.09))) * 120).toFixed(2)}%)`;
}

/* ── Flat mode (mobile / reduced motion): plain crossfade ── */

export function flatOpacity(pos: number, index: number): string {
  const d = Math.min(Math.abs(pos - index), 1);
  return (1 - d).toFixed(4);
}

export function flatZIndex(pos: number, index: number): number {
  const d = Math.min(Math.abs(pos - index), 1);
  return Math.round((1 - d) * 100);
}
