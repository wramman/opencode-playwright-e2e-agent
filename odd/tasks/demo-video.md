# Feature: demo-video
Objective: "one shape" style animated demo video of OpenCode + Playwright MCP testing NotesAI, for the innovation fair.
Branch: current (main) · Delivery: single project in `demo-video/` · Runner: `npx tsc --noEmit`, `npx remotion still` frame checks.

## Specs
- S1. Style matches the reference `one-shape.mp4`: one shape that morphs between UI components, monochrome on a beige background, guided by a cursor.
- S2. Two formats from the same code: vertical 1080x1920 (primary, the fair screen is vertical) and horizontal 1920x1080.
- S3. Approved storyboard (~25 s), one scene per row:
  1. Fragile selector line of code that breaks (shakes in red) — "Los scripts de prueba se rompen con cada cambio."
  2. Input where "navega y prueba la aplicación NoteAI" is typed → Enter — "¿Y si solo lo describís?"
  3. Loader with chips of the real actions `browser_navigate`, `browser_click`, `browser_type` — the agent works on its own.
  4. NotesAI card: note created, edited, star turns on, summary appears — tests passing live.
  5. Amber toast: "Defecto encontrado: el contenido no se guardó" — the agent finds real bugs.
  6. Table RF-01…RF-07 ticking green → **7/7 · 6 min** — evidence, not promises.
  7. Rotating chips OpenCode → Claude Code → Codex → … over a fixed "Playwright MCP" base — not tied to one tool.
  8. Final pill with title, team and the Fundación — closing.
- S4. Title: "Pruebas E2E con agentes de IA". Closing line: "Describí la prueba. El agente la ejecuta."
- S5. All data comes from the real runs (NotesAI 7/7 in 6 min 11 s, 71 tool calls, bug: first content fill not persisted). Tool names as text only, no third-party logos.

## Tasks
- T1 (S1-S5) Scaffold + scenes + both compositions — inline — done (tsc + eslint clean)
- T2 (S2) Visual check of key frames in both formats — inline — done (8 stills per format; fixed code/prompt overflow)
- T3 Music / voiceover (Higgsfield) — pending, not yet requested

## Log
- L1 (2026-10-27, user): "Pues el proyecto, es mostrar el uso de la herramienta opencode, como un agente para automatizar pruebas en playwright como demo sin cerrar a otras gerramientas" → storyboard proposed; user: "aprobado".
- L2: Remotion 4.0.539 scaffolded in `demo-video/` (blank, no Tailwind). License note: free for teams up to 3; team has 5 — user to confirm non-profit/academic eligibility.
- L3 (2026-10-27, user): "es posible mostrar la interfaz de opencode, incluyendo el brand de opencode https://opencode.ai/brand" → official SVGs from opencode-brand-assets.zip in public/brand/opencode; prompt+agent scenes merged into one OpenCode TUI recreation (Kanagawa colors sampled from a capture of only the "OpenCode Demo" window, authorized by user).
- L4 (2026-10-27, user): "puedes agregar el brand de Google Gemini, Codex, y Claude" → Claude Code logo from the official Anthropic press kit; Gemini icon needs Google approval (Partner Marketing Hub form); openai.com/brand blocks automated download (403, not bypassed). Codex and Gemini CLI stay as text pending user decision.
- L5 (2026-10-27, user): "el logo openai esta en C:\Usersmpaq\Downloads\openai-logos\OpenAI-logos\PNGs, y gemini \"C:\Usersmpaq\Downloads\Google_Gemini_logo_2025.svg\"" → used the SVG versions (checked clean): OpenAI Blossom (white) + "Codex" text; Gemini logo unaltered on a white chip + "CLI". Note for user: Google asks for approval to use product icons.
