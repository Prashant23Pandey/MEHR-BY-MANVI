"use client";

import { HERO, MODEL_BEATS, MODEL_STAND, SIGN_PATHS } from "@/lib/content";
import {
  activeBeat,
  beatOpacity,
  heroOpacity,
  modelSceneOpacity,
  signDraw,
  signOpacity,
  MODEL_TIMELINE,
} from "@/lib/timeline";
import { clamp, mapRange, smoothstep } from "@/lib/utils";
import { ArrowIcon } from "@/components/icons";

type HeroModelProps = {
  progress: number;
  onApply: () => void;
};

export function HeroModel({ progress, onApply }: HeroModelProps) {
  const scene = modelSceneOpacity(progress);
  const hero = heroOpacity(progress);
  const draw = signDraw(progress);
  const sign = signOpacity(progress);
  const currentBeat = activeBeat(progress);
  const heroExit = smoothstep(mapRange(progress, 0.045, 0.072));
  const heroLine = `translateY(${-heroExit * 175}%)`;

  return (
    <section
      className="model scene"
      style={{ opacity: scene }}
      aria-hidden={scene < 0.05 ? "true" : undefined}
      inert={scene < 0.05}
    >
      <div
        className="sign"
        aria-hidden="true"
        style={{ opacity: sign }}
      >
        <p>
          <span className="sg-a" style={{ opacity: clamp(draw * 5) }}>
            {HERO.signA}{" "}
          </span>
          <span className="sg-b" style={{ opacity: clamp(draw * 6) }}>
            <svg
              className="sg-svg"
              viewBox="-0.900 -12.374 70.978 23.698"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
              {SIGN_PATHS.map((path) => {
                const local = clamp((draw - path.a) / Math.max(0.0001, path.b - path.a));
                return (
                  <path
                    key={path.key}
                    d={path.d}
                    transform={path.tf}
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - local}
                  />
                );
              })}
            </svg>
          </span>
        </p>
      </div>

      <div className="col-head">
        <div
          className={`bk${hero > 0.4 ? " on" : ""}`}
          style={{ opacity: hero, visibility: hero > 0.01 ? "visible" : "hidden" }}
          aria-hidden={hero <= 0.4 ? "true" : undefined}
          inert={hero <= 0.4}
        >
          <h1>
            <span className="ln">
              <i style={{ transform: heroLine }}>{HERO.title}</i>
            </span>
          </h1>
          <p className="subhead">
            {HERO.subhead.map((line) => (
              <span className="ln" key={line}>
                <i style={{ transform: heroLine }}>{line}</i>
              </span>
            ))}
          </p>
          <button
            className="cta"
            type="button"
            onClick={onApply}
            style={{
              opacity: hero,
              transform: `translateY(${(1 - hero) * 14}px)`,
              pointerEvents: hero > 0.5 ? "auto" : "none",
            }}
          >
            <span className="face">
              {HERO.cta}{" "}
              <span className="arw">
                <ArrowIcon />
              </span>
            </span>
            <span className="flood" aria-hidden="true">
              <span className="face">
                {HERO.cta}{" "}
                <span className="arw">
                  <ArrowIcon />
                </span>
              </span>
            </span>
          </button>
        </div>

        {MODEL_BEATS.map((beat, index) => {
          const opacity = beatOpacity(progress, index);
          const timing = MODEL_TIMELINE.beats[index];
          const enter = smoothstep(mapRange(progress, timing.start, timing.start + 0.022));
          const exit = smoothstep(mapRange(progress, timing.end - 0.02, timing.end));
          const lineTransform = `translateY(${(1 - enter) * 175 - exit * 175}%)`;
          return (
            <div
              key={beat.id}
              className={`bk${opacity > 0.35 ? " on" : ""}`}
              style={{
                opacity,
                visibility: opacity > 0.01 ? "visible" : "hidden",
              }}
              aria-hidden={currentBeat === index ? undefined : "true"}
            >
              <div className="beat">
                {beat.head.map((line) => (
                  <span className="ln" key={line}>
                    <i style={{ transform: lineTransform }}>{line}</i>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="col-stand">
        <div
          className={`bk${hero > 0.4 ? " on" : ""}`}
          style={{ opacity: hero, visibility: hero > 0.01 ? "visible" : "hidden" }}
          aria-hidden={hero <= 0.4 ? "true" : undefined}
          inert={hero <= 0.4}
        >
          <p className="stand">{MODEL_STAND}</p>
        </div>
        {MODEL_BEATS.map((beat, index) => {
          const opacity = beatOpacity(progress, index);
          return (
            <div
              key={beat.id}
              className={`bk${opacity > 0.35 ? " on" : ""}`}
              style={{
                opacity,
                visibility: opacity > 0.01 ? "visible" : "hidden",
              }}
              aria-hidden={currentBeat === index ? undefined : "true"}
            >
              <p className="stand">{beat.stand}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

