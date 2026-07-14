"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BlockLoaderProps {
  blockColor?: string; // Tailwind bg color class, e.g. "bg-brand"
  borderColor?: string; // Tailwind border color class, e.g. "border-brand"
  size?: number; // block width/height in px
  gap?: number; // gap between blocks in px
  speed?: number; // animation duration in seconds
  className?: string;
}

const BlockLoader: React.FC<BlockLoaderProps> = ({
  blockColor = "bg-blue-600",
  borderColor = "border-blue-600",
  size = 75,
  gap = 4,
  speed = 1,
  className,
}) => {
  const blocks = [0, 1, 2, 3];

  return (
    <div
      // NOTE: color props are passed as complete class strings so Tailwind can
      // see them at build time. Numeric props (size/gap/maxWidth) are applied as
      // inline styles because Tailwind cannot compile interpolated arbitrary
      // values like `gap-[${gap}px]` or `max-w-[${size}px]` at runtime.
      className={cn(
        "flex flex-wrap p-1 border-2 rounded-md justify-center",
        borderColor,
        className
      )}
      style={{ maxWidth: size * 2 + gap * 3, gap: `${gap}px` }}
    >
      {blocks.map((_, i) => (
        <div
          key={i}
          className={cn("rounded-sm mx-1", blockColor)}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            animation: `blockLoading ${speed}s infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes blockLoading {
          0%, 100% { flex: 1; }
          50% { flex: 4; }
        }
      `}</style>
    </div>
  );
};

export default BlockLoader;
