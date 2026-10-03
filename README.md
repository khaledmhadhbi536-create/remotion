# NAWAR · نوّار — Pub vidéo 30s (Remotion)

Vidéo promotionnelle de **30 secondes**, format **carré 1080×1080** (fil d'actu Facebook / Instagram),
pour **NAWAR**, une marque tunisienne de soins capillaires *fictive* :
un sérum à l'**huile de pépins de figue de Barbarie (زيت الهندي)** et au **jasmin**.
Les textes sont en **derja tunisienne**.

▶️ Rendu final : [`renders/nawar-ad-30s-1080x1080.mp4`](renders/nawar-ad-30s-1080x1080.mp4) · miniature : [`renders/thumbnail.jpg`](renders/thumbnail.jpg)

## Stratégie marketing

| Temps | Scène | Rôle (AIDA) | Texte (derja) |
|---|---|---|---|
| 0–4s | **Hook** | Attention : on nomme la douleur dès la 1ʳᵉ seconde | « شعرك تعبان؟ » · ناشف / مقصّف / يطيح · « جرّبتي كل شي… و ما نفع شي؟ » |
| 4–8s | **Solution** | Intérêt : un ingrédient local, ancré dans le patrimoine | « ما تقلقيش… السرّ من تونس » · زيت حبّ الهندي + الياسمين |
| 8–14s | **Produit** | Révélation produit + promesses de confiance | NAWAR · 100% طبيعي · صنع في تونس · بلا سيليكون |
| 14–20s | **Bénéfices** | Désir : 3 résultats concrets, un par temps fort | يرطّب · يقوّي · ريحة الياسمين · « 3 قطرات في النهار » |
| 20–24s | **Preuve sociale** | Lever les doutes | +10.000 تونسية · ★ 4.9/5 · avis client |
| 24–30s | **Offre + CTA** | Action : ancrage prix, urgence, réassurance e-commerce TN | عرض محدود · 69 → **49 د.ت** · توصيل مجاني لكل الولايات · الخلاص عند الاستلام · **اطلبي توّا** |

Choix clés :
- **Lisible sans le son** (la majorité des vidéos du fil sont vues en muet) : tout le message passe par le texte, grand et contrasté.
- **Paiement à la livraison + livraison gratuite dans toutes les wilayas** : les deux freins principaux à l'achat en ligne en Tunisie.
- **Identité 100% tunisienne** : bleu de Sidi Bou Saïd, arche, motifs de zellige, jasmin (fell), figue de Barbarie.
- **Montage calé sur la musique** : 120 BPM, chaque coupe tombe sur une mesure (4s, 8s, 14s, 20s, 24s), chaque bénéfice sur un temps.

> ⚠️ Marque, chiffres (+10.000, 4.9/5), avis client et `nawar.tn` sont **fictifs** (démo). Remplacez-les par de vraies données avant toute diffusion — les règles publicitaires de Meta l'exigent.

## Son

La musique et les effets sont **générés par code** (`scripts/generate-audio.mjs`), sans échantillon ni droit d'auteur :
groove inspiré du *mezoued* — darbuka en rythme *maqsum*, riq, claquements de mains (tasfiq),
mélodie au son d'oud (synthèse Karplus-Strong) en ré mineur harmonique sur une cadence andalouse (Rém – Do – Si♭ – La).
Intro tendue → drop à 4s → final à 28s. Effets : whoosh sur chaque coupe, scintillement à la révélation, « pop » sur les bénéfices, cloche sur le prix.

## Structure

```
src/
  Root.tsx            # Compositions : NawarAd (principale) + chaque scène dans le dossier "Scenes"
  NawarAd.tsx         # Timeline : TransitionSeries + pistes audio
  theme.ts            # Couleurs, polices, durée des transitions
  scenes/             # Hook, Solution, Product, Benefits, Proof, Cta
  components/         # Flacon SVG, jasmin, figue de Barbarie, motif zellige, cheveux animés…
public/
  audio/              # music.mp3 + effets (générés)
  fonts/              # Lalezar, Cairo, Playfair Display (licence SIL OFL)
scripts/generate-audio.mjs
```

## Commandes

```console
npm i
npm run dev        # Remotion Studio (aperçu + édition)
npm run audio      # régénère la musique et les effets (nécessite ffmpeg)
npm run render     # rend renders/nawar-ad-30s-1080x1080.mp4
npm run still      # rend la miniature
```

## Skills Remotion

Le projet suit les [skills officiels Remotion pour agents](https://github.com/remotion-dev/skills)
(animations pilotées par `interpolate()`, `TransitionSeries` pour le multi-scènes, scènes enregistrées comme compositions,
`premountFor`, polices locales, etc.). Pour les installer dans votre agent :

```console
npx skills add remotion-dev/skills
```

Remotion est gratuit pour les équipes jusqu'à 3 personnes — voir la [licence](https://www.remotion.pro/license).
