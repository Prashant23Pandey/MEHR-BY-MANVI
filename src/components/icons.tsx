import { PEAR_MARK_PATH, STAR_PATH, WORDMARK_PATHS } from "@/lib/content";

export function Star({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={STAR_PATH} />
    </svg>
  );
}

export function PearMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 305 415"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        pathLength={1}
        d={PEAR_MARK_PATH}
        strokeWidth={40}
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 524.211 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <g>
        {WORDMARK_PATHS.map((path) => (
          <path key={path.slice(0, 18)} d={path} fill="currentColor" />
        ))}
      </g>
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        d="M3 8h9M8.5 3.5 13 8l-4.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NameIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 20a7.5 7.5 0 0115 0" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M2.5 6.5h19v11h-19zM2.5 7l9.5 6.5L21.5 7" />
    </svg>
  );
}

export function GrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 5.5h18v11H9l-5 4v-4H3z" />
    </svg>
  );
}
