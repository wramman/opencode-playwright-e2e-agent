# Revisión del Plan de Pruebas — hallazgos y correcciones

Fecha de revisión: 25-oct-2026. Verificado contra documentación oficial de @playwright/mcp (main) y OpenCode docs (24-oct-2026), y contra el entorno local.

## Confirmados correctos

- Esquema de `opencode.json` del Anexo A (type local, command array, enabled) — vigente en OpenCode v2.
- Flags `--isolated`, `--viewport-size`, `--caps=testing` (herramientas `browser_verify_*` reales), `--output-dir`, `--init-script`, `--allowed-origins`.
- Posicionamiento CLI+SKILLS vs MCP del README oficial; `browser_run_code_unsafe` equivale a ejecución remota de código.
- Requisitos Node 18+; comportamiento esperado de TodoMVC en CP-06, CP-09, CP-11.

## Hallazgos y correcciones aplicadas/pendientes

1. **Cronograma vencido (Tabla 15).** Ambiente (13–16 oct) y ciclo 1 (19–23 oct) ya pasaron sin repo. Pendiente: re-baseline con fecha real de la feria.
2. **`--browser chrome` ≠ Chromium empaquetado.** Valores del flag: chrome/firefox/webkit/msedge; `chrome` exige Chrome de marca. Corrección: default del servidor para el ciclo Chromium; `--browser` solo para firefox/webkit; Chromium estricto vía archivo de config MCP (`browserName: chromium`). Aplicada en README.
3. **CP-17: React revierte mutaciones del init-script.** El `--init-script` corre antes que los scripts de la página; React re-renderiza y restaura atributos que administra. Corrección: mantener la alteración con MutationObserver o mutar solo atributos no gestionados. Aplicada como nota en prompts/P-04.md; verificar en ejecución.
4. **M9 sin caso explícito.** Falta sub-caso (CP-20): romper la línea base manual con la misma alteración de CP-17 y medir tiempo de reparación del script. Pendiente en especificación de casos.
5. **CP-19 × CP-05: costo.** Cinco repeticiones de lotes de 50–100 tareas es muy caro en tokens/tiempo. Corrección propuesta: una corrida completa y repeticiones con lote 10–20, o `--snapshot-mode=none` en los lotes. Pendiente de acordar con el docente.
6. **RY-06 incompleto.** `browser_run_code_unsafe` es herramienta core, siempre expuesta. Corrección aplicada en opencode.json del proyecto: `tools.playwright_browser_run_code_unsafe = false`. Restricción `--allowed-origins=https://demo.playwright.dev` opcional como contención (no es límite de seguridad; evaluar antes de fijarla: puede romper carga de recursos).
7. **Título de la página.** Registrar el título real en la ejecución (la app muestra "React • TodoMVC"); no hardcodear "React - TodoMVC" como string exacto en CP-01.

## Versiones línea base

OpenCode v2.1.2 · @playwright/mcp 0.0.83 (fijada desde el repo) · Playwright 1.64.1 · Node v24.15.0 · Windows 11 nativo.
