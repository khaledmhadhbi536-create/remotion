# UGC « Pack 5 » : plan de tournage Google Flow

Vidéo UGC 9:16 d'environ 40 s pour le **Pack Pousse des Cheveux 5 en 1 (49 DT)**. Le créateur (homme, lunettes, moustache) parle en derja et montre la routine.

## 1. Ce qu'on a déjà

| Fichier | Contenu | Utilisation |
|---|---|---|
| `ugc2.mp4` (10 s) | « اليوم عنا باك فيها خمسة حاجات… بتسعة وربعين دينار » | **Hook** : garder 0–3,8 s seulement. Après 8 s, l'interface caméra du téléphone apparaît à l'écran, et le prix est bégayé (« وربعين وربعين »). |
| `ugc1.mp4` (8 s) | « باش تعدّي الكوموند، انزل اللوطة » + doigt vers le bas | **CTA final**. Le logo « 9:6 » en haut de l'image sera recadré au montage. |
| `voice ugc.m4a` (38 s) | Toute la routine en voix off (transcription ci-dessous) | **Voix off** posée sur les plans produits |

⚠️ **T-shirt :** vert dans `ugc2`, gris dans `ugc1`. Le changement de jour passe en UGC, mais pour un rendu propre, regénère le CTA avec la référence verte (prompt **C1**).

### Voix off (`voice ugc.m4a`)

| Temps | Texte | Plan à mettre dessous |
|---|---|---|
| 0–4 s | اليوم عنا باك فيه 5 حاجات، الكل بـ 49 دينار | (remplacé par le hook `ugc2`, puis 2–4 s sur le plan **P0**) |
| 6–9 s | عنا السدر، باش نزيدوه الماء و نحطّوه في الأبليكاتور | **P1** |
| 9–16 s | نغسلو بيه شعرنا… الأبليكاتور باش السدر يوصل للجذور و ينظّف فروة الراس | **P2** |
| 17–21 s | عنا الديرما رولر، باش نستعملوها مرتين في الجمعة، ما أكثرش | **P3** |
| 21–25 s | بعد الديرما بالضبط، نستعملو زيت إكليل الجبل | **P4** |
| 25–33 s | البروس… نعمل بيها مساج على فروة الراس باش ننشّط الدورة الدموية | **P5** |
| 33–37 s | باش تعدّي الكوموند انزل اللوطة | (remplacé par le CTA `ugc1` / **C1**) |

> J'ai fait la transcription automatiquement : le passage « البروس » (25–29 s) est peu clair, vérifie-le à l'écoute.

## 2. Préparer Flow (une seule fois)

1. Nouveau projet Flow en **9:16**, modèle **Veo 3 Quality** pour les plans importants (Fast pour les essais).
2. Importe en **Ingredients** :
   - `ugc-flow/reference-createur.jpg` : le visage du créateur, tiré de `ugc2` ;
   - la photo du produit du plan : `ugc-flow/sidr-powder.png`, `bottle-black.png`, `derma-roller.png`, `rosemary-oil.png`, `brush-terracotta.png`.
3. Les plans **P0 à P5 n'ont pas de dialogue** : la voix off vient de `voice ugc.m4a`. Ajoute toujours **« no dialogue, no speech, no music »** pour éviter que Veo fasse parler le personnage.

## 3. Les prompts

Base commune à coller au début de chaque prompt :

```
Vertical 9:16 authentic UGC smartphone video, handheld, slight natural shake,
warm natural daylight. The same man as the reference: North African, early 30s,
short dark hair, clear rectangular glasses, thick dark moustache, olive green t-shirt.
No dialogue, no speech, no music, no subtitles, no text on screen, no phone UI.
Only soft natural ambient sound.
```

**P0 · Le pack (2–3 s)**
```
[BASE] Close-up of his hands placing five hair care products one by one on a
wooden table: a derma roller, a small amber dropper bottle of rosemary oil,
a black applicator bottle with comb tip, a bag of sidr powder, a pink silicone
scalp massager brush. Quick satisfying placement, top-down angle.
```

**P1 · Sidr + eau (3 s)**
```
[BASE] Bathroom sink. Close-up of his hands pouring green sidr powder into a
black applicator bottle with a comb nozzle, adding water, closing it and shaking
it. Shallow depth of field.
```

**P2 · Application sur les racines (7 s)**
```
[BASE] In the bathroom, he tilts his head forward and applies the green sidr
mixture directly onto his scalp with the black comb-tip applicator bottle,
moving it along the hair partings. Then he gently rubs his scalp with his
fingertips. Medium close-up from a phone propped on the sink.
```

**P3 · Derma roller (4 s)**
```
[BASE] In front of the bathroom mirror, he gently rolls a small derma roller
over his scalp near the hairline, slow controlled movements, calm focused
expression. Close-up on head and hand.
```

**P4 · Huile de romarin (4 s)**
```
[BASE] Extreme close-up: he squeezes a glass dropper and lets a few drops of
golden rosemary oil fall onto his scalp between the hair, then massages it in
with his fingertips. Macro detail, glistening oil.
```

**P5 · Brosse de massage (8 s)**
```
[BASE] In the shower with light foam in his hair, he massages his scalp in
small circles with a pink silicone scalp massager brush, eyes closed, relaxed
smile. Water droplets, steam, warm light.
```

**C1 · CTA (option, pour remplacer `ugc1`)**
```
Vertical 9:16 selfie smartphone video, handheld, same man as reference, olive
green t-shirt, same room as reference. He looks into the camera, smiles and
points down with his index finger. He says in Tunisian Arabic:
"باش تعدّي الكوموند، انزل اللوطة!"
No subtitles, no text on screen, no phone UI, no music.
```

## 4. Conseils Veo pour ce pack

- **Fais 2 à 4 variantes par plan** et garde la meilleure. Les mains et les petits objets ratent souvent.
- **Logos et textes des emballages** : Veo les déforme. Ce n'est pas grave, car au montage j'ajoute en surimpression la vraie photo détourée du produit avec son numéro (1- سدر بيو…).
- **Aucune promesse santé** dans les plans (pas de « avant / après » de calvitie). Ça évite les refus Meta et TikTok.
- Si un plan est trop long, pas de souci : je le coupe au montage pour suivre la voix.
- Télécharge en **1080p** (Upscale dans Flow) si possible.

## 5. Montage (Remotion)

Dépose les clips dans `public/ugc/` sous les noms `p0.mp4` … `p5.mp4` (et `c1.mp4` si tu refais le CTA). Le montage prévu :

1. Hook `ugc2` (0–3,8 s), avec un texte « 5 قطع بـ 49 د.ت » qui claque
2. P0 + voix « الكل بـ 49 دينار » + 110 د.ت barré → **49 د.ت**
3. P1 → P5 sous la voix off, avec la photo et le numéro de chaque produit qui pop
4. CTA `ugc1` / C1 + carte de fin : prix, « الخلاص عند الاستلام », **50 500 051**
5. Sous-titres derja mot par mot dans les zones sûres TikTok / Reels, plus whoosh à chaque coupe
