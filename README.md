# Pack Pousse des Cheveux 3 en 1 — Pub vidéo 30s (Remotion)

Vidéo promotionnelle de **30 secondes**, format **carré 1080×1080** (fil d'actu Facebook / Instagram), en **derja tunisienne**.
Elle met en scène le pack **Derma Roller 540 + flacon applicateur à peigne + brosse de massage du cuir chevelu**, à partir des photos des produits.

▶️ Rendu final : [`renders/pack-cheveux-30s-1080x1080.mp4`](renders/pack-cheveux-30s-1080x1080.mp4) · miniature : [`renders/thumbnail.jpg`](renders/thumbnail.jpg)

📈 Stratégie (analyse produits, prix, lancement des pubs, opérations) : **[PLAN-MARKETING.md](PLAN-MARKETING.md)**

## Modifier rapidement

- **Prix, nom de la boutique, contact :** `src/config.ts`
- **Textes de chaque étape :** `src/HairPackAd.tsx` (props des `<StepScene>`)

Ensuite, lancez `npm run render`.

## Images produits

| Fichiers | Contenu |
|---|---|
| `assets/source-images/` | Les captures d'écran d'origine |
| `public/products/` | Les produits détourés (fond supprimé) : `derma-roller.png`, `bottle-pink.png`, `bottle-black.png`, `brush-pink.png`, `brush-terracotta.png` |

Pour un meilleur rendu, remplacez-les par des photos HD prises sur fond uni, en gardant les mêmes noms de fichiers. Si les proportions changent, mettez à jour `ratio` dans `src/components/ProductImage.tsx`.

## Structure

```
src/
  Root.tsx              # Composition HairPackAd + chaque scène dans "Scenes"
  HairPackAd.tsx        # Timeline : TransitionSeries + pistes audio
  config.ts             # Prix, nom de boutique, contact
  theme.ts              # Couleurs, polices, durée des transitions
  scenes/               # Hook, PackIntro, Step (×3), Value, Cta
  components/           # ProductImage / PackGroup, motifs, cheveux animés…
public/
  products/             # Produits détourés
  audio/                # Musique + effets (générés par scripts/generate-audio.mjs)
  fonts/                # Lalezar, Cairo, Playfair Display (SIL OFL)
```

La musique est **générée par code**, sans aucun droit d'auteur : groove style mezoued, darbuka et oud, à 120 BPM. Chaque coupe tombe sur une mesure (4, 8, 12, 16, 20 et 24s).

## Commandes

```console
npm i
npm run dev        # Remotion Studio (aperçu + édition)
npm run render     # rend renders/pack-cheveux-30s-1080x1080.mp4
npm run still      # rend la miniature
npm run audio      # régénère musique et effets (nécessite ffmpeg)
```

Le projet suit les [skills officiels Remotion](https://github.com/remotion-dev/skills) (`npx skills add remotion-dev/skills`).
