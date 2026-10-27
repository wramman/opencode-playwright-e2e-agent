# Captures only the demo windows (never the full screen): the terminal titled
# $TerminalTitle and the browser launched by Playwright, every $IntervalSec
# seconds, until both are gone or $DurationSec elapses.
param(
    [Parameter(Mandatory)] [string]$OutDir,
    [string]$TerminalTitle = 'OpenCode Demo',
    [int]$IntervalSec = 4,
    [int]$DurationSec = 540
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type @'
using System;
using System.Text;
using System.Runtime.InteropServices;
public static class Cap {
    public struct RECT { public int Left, Top, Right, Bottom; }
    public delegate bool EnumProc(IntPtr h, IntPtr p);
    [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc cb, IntPtr p);
    [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
    [DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
    [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
    [DllImport("user32.dll")] public static extern bool PrintWindow(IntPtr h, IntPtr hdc, uint flags);
}
'@
[Cap]::SetProcessDPIAware() | Out-Null
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

$automated = @{}
function Test-AutomatedBrowser([int]$procId) {
    if (-not $automated.ContainsKey($procId)) {
        $cim = Get-CimInstance Win32_Process -Filter "ProcessId = $procId" -ErrorAction SilentlyContinue
        $automated[$procId] = [bool]($cim -and $cim.Name -match '^(chrome|msedge|chromium)\.exe$' -and
            $cim.CommandLine -match 'remote-debugging-pipe|ms-playwright')
    }
    $automated[$procId]
}

function Get-DemoWindows {
    $found = @{}
    $cb = [Cap+EnumProc]{
        param($h, $p)
        if ([Cap]::IsWindowVisible($h)) {
            $sb = New-Object System.Text.StringBuilder 512
            [Cap]::GetWindowText($h, $sb, 512) | Out-Null
            $title = $sb.ToString()
            $procId = 0
            [Cap]::GetWindowThreadProcessId($h, [ref]$procId) | Out-Null
            if ($title -eq $TerminalTitle -and -not $found.ContainsKey('tui')) { $found['tui'] = $h }
            elseif ($title -and -not $found.ContainsKey('browser') -and (Test-AutomatedBrowser ([int]$procId))) { $found['browser'] = $h }
        }
        $true
    }
    [Cap]::EnumWindows($cb, [IntPtr]::Zero) | Out-Null
    $found
}

function Save-Window($h, [string]$file) {
    $r = New-Object Cap+RECT
    [Cap]::GetWindowRect($h, [ref]$r) | Out-Null
    $w = $r.Right - $r.Left; $hgt = $r.Bottom - $r.Top
    if ($w -le 0 -or $hgt -le 0) { return }
    $bmp = New-Object System.Drawing.Bitmap $w, $hgt
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $hdc = $g.GetHdc()
    [Cap]::PrintWindow($h, $hdc, 2) | Out-Null  # PW_RENDERFULLCONTENT: this window only
    $g.ReleaseHdc($hdc)
    $bmp.Save($file)
    $g.Dispose(); $bmp.Dispose()
}

$start = Get-Date
$seenAny = $false
while (((Get-Date) - $start).TotalSeconds -lt $DurationSec) {
    $t = [int]((Get-Date) - $start).TotalSeconds
    $wins = Get-DemoWindows
    if ($wins.Count -gt 0) { $seenAny = $true }
    elseif ($seenAny) { Write-Host "demo windows closed at ${t}s"; break }
    foreach ($kind in $wins.Keys) { Save-Window $wins[$kind] (Join-Path $OutDir ('{0}-{1:D3}s.png' -f $kind, $t)) }
    Start-Sleep -Seconds $IntervalSec
}
Write-Host "done: $((Get-ChildItem $OutDir -Filter *.png).Count) captures"
