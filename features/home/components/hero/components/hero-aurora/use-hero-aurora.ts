import { useEffect, type RefObject } from "react";
import { FRAG, VERT } from "./hero-aurora.data";

/**
 * Hero heat-haze aurora — a WebGL fragment shader that renders slow, warm
 * ember plumes in the ambient space around the portrait. It lives inside
 * `.hero__fx` (screen-blended + radially masked off the subject in
 * styles.css), so it reads as living atmosphere between the photo and the
 * dark background, never crossing the face.
 *
 * A raw rAF shader loop — not DOM animation, so framer-motion does not
 * apply here. Progressive enhancement:
 *   - no WebGL           → a static CSS gradient (`.hero__fx--fallback`)
 *   - prefers-reduced-motion → one still frame, no animation loop
 * The loop pauses when the hero scrolls out of view or the tab is hidden.
 */
export default function useHeroAurora(canvasRef: RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
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
  }, [canvasRef]);
}
