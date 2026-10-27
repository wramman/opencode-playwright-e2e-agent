import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { clamp, easeOut } from "../anim";
import { colors, mono } from "../theme";

const BREAK_AT = 42;

// A brittle selector that breaks: the line shakes and turns red.
export const CodeScene = () => {
  const frame = useCurrentFrame();
  const broken = interpolate(frame, [BREAK_AT, BREAK_AT + 6], [0, 1], clamp);
  const shake = frame >= BREAK_AT && frame < BREAK_AT + 18 ? Math.sin(frame * 2.4) * 10 * (1 - (frame - BREAK_AT) / 18) : 0;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 56px",
        gap: 14,
        fontFamily: mono,
        translate: `${shake}px 0px`,
      }}
    >
      <div style={{ position: "relative", height: 30, fontSize: 24 }}>
        <div style={{ position: "absolute", color: colors.mutedOnInk, opacity: 1 - broken }}>todo.spec.ts · línea 42</div>
        <div
          style={{
            position: "absolute",
            color: colors.red,
            opacity: broken,
            translate: interpolate(frame, [BREAK_AT, BREAK_AT + 10], ["0px 12px", "0px 0px"], {
              ...clamp,
              easing: easeOut,
            }),
          }}
        >
          ✕ TimeoutError: locator not found
        </div>
      </div>
      <div style={{ fontSize: 30, color: colors.white, whiteSpace: "nowrap" }}>
        page.locator(
        <span
          style={{
            color: interpolateColors(broken, [0, 1], ["#9AD1A6", colors.red]),
            textDecoration: broken > 0.5 ? "line-through" : "none",
            textDecorationColor: colors.red,
          }}
        >
          'div:nth-child(3) &gt; .btn'
        </span>
        )
      </div>
    </div>
  );
};
