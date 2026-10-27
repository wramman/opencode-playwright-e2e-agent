import React from "react";
import { AbsoluteFill, Interactive, interpolate, interpolateColors, Sequence, useCurrentFrame } from "remotion";
import { clamp, easeBack, easeInOut, easeOut, useLayout } from "./anim";
import { captions, institution, team } from "./data";
import { AgentsScene } from "./scenes/AgentsScene";
import { APP_STAR_AT, APP_SUMMARIZE_AT, AppScene } from "./scenes/AppScene";
import { BugScene } from "./scenes/BugScene";
import { CloseScene } from "./scenes/CloseScene";
import { CodeScene } from "./scenes/CodeScene";
import { ResultsScene } from "./scenes/ResultsScene";
import { TUI_INPUT_CLICK_AT, TuiScene } from "./scenes/TuiScene";
import { colors, sans } from "./theme";
import { CAMERA_KEYS, CameraKey, CONTENT_OUT_LEAD, MORPH_FRAMES, Satellite, SATELLITES, SCENES, SceneId, SHAPE_KEYS } from "./timeline";

// Content layers inside the shape, sized like the shape they settle into.
// The OpenCode window spans both the prompt and the agent scenes.
const SCENE_LAYERS: { id: string; from: number; dur: number; w: number; h: number; Component: React.FC }[] = [
  { id: "code", ...SCENES.code, w: 860, h: 190, Component: CodeScene },
  { id: "tui", from: SCENES.prompt.from, dur: SCENES.prompt.dur + SCENES.agent.dur, w: 880, h: 560, Component: TuiScene },
  { id: "app", ...SCENES.app, w: 820, h: 560, Component: AppScene },
  { id: "bug", ...SCENES.bug, w: 880, h: 200, Component: BugScene },
  { id: "results", ...SCENES.results, w: 820, h: 600, Component: ResultsScene },
  { id: "agents", ...SCENES.agents, w: 880, h: 200, Component: AgentsScene },
  { id: "close", ...SCENES.close, w: 860, h: 420, Component: CloseScene },
];

const CAPTION_SCENES = Object.keys(SCENES) as SceneId[];

type ShapeState = { w: number; h: number; r: number; bg: string };

const morph = (from: ShapeState, to: ShapeState, elapsed: number): ShapeState => {
  const t = interpolate(elapsed, [0, MORPH_FRAMES], [0, 1], { ...clamp, easing: easeBack });
  const c = interpolate(elapsed, [0, MORPH_FRAMES * 0.6], [0, 1], { ...clamp, easing: easeInOut });
  const mix = (a: number, b: number) => a + (b - a) * t;
  return { w: mix(from.w, to.w), h: mix(from.h, to.h), r: Math.max(0, mix(from.r, to.r)), bg: interpolateColors(c, [0, 1], [from.bg, to.bg]) };
};

// Each morph starts from wherever the previous one was, so a key that lands
// before the previous morph finishes never makes the shape jump.
const shapeAt = (frame: number): ShapeState => {
  let from: ShapeState = SHAPE_KEYS[0];
  let to: ShapeState = SHAPE_KEYS[0];
  let start = SHAPE_KEYS[0].at;
  for (let k = 1; k < SHAPE_KEYS.length && frame >= SHAPE_KEYS[k].at; k++) {
    from = morph(from, to, SHAPE_KEYS[k].at - start);
    to = SHAPE_KEYS[k];
    start = SHAPE_KEYS[k].at;
  }
  const state = morph(from, to, frame - start);
  return { ...state, w: Math.max(0, state.w), h: Math.max(0, state.h) };
};

const cameraAt = (frame: number) => {
  const at = CAMERA_KEYS.map((k) => k.at);
  const value = (key: keyof Omit<CameraKey, "at">) =>
    interpolate(frame, at, CAMERA_KEYS.map((k) => k[key]), { ...clamp, easing: easeInOut });
  return { z: value("z"), fx: value("fx"), fy: value("fy"), rx: value("rx"), ry: value("ry"), rz: value("rz") };
};

