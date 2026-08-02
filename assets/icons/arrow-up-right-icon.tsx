import type { SVGProps } from "react";

/** 14×14 diagonal stroke arrow (view-all links, contact buttons). */
export default function ArrowUpRightIcon({ strokeWidth = 1.4, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <path
        d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
