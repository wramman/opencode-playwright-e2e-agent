# Stages the demo scene: OpenCode terminal on the left half of the primary
# monitor, the Playwright browser on the right half once it opens.
param(
    [string]$PromptFile,
    [int]$BrowserTimeoutSec = 300,
    # 0-based index in [Screen]::AllScreens; defaults to the primary monitor.
    [int]$Monitor = -1
)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$title = 'OpenCode Demo'

Add-Type -AssemblyName System.Windows.Forms
Add-Type @'
using System;
using System.Text;
using System.Runtime.InteropServices;
public static class Win {
    public delegate bool EnumProc(IntPtr h, IntPtr p);
    [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc cb, IntPtr p);
    [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
    [DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int cmd);
    [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr after, int x, int y, int w, int hgt, uint flags);
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
    public struct RECT { public int Left, Top, Right, Bottom; }
    [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
    [DllImport("dwmapi.dll")] public static extern int DwmGetWindowAttribute(IntPtr h, int attr, out RECT r, int size);
}
'@
[Win]::SetProcessDPIAware() | Out-Null

function Get-TopWindows {
    $list = New-Object System.Collections.Generic.List[object]
    $cb = [Win+EnumProc]{
        param($h, $p)
        if ([Win]::IsWindowVisible($h)) {
            $sb = New-Object System.Text.StringBuilder 512
            [Win]::GetWindowText($h, $sb, 512) | Out-Null
            $procId = 0
            [Win]::GetWindowThreadProcessId($h, [ref]$procId) | Out-Null
            $list.Add([pscustomobject]@{ Handle = $h; Title = $sb.ToString(); ProcessId = [int]$procId })
        }
        $true
    }
    [Win]::EnumWindows($cb, [IntPtr]::Zero) | Out-Null
    $list
}

function Move-Window($handle, $rect) {
    [Win]::ShowWindow($handle, 9) | Out-Null  # SW_RESTORE
    [Win]::SetWindowPos($handle, [IntPtr]::Zero, $rect.X, $rect.Y, $rect.Width, $rect.Height, 0x0040) | Out-Null
    # Windows 10/11 frames have invisible resize borders; grow the window by
    # their size so the visible edges land exactly on the target rectangle.
    $outer = New-Object Win+RECT
    $visible = New-Object Win+RECT
    [Win]::GetWindowRect($handle, [ref]$outer) | Out-Null
    if ([Win]::DwmGetWindowAttribute($handle, 9, [ref]$visible, 16) -eq 0) {  # DWMWA_EXTENDED_FRAME_BOUNDS
        $l = $visible.Left - $outer.Left; $t = $visible.Top - $outer.Top
        $r = $outer.Right - $visible.Right; $b = $outer.Bottom - $visible.Bottom
        [Win]::SetWindowPos($handle, [IntPtr]::Zero, $rect.X - $l, $rect.Y - $t,
            $rect.Width + $l + $r, $rect.Height + $t + $b, 0x0040) | Out-Null
    }
}

function Wait-Window([scriptblock]$match, [int]$timeoutSec) {
    $deadline = (Get-Date).AddSeconds($timeoutSec)
    while ((Get-Date) -lt $deadline) {
        $win = Get-TopWindows | Where-Object $match | Select-Object -First 1
        if ($win) { return $win }
        Start-Sleep -Milliseconds 300
    }
    $null
}

$screen = if ($Monitor -ge 0) { [System.Windows.Forms.Screen]::AllScreens[$Monitor] } else { [System.Windows.Forms.Screen]::PrimaryScreen }
$work = $screen.WorkingArea
$half = [int][Math]::Floor($work.Width / 2)
$leftRect = [System.Drawing.Rectangle]::new($work.X, $work.Y, $half, $work.Height)
$rightRect = [System.Drawing.Rectangle]::new($work.X + $half, $work.Y, $work.Width - $half, $work.Height)

$agentArgs = "-NoExit -ExecutionPolicy Bypass -File `"$root\demo\run-agent.ps1`""
if ($PromptFile) { $agentArgs += " -PromptFile `"$((Resolve-Path $PromptFile).Path)`"" }
$shell = if (Get-Command pwsh -ErrorAction SilentlyContinue) { 'pwsh' } else { 'powershell' }

Write-Host 'Opening terminal...'
Start-Process wt -ArgumentList @('-w', 'new', 'new-tab', '--title', "`"$title`"", '--suppressApplicationTitle', '-d', "`"$root`"", $shell, $agentArgs)

$terminal = Wait-Window { $_.Title -eq $title } 20
if (-not $terminal) { throw "Terminal window '$title' did not appear." }
Move-Window $terminal.Handle $leftRect
Write-Host 'Terminal placed on the left half. Waiting for the browser...'

# Browsers driven by Playwright are launched with a debugging pipe, which
# tells them apart from the user's own Chrome/Edge windows.
$automated = @{}
function Test-AutomatedBrowser([int]$procId) {
    if (-not $automated.ContainsKey($procId)) {
        $cim = Get-CimInstance Win32_Process -Filter "ProcessId = $procId" -ErrorAction SilentlyContinue
        $automated[$procId] = [bool]($cim -and $cim.Name -match '^(chrome|msedge|chromium)\.exe$' -and
            $cim.CommandLine -match 'remote-debugging-pipe|ms-playwright')
    }
    $automated[$procId]
}
$browser = Wait-Window { $_.Title -and (Test-AutomatedBrowser $_.ProcessId) } $BrowserTimeoutSec
if (-not $browser) { throw "No Playwright browser window appeared within $BrowserTimeoutSec s." }
Move-Window $browser.Handle $rightRect
[Win]::SetForegroundWindow($browser.Handle) | Out-Null
[Win]::SetForegroundWindow($terminal.Handle) | Out-Null
Write-Host "Browser placed on the right half: $($browser.Title)"
