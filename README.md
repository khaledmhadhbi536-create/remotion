# Pack Pousse des Cheveux 5 en 1 pour hommes à 49 DT (AURA BIO) — Pubs vidéo 34s (Remotion)

Pub de **34 secondes** avec un hook promo (« عرض استثنائي! 5 قطع بـ 49 د.ت ») en **derja tunisienne** pour le pack **Derma Roller 540 + huile de romarin + flacon applicateur + poudre de sidr + brosse de massage**, à partir des photos des produits. Deux formats :

| Format | Fichier | Où l'utiliser (Facebook + Instagram) |
|---|---|---|
| **4:5** 1080×1350 | [`renders/pack-cheveux-5en1-49dt-4x5.mp4`](renders/pack-cheveux-5en1-49dt-4x5.mp4) | **Fil d'actualité** FB et IG : le format recommandé, il prend le plus de place à l'écran |
| **9:16** 1080×1920 | [`renders/pack-cheveux-5en1-49dt-9x16.mp4`](renders/pack-cheveux-5en1-49dt-9x16.mp4) | **Reels et Stories** FB et IG, sous-titres arabes, contenu dans les zones sûres (rien sous l'interface en haut ~250px et en bas ~400px) |
| **1:1** 1080×1080 | [`renders/pack-cheveux-5en1-49dt-1x1.mp4`](renders/pack-cheveux-5en1-49dt-1x1.mp4) | Colonne de droite FB, Marketplace, carrousels, publication organique |
| Couvertures | `renders/cover-1x1.jpg`, `cover-4x5.jpg`, `cover-9x16.jpg` | Miniature / image de couverture de chaque format (frame du hook « 5 قطع بـ 49 د.ت ») |

Dans le Gestionnaire de publicités, chargez le **4:5** et le **9:16** dans la même publicité (« Personnaliser le placement ») : Meta affiche le bon format selon l'emplacement.

📈 Stratégie (analyse produits, prix, lancement des pubs, opérations) : **[PLAN-MARKETING.md](PLAN-MARKETING.md)**

🎯 **Campagne prête à lancer** : 4 vidéos (une par avatar / angle) en 4:5 et 9:16, plus les 4 visuels statiques, le plan Meta et TikTok, les budgets et les règles de décision : **[CAMPAGNE.md](CAMPAGNE.md)**. Rendu : `npm run campaign`.

🖼️ **4 publicités statiques** (4 avatars / angles, en 4:5 et 9:16) : `renders/statics/`, avec textes et ciblage dans **[ADS-STATIQUES.md](ADS-STATIQUES.md)**. Rendu : `npm run statics`.

🎬 **Pub UGC 40s (9:16)** : [`renders/ugc/pub-ugc-pack-49dt-9x16.mp4`](renders/ugc/pub-ugc-pack-49dt-9x16.mp4) : hook UGC face caméra (0–4,5s), B-roll de la vraie photo du pack (4,5–34s), CTA UGC avec le geste vers le bas (34–40,5s), sur la voix off d'origine. Les clips UGC sont recalés pour que les lèvres suivent la voix. Timings et sous-titres : `src/ugc/edit.ts`. Rendu : `npm run render:ugc`.

## Modifier rapidement

- **Prix, nom de la marque, contact :** `src/config.ts`
- **Textes de chaque étape :** `src/HairPackAd.tsx` (props des `<StepScene>`)
- **Sous-titres de la version 9:16 :** `PACK_CAPTIONS` dans `src/HairPackReel.tsx`

Ensuite, lancez `npm run render:all` (rend les 3 formats et les couvertures).

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
  HairPackReel.tsx      # Cadres 9:16 et 4:5 : en-tête + pub carrée + sous-titres
  config.ts             # Prix, nom de boutique, contact
  theme.ts              # Couleurs, polices, durée des transitions
  campaign/AngleAds.tsx # Les 4 vidéos de campagne (V1 Deal, V2 Early, V3 Natural, V4 Gift)
  statics/StaticAds.tsx # Les 4 visuels statiques
  scenes/               # OfferHook, Hook, AngleHooks, NumberedPack, PackIntro, Step, Value, Cta
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
npm run render:all # les 3 formats (1:1, 4:5, 9:16) + couvertures
npm run campaign   # les 4 vidéos de campagne (4:5 + 9:16) + couvertures
npm run statics    # les 4 visuels statiques (4:5 + 9:16)
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
