import type { IWorkProject } from "./work.interface";

/* ── Cinematic scrub tuning — same numbers as the original inline script ── */

/** deg — incoming frame tilts back on X while it rises out of the letterbox. */
export const ROT = 7;
/** px — how deep a frame sits in Z at the extremes of its travel. */
export const DEPTH = 160;
/** Ken Burns overscale on the incoming media layer (settles to 1). */
export const KEN = 0.12;
/** Scale the outgoing frame shrinks toward as the next card covers it. */
export const PASS_SCALE = 0.9;
/** px — max blur on the outgoing media. */
export const PASS_BLUR = 9;

/* ── Copy ── */

export const WORK_EYEBROW = "Highlighted Work";

export const WORK_VIEW_ALL = { href: "/work", label: "View all work" };

export const WORK_PROJECTS: IWorkProject[] = [
  {
    href: "/work/currency-gram",
    ariaLabel: "View Currency Gram case study",
    niche: "Fintech",
    name: "Currency Gram",
    image: "/assets/images/work/work-01.jpg",
    stats: [
      { num: "-38%", label: "Faster transfers" },
      { num: "+41", label: "NPS gain" },
    ],
  },
  {
    href: "/work/asap",
    ariaLabel: "View ASAP case study",
    niche: "E-commerce",
    name: "ASAP",
    image: "/assets/images/work/work-02.jpg",
    stats: [
      { num: "62% less", label: "Infra cost" },
      { num: "658 → 1", label: "Sites unified" },
    ],
  },
  {
    href: "/work/ai-native-scheduler",
    ariaLabel: "View Worky - AI Native Scheduler case study",
    niche: "AI & Workforce",
    name: "Worky - AI Native Scheduler",
    image: "/assets/images/work/work-07.jpg",
    stats: [
      { num: "90% less", label: "Time to schedule" },
      { num: "5", label: "Jobs automated" },
    ],
  },
  {
    href: "/work/azaq",
    ariaLabel: "View AZAQ - Relia case study",
    niche: "Enterprise",
    name: "AZAQ - Relia",
    image: "/assets/images/work/work-03.jpg",
    stats: [
      { num: "4-stage", label: "Approval chain" },
      { num: "0", label: "Hand-offs left" },
    ],
  },
  {
    href: "/work/workeasy",
    ariaLabel: "View WorkEasy case study",
    niche: "Workforce",
    name: "WorkEasy",
    image: "/assets/images/work/work-04.jpg",
    stats: [
      { num: "4", label: "Modules rebuilt" },
      { num: "1 tap", label: "To clock in" },
    ],
  },
  {
    href: "/work/azoria",
    ariaLabel: "View Azoria case study",
    niche: "Hospitality",
    name: "Azoria",
    image: "/assets/images/work/work-05.jpg",
    stats: [
      { num: "4-in-1", label: "Super app" },
      { num: "1", label: "Admin panel" },
    ],
  },
  {
    href: "/work/phlex65",
    ariaLabel: "View Phlex65 case study",
    niche: "Healthcare",
    name: "Phlex65",
    image: "/assets/images/work/work-06.jpg",
    stats: [
      { num: "1 → many", label: "Multi-tenant SaaS" },
      { num: "2", label: "Apps shipped" },
    ],
  },
];
