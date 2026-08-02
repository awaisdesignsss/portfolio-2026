"use client";

import { useEffect, useRef, useState } from "react";
import {
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { PROCESS_STEPS } from "./process.data";

/**
 * Pinned-scrub progress for the process slideshow.
 *
 * Progress is the original's formula, computed from a live rect on every
 * scroll frame: -top / (H - vh - 0.55vh) — the slideshow completes 0.55
 * viewport-heights early so the last stage settles before the card unpins.
 *
 * Deliberately NOT useScroll({ target }): framer caches the target's page
 * offset and this page shifts layout after mount (svh-sized pinned
 * sections, image loads, Lenis), which left the cache stale on cold
 * loads. Reading the rect live (like the old rAF handler did) is immune
 * to that, while updates still ride framer's frame-batched scroll value.
 */
export function useProcess() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollY } = useScroll();
  const progress = useMotionValue(0);

  useMotionValueEvent(scrollY, "change", () => {
    progress.set(computeProgress(sectionRef.current, reduceMotion));
  });

  // Initial position + resize re-evaluate immediately, matching the
  // original's mount/resize apply() calls.
  useEffect(() => {
    const measure = () => progress.set(computeProgress(sectionRef.current, reduceMotion));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [progress, reduceMotion]);

  // State (not a MotionValue) drives .is-active so React owns the crossfade class.
  useMotionValueEvent(progress, "change", (v) => {
    setActiveIndex(Math.round(v * (PROCESS_STEPS.length - 1)));
  });

  return { sectionRef, progress, activeIndex };
}

function computeProgress(section: HTMLElement | null, reduceMotion: boolean | null): number {
  // Reduced motion: the original skipped the effect entirely — hold the
  // card on stage one (--p stays 0).
  if (!section || reduceMotion) return 0;
  const vh = window.innerHeight;
  const range = section.offsetHeight - vh - vh * 0.55;
  // Degenerate range (very short section/tall viewport) also pins at 0,
  // matching the original's early return.
  if (range <= 0) return 0;
  return Math.min(1, Math.max(0, -section.getBoundingClientRect().top / range));
}
