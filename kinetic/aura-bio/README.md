# AURA BIO, kinetic promo (pack 5 en 1, 49 DT)

A 20 s kinetic typography promo made with the `scenario-kinetic-film` skill (`.claude/skills/`).
160 BPM, 54 beats, French copy, brand colours from `src/theme.ts`. Finished videos: `renders/kinetic/`.

Rebuild:

```bash
python3 make_audio.py          # music (160 BPM, mezoued + trap, made in code) and sound kit -> audio/
python3 make_art.py            # pack picture from public/products -> art/pack.png
K=../../.claude/skills/scenario-kinetic-film
python3 -m http.server 5671 &  # preview at http://127.0.0.1:5671
python3 $K/scripts/mix.py .
python3 $K/scripts/render.py . --res 1080
python3 $K/scripts/finish.py . --video out/video_1080.mp4 --audio out/mix.wav
```

Edit the words, timing and colours in `spec.js` (every number is a beat).
