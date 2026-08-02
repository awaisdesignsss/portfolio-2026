"use client";

import { createElement, useRef, type ComponentType, type ElementType, type Ref } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import {
  FADE_VARIANTS,
  RISE_LEFT_VARIANTS,
  RISE_RIGHT_VARIANTS,
  RISE_VARIANTS,
  VIEWPORT_ONCE,
} from "@/lib/motion";
import type { IRevealProps, TRevealVariant } from "./reveal.interface";

/**
 * Scroll-entrance primitive — the framer-motion replacement for the old
 * `.enter` / `.is-in` IntersectionObserver choreography.
 *
 * Renders the given tag itself as a motion element (no wrapper node, so
 * every styles.css selector keeps matching) and animates it into place
 * the first time it scrolls into view. Once the entrance finishes the
 * inline opacity/transform are cleared, mirroring how the old code
 * stripped its classes so entrance styles never linger to fight CSS
 * hover effects (e.g. the logo wall's dim-siblings hover).
 *
 * Reduced motion renders a plain static element — content is simply there.
 */

const VARIANTS: Record<TRevealVariant, typeof RISE_VARIANTS> = {
  rise: RISE_VARIANTS,
  "rise-left": RISE_LEFT_VARIANTS,
  "rise-right": RISE_RIGHT_VARIANTS,
  fade: FADE_VARIANTS,
};

// motion.create() over a generic ElementType loses its prop typing, so the
// cache pins an explicit shape: motion props + ref + arbitrary tag attributes.
type TMotionTag = ComponentType<
  Omit<HTMLMotionProps<"div">, "ref"> & { ref?: Ref<HTMLElement | null> } & Record<string, unknown>
>;

// motion.create() returns a new component per call; cache per tag so
// re-renders don't remount the subtree.
const motionTagCache = new Map<ElementType, TMotionTag>();
const getMotionTag = (tag: ElementType): TMotionTag => {
  let cached = motionTagCache.get(tag);
  if (!cached) {
    cached = motion.create(tag) as unknown as TMotionTag;
    motionTagCache.set(tag, cached);
  }
  return cached;
};

export default function Reveal(props: IRevealProps) {
  const { children, as = "div", variant = "rise", delay = 0, className, style, ...rest } = props;
  const ref = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return createElement(as, { className, style, ...rest }, children);
  }

  const MotionTag = getMotionTag(as);

  const clearEntranceStyles = (definition: unknown) => {
    const el = ref.current;
    if (definition !== "visible" || !el) return;
    el.style.removeProperty("opacity");
    el.style.removeProperty("transform");
  };

  return (
    <MotionTag
      ref={ref}
      className={className}
      style={style}
      variants={VARIANTS[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      custom={delay}
      onAnimationComplete={clearEntranceStyles}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
