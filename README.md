# OpenCode + Playwright MCP — Pruebas E2E con agente de IA

Proyecto académico (Fundación Universitaria Compensar) que valida la viabilidad de un flujo de pruebas E2E ejecutado por un agente de IA (OpenCode) a través de Playwright MCP sobre la demo TodoMVC. Basado en el plan de pruebas ISO/IEC/IEEE 29119 (`Plan_de_Pruebas_Opencode_y_Playwright_Completo.docx`).

## Estructura

```
opencode.json      Config de proyecto: servidor Playwright MCP con flags del Anexo A + correcciones
prompts/           Prompts de prueba versionados (P-01 a P-05, Anexo B)
evidencias/        Capturas y snapshots por ejecución (convención: CP-XX_navegador_AAAAMMDD-HHMM)
docs/              Revisión del plan, registro de ejecuciones, informes
```

## Uso

1. Abrir OpenCode en esta carpeta: el `opencode.json` del proyecto define el servidor `playwright` con `--isolated`, `--caps=testing`, viewport 1280x720 y salida en `./evidencias` (versión fijada `@playwright/mcp@0.0.83`; la herramienta `browser_run_code_unsafe` está deshabilitada vía `tools`).
2. Verificar CP-01: el servidor debe aparecer conectado y las herramientas `playwright_browser_*` disponibles.
3. Ejecutar el prompt de `prompts/P-0X.md` correspondiente al caso.

## Reglas del ciclo (secciones 8.2 y 10.7 del plan)

- Modelo fijo por ciclo: `opencode-go/gpt-6-luna` (variante max). Cambiarlo obliga a repetir las pruebas de humo.
- Estado inicial: lista vacía en contexto aislado (`--isolated`).
- Máximo 100 tareas por ejecución; solo datos sintéticos.
- Evidencia por verificación: cada paso con snapshot + captura.
- Lote multinavegador (ciclo 2): editar `opencode.json` añadiendo `--browser=firefox` o `--browser=webkit` (Chromium no requiere flag; para Chromium estricto usar archivo de config de MCP con `browserName: chromium` en lugar de `chrome`).

## Versiones registradas (línea base)

| Ítem | Versión |
|---|---|
| OpenCode | v2.1.2 |
| @playwright/mcp | 0.0.83 (fijada) |
| Playwright | 1.64.1 |
| Node.js | v24.15.0 |
| Modelo | opencode-go/gpt-6-luna (max) |
| SO | Windows 11 (nativo, sin WSL) |
