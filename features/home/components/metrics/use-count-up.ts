import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/** Same curve as the old rAF counter: cubic ease-out, 1 - (1 - t)^3. */
const COUNT_EASE = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counts 0 → value over 1.5s the first time the number scrolls into view
 * (same -15% bottom margin as the old IntersectionObserver). The display
 * starts at the target so server HTML, no-JS, and reduced motion all show
 * the real number — the flip to 0 only happens once the count begins.
 */
export function useCountUp(value: number) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, value, {
      duration: 1.5,
      ease: COUNT_EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
      // Land exactly on the target — mirrors the old code restoring the raw text.
      onComplete: () => setDisplay(value),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  return { ref, display };
}
