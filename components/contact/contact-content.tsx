"use client";

import React from "react";

/**
 * Contact page, ported from the original static contact.html.
 * Design comes from the shared styles.css (imported in app/layout.tsx).
 * The only interactive behavior is the mobile nav toggle (no form).
 */
export default function ContactContent() {

  React.useEffect(() => {
    // ── Mobile nav toggle ──
    const toggle = document.querySelector<HTMLElement>(".nav__toggle");
    const nav = document.querySelector<HTMLElement>(".nav");
    if (!toggle || !nav) return;
    const onToggle = () => {
      nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(nav.classList.contains("is-open")));
    };
    toggle.addEventListener("click", onToggle);
    return () => toggle.removeEventListener("click", onToggle);
  }, []);

  return (
    <>
      <nav className="nav">
          <a className="nav__logo" href="/" aria-label="M. Awais, home"><span className="brandmark" role="img" aria-label="Awais"></span></a>
          <div className="nav__menu">
            <a href="/" className="nav__link">Home</a>
            <a href="/work" className="nav__link">Work</a>
            <a href="/about" className="nav__link">About</a>
            <a href="/contact" className="nav__link" aria-current="page">Contact</a>
          </div>
          <a href="mailto:hello@awais.design" className="nav__cta">Email me</a>
          <button className="nav__toggle" aria-label="Menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </nav>

        <main>

          <section className="pagehead">
            <span className="pagehead__eyebrow">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>
              Contact
            </span>
            <h1 className="pagehead__title">Let's talk.</h1>
            <p className="pagehead__lead">Whether it's a product from scratch or a redesign that's been waiting too long, a direct message is the fastest way to reach me. Email or WhatsApp, and I'll come back with honest first thoughts.</p>
          </section>

          <section className="section contact">
            <div className="contact__top">
              <p className="contact__status"><span className="contact__dot" aria-hidden="true"></span>Available for new projects</p>
              <span className="contact__reply">I reply personally, within two business days</span>
            </div>

            <div className="contactgrid">
              <a className="contactmethod" href="mailto:hello@awais.design">
                <span className="contactmethod__head">
                  <span className="contactmethod__label">Email</span>
                  <svg className="contactmethod__arrow" width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span className="contactmethod__value">hello@awais.design</span>
              </a>

              <a className="contactmethod" href="https://wa.me/923417039563" target="_blank" rel="noopener noreferrer">
                <span className="contactmethod__head">
                  <span className="contactmethod__label">WhatsApp</span>
                  <svg className="contactmethod__arrow" width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span className="contactmethod__value">+92 341 7039563</span>
              </a>

              <a className="contactmethod" href="https://www.linkedin.com/in/mawais" target="_blank" rel="noopener noreferrer">
                <span className="contactmethod__head">
                  <span className="contactmethod__label">LinkedIn</span>
                  <svg className="contactmethod__arrow" width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span className="contactmethod__value">linkedin.com/in/mawais</span>
              </a>

              <div className="contactmethod">
                <span className="contactmethod__head">
                  <span className="contactmethod__label">Address</span>
                </span>
                <span className="contactmethod__value">Lahore, Pakistan</span>
              </div>
            </div>
          </section>

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
              <a href="mailto:hello@awais.design" className="btn footer__cta-btn">
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
