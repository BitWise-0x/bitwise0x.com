<# : batch launcher, PowerShell runs the rest of this file
@echo off
set "BW_SELF=%~f0"
powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-Expression ([IO.File]::ReadAllText($env:BW_SELF))"
if errorlevel 1 pause
exit /b
#>
# Connects this PC to the BitWise RustDesk server, ready to view or control a BitWise desktop.
# Not installed: runs the official RustDesk 1.5.0 portable from %LOCALAPPDATA%, no admin rights.
# Already installed: applies the same settings through RustDesk itself (one admin prompt).
# Ends by opening RustDesk and closing this window; it stays open only to show a problem.
$ErrorActionPreference = 'Stop'
trap {
    Write-Host ''
    Write-Host "Setup did not finish: $_" -ForegroundColor Red
    Write-Host 'Send a screenshot of this window to BitWise.'
    exit 1
}
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

$Version = '1.5.0'
$Sha256  = '8555777215510d83d2d61c9dc984e4fcc838bd7e79f9d18a42585431f5e8bb47'
$Config  = '0nI9s2dyV3Q3kld0hzQTp0VvNFSLR0K4lVOrYVWrsya2klMtB3S1MlWORjNVRkI6ISeltmIsISbvNmL4BTZzl2d0lmYus2clRGdzVncv8iOzBHd0hmI6ISawFmIsISbvNmL4BTZzl2d0lmYus2clRGdzVnciojI0N3boJye'
# allow-websocket: the BitWise server is reached over HTTPS only
$Options = [ordered]@{
    'custom-rendezvous-server' = 'rustdesk.bitwise0x.com'
    'relay-server'             = 'rustdesk.bitwise0x.com'
    'api-server'               = 'https://rustdesk.bitwise0x.com'
    'key'                      = 'DU64NZS5Kpm2Y6k++YV+9Yx+DKHSoWJSC8tvY7Curwk='
    'allow-websocket'          = 'Y'
}
# session display defaults (RustDesk_default.toml): fit our screen to the window, best quality.
# The customer can still change both from the session toolbar.
$DisplayOptions = [ordered]@{
    'view_style'    = 'adaptive'
    'image_quality' = 'best'
}
$Installed = Join-Path $env:ProgramFiles 'RustDesk\rustdesk.exe'
$Prefs     = Join-Path $env:APPDATA 'RustDesk\config\RustDesk2.toml'
$Defaults  = Join-Path $env:APPDATA 'RustDesk\config\RustDesk_default.toml'

# RustDesk keeps options under [options]: replace the given keys, keep everything else
function Set-RustDeskOptions([string]$File, $Opts) {
    New-Item -ItemType Directory -Force -Path (Split-Path $File) | Out-Null
    $lines = @()
    if (Test-Path $File) {
        $backup = "$File.bak-$(Get-Date -Format yyyyMMddHHmmss)"
        Copy-Item $File $backup
        Write-Host "Previous RustDesk settings saved to $backup"
        $lines = @(Get-Content $File)
    }
    $pattern = '^\s*"?(' + (($Opts.Keys | ForEach-Object { [regex]::Escape($_) }) -join '|') + ')"?\s*='
    $lines = @($lines | Where-Object { $_ -notmatch $pattern })
    $ours = @($Opts.GetEnumerator() | ForEach-Object { "$($_.Key) = '$($_.Value)'" })
    $at = [Array]::IndexOf($lines, '[options]')
    if ($at -ge 0) {
        $tail = if ($at -lt $lines.Count - 1) { @($lines[($at + 1)..($lines.Count - 1)]) } else { @() }
        $lines = @($lines[0..$at]) + $ours + $tail
    } else {
        $lines = $lines + @('', '[options]') + $ours
    }
    # no BOM: RustDesk's TOML parser rejects one and would silently fall back to defaults
    [IO.File]::WriteAllLines($File, [string[]]$lines, (New-Object Text.UTF8Encoding $false))
    $saved = @(Get-Content $File)
    foreach ($line in $ours) { if ($saved -notcontains $line) { throw "could not save '$line' in $File" } }
}

# the WebSocket handshake RustDesk makes; failing it means this network cannot reach the server
function Test-BitWiseServer {
    $ws = New-Object Net.WebSockets.ClientWebSocket
    try {
        $connect = $ws.ConnectAsync([Uri]'wss://rustdesk.bitwise0x.com/ws/id', [Threading.CancellationToken]::None)
        return ($connect.Wait(8000) -and $ws.State -eq 'Open')
    } catch {
        return $false
    } finally {
        $ws.Dispose()
    }
}

$Warning = $null
if (-not (Test-BitWiseServer)) {
    $Warning = 'Could not reach the BitWise server from this network. It accepts connections from the United States only, and some company or school networks block it. Tell BitWise before the demo.'
}

if (Test-Path $Installed) {
    Write-Host 'RustDesk is installed here; applying the BitWise settings (Windows will ask for admin rights)...'
    $cmd = "& '$Installed' --config $Config; & '$Installed' --option allow-websocket Y"
    Start-Process powershell -Verb RunAs -Wait -ArgumentList '-NoProfile', '-Command', $cmd
    Set-RustDeskOptions $Defaults $DisplayOptions
    Start-Process $Installed
} else {
    $dir = Join-Path $env:LOCALAPPDATA 'BitWise\RustDesk'
    $exe = Join-Path $dir "rustdesk-$Version-x86_64.exe"
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    if (-not (Test-Path $exe) -or (Get-FileHash $exe -Algorithm SHA256).Hash -ne $Sha256) {
        Write-Host "Downloading RustDesk $Version from GitHub..."
        $ProgressPreference = 'SilentlyContinue'
        Invoke-WebRequest -UseBasicParsing -OutFile $exe "https://github.com/rustdesk/rustdesk/releases/download/$Version/rustdesk-$Version-x86_64.exe"
    }
    if ((Get-FileHash $exe -Algorithm SHA256).Hash -ne $Sha256) {
        Remove-Item $exe -Force
        throw 'The download failed its SHA-256 check. Nothing was changed.'
    }
    # downloaded files carry the internet mark, which would add a security prompt on every start
    Unblock-File $exe
    # a running RustDesk would write its old settings back over ours
    Get-Process rustdesk -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Set-RustDeskOptions $Prefs $Options
    Set-RustDeskOptions $Defaults $DisplayOptions
    Start-Process $exe
}
Write-Host ''
Write-Host 'Done. RustDesk is open: enter the ID BitWise gives you and click Connect.'
if ($Warning) {
    Write-Host ''
    Write-Host $Warning -ForegroundColor Yellow
    exit 2
}
