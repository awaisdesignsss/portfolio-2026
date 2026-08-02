"use client";

import type { CSSProperties } from "react";
import { motion, useTransform } from "framer-motion";
import Reveal from "@/components/reveal";
import { ArrowUpRightIcon, PlusIcon } from "@/assets/icons";
import { useWork } from "./use-work";
import { WORK_EYEBROW, WORK_PROJECTS, WORK_VIEW_ALL } from "./work.data";
import {
  flatOpacity,
  flatZIndex,
  frameClipPath,
  frameOpacity,
  frameTransform,
  frameZIndex,
  mediaFilter,
  mediaTransform,
  nameTransform,
  nicheTransform,
  statTransform,
} from "./work.utils";
import type { IWorkCardProps } from "./work.interface";

/**
 * Featured Work — a pinned stage where each project letterboxes open in
 * 3D as you scroll, then blurs and recedes behind the next. All movement
 * is derived from one scroll MotionValue; on mobile or reduced motion it
 * degrades to a simple crossfade ("flat" mode).
 */
export default function Work() {
  const total = WORK_PROJECTS.length;
  const { sectionRef, scrollYProgress, pos, mode } = useWork(total);

  // HUD counter tracks the nearest card, 01-based and zero-padded.
  const current = useTransform(pos, (p) => String(Math.round(p) + 1).padStart(2, "0"));

  return (
    <section
      ref={sectionRef}
      className="work section--dark"
      id="work"
      // Derived, not hardcoded — the CSS scroll runway is
      // calc(100vh + (count - 1) * 85vh), so it must match the data.
      style={{ "--work-count": total } as CSSProperties}
    >
      <div className="work__pin">
        <Reveal className="work__header" variant="rise" delay={0}>
          <span className="work__eyebrow">
            <PlusIcon size={12} aria-hidden="true" />
            {WORK_EYEBROW}
          </span>
          <a href={WORK_VIEW_ALL.href} className="work__viewall">
            <ArrowUpRightIcon aria-hidden="true" />
            {WORK_VIEW_ALL.label}
          </a>
        </Reveal>

        <div className="work__stage">
          {WORK_PROJECTS.map((project, i) => (
            // Keyed on mode so a runtime flip (resize / reduced-motion
            // toggle) remounts with clean inline styles — the old code's
            // reset() did the same scrub-style purge.
            <WorkCard
              key={`${mode}-${project.href}`}
              project={project}
              index={i}
              pos={pos}
              mode={mode}
              total={total}
            />
          ))}

          <div className="work__hud" aria-hidden="true">
            <span className="work__count">
              <motion.span className="work__count-cur">{current}</motion.span>
              <span className="work__count-sep">/</span>
              <span className="work__count-tot">{String(total).padStart(2, "0")}</span>
            </span>
            <span className="work__rail">
              {/* transform-origin: left center comes from styles.css */}
              <motion.span className="work__rail-fill" style={{ scaleX: scrollYProgress }} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * One project layer. Every animated property is its own string
 * MotionValue derived from `pos`, so scroll writes go straight to the
 * DOM without re-rendering React. In flat mode only opacity/zIndex are
 * bound — no transform/clip/filter is ever written.
 */
function WorkCard({ project, index, pos, mode, total }: IWorkCardProps) {
  const flat = mode === "flat";

  const zIndex = useTransform(pos, (p) =>
    flat ? flatZIndex(p, index) : frameZIndex(p - index, total)
  );
  const opacity = useTransform(pos, (p) =>
    flat ? flatOpacity(p, index) : frameOpacity(p - index)
  );
  const clip = useTransform(pos, (p) => frameClipPath(p - index));
  const frameFx = useTransform(pos, (p) => frameTransform(p - index));
  const mediaFx = useTransform(pos, (p) => mediaTransform(p - index));
  const mediaFilterFx = useTransform(pos, (p) => mediaFilter(p - index));
  const nicheFx = useTransform(pos, (p) => nicheTransform(p - index));
  const nameFx = useTransform(pos, (p) => nameTransform(p - index));
  const statFx0 = useTransform(pos, (p) => statTransform(p - index, 0));
  const statFx1 = useTransform(pos, (p) => statTransform(p - index, 1));
  const statFxs = [statFx0, statFx1];

  return (
    <motion.article
      className="work__project"
      style={
        flat
          ? { zIndex, opacity }
          : { zIndex, opacity, clipPath: clip, transform: frameFx }
      }
    >
      <div className="work__cover">
        <motion.div
          className="work__media"
          style={
            flat
              ? { backgroundImage: `url(${project.image})` }
              : {
                  backgroundImage: `url(${project.image})`,
                  transform: mediaFx,
                  filter: mediaFilterFx,
                }
          }
        ></motion.div>
        <div className="work__scrim"></div>
        <a className="work__cardlink" href={project.href} aria-label={project.ariaLabel}></a>
        <div className="work__caption">
          <div className="work__line">
            <motion.span
              className="work__niche"
              style={flat ? undefined : { transform: nicheFx }}
            >
              {project.niche}
            </motion.span>
          </div>
          <div className="work__line">
            <motion.h3 className="work__name" style={flat ? undefined : { transform: nameFx }}>
              {project.name}
            </motion.h3>
          </div>
        </div>
        <div className="work__stats" aria-hidden="true">
          {project.stats.map((stat, si) => (
            <div className="work__line" key={stat.label}>
              <motion.p
                className="work__stat"
                style={flat ? undefined : { transform: statFxs[si] }}
              >
                <span className="work__stat-num">{stat.num}</span>
                <span className="work__stat-label">{stat.label}</span>
              </motion.p>
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
