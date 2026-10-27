import { interpolate, useCurrentFrame } from "remotion";
import { clamp, easeOut } from "../anim";
import { agents } from "../data";
import { colors, mono, sans } from "../theme";

const ROTATE_FROM = 14;
const NAME_FRAMES = 14;

// The same MCP base works under any agent: the agent name keeps rotating.
export const AgentsScene = () => {
  const frame = useCurrentFrame();
  const index = Math.min(agents.length - 1, Math.max(0, Math.floor((frame - ROTATE_FROM) / NAME_FRAMES)));
  const phase = (frame - ROTATE_FROM - index * NAME_FRAMES) / NAME_FRAMES;
  const isLast = index === agents.length - 1;

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 48px", gap: 24, fontFamily: sans }}>
      <div style={{ height: 60, overflow: "hidden", flex: 1, display: "flex", justifyContent: "flex-end" }}>
        <div
          style={{
            fontSize: 44,
            fontWeight: 600,
            color: isLast ? colors.green : colors.white,
            whiteSpace: "nowrap",
            translate: interpolate(phase, [0, 0.4], ["0px 54px", "0px 0px"], { ...clamp, easing: easeOut }),
          }}
        >
          {agents[index]}
        </div>
      </div>
      <div style={{ fontSize: 40, color: colors.mutedOnInk }}>+</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: mono,
          fontSize: 28,
          color: colors.white,
          border: "2px solid #3A3A3A",
          borderRadius: 40,
          padding: "14px 24px",
          flexShrink: 0,
        }}
      >
        <div style={{ width: 14, height: 14, borderRadius: 7, background: colors.green }} />
        Playwright MCP
      </div>
    </div>
  );
};