// Wraps the shape, its satellites and the cursor; captions stay outside so
// they never leave the safe area while the camera moves.
const Camera = ({ cx, cy, shapeW, children }: { cx: number; cy: number; shapeW: number; children: React.ReactNode }) => {
  const frame = useCurrentFrame();
  const layout = useLayout();
  const c = cameraAt(frame);
  // Zoom around the focus point, plus a slow handheld drift.
  let tx = c.fx * (1 - c.z) + Math.sin(frame / 38) * 6;
  const ty = c.fy * (1 - c.z) + Math.cos(frame / 47) * 5;
  // In the horizontal layout the captions sit left of the shape: push the
  // stage right when a zoom would make the shape overlap them.
  if (!layout.vertical) {
    const minLeft = layout.caption.left + layout.caption.width + 40;
    const left = cx + tx - (c.z * shapeW) / 2;
    if (left < minLeft) tx += minLeft - left;
  }
  return (
    <AbsoluteFill style={{ perspective: 1800, perspectiveOrigin: `${cx}px ${cy}px` }}>
      <AbsoluteFill
        style={{
          transformOrigin: `${cx}px ${cy}px`,
          transform: `translate(${tx}px, ${ty}px) rotateX(${c.rx}deg) rotateY(${c.ry}deg) rotateZ(${c.rz}deg) scale(${c.z})`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SatelliteShape = ({ s, cx, cy }: { s: Satellite; cx: number; cy: number }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [s.from, s.from + 16], [0, 1], { ...clamp, easing: easeBack });
  const back = interpolate(frame, [s.to - 12, s.to], [1, 0], { ...clamp, easing: easeInOut });
  const t = Math.min(out, back);
  if (t <= 0) return null;
  const tx = s.ax * (s.sw / 2);
  const ty = s.ay * (s.sh / 2 + s.m + s.h / 2);
  const bob = Math.sin((frame - s.from) / 11 + s.ax * 3) * 7;
  return (
    <div
      style={{
        position: "absolute",
        left: cx + tx * t - s.w / 2,
        top: cy + ty * t + bob * t - s.h / 2,
        width: s.w,
        height: s.h,
        borderRadius: s.r,
        background: s.bg,
        scale: t,
        rotate: `${(1 - t) * s.ax * 40}deg`,
        boxShadow: "0 16px 30px -14px rgba(40, 35, 25, 0.35)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {s.kind === "note" && (
        <div style={{ position: "absolute", inset: 0, padding: 16, display: "flex", flexDirection: "column", gap: 9 }}>
          <div style={{ width: 6, height: 20, borderRadius: 3, background: s.accent }} />
          <div style={{ height: 9, borderRadius: 5, background: "#E3E6EA", width: "80%" }} />
          <div style={{ height: 9, borderRadius: 5, background: "#E3E6EA", width: "60%" }} />
        </div>
      )}
      {s.kind === "check" && (
        <svg width={s.w * 0.5} height={s.w * 0.5} viewBox="0 0 24 24">
          <path d="M5 12.5l4.5 4.5L19 7.5" stroke={colors.white} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
};

// Cursor path relative to the shape center; `click` frames dip the cursor.
const CURSOR_KEYS = [
  { at: SCENES.prompt.from - 4, x: 360, y: 220, o: 0 },
  { at: SCENES.prompt.from + 6, x: 360, y: 220, o: 1 },
  { at: SCENES.prompt.from + TUI_INPUT_CLICK_AT, x: -200, y: 40, o: 1, click: true },
  { at: SCENES.prompt.from + 36, x: -200, y: 40, o: 0 },
  { at: SCENES.app.from + 80, x: 470, y: 300, o: 0 },
  { at: SCENES.app.from + 84, x: 470, y: 300, o: 1 },
  { at: SCENES.app.from + APP_STAR_AT, x: 350, y: -218, o: 1, click: true },
  { at: SCENES.app.from + APP_SUMMARIZE_AT, x: 340, y: 128, o: 1, click: true },
  { at: SCENES.app.from + APP_SUMMARIZE_AT + 22, x: 340, y: 128, o: 0 },
];

const Cursor = ({ cx, cy }: { cx: number; cy: number }) => {
  const frame = useCurrentFrame();
  const at = CURSOR_KEYS.map((k) => k.at);
  const x = interpolate(frame, at, CURSOR_KEYS.map((k) => k.x), { ...clamp, easing: easeInOut });
  const y = interpolate(frame, at, CURSOR_KEYS.map((k) => k.y), { ...clamp, easing: easeInOut });
  const opacity = interpolate(frame, at, CURSOR_KEYS.map((k) => k.o), clamp);
  const press = CURSOR_KEYS.filter((k) => k.click).reduce(
    (s, k) => Math.min(s, interpolate(frame, [k.at - 2, k.at + 1, k.at + 6], [1, 0.82, 1], clamp)),
    1,
  );
  return (
    <svg
      width={46}
      height={46}
      viewBox="0 0 24 24"
      style={{ position: "absolute", left: cx + x, top: cy + y, opacity, scale: press, transformOrigin: "0 0" }}
    >
      <path d="M4 2.5l15 8.6-6.6 1.6-2.9 6.4z" fill={colors.ink} stroke={colors.white} strokeWidth={1.4} strokeLinejoin="round" />
    </svg>
  );
};

const Caption = ({ id }: { id: SceneId }) => {
  const frame = useCurrentFrame();
  const layout = useLayout();
  const { dur } = SCENES[id];
  const text = id === "close" ? null : captions[id];
  const appear = interpolate(frame, [6, 20], [0, 1], { ...clamp, easing: easeOut });
  const leave = interpolate(frame, [dur - 10, dur], [1, 0], clamp);

  return (
    <Interactive.Div
      name={`Caption ${id}`}
      style={{
        position: "absolute",
        left: layout.caption.left,
        top: layout.caption.top,
        width: layout.caption.width,
        height: layout.caption.height,
        display: "flex",
        flexDirection: "column",
        justifyContent: layout.vertical ? "flex-start" : "center",
        textAlign: layout.vertical ? "center" : "left",
        gap: 20,
        fontFamily: sans,
        opacity: Math.min(appear, id === "close" ? 1 : leave),
        translate: interpolate(appear, [0, 1], ["0px 24px", "0px 0px"]),
      }}
    >
      {text ? (
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.08, color: colors.ink, letterSpacing: -1.5 }}>{text}</div>
      ) : (
        <>
          <div style={{ fontSize: 44, fontWeight: 600, color: colors.ink }}>{institution}</div>
          <div style={{ fontSize: 34, lineHeight: 1.45, color: colors.muted }}>{team.join(" · ")}</div>
        </>
      )}
    </Interactive.Div>
  );
};

export const OneShape = () => {
  const frame = useCurrentFrame();
  const layout = useLayout();
  const shape = shapeAt(frame);
  const intro = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: easeOut });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, fontFamily: sans }}>
      <Camera cx={layout.shapeX} cy={layout.shapeY} shapeW={shape.w}>
        {SATELLITES.map((s, i) => (
          <SatelliteShape key={i} s={s} cx={layout.shapeX} cy={layout.shapeY} />
        ))}
        <Interactive.Div
          name="Shape"
          style={{
            position: "absolute",
            left: layout.shapeX - shape.w / 2,
            top: layout.shapeY - shape.h / 2,
            width: shape.w,
            height: shape.h,
            borderRadius: shape.r,
            backgroundColor: shape.bg,
            overflow: "hidden",
            opacity: intro,
            scale: interpolate(intro, [0, 1], [0.7, 1]),
            boxShadow: "0 30px 60px -20px rgba(40, 35, 25, 0.35), 0 8px 18px -8px rgba(40, 35, 25, 0.25)",
          }}
        >
          {SCENE_LAYERS.map(({ id, from, dur, w, h, Component }) => (
            <Sequence key={id} name={`Scene ${id}`} from={from} durationInFrames={dur}>
              <SceneBox w={w} h={h} dur={dur} last={id === "close"}>
                <Component />
              </SceneBox>
            </Sequence>
          ))}
        </Interactive.Div>
        <Cursor cx={layout.shapeX} cy={layout.shapeY} />
      </Camera>

      {CAPTION_SCENES.map((id) => (
        <Sequence key={id} name={`Caption ${id}`} from={SCENES[id].from} durationInFrames={SCENES[id].dur}>
          <Caption id={id} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const SceneBox = ({ w, h, dur, last, children }: { w: number; h: number; dur: number; last: boolean; children: React.ReactNode }) => {
  const frame = useCurrentFrame();
  // Content is gone before the in-between shape state starts shrinking.
  const fadeOutEnd = dur - CONTENT_OUT_LEAD;
  const opacity = last
    ? interpolate(frame, [8, 18], [0, 1], { ...clamp, easing: easeOut })
    : interpolate(frame, [8, 18, fadeOutEnd - 8, fadeOutEnd], [0, 1, 1, 0], { ...clamp, easing: easeOut });
  return (
    <div style={{ position: "absolute", left: "50%", top: "50%", width: w, height: h, translate: "-50% -50%", opacity }}>{children}</div>
  );
};
