export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function mapRange(value: number, start: number, end: number) {
  if (end === start) return value >= end ? 1 : 0;
  return clamp((value - start) / (end - start));
}

export function smoothstep(value: number) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

export function easeOutCubic(value: number) {
  const t = clamp(value);
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOutCubic(value: number) {
  const t = clamp(value);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function sceneOpacity(value: number, start: number, end: number, edge = 0.012) {
  const inEdge = start <= 0 ? 0 : edge;
  const outEdge = end >= 1 ? 0 : edge;
  if (value < 0 || value > 1) return 0;
  if (start > 0 && value <= start - inEdge) return 0;
  if (end < 1 && value >= end + outEdge) return 0;
  if (inEdge > 0 && value < start + inEdge) {
    return smoothstep(mapRange(value, start - inEdge, start + inEdge));
  }
  if (outEdge > 0 && value > end - outEdge) {
    return smoothstep(mapRange(value, end + outEdge, end - outEdge));
  }
  return 1;
}

export function formatNumber(value: number, digits = 0) {
  return value.toFixed(digits);
}

export function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(target.tagName)
  );
}
