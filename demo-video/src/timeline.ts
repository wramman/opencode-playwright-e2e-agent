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

// Scene content fades out this many frames before its window ends, leaving
// room for the in-between shape states.
export const CONTENT_OUT_LEAD = 12;

export type ShapeKey = {
  at: number;
  w: number;
  h: number;
  r: number;
  bg: string;
};

const pulse = (at: number, bg: string = colors.ink): ShapeKey => ({ at, w: 150, h: 150, r: 75, bg });

export const SHAPE_KEYS: ShapeKey[] = [
  { at: SCENES.code.from, w: 860, h: 190, r: 95, bg: colors.ink },
  pulse(SCENES.prompt.from - CONTENT_OUT_LEAD),
  // Prompt and agent scenes share one OpenCode window.
  { at: SCENES.prompt.from, w: 880, h: 560, r: 28, bg: tui.bg },
  { at: SCENES.app.from - CONTENT_OUT_LEAD, w: 220, h: 220, r: 40, bg: colors.white },
  { at: SCENES.app.from, w: 820, h: 560, r: 44, bg: colors.white },
  { at: SCENES.bug.from - CONTENT_OUT_LEAD, w: 320, h: 96, r: 48, bg: colors.white },
  { at: SCENES.bug.from, w: 880, h: 200, r: 100, bg: colors.ink },
  pulse(SCENES.results.from - CONTENT_OUT_LEAD, colors.amber),
  { at: SCENES.results.from, w: 820, h: 600, r: 44, bg: colors.white },
  pulse(SCENES.agents.from - CONTENT_OUT_LEAD, colors.green),
  { at: SCENES.agents.from, w: 880, h: 200, r: 100, bg: colors.ink },
  pulse(SCENES.close.from - CONTENT_OUT_LEAD, colors.white),
  { at: SCENES.close.from, w: 860, h: 420, r: 56, bg: colors.white },
];

// Camera keyframes. `z` zooms around the focus point (fx, fy), given relative
// to the shape center; rx/ry/rz tilt the stage in degrees.
export type CameraKey = { at: number; z: number; fx: number; fy: number; rx: number; ry: number; rz: number };

const cam = (at: number, z = 1, fx = 0, fy = 0, rx = 0, ry = 0, rz = 0): CameraKey => ({ at, z, fx, fy, rx, ry, rz });

export const CAMERA_KEYS: CameraKey[] = [
  cam(0, 1.18, 0, 0, 10, 0, -3),
  cam(24),
  cam(42),
  cam(48, 1.08),
  cam(72),
  cam(SCENES.prompt.from - 4),
  cam(SCENES.prompt.from + 8, 0.96, 0, 0, 6, -10),
  cam(SCENES.prompt.from + 46, 1, 0, 40, 0, -4),
  cam(SCENES.prompt.from + 80, 1.06, 0, 40),
  cam(SCENES.prompt.from + 87, 1.1, 0, 40),
  cam(SCENES.prompt.from + 100),
  cam(SCENES.agent.from + 50, 1.05, 0, -60, 3),
  cam(SCENES.app.from - 2),
  cam(SCENES.app.from + 80),
  cam(SCENES.app.from + 92, 1.35, 350, -218),
  cam(SCENES.app.from + 104, 1.35, 350, -218),
  cam(SCENES.app.from + 114, 1.3, 300, 150),
  cam(SCENES.app.from + 132, 1.3, 300, 150),
  cam(SCENES.app.from + 146),
  cam(SCENES.bug.from + 2, 1.12, 0, 0, 0, 0, 3),
  cam(SCENES.bug.from + 22),
  cam(SCENES.results.from),
  cam(SCENES.results.from + 20, 0.97, 0, 0, 6, 6),
  cam(SCENES.results.from + 60, 1.02),
  cam(SCENES.results.from + 82, 1.02),
  cam(SCENES.results.from + 94, 1.25, -200, 255),
  cam(SCENES.results.from + 108, 1.25, -200, 255),
  cam(SCENES.agents.from),
  cam(SCENES.agents.from + 40, 1, 0, 0, 0, -6),
  cam(SCENES.agents.from + 78, 1, 0, 0, 0, 6),
  cam(SCENES.close.from, 1.12, 0, 0, 8),
  cam(SCENES.close.from + 30),
  cam(SCENES.close.from + SCENES.close.dur, 1.03),
];

