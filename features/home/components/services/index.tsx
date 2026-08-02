import Reveal from "@/components/reveal";
import WordFx from "@/components/word-fx";
import { ArrowDownIcon, PlusIcon } from "@/assets/icons";
import { SERVICES, SERVICES_EYEBROW } from "./services.data";

/**
 * Capabilities list — six rows that all point at the contact section.
 * Hover choreography (thumb reveal, per-word lift) is pure styles.css;
 * the only motion here is the scroll entrance: head first, then rows
 * on the old 70ms stagger.
 */
export default function Services() {
  return (
    <section className="services section--dark" id="about-services">
      <Reveal className="services__head" variant="rise" delay={0}>
        <span className="services__eyebrow">
          <PlusIcon size={12} strokeWidth={1.4} width={12} height={12} aria-hidden="true" />
          {SERVICES_EYEBROW}
        </span>
        <ArrowDownIcon className="services__arrowdown" width={14} height={14} aria-hidden="true" />
      </Reveal>
      <div className="services__card">
        <div className="services__list">
          {SERVICES.map((service, i) => (
            <Reveal
              key={service.num}
              as="a"
              href="#contact"
              className="services__row"
              variant="rise"
              delay={i * 0.07}
            >
              <span className="services__num">{service.num}</span>
              <WordFx as="h3" className="services__name" text={service.name} />
              <p className="services__desc">{service.description}</p>
              <span className="services__thumb" style={{ backgroundImage: service.thumbBackground }}></span>
              <span className="services__plus" aria-hidden="true">
                <PlusIcon size={14} strokeWidth={1.3} />
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
