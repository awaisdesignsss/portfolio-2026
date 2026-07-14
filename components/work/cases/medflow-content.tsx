"use client";

import React from "react";

/** Case study "medflow", ported from the original static work/medflow.html. */
export default function MedflowContent() {

  React.useEffect(() => {
    const cleanups: Array<() => void> = [];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

    if (!reduceMotion) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -10% 0px" });
      document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    return () => { cleanups.forEach((fn) => fn()); };
  }, []);

  return (
    <>
      <nav className="nav">
          <a className="nav__logo" href="/" aria-label="M. Awais, home"><span className="brandmark" role="img" aria-label="Awais"></span></a>
          <div className="nav__menu">
            <a href="/" className="nav__link">Home</a>
            <a href="/work" className="nav__link" aria-current="page">Work</a>
            <a href="/about" className="nav__link">About</a>
            <a href="/contact" className="nav__link">Contact</a>
          </div>
          <a href="mailto:hello@awais.design" className="nav__cta">Email me</a>
          <button className="nav__toggle" aria-label="Menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </nav>

        <main>

          <section className="pagehead cs-hero">
            <a className="cs-hero__back" href="/work">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M10.5 3.5L3.5 10.5M3.5 10.5H9M3.5 10.5V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              All work
            </a>
            <p className="cs-hero__niche">Healthcare</p>
            <h1 className="cs-hero__title">MedFlow</h1>
            <p className="cs-hero__summary">A patient-flow tool that helped clinic staff see the whole floor at a glance and move people through care without the clipboard.</p>
            <dl className="cs-facts">
              <div><dt className="cs-facts__k">Role</dt><dd className="cs-facts__v">Senior Product Designer</dd></div>
              <div><dt className="cs-facts__k">Timeline</dt><dd className="cs-facts__v">4 months</dd></div>
              <div><dt className="cs-facts__k">Year</dt><dd className="cs-facts__v">2024</dd></div>
              <div><dt className="cs-facts__k">Industry</dt><dd className="cs-facts__v">Healthcare / SaaS</dd></div>
            </dl>
          </section>

          <div className="cs-cover">
            <div className="cs-cover__media reveal" style={{ background: "radial-gradient(120% 120% at 70% 20%, #1a5a52 0%, #103b38 55%, #07201d 100%)" } as React.CSSProperties} role="img" aria-label="MedFlow cover artwork"></div>
          </div>

          <section className="section cs-overview">
            <div className="cs-overview__grid">
              <div className="cs-overview__col reveal"><h2>The problem</h2><p>Front-desk and clinical staff tracked patients across whiteboards, paper, and three systems. Handoffs slipped, and wait times grew with no one able to see why.</p></div>
              <div className="cs-overview__col reveal"><h2>My role</h2><p>I owned research, the flow model, and UI, working with a clinical advisor to keep the design safe under real pressure.</p></div>
              <div className="cs-overview__col reveal"><h2>The outcome</h2><p>A live floor view with clear states for every patient, role-aware actions, and handoffs that leave a trail instead of a guess.</p></div>
            </div>
          </section>

          <section className="section cs-metrics">
            <div className="cs-metrics__grid">
              <div className="cs-metric reveal"><p className="cs-metric__num">28%<span> shorter</span></p><p className="cs-metric__label">Average patient wait time per visit</p></div>
              <div className="cs-metric reveal"><p className="cs-metric__num">99.2%<span></span></p><p className="cs-metric__label">Handoffs completed without a dropped step</p></div>
              <div className="cs-metric reveal"><p className="cs-metric__num">2 wks<span></span></p><p className="cs-metric__label">Time for a new clinic to fully onboard</p></div>
            </div>
          </section>

          <section className="section cs-block section--light">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Challenge</p>
              <div>
                <h2 className="cs-block__title">Reading the real problem.</h2>
                <div className="prose"><p>Healthcare interfaces fail quietly: a missed state becomes a missed patient. The design had to be glanceable from across a room, forgiving under interruption, and impossible to misread when someone is tired at the end of a shift.</p></div>
              </div>
            </div>
          </section>

          <section className="section cs-block section--dark">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Process</p>
              <div>
                <h2 className="cs-block__title">From questions to structure.</h2>
                <div className="prose"><p>I observed two clinics for a full day each, mapping every place a patient could stall. We modeled care as a set of unambiguous states, tested the colors and labels with staff who weren’t in the room when we designed them, and tuned until the floor view read correctly at a glance.</p></div>
                <div className="cs-gallery">
                  <div className="cs-gallery__item reveal" style={{ background: "radial-gradient(120% 120% at 30% 30%, #1a5a52 0%, #103b38 55%, #07201d 100%)" } as React.CSSProperties}></div>
                  <div className="cs-gallery__item reveal" style={{ background: "radial-gradient(120% 120% at 80% 60%, #1a5a52 0%, #103b38 55%, #07201d 100%)" } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
          </section>

          <section className="section cs-block section--light">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Solution</p>
              <div>
                <h2 className="cs-block__title">What we shipped.</h2>
                <div className="prose"><p>MedFlow shows the whole floor as one calm board. Each patient carries a clear state and the next action for whoever is looking. Handoffs are explicit and logged, so the question stops being who has this patient.</p></div>
                <div className="cs-gallery">
                  <div className="cs-gallery__item cs-gallery__item--wide reveal" style={{ background: "radial-gradient(120% 120% at 50% 25%, #1a5a52 0%, #103b38 55%, #07201d 100%)" } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
          </section>

          <nav className="cs-pager" aria-label="More projects">
            <a className="cs-pager__link cs-pager__link--prev" href="/work/paywise-dashboard">
              <span className="cs-pager__dir">Previous</span>
              <span className="cs-pager__name">Paywise Dashboard</span>
            </a>
            <a className="cs-pager__link cs-pager__link--next" href="/work/luxe-marketplace">
              <span className="cs-pager__dir">Next</span>
              <span className="cs-pager__name">Luxe Marketplace</span>
            </a>
          </nav>

        </main>

        <footer className="footer section--dark">
          <div className="footer__contact">
            <div className="footer__contact-head">
              <span className="footer__eyebrow">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>
                Contact
              </span>
              <svg className="footer__arrowdown" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 2v10M2.5 7.5L7 12l4.5-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="footer__contact-title">
              <h2 className="footer__cta-heading">Get in touch</h2>
              <a href="/contact" className="btn footer__cta-btn">
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
              <h3 className="footer__tagline">Strategic design for brands that matter.</h3>
              <div className="footer__contacts">
                <a href="mailto:hello@awais.design" className="footer__contact-link">
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true"><path d="M1 8L8 1M8 1H2M8 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  hello@awais.design
                </a>
                <div className="footer__contact-row">
                  <a href="tel:+923417039563" className="footer__contact-link">
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true"><path d="M1 8L8 1M8 1H2M8 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    +92 341 7039563
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
