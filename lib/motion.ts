import type { Variants } from "framer-motion";

/**
 * Shared framer-motion timing tokens.
 *
 * The easings and durations mirror the old scroll-entrance CSS
 * (`.enter` / `.enter--fade` in styles.css) so the refactor doesn't
 * change how the site feels: elements rise 64px (or slide 80px from a
 * side) and settle on the same exponential ease-out.
 */

/** styles.css `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** styles.css `--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1)` */
export const EASE_OUT_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1];

/** Matches the old IntersectionObserver rootMargin ("0px 0px -8% 0px"). */
export const VIEWPORT_ONCE = { once: true, margin: "0px 0px -8% 0px" } as const;

/** Opacity 745ms + transform 935ms, both on EASE_OUT — same as `.enter.is-in`. */
const riseTransition = (delay: number) => ({
  opacity: { duration: 0.745, ease: EASE_OUT, delay },
  x: { duration: 0.935, ease: EASE_OUT, delay },
  y: { duration: 0.935, ease: EASE_OUT, delay },
});

/** Rise + fade (`.enter`). `custom` is the per-element stagger delay in seconds. */
export const RISE_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 64 },
  visible: (delay: number = 0) => ({ opacity: 1, y: 0, transition: riseTransition(delay) }),
};

/** Slide in from the left (`.enter--left`). */
export const RISE_LEFT_VARIANTS: Variants = {
  hidden: { opacity: 0, x: -80 },
  visible: (delay: number = 0) => ({ opacity: 1, x: 0, transition: riseTransition(delay) }),
};

/** Slide in from the right (`.enter--right`). */
export const RISE_RIGHT_VARIANTS: Variants = {
  hidden: { opacity: 0, x: 80 },
  visible: (delay: number = 0) => ({ opacity: 1, x: 0, transition: riseTransition(delay) }),
};

/** Fade only (`.enter--fade`) — for elements whose transform belongs to another effect. */
export const FADE_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.865, ease: EASE_OUT, delay },
  }),
};
