import type { MotionValue } from "framer-motion";

export interface IWorkStat {
  num: string;
  label: string;
}

export interface IWorkProject {
  href: string;
  ariaLabel: string;
  niche: string;
  name: string;
  /** Public path of the cover art (painted as a CSS background-image). */
  image: string;
  /** Exactly two results, revealed in order during the incoming scrub. */
  stats: [IWorkStat, IWorkStat];
}

/** "full" = pinned 3D scrub; "flat" = crossfade only (mobile / reduced motion). */
export type TWorkMode = "full" | "flat";

export interface IWorkCardProps {
  project: IWorkProject;
  index: number;
  /** Scrub position in card units: 0..total-1, fractional between cards. */
  pos: MotionValue<number>;
  mode: TWorkMode;
  total: number;
}
