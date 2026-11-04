#!/bin/bash
# Connects this Mac to the BitWise RustDesk server, ready to view or control a BitWise desktop.
# Double-click it (the first time macOS blocks it: System Settings > Privacy & Security > Open
# Anyway), or paste into Terminal: bash <(curl -fsSL https://bitwise0x.com/connect/BitWise-RustDesk-macOS.command)
# Not installed: copies the official RustDesk 1.5.0 into Applications, no password needed.
# Installed as a service: applies the same settings through RustDesk itself (asks for your
# password once). Ends by opening RustDesk; a double-clicked copy also closes its Terminal window.
set -Eeuo pipefail

VERSION='1.5.0'
CONFIG='0nI9s2dyV3Q3kld0hzQTp0VvNFSLR0K4lVOrYVWrsya2klMtB3S1MlWORjNVRkI6ISeltmIsISbvNmL4BTZzl2d0lmYus2clRGdzVncv8iOzBHd0hmI6ISawFmIsISbvNmL4BTZzl2d0lmYus2clRGdzVnciojI0N3boJye'
SERVER='rustdesk.bitwise0x.com'
# allow-websocket: the BitWise server is reached over HTTPS only
OPTIONS=(
  "custom-rendezvous-server=$SERVER"
  "relay-server=$SERVER"
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
# uname -m reports x86_64 on Apple Silicon when Terminal runs under Rosetta; the sysctl does not
if [ "$(sysctl -n hw.optional.arm64 2>/dev/null || echo 0)" = 1 ]; then
  ARCH=aarch64; SHA='3929b0a4321e7d0f561a317059798be882d65decc59681eb77061f8efe56fbf4'
else
  ARCH=x86_64;  SHA='1ca3cbfbe7f2bd28b50c93fcd50d4a0b671dc76d18be27cea99d3a65767eb526'
fi
DAEMON=/Library/LaunchDaemons/com.carriez.RustDesk_service.plist
PREFS="$HOME/Library/Preferences/com.carriez.RustDesk/RustDesk2.toml"
DEFAULTS="$HOME/Library/Preferences/com.carriez.RustDesk/RustDesk_default.toml"

trap 'echo; echo "Setup did not finish (line $LINENO). Send a screenshot of this window to BitWise." >&2' ERR

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
  for kv in "$@"; do
    grep -qxF "${kv%%=*} = '${kv#*=}'" "$file" || { echo "Could not save ${kv%%=*} in $file" >&2; return 1; }
  done
}

# the WebSocket upgrade RustDesk makes; 101 means this network can reach the server
server_status() {
  curl -s --http1.1 -o /dev/null -w '%{http_code}' --max-time 5 \
    -H 'Connection: Upgrade' -H 'Upgrade: websocket' -H 'Sec-WebSocket-Version: 13' \
    -H 'Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==' "https://$SERVER/ws/id" || true
}

# closes the Terminal tab this ran in, after this script has exited (detached from the tab, so
# Terminal has nothing running to ask about). If macOS refuses, the window just stays open.
close_window() {
  local tty_dev
  tty_dev="$(tty 2>/dev/null)" || return 0
  perl -MPOSIX -e 'POSIX::setsid(); exec @ARGV' /bin/sh -c '
    sleep 1
    osascript -e "tell application \"Terminal\"
      repeat with w in windows
        repeat with t in tabs of w
          if tty of t is \"$0\" then close w saving no
        end repeat
      end repeat
    end tell"' "$tty_dev" </dev/null >/dev/null 2>&1 &
}

warning=""
status="$(server_status)"
case "$status" in
  101) ;;
  403) warning="The BitWise server refused this network. It accepts connections from the United States only, and some company or school networks block it. Tell BitWise before the demo." ;;
  429) warning="The BitWise server is busy right now. Wait a minute, then connect." ;;
  *)   warning="Could not reach the BitWise server (status $status). Check the internet connection, then connect." ;;
esac

app="$(find_app)"
if [ -f "$DAEMON" ] && [ -n "$app" ]; then
  echo "RustDesk runs as a service here; applying the BitWise settings needs your Mac password."
  sudo "$app/Contents/MacOS/RustDesk" --config "$CONFIG"
  sudo "$app/Contents/MacOS/RustDesk" --option allow-websocket Y
else
  if [ -z "$app" ]; then
    tmp="$(mktemp -d)"
    trap 'hdiutil detach -quiet "$tmp/mnt" 2>/dev/null || true; rm -rf "$tmp"' EXIT
    echo "Downloading RustDesk $VERSION from GitHub..."
    curl -fsSL --retry 2 -o "$tmp/rustdesk.dmg" \
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
    echo "RustDesk $VERSION installed in $dest"
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
echo "Done. RustDesk is open: enter the ID BitWise gives you and click Connect."
if [ -n "$warning" ]; then
  echo
  echo "$warning" >&2
elif [[ "$0" == *.command ]]; then
  close_window
fi
