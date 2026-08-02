import type { ComponentPropsWithoutRef } from "react";
import Reveal from "@/components/reveal";
import WordFx from "@/components/word-fx";
import { ArrowDownIcon, ArrowUpRightIcon, LinkArrowIcon, PlusIcon } from "@/assets/icons";
import { COPYRIGHT, EMAIL_HREF, PHONE_DISPLAY, SITE_EMAIL, WHATSAPP_HREF } from "@/constants";
import {
  FOOTER_CTA_HEADING,
  FOOTER_CTA_LABEL,
  FOOTER_EYEBROW,
  FOOTER_LINKS,
  FOOTER_TAGLINE,
} from "./site-footer.data";

// WordFx renders its own tag and so does Reveal; these adapters let the two
// headings be a single node that both rises in and carries the per-word
// hover spans — exactly the original data-wordfx element tagged `.enter`.
const RevealH2 = (props: ComponentPropsWithoutRef<"h2">) => <Reveal as="h2" {...props} />;
const RevealH3 = (props: ComponentPropsWithoutRef<"h3">) => <Reveal as="h3" {...props} />;

/**
 * Site footer / contact section. The six entrance elements the old
 * orchestrator tagged (contact-head, cta-heading, cta-btn, tagline,
 * contacts, links) each matched their selector alone, so the per-group
 * index restarted at 0 for every one of them — all six enter with no
 * stagger, which Reveal's default delay of 0 reproduces.
 */
export default function SiteFooter() {
  return (
    <footer className="footer section--dark" id="contact">

      <div className="footer__contact">
        <Reveal className="footer__contact-head">
          <span className="footer__eyebrow">
            <PlusIcon size={12} strokeWidth={1.4} aria-hidden="true" />
            {FOOTER_EYEBROW}
          </span>
          <ArrowDownIcon className="footer__arrowdown" aria-hidden="true" />
        </Reveal>
        <div className="footer__contact-title">
          <WordFx as={RevealH2} className="footer__cta-heading" text={FOOTER_CTA_HEADING} />
          <Reveal as="a" href={EMAIL_HREF} className="btn footer__cta-btn">
            <ArrowUpRightIcon strokeWidth={1.5} aria-hidden="true" />
            {FOOTER_CTA_LABEL}
          </Reveal>
        </div>
      </div>

      <div className="footer__plus-grid" aria-hidden="true">
        <PlusIcon size={13} strokeWidth={1.2} />
        <PlusIcon size={13} strokeWidth={1.2} />
        <PlusIcon size={13} strokeWidth={1.2} />
        <PlusIcon size={13} strokeWidth={1.2} />
      </div>

      <div className="footer__main">
        <div className="footer__left">
          <WordFx as={RevealH3} className="footer__tagline" text={FOOTER_TAGLINE} />
          <Reveal className="footer__contacts">
            <a href={EMAIL_HREF} className="footer__contact-link">
              <LinkArrowIcon aria-hidden="true" />
              {SITE_EMAIL}
            </a>
            <div className="footer__contact-row">
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="footer__contact-link">
                <LinkArrowIcon aria-hidden="true" />
                {PHONE_DISPLAY}
              </a>
              <span className="footer__copy">{COPYRIGHT}</span>
            </div>
          </Reveal>
        </div>

        <Reveal as="nav" className="footer__links">
          {FOOTER_LINKS.map(({ href, label, num }) => (
            <a key={href} href={href} className="footer__link">
              <span className="footer__link-text">{label}</span>
              <span className="footer__link-num">{num}</span>
            </a>
          ))}
        </Reveal>
      </div>
    </footer>
  );
}
