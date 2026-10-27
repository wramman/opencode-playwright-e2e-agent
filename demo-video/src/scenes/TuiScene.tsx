import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { clamp, easeInOut, easeOut } from "../anim";
import { agentSteps, prompt, toolCalls } from "../data";
import { mono, tui } from "../theme";

export const TUI_INPUT_CLICK_AT = 14;
const TYPE_FROM = 22;
const TYPE_TO = 74;
const ENTER_AT = 84;
const SEND_TO = 100;
const STEPS_FROM = 110;
const STEP_GAP = 15;

const Bar = ({ color }: { color: string }) => (
  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: color }} />
);

// OpenCode's TUI (Kanagawa theme, as captured on the demo machine): the home
// screen with the prompt being typed, then the agent listing the tools it runs.
export const TuiScene = () => {
  const frame = useCurrentFrame();
  const chars = Math.round(interpolate(frame, [TYPE_FROM, TYPE_TO], [0, prompt.length], clamp));
  const caretOn = (frame >= TYPE_FROM && frame < TYPE_TO) || Math.floor(frame / 8) % 2 === 0;
  const sent = interpolate(frame, [ENTER_AT, SEND_TO], [0, 1], { ...clamp, easing: easeInOut });
  const working = frame >= SEND_TO;
  const visibleSteps = agentSteps.filter((_, i) => frame >= STEPS_FROM + i * STEP_GAP).length;
  const count = Math.round(interpolate(frame, [STEPS_FROM, STEPS_FROM + agentSteps.length * STEP_GAP], [1, toolCalls], clamp));

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: mono, fontSize: 22, color: tui.text }}>
      {/* Home screen wordmark, leaves when the prompt is sent. */}
      <Img
        src={staticFile("brand/opencode/opencode-wordmark-dark.svg")}
        style={{
          position: "absolute",
          left: "50%",
          top: 120,
          width: 380,
          translate: interpolate(sent, [0, 1], ["-50% 0px", "-50% -40px"]),
          opacity: 1 - sent,
        }}
      />

      {/* Prompt box: input on the home screen, then the sent user message at the top. */}
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: interpolate(sent, [0, 1], [270, 30]),
          minHeight: 92,
          background: interpolate(sent, [0, 1], [0, 1]) < 0.5 ? tui.input : tui.panel,
          padding: "20px 24px 18px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <Bar color={tui.accent} />
        <div style={{ whiteSpace: "nowrap", fontSize: 24 }}>
          {chars === 0 ? <span style={{ color: tui.muted }}>Ask anything…</span> : prompt.slice(0, chars)}
          {!working && <span style={{ opacity: caretOn ? 1 : 0, background: tui.text, marginLeft: 2 }}>&nbsp;</span>}
        </div>
        <div style={{ fontSize: 18, opacity: 1 - sent }}>
          GPT-6 Luna<span style={{ color: tui.muted }}> OpenCode Go · </span>
          <span style={{ color: tui.warn }}>high</span>
        </div>
      </div>

      {/* Agent steps, one per tool call shown. */}
      <div style={{ position: "absolute", left: 64, right: 40, top: 150, display: "flex", flexDirection: "column", gap: 16 }}>
        {agentSteps.slice(0, visibleSteps).map((step, i) => {
          const at = STEPS_FROM + i * STEP_GAP;
          return (
            <div
              key={step.tool + i}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                opacity: interpolate(frame, [at, at + 6], [0, 1], clamp),
                translate: interpolate(frame, [at, at + 8], ["0px 10px", "0px 0px"], { ...clamp, easing: easeOut }),
              }}
            >
              <span style={{ color: step.tool === "skill" ? tui.muted : tui.ok }}>{step.tool === "skill" ? "→" : "✓"}</span>{" "}
              <span>{step.tool === "skill" ? "Skill" : step.tool}</span> <span style={{ color: tui.muted }}>{step.args}</span>
            </div>
          );
        })}
      </div>

      {/* Bottom input and status line while the agent works. */}
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          bottom: 58,
          height: 64,
          background: tui.input,
          opacity: interpolate(frame, [SEND_TO - 4, SEND_TO + 6], [0, 1], clamp),
        }}
      >
        <Bar color={tui.accent} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          bottom: 18,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 18,
          color: tui.muted,
          opacity: interpolate(frame, [SEND_TO - 4, SEND_TO + 6], [0, 1], clamp),
        }}
      >
        <div>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ color: Math.floor(frame / 4) % 4 === i ? tui.accent : tui.input }}>
              ▪
            </span>
          ))}{" "}
          <span style={{ color: tui.text }}>esc</span> interrupt
        </div>
        <div>
          acción {count} de {toolCalls} · <span style={{ color: tui.text }}>ctrl+p</span> commands
        </div>
      </div>
    </div>
  );
};
