"use client";

import { FAQS } from "@/lib/content";
import {
  activeFaqIndex,
  FAQ_TIMELINE,
  questionsSceneOpacity,
} from "@/lib/timeline";
import { Star } from "@/components/icons";

function faqProgressForIndex(index: number) {
  const span = FAQ_TIMELINE.end - FAQ_TIMELINE.start;
  return FAQ_TIMELINE.start + (index / 4) * span * 0.96;
}

export function Questions({
  progress,
  onNavigate,
}: {
  progress: number;
  onNavigate: (progress: number) => void;
}) {
  const scene = questionsSceneOpacity(progress);
  const active = activeFaqIndex(progress);
  const local = Math.min(
    1,
    Math.max(0, (progress - FAQ_TIMELINE.start) / (FAQ_TIMELINE.end - FAQ_TIMELINE.start)),
  );
  const rotation = local * 288;

  return (
    <section
      className="faq scene"
      style={{ opacity: scene }}
      aria-hidden={scene < 0.05 ? "true" : undefined}
      inert={scene < 0.05}
    >
      <h2 className="sr-only">Questions</h2>
      <svg
        className="faq-lead"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line x1="336" y1="480" x2="686" y2="563" />
        <rect width="8" height="8" x="682" y="559" />
      </svg>

      <div className="faq-carousel">
        {FAQS.map((faq, index) => {
          const angle = index * 72 - rotation;
          const isActive = index === active;
          const distance = Math.min(
            Math.abs(((angle % 360) + 360) % 360),
            Math.abs((((angle % 360) + 360) % 360) - 360),
          );
          const scale = isActive ? 1 : Math.max(0.74, 1 - distance / 500);
          return (
            <button
              key={faq.q}
              type="button"
              className={`fq${isActive ? " on" : ""}`}
              style={{
                transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(360px) rotateY(${-angle}deg) scale(${scale})`,
                opacity: isActive ? 1 : 0.52,
                filter: isActive ? "none" : "blur(1.4px)",
              }}
              onClick={() => onNavigate(faqProgressForIndex(index))}
              tabIndex={isActive ? 0 : -1}
              aria-hidden={isActive ? undefined : "true"}
              aria-label={`${faq.q} ${faq.a}`}
            >
              <span className="fr" />
              <span className="st a">
                <Star />
              </span>
              <span className="st b">
                <Star />
              </span>
              <span className="fq-q">{faq.q}</span>
              <span className="fq-a">{faq.a}</span>
            </button>
          );
        })}
      </div>

      <div className="faq-controls">
        <button
          type="button"
          aria-label="Previous question"
          onClick={() => onNavigate(faqProgressForIndex(Math.max(0, active - 1)))}
        >
          ←
        </button>
        <span>
          {active + 1} / {FAQS.length}
        </span>
        <button
          type="button"
          aria-label="Next question"
          onClick={() => onNavigate(faqProgressForIndex(Math.min(FAQS.length - 1, active + 1)))}
        >
          →
        </button>
      </div>

      <div className="faq-accordion">
        {FAQS.map((faq) => (
          <details key={faq.q} className="faq-item">
            <summary>{faq.q}</summary>
            <p>{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
