import { mapRange, sceneOpacity, smoothstep } from "@/lib/utils";

export const SCENES = {
  model: { start: 0, end: 0.232 },
  work: { start: 0.232, end: 0.4 },
  terms: { start: 0.4, end: 0.628 },
  questions: { start: 0.628, end: 0.7 },
  apply: { start: 0.7, end: 0.86 },
  footer: { start: 0.86, end: 1 },
} as const;

export const MODEL_TIMELINE = {
  hero: { start: 0, end: 0.058 },
  sign: { start: 0.012, end: 0.224 },
  beats: [
    { start: 0.105, end: 0.152 },
    { start: 0.157, end: 0.197 },
    { start: 0.2, end: 0.236 },
  ],
} as const;

export const WORK_TIMELINE = {
  cards: [
    { start: 0.238, end: 0.293 },
    { start: 0.298, end: 0.351 },
    { start: 0.354, end: 0.402 },
  ],
  chart: { start: 0.232, end: 0.4 },
} as const;

export const TERMS_TIMELINE = {
  statements: [
    { start: 0.4, end: 0.518 },
    { start: 0.52, end: 0.63 },
  ],
} as const;

export const FAQ_TIMELINE = {
  start: 0.628,
  end: 0.7,
} as const;

export const APPLY_TIMELINE = {
  lead: { start: 0.7, end: 0.745 },
  fields: [
    { start: 0.72, end: 0.762 },
    { start: 0.728, end: 0.772 },
    { start: 0.736, end: 0.784 },
  ],
  button: { start: 0.746, end: 0.8 },
  hold: 0.86,
} as const;

export const FOOTER_TIMELINE = {
  start: 0.86,
  end: 1,
} as const;

export function modelSceneOpacity(progress: number) {
  return sceneOpacity(progress, SCENES.model.start, SCENES.model.end, 0.018);
}

export function heroOpacity(progress: number) {
  return sceneOpacity(progress, MODEL_TIMELINE.hero.start, MODEL_TIMELINE.hero.end, 0.012);
}

export function signDraw(progress: number) {
  return mapRange(progress, MODEL_TIMELINE.sign.start, MODEL_TIMELINE.sign.end);
}

export function signOpacity(progress: number) {
  return sceneOpacity(progress, MODEL_TIMELINE.sign.start, MODEL_TIMELINE.sign.end, 0.025);
}

export function activeBeat(progress: number) {
  if (progress < MODEL_TIMELINE.beats[0].start) return -1;
  if (progress < MODEL_TIMELINE.beats[1].start) return 0;
  if (progress < MODEL_TIMELINE.beats[2].start) return 1;
  return 2;
}

export function beatOpacity(progress: number, index: number) {
  const beat = MODEL_TIMELINE.beats[index];
  return sceneOpacity(progress, beat.start, beat.end, 0.014);
}

export function workSceneOpacity(progress: number) {
  return sceneOpacity(progress, SCENES.work.start, SCENES.work.end, 0.016);
}

export function workCardState(progress: number, index: number) {
  const card = WORK_TIMELINE.cards[index];
  const local = mapRange(progress, card.start, card.end);
  const opacity = sceneOpacity(progress, card.start, card.end, 0.012);
  return { local, opacity };
}

export function workChartProgress(progress: number) {
  return mapRange(progress, WORK_TIMELINE.chart.start, WORK_TIMELINE.chart.end);
}

export function termsSceneOpacity(progress: number) {
  return sceneOpacity(progress, SCENES.terms.start, SCENES.terms.end, 0.016);
}

export function termStatementState(progress: number, index: number) {
  const statement = TERMS_TIMELINE.statements[index];
  return {
    opacity: sceneOpacity(progress, statement.start, statement.end, 0.022),
    local: mapRange(progress, statement.start, statement.end),
  };
}

export function questionsSceneOpacity(progress: number) {
  return sceneOpacity(progress, SCENES.questions.start, SCENES.questions.end, 0.014);
}

export function faqRotation(progress: number) {
  return mapRange(progress, FAQ_TIMELINE.start, FAQ_TIMELINE.end) * 360;
}

export function activeFaqIndex(progress: number) {
  const local = mapRange(progress, FAQ_TIMELINE.start, FAQ_TIMELINE.end);
  return Math.min(4, Math.max(0, Math.round(local * 4)));
}

export function applySceneOpacity(progress: number) {
  return sceneOpacity(progress, SCENES.apply.start, SCENES.apply.end, 0.016);
}

export function applyFieldState(progress: number, index: number) {
  const field = APPLY_TIMELINE.fields[index];
  const local = smoothstep(mapRange(progress, field.start, field.end));
  return { local, opacity: local };
}

export function applyLeadState(progress: number) {
  const local = smoothstep(
    mapRange(progress, APPLY_TIMELINE.lead.start, APPLY_TIMELINE.lead.end),
  );
  return { opacity: local, local };
}

export function applyButtonState(progress: number) {
  const local = smoothstep(
    mapRange(progress, APPLY_TIMELINE.button.start, APPLY_TIMELINE.button.end),
  );
  return { opacity: local, local };
}

export function footerSceneOpacity(progress: number) {
  return sceneOpacity(progress, FOOTER_TIMELINE.start, FOOTER_TIMELINE.end, 0.02);
}

export function footerReveal(progress: number) {
  return smoothstep(mapRange(progress, FOOTER_TIMELINE.start, FOOTER_TIMELINE.start + 0.06));
}
