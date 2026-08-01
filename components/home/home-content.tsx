"use client";

import React from "react";
import { applyWordfx } from "@/lib/wordfx";
import ClientLogos from "@/components/ui/client-logos";
import HeroAurora from "@/components/hero-aurora";
import Wordmark from "@/components/ui/wordmark";
import NavWhatsapp from "@/components/ui/nav-whatsapp";

/**
 * Homepage content ported from the original static index.html.
 * Markup is faithful JSX; visual design still comes from the shared
 * styles.css (imported globally in app/layout.tsx). The scroll-driven
 * animations (process, work, reasons) and the wordfx word-splitter are
 * ported verbatim into the effect below, with proper listener cleanup.
 */

export default function HomeContent() {

  React.useEffect(() => {
    const cleanups: Array<() => void> = [];
    const addWin = (type: string, handler: EventListener, opts?: AddEventListenerOptions) => {
      window.addEventListener(type, handler, opts);
      cleanups.push(() => window.removeEventListener(type, handler, opts));
    };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Mobile nav toggle ──
    const toggle = document.querySelector<HTMLElement>(".nav__toggle");
    const nav = document.querySelector<HTMLElement>(".nav");
    if (toggle && nav) {
      const onToggle = () => {
        nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(nav.classList.contains("is-open")));
      };
      toggle.addEventListener("click", onToggle);
      cleanups.push(() => toggle.removeEventListener("click", onToggle));
    }

    // ── Process: pinned card, image + content slide in sync on scroll ──
    (() => {
      const section = document.querySelector<HTMLElement>(".process");
      if (!section) return;
      if (reduceMotion) return;
      const panels = Array.from(section.querySelectorAll<HTMLElement>(".process__panel"));
      const last = panels.length - 1;
      let current = panels.findIndex((p) => p.classList.contains("is-active"));
      if (current < 0) current = 0;
      let ticking = false;
      function apply() {
        ticking = false;
        const tail = window.innerHeight * 0.55;
        const range = section!.offsetHeight - window.innerHeight - tail;
        if (range <= 0) { section!.style.setProperty("--p", "0"); return; }
        const p = Math.min(1, Math.max(0, -section!.getBoundingClientRect().top / range));
        section!.style.setProperty("--p", String(p));
        const idx = Math.round(p * last);
        if (idx !== current) {
          if (panels[current]) panels[current].classList.remove("is-active");
          panels[idx].classList.add("is-active");
          current = idx;
        }
      }
      const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
      addWin("scroll", onScroll, { passive: true });
      addWin("resize", apply);
      apply();
    })();

    // ── Featured Work: cinematic scroll-driven transition ──
    (() => {
      const section = document.querySelector<HTMLElement>(".work");
      const projects = Array.from(document.querySelectorAll<HTMLElement>(".work__project"));
      if (!section || !projects.length) return;
      const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)");
      const MOBILE = window.matchMedia("(max-width: 768px)");
      const n = projects.length;
      const layers = projects.map((p) => {
        const media = p.querySelector<HTMLElement>(".work__media");
        return {
          frame: p,
          media,
          bg: (media && media.getAttribute("style")) || "",
          niche: p.querySelector<HTMLElement>(".work__niche"),
          name: p.querySelector<HTMLElement>(".work__name"),
          stats: Array.from(p.querySelectorAll<HTMLElement>(".work__stat")),
        };
      });
      const hudCur = section.querySelector<HTMLElement>(".work__count-cur");
      const hudTot = section.querySelector<HTMLElement>(".work__count-tot");
      const railFill = section.querySelector<HTMLElement>(".work__rail-fill");
      if (hudTot) hudTot.textContent = String(n).padStart(2, "0");
      let hudShown = -1;
      const ROT = 7, DEPTH = 160, KEN = 0.12, PASS_SCALE = 0.9, PASS_BLUR = 9;
      const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      let ticking = false;
      function reset(l: (typeof layers)[number]) {
        l.frame.style.cssText = "";
        l.frame.style.opacity = "";
        if (l.media) l.media.style.cssText = l.bg;
        if (l.niche) l.niche.style.transform = "";
        if (l.name) l.name.style.transform = "";
        l.stats.forEach((st) => { st.style.transform = ""; });
      }
      function apply() {
        ticking = false;
        const total = section!.offsetHeight - window.innerHeight;
        const progress = total > 0 ? clamp01(-section!.getBoundingClientRect().top / total) : 0;
        const pos = progress * (n - 1);
        const cur = Math.round(pos);
        if (cur !== hudShown && hudCur) { hudCur.textContent = String(cur + 1).padStart(2, "0"); hudShown = cur; }
        if (railFill) railFill.style.transform = "scaleX(" + progress.toFixed(4) + ")";
        if (REDUCE.matches || MOBILE.matches) {
          for (let i = 0; i < n; i++) {
            const d = Math.min(Math.abs(pos - i), 1);
            const f = layers[i].frame;
            f.style.transform = "";
            f.style.clipPath = "";
            f.style.opacity = (1 - d).toFixed(4);
            f.style.zIndex = String(Math.round((1 - d) * 100));
          }
          return;
        }
        for (let i = 0; i < n; i++) {
          const l = layers[i];
          const f = l.frame;
          const s = pos - i;
          f.style.zIndex = String(Math.round((n - s) * 100));
          if (s <= -1) {
            f.style.opacity = "0";
            f.style.clipPath = "inset(50% 0 50% 0 round var(--radius-xl))";
            if (l.media) l.media.style.cssText = l.bg;
            continue;
          }
          if (s < 0) {
            const r = clamp01(s + 1);
            const e = ease(r);
            const inv = 1 - e;
            const inset = (inv * 50).toFixed(3);
            f.style.clipPath = "inset(" + inset + "% 0 " + inset + "% 0 round var(--radius-xl))";
            f.style.opacity = clamp01(r * 1.6).toFixed(4);
            f.style.transform =
              "translateZ(" + (-inv * DEPTH).toFixed(1) + "px) " +
              "rotateX(" + (inv * ROT).toFixed(2) + "deg) " +
              "translateY(" + (inv * 4).toFixed(2) + "%)";
            if (l.media) l.media.style.cssText =
              l.bg + ";transform:scale(" + (1 + inv * KEN).toFixed(4) + ") translateY(" + (inv * -3).toFixed(2) + "%)";
            if (l.niche) l.niche.style.transform = "translateY(" + ((1 - ease(clamp01(r * 1.25))) * 110).toFixed(2) + "%)";
            if (l.name) l.name.style.transform = "translateY(" + ((1 - ease(clamp01(r * 1.25 - 0.18))) * 115).toFixed(2) + "%)";
            l.stats.forEach((st, si) => { st.style.transform = "translateY(" + ((1 - ease(clamp01(r * 1.25 - 0.3 - si * 0.09))) * 120).toFixed(2) + "%)"; });
          } else {
            const f2 = clamp01(s);
            const e = ease(f2);
            f.style.clipPath = "inset(0 0 0 0 round var(--radius-xl))";
            f.style.opacity = "1";
            f.style.transform =
              "translateZ(" + (-e * DEPTH * 1.3).toFixed(1) + "px) " +
              "translateY(" + (-e * 4).toFixed(2) + "%) " +
              "scale(" + (1 - e * (1 - PASS_SCALE)).toFixed(4) + ")";
            if (l.media) l.media.style.cssText =
              l.bg + ";transform:scale(" + (1 + e * 0.05).toFixed(4) + ");filter:blur(" + (e * PASS_BLUR).toFixed(2) + "px) brightness(" + (1 - e * 0.5).toFixed(3) + ")";
            if (l.niche) l.niche.style.transform = "translateY(0%)";
            if (l.name) l.name.style.transform = "translateY(0%)";
            l.stats.forEach((st) => { st.style.transform = "translateY(0%)"; });
          }
        }
      }
      const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
      const onModeChange = () => { layers.forEach(reset); apply(); };
      MOBILE.addEventListener("change", onModeChange);
      REDUCE.addEventListener("change", onModeChange);
      cleanups.push(() => MOBILE.removeEventListener("change", onModeChange));
      cleanups.push(() => REDUCE.removeEventListener("change", onModeChange));
      addWin("scroll", onScroll, { passive: true });
      addWin("resize", apply);
      addWin("load", apply);
      apply();
    })();

    // ── Why work with me: stacking cards ──
    (() => {
      const wraps = Array.from(document.querySelectorAll<HTMLElement>(".reasons__card-wrap"));
      if (!wraps.length) return;
      let ticking = false;
      const readTops = () => wraps.map((w) => parseFloat(getComputedStyle(w).top) || 0);
      let stickyTops = readTops();
      function apply() {
        ticking = false;
        for (let i = 0; i < wraps.length; i++) {
          let behind = 0;
          for (let j = i + 1; j < wraps.length; j++) {
            if (wraps[j].getBoundingClientRect().top <= stickyTops[j] + 2) behind++;
          }
          const card = wraps[i].querySelector<HTMLElement>(".reasons__card");
          if (card) card.style.setProperty("--stacked", String(behind));
        }
      }
      const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
      const onResize = () => { stickyTops = readTops(); apply(); };
      addWin("scroll", onScroll, { passive: true });
      addWin("resize", onResize);
      apply();
    })();

    // ── wordfx: per-word hover choreography (process copy + section headings) ──
    applyWordfx();

    // ── Metrics: count up from zero when the number scrolls into view ──
    if (!reduceMotion) {
      const runCount = (el: HTMLElement) => {
        const textNode = Array.from(el.childNodes).find(
          (n) => n.nodeType === Node.TEXT_NODE && /\d/.test(n.textContent || "")
        );
        if (!textNode) return;
        const raw = (textNode.textContent || "").trim();
        const m = raw.match(/^(\d+)(\D*)$/);
        if (!m) return;
        const target = parseInt(m[1], 10);
        const suffix = m[2];
        const dur = 1500;
        const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          textNode.textContent = Math.round(easeOut(p) * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else textNode.textContent = raw;
        };
        textNode.textContent = "0" + suffix;
        requestAnimationFrame(tick);
      };
      const cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) { runCount(e.target as HTMLElement); cio.unobserve(e.target); }
          });
        },
        { rootMargin: "0px 0px -15% 0px" }
      );
      document.querySelectorAll<HTMLElement>(".metrics__number").forEach((n) => cio.observe(n));
      cleanups.push(() => cio.disconnect());
    }

    // ── Magnetic pull on the hero's primary actions ──
    if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
      const strength = 0.3;
      const max = 10;
      const clamp = (v: number) => Math.max(-max, Math.min(max, v * strength));
      document.querySelectorAll<HTMLElement>(".hero__btn, .hero__btn-icon").forEach((el) => {
        const onMove = (ev: PointerEvent) => {
          const r = el.getBoundingClientRect();
          el.style.transition = "transform 60ms linear";
          el.style.transform = `translate(${clamp(ev.clientX - (r.left + r.width / 2))}px, ${clamp(ev.clientY - (r.top + r.height / 2))}px)`;
        };
        const onLeave = () => {
          el.style.transition = "transform 500ms var(--ease-out-quart)";
          el.style.transform = "translate(0px, 0px)";
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          el.style.transform = "";
          el.style.transition = "";
        });
      });
    }

    return () => { cleanups.forEach((fn) => fn()); };
  }, []);

  // ── Section entrance orchestration (isolated) ──
  // Kept in its own effect so a failure anywhere in the main effect can't stop
  // it from running. Each tagged element animates into place the moment it
  // scrolls into view, via IntersectionObserver — no scroll listener, no rAF,
  // and indifferent to which element is the scroll container. Elements are
  // `.enter` (rise + fade) or `.enter--fade` (fade only, for elements whose
  // transform is already driven by another effect); grouped elements carry a
  // per-group `--rd` stagger. Content is visible by default with JS off or
  // reduced motion, so nothing ever ships blank.
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets: HTMLElement[] = [];
    const tag = (
      sectionSel: string,
      specs: Array<{ sel: string; fade?: boolean; dir?: "left" | "right" }>,
      step = 70
    ) => {
      const section = document.querySelector<HTMLElement>(sectionSel);
      if (!section) return;
      specs.forEach(({ sel, fade, dir }) => {
        section.querySelectorAll<HTMLElement>(sel).forEach((el, i) => {
          el.classList.add(fade ? "enter--fade" : "enter");
          if (dir) el.classList.add(dir === "left" ? "enter--left" : "enter--right");
          el.style.setProperty("--rd", i * step + "ms");
          targets.push(el);
        });
      });
    };

    tag(".logos", [{ sel: ".logos__label-wrap" }, { sel: ".logos__card" }], 55);
    tag(".process", [{ sel: ".process__card", fade: true }]);
    // Work is a pinned 3D scrub with its own choreography; only the header
    // gets the scroll-in so we don't fight the cards' per-frame transforms.
    tag(".work", [{ sel: ".work__header" }]);
    tag(".services", [{ sel: ".services__head" }, { sel: ".services__row" }], 70);
    tag(".metrics", [{ sel: ".metrics__item" }], 110);
    // Left column slides in from the left while the reason cards rise/stack.
    tag(".reasons", [
      { sel: ".reasons__head", dir: "left" },
      { sel: ".reasons__heading", dir: "left" },
      { sel: ".reasons__lead", dir: "left" },
      { sel: ".reasons__cta", dir: "left" },
      { sel: ".reasons__card", fade: true },
    ], 90);
    tag(".footer", [
      { sel: ".footer__contact-head" },
      { sel: ".footer__cta-heading" },
      { sel: ".footer__cta-btn" },
      { sel: ".footer__tagline" },
      { sel: ".footer__contacts" },
      { sel: ".footer__links" },
    ], 70);

    const timers: Array<ReturnType<typeof setTimeout>> = [];
    const clearTags = (el: HTMLElement) => {
      el.classList.remove("enter", "enter--fade", "enter--left", "enter--right", "is-in");
      el.style.removeProperty("--rd");
    };

    if (!("IntersectionObserver" in window)) {
      targets.forEach(clearTags);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          el.classList.add("is-in");
          const delay = parseFloat(el.style.getPropertyValue("--rd")) || 0;
          timers.push(setTimeout(() => clearTags(el), delay + 1120));
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <>
      <nav className="nav">
          <div className="nav__logo">
            <Wordmark />
          </div>
          <div className="nav__menu">
            <span className="nav__pill" aria-hidden="true" />
            <a href="/" className="nav__link" aria-current="page">Home</a>
            <a href="/work" className="nav__link">Work</a>
            <a href="/about" className="nav__link">About</a>
            <a href="/contact" className="nav__link">Contact</a>
          </div>
          <div className="nav__actions">
            <NavWhatsapp />
            <a href="mailto:awais.designsss@gmail.com" className="nav__cta">Email me</a>
          </div>
          <button className="nav__toggle" aria-label="Menu" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>

        <main>

          <h1 className="sr-only">M. Awais, Senior Product Designer</h1>

          <section className="hero">
            <img src="/assets/images/hero-bg.jpg" alt="M. Awais portrait with warm amber spotlight" className="hero__bg" />
            <div className="hero__fx" aria-hidden="true">
              <HeroAurora />
            </div>

            <div className="hero__lead">
              <div className="hero__content">
                <div className="hero__info">
                  <h2 className="hero__subtitle">Google &amp; IBM Certified</h2>
                  <p className="hero__description">I take complicated products and make them feel obvious. Fewer &ldquo;wait, where do I click&rdquo; moments, and more people getting what they came for on a screen that&rsquo;s easy on the eyes.</p>
                </div>
                <div className="hero__actions">
                  <a href="#work" className="hero__btn">View Work</a>
                  <a href="#work" className="hero__btn-icon" aria-label="Scroll down">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.4301 18.8191C14.2401 18.8191 14.0501 18.7491 13.9001 18.5991C13.6101 18.3091 13.6101 17.8291 13.9001 17.5391L19.4401 11.9991L13.9001 6.45914C13.6101 6.16914 13.6101 5.68914 13.9001 5.39914C14.1901 5.10914 14.6701 5.10914 14.9601 5.39914L21.0301 11.4691C21.3201 11.7591 21.3201 12.2391 21.0301 12.5291L14.9601 18.5991C14.8101 18.7491 14.6201 18.8191 14.4301 18.8191Z" fill="currentColor"/>
                      <path d="M20.33 12.75H3.5C3.09 12.75 2.75 12.41 2.75 12C2.75 11.59 3.09 11.25 3.5 11.25H20.33C20.74 11.25 21.08 11.59 21.08 12C21.08 12.41 20.74 12.75 20.33 12.75Z" fill="currentColor"/>
                    </svg>
                  </a>
                </div>
              </div>

              <p className="hero__name">Awais</p>
            </div>

            <p className="hero__intro">I&rsquo;m M. Awais, a Senior Product Designer who makes complex things feel simple.</p>

            <p className="hero__available"><span className="hero__bullet"></span>Always open to a good design problem</p>

            <ul className="hero__menu">
              <li className="hero__menu-item">
                <a className="hero__menu-link" href="https://www.linkedin.com/in/awaisdesigns" target="_blank" rel="noopener noreferrer">
                  <span className="hero__menu-label">
                    <svg className="hero__menu-icon" viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><path fillRule="evenodd" d="M12.51 8.796v1.697a3.74 3.74 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766c-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483a1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.6 1.6 0 0 1 1.6 1.606" clipRule="evenodd"/><path d="M7.2 8.809H4V19.5h3.2z"/></g></svg>
                    LinkedIn
                  </span>
                  <svg className="hero__menu-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M14.4301 18.8191C14.2401 18.8191 14.0501 18.7491 13.9001 18.5991C13.6101 18.3091 13.6101 17.8291 13.9001 17.5391L19.4401 11.9991L13.9001 6.45914C13.6101 6.16914 13.6101 5.68914 13.9001 5.39914C14.1901 5.10914 14.6701 5.10914 14.9601 5.39914L21.0301 11.4691C21.3201 11.7591 21.3201 12.2391 21.0301 12.5291L14.9601 18.5991C14.8101 18.7491 14.6201 18.8191 14.4301 18.8191Z" fill="currentColor"/>
                    <path d="M20.33 12.75H3.5C3.09 12.75 2.75 12.41 2.75 12C2.75 11.59 3.09 11.25 3.5 11.25H20.33C20.74 11.25 21.08 11.59 21.08 12C21.08 12.41 20.74 12.75 20.33 12.75Z" fill="currentColor"/>
                  </svg>
                </a>
              </li>
              <li className="hero__menu-item">
                <a className="hero__menu-link" href="https://dribbble.com/awaisdesigns" target="_blank" rel="noopener noreferrer">
                  <span className="hero__menu-label">
                    <svg className="hero__menu-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m1.617 11.984A12.02 12.02 0 0 0 7.28 18.46A7.96 7.96 0 0 0 12 20a8 8 0 0 0 3.028-.593a33 33 0 0 0-1.411-5.424Zm1.978-.403c.532 1.543.96 3.135 1.274 4.768a8 8 0 0 0 2.922-4.523a12.1 12.1 0 0 0-4.196-.245m-3.244-2.669a19.1 19.1 0 0 1-8.35.984L4 12c0 1.927.682 3.695 1.817 5.076a14.02 14.02 0 0 1 7.072-4.963a33 33 0 0 0-.538-1.2Zm6.137-3.593a19 19 0 0 1-4.288 2.825q.351.75.668 1.517c1.7-.26 3.45-.206 5.13.161a7.96 7.96 0 0 0-1.51-4.503M8.574 4.77a8.02 8.02 0 0 0-4.298 5.145a17.1 17.1 0 0 0 7.157-.8A33 33 0 0 0 8.574 4.77M12 4q-.721 0-1.405.123a35 35 0 0 1 2.703 4.235a17 17 0 0 0 3.826-2.502A7.97 7.97 0 0 0 12 4"/></svg>
                    Dribbble
                  </span>
                  <svg className="hero__menu-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M14.4301 18.8191C14.2401 18.8191 14.0501 18.7491 13.9001 18.5991C13.6101 18.3091 13.6101 17.8291 13.9001 17.5391L19.4401 11.9991L13.9001 6.45914C13.6101 6.16914 13.6101 5.68914 13.9001 5.39914C14.1901 5.10914 14.6701 5.10914 14.9601 5.39914L21.0301 11.4691C21.3201 11.7591 21.3201 12.2391 21.0301 12.5291L14.9601 18.5991C14.8101 18.7491 14.6201 18.8191 14.4301 18.8191Z" fill="currentColor"/>
                    <path d="M20.33 12.75H3.5C3.09 12.75 2.75 12.41 2.75 12C2.75 11.59 3.09 11.25 3.5 11.25H20.33C20.74 11.25 21.08 11.59 21.08 12C21.08 12.41 20.74 12.75 20.33 12.75Z" fill="currentColor"/>
                  </svg>
                </a>
              </li>
              <li className="hero__menu-item">
                <a className="hero__menu-link" href="https://www.behance.net/awais_designs" target="_blank" rel="noopener noreferrer">
                  <span className="hero__menu-label">
                    <svg className="hero__menu-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5a4 4 0 0 1 2.646 7A4 4 0 0 1 8 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm9.5 4c2.607 0 4.5 2.368 4.5 5a1 1 0 0 1-.883.993L21 15h-5.86c.358 1.224 1.353 2 2.36 2c1.08 0 1.692-.511 2.24-1.15a1 1 0 1 1 1.52 1.3l-.107.122l-.229.246C20.202 18.26 19.146 19 17.5 19c-2.607 0-4.5-2.368-4.5-5s1.893-5 4.5-5M8 13H4v4h4a2 2 0 0 0 .15-3.995zm9.5-2c-1.007 0-2.002.776-2.36 2h4.72c-.358-1.224-1.353-2-2.36-2M8 7H4v4h4a2 2 0 1 0 0-4m11-1a1 1 0 1 1 0 2h-3a1 1 0 1 1 0-2z"/></svg>
                    Behance
                  </span>
                  <svg className="hero__menu-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M14.4301 18.8191C14.2401 18.8191 14.0501 18.7491 13.9001 18.5991C13.6101 18.3091 13.6101 17.8291 13.9001 17.5391L19.4401 11.9991L13.9001 6.45914C13.6101 6.16914 13.6101 5.68914 13.9001 5.39914C14.1901 5.10914 14.6701 5.10914 14.9601 5.39914L21.0301 11.4691C21.3201 11.7591 21.3201 12.2391 21.0301 12.5291L14.9601 18.5991C14.8101 18.7491 14.6201 18.8191 14.4301 18.8191Z" fill="currentColor"/>
                    <path d="M20.33 12.75H3.5C3.09 12.75 2.75 12.41 2.75 12C2.75 11.59 3.09 11.25 3.5 11.25H20.33C20.74 11.25 21.08 11.59 21.08 12C21.08 12.41 20.74 12.75 20.33 12.75Z" fill="currentColor"/>
                  </svg>
                </a>
              </li>
              <li className="hero__menu-item">
                <a className="hero__menu-link" href="https://wa.me/923027778210" target="_blank" rel="noopener noreferrer">
                  <span className="hero__menu-label">
                    <svg className="hero__menu-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28"/></svg>
                    Whatsapp
                  </span>
                  <svg className="hero__menu-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M14.4301 18.8191C14.2401 18.8191 14.0501 18.7491 13.9001 18.5991C13.6101 18.3091 13.6101 17.8291 13.9001 17.5391L19.4401 11.9991L13.9001 6.45914C13.6101 6.16914 13.6101 5.68914 13.9001 5.39914C14.1901 5.10914 14.6701 5.10914 14.9601 5.39914L21.0301 11.4691C21.3201 11.7591 21.3201 12.2391 21.0301 12.5291L14.9601 18.5991C14.8101 18.7491 14.6201 18.8191 14.4301 18.8191Z" fill="currentColor"/>
                    <path d="M20.33 12.75H3.5C3.09 12.75 2.75 12.41 2.75 12C2.75 11.59 3.09 11.25 3.5 11.25H20.33C20.74 11.25 21.08 11.59 21.08 12C21.08 12.41 20.74 12.75 20.33 12.75Z" fill="currentColor"/>
                  </svg>
                </a>
              </li>
            </ul>
          </section>

          <ClientLogos />

          <section className="process section--light" id="about">
            <div className="process__pin">
              <div className="process__card">

                <div className="process__visual">
                  <div className="process__visual-track">

                    <div className="process__slide">
                      <img className="process__photo" src="/assets/images/process/discover.png" alt="Discover stage" />
                      <div className="process__overlay">
                        <h3 className="process__overlay-title">Discover</h3>
                        <div className="process__dots" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span></div>
                      </div>
                    </div>

                    <div className="process__slide">
                      <img className="process__photo" src="/assets/images/process/define.png" alt="Define stage" />
                      <div className="process__overlay">
                        <h3 className="process__overlay-title">Define</h3>
                        <div className="process__dots" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span></div>
                      </div>
                    </div>

                    <div className="process__slide">
                      <img className="process__photo" src="/assets/images/process/design.png" alt="Design stage" />
                      <div className="process__overlay">
                        <h3 className="process__overlay-title">Design</h3>
                        <div className="process__dots" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span></div>
                      </div>
                    </div>

                    <div className="process__slide">
                      <img className="process__photo" src="/assets/images/process/deliver.png" alt="Deliver stage" />
                      <div className="process__overlay">
                        <h3 className="process__overlay-title">Deliver</h3>
                        <div className="process__dots" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span></div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="process__body">
                  <div className="process__body-track">

                    <div className="process__panel is-active">
                      <div className="process__top">
                        <span className="process__tag">Design Process</span>
                        <span className="process__counter">01 / 04</span>
                      </div>
                      <p className="process__desc" data-wordfx>First I dig in. Research, real conversations with users, a hard look at the competition. I&rsquo;d rather understand the problem properly than start pushing pixels and hope.</p>
                      <div className="process__cta">
                        <a href="#contact" className="process__cta-btn">Get started</a>
                        <a href="#contact" className="process__cta-icon" aria-label="Get started">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.4301 18.8191C14.2401 18.8191 14.0501 18.7491 13.9001 18.5991C13.6101 18.3091 13.6101 17.8291 13.9001 17.5391L19.4401 11.9991L13.9001 6.45914C13.6101 6.16914 13.6101 5.68914 13.9001 5.39914C14.1901 5.10914 14.6701 5.10914 14.9601 5.39914L21.0301 11.4691C21.3201 11.7591 21.3201 12.2391 21.0301 12.5291L14.9601 18.5991C14.8101 18.7491 14.6201 18.8191 14.4301 18.8191Z" fill="currentColor"/><path d="M20.33 12.75H3.5C3.09 12.75 2.75 12.41 2.75 12C2.75 11.59 3.09 11.25 3.5 11.25H20.33C20.74 11.25 21.08 11.59 21.08 12C21.08 12.41 20.74 12.75 20.33 12.75Z" fill="currentColor"/></svg>
                        </a>
                      </div>
                    </div>

                    <div className="process__panel">
                      <div className="process__top">
                        <span className="process__tag">Design Process</span>
                        <span className="process__counter">02 / 04</span>
                      </div>
                      <p className="process__desc" data-wordfx>Then I frame the real problem. Flows, structure, and one clear goal everyone agrees on, so we&rsquo;re not quietly redesigning things halfway through.</p>
                      <div className="process__cta">
                        <a href="#contact" className="process__cta-btn">Get started</a>
                        <a href="#contact" className="process__cta-icon" aria-label="Get started">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.4301 18.8191C14.2401 18.8191 14.0501 18.7491 13.9001 18.5991C13.6101 18.3091 13.6101 17.8291 13.9001 17.5391L19.4401 11.9991L13.9001 6.45914C13.6101 6.16914 13.6101 5.68914 13.9001 5.39914C14.1901 5.10914 14.6701 5.10914 14.9601 5.39914L21.0301 11.4691C21.3201 11.7591 21.3201 12.2391 21.0301 12.5291L14.9601 18.5991C14.8101 18.7491 14.6201 18.8191 14.4301 18.8191Z" fill="currentColor"/><path d="M20.33 12.75H3.5C3.09 12.75 2.75 12.41 2.75 12C2.75 11.59 3.09 11.25 3.5 11.25H20.33C20.74 11.25 21.08 11.59 21.08 12C21.08 12.41 20.74 12.75 20.33 12.75Z" fill="currentColor"/></svg>
                        </a>
                      </div>
                    </div>

                    <div className="process__panel">
                      <div className="process__top">
                        <span className="process__tag">Design Process</span>
                        <span className="process__counter">03 / 04</span>
                      </div>
                      <p className="process__desc" data-wordfx>Now the fun part. Rough wireframes to polished screens, checked against real feedback at every step until it genuinely clicks.</p>
                      <div className="process__cta">
                        <a href="#contact" className="process__cta-btn">Get started</a>
                        <a href="#contact" className="process__cta-icon" aria-label="Get started">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.4301 18.8191C14.2401 18.8191 14.0501 18.7491 13.9001 18.5991C13.6101 18.3091 13.6101 17.8291 13.9001 17.5391L19.4401 11.9991L13.9001 6.45914C13.6101 6.16914 13.6101 5.68914 13.9001 5.39914C14.1901 5.10914 14.6701 5.10914 14.9601 5.39914L21.0301 11.4691C21.3201 11.7591 21.3201 12.2391 21.0301 12.5291L14.9601 18.5991C14.8101 18.7491 14.6201 18.8191 14.4301 18.8191Z" fill="currentColor"/><path d="M20.33 12.75H3.5C3.09 12.75 2.75 12.41 2.75 12C2.75 11.59 3.09 11.25 3.5 11.25H20.33C20.74 11.25 21.08 11.59 21.08 12C21.08 12.41 20.74 12.75 20.33 12.75Z" fill="currentColor"/></svg>
                        </a>
                      </div>
                    </div>

                    <div className="process__panel">
                      <div className="process__top">
                        <span className="process__tag">Design Process</span>
                        <span className="process__counter">04 / 04</span>
                      </div>
                      <p className="process__desc" data-wordfx>And I don&rsquo;t vanish at handoff. Clean design systems, dev-ready specs, and I stick around through build and QA until it actually ships right.</p>
                      <div className="process__cta">
                        <a href="#contact" className="process__cta-btn">Get started</a>
                        <a href="#contact" className="process__cta-icon" aria-label="Get started">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.4301 18.8191C14.2401 18.8191 14.0501 18.7491 13.9001 18.5991C13.6101 18.3091 13.6101 17.8291 13.9001 17.5391L19.4401 11.9991L13.9001 6.45914C13.6101 6.16914 13.6101 5.68914 13.9001 5.39914C14.1901 5.10914 14.6701 5.10914 14.9601 5.39914L21.0301 11.4691C21.3201 11.7591 21.3201 12.2391 21.0301 12.5291L14.9601 18.5991C14.8101 18.7491 14.6201 18.8191 14.4301 18.8191Z" fill="currentColor"/><path d="M20.33 12.75H3.5C3.09 12.75 2.75 12.41 2.75 12C2.75 11.59 3.09 11.25 3.5 11.25H20.33C20.74 11.25 21.08 11.59 21.08 12C21.08 12.41 20.74 12.75 20.33 12.75Z" fill="currentColor"/></svg>
                        </a>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </section>

          <section className="work section--dark" id="work" style={{ "--work-count": "6" } as React.CSSProperties}>
            <div className="work__pin">
              <div className="work__header">
                <span className="work__eyebrow">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>
                  Highlighted Work
                </span>
                <a href="/work" className="work__viewall">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  View all work
                </a>
              </div>

              <div className="work__stage">

                <article className="work__project">
                  <div className="work__cover">
                    <div className="work__media" style={{ backgroundImage: "url(/assets/images/work/work-01.jpg)" }}></div>
                    <div className="work__scrim"></div>
                    <a className="work__cardlink" href="/work/currency-gram" aria-label="View Currency Gram case study"></a>
                    <div className="work__caption">
                      <div className="work__line"><span className="work__niche">Fintech</span></div>
                      <div className="work__line"><h3 className="work__name">Currency Gram</h3></div>
                    </div>
                    <div className="work__stats" aria-hidden="true">
                      <div className="work__line"><p className="work__stat"><span className="work__stat-num">-38%</span><span className="work__stat-label">Faster transfers</span></p></div>
                      <div className="work__line"><p className="work__stat"><span className="work__stat-num">+41</span><span className="work__stat-label">NPS gain</span></p></div>
                    </div>
                  </div>
                </article>

                <article className="work__project">
                  <div className="work__cover">
                    <div className="work__media" style={{ backgroundImage: "url(/assets/images/work/work-02.jpg)" }}></div>
                    <div className="work__scrim"></div>
                    <a className="work__cardlink" href="/work/asap" aria-label="View ASAP case study"></a>
                    <div className="work__caption">
                      <div className="work__line"><span className="work__niche">E-commerce</span></div>
                      <div className="work__line"><h3 className="work__name">ASAP</h3></div>
                    </div>
                    <div className="work__stats" aria-hidden="true">
                      <div className="work__line"><p className="work__stat"><span className="work__stat-num">62% less</span><span className="work__stat-label">Infra cost</span></p></div>
                      <div className="work__line"><p className="work__stat"><span className="work__stat-num">658 → 1</span><span className="work__stat-label">Sites unified</span></p></div>
                    </div>
                  </div>
                </article>

                <article className="work__project">
                  <div className="work__cover">
                    <div className="work__media" style={{ backgroundImage: "url(/assets/images/work/work-07.jpg)" }}></div>
                    <div className="work__scrim"></div>
                    <a className="work__cardlink" href="/work/ai-native-scheduler" aria-label="View Worky - AI Native Scheduler case study"></a>
                    <div className="work__caption">
                      <div className="work__line"><span className="work__niche">AI &amp; Workforce</span></div>
                      <div className="work__line"><h3 className="work__name">Worky - AI Native Scheduler</h3></div>
                    </div>
                    <div className="work__stats" aria-hidden="true">
                      <div className="work__line"><p className="work__stat"><span className="work__stat-num">90% less</span><span className="work__stat-label">Time to schedule</span></p></div>
                      <div className="work__line"><p className="work__stat"><span className="work__stat-num">5</span><span className="work__stat-label">Jobs automated</span></p></div>
                    </div>
                  </div>
                </article>

                <article className="work__project">
                  <div className="work__cover">
                    <div className="work__media" style={{ backgroundImage: "url(/assets/images/work/work-03.jpg)" }}></div>
                    <div className="work__scrim"></div>
                    <a className="work__cardlink" href="/work/azaq" aria-label="View AZAQ - Relia case study"></a>
                    <div className="work__caption">
                      <div className="work__line"><span className="work__niche">Enterprise</span></div>
                      <div className="work__line"><h3 className="work__name">AZAQ - Relia</h3></div>
                    </div>
                    <div className="work__stats" aria-hidden="true">
                      <div className="work__line"><p className="work__stat"><span className="work__stat-num">4-stage</span><span className="work__stat-label">Approval chain</span></p></div>
                      <div className="work__line"><p className="work__stat"><span className="work__stat-num">0</span><span className="work__stat-label">Hand-offs left</span></p></div>
                    </div>
                  </div>
                </article>

                <article className="work__project">
                  <div className="work__cover">
                    <div className="work__media" style={{ backgroundImage: "url(/assets/images/work/work-04.jpg)" }}></div>
                    <div className="work__scrim"></div>
                    <a className="work__cardlink" href="/work/workeasy" aria-label="View WorkEasy case study"></a>
                    <div className="work__caption">
                      <div className="work__line"><span className="work__niche">Workforce</span></div>
                      <div className="work__line"><h3 className="work__name">WorkEasy</h3></div>
                    </div>
                    <div className="work__stats" aria-hidden="true">
                      <div className="work__line"><p className="work__stat"><span className="work__stat-num">4</span><span className="work__stat-label">Modules rebuilt</span></p></div>
                      <div className="work__line"><p className="work__stat"><span className="work__stat-num">1 tap</span><span className="work__stat-label">To clock in</span></p></div>
                    </div>
                  </div>
                </article>

                <article className="work__project">
                  <div className="work__cover">
                    <div className="work__media" style={{ backgroundImage: "url(/assets/images/work/work-05.jpg)" }}></div>
                    <div className="work__scrim"></div>
                    <a className="work__cardlink" href="/work/azoria" aria-label="View Azoria case study"></a>
                    <div className="work__caption">
                      <div className="work__line"><span className="work__niche">Hospitality</span></div>
                      <div className="work__line"><h3 className="work__name">Azoria</h3></div>
                    </div>
                    <div className="work__stats" aria-hidden="true">
                      <div className="work__line"><p className="work__stat"><span className="work__stat-num">4-in-1</span><span className="work__stat-label">Super app</span></p></div>
                      <div className="work__line"><p className="work__stat"><span className="work__stat-num">1</span><span className="work__stat-label">Admin panel</span></p></div>
                    </div>
                  </div>
                </article>

                <article className="work__project">
                  <div className="work__cover">
                    <div className="work__media" style={{ backgroundImage: "url(/assets/images/work/work-06.jpg)" }}></div>
                    <div className="work__scrim"></div>
                    <a className="work__cardlink" href="/work/phlex65" aria-label="View Phlex65 case study"></a>
                    <div className="work__caption">
                      <div className="work__line"><span className="work__niche">Healthcare</span></div>
                      <div className="work__line"><h3 className="work__name">Phlex65</h3></div>
                    </div>
                    <div className="work__stats" aria-hidden="true">
                      <div className="work__line"><p className="work__stat"><span className="work__stat-num">1 → many</span><span className="work__stat-label">Multi-tenant SaaS</span></p></div>
                      <div className="work__line"><p className="work__stat"><span className="work__stat-num">2</span><span className="work__stat-label">Apps shipped</span></p></div>
                    </div>
                  </div>
                </article>

                <div className="work__hud" aria-hidden="true">
                  <span className="work__count"><span className="work__count-cur">01</span><span className="work__count-sep">/</span><span className="work__count-tot">06</span></span>
                  <span className="work__rail"><span className="work__rail-fill"></span></span>
                </div>

              </div>
            </div>
          </section>

          <section className="services section--dark" id="about-services">
            <div className="services__head">
              <span className="services__eyebrow">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>
                Capabilities
              </span>
              <svg className="services__arrowdown" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 2v10M2.5 7.5L7 12l4.5-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="services__card">
              <div className="services__list">

                <a href="#contact" className="services__row">
                  <span className="services__num">(01)</span>
                  <h3 className="services__name" data-wordfx>Web Design</h3>
                  <p className="services__desc">Responsive sites built from scratch: quick to load, easy to read, and made to turn visitors into customers.</p>
                  <span className="services__thumb" style={{ backgroundImage: "url(/assets/images/services/web-design.jpg), radial-gradient(120% 120% at 60% 25%, #2a3a5a 0%, #1a2233 55%, #0d1320 100%)" } as React.CSSProperties}></span>
                  <span className="services__plus" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1.3"/></svg>
                  </span>
                </a>

                <a href="#contact" className="services__row">
                  <span className="services__num">(02)</span>
                  <h3 className="services__name" data-wordfx>UI/UX Design</h3>
                  <p className="services__desc">Flows and screens that feel obvious to use, with just enough personality to stick in memory.</p>
                  <span className="services__thumb" style={{ backgroundImage: "url(/assets/images/services/ui-ux-design.jpg), radial-gradient(120% 120% at 60% 25%, #1a5a52 0%, #103b38 55%, #07201d 100%)" } as React.CSSProperties}></span>
                  <span className="services__plus" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1.3"/></svg>
                  </span>
                </a>

                <a href="#contact" className="services__row">
                  <span className="services__num">(03)</span>
                  <h3 className="services__name" data-wordfx>Product Design</h3>
                  <p className="services__desc">The whole journey, from strategy and research to design, turned into something you can actually ship.</p>
                  <span className="services__thumb" style={{ backgroundImage: "url(/assets/images/services/product-design.jpg), radial-gradient(120% 120% at 60% 25%, #b3702f 0%, #5a3010 55%, #2a1606 100%)" } as React.CSSProperties}></span>
                  <span className="services__plus" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1.3"/></svg>
                  </span>
                </a>

                <a href="#contact" className="services__row">
                  <span className="services__num">(04)</span>
                  <h3 className="services__name" data-wordfx>Branding</h3>
                  <p className="services__desc">A visual identity that actually looks like you, and tells people who you are before they read a word.</p>
                  <span className="services__thumb" style={{ backgroundImage: "url(/assets/images/services/branding.jpg), radial-gradient(120% 120% at 60% 25%, #5a2a55 0%, #34203a 55%, #170c1a 100%)" } as React.CSSProperties}></span>
                  <span className="services__plus" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1.3"/></svg>
                  </span>
                </a>

                <a href="#contact" className="services__row">
                  <span className="services__num">(05)</span>
                  <h3 className="services__name" data-wordfx>UX Audit</h3>
                  <p className="services__desc">A close look at where people get stuck, and a plain list of fixes, ranked by what will move the needle most.</p>
                  <span className="services__thumb" style={{ backgroundImage: "url(/assets/images/services/ux-audit.jpg), radial-gradient(120% 120% at 60% 25%, #3a3a6e 0%, #1f1f44 55%, #0c0c20 100%)" } as React.CSSProperties}></span>
                  <span className="services__plus" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1.3"/></svg>
                  </span>
                </a>

                <a href="#contact" className="services__row">
                  <span className="services__num">(06)</span>
                  <h3 className="services__name" data-wordfx>AI-Native Design</h3>
                  <p className="services__desc">AI-powered experiences that quietly do the heavy lifting, so there&rsquo;s less busywork for your team.</p>
                  <span className="services__thumb" style={{ backgroundImage: "url(/assets/images/services/ai-native-design.jpg), radial-gradient(120% 120% at 60% 25%, #b58a2f 0%, #5a3a0a 55%, #2a1c04 100%)" } as React.CSSProperties}></span>
                  <span className="services__plus" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1.3"/></svg>
                  </span>
                </a>

              </div>
            </div>
          </section>

          <section className="metrics section--light">
            <div className="container">
              <div className="metrics__grid">
                <div className="metrics__item">
                  <p className="metrics__number">6<span className="metrics__affix">yrs</span></p>
                  <p className="metrics__label">Designing products end to end</p>
                </div>
                <div className="metrics__item">
                  <p className="metrics__number">25<span className="metrics__affix">+</span></p>
                  <p className="metrics__label">Products and features I&rsquo;ve shipped</p>
                </div>
                <div className="metrics__item">
                  <p className="metrics__number">6</p>
                  <p className="metrics__label">Industries shipped in</p>
                </div>
              </div>
            </div>
          </section>

          <section className="reasons section--dark" id="why">
            <div className="reasons__grid">

              <div className="reasons__intro">
                <div className="reasons__head">
                  <span className="reasons__eyebrow">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>
                    Why work with me
                  </span>
                  <svg className="reasons__arrowdown" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 2v10M2.5 7.5L7 12l4.5-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h2 className="reasons__heading" data-wordfx>Senior design,<br />thought through.</h2>
                <p className="reasons__lead">Senior-level design, thought through properly and shaped around your product, never pulled off a template. Here is what that looks like in practice.</p>
                <div className="reasons__cta">
                  <a href="#contact" className="btn reasons__btn">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Contact me
                  </a>
                  <div className="reasons__social">
                    <div className="reasons__avatars">
                      <span className="reasons__avatar" style={{ background: "url(/assets/images/avatars/avatar-1.jpg) center/cover no-repeat, linear-gradient(135deg, #3a4a6e, #1a2233)" } as React.CSSProperties}></span>
                      <span className="reasons__avatar" style={{ background: "url(/assets/images/avatars/avatar-2.jpg) center/cover no-repeat, linear-gradient(135deg, #1a5a52, #07201d)" } as React.CSSProperties}></span>
                      <span className="reasons__avatar" style={{ background: "url(/assets/images/avatars/avatar-3.jpg) center/cover no-repeat, linear-gradient(135deg, #b3702f, #5a3010)" } as React.CSSProperties}></span>
                      <span className="reasons__avatar" style={{ background: "url(/assets/images/avatars/avatar-4.jpg) center/cover no-repeat, linear-gradient(135deg, #5a2a55, #170c1a)" } as React.CSSProperties}></span>
                      <span className="reasons__avatar reasons__avatar--more">+81</span>
                    </div>
                    <span className="reasons__trust">Trusted by founders and product leads I&rsquo;ve worked with</span>
                  </div>
                </div>
              </div>

              <div className="reasons__cards">

                <div className="reasons__card-wrap" style={{ "--i": "0" } as React.CSSProperties}>
                  <article className="reasons__card">
                    <span className="reasons__icon"><img src="/assets/images/reasons/icon-1.png" alt="" /></span>
                    <div className="reasons__card-body">
                      <h3 className="reasons__card-title" data-wordfx>Senior Craft, Hands-On</h3>
                      <p className="reasons__card-desc">You work with someone who has shipped real products across fintech, healthcare, and SaaS, doing the actual design, not passing it to a junior.</p>
                    </div>
                  </article>
                </div>

                <div className="reasons__card-wrap" style={{ "--i": "1" } as React.CSSProperties}>
                  <article className="reasons__card">
                    <span className="reasons__icon"><img src="/assets/images/reasons/icon-2.png" alt="" /></span>
                    <div className="reasons__card-body">
                      <h3 className="reasons__card-title" data-wordfx>Problem First, Pixels Later</h3>
                      <p className="reasons__card-desc">I start with research and a clearly framed problem, so the work solves the right thing instead of just looking good.</p>
                    </div>
                  </article>
                </div>

                <div className="reasons__card-wrap" style={{ "--i": "2" } as React.CSSProperties}>
                  <article className="reasons__card">
                    <span className="reasons__icon"><img src="/assets/images/reasons/icon-3.png" alt="" /></span>
                    <div className="reasons__card-body">
                      <h3 className="reasons__card-title" data-wordfx>Systems That Scale</h3>
                      <p className="reasons__card-desc">Clean design systems and dev-ready specs, so the design holds together and ships without friction.</p>
                    </div>
                  </article>
                </div>

                <div className="reasons__card-wrap" style={{ "--i": "3" } as React.CSSProperties}>
                  <article className="reasons__card">
                    <span className="reasons__icon"><img src="/assets/images/reasons/icon-4.png" alt="" /></span>
                    <div className="reasons__card-body">
                      <h3 className="reasons__card-title" data-wordfx>Clear Collaboration</h3>
                      <p className="reasons__card-desc">Straight talk and simple updates. You always know exactly where things stand, no chasing.</p>
                    </div>
                  </article>
                </div>

                <div className="reasons__card-wrap" style={{ "--i": "4" } as React.CSSProperties}>
                  <article className="reasons__card">
                    <span className="reasons__icon"><img src="/assets/images/reasons/icon-5.png" alt="" /></span>
                    <div className="reasons__card-body">
                      <h3 className="reasons__card-title" data-wordfx>In It Through Ship</h3>
                      <p className="reasons__card-desc">I don&rsquo;t vanish at handoff. I stay through build and QA until it works in the real world.</p>
                    </div>
                  </article>
                </div>

                <div className="reasons__end" aria-hidden="true"></div>
              </div>
            </div>
          </section>

        </main>

        <footer className="footer section--dark" id="contact">

          <div className="footer__contact">
            <div className="footer__contact-head">
              <span className="footer__eyebrow">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>
                Contact
              </span>
              <svg className="footer__arrowdown" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 2v10M2.5 7.5L7 12l4.5-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="footer__contact-title">
              <h2 className="footer__cta-heading" data-wordfx>Get in touch</h2>
              <a href="mailto:awais.designsss@gmail.com" className="btn footer__cta-btn">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Let's talk
              </a>
            </div>
          </div>

          <div className="footer__plus-grid" aria-hidden="true">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 0v13M0 6.5h13" stroke="currentColor" strokeWidth="1.2"/></svg>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 0v13M0 6.5h13" stroke="currentColor" strokeWidth="1.2"/></svg>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 0v13M0 6.5h13" stroke="currentColor" strokeWidth="1.2"/></svg>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 0v13M0 6.5h13" stroke="currentColor" strokeWidth="1.2"/></svg>
          </div>

          <div className="footer__main">
            <div className="footer__left">
              <h3 className="footer__tagline" data-wordfx>Calm, clear design for products people love to use.</h3>
              <div className="footer__contacts">
                <a href="mailto:awais.designsss@gmail.com" className="footer__contact-link">
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true"><path d="M1 8L8 1M8 1H2M8 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  awais.designsss@gmail.com
                </a>
                <div className="footer__contact-row">
                  <a href="https://wa.me/923027778210" target="_blank" rel="noopener noreferrer" className="footer__contact-link">
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true"><path d="M1 8L8 1M8 1H2M8 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    +92 302 7778210
                  </a>
                  <span className="footer__copy">© 2026 M. Awais</span>
                </div>
              </div>
            </div>

            <nav className="footer__links">
              <a href="/" className="footer__link"><span className="footer__link-text">Home</span><span className="footer__link-num">01</span></a>
              <a href="/work" className="footer__link"><span className="footer__link-text">Work</span><span className="footer__link-num">02</span></a>
              <a href="/about" className="footer__link"><span className="footer__link-text">About</span><span className="footer__link-num">03</span></a>
              <a href="/contact" className="footer__link"><span className="footer__link-text">Contact</span><span className="footer__link-num">04</span></a>
            </nav>
          </div>
        </footer>
    </>
  );
}
