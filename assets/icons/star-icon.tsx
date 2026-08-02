import type { SVGProps } from "react";

/** 13×13 four-point star (logo-wall label). */
export default function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6.5 0L7.91 4.59L12.5 6L7.91 7.41L6.5 12L5.09 7.41L0.5 6L5.09 4.59L6.5 0Z" fill="currentColor" />
    </svg>
  );
}
