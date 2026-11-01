#!/bin/sh
# prep.sh: clean the rushes with the ffmpeg-skill (denoise all, stabilise handheld shots, clean the voice of 01).
S=/home/user/khaledmhadhbi536-create/pack_5_new/.claude/skills/ffmpeg-skill/scripts
set -e
# clip 01: full length kept; voice cleaned, picture lightly denoised
python3 $S/audio.py raw/01.mp4 --voice -o prep/01_voice.mp4 --overwrite --json-brief
python3 $S/denoise.py prep/01_voice.mp4 --strength low -o prep/01.mp4 --quality 14 --overwrite --json-brief
for n in 02 04 05 14 xx; do   # handheld: denoise then stabilise
  python3 $S/denoise.py raw/$n.mp4 --strength medium -o prep/${n}_dn.mp4 --quality 14 --overwrite --json-brief
  python3 $S/stabilize.py prep/${n}_dn.mp4 --shakiness 6 --smoothing 15 --zoom 3 -o prep/$n.mp4 --quality 14 --overwrite --json-brief
done
for n in 03 06 07 08 09 10 11 12; do   # fixed camera: denoise only
  python3 $S/denoise.py raw/$n.mp4 --strength medium -o prep/$n.mp4 --quality 14 --overwrite --json-brief
done
echo PREP_DONE
