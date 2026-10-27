import { interpolate, useCurrentFrame } from "remotion";
import { clamp, easeInOut, easeOut } from "../anim";
import { agentTools, toolCalls } from "../data";
import { colors, mono, sans } from "../theme";

const WIDEN_AT = 40;
const TOOLS_FROM = 50;
const TOOL_FRAMES = 10;

// The agent at work: a loader that widens to show the browser actions it runs.
export const AgentScene = () => {
  const frame = useCurrentFrame();
  const widen = interpolate(frame, [WIDEN_AT, WIDEN_AT + 16], [0, 1], { ...clamp, easing: easeInOut });
  const toolIndex = Math.min(agentTools.length - 1, Math.max(0, Math.floor((frame - TOOLS_FROM) / TOOL_FRAMES)));
  const toolPhase = (frame - TOOLS_FROM - toolIndex * TOOL_FRAMES) / TOOL_FRAMES;
  const count = Math.round(interpolate(frame, [TOOLS_FROM, 88], [1, toolCalls], clamp));

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg
        width={120}
        height={120}
        viewBox="0 0 120 120"
        style={{
          position: "absolute",
          top: "50%",
          left: interpolate(widen, [0, 1], [380, 130]),
          translate: "-50% -50%",
          scale: interpolate(widen, [0, 1], [1, 0.8]),
          rotate: `${frame * 9}deg`,
        }}
      >
        <circle cx={60} cy={60} r={46} stroke="#3A3A3A" strokeWidth={10} fill="none" />
        <circle
          cx={60}
          cy={60}
          r={46}
          stroke={colors.white}
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 46 * 0.28} ${2 * Math.PI * 46}`}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 230,
          top: "50%",
          translate: "0 -50%",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          opacity: interpolate(frame, [TOOLS_FROM - 6, TOOLS_FROM + 4], [0, 1], clamp),
        }}
      >
        <div style={{ fontFamily: sans, fontSize: 24, color: colors.mutedOnInk }}>
          OpenCode · acción {count} de {toolCalls}
        </div>
        <div style={{ height: 46, overflow: "hidden" }}>
          <div
            style={{
              fontFamily: mono,
              fontSize: 38,
              color: colors.white,
              translate: interpolate(toolPhase, [0, 0.35], ["0px 40px", "0px 0px"], { ...clamp, easing: easeOut }),
            }}
          >
            {agentTools[toolIndex]}()
          </div>
        </div>
      </div>
    </div>
  );
};
