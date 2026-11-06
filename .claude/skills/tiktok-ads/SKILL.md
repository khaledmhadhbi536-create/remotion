---
name: tiktok-ads
description: Prépare, crée et lance des publicités TikTok pour le Pack Pousse des Cheveux 5 en 1 (AURA BIO, 49 DT, paiement à la livraison, Tunisie) — ou tout autre produit de ce dépôt. Utiliser dès que l'utilisateur parle de TikTok, TikTok Ads, Spark Ads, pub TikTok, vidéo 9:16 pour TikTok, accroches / hooks TikTok, budget ou ciblage TikTok, ou analyse de résultats TikTok.
---

# TikTok Ads — méthode du projet

Ce dépôt est un projet **Remotion** qui produit les pubs du **Pack Pousse des Cheveux 5 en 1 pour hommes (AURA BIO)** : 5 produits pour **49 DT** au lieu de 110 DT, paiement à la livraison, Tunisie, textes en **derja tunisienne**.

Avant toute action, lire ce qui existe déjà :
- `CAMPAGNE.md` : les 4 angles (A Deal, B Début de chute, C Naturel, D Cadeau), le plan Meta et la section **4. TikTok**
- `PLAN-MARKETING.md` : produits, prix, marge (CPA max ≈ 25 DT, objectif ≤ 10 DT par commande **livrée**)
- `ADS-STATIQUES.md` : textes par angle
- `src/config.ts` : prix, marque, téléphone (`50 500 051`)

Répondre à l'utilisateur **en français simple**, phrases courtes : il lit sur téléphone.

## 1. Règles TikTok à respecter

**Vidéo**
- Format **9:16, 1080×1920**, MP4 H.264, son activé.
- Durée conseillée : **9 à 21 s** pour la vente directe (les V1-Deal 18 s et V4-Gift 18 s sont bien placées ; V2-Early 30 s est la limite haute).
- **Zones sûres :** rien d'important dans les ~150 px du haut, les ~480 px du bas (texte, bouton, musique) et les ~140 px de droite (icônes j'aime / commentaire / partage). Les compositions `*-9x16` du projet respectent déjà ces zones.
- **Sous-titres incrustés** : beaucoup regardent sans le son.
- **Les 2 premières secondes décident tout** : produit + prix ou problème visible tout de suite, pas de logo en ouverture.
- Les pubs qui marchent sur TikTok ressemblent à du contenu normal (UGC, face caméra, mains qui montrent le produit), pas à une pub télé. Les fichiers `ugc1.mp4`, `ugc2.mp4` et `voice ugc.m4a` peuvent servir de base.
- Les images statiques ne passent **pas** dans le fil « Pour toi » : uniquement de la vidéo.

**Texte de la pub**
- **100 caractères maximum**, sans émojis en début ni lien. Court, en derja, avec le prix.
- Nom affiché : `AURA BIO`.

**Politique publicitaire (éviter les refus)**
- **Aucune promesse santé** : pas de « repousse garantie », pas de « stop calvitie », pas de DHT, pas de résultats chiffrés.
- Pas de photos avant / après truquées ni de crâne chauve en gros plan « choquant ».
- « الكمية محدودة » seulement si c'est vrai.
- Formulations sûres : « روتين طبيعي للشعر », « اعتني بجذور شعرك », « منتجات طبيعية ».

## 2. Choisir l'objectif

| Situation | Objectif TikTok | Pourquoi |
|---|---|---|
| Pas de site (cas actuel, commandes par téléphone / message) | **Génération de prospects** avec **formulaire instantané** : nom, téléphone, gouvernorat | Adapté au paiement à la livraison ; on rappelle pour confirmer |
| Site avec Pixel TikTok installé | **Ventes / Conversions** sur l'événement « Achat » ou « Passer commande » | L'algorithme optimise sur les vrais acheteurs |
| Lancer le compte, vidéos jamais testées | Publier d'abord en **organique**, puis **Spark Ads** sur les posts qui prennent | Les likes et commentaires restent visibles sur la pub |

## 3. Structure de campagne recommandée

- **Lancer TikTok après Meta**, avec les 2 angles gagnants (voir `CAMPAGNE.md`).
- **1 campagne** `AURA_HAIR_TT_<objectif>_<date>`.
- **1 groupe d'annonces par angle**, budget minimum TikTok d'environ **20 $/jour par groupe** (≈ 60 DT). Vérifier le minimum affiché dans Ads Manager, il peut changer.
- **Ciblage large** : Tunisie, hommes 20–40 (angles A, B, C) ou femmes 25–55 (angle D). Pas d'intérêts au départ : TikTok apprend vite.
- **2 à 3 vidéos par groupe** (la version Remotion + une version UGC si possible).
- **Créer tout en pause**, puis faire relire à l'utilisateur avant d'activer. Ne jamais lancer de dépense sans son accord explicite.
- Nommage des pubs : `AURA_HAIR_TT_<angle>_<vidéo>_<date>`, par ex. `AURA_HAIR_TT_A-Deal_V1_1106`.

