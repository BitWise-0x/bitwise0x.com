<# : batch launcher, PowerShell runs the rest of this file
@echo off
set "BW_SELF=%~f0"
powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-Expression ([IO.File]::ReadAllText($env:BW_SELF))"
pause
exit /b
#>
# Connects this PC to the BitWise RustDesk server, ready to view or control a BitWise desktop.
# Not installed: runs the official RustDesk 1.5.0 portable from %LOCALAPPDATA%, no admin rights.
# Already installed: applies the same settings through RustDesk itself (one admin prompt).
$ErrorActionPreference = 'Stop'
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
}

if (Test-Path $Installed) {
    Write-Host 'RustDesk is installed here; applying the BitWise settings (Windows will ask for admin rights)...'
    $cmd = "& '$Installed' --config $Config; & '$Installed' --option allow-websocket Y"
    Start-Process powershell -Verb RunAs -Wait -ArgumentList '-NoProfile', '-Command', $cmd
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
    # a running RustDesk would write its old settings back over ours
    Get-Process rustdesk -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Set-RustDeskOptions (Join-Path $env:APPDATA 'RustDesk\config\RustDesk2.toml') $Options
    Start-Process $exe
}
Set-RustDeskOptions (Join-Path $env:APPDATA 'RustDesk\config\RustDesk_default.toml') $DisplayOptions
Write-Host ''
Write-Host 'Done. In RustDesk, enter the ID and one-time password you were given.'
