import type { MotionValue } from "framer-motion";
import type { ElementType } from "react";

export interface IWordRevealProps {
  /** Plain text. Pass an array to insert a `<br />` between lines. */
  text: string | string[];
  /** Rendered tag (defaults to `p`). */
  as?: ElementType;
  className?: string;
  /**
   * 0→1 scroll position across this block's own slice of the page. The wave
   * is a direct function of it, so scrubbing back up runs the words in
   * reverse.
   */
  progress: MotionValue<number>;
}

export interface IWordToken {
  /** The word itself, or a run of whitespace to emit verbatim. */
  value: string;
  isSpace: boolean;
}

export interface IWordPose {
  /** Degrees the word rotates by at full strength. */
  rotation: number;
  /** Scale the word reaches at full strength. */
  scale: number;
  /** Upward travel at full strength, in em (negative = up). */
  lift: number;
}

export interface IRevealWordProps {
  value: string;
  /** This word's position in the sentence, matched against the playhead. */
  index: number;
  /** Playhead in word units, driven by scroll. */
  playhead: MotionValue<number>;
  pose: IWordPose;
}
