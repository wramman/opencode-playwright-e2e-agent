import React from "react";
import { AbsoluteFill, Interactive, interpolate, interpolateColors, Sequence, useCurrentFrame } from "remotion";
import { clamp, easeBack, easeInOut, easeOut, fadeInOut, useLayout } from "./anim";
import { captions, institution, team } from "./data";
import { AgentsScene } from "./scenes/AgentsScene";
import { APP_STAR_AT, APP_SUMMARIZE_AT, AppScene } from "./scenes/AppScene";
import { BugScene } from "./scenes/BugScene";
import { CloseScene } from "./scenes/CloseScene";
import { CodeScene } from "./scenes/CodeScene";
import { ResultsScene } from "./scenes/ResultsScene";
import { TUI_INPUT_CLICK_AT, TuiScene } from "./scenes/TuiScene";
import { colors, sans } from "./theme";
import { MORPH_FRAMES, SCENES, SceneId, SHAPE_KEYS } from "./timeline";

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

const shapeAt = (frame: number) => {
  let i = 0;
  while (i + 1 < SHAPE_KEYS.length && frame >= SHAPE_KEYS[i + 1].at) i++;
  const cur = SHAPE_KEYS[i];
  const prev = SHAPE_KEYS[Math.max(0, i - 1)];
  const t = interpolate(frame, [cur.at, cur.at + MORPH_FRAMES], [0, 1], { ...clamp, easing: easeBack });
  const c = interpolate(frame, [cur.at, cur.at + MORPH_FRAMES * 0.6], [0, 1], { ...clamp, easing: easeInOut });
  const mix = (a: number, b: number) => a + (b - a) * t;
  return {
    w: mix(prev.w, cur.w),
    h: mix(prev.h, cur.h),
    r: Math.max(0, mix(prev.r, cur.r)),
    bg: interpolateColors(c, [0, 1], [prev.bg, cur.bg]),
  };
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

      {CAPTION_SCENES.map((id) => (
        <Sequence key={id} name={`Caption ${id}`} from={SCENES[id].from} durationInFrames={SCENES[id].dur}>
          <Caption id={id} />
        </Sequence>
      ))}

      <Cursor cx={layout.shapeX} cy={layout.shapeY} />
    </AbsoluteFill>
  );
};

const SceneBox = ({ w, h, dur, last, children }: { w: number; h: number; dur: number; last: boolean; children: React.ReactNode }) => {
  const frame = useCurrentFrame();
  const opacity = last ? interpolate(frame, [8, 18], [0, 1], { ...clamp, easing: easeOut }) : fadeInOut(frame, dur);
  return (
    <div style={{ position: "absolute", left: "50%", top: "50%", width: w, height: h, translate: "-50% -50%", opacity }}>{children}</div>
  );
};
