"use client";

import { useEffect, useRef } from "react";
import { NAV, SITE } from "@/lib/content";
import { PearMark } from "@/components/icons";

type MenuProps = {
  open: boolean;
  onClose: () => void;
  onNavigate: (progress: number) => void;
};

export function Menu({ open, onClose, onNavigate }: MenuProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = dialogRef.current;
    if (!root) return;

    const getFocusable = () =>
      Array.from(
        root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ).filter((element) => element.getClientRects().length > 0);

    const first = getFocusable()[0];
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      ref={dialogRef}
      id="chapter-menu"
      className={`menu-layer${open ? " menu-layer--open" : ""}`}
      aria-hidden={!open}
      inert={!open}
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-title"
    >
      <div className="nvs" onClick={onClose} />
      <div className="nvm">
        <h2 id="menu-title" className="sr-only">
          Chapters
        </h2>
        <div className="nvm-top">
          <button
            type="button"
            className="nvm-mark"
            aria-label="Pear — back to top"
            onClick={() => {
              onClose();
              onNavigate(0);
            }}
          >
            <PearMark />
          </button>
          <button type="button" className="nvm-close" onClick={onClose}>
            Close
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav className="nvm-links" aria-label="Chapter menu">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(event) => {
                event.preventDefault();
                onClose();
                onNavigate(item.at);
              }}
            >
              <b>{item.chapter}</b>
              <em>{item.label}</em>
            </a>
          ))}
        </nav>
        <div className="nvm-foot">
          <p>{SITE.company}</p>
          <a href={`mailto:${SITE.email}`}>{SITE.email.toUpperCase()}</a>
        </div>
      </div>
    </div>
  );
}
