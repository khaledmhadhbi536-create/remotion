# Campagne — Pack Pousse des Cheveux 5 en 1 pour hommes (AURA BIO, 49 DT)

Plan media buying prêt à lancer : **4 avatars × 2 créas (1 vidéo + 1 statique) × formats adaptés à chaque réseau**.

## 1. Matrice créative

| Angle | Avatar | Vidéo | Statique | Accroche des 2 premières secondes |
|---|---|---|---|---|
| **A · Deal** | Hommes 22–50, achat d'impulsion | `V1-Deal` 18s | `static-A-Deal` | « عرض استثنائي! 5 قطع بـ 49 د.ت » |
| **B · Début de chute** | Hommes 20–32, cheveux qui s'affinent | `V2-Early` 30s (routine en 3 étapes) | `static-B-Early` | « الشعر بدا يخفّ؟ ما تستنّاش لين يفوت الفوت » |
| **C · Naturel** | Hommes 28–50, anti-chimique | `V3-Natural` 26s | `static-C-Natural` | « من الطبيعة… لجذور شعرك » |
| **D · Cadeau** | **Femmes** 25–55 qui achètent pour leur homme | `V4-Gift` 18s | `static-D-Gift` | « أحسن هدية لراجلك » (boîte cadeau qui s'ouvre) |

**Toutes les vidéos ont :**
- les 5 produits **numérotés** (1- سدر بيو … 5- فرشة التدليك) ;
- la valeur « 110 د.ت » barrée, puis **49 د.ت** et « الخلاص عند الاستلام » ;
- un bouton d'appel à l'action accordé à la cible : « اطلب » ou « ابدا » pour les hommes, « اطلبيه » pour les femmes ;
- un **sound design** complet : whoosh à chaque coupe, pop pour chaque produit, cloche sur le prix ;
- une musique où **chaque coupe tombe sur une mesure**.

**Aucune allégation santé** (pas de DHT, pas de « repousse garantie ») : moins de refus Meta et TikTok.

## 2. Formats par réseau et emplacement

| Réseau | Emplacement | Format à charger | Fichiers |
|---|---|---|---|
| Facebook | Fil, vidéos in-stream, Marketplace, résultats de recherche | **4:5** | `renders/campaign/V*-4x5.mp4`, `renders/statics/static-*-4x5.jpg` |
| Instagram | Fil, Explorer, Profil | **4:5** | idem |
| Facebook + Instagram | **Stories et Reels** | **9:16** | `renders/campaign/V*-9x16.mp4`, `renders/statics/static-*-9x16.jpg` |
| TikTok | In-Feed (For You) | **9:16 vidéo** (les statiques ne tournent pas sur le For You) | `renders/campaign/V*-9x16.mp4` |
| À exclure | Audience Network, colonne de droite, boîte de réception Messenger | — | — |

- **Le 9:16 est calé pour Instagram ET TikTok :** rien d'important dans les ~250px du haut, les ~480px du bas et la colonne d'icônes à droite.
- **Les sous-titres arabes sont incrustés** : la vidéo est complète même en muet.
- **Couvertures :** `renders/campaign/cover-*.jpg`, à utiliser comme miniature Reels / TikTok.

## 3. Meta (Facebook + Instagram)

### Phase 1 : test des angles (jours 1 à 5)

- **Campagne :** objectif **Ventes**, conversion dans les **Messages** (Messenger + WhatsApp + Instagram Direct), adapté au paiement à la livraison. Si vous avez un site avec pixel : conversion **Site web → Achat**.
- **Budget par ensemble de publicités (ABO) :** 4 ensembles × **15 DT/jour** = 60 DT/jour, soit **≈ 300 DT** pour le test.
- **Emplacements :** Advantage+, **sauf** Audience Network, colonne de droite et Messenger.

| Ensemble | Audience | Publicités |
|---|---|---|
| `ADS_A-Deal` | Hommes 22–50, Tunisie, **large** | V1-Deal + static-A |
| `ADS_B-Early` | Hommes 20–32 ; salle de sport, mode homme, barbier | V2-Early + static-B |
| `ADS_C-Natural` | Hommes 28–50 ; produits naturels, bio, huiles essentielles | V3-Natural + static-C |
| `ADS_D-Gift` | **Femmes** 25–55 ; large ou cadeaux / mariage / famille | V4-Gift + static-D |

- **Montage de chaque publicité :** chargez le **4:5 et le 9:16 dans la même publicité** (« Personnaliser les éléments par emplacement »). Mettez le texte principal de `ADS-STATIQUES.md` pour l'angle (les mêmes textes servent pour la vidéo).
- **Attribution dans la messagerie :** un **message pré-rempli différent par angle**, par exemple « سلام، نحب الباك (A) » ou « (B) ». À chaque conversation, vous savez quel angle a vendu.
- **Nommage :** `AURA_HAIR_<angle>_<vidéo|static>_<date>`, par exemple `AURA_HAIR_A-Deal_video_0410`.

### Indicateurs et règles de décision

| Indicateur | Bon | À couper |
|---|---|---|
| Hook rate (vues 3s / impressions) | > 25 % | < 15 % → changer les 2 premières secondes |
| Hold rate (ThruPlay / vues 3s) | > 30 % | < 15 % |
| CTR lien | > 1,5 % | < 0,8 % |
| Coût par conversation | < 3 DT | > 6 DT après 3 jours |
| Coût par commande **livrée** | < 10 DT | > 20 DT |

**Jour 3 :** coupez les publicités sous les seuils. **Jour 5 :** gardez les **2 meilleurs angles**.

### Phase 2 : montée en puissance (jours 6 à 14)

- **Campagne de scaling en CBO** avec les 2 angles gagnants (dupliqués), 100 DT/jour ou plus, **+20 % toutes les 48 h** tant que le coût par commande livrée reste sous 10 DT.
- **Retargeting** (10 DT/jour) sur les personnes qui ont vu 50 % d'une vidéo ou interagi avec la page / Instagram dans les 30 derniers jours, avec **V1-Deal et static-A** (urgence + prix).
- **Nouvelles créas** toutes les 2 semaines sur l'angle gagnant : on change seulement le hook (2 premières secondes ou titre du visuel).

## 4. TikTok

- **À lancer une fois les angles gagnants connus sur Meta** : le budget minimum TikTok est d'environ 20 $/jour par groupe d'annonces, soit environ 60 DT.
- **Objectif :** génération de prospects (formulaire instantané : nom, téléphone, gouvernorat), adapté au paiement à la livraison. Ou Conversions si vous avez un site avec pixel TikTok.
- **Créas :** les vidéos 9:16 des 2 angles gagnants (V1-Deal et V2-Early sont les plus « natives » TikTok).
- **Spark Ads :** postez d'abord les vidéos en organique sur le compte TikTok, puis sponsorisez les posts qui prennent. Les likes et commentaires restent visibles sur la pub.
- **Audience :** hommes 20–40, Tunisie, ciblage large. L'algorithme TikTok apprend vite.

## 5. Avant de lancer (checklist)

- [ ] Page Facebook + compte Instagram reliés au Business Manager, avec WhatsApp Business connecté
- [ ] Moyen de paiement sur le compte publicitaire
- [ ] Stock confirmé pour la promo à 49 DT (« الكمية محدودة » doit être vrai)
- [ ] Script de confirmation téléphonique + upsell 2ᵉ huile de romarin à 20 DT (voir `PLAN-MARKETING.md`)
- [ ] Frais de livraison annoncés à la confirmation (la livraison n'est **pas** offerte)
- [ ] Messages pré-remplis A / B / C / D configurés

## 6. Fichiers

| Dossier | Contenu |
|---|---|
| `renders/campaign/` | 8 vidéos (4 angles × 4:5 et 9:16) + couvertures |
| `renders/statics/` | 8 visuels (4 angles × 4:5 et 9:16) |
| `ADS-STATIQUES.md` | Textes, titres, boutons et ciblage par angle |
| `PLAN-MARKETING.md` | Produits, prix, marge, opérations |

Pour refaire les rendus après une modification : `npm run campaign` (vidéos) et `npm run statics` (visuels).

## 7. Mise en place dans Meta (créée en pause)

### Compte Akram Bdiri (`1530000945485232`), compte à utiliser

Campagne `AURA_HAIR_5en1_49DT_Test-Angles` (`120251698952020152`), en pause : mêmes réglages et mêmes textes que sur NATURA.

| Ensemble | ID | Pubs (vidéo + statique) |
|---|---|---|
| A · hommes 22–50 · 3 $/j | **à créer** | à créer |
| B · hommes 20–32 · 3 $/j | **à créer** | à créer |
| C · hommes 28–50 · 3 $/j | 120251698952730152 | 120251699017390152, 120251699017490152 |
| D · femmes 25–55 · 3 $/j | 120251698953010152 | 120251699017680152, 120251699017910152 |

Toutes les créas (vidéos, statiques, textes) portent le numéro de commande **50 500 051**. Les pubs C et D sans numéro sont archivées.

Pour A et B : dans le Gestionnaire, dupliquez l'ensemble C, puis changez l'âge et remplacez les pubs par celles de l'angle A ou B.

### Ancienne version : compte NATURA VASELINE TEST

Compte publicitaire **NATURA VASELINE TEST** (`1984526072212989`), page **Aura Bio**, destination **Messenger**, budget en USD.

| Élément | Nom | ID |
|---|---|---|
| Campagne (Ventes → conversations Messenger, budget par ensemble) | `AURA_HAIR_5en1_49DT_Test-Angles` | 120250835775190050 |
| Ensemble A · hommes 22–50 · 3 $/j | `ADS_A-Deal_H22-50_TN` | 120250835780150050 |
| Ensemble B · hommes 20–32 · 3 $/j | `ADS_B-Early_H20-32_TN` | 120250835780650050 |
| Ensemble C · hommes 28–50 · 3 $/j | `ADS_C-Natural_H28-50_TN` | 120250835781290050 |
| Ensemble D · femmes 25–55 · 3 $/j | `ADS_D-Gift_F25-55_TN` | 120250835781950050 |

**Publicités créées : 8, toutes en pause.** Une vidéo + une statique par angle (A, B, C, D).
- Bouton « Envoyer un message ».
- Texte en derja de `ADS-STATIQUES.md`.

**Emplacements :** Facebook (fil, Stories, Reels, Marketplace, vidéos, profil). Audience Network, colonne de droite et Messenger sont exclus.

**À faire dans le Gestionnaire de publicités avant d'activer :**
1. **9:16 pour Stories / Reels** : dans chaque pub, utilisez « Modifier le média par emplacement » et choisissez le fichier `…_9x16` déjà chargé.
2. **Instagram** : le compte Instagram est relié à la page, mais pas au compte publicitaire. Dans Paramètres du business (naturaglow) → Comptes → Comptes Instagram → Aura Bio → Éléments connectés, ajoutez NATURA VASELINE TEST. Ensuite, les pubs seront recréées avec l'identité Instagram et les emplacements Instagram seront ajoutés.
3. **Message pré-rempli** différent par angle (A / B / C / D), dans la partie « Modèle de message » de chaque pub.
4. **Activer la campagne** quand tout est prêt.
