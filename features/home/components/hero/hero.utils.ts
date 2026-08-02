/** Magnetic-pull tuning from the original effect: 0.3 strength, ±10px travel. */
const STRENGTH = 0.3;
const MAX = 10;

/** Scale a cursor offset toward the element center and clamp the travel. */
export const clampPull = (v: number) =>
  Math.max(-MAX, Math.min(MAX, v * STRENGTH));
