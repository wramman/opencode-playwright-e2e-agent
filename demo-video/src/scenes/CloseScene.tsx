import { interpolate, useCurrentFrame } from "remotion";
import { clamp, easeOut } from "../anim";
import { tagline, title } from "../data";
import { colors, mono, sans } from "../theme";

const rise = (frame: number, at: number) => ({
  opacity: interpolate(frame, [at, at + 12], [0, 1], { ...clamp, easing: easeOut }),
  translate: interpolate(frame, [at, at + 12], ["0px 18px", "0px 0px"], { ...clamp, easing: easeOut }),
});

// Closing card: title, tagline and the stack.
export const CloseScene = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
        padding: "0 56px",
        textAlign: "center",
        fontFamily: sans,
      }}
    >
      <div style={{ fontSize: 56, fontWeight: 700, color: colors.ink, lineHeight: 1.1, ...rise(frame, 10) }}>{title}</div>
      <div style={{ fontSize: 32, color: colors.muted, ...rise(frame, 20) }}>{tagline}</div>
      <div style={{ fontFamily: mono, fontSize: 22, color: colors.muted, marginTop: 10, ...rise(frame, 30) }}>
        OpenCode · Playwright MCP · cualquier LLM
      </div>
    </div>
  );
};