## 4. Lire les résultats et décider

Attendre **3 jours ou ~2× le CPA cible dépensé** par groupe avant de juger.

| Indicateur | Bon | Action si mauvais |
|---|---|---|
| Taux de vue 2 s / 6 s | > 30 % / > 15 % | Refaire les 2 premières secondes (nouveau hook) |
| CTR | > 1 % | Rendre le prix et l'offre plus visibles, changer le texte |
| Coût par prospect | < 8 DT | Tester un autre angle ou une vidéo UGC |
| Coût par commande **livrée** | ≤ 10 DT (max 25 DT) | Couper au-dessus de 25 DT |

- **Gagnant** (CPA livré ≤ 10 DT) : augmenter le budget de **20 à 30 % tous les 2–3 jours**, pas plus.
- **Fatigue** (CTR qui baisse, coût qui monte après 7–14 jours) : nouveau hook sur la même vidéo, ou nouvelle vidéo.
- Toujours compter les refus de colis (15–25 %) : juger sur les commandes **livrées**.

## 5. Produire des vidéos TikTok avec Remotion

Compositions 9:16 déjà prêtes dans `src/Root.tsx` : `V1-Deal-9x16`, `V2-Early-9x16`, `V3-Natural-9x16`, `V4-Gift-9x16`, `HairPackReel`.

```console
npx remotion render V1-Deal-9x16 renders/tiktok/V1-Deal-9x16.mp4 --codec=h264 --crf=20
npx remotion still V1-Deal-9x16 renders/tiktok/cover-V1-Deal.jpg --frame=60
```

Pour une nouvelle variante TikTok :
1. Changer seulement le **hook** (les 2 premières secondes) : ajouter une scène dans `src/scenes/AngleHooks.tsx` ou une prop de hook, et garder le reste du montage.
2. Enregistrer une nouvelle composition `TT-<angle>-<hook>-9x16` dans `src/Root.tsx`, 1080×1920.
3. Vérifier les zones sûres sur une image fixe (`remotion still`) avant le rendu complet.
4. Lancer `npm run lint`, puis le rendu dans `renders/tiktok/`.
5. Commiter et pousser sur la branche de travail.

## 6. Banque d'accroches (derja, sans promesse santé)

| Angle | Accroche (0–2 s) |
|---|---|
| A · Deal | « 5 قطع بـ 49 د.ت برك؟ شوف شنوّة فيه 👇 » |
| A · Deal | « أقل من 10 د.ت للقطعة… و الخلاص عند الاستلام » |
| B · Début de chute | « الشعر بدا يخفّ؟ ما تستنّاش لين يفوت الفوت » |
| B · Début de chute | « 3 خطوات في الأسبوع لشعرك » |
| C · Naturel | « سدر و زيت إكليل الجبل… روتين طبيعي 100% » |
| C · Naturel | « بلاش مواد كيميائية على راسك » |
| D · Cadeau | « أحسن هدية لراجلك… بـ 49 د.ت » |
| UGC | « جرّبت الباك هذا شهر، هاو شنوّة صار » (seulement si c'est un vrai témoignage) |

Textes de pub (≤ 100 caractères) :
- `5 قطع بـ 49 د.ت عوض 110 • الخلاص عند الاستلام • اطلب توّا`
- `روتين طبيعي لشعرك: سدر + زيت إكليل الجبل + ديرما رولر • 49 د.ت`
- `أحسن هدية لراجلك • باك 5 قطع بـ 49 د.ت • الخلاص عند الاستلام`

## 7. Outils disponibles

- **Connecteur officiel « TikTok for Business »** (gratuit, à connecter sur claude.ai/customize/connectors, autorisation à renouveler tous les 30 jours). S'il est chargé dans la session (outils `mcp__*tiktok*`), l'utiliser pour lire le compte, les campagnes et les statistiques ; vérifier quels outils existent avant de promettre une création de campagne.
- **Sans connecteur** : préparer tous les réglages (objectif, groupes, budgets, ciblage, textes, fichiers) sous forme de checklist à recopier dans TikTok Ads Manager (ads.tiktok.com).
- Ne jamais inventer de chiffres de performance : demander à l'utilisateur une capture ou un export si les données ne sont pas accessibles.

## 8. Checklist avant lancement

- [ ] Compte TikTok Ads Manager créé, moyen de paiement ajouté
- [ ] Compte TikTok (organique) relié pour les Spark Ads
- [ ] Formulaire instantané prêt (nom, téléphone, gouvernorat) ou Pixel TikTok installé
- [ ] Vidéos 9:16 rendues, sous-titres lisibles, zones sûres respectées
- [ ] Textes ≤ 100 caractères, aucune promesse santé
- [ ] Stock confirmé pour la promo à 49 DT
- [ ] Script de confirmation téléphonique + upsell (2ᵉ huile à 20 DT) prêt
- [ ] Campagne créée **en pause** et validée par l'utilisateur
