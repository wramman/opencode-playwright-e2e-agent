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
// supplied by the user. Each height compensates for padding built into the
// SVG; `onLight` puts a light-background logo on a white chip instead of
// recoloring it.
export type AgentLogo = { src: string; height: number };

export const agents: { name: string; logos?: AgentLogo[]; onLight?: boolean }[] = [
  { name: "OpenCode", logos: [{ src: "brand/opencode/opencode-wordmark-dark.svg", height: 44 }] },
  { name: "Claude Code", logos: [{ src: "brand/anthropic/claude-code-logo-ivory.svg", height: 84 }] },
  {
    name: "Codex",
    logos: [
      { src: "brand/openai/openai-blossom-white.svg", height: 110 },
      { src: "brand/openai/openai-wordmark-white.svg", height: 120 },
    ],
  },
  { name: "Gemini CLI", logos: [{ src: "brand/google/gemini-logo.svg", height: 34 }], onLight: true },
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

// Supplied by the user; 464x101 raster, never shown larger than native size.
export const institutionLogo = { src: "brand/ucompensar/ucompensar-logo.png", width: 464, height: 101 };

export const captions = {
  code: "Los scripts de prueba se rompen con cada cambio.",
  prompt: "¿Y si solo lo describís?",
  agent: "El agente lo ejecuta solo.",
  app: "Prueba la app como lo haría una persona.",
  bug: "Y encuentra defectos reales.",
  results: "Con evidencia de cada paso.",
  agents: "Sin atarse a una sola herramienta.",
} as const;
