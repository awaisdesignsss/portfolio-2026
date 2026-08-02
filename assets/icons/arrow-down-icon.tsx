import type { SVGProps } from "react";

/** 14×14 downward stroke arrow (section eyebrow rows). */
export default function ArrowDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <path
        d="M7 2v10M2.5 7.5L7 12l4.5-4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
