"use client";

import { useRef } from "react";
import useHeroAurora from "./use-hero-aurora";

/** The hero's shader canvas — all of the effect lives in `useHeroAurora`. */
export default function HeroAurora() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useHeroAurora(canvasRef);

  return <canvas ref={canvasRef} className="hero__aurora" aria-hidden="true" />;
}
