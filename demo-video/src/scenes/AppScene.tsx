import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { clamp, easeBack, easeOut } from "../anim";
import { colors, sans } from "../theme";

export const APP_STAR_AT = 96;
export const APP_SUMMARIZE_AT = 112;

const TITLE = "Reunión feria de innovación";
const EDIT = " - editada";

const Bar = ({ width, grow, color = "#E3E6EA" }: { width: number; grow: number; color?: string }) => (
  <div style={{ height: 14, borderRadius: 7, background: color, width: width * grow }} />
);

// A miniature NotesAI screen where the agent's actions play out.
export const AppScene = () => {
  const frame = useCurrentFrame();
  const titleChars = Math.round(interpolate(frame, [14, 46], [0, TITLE.length], clamp));
  const editChars = Math.round(interpolate(frame, [66, 80], [0, EDIT.length], clamp));
  const contentGrow = interpolate(frame, [50, 64], [0, 1], { ...clamp, easing: easeOut });
  const colorOn = interpolate(frame, [84, 90], [0, 1], clamp);
  const starOn = interpolate(frame, [APP_STAR_AT, APP_STAR_AT + 6], [0, 1], clamp);
  const summarizing = frame >= APP_SUMMARIZE_AT && frame < APP_SUMMARIZE_AT + 14;
  const summary = interpolate(frame, [APP_SUMMARIZE_AT + 14, APP_SUMMARIZE_AT + 26], [0, 1], { ...clamp, easing: easeOut });
  const newItem = interpolate(frame, [10, 22], [0, 1], { ...clamp, easing: easeOut });

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", fontFamily: sans }}>
      <div style={{ width: 220, background: colors.surface, padding: "26px 18px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            height: 46,
            borderRadius: 10,
            background: colors.noteBlue,
            color: colors.white,
            fontSize: 18,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          + Nueva Nota
        </div>
        {["#7CB7E8", "#E5484D", "#5BD08A", "#F2C94C"].map((c) => (
          <div key={c} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 4, height: 18, borderRadius: 2, background: c }} />
            <Bar width={130} grow={1} color="#DADDE2" />
          </div>
        ))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 6px",
            borderRadius: 8,
            background: "#E4E8EE",
            opacity: newItem,
            translate: interpolate(newItem, [0, 1], ["-14px 0px", "0px 0px"]),
          }}
        >
          <div
            style={{
              width: 4,
              height: 18,
              borderRadius: 2,
              background: interpolateColors(colorOn, [0, 1], ["#C9CED6", colors.violet]),
              scale: interpolate(frame, [84, 88, 94], [1, 1.6, 1], clamp),
            }}
          />
          <div style={{ fontSize: 15, color: colors.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: 160 }}>
            {TITLE.slice(0, titleChars)}
            {EDIT.slice(0, editChars)}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "34px 34px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 600, color: colors.ink, whiteSpace: "nowrap", overflow: "hidden" }}>
            {titleChars === 0 ? <span style={{ color: "#B5B9C0" }}>Sin Titulo</span> : TITLE.slice(0, titleChars)}
            {EDIT.slice(0, editChars)}
          </div>
          <svg
            width={34}
            height={34}
            viewBox="0 0 24 24"
            style={{ flexShrink: 0, scale: interpolate(starOn, [0, 0.5, 1], [1, 1.35, 1], { ...clamp, easing: easeBack }) }}
          >
            <path
              d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"
              fill={interpolateColors(starOn, [0, 1], ["rgba(0,0,0,0)", colors.amber])}
              stroke={interpolateColors(starOn, [0, 1], ["#9AA0A8", colors.amber])}
              strokeWidth={1.8}
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Bar width={500} grow={contentGrow} />
          <Bar width={460} grow={contentGrow} />
          <Bar width={320} grow={contentGrow} />
        </div>
        <div
          style={{
            marginTop: "auto",
            borderRadius: 14,
            background: colors.surface,
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 14, letterSpacing: 2, color: "#8C929B", fontWeight: 600 }}>RESUMEN</div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: colors.white,
                background: colors.noteBlue,
                borderRadius: 8,
                padding: "8px 14px",
                scale: interpolate(frame, [APP_SUMMARIZE_AT, APP_SUMMARIZE_AT + 3, APP_SUMMARIZE_AT + 8], [1, 0.9, 1], clamp),
              }}
            >
              {summarizing ? "Resumiendo…" : "Resumir"}
            </div>
          </div>
          <div style={{ minHeight: 66, fontSize: 17, lineHeight: 1.45, color: "#4A5059", opacity: summary }}>
            <b style={{ color: colors.ink }}>Resumen:</b> la demo muestra cómo agentes de IA recorren aplicaciones para ejecutar pruebas
            automatizadas y verificar que los cambios se guardan…
          </div>
        </div>
      </div>
    </div>
  );
};
