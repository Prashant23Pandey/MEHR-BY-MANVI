"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/content";
import { footerReveal, footerSceneOpacity } from "@/lib/timeline";
import { Star, Wordmark } from "@/components/icons";

export function FooterScene({
  progress,
  onNavigate,
}: {
  progress: number;
  onNavigate: (progress: number) => void;
}) {
  const scene = footerSceneOpacity(progress);
  const reveal = footerReveal(progress);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const factor = window.innerWidth <= 720 ? 3 : 1;
      setScale(
        Math.min(window.innerWidth / 1920, window.innerHeight / 1080) * factor,
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <footer
      className="ft scene"
      style={{ opacity: scene }}
      aria-hidden={scene < 0.05 ? "true" : undefined}
      inert={scene < 0.05 || reveal < 0.05}
    >
      <div
        className="ft-in"
        style={{ transform: `scale(${scale})` }}
      >
        <div className="ft-rules" aria-hidden="true">
          <i
            className="ft-r h"
            style={{ top: 125, transform: `scaleX(${reveal})` }}
          />
          <i
            className="ft-r h"
            style={{ top: 982, transform: `scaleX(${reveal})` }}
          />
          <i
            className="ft-r v"
            style={{ left: 675, transform: `scaleY(${reveal})` }}
          />
          <i
            className="ft-r v"
            style={{ left: 1262, transform: `scaleY(${reveal})` }}
          />
        </div>

        <span className="ft-box" aria-hidden="true" />
        <span
          className="ft-st ft-st--a"
          aria-hidden="true"
          style={{ top: 125, left: 675 }}
        >
          <Star />
        </span>
        <span
          className="ft-st ft-st--b"
          aria-hidden="true"
          style={{ top: 982, left: 1262 }}
        >
          <Star />
        </span>

        <button
          type="button"
          className="ft-mark"
          aria-label="Pear — back to top"
          onClick={() => onNavigate(0)}
          style={{
            opacity: reveal,
            transform: `translateY(${(1 - reveal) * 16}px)`,
          }}
        >
          <Wordmark className="ft-mark-svg" />
        </button>

        <p className="ft-tag" aria-label={SITE.tagline.join(" ")}>
          {SITE.tagline.map((line) => (
            <span className="ln" key={line}>
              <i
                style={{
                  transform: `translateY(${(1 - reveal) * 120}%)`,
                }}
              >
                {line}
              </i>
            </span>
          ))}
        </p>

        <div
          className="ft-meta-wrap"
          style={{ opacity: reveal }}
        >
          <p className="ft-meta l">{SITE.company}</p>
          <p className="ft-meta r">
            <a href={`mailto:${SITE.email}`}>{SITE.email.toUpperCase()}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
