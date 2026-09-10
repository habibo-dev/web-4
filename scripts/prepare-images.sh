#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────
# ISLEM Immobilier — image pipeline (idempotent).
#
# For every source PNG under public/images/**:
#   • resize/crop to the display grid (hero 2200w, photos 1600w, 3:2 cover)
#   • encode as WebP (quality-tuned) next to the source
#   • delete the source PNG
#
# Drop new photos in as PNGs (e.g. real property photography replacing the
# demo renders) and re-run:  bash scripts/prepare-images.sh
# The /images/… paths the site references stay identical.
# ─────────────────────────────────────────────────────────────────────────
set -euo pipefail
cd "$(dirname "$0")/.."

QUALITY=${QUALITY:-80}

shopt -s nullglob
for src in public/images/*/*.png; do
  out="${src%.png}.webp"
  case "$src" in
    *city/alger-bay.png) W=2200; H=1300 ;;          # hero
    *) W=1600; H=1067 ;;                              # standard 3:2
  esac
  convert "$src" \
    -resize "${W}x${H}^" \
    -gravity center -extent "${W}x${H}" \
    -strip \
    -modulate 100,92 \
    -unsharp 0x0.8+0.9+0.02 \
    -quality "$QUALITY" \
    -define webp:method=6:alpha-quality=80 \
    "$out"
  rm "$src"
  printf "%-56s → %s (%s)\n" "$src" "$out" "$(du -h "$out" | cut -f1)"
done

# Also accept JPGs (real photography often arrives as JPG)
for src in public/images/*/*.jpg public/images/*/*.jpeg; do
  [ -e "$src" ] || continue
  out="${src%.jp*g}.webp"
  convert "$src" -resize "1600x1067^" -gravity center -extent "1600x1067" -strip -quality "$QUALITY" -define webp:method=6 "$out"
  rm "$src"
  printf "%-56s → %s (%s)\n" "$src" "$out" "$(du -h "$out" | cut -f1)"
done

echo "✔ done — $(ls public/images/*/*.webp | wc -l) webp assets ready"
