"use client";

import { motion, useTransform, type MotionStyle } from "framer-motion";
import Reveal from "@/components/reveal";
import WordReveal from "@/components/word-reveal";
import { ArrowRightIcon } from "@/assets/icons";
import {
  PROCESS_CTA_HREF,
  PROCESS_CTA_LABEL,
  PROCESS_DOT_COUNT,
  PROCESS_STEPS,
  PROCESS_TAG,
} from "./process.data";
import { getPanelWindow, toPanelProgress } from "./process.utils";
import { useProcess } from "./use-process";
import type { IProcessPanelProps } from "./process.interface";

/**
 * Design Process — pinned slideshow card. The section owns --p (0→1 scroll
 * progress): styles.css slides the image track with it while the text panels
 * crossfade via .is-active. Both are fed from the same progress value so the
 * two tracks can never drift apart.
 */
export default function Process() {
  const { sectionRef, progress, activeIndex } = useProcess();
  const total = PROCESS_STEPS.length;

  return (
    <motion.section
      ref={sectionRef}
      className="process section--light"
      id="about"
      style={{ "--p": progress } as MotionStyle}
    >
      <div className="process__pin">
        <Reveal variant="fade" className="process__card">
          <div className="process__visual">
            <div className="process__visual-track">
              {PROCESS_STEPS.map((step) => (
                <div className="process__slide" key={step.title}>
                  <img className="process__photo" src={step.image} alt={step.alt} />
                  <div className="process__overlay">
                    <h3 className="process__overlay-title">{step.title}</h3>
                    <div className="process__dots" aria-hidden="true">
                      {Array.from({ length: PROCESS_DOT_COUNT }, (_, d) => (
                        <span key={d}></span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="process__body">
            <div className="process__body-track">
              {PROCESS_STEPS.map((step, i) => (
                <ProcessPanel
                  key={step.title}
                  step={step}
                  index={i}
                  total={total}
                  isActive={i === activeIndex}
                  progress={progress}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </motion.section>
  );
}

/**
 * One stage's copy. Owns the hook that narrows the section scrub down to this
 * panel's own 0→1 window, which is what walks the word highlight through the
 * paragraph as the stage is scrolled past.
 */
function ProcessPanel({ step, index, total, isActive, progress }: IProcessPanelProps) {
  const panelWindow = getPanelWindow(index, total);
  const panelProgress = useTransform(progress, (p) =>
    toPanelProgress(p * (total - 1), panelWindow)
  );

  return (
    <div className={isActive ? "process__panel is-active" : "process__panel"}>
      <div className="process__top">
        <span className="process__tag">{PROCESS_TAG}</span>
        <span className="process__counter">{step.counter}</span>
      </div>
      <WordReveal
        as="p"
        className="process__desc"
        text={step.description}
        progress={panelProgress}
      />
      <div className="process__cta">
        <a href={PROCESS_CTA_HREF} className="process__cta-btn">
          {PROCESS_CTA_LABEL}
        </a>
        <a
          href={PROCESS_CTA_HREF}
          className="process__cta-icon"
          aria-label={PROCESS_CTA_LABEL}
        >
          <ArrowRightIcon />
        </a>
      </div>
    </div>
  );
}
