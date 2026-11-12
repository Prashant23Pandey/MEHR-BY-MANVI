"use client";

import { NAV } from "@/lib/content";
import { Star, PearMark, ArrowIcon } from "@/components/icons";

type ChromeProps = {
  activeChapter: string;
  tag: string;
  tagVisible: boolean;
  hidden: boolean;
  menuOpen: boolean;
  onNavigate: (progress: number) => void;
  onApply: () => void;
  onToggleMenu: () => void;
};

export function Chrome({
  activeChapter,
  tag,
  tagVisible,
  hidden,
  menuOpen,
  onNavigate,
  onApply,
  onToggleMenu,
}: ChromeProps) {
  return (
    <div
      className={`ov chrome go${hidden ? " chrome--hidden" : ""}`}
      style={{ pointerEvents: hidden ? "none" : undefined }}
      aria-hidden={hidden ? "true" : undefined}
    >
      <span className="gv" style={{ left: "var(--v1)" }}>
        <i />
      </span>
      <span className="gv gv--r" style={{ left: "var(--v2)" }}>
        <i />
      </span>
      <span className="gh" style={{ top: "var(--h1)" }}>
        <i />
      </span>
      <span className="gh" style={{ top: "var(--h2)" }}>
        <i />
      </span>
      <span className="fill" aria-hidden="true" />

      <span className="gx" style={{ left: "var(--v1)", top: "var(--h2)" }}>
        <span>
          <Star />
        </span>
      </span>
      <span className="gx" style={{ left: "var(--v2)", top: "var(--h2)" }}>
        <span>
          <Star />
        </span>
      </span>
      <span className="gx gx--lock" style={{ left: "var(--v1)", top: "var(--h1)" }}>
        <span>
          <Star />
        </span>
      </span>
      <span className="gx gx--lock" style={{ left: "var(--v2)", top: "var(--h1)" }}>
        <span>
          <Star />
        </span>
      </span>

      <button
        className="mark"
        type="button"
        aria-label="Pear — back to top"
        onClick={() => onNavigate(0)}
      >
        <PearMark />
      </button>

      <button
        className="menu"
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="chapter-menu"
        onClick={onToggleMenu}
      >
        <span />
        <span />
        <span />
        <span />
      </button>

      <nav className="hdr label" aria-label="Apply">
        <button className="apply" type="button" onClick={onApply}>
          Apply
          <span className="arw">
            <ArrowIcon />
          </span>
        </button>
      </nav>

      <nav className="rail" aria-label="Chapters">
        {NAV.map((item) => {
          const active = activeChapter === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-at={item.at}
              className={active ? "on" : undefined}
              aria-current={active ? "true" : undefined}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(item.at);
              }}
            >
              <i />
              <em>{item.label}</em>
            </a>
          );
        })}
      </nav>

      <span
        className={`tag${tagVisible ? " tag--on" : ""}`}
        aria-hidden="true"
      >
        {tag}
      </span>
    </div>
  );
}
