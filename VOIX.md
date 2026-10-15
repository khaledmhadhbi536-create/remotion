# Voix off — réglages retenus

## Voix féminine (par défaut pour les produits femmes) ✅
- **Moteur :** Google AI Studio Speech = Gemini TTS, modèle `gemini-2.5-flash-preview-tts`
- **Voix :** `Gacrux` (voix mûre, choisie le 15/10 ; avant : `Sulafat`)
- **Consigne :** femme tunisienne de Tunis (la quarantaine), parle à d'autres femmes sur TikTok, derja tunisienne uniquement, ton chaleureux et naturel.
- **Script :** `scripts/tts-voix-feminine.py` — `python3 -I scripts/tts-voix-feminine.py gemini-2.5-flash-preview-tts Gacrux sortie.m4a "texte"` (clé Gemini via le secret réseau, quota gratuit).
- **Traitement « voix pro » (FFmpeg) :**
  `highpass=f=80,equalizer=f=200:t=q:w=1:g=1.5,equalizer=f=400:t=q:w=1.2:g=-2,equalizer=f=4000:t=q:w=1.4:g=2,highshelf=f=10000:g=1.5,deesser=i=0.35,acompressor=threshold=-22dB:ratio=3:attack=5:release=90:makeup=2,alimiter=limit=0.89,loudnorm=I=-16:TP=-1.5:LRA=7`
- Exemples validés : `renders/voix/gacrux/voix-katam-script1-gacrux.m4a` (Gacrux), `renders/voix/voix-katam-script1-aistudio.m4a` (Sulafat)

## Règles
- Écrire « ماء » (pas « ميّة »).
- Prix et numéros écrits en toutes lettres dans le texte envoyé à la voix.
- Jamais d'appel payant sans accord explicite ; annoncer le nombre d'appels avant de générer.
