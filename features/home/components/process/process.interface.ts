import type { MotionValue } from "framer-motion";

export interface IProcessStep {
  /** Big overlay word on the image slide (Discover / Define / Design / Deliver). */
  title: string;
  /** Full-bleed stage photo shown in the left slideshow window. */
  image: string;
  alt: string;
  /** "01 / 04"-style position readout in the panel header. */
  counter: string;
  /** Panel paragraph — revealed word-by-word as this stage is scrolled through. */
  description: string;
}

/** The slice of the section scrub during which a panel is the one on screen. */
export interface IPanelWindow {
  start: number;
  end: number;
}

export interface IProcessPanelProps {
  step: IProcessStep;
  index: number;
  total: number;
  isActive: boolean;
  /** Section scrub, 0→1 across the whole pinned runway. */
  progress: MotionValue<number>;
}
