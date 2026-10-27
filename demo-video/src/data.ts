// Facts shown in the video, taken from the real agent runs on NotesAI
// (OpencodeYPlawright/evidencias/notesai, session of 2026-10-25).

export const prompt = "navega y prueba la aplicación NoteAI";

// Steps as OpenCode lists them while the agent runs against NotesAI.
export const agentSteps = [
  { tool: "skill", args: '"playwright"' },
  { tool: "browser_navigate", args: "http://localhost:4200" },
  { tool: "browser_click", args: '"Nueva Nota"' },
  { tool: "browser_type", args: '"Reunión feria de innovación"' },
  { tool: "browser_snapshot", args: "evidencias/notesai/01-creacion" },
  { tool: "browser_click", args: '"Resumir"' },
];

export const toolCalls = 71;

export const runDuration = "6 min 11 s";

export const requirements = [
  { id: "RF-01", label: "Crear nota" },
  { id: "RF-02", label: "Abrir nota" },
  { id: "RF-03", label: "Editar y persistir" },
  { id: "RF-06", label: "Color en el listado" },
  { id: "RF-07", label: "Destacar" },
  { id: "RF-05", label: "Resumen con IA local" },
  { id: "RF-04", label: "Eliminar" },
];

export const bug = {
  title: "Defecto encontrado",
  detail: "El contenido no se guardó en el primer intento",
};

// Logos: OpenCode brand page, Anthropic press kit, OpenAI and Google files
// supplied by the user. `logoHeight` compensates for padding built into each
// SVG; `suffix` is text shown after the logo when the product has no own mark;
// `onLight` puts a light-background logo on a white chip instead of recoloring it.
export const agents: { name: string; logo?: string; logoHeight?: number; suffix?: string; onLight?: boolean }[] = [
  { name: "OpenCode", logo: "brand/opencode/opencode-wordmark-dark.svg", logoHeight: 44 },
  { name: "Claude Code", logo: "brand/anthropic/claude-code-logo-ivory.svg", logoHeight: 84 },
  { name: "Codex", logo: "brand/openai/openai-blossom-white.svg", logoHeight: 88, suffix: "Codex" },
  { name: "Gemini CLI", logo: "brand/google/gemini-logo.svg", logoHeight: 30, suffix: "CLI", onLight: true },
  { name: "tu agente" },
];

export const title = "Pruebas E2E con agentes de IA";

export const tagline = "Describí la prueba. El agente la ejecuta.";

export const team = [
  "Juan Sebastián Giraldo",
  "Cristian Javier Barrios",
  "Lina Mayerly Culma",
  "Karen Lorena Rueda",
  "Isabela Martinez Penaloza",
];

export const institution = "Fundación Universitaria Compensar";

export const captions = {
  code: "Los scripts de prueba se rompen con cada cambio.",
  prompt: "¿Y si solo lo describís?",
  agent: "El agente lo ejecuta solo.",
  app: "Prueba la app como lo haría una persona.",
  bug: "Y encuentra defectos reales.",
  results: "Con evidencia de cada paso.",
  agents: "Sin atarse a una sola herramienta.",
} as const;
