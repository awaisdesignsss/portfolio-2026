"use client";

import { Fragment, useRef, type CSSProperties } from "react";
import { motion, useReducedMotion, type MotionStyle } from "framer-motion";
import Reveal from "@/components/reveal";
import WordFx from "@/components/word-fx";
import { getWordFxStyle } from "@/components/word-fx/word-fx.utils";
import { ArrowDownIcon, ArrowUpRightIcon, PlusIcon } from "@/assets/icons";
import { FADE_VARIANTS, RISE_LEFT_VARIANTS, VIEWPORT_ONCE } from "@/lib/motion";
import { useReasons } from "./use-reasons";
import {
  AVATARS,
  AVATARS_MORE,
  REASONS,
  REASONS_CTA_LABEL,
  REASONS_EYEBROW,
  REASONS_HEADING,
  REASONS_LEAD,
  REASONS_TRUST,
} from "./reasons.data";

/**
 * "Why work with me" — intro column slides in from the left while the five
 * cards fade in, then stick and stack as the page scrolls (each card scales
 * down by how many later cards are already stuck; see use-reasons).
 */
export default function Reasons() {
  const reduceMotion = useReducedMotion();
  const { stacked, setWrapRef } = useReasons();
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  // The heading needs BOTH the rise-left entrance and the per-word hover
  // spans on the SAME <h2> (a wrapper would break the CSS structure), and
  // one element can't be a Reveal and a WordFx at once. So the entrance is
  // composed by hand on motion.h2 and the word spans are rendered inline
  // with the exact markup WordFx emits.
  const clearHeadingStyles = (definition: string) => {
    const el = headingRef.current;
    if (definition !== "visible" || !el) return;
    // Same post-entrance cleanup as Reveal: drop the inline opacity/transform
    // so nothing lingers to fight CSS-driven motion.
    el.style.removeProperty("opacity");
    el.style.removeProperty("transform");
  };

  let word = 0;
  const headingWords = REASONS_HEADING.map((line, lineIndex) => (
    <Fragment key={lineIndex}>
      {lineIndex > 0 && <br />}
      {line.split(/(\s+)/).map((token, tokenIndex) => {
        if (token === "") return null;
        if (/^\s+$/.test(token)) return <Fragment key={tokenIndex}>{token}</Fragment>;
        return (
          <span key={tokenIndex} className="wordfx" style={getWordFxStyle(word++)}>
            {token}
          </span>
        );
      })}
    </Fragment>
  ));

  return (
    <section className="reasons section--dark" id="why">
      <div className="reasons__grid">

        <div className="reasons__intro">
          <Reveal className="reasons__head" variant="rise-left" delay={0}>
            <span className="reasons__eyebrow">
              <PlusIcon size={12} strokeWidth={1.4} width={12} height={12} aria-hidden="true" />
              {REASONS_EYEBROW}
            </span>
            <ArrowDownIcon className="reasons__arrowdown" width={14} height={14} aria-hidden="true" />
          </Reveal>
          {reduceMotion ? (
            <WordFx as="h2" className="reasons__heading" text={REASONS_HEADING} />
          ) : (
            <motion.h2
              ref={headingRef}
              className="reasons__heading"
              variants={RISE_LEFT_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              custom={0}
              onAnimationComplete={clearHeadingStyles}
            >
              {headingWords}
            </motion.h2>
          )}
          <Reveal as="p" className="reasons__lead" variant="rise-left" delay={0}>
            {REASONS_LEAD}
          </Reveal>
          <Reveal className="reasons__cta" variant="rise-left" delay={0}>
            <a href="#contact" className="btn reasons__btn">
              <ArrowUpRightIcon width={14} height={14} strokeWidth={1.5} aria-hidden="true" />
              {REASONS_CTA_LABEL}
            </a>
            <div className="reasons__social">
              <div className="reasons__avatars">
                {AVATARS.map((avatar, i) => (
                  <span key={i} className="reasons__avatar" style={{ background: avatar.background }}></span>
                ))}
                <span className="reasons__avatar reasons__avatar--more">{AVATARS_MORE}</span>
              </div>
              <span className="reasons__trust">{REASONS_TRUST}</span>
            </div>
          </Reveal>
        </div>

        <div className="reasons__cards">
          {REASONS.map((reason, i) => (
            <div
              key={reason.title}
              className="reasons__card-wrap"
              ref={setWrapRef(i)}
              style={{ "--i": String(i) } as CSSProperties}
            >
              {/* Fade-only entrance so it can never fight the CSS --stacked
                  scale transform. The inline opacity is NOT cleared after the
                  entrance (cards have no opacity hover CSS, and the style prop
                  must stay live for the --stacked MotionValue anyway). */}
              <motion.article
                className="reasons__card"
                style={{ "--stacked": stacked[i] } as MotionStyle}
                {...(reduceMotion
                  ? {}
                  : {
                      variants: FADE_VARIANTS,
                      initial: "hidden",
                      whileInView: "visible",
                      viewport: VIEWPORT_ONCE,
                      custom: i * 0.09,
                    })}
              >
                <span className="reasons__icon"><img src={reason.icon} alt="" /></span>
                <div className="reasons__card-body">
                  <WordFx as="h3" className="reasons__card-title" text={reason.title} />
                  <p className="reasons__card-desc">{reason.description}</p>
                </div>
              </motion.article>
            </div>
          ))}

          <div className="reasons__end" aria-hidden="true"></div>
        </div>
      </div>
    </section>
  );
}
