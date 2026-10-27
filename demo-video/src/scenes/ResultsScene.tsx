import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { clamp, easeBack, easeOut } from "../anim";
import { requirements, runDuration, toolCalls } from "../data";
import { colors, mono, sans } from "../theme";

const FIRST_CHECK = 18;
const CHECK_GAP = 9;

// The verdict table: each requirement ticks green in execution order.
export const ResultsScene = () => {
  const frame = useCurrentFrame();
  const passed = requirements.filter((_, i) => frame >= FIRST_CHECK + i * CHECK_GAP).length;
  const done = interpolate(frame, [FIRST_CHECK + requirements.length * CHECK_GAP, FIRST_CHECK + requirements.length * CHECK_GAP + 10], [0, 1], {
    ...clamp,
    easing: easeOut,
  });

  return (
    <div style={{ position: "absolute", inset: 0, padding: "30px 40px", display: "flex", flexDirection: "column", fontFamily: sans }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 30, fontWeight: 600, color: colors.ink }}>NoteAI · Pruebas E2E</div>
        <div style={{ fontFamily: mono, fontSize: 18, color: colors.muted, background: colors.surface, borderRadius: 16, padding: "6px 12px" }}>
          chromium
        </div>
      </div>
      {requirements.map((req, i) => {
        const at = FIRST_CHECK + i * CHECK_GAP;
        const check = interpolate(frame, [at, at + 8], [0, 1], { ...clamp, easing: easeBack });
        return (
          <div
            key={req.id}
            style={{
              height: 60,
              display: "flex",
              alignItems: "center",
              gap: 20,
              borderTop: `2px solid ${colors.line}`,
            }}
          >
            <div style={{ fontFamily: mono, fontSize: 20, color: colors.muted, width: 80 }}>{req.id}</div>
            <div style={{ flex: 1, fontSize: 24, color: colors.ink }}>{req.label}</div>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `2px solid ${interpolateColors(Math.min(1, check), [0, 1], ["#D5D2CB", colors.green])}`,
                background: interpolateColors(Math.min(1, check), [0, 1], ["rgba(0,0,0,0)", colors.green]),
              }}
            >
              <svg width={20} height={20} viewBox="0 0 24 24" style={{ scale: check }}>
                <path d="M5 12.5l4.5 4.5L19 7.5" stroke={colors.white} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        );
      })}
      <div
        style={{
          marginTop: "auto",
          borderTop: `2px solid ${colors.line}`,
          paddingTop: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 700, color: passed === requirements.length ? colors.green : colors.ink }}>
          {passed}/{requirements.length} aprobados
        </div>
        <div style={{ fontSize: 22, color: colors.muted, opacity: done }}>
          {runDuration} · {toolCalls} acciones
        </div>
      </div>
    </div>
  );
};
