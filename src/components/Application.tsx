"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { APPLICATION, SITE } from "@/lib/content";
import {
  applyButtonState,
  applyFieldState,
  applyLeadState,
  applySceneOpacity,
} from "@/lib/timeline";
import { GrowIcon, MailIcon, NameIcon } from "@/components/icons";

type Status = "idle" | "sending" | "sent" | "error";

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: Record<string, unknown>,
  ) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function TurnstileWidget({ onToken }: { onToken: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;

    const render = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      if (widgetRef.current) {
        window.turnstile.remove(widgetRef.current);
      }
      widgetRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        appearance: "interaction-only",
        callback: (token: string) => onToken(token),
        "error-callback": () => onToken(""),
        "expired-callback": () => onToken(""),
      });
    };

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-pear-turnstile="true"]',
    );
    if (window.turnstile) {
      render();
    } else if (existing) {
      existing.addEventListener("load", render);
    } else {
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.pearTurnstile = "true";
      script.addEventListener("load", render);
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      existing?.removeEventListener("load", render);
      if (widgetRef.current && window.turnstile) {
        window.turnstile.remove(widgetRef.current);
        widgetRef.current = null;
      }
    };
  }, [onToken]);

  if (!siteKey) return null;
  return <div className="cf-turnstile" ref={containerRef} />;
}

