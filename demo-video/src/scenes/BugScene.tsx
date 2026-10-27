import { interpolate, useCurrentFrame } from "remotion";
import { clamp, easeBack, easeOut } from "../anim";
import { bug } from "../data";
import { colors, mono, sans } from "../theme";

// Toast reporting the real defect the agent found in NotesAI.
export const BugScene = () => {
  const frame = useCurrentFrame();
  const icon = interpolate(frame, [12, 24], [0, 1], { ...clamp, easing: easeBack });
  const text = interpolate(frame, [18, 32], [0, 1], { ...clamp, easing: easeOut });

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 44px", gap: 28, fontFamily: sans }}>
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          flexShrink: 0,
          background: colors.amber,
          color: colors.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 50,
          fontWeight: 700,
          scale: icon,
        }}
      >
        !
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          opacity: text,
          translate: interpolate(text, [0, 1], ["0px 14px", "0px 0px"]),
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 600, color: colors.white }}>{bug.title}</div>
        <div style={{ fontSize: 25, color: colors.mutedOnInk }}>{bug.detail}</div>
      </div>
      <div
        style={{
          fontFamily: mono,
          fontSize: 22,
          color: colors.amber,
          border: `2px solid ${colors.amber}`,
          borderRadius: 20,
          padding: "6px 14px",
          flexShrink: 0,
          opacity: text,
        }}
      >
        RF-01
      </div>
    </div>
  );
};