// Secondary shapes that slip out from under the main shape, float, and tuck
// back in. Placement is relative to the settled scene shape (sw x sh):
// ax in -1..1 along its width, ay = -1 above / 1 below, m = gap to the edge.
export type Satellite = {
  from: number;
  to: number;
  w: number;
  h: number;
  r: number;
  bg: string;
  sw: number;
  sh: number;
  ax: number;
  ay: number;
  m: number;
  kind?: "note" | "check";
  accent?: string;
};

const S = SCENES;

export const SATELLITES: Satellite[] = [
  { from: 12, to: S.code.dur - 14, w: 54, h: 54, r: 27, bg: colors.ink, sw: 860, sh: 190, ax: 0.78, ay: -1, m: 70 },
  { from: 18, to: S.code.dur - 14, w: 130, h: 42, r: 21, bg: colors.white, sw: 860, sh: 190, ax: -0.6, ay: 1, m: 70 },
  { from: S.prompt.from + 10, to: S.app.from - 16, w: 64, h: 64, r: 32, bg: tui.input, sw: 880, sh: 560, ax: 0.82, ay: -1, m: 56 },
  { from: S.prompt.from + 18, to: S.app.from - 16, w: 160, h: 48, r: 24, bg: colors.ink, sw: 880, sh: 560, ax: -0.68, ay: -1, m: 56 },
  { from: S.prompt.from + 26, to: S.app.from - 16, w: 46, h: 46, r: 23, bg: tui.accent, sw: 880, sh: 560, ax: 0.5, ay: 1, m: 56 },
  { from: S.app.from + 12, to: S.bug.from - 16, w: 170, h: 104, r: 18, bg: colors.white, sw: 820, sh: 560, ax: -0.72, ay: -1, m: 48, kind: "note", accent: colors.violet },
  { from: S.app.from + 22, to: S.bug.from - 16, w: 140, h: 86, r: 16, bg: colors.white, sw: 820, sh: 560, ax: 0.7, ay: 1, m: 48, kind: "note", accent: colors.green },
  { from: S.bug.from + 14, to: S.results.from - 16, w: 52, h: 52, r: 26, bg: colors.amber, sw: 880, sh: 200, ax: 0.8, ay: -1, m: 64 },
  { from: S.bug.from + 20, to: S.results.from - 16, w: 110, h: 38, r: 19, bg: colors.ink, sw: 880, sh: 200, ax: -0.55, ay: 1, m: 64 },
  { from: S.results.from + 84, to: S.agents.from - 14, w: 58, h: 58, r: 29, bg: colors.green, sw: 820, sh: 600, ax: -0.8, ay: -1, m: 52, kind: "check" },
  { from: S.results.from + 88, to: S.agents.from - 14, w: 46, h: 46, r: 23, bg: colors.green, sw: 820, sh: 600, ax: 0.84, ay: -1, m: 52, kind: "check" },
  { from: S.results.from + 92, to: S.agents.from - 14, w: 52, h: 52, r: 26, bg: colors.green, sw: 820, sh: 600, ax: 0.62, ay: 1, m: 52, kind: "check" },
  { from: S.agents.from + 10, to: S.close.from - 14, w: 50, h: 50, r: 25, bg: colors.white, sw: 880, sh: 200, ax: -0.7, ay: -1, m: 64 },
  { from: S.agents.from + 16, to: S.close.from - 14, w: 120, h: 40, r: 20, bg: colors.ink, sw: 880, sh: 200, ax: 0.6, ay: 1, m: 64 },
  { from: S.close.from + 20, to: TOTAL_FRAMES + 30, w: 56, h: 56, r: 28, bg: colors.ink, sw: 860, sh: 420, ax: -0.85, ay: -1, m: 50 },
  { from: S.close.from + 26, to: TOTAL_FRAMES + 30, w: 120, h: 40, r: 20, bg: colors.ink, sw: 860, sh: 420, ax: 0.75, ay: -1, m: 50 },
  { from: S.close.from + 32, to: TOTAL_FRAMES + 30, w: 44, h: 44, r: 22, bg: colors.green, sw: 860, sh: 420, ax: 0.8, ay: 1, m: 50 },
  { from: S.close.from + 38, to: TOTAL_FRAMES + 30, w: 140, h: 44, r: 22, bg: colors.white, sw: 860, sh: 420, ax: -0.6, ay: 1, m: 50 },
];
