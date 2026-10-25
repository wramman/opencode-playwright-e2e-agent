# Plan MVP — tanda 1 (demo de ejecución)

Objetivo: MVP visual para la Feria de Innovación — el agente ejecuta el flujo CP-02 sobre TodoMVC con evidencia grabada; la animación Higgsfield se construye después con este material.

- [x] `git init` + estructura del repo
- [x] `opencode.json` de proyecto (Anexo A + correcciones: pin 0.0.83, `-y`, `browser_run_code_unsafe` deshabilitado)
- [x] `prompts/` P-01 a P-05 versionados
- [x] `README.md` (convenciones de ciclo y versiones)
- [x] `docs/review-plan.md` (los 7 hallazgos de la revisión)
- [x] Commit inicial
- [x] CP-01: verificación de conexión MCP y herramientas disponibles — smoke 25-oct-2026 17:01: servidor conectado, navegación OK, título real "React • TodoMVC" (confirma hallazgo 7), estado inicial vacío, evidencia `evidencias/CP-01_chromium_20261025-1701.png`. Nota: corrido con el servidor global de la sesión (sin flags del proyecto); la corrida formal usa el opencode.json del repo tras reiniciar OpenCode.
- [x] CP-02: corrida autónoma con P-01 (grabación de pantalla + evidencia por paso + tabla de veredictos) — APROBADO 25-oct, informe en `docs/informes/CP-02_20261025-1707.md`. Desviación registrada: servidor global sin flags + modelo de sesión Qwen3.8 Flash.
- [ ] CP-01/CP-02 formales con config de proyecto (reiniciar OpenCode en esta carpeta)
- [ ] Informe visual CP-02 (tabla + galería de evidencia) — insumo del pitch

## Tanda 2 (fuera de esta tanda)

- Especificación detallada de casos (Tabla 12 → precondiciones/pasos/datos/criterios)
- Línea base manual Playwright Test (M8/M9) y sub-caso CP-20
- Re-baseline del cronograma (Tabla 15) — falta fecha de la feria
- Animación Higgsfield (loop 20–40 s) con el material de CP-02
