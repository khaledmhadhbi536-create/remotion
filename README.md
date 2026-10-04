# Pack Pousse des Cheveux 5 en 1 à 49 DT (AURA BIO) — Pubs vidéo 34s (Remotion)

Pub de **34 secondes** avec un hook promo (« عرض استثنائي! 5 قطع بـ 49 د.ت ») en **derja tunisienne** pour le pack **Derma Roller 540 + huile de romarin + flacon applicateur + poudre de sidr + brosse de massage**, à partir des photos des produits. Deux formats :

- ▶️ **1:1 (fil Facebook / Instagram)** : [`renders/pack-cheveux-5en1-49dt-1080x1080.mp4`](renders/pack-cheveux-5en1-49dt-1080x1080.mp4)
- ▶️ **9:16 (Reels / TikTok / Stories)**, avec sous-titres arabes mot par mot : [`renders/pack-cheveux-5en1-49dt-9x16.mp4`](renders/pack-cheveux-5en1-49dt-9x16.mp4)

📈 Stratégie (analyse produits, prix, lancement des pubs, opérations) : **[PLAN-MARKETING.md](PLAN-MARKETING.md)**

## Modifier rapidement

- **Prix, nom de la marque, contact :** `src/config.ts`
- **Textes de chaque étape :** `src/HairPackAd.tsx` (props des `<StepScene>`)
- **Sous-titres de la version 9:16 :** `PACK_CAPTIONS` dans `src/HairPackReel.tsx`

Ensuite, lancez `npm run render` (1:1) et `npm run render:reel` (9:16).

## Images produits

| Fichiers | Contenu |
|---|---|
| `assets/source-images/` | Les captures d'écran d'origine |
| `public/products/` | Les produits détourés (fond supprimé) : `derma-roller.png`, `rosemary-oil.png`, `bottle-pink.png`, `bottle-black.png`, `sidr-powder.png`, `brush-pink.png`, `brush-terracotta.png` |

Pour un meilleur rendu, remplacez-les par des photos HD prises sur fond uni, en gardant les mêmes noms de fichiers. Si les proportions changent, mettez à jour `ratio` dans `src/components/ProductImage.tsx`.

## Structure

```
src/
  Root.tsx              # Compositions HairPackAd, HairPackReel, ProductPresentation + scènes
  HairPackAd.tsx        # Timeline 1:1 : TransitionSeries + pistes audio
  HairPackReel.tsx      # Version 9:16 : en-tête + pub carrée + sous-titres
  config.ts             # Prix, nom de boutique, contact
  theme.ts              # Couleurs, polices, durée des transitions
  scenes/               # OfferHook, Hook, PackIntro, Step (×3), Value, Cta
  components/           # ProductImage / PackGroup, Captions (sous-titres), motifs, cheveux animés…
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
npm run render     # rend la version 1:1
npm run render:reel  # rend la version 9:16 sous-titrée
npm run still      # rend la miniature
npm run audio      # régénère musique et effets (nécessite ffmpeg)
```

Le projet suit les [skills officiels Remotion](https://github.com/remotion-dev/skills) (`npx skills add remotion-dev/skills`).

---

# Vidéo de présentation re-montée (9:16) — Dehan Kebrit & Fazline

Remontage de la vidéo du vendeur (`assets/source-videos/presentation-original.mp4`) au format **Reels / TikTok / Stories 1080×1920** :

▶️ [`renders/presentation-soustitree-9x16.mp4`](renders/presentation-soustitree-9x16.mp4) · composition Remotion `ProductPresentation`

| Étape | Ce qui a été fait |
|---|---|
| Image | Stabilisation (vidstab 2 passes), étalonnage (luminosité, contraste, saturation), netteté, upscale 576×1024 → 1080×1920 |
| Son voix | Passe-haut, débruitage, compression et normalisation : de −30 dB à environ −19 dB de moyenne |
| Montage | Jump cuts sur les silences (41s → 33,8s de parole), zoom alterné 1.0 / 1.12 pour masquer les coupes, léger push-in |
| Sous-titres | Derja en arabe, 1 à 3 mots à l'écran, mot prononcé surligné en vert, mots-clés en jaune avec un « pop » |
| Graphismes | Hook « فطريات الظوافر؟ الإكزيما؟ », cartes produit, puces des bénéfices (texte de la boîte), bannière promo, barre de progression, carte finale « اطلب توّا » |
| Sound design | Impact (hook et fin), whoosh (cartes produit), clics (puces), scintillement, cloche (promo), riser, musique à 8 % sous la voix puis en avant sur la carte finale |

**Corriger un sous-titre ou ajouter le prix promo :** tout se trouve dans `src/presentation/edit.ts`.
- `PHRASES` : le texte et les temps en secondes de la vidéo source. Les lignes `check: true` sont celles dont l'audio était peu clair.
- `PROMO_PRICE` : le prix promo (`null` = non affiché).

Lancez ensuite :

```console
npx remotion render ProductPresentation renders/presentation-soustitree-9x16.mp4
```

Pré-traitement de la vidéo source (déjà fait, résultat dans `public/footage/presentation.mp4`) :

```console
ffmpeg -i source.mp4 -vf vidstabdetect=shakiness=6:accuracy=12:result=t.trf -f null -
ffmpeg -i source.mp4 -filter_complex "[0:v]vidstabtransform=input=t.trf:smoothing=18:zoom=4,scale=1080:1920:flags=lanczos,eq=brightness=0.035:contrast=1.12:saturation=1.28:gamma=1.05,unsharp=5:5:0.6[v];[0:a]highpass=f=90,lowpass=f=9000,afftdn=nf=-28,acompressor=threshold=-24dB:ratio=3:makeup=4,loudnorm=I=-16:TP=-1.5[a]" -map "[v]" -map "[a]" -c:v libx264 -crf 21 public/footage/presentation.mp4
```
