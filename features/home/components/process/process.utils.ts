import type { IPanelWindow } from "./process.interface";

/**
 * The stretch of the scrub during which a panel is the visible one.
 *
 * Panels swap at the midpoint between stages (the active index is a rounded
 * position), so a middle panel owns half a stage either side of its own.
 * The first and last panels are clipped by the ends of the runway and get
 * half-windows — worth handling, because their word waves are mapped across
 * whatever window they actually get, rather than starting mid-sweep.
 */
export function getPanelWindow(index: number, total: number): IPanelWindow {
  const last = total - 1;
  return {
    start: Math.max(0, index - 0.5),
    end: Math.min(last, index + 0.5),
  };
}

/** Normalise the scrub position to 0→1 across a panel's own window. */
export function toPanelProgress(position: number, { start, end }: IPanelWindow): number {
  const span = end - start;
  if (span <= 0) return 0;
  return Math.min(1, Math.max(0, (position - start) / span));
}
