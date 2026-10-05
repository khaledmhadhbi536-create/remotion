# Landing page — Pack 5 en 1 à 49 DT

Page de vente en derja, une seule page (`index.html` + `img/`, moins de 1 Mo), pensée pour le mobile.

**Contenu :** l'offre (5 pièces, 110 DT barré, **49 DT**, −55 %), la vidéo V1-Deal, le détail des 5 produits avec leur prix, la routine en 3 étapes, le formulaire de commande, une FAQ et une barre « اطلب توّا » fixée en bas de l'écran.

## En ligne

**https://aura-bio-store.vercel.app/**

Lien à mettre dans chaque pub (la lettre sert à savoir quelle pub a vendu) :

| Pub | Lien |
|---|---|
| A · Deal | https://aura-bio-store.vercel.app/?a=A |
| B · Début de chute | https://aura-bio-store.vercel.app/?a=B |
| C · Naturel | https://aura-bio-store.vercel.app/?a=C |
| D · Cadeau | https://aura-bio-store.vercel.app/?a=D |

## Commande

1. Le client remplit le formulaire : nom, téléphone (8 chiffres, vérifié), gouvernorat, adresse.
2. Une case propose l'**upsell** : 2ᵉ huile de romarin à 20 DT.
3. La commande s'ouvre dans **WhatsApp** (au 50 500 051), avec un message déjà rempli. Si WhatsApp ne s'ouvre pas, un bouton de secours et un lien d'appel sont affichés.

Les frais de livraison sont annoncés « à la confirmation » : ils ne sont **pas** offerts.

## Un lien par angle

Ajoutez `?a=A`, `?a=B`, `?a=C` ou `?a=D` au lien de chaque pub. Le titre s'adapte à l'angle, et la lettre est ajoutée au message WhatsApp (« … 5 في 1 (B) ») : vous savez quelle pub a vendu.

| Angle | Titre de la page |
|---|---|
| A (ou rien) | باك نموّ الشعر للرجال • 5 قطع بـ 49 د.ت |
| B | الشعر بدا يخفّ؟ ما تستنّاش لين يفوت الفوت |
| C | من الطبيعة لجذور شعرك |
| D | أحسن هدية لراجلك (boutons au féminin : اطلبيه) |

## Réglages

En bas de `index.html`, dans le bloc `CONFIG` :
- `whatsapp` : le numéro qui reçoit les commandes (`21650500051`) ;
- `pixelId` : l'ID du pixel Meta. Une fois rempli, la page envoie `PageView`, `ViewContent`, `InitiateCheckout` (premier clic dans le formulaire) et `Lead` (commande envoyée) ;
- `pack` et `extraOil` : les prix.

## Mise en ligne

Il suffit d'héberger le dossier `landing/` tel quel. Le plus simple : le glisser sur Netlify Drop, ou passer par GitHub Pages ou Cloudflare Pages. Mettez ensuite le lien dans les pubs, avec le bouton **Acheter** ou **En savoir plus** à la place de « Envoyer un message ».

Après la mise en ligne, la balise `og:image` de `index.html` doit pointer vers l'adresse complète de l'image (c'est fait pour `https://aura-bio-store.vercel.app/img/og.jpg` ; à changer si le domaine change) : Facebook et WhatsApp n'affichent pas l'image d'aperçu avec un chemin relatif.
