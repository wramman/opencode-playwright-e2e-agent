# Runs inside the demo terminal: starts the OpenCode TUI with the test prompt.
param(
    [string]$PromptFile = (Join-Path $PSScriptRoot 'prompt-p01.txt')
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $projectRoot

# Inline config override (highest precedence): same Playwright MCP arguments as
# the project's opencode.json (test plan, Annex A) except the fixed
# --viewport-size, so the page follows the browser window size during the demo.
$mcpConfig = Join-Path $PSScriptRoot 'playwright-mcp.json'
$override = @{
    mcp = @{
        playwright = @{
            type    = 'local'
            enabled = $true
            command = @('npx', '-y', '@playwright/mcp@0.0.83', '--isolated', '--caps=testing',
                '--output-dir=./evidencias', '--config', $mcpConfig)
        }
    }
}
$env:OPENCODE_CONFIG_CONTENT = $override | ConvertTo-Json -Depth 6 -Compress

$prompt = (Get-Content -Raw -Encoding UTF8 $PromptFile).Trim()
Clear-Host
# --standalone: the shared background service ignores OPENCODE_CONFIG_CONTENT,
# so the demo runs its own private server that applies the override.
opencode --standalone --auto --prompt $prompt
