"use client";

import React from "react";
import Wordmark from "@/components/ui/wordmark";

/** Case study "workeasy", authored to match the repo's case-study structure. */
export default function WorkeasyContent() {

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
          <a className="nav__logo" href="/" aria-label="M. Awais, home"><Wordmark /></a>
          <div className="nav__menu">
            <a href="/" className="nav__link">Home</a>
            <a href="/work" className="nav__link" aria-current="page">Work</a>
            <a href="/about" className="nav__link">About</a>
            <a href="/contact" className="nav__link">Contact</a>
          </div>
          <a href="mailto:awais.designsss@gmail.com" className="nav__cta">Email me</a>
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
            <p className="cs-hero__niche">SaaS · Workforce Management</p>
            <h1 className="cs-hero__title">WorkEasy</h1>
            <p className="cs-hero__summary">A dated workforce app people avoided, redesigned into a mobile experience where employees and managers can actually finish the job on their phone.</p>
            <dl className="cs-facts">
              <div><dt className="cs-facts__k">Role</dt><dd className="cs-facts__v">Sole Product Designer</dd></div>
              <div><dt className="cs-facts__k">Timeline</dt><dd className="cs-facts__v">12 months · 2025</dd></div>
              <div><dt className="cs-facts__k">Year</dt><dd className="cs-facts__v">2025</dd></div>
              <div><dt className="cs-facts__k">Industry</dt><dd className="cs-facts__v">SaaS · Workforce</dd></div>
            </dl>
          </section>

          <div className="cs-cover">
            <div className="cs-cover__media reveal" style={{ background: "url(/assets/images/work/case-workeasy.jpg) center/cover no-repeat, radial-gradient(120% 120% at 70% 20%, #1a5a3a 0%, #103b28 55%, #072016 100%)" } as React.CSSProperties} role="img" aria-label="WorkEasy cover artwork"></div>
          </div>

          <section className="section cs-overview">
            <div className="cs-overview__grid">
              <div className="cs-overview__col reveal"><h2>The problem</h2><p>WorkEasy's mobile app was so dated and confusing that people gave up on it. Navigation was lost, actions were buried, and users routinely switched to the web version or called support just to do simple tasks.</p></div>
              <div className="cs-overview__col reveal"><h2>My role</h2><p>I was the sole designer, carrying my predecessor's design system forward and redesigning the entire mobile experience for both the Employee and Manager sides, working with the client's product and engineering teams.</p></div>
              <div className="cs-overview__col reveal"><h2>The outcome</h2><p>A clear, focused app built around real jobs. Both employees and managers can complete their core tasks on the phone, without falling back to the web or support.</p></div>
            </div>
          </section>

          <section className="section cs-metrics">
            <div className="cs-metrics__grid">
              <div className="cs-metric reveal"><p className="cs-metric__num">4<span></span></p><p className="cs-metric__label">Core modules rebuilt: Scheduling, Timesheets, Time Off, HRMS</p></div>
              <div className="cs-metric reveal"><p className="cs-metric__num">2<span> sides</span></p><p className="cs-metric__label">Role-based experiences designed for Employees and Managers</p></div>
              <div className="cs-metric reveal"><p className="cs-metric__num">1 tap<span></span></p><p className="cs-metric__label">From opening the app to clocking in, straight from the dashboard</p></div>
            </div>
          </section>

          <section className="section cs-block section--light">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Challenge</p>
              <div>
                <h2 className="cs-block__title">An app people would rather not open.</h2>
                <div className="prose"><p>The old app had every problem at once. Cluttered screens, confusing navigation, outdated patterns, slow performance, and key actions buried where nobody could find them. None of it was built for one hand on a small screen. The result was that people simply didn't use it. They opened the web version instead, or called support to get through tasks the app was supposed to handle. Fixing that meant more than a fresh coat of paint. It meant rebuilding around what people actually came to do.</p></div>
              </div>
            </div>
          </section>

          <section className="section cs-block section--dark">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Process</p>
              <div>
                <h2 className="cs-block__title">Design around the job, not the menu.</h2>
                <div className="prose"><p>I carried forward the design system my predecessor had started and focused the whole redesign on clear goals and clean navigation. For each side I mapped the handful of things people really do. Employees clock in and out, check their shifts, request time off, and review their time and pay. Managers build shifts, manage attendance, and approve or reject requests. Every screen was shaped so those tasks are obvious and quick, instead of hidden three levels deep.</p></div>
                <div className="cs-gallery">
                  <div className="cs-gallery__item reveal" style={{ background: "url(/assets/images/work/gallery/workeasy-1.jpg) center/cover no-repeat, radial-gradient(120% 120% at 30% 30%, #1a5a3a 0%, #103b28 55%, #072016 100%)" } as React.CSSProperties}></div>
                  <div className="cs-gallery__item reveal" style={{ background: "url(/assets/images/work/gallery/workeasy-2.jpg) center/cover no-repeat, radial-gradient(120% 120% at 80% 60%, #1a5a3a 0%, #103b28 55%, #072016 100%)" } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
          </section>

          <section className="section cs-block section--light">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Solution</p>
              <div>
                <h2 className="cs-block__title">The dashboard does the work.</h2>
                <div className="prose"><p>The biggest shift was putting action on the dashboard itself. Managers get widgets that show what's happening with their team so they can approve or reject on the spot. Employees get a clock in and clock out widget right on the home screen, so the most common task takes one tap. The old app had no widgets at all. With clear navigation and the right things surfaced first, people can finish their work on the phone, which is exactly what they couldn't do before.</p></div>
                <div className="cs-gallery">
                  <div className="cs-gallery__item cs-gallery__item--wide reveal" style={{ background: "url(/assets/images/work/gallery/workeasy-3.jpg) center/cover no-repeat, radial-gradient(120% 120% at 50% 25%, #1a5a3a 0%, #103b28 55%, #072016 100%)" } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
          </section>

          <nav className="cs-pager" aria-label="More projects">
            <a className="cs-pager__link cs-pager__link--prev" href="/work/azaq">
              <span className="cs-pager__dir">Previous</span>
              <span className="cs-pager__name">AZAQ - Relia</span>
            </a>
            <a className="cs-pager__link cs-pager__link--next" href="/work/azoria">
              <span className="cs-pager__dir">Next</span>
              <span className="cs-pager__name">Azoria</span>
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
              <h3 className="footer__tagline">Calm, clear design for products people love to use.</h3>
              <div className="footer__contacts">
                <a href="mailto:awais.designsss@gmail.com" className="footer__contact-link">
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true"><path d="M1 8L8 1M8 1H2M8 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  awais.designsss@gmail.com
                </a>
                <div className="footer__contact-row">
                  <a href="tel:+923027778210" className="footer__contact-link">
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
