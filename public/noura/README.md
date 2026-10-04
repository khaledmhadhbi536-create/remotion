# Assets NOURA

Déposez ici vos fichiers puis renseignez leur chemin dans `ASSETS` (`src/noura/config.ts`).
Tant qu'une clé vaut `null`, un visuel dessiné en code est utilisé à la place.

| Dossier | Fichier attendu | Clé `ASSETS` |
|---|---|---|
| `images/` | `product.png` (PNG détouré, ≥ 1200 px de haut) | `images.product` |
| `images/` | `logo.png` (transparent) | `images.logo` |
| `images/` | `hook.jpg` (macro cheveux secs, 1080×1080) | `images.hookHair` |
| `images/` | `problem.jpg` (femme + peigne coincé, 1080×1080) | `images.problemModel` |
| `images/` | `before.jpg` / `after.jpg` (même cadrage, 840×480) | `images.before` / `images.after` |
| `images/` | `customer.jpg` (carré) | `images.customer` |
| `video/` | `hook.mp4`, `problem.mp4` (muets, 1080×1080) | `videos.hookHair` / `videos.problemModel` |
| `audio/` | `voiceover.mp3` (30,0 s, calée sur le script) | `audio.voiceover` |
| `audio/` | `music.mp3` + effets (générés par `npm run noura:audio`) | `audio.music`, `audio.sfx` |

Les polices (Cairo, Playfair Display, licence SIL OFL) sont dans `public/fonts/`.
Le brief de shooting détaillé est dans `NOURA.md`, §9.