export function Application({ progress }: { progress: number }) {
  const [values, setValues] = useState({ name: "", email: "", grow: "", fax: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [token, setToken] = useState("");
  const [widgetVersion, setWidgetVersion] = useState(0);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const growRef = useRef<HTMLTextAreaElement>(null);

  const scene = applySceneOpacity(progress);
  const active = progress >= 0.7 && scene > 0.15;
  const lead = applyLeadState(progress);
  const button = applyButtonState(progress);
  const fieldStates = [0, 1, 2].map((index) => applyFieldState(progress, index));
  const onToken = useCallback((value: string) => setToken(value), []);

  const update = (key: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }
    if (status === "error") {
      setStatus("idle");
      setMessage("");
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const errors: Record<string, string> = {};
    if (values.name.trim().length < 2) {
      errors.name = "Tell us your name (2–120 characters).";
    }
    if (!EMAIL_RE.test(values.email.trim())) {
      errors.email = "Enter a valid work email.";
    }
    if (values.grow.trim().length < 10) {
      errors.grow = "Tell us a little about what you sell and where you want to grow.";
    }
    if (siteKey && !token) {
      errors.verification = "Complete the verification, then send again.";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("error");
      setMessage(errors.name ?? errors.email ?? errors.grow ?? errors.verification ?? "");
      if (errors.name) nameRef.current?.focus();
      else if (errors.email) emailRef.current?.focus();
      else if (errors.grow) growRef.current?.focus();
      return;
    }

    setStatus("sending");
    setMessage("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, token }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fields?: Record<string, string>;
      };

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? APPLICATION.error);
        if (data.fields) setFieldErrors(data.fields);
        return;
      }

      setStatus("sent");
      setMessage("Application sent. We read every one, and answer within a week when the model fits.");
      setValues({ name: "", email: "", grow: "", fax: "" });
      setToken("");
      setWidgetVersion((version) => version + 1);
    } catch {
      setStatus("error");
      setMessage(APPLICATION.error);
    }
  };

  const reset = () => {
    setStatus("idle");
    setMessage("");
    setFieldErrors({});
    setValues({ name: "", email: "", grow: "", fax: "" });
    setToken("");
    setWidgetVersion((version) => version + 1);
  };

  const fieldStyle = (index: number) => {
    const state = fieldStates[index];
    return {
      opacity: state.opacity,
      transform: `translateY(${(1 - state.local) * 28}px) translateZ(${(1 - state.local) * 64}px) rotateX(${(1 - state.local) * 9}deg)`,
      pointerEvents: active ? ("auto" as const) : ("none" as const),
      visibility: state.opacity > 0.01 ? ("visible" as const) : ("hidden" as const),
    };
  };

  return (
    <section
      id="apply"
      className={`cf scene${active ? " live" : ""}`}
      style={{ opacity: scene }}
      aria-hidden={!active ? "true" : undefined}
      inert={!active}
    >
      <h2 className="sr-only">{APPLICATION.label}</h2>
      <div className="cf-orb" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      <div
        className="cf-lead"
        style={{
          opacity: lead.opacity,
          transform: `translateY(${(1 - lead.local) * 10}px)`,
        }}
      >
        <b>{APPLICATION.label}</b>
        <p>{APPLICATION.lead}</p>
      </div>

      <div
        className="cf-in"
        style={{
          transform: `rotateX(${(1 - lead.local) * 6}deg) rotateY(${(1 - lead.local) * -9}deg) translateZ(${(1 - lead.local) * -64}px)`,
        }}
      >
        <form className="cf-form" onSubmit={onSubmit} noValidate>
          <div className="cf-hp" aria-hidden="true">
            <label>
              Leave this field empty
              <input
                tabIndex={-1}
                autoComplete="off"
                name="fax"
                value={values.fax}
                onChange={(event) => update("fax", event.target.value)}
              />
            </label>
          </div>

          <div className="cf-f cf-name" style={fieldStyle(0)}>
            <span className="rim" />
            <span className="rim2" />
            <span className="ic">
              <NameIcon />
            </span>
            <label className="sr-only" htmlFor="apply-name">
              {APPLICATION.fields.name.label}
            </label>
            <input
              ref={nameRef}
              id="apply-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder={APPLICATION.fields.name.placeholder}
              value={values.name}
              onChange={(event) => update("name", event.target.value)}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "apply-status" : undefined}
              maxLength={120}
            />
          </div>

          <div className="cf-f cf-email" style={fieldStyle(1)}>
            <span className="rim" />
            <span className="rim2" />
            <span className="ic">
              <MailIcon />
            </span>
            <label className="sr-only" htmlFor="apply-email">
              {APPLICATION.fields.email.label}
            </label>
            <input
              ref={emailRef}
              id="apply-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={APPLICATION.fields.email.placeholder}
              value={values.email}
              onChange={(event) => update("email", event.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "apply-status" : undefined}
              maxLength={254}
            />
          </div>

          <div className="cf-f cf-grow" style={fieldStyle(2)}>
            <span className="rim" />
            <span className="rim2" />
            <span className="ic">
              <GrowIcon />
            </span>
            <label className="sr-only" htmlFor="apply-grow">
              {APPLICATION.fields.grow.label}
            </label>
            <textarea
              ref={growRef}
              id="apply-grow"
              name="grow"
              rows={4}
              placeholder={APPLICATION.fields.grow.placeholder}
              value={values.grow}
              onChange={(event) => update("grow", event.target.value)}
              aria-invalid={Boolean(fieldErrors.grow)}
              aria-describedby={fieldErrors.grow ? "apply-status" : undefined}
              maxLength={5000}
            />
          </div>

          <TurnstileWidget key={widgetVersion} onToken={onToken} />

          <button
            className="cf-cta"
            type="submit"
            style={{
              opacity: button.opacity,
              transform: `translateY(${(1 - button.local) * 16}px)`,
              pointerEvents: active ? "auto" : "none",
              visibility: button.opacity > 0.01 ? "visible" : "hidden",
            }}
            disabled={status === "sending" || status === "sent"}
          >
            {status === "sending"
              ? APPLICATION.sending
              : status === "sent"
                ? APPLICATION.sent
                : APPLICATION.submit}
          </button>

          <div className="cf-status-wrap" style={{ opacity: button.opacity }}>
            <p
              id="apply-status"
              className={`cf-status${status === "error" ? " is-error" : ""}${
                status === "sent" ? " is-sent" : ""
              }`}
              role="status"
              aria-live="polite"
            >
              {message || APPLICATION.note}
            </p>
            {status === "sent" ? (
              <button type="button" className="cf-reset" onClick={reset}>
                Send another application
              </button>
            ) : (
              <a className="cf-alt" href={`mailto:${SITE.email}`}>
                Or email {SITE.email}
              </a>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
