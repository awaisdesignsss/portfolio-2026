"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  animate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type AnimationPlaybackControls,
} from "framer-motion";
import { EASE_OUT_QUART } from "@/lib/motion";
import { clampPull } from "./hero.utils";
import type { IMagnetic } from "./hero.interface";

/**
 * Magnetic pull for the hero's primary actions — the element leans a few
 * pixels toward the cursor while hovered and settles back on leave.
 * Pointer-only + motion-safe: inert on touch devices (`hover: hover`)
 * and under prefers-reduced-motion, like the original.
 */
export default function useMagnetic(): IMagnetic {
  const reduceMotion = useReducedMotion();

  // matchMedia is browser-only; resolve after mount so SSR renders clean.
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Stiff spring ≈ the original 60ms linear follow: tight enough to track
  // the cursor, soft enough to round off the per-event steps.
  const x = useSpring(rawX, { stiffness: 600, damping: 40, mass: 0.1 });
  const y = useSpring(rawY, { stiffness: 600, damping: 40, mass: 0.1 });

  // The leave tween must yield the instant the pointer re-enters.
  const settle = useRef<AnimationPlaybackControls[]>([]);
  const stopSettle = () => {
    settle.current.forEach((a) => a.stop());
    settle.current = [];
  };

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (reduceMotion || !canHover) return;
      stopSettle();
      const r = e.currentTarget.getBoundingClientRect();
      rawX.set(clampPull(e.clientX - (r.left + r.width / 2)));
      rawY.set(clampPull(e.clientY - (r.top + r.height / 2)));
    },
    [reduceMotion, canHover, rawX, rawY]
  );

  const onPointerLeave = useCallback(() => {
    if (reduceMotion || !canHover) return;
    stopSettle();
    // The original returned over 500ms on --ease-out-quart. Tweening the
    // spring source reproduces that: the stiff spring tracks the tween.
    settle.current = [
      animate(rawX, 0, { duration: 0.5, ease: EASE_OUT_QUART }),
      animate(rawY, 0, { duration: 0.5, ease: EASE_OUT_QUART }),
    ];
  }, [reduceMotion, canHover, rawX, rawY]);

  return { x, y, onPointerMove, onPointerLeave };
}
