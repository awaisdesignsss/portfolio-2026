import { useEffect, useRef, useState } from "react";
import {
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { TWorkMode } from "./work.interface";

/** Below this the 3D scrub collapses to a plain crossfade. */
const MOBILE_QUERY = "(max-width: 768px)";

/**
 * Scroll plumbing for the pinned Work scrub.
 *
 * progress replicates the old handler exactly: -top / (H - vh), clamped —
 * 0 when the section pins to the viewport top, 1 when its bottom meets
 * the viewport bottom. `pos` re-maps that to card units (0..count-1).
 *
 * Deliberately NOT useScroll({ target }): framer caches the target's page
 * offset and this page shifts layout after mount (svh-sized pinned
 * sections, image loads, Lenis), which left the cache stale on cold
 * loads — the scrub lagged the real scroll by hundreds of px. Live rect
 * reads per scroll frame (what the old rAF handler did) are immune,
 * while updates still ride framer's frame-batched scroll value.
 */
export function useWork(count: number) {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollY } = useScroll();
  const progress = useMotionValue(0);

  useMotionValueEvent(scrollY, "change", () => {
    progress.set(computeProgress(sectionRef.current));
  });

  // Initial position + resize re-evaluate immediately (the original also
  // re-applied on resize and load).
  useEffect(() => {
    const measure = () => progress.set(computeProgress(sectionRef.current));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [progress]);

  const pos = useTransform(progress, (p) => p * (count - 1));

  // Track the breakpoint in state so a resize across 768px re-renders
  // the cards into the right mode (the old code listened for the same
  // media-query change and reset every layer).
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const reduceMotion = useReducedMotion();
  const mode: TWorkMode = isMobile || reduceMotion ? "flat" : "full";

  return { sectionRef, scrollYProgress: progress, pos, mode };
}

function computeProgress(section: HTMLElement | null): number {
  if (!section) return 0;
  const total = section.offsetHeight - window.innerHeight;
  if (total <= 0) return 0;
  return Math.min(1, Math.max(0, -section.getBoundingClientRect().top / total));
}
