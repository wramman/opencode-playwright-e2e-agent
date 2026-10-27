import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
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
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14, ...rise(frame, 30) }}>
        <Img src={staticFile("brand/opencode/opencode-wordmark-light.svg")} style={{ height: 30 }} />
        <div style={{ fontFamily: mono, fontSize: 22, color: colors.muted }}>+ Playwright MCP · cualquier LLM</div>
      </div>
      <div style={{ fontFamily: mono, fontSize: 18, color: colors.muted, ...rise(frame, 38) }}>Proyecto académico · demo hecha con OpenCode</div>
    </div>
  );
};
