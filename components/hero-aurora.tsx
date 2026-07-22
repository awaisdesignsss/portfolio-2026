"use client";

import React from "react";

/**
 * Hero heat-haze aurora — a WebGL fragment shader that renders slow, warm
 * ember plumes in the ambient space around the portrait. It lives inside
 * `.hero__fx` (screen-blended + radially masked off the subject in
 * styles.css), so it reads as living atmosphere between the photo and the
 * dark background, never crossing the face.
 *
 * Domain-warped fractal noise gives the plumes their organic drift; the
 * field warps gently toward the cursor. Progressive enhancement:
 *   - no WebGL           → a static CSS gradient (`.hero__fx--fallback`)
 *   - prefers-reduced-motion → one still frame, no animation loop
 * The loop pauses when the hero scrolls out of view or the tab is hidden.
 */
const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y) * 2.1;

  float t = uTime * 0.06;
  vec2 drift = vec2(0.0, t * 1.5);          // heat rising
  vec2 mo = uMouse * vec2(0.32, 0.22);

  // Two-stage domain warp for organic, non-repeating plumes.
  vec2 q = vec2(
    fbm(p + drift + mo),
    fbm(p + vec2(5.2, 1.3) + drift * 1.2)
  );
  vec2 r = vec2(
    fbm(p + 1.8 * q + vec2(1.7, 9.2) + 0.15 * t),
    fbm(p + 1.8 * q + vec2(8.3, 2.8) - 0.12 * t)
  );
  float n = fbm(p + 1.9 * r);

  // Shape the noise into soft plumes.
  float plume = smoothstep(0.24, 0.92, n);

  // Slightly stronger low, gentle fade toward the very top — heat that rises.
  float vfall = mix(0.55, 1.0, smoothstep(1.0, 0.1, uv.y));
  float intensity = plume * vfall * 0.9;

  // Warm ember → amber → hot core ramp.
  vec3 ember = vec3(0.40, 0.11, 0.02);
  vec3 amber = vec3(0.97, 0.70, 0.40);
  vec3 hot   = vec3(1.00, 0.86, 0.62);
  vec3 col = mix(ember, amber, smoothstep(0.15, 0.7, n));
  col = mix(col, hot, smoothstep(0.72, 1.0, n) * 0.6);

  // Opaque black base; the element screen-blends, so black adds nothing and
  // only the bright plumes glow through around the subject.
  gl_FragColor = vec4(col * intensity, 1.0);
}`;

export default function HeroAurora() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      host.classList.add("hero__fx--fallback"); // static gradient fallback
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      host.classList.add("hero__fx--fallback");
      return;
    }
    gl.useProgram(prog);

    // Fullscreen triangle.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // Cursor warp — eased for a slow, liquid response.
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const onMove = (e: PointerEvent) => {
      tmx = (e.clientX / window.innerWidth) * 2 - 1;
      tmy = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let running = false;
    let visible = true;
    const start = performance.now();

    const draw = (tSec: number) => {
      mx += (tmx - mx) * 0.04;
      my += (tmy - my) * 0.04;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, tSec);
      gl.uniform2f(uMouse, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = () => {
      if (!running) return;
      draw((performance.now() - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (running || reduce || !visible || document.hidden) return;
      running = true;
      loop();
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        visible ? play() : pause();
      },
      { threshold: 0 }
    );
    io.observe(host);

    const onVis = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVis);

    // First paint (also the still frame for reduced motion), then reveal.
    draw(reduce ? 8 : 0);
    canvas.classList.add("is-ready");
    if (!reduce) play();

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero__aurora" aria-hidden="true" />;
}
