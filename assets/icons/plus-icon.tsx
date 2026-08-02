import type { SVGProps } from "react";

interface IPlusIconProps extends SVGProps<SVGSVGElement> {
  /** Square edge in px — the original marks ship at 12 (eyebrows), 13 (footer grid) and 14 (service rows). */
  size?: number;
}

/** Crosshair "plus" mark used by section eyebrows, service rows and the footer grid. */
export default function PlusIcon({ size = 12, strokeWidth = 1.4, ...props }: IPlusIconProps) {
  const half = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" {...props}>
      <path d={`M${half} 0v${size}M0 ${half}h${size}`} stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}
