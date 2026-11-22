
#!/usr/bin/env bash

set -Eeuo pipefail

# Personal Manager - Android Development
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKAGE_NAME="com.aulilkez.personalmanager"
METRO_PORT=8081

cd "$PROJECT_DIR"

info() {
  printf "\033[1;34m[INFO]\033[0m %s\n" "$1"
}

success() {
  printf "\033[1;32m[OK]\033[0m %s\n" "$1"
}

error() {
  printf "\033[1;31m[ERROR]\033[0m %s\n" "$1"
  exit 1
}

# Check dependencies
command -v adb >/dev/null 2>&1 || error "ADB tidak ditemukan."
command -v bun >/dev/null 2>&1 || error "Bun tidak ditemukan."

# Check Android device
info "Memeriksa koneksi Android..."

adb start-server >/dev/null

DEVICE_LIST="$(adb devices | awk 'NR > 1 && $2 == "device" {print $1}')"
DEVICE_COUNT="$(printf '%s\n' "$DEVICE_LIST" | grep -c . || true)"

if [[ "$DEVICE_COUNT" -eq 0 ]]; then
  error "HP tidak terdeteksi. Periksa kabel USB dan USB Debugging."
fi

if [[ "$DEVICE_COUNT" -gt 1 ]]; then
  error "Terdapat beberapa perangkat. Hubungkan hanya satu HP dahulu."
fi

DEVICE_ID="$DEVICE_LIST"

success "Perangkat terdeteksi: $DEVICE_ID"

# Setup USB reverse
info "Mengatur ADB Reverse..."

adb -s "$DEVICE_ID" reverse "tcp:$METRO_PORT" "tcp:$METRO_PORT"

success "USB Reverse aktif pada port $METRO_PORT"

# Check development build installation
info "Memeriksa instalasi Personal Manager..."

if ! adb -s "$DEVICE_ID" shell pm path "$PACKAGE_NAME" | grep -q "package:"; then
  error "Personal Manager belum terinstal. Jalankan expo run:android --device."
fi

success "Development Build ditemukan."

# Start application
info "Membuka Personal Manager..."

adb -s "$DEVICE_ID" shell monkey -p "$PACKAGE_NAME" 1 >/dev/null 2>&1 || true

# Start Expo
echo
success "Menjalankan Expo Development Server..."
echo
info "Tekan Ctrl+C untuk menghentikan server."
echo

exec bunx expo start --dev-client --localhost --port "$METRO_PORT"
