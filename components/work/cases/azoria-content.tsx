"use client";

import React from "react";
import Wordmark from "@/components/ui/wordmark";
import NavWhatsapp from "@/components/ui/nav-whatsapp";

/** Case study "azoria", authored to match the repo's case-study structure. */
export default function AzoriaContent() {

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
          <div className="nav__actions">
            <NavWhatsapp />
            <a href="mailto:awais.designsss@gmail.com" className="nav__cta">Email me</a>
          </div>
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
            <p className="cs-hero__niche">Hospitality · Mobile App</p>
            <h1 className="cs-hero__title">Azoria</h1>
            <p className="cs-hero__summary">A luxury resort in Bali, freed from Airbnb and a patchwork of third-party tools, with one app for staying, playing padel, training, and working, all run from a single admin.</p>
            <dl className="cs-facts">
              <div><dt className="cs-facts__k">Role</dt><dd className="cs-facts__v">Sole Product Designer</dd></div>
              <div><dt className="cs-facts__k">Timeline</dt><dd className="cs-facts__v">6 months</dd></div>
              <div><dt className="cs-facts__k">Industry</dt><dd className="cs-facts__v">Hospitality</dd></div>
            </dl>
          </section>

          <div className="cs-cover">
            <div className="cs-cover__media reveal" style={{ background: "url(/assets/images/work/case-azoria.jpg) center/cover no-repeat, radial-gradient(120% 120% at 70% 20%, #a86a3a 0%, #5a3418 55%, #2a1808 100%)" } as React.CSSProperties} role="img" aria-label="Azoria cover artwork"></div>
          </div>

          <section className="section cs-overview">
            <div className="cs-overview__grid">
              <div className="cs-overview__col reveal"><h2>The problem</h2><p>Azoria offers far more than a room: padel courts, pilates and gym, a co-working space. Airbnb and Booking.com could only handle the stay, so the resort leaned on a patchwork of separate apps for everything else, with nothing tying it together.</p></div>
              <div className="cs-overview__col reveal"><h2>My role</h2><p>I was the sole designer. I designed the full mobile app and its web admin panel from scratch, built the design system and brand guidelines, and managed the developers through to a shippable product.</p></div>
              <div className="cs-overview__col reveal"><h2>The outcome</h2><p>One self-owned super-app covering all four services, backed by an admin panel that runs the entire resort. The client is happy with a launch-ready product and hopeful about what it opens up.</p></div>
            </div>
          </section>

          <section className="section cs-metrics">
            <div className="cs-metrics__grid">
              <div className="cs-metric reveal"><p className="cs-metric__num">4-in-1<span></span></p><p className="cs-metric__label">Living, Padel, Fitness, and Workspace in a single app</p></div>
              <div className="cs-metric reveal"><p className="cs-metric__num">0 → 1<span></span></p><p className="cs-metric__label">From third-party dependence to a self-owned platform</p></div>
              <div className="cs-metric reveal"><p className="cs-metric__num">1<span> admin</span></p><p className="cs-metric__label">Web panel running every service, with role and facility-level access</p></div>
            </div>
          </section>

          <section className="section cs-block section--light">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Challenge</p>
              <div>
                <h2 className="cs-block__title">One resort, four services, too many apps.</h2>
                <div className="prose"><p>Everything at Azoria worked, but it worked in pieces. Airbnb and Booking.com covered the stay and nothing else, so each additional service leaned on its own third-party tool. For guests that meant juggling different apps to do things at one resort. For staff it meant managing a service through software they didn't own or control. The client wanted out: a single platform, built for Azoria, that could hold all of it.</p></div>
              </div>
            </div>
          </section>

          <section className="section cs-block section--dark">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Process</p>
              <div>
                <h2 className="cs-block__title">I pushed for one app, not four.</h2>
                <div className="prose"><p>The client's first instinct was to build four separate apps, one per service, sitting on a shared admin. I pushed back. I argued that the whole system should be synchronized, with all four services living inside a single app, so a guest moves between staying, playing, and working without ever leaving. I designed it that way and walked him through it, and by the end he was glad he'd listened. That decision shaped everything else.</p></div>
                <div className="cs-gallery">
                  <div className="cs-gallery__item reveal" style={{ background: "url(/assets/images/work/gallery/azoria-1.jpg) center/cover no-repeat, radial-gradient(120% 120% at 30% 30%, #a86a3a 0%, #5a3418 55%, #2a1808 100%)" } as React.CSSProperties}></div>
                  <div className="cs-gallery__item reveal" style={{ background: "url(/assets/images/work/gallery/azoria-2.jpg) center/cover no-repeat, radial-gradient(120% 120% at 80% 60%, #a86a3a 0%, #5a3418 55%, #2a1808 100%)" } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
          </section>

          <section className="section cs-block section--light">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Solution</p>
              <div>
                <h2 className="cs-block__title">A super-app, and an admin that runs the place.</h2>
                <div className="prose"><p>The app carries four core modules. Living to book resorts and apartments, Padel to book courts and play with friends, Fitness to book the gym and pilates classes, and Workspace to book co-working space. Behind it sits a web admin that manages all of it, fully customizable, with roles and permissions and facility-level access so any department at any location gets exactly the control it needs. A design system and brand guidelines hold the whole thing together.</p></div>
                <div className="cs-gallery">
                  <div className="cs-gallery__item cs-gallery__item--wide reveal" style={{ background: "url(/assets/images/work/gallery/azoria-3.jpg) center/cover no-repeat, radial-gradient(120% 120% at 50% 25%, #a86a3a 0%, #5a3418 55%, #2a1808 100%)" } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
          </section>

          <nav className="cs-pager" aria-label="More projects">
            <a className="cs-pager__link cs-pager__link--prev" href="/work/workeasy">
              <span className="cs-pager__dir">Previous</span>
              <span className="cs-pager__name">WorkEasy</span>
            </a>
            <a className="cs-pager__link cs-pager__link--next" href="/work/phlex65">
              <span className="cs-pager__dir">Next</span>
              <span className="cs-pager__name">Phlex65</span>
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
