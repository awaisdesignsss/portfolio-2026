import type { SVGProps } from "react";

/** Tiny 9×9 outbound-link arrow (footer contact links, logo-wall header). */
export default function LinkArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1 8L8 1M8 1H2M8 1V7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
