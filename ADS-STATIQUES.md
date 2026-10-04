# 4 publicités statiques — Pack Pousse des Cheveux 5 en 1 pour hommes (AURA BIO, 49 DT)

Les 4 visuels sont dans `renders/statics/`, chacun en **4:5** (fil Facebook / Instagram, 1080×1350) et en **9:16** (Stories, 1080×1920, contenu dans les zones sûres).

**Même structure pour les 4 :**
1. Le tampon rouge « عرض استثنائي! » en haut.
2. Le titre de l'angle.
3. Les **5 produits en cartes numérotées**, dans l'ordre de la routine : 1- سدر بيو، 2- ديرما رولر 540، 3- زيت إكليل الجبل، 4- مشط الجذور، 5- فرشة التدليك.
4. « 5 قطع بـ 49 د.ت », « بلاصة 110 » barré, et le bouton.

Seuls la couleur, le titre et le bouton changent d'une pub à l'autre : le test compare donc bien les **angles**, à visuel égal.

| | Avatar | Angle | Hook visuel |
|---|---|---|---|
| **A · Deal** | Homme 22–50 sensible au prix, achète sur un coup de cœur | L'affaire : 5 pièces pour 49 DT, moins de 10 DT par pièce | « باك نموّ الشعر للرجال • أقل من 10 د.ت للقطعة » |
| **B · Début de chute** | Jeune homme 20–30 dont les cheveux commencent à s'affiner, inquiet pour son image | Agir maintenant, avant qu'il ne soit trop tard | « الشعر بدا يخفّ؟ ما تستنّاش لين يفوت الفوت » |
| **C · Naturel** | Homme 28–50 méfiant envers les produits chimiques | Ingrédients naturels de marque : sidr bio + huile de romarin | « من الطبيعة لجذور شعرك » |
| **D · Cadeau** | Femme 25–55 qui achète pour son mari, son père ou son frère | Cadeau utile pour un homme | « أحسن هدية لراجلك و إلا لبوك و خوك » |

Pour changer un prix, le nom de la marque ou un texte : `src/config.ts` et `src/statics/StaticAds.tsx`, puis lancez `npm run statics`.

---

## A · Deal — `static-A-Deal-4x5.jpg` / `-9x16.jpg`

**Texte principal**
```
🔥 عرض استثنائي على باك نموّ الشعر للرجال!
5 قطع بـ 49 د.ت برك عوض 110 د.ت:
✅ ديرما رولر 540 إبرة
✅ زيت إكليل الجبل AURA BIO
✅ سدر بيو AURA BIO
✅ قارورة مشط الجذور
✅ فرشة تدليك الراس
الخلاص عند الاستلام • الكمية محدودة
👇 ابعثلنا ميساج و اطلب توّا
📞 و إلا اتصل: 50 500 051
```
**Titre :** 5 قطع بـ 49 د.ت برك
**Bouton :** Envoyer un message (ou Acheter si vous avez un site)
**Ciblage :** hommes 22–50, Tunisie, **large** (Advantage+), sans intérêts : l'offre fait le tri.

## B · Début de chute — `static-B-Early-4x5.jpg` / `-9x16.jpg`

**Texte principal**
```
الشعر بدا يخفّ من القدّام و إلا من الفوق؟ ما تستنّاش لين يفوت الفوت.
روتين طبيعي في 3 خطوات:
1️⃣ اغسل بالسدر البيو بمشط الجذور باش يوصل للجذور
2️⃣ ديرما رولر مرّتين في الجمعة + قطرات زيت إكليل الجبل
3️⃣ فرشة التدليك باش تنشّط الدورة الدموية
الباك الكامل (5 قطع) بـ 49 د.ت • الخلاص عند الاستلام
👇 ابدا توّا، ابعثلنا ميساج
📞 و إلا اتصل: 50 500 051
```
**Titre :** ابدا الروتين قبل ما يفوت الفوت
**Bouton :** Envoyer un message
**Ciblage :** hommes 20–32 ; intérêts : salle de sport, mode homme, barbier, soins pour hommes.

## C · Naturel — `static-C-Natural-4x5.jpg` / `-9x16.jpg`

**Texte principal**
```
تحب حاجة طبيعية لشعرك، بلا كيمياء؟ 🌿
• سدر بيو AURA BIO: يغسل و ينظّف بلطف
• زيت إكليل الجبل AURA BIO: يغذّي الجذور
+ ديرما رولر، قارورة مشط الجذور و فرشة التدليك
الباك الكامل 5 قطع بـ 49 د.ت • الخلاص عند الاستلام
👇 اطلب توّا
📞 و إلا اتصل: 50 500 051
```
**Titre :** روتين طبيعي للشعر • 5 قطع بـ 49 د.ت
**Bouton :** Envoyer un message
**Ciblage :** hommes 28–50 ; intérêts : produits naturels, bio, huiles essentielles, phytothérapie, barbe.

## D · Cadeau — `static-D-Gift-4x5.jpg` / `-9x16.jpg`

**Texte principal**
```
تلوّجي على هدية تنفع لراجلك، لبوك و إلا لخوك؟ 🎁
باك عناية بالشعر للرجال فيه 5 قطع:
ديرما رولر • زيت إكليل الجبل • سدر بيو • قارورة مشط الجذور • فرشة تدليك
بـ 49 د.ت برك • الخلاص عند الاستلام
👇 ابعثيلنا ميساج و اطلبيه توّا
📞 و إلا اتصلي: 50 500 051
```
**Titre :** أحسن هدية لراجلك
**Bouton :** Envoyer un message
**Ciblage :** **femmes** 25–55 ; large, ou intérêts cadeaux / mariage / famille.
**Calendrier :** à pousser avant l'Aïd, la fête des pères (juin), la Saint-Valentin et les anniversaires de mariage.

---

## Plan de test

1. **Campagne Ventes, budget par ensemble de publicités (ABO).** Créez **4 ensembles, un par avatar**, chacun avec son audience ci-dessus et **12 à 15 DT/jour pendant 4 à 5 jours**.
2. **Dans chaque ensemble, mettez 2 publicités :** la statique de l'avatar (4:5 + 9:16 en placements personnalisés) et la **vidéo** 4:5 / 9:16. Vous saurez ainsi quel angle gagne, et si le statique ou la vidéo convertit le mieux.
3. **Critères pour couper ou garder :**

   | Indicateur | Objectif |
   |---|---|
   | CTR lien | > 1,5 % |
   | Coût par conversation | < 3 DT |
   | Coût par commande **livrée** | < 10 DT (marge avant pub ≈ 25 DT si la livraison est payée par le client) |

   Coupez au bout de 3 jours ce qui dépasse 2 fois l'objectif. Augmentez de 20 % tous les 2 jours le budget des gagnants.
4. **Itérez sur le gagnant :** gardez l'angle et changez seulement le hook (titre du visuel, ou premier mot du texte).

## Conformité Meta

- **Aucune allégation médicale** dans les visuels : pas de « repousse garantie » et pas de « DHT ». La ligne DHT n'existe que dans la vidéo, à retirer pour les pubs payantes.
- **On ne s'adresse pas à la personne sur sa condition :** les accroches sont impersonnelles (« الشعر بدا يخفّ؟ », pas « شعرك يطيح؟ »).
- **Pas de faux avis, faux chiffres ni faux avant/après.**
