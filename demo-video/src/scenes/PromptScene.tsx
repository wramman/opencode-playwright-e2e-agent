import { interpolate, useCurrentFrame } from "remotion";
import { clamp, easeOut } from "../anim";
import { prompt } from "../data";
import { colors, mono, sans } from "../theme";

const TYPE_FROM = 22;
const TYPE_TO = 74;
const ENTER_AT = 84;

// The test described in natural language, typed into the agent's input.
export const PromptScene = () => {
  const frame = useCurrentFrame();
  const chars = Math.round(interpolate(frame, [TYPE_FROM, TYPE_TO], [0, prompt.length], clamp));
  const typing = frame >= TYPE_FROM && frame < TYPE_TO;
  const caretOn = typing || Math.floor(frame / 8) % 2 === 0;
  const pressed = interpolate(frame, [ENTER_AT, ENTER_AT + 4, ENTER_AT + 10], [0, 1, 0.6], clamp);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        padding: "0 34px 0 52px",
        gap: 22,
      }}
    >
      <div style={{ fontFamily: mono, fontSize: 40, color: colors.green }}>&gt;</div>
      <div style={{ flex: 1, minWidth: 0, fontFamily: sans, fontSize: 34, fontWeight: 500, color: colors.ink, whiteSpace: "nowrap" }}>
        {chars === 0 ? <span style={{ color: colors.muted }}>Describe la prueba…</span> : prompt.slice(0, chars)}
        <span style={{ opacity: caretOn ? 1 : 0, color: colors.ink, marginLeft: 2 }}>|</span>
      </div>
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 40,
          fontFamily: sans,
          background: pressed > 0 ? colors.ink : colors.surface,
          color: pressed > 0 ? colors.white : colors.muted,
          scale: interpolate(pressed, [0, 1], [1, 0.88], { ...clamp, easing: easeOut }),
        }}
      >
        ↵
      </div>
    </div>
  );
};
