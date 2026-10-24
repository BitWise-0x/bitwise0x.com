#!/bin/bash
# Connects this Mac to the BitWise RustDesk server, ready to view or control a BitWise desktop.
# Double-click it (the first time: right-click > Open). Not installed: copies the official
# RustDesk 1.5.0 into Applications, no password needed. Installed as a service: applies the
# same settings through RustDesk itself (asks for your password once).
set -euo pipefail

VERSION='1.5.0'
CONFIG='0nI9s2dyV3Q3kld0hzQTp0VvNFSLR0K4lVOrYVWrsya2klMtB3S1MlWORjNVRkI6ISeltmIsISbvNmL4BTZzl2d0lmYus2clRGdzVncv8iOzBHd0hmI6ISawFmIsISbvNmL4BTZzl2d0lmYus2clRGdzVnciojI0N3boJye'
# allow-websocket: the BitWise server is reached over HTTPS only
OPTIONS=(
  "custom-rendezvous-server=rustdesk.bitwise0x.com"
  "relay-server=rustdesk.bitwise0x.com"
  "api-server=https://rustdesk.bitwise0x.com"
  "key=DU64NZS5Kpm2Y6k++YV+9Yx+DKHSoWJSC8tvY7Curwk="
  "allow-websocket=Y"
)
# session display defaults (RustDesk_default.toml): fit our screen to the window, best quality.
# The customer can still change both from the session toolbar.
DISPLAY_OPTIONS=(
  "view_style=adaptive"
  "image_quality=best"
)
case "$(uname -m)" in
  arm64) ARCH=aarch64; SHA='3929b0a4321e7d0f561a317059798be882d65decc59681eb77061f8efe56fbf4' ;;
  *)     ARCH=x86_64;  SHA='1ca3cbfbe7f2bd28b50c93fcd50d4a0b671dc76d18be27cea99d3a65767eb526' ;;
esac
DAEMON=/Library/LaunchDaemons/com.carriez.RustDesk_service.plist
PREFS="$HOME/Library/Preferences/com.carriez.RustDesk/RustDesk2.toml"
DEFAULTS="$HOME/Library/Preferences/com.carriez.RustDesk/RustDesk_default.toml"

find_app() {
  local d
  for d in /Applications "$HOME/Applications"; do
    if [ -d "$d/RustDesk.app" ]; then echo "$d/RustDesk.app"; return 0; fi
  done
  return 0
}

# RustDesk keeps options under [options]: replace the given keys, keep everything else
set_options() {
  local file=$1 kv ours="" keys=""
  shift
  mkdir -p "$(dirname "$file")"
  if [ -f "$file" ]; then
    cp "$file" "$file.bak-$(date +%Y%m%d%H%M%S)"
    echo "Previous RustDesk settings saved next to $file"
  else
    : > "$file"
  fi
  for kv in "$@"; do
    ours+="${kv%%=*} = '${kv#*=}'\\n"
    keys+="${keys:+|}${kv%%=*}"
  done
  awk -v drop="^[[:space:]]*\"?($keys)\"?[[:space:]]*=" -v ours="$ours" '
    $0 ~ drop { next }
    { print }
    $0 == "[options]" { printf "%s", ours; done = 1 }
    END { if (!done) printf "\n[options]\n%s", ours }
  ' "$file" > "$file.tmp"
  mv "$file.tmp" "$file"
}

app="$(find_app)"
if [ -f "$DAEMON" ] && [ -n "$app" ]; then
  echo "RustDesk runs as a service here; applying the BitWise settings needs your password."
  sudo "$app/Contents/MacOS/RustDesk" --config "$CONFIG"
  sudo "$app/Contents/MacOS/RustDesk" --option allow-websocket Y
else
  if [ -z "$app" ]; then
    tmp="$(mktemp -d)"
    trap 'hdiutil detach -quiet "$tmp/mnt" 2>/dev/null || true; rm -rf "$tmp"' EXIT
    echo "Downloading RustDesk $VERSION from GitHub..."
    curl -fsSL -o "$tmp/rustdesk.dmg" \
      "https://github.com/rustdesk/rustdesk/releases/download/$VERSION/rustdesk-$VERSION-$ARCH.dmg"
    if ! echo "$SHA  $tmp/rustdesk.dmg" | shasum -a 256 -c - >/dev/null 2>&1; then
      echo "The download failed its SHA-256 check. Nothing was changed." >&2
      exit 1
    fi
    hdiutil attach -quiet -nobrowse -mountpoint "$tmp/mnt" "$tmp/rustdesk.dmg"
    dest=/Applications
    if [ ! -w "$dest" ]; then dest="$HOME/Applications"; mkdir -p "$dest"; fi
    cp -R "$tmp/mnt/RustDesk.app" "$dest/"
    app="$dest/RustDesk.app"
  fi
  # a running RustDesk would write its old settings back over ours
  osascript -e 'quit app "RustDesk"' >/dev/null 2>&1 || true
  sleep 1
  pkill -x RustDesk 2>/dev/null || true
  set_options "$PREFS" "${OPTIONS[@]}"
fi
set_options "$DEFAULTS" "${DISPLAY_OPTIONS[@]}"
open "$app"
echo
echo "Done. In RustDesk, enter the ID and one-time password you were given."
