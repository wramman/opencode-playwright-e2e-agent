import { colors, tui } from "./theme";

export const FPS = 30;

// Scene windows in frames. The shape morph and every scene layer read from
// here, so retiming a scene keeps shape, content, captions and cursor in sync.
export const SCENES = {
  code: { from: 0, dur: 105 },
  prompt: { from: 105, dur: 105 },
  agent: { from: 210, dur: 90 },
  app: { from: 300, dur: 150 },
  bug: { from: 450, dur: 90 },
  results: { from: 540, dur: 120 },
  agents: { from: 660, dur: 90 },
  close: { from: 750, dur: 105 },
} as const;

export type SceneId = keyof typeof SCENES;

export const TOTAL_FRAMES = SCENES.close.from + SCENES.close.dur;

// Frames a morph between two shape states takes.
export const MORPH_FRAMES = 16;

export type ShapeKey = {
  at: number;
  w: number;
  h: number;
  r: number;
  bg: string;
};

export const SHAPE_KEYS: ShapeKey[] = [
  { at: SCENES.code.from, w: 860, h: 190, r: 95, bg: colors.ink },
  // Prompt and agent scenes share one OpenCode window.
  { at: SCENES.prompt.from, w: 880, h: 560, r: 28, bg: tui.bg },
  { at: SCENES.app.from, w: 820, h: 560, r: 44, bg: colors.white },
  { at: SCENES.bug.from, w: 880, h: 200, r: 100, bg: colors.ink },
  { at: SCENES.results.from, w: 820, h: 600, r: 44, bg: colors.white },
  { at: SCENES.agents.from, w: 880, h: 200, r: 100, bg: colors.ink },
  { at: SCENES.close.from, w: 860, h: 420, r: 56, bg: colors.white },
];
