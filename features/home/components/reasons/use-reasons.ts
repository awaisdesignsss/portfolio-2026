import { useCallback, useEffect, useRef, useState } from "react";
import { motionValue, useMotionValueEvent, useScroll, type MotionValue } from "framer-motion";
import { REASONS } from "./reasons.data";

/**
 * Stacking-cards counter for the "Why work with me" section.
 *
 * Each `.reasons__card-wrap` is sticky with a per-index top offset (CSS,
 * indexed via `--i`), and `.reasons__card` shrinks via
 * `scale(calc(1 - var(--stacked) * 0.03))` with its own transition — so the
 * only job here is writing `--stacked` (how many LATER cards have already
 * stuck) into one MotionValue per card. Reading rects inside the scroll
 * event is the sanctioned escape hatch; the write path stays a MotionValue
 * bound as style={{ "--stacked": mv }}. Runs regardless of reduced motion,
 * like the original — the value is stacking state, not an animation.
 */
export function useReasons() {
  const wrapsRef = useRef<Array<HTMLDivElement | null>>([]);
  const stickyTopsRef = useRef<number[]>([]);
  // One MotionValue per card, created once from a fixed-size data array —
  // a single useState initializer so no hooks run in a loop.
  const [stacked] = useState<Array<MotionValue<number>>>(() =>
    REASONS.map(() => motionValue(0))
  );
  const { scrollY } = useScroll();

  // The sticky offsets come from CSS (`top: calc(...)`) and only move on
  // resize — cache them instead of re-resolving computed style per frame.
  const measure = useCallback(() => {
    stickyTopsRef.current = wrapsRef.current.map((wrap) =>
      wrap ? parseFloat(getComputedStyle(wrap).top) || 0 : 0
    );
  }, []);

  const apply = useCallback(() => {
    const wraps = wrapsRef.current;
    const tops = stickyTopsRef.current;
    for (let i = 0; i < stacked.length; i++) {
      let behind = 0;
      for (let j = i + 1; j < stacked.length; j++) {
        const wrap = wraps[j];
        // A wrap is "stuck" once it has pinned to its sticky top (+2px slack).
        if (wrap && wrap.getBoundingClientRect().top <= (tops[j] ?? 0) + 2) behind++;
      }
      stacked[i].set(behind);
    }
  }, [stacked]);

  useMotionValueEvent(scrollY, "change", apply);

  useEffect(() => {
    measure();
    apply();
    const onResize = () => {
      measure();
      apply();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure, apply]);

  const setWrapRef = (index: number) => (el: HTMLDivElement | null) => {
    wrapsRef.current[index] = el;
  };

  return { stacked, setWrapRef };
}
