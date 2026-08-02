"use client";

import { Fragment } from "react";
import { motion, useReducedMotion, useTransform, type MotionStyle } from "framer-motion";
import { WORD_LEAD } from "./word-reveal.data";
import { getWordIntensity, getWordPose, toWordTokens } from "./word-reveal.utils";
import type { IRevealWordProps, IWordRevealProps } from "./word-reveal.interface";

/**
 * Word-by-word scroll choreography.
 *
 * The scrolled counterpart to WordFx: same per-word pose (lift, rotation,
 * scale and the amber wash), but the cursor is replaced by a playhead that
 * scroll position drives through the sentence. Word one strikes its pose and
 * relaxes as word two takes over, and so on — scrub back up and the wave
 * runs in reverse, because every value is a pure function of `progress`
 * rather than a timed animation.
 *
 * The colour lives in styles.css (`.word-reveal__word`); this only drives
 * `--wfx`, so the palette stays with the design tokens.
 */
export default function WordReveal({
  text,
  as: Tag = "p",
  className,
  progress,
}: IWordRevealProps) {
  const reduceMotion = useReducedMotion();
  const lines = Array.isArray(text) ? text : [text];

  // Count the words up front so the playhead can be scaled to the sentence
  // before any of them render.
  const wordCount = lines.reduce(
    (total, line) => total + toWordTokens(line).filter((token) => !token.isSpace).length,
    0
  );

  // Map 0→1 onto -LEAD → wordCount-1+LEAD, so the wave sweeps in from before
  // the first word and off past the last.
  const playhead = useTransform(
    progress,
    (value) => value * (wordCount - 1 + WORD_LEAD * 2) - WORD_LEAD
  );

  if (reduceMotion) {
    return <Tag className={className}>{lines.join(" ")}</Tag>;
  }

  let word = 0;

  return (
    <Tag className={className}>
      {lines.map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {lineIndex > 0 && <br />}
          {toWordTokens(line).map((token, tokenIndex) => {
            if (token.isSpace) return <Fragment key={tokenIndex}>{token.value}</Fragment>;
            const index = word++;
            return (
              <RevealWord
                key={tokenIndex}
                value={token.value}
                index={index}
                playhead={playhead}
                pose={getWordPose(index)}
              />
            );
          })}
        </Fragment>
      ))}
    </Tag>
  );
}

/**
 * One word. Its own component so each can hold the hooks deriving its pose
 * from the shared playhead — scroll then writes straight to the DOM without
 * re-rendering the sentence.
 */
function RevealWord({ value, index, playhead, pose }: IRevealWordProps) {
  const intensity = useTransform(playhead, (p) => getWordIntensity(p, index));
  const y = useTransform(intensity, (v) => `${(v * pose.lift).toFixed(4)}em`);
  const rotate = useTransform(intensity, (v) => v * pose.rotation);
  const scale = useTransform(intensity, (v) => 1 + v * (pose.scale - 1));

  return (
    <motion.span
      className="word-reveal__word"
      style={{ y, rotate, scale, "--wfx": intensity } as MotionStyle}
    >
      {value}
    </motion.span>
  );
}
