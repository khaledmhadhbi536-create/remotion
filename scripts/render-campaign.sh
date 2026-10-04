#!/usr/bin/env bash
# Renders the campaign creatives: 4 videos × (4:5 feed, 9:16 Reels/Stories/TikTok) + covers.
# Usage: bash scripts/render-campaign.sh [extra remotion flags, e.g. --browser-executable=...]
set -euo pipefail
OUT=renders/campaign
mkdir -p "$OUT"
for v in V1-Deal V2-Early V3-Natural V4-Gift; do
  for f in 4x5 9x16; do
    npx remotion render "$v-$f" "$OUT/$v-$f.mp4" --codec=h264 --crf=20 "$@"
    npx remotion still "$v-$f" "$OUT/cover-$v-$f.jpg" --frame=60 --jpeg-quality=92 "$@"
  done
done
