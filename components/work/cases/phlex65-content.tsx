"use client";

import React from "react";
import Wordmark from "@/components/ui/wordmark";
import NavWhatsapp from "@/components/ui/nav-whatsapp";

/** Case study "phlex65", authored to match the repo's case-study structure. */
export default function Phlex65Content() {

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
            <a href="mailto:hello@awaisdesigns.com" className="nav__cta">Email me</a>
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
            <p className="cs-hero__niche">Healthcare · SaaS Platform</p>
            <h1 className="cs-hero__title">Phlex65</h1>
            <p className="cs-hero__summary">A dated caregiving app, first modernized, then reimagined as a multi-tenant SaaS where any agency can sign up, bring its own caregivers, and serve the people who need care.</p>
            <dl className="cs-facts">
              <div><dt className="cs-facts__k">Role</dt><dd className="cs-facts__v">Sole Product Designer</dd></div>
              <div><dt className="cs-facts__k">Timeline</dt><dd className="cs-facts__v">6 months · 2025</dd></div>
              <div><dt className="cs-facts__k">Year</dt><dd className="cs-facts__v">2025</dd></div>
              <div><dt className="cs-facts__k">Industry</dt><dd className="cs-facts__v">Healthcare · SaaS</dd></div>
            </dl>
          </section>

          <div className="cs-cover">
            <div className="cs-cover__media reveal" style={{ background: "url(/assets/images/work/case-phlex65.jpg) center/cover no-repeat, radial-gradient(120% 120% at 70% 20%, #4a2f6e 0%, #281a44 55%, #100a20 100%)" } as React.CSSProperties} role="img" aria-label="Phlex65 cover artwork"></div>
          </div>

          <section className="section cs-overview">
            <div className="cs-overview__grid">
              <div className="cs-overview__col reveal"><h2>The problem</h2><p>Phlex65 ran on phone calls and paper. The agency scheduled caregivers by phone, and the mobile app they had was so old and lost in its navigation that nobody used it. The whole model also lived inside a single agency, with no way for others to join.</p></div>
              <div className="cs-overview__col reveal"><h2>My role</h2><p>I was the sole designer, working with a business analyst. I redesigned the entire mobile experience for both caregivers and care receivers, then designed the super admin panel for the client and the agency admin panel for onboarding new agencies.</p></div>
              <div className="cs-overview__col reveal"><h2>The outcome</h2><p>A modern, user-centric app and a multi-tenant platform. Agencies can sign up, add their own caregivers, and serve care receivers, while the client oversees everything from the top.</p></div>
            </div>
          </section>

          <section className="section cs-metrics">
            <div className="cs-metrics__grid">
              <div className="cs-metric reveal"><p className="cs-metric__num">1 → many<span></span></p><p className="cs-metric__label">A single agency reborn as a multi-tenant SaaS platform</p></div>
              <div className="cs-metric reveal"><p className="cs-metric__num">2 apps<span></span></p><p className="cs-metric__label">Caregiver and care receiver experiences, plus two admin panels</p></div>
              <div className="cs-metric reveal"><p className="cs-metric__num">6 mo<span></span></p><p className="cs-metric__label">Full platform: 2 months on mobile, 4 on the admin systems</p></div>
            </div>
          </section>

          <section className="section cs-block section--light">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Challenge</p>
              <div>
                <h2 className="cs-block__title">From phone calls to a platform anyone can join.</h2>
                <div className="prose"><p>Phlex65 had two problems stacked on top of each other. The day-to-day ran on calls and paperwork because the existing app was too old and confusing to trust. And the business itself was locked to one agency, with no path for others to come aboard. The job was first to make the app something people would actually reach for, then to rethink the entire system as a SaaS that many agencies could run inside, each with their own caregivers and their own world.</p></div>
              </div>
            </div>
          </section>

          <section className="section cs-block section--dark">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Process</p>
              <div>
                <h2 className="cs-block__title">Design for the people first, then for scale.</h2>
                <div className="prose"><p>I started with the two people at the heart of it. Care receivers who need a service near them, and caregivers who accept the work and show up. I designed the mobile experience around that reality, then worked out how the model stretches to many agencies at once. A business analyst and I mapped how an agency signs up, brings its caregivers, and operates without ever touching another agency's data, while the client sits above all of them as super admin.</p></div>
                <div className="cs-gallery">
                  <div className="cs-gallery__item reveal" style={{ background: "url(/assets/images/work/gallery/phlex65-1.jpg) center/cover no-repeat, radial-gradient(120% 120% at 30% 30%, #4a2f6e 0%, #281a44 55%, #100a20 100%)" } as React.CSSProperties}></div>
                  <div className="cs-gallery__item reveal" style={{ background: "url(/assets/images/work/gallery/phlex65-2.jpg) center/cover no-repeat, radial-gradient(120% 120% at 80% 60%, #4a2f6e 0%, #281a44 55%, #100a20 100%)" } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
          </section>

          <section className="section cs-block section--light">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Solution</p>
              <div>
                <h2 className="cs-block__title">Search nearby, request, done.</h2>
                <div className="prose"><p>The move that pulls people off the phone is search. A care receiver finds nearby caregivers offering the service they need on a map, sends a request for the job, and the caregiver accepts and arrives at the set time. Both sides have a job portal built into the app. Above the apps sit two panels: an agency admin scoped to each agency that signs up, and a super admin for the client, with a lifted dashboard that brings analytics, stats, and cleaner navigation into one view.</p></div>
                <div className="cs-gallery">
                  <div className="cs-gallery__item cs-gallery__item--wide reveal" style={{ background: "url(/assets/images/work/gallery/phlex65-3.jpg) center/cover no-repeat, radial-gradient(120% 120% at 50% 25%, #4a2f6e 0%, #281a44 55%, #100a20 100%)" } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
          </section>

          <nav className="cs-pager" aria-label="More projects">
            <a className="cs-pager__link cs-pager__link--prev" href="/work/azoria">
              <span className="cs-pager__dir">Previous</span>
              <span className="cs-pager__name">Azoria</span>
            </a>
            <a className="cs-pager__link cs-pager__link--next" href="/work/currency-gram">
              <span className="cs-pager__dir">Next</span>
              <span className="cs-pager__name">Currency Gram</span>
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
                <a href="mailto:hello@awaisdesigns.com" className="footer__contact-link">
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true"><path d="M1 8L8 1M8 1H2M8 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  hello@awaisdesigns.com
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
