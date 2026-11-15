import type { AdSpec } from "./RouteAds";

// Lot 3 — "Al Mozon, votre route vers l'Allemagne".
// Each ad: 3 s plane hook → strengths on real footage → WhatsApp end card.
// `vo` is the French + derja voice-over script, timed to the scenes.

export type AdWithVo = AdSpec & { vo: string[] };

export const ADS: AdWithVo[] = [
  {
    id: "AMZ-ROUTE",
    keyword: "ROUTE",
    hook: {
      tag: "Destination Allemagne",
      line1: "Ton vol pour l'Allemagne",
      line2: "décolle de Radès.",
    },
    shots: [
      { clip: "book", frames: 48, tag: "Formation", line1: "De A1 à B2", line2: "allemand pro + examens" },
      { kind: "prof", frames: 54, tag: "Profs", line1: "Des profs qui", line2: "parlent ta langue", sub: "Chkoun bech y9arik ? Ahna." },
      { clip: "test", frames: 48, tag: "Accompagnement", line1: "On te suit", line2: "de A à Z" },
      { kind: "platform", frames: 54, tag: "Plateforme en ligne", line1: "Ta plateforme pro", line2: "même depuis chez toi" },
      { clip: "garden", frames: 48, tag: "Espace", line1: "Une villa avec jardin,", line2: "pas un appartement." },
      { clip: "raum", frames: 42, tag: "Ambition", line1: "Les salles s'appellent", line2: "déjà Berlin & Stuttgart" },
      { clip: "wave", frames: 45, tag: "Disponibilité", line1: "On commence", line2: "quand tu veux" },
      { kind: "dossier", frames: 75, tag: "Traitement de dossier", line1: "Ton dossier,", line2: "on s'en occupe avec toi" },
    ],
    vo: [
      "[0–3 s] Ton vol pour l'Allemagne ? Ydémarri men Radès.",
      "[3–8 s] Al Mozon, c'est ta route : formation de A1 à B2, des profs m3ak, w accompagnement men l'bidaya.",
      "[8–14 s] Plateforme pro en ligne, une villa avec jardin, w tabda wa9t ma t7eb.",
      "[14–16.8 s] W dossier mte3ek, nkhadmouh m3ak.",
      "[16.8–20.3 s] Al Mozon, ta route vers l'Allemagne. Remise taw ! Ab3ath ROUTE 3al WhatsApp.",
    ],
  },
  {
    id: "AMZ-DOSSIER",
    keyword: "DOSSIER",
    hook: {
      tag: "Visa · papiers · dossier",
      line1: "Tu te perds",
      line2: "dans ton dossier ?",
    },
    shots: [
      { kind: "dossier", frames: 96, tag: "Traitement de dossier", line1: "Ton dossier,", line2: "on le traite avec toi", sub: "Ma tab9ach wa7dek." },
      { clip: "test", frames: 54, tag: "Accompagnement", line1: "Un conseiller", line2: "qui te suit" },
      { clip: "book", frames: 48, tag: "Formation", line1: "Le bon niveau", line2: "pour ton projet" },
    ],
    vo: [
      "[0–3 s] Visa, papiers, dossier… mdawekh ?",
      "[3–6 s] Ma tab9ach wa7dek : à Al Mozon, on traite ton dossier avec toi.",
      "[6–8 s] Un conseiller yetb3ek men l'test de niveau 7atta l'départ.",
      "[8–10 s] W formation bel niveau eli yotolbouh menek.",
      "[10–13 s] Al Mozon, ta route vers l'Allemagne. Ab3ath DOSSIER 3al WhatsApp.",
    ],
  },
  {
    id: "AMZ-PROFS",
    keyword: "PROF",
    hook: {
      tag: "Tes profs",
      line1: "Qui va t'apprendre",
      line2: "l'allemand ?",
    },
    shots: [
      { kind: "prof", frames: 105, tag: "Profs", line1: "Des vrais profs,", line2: "pas une appli", sub: "Chkoun bech y9arik ? Ahna." },
      { clip: "class2", frames: 54, tag: "Petits groupes", line1: "Chaque élève", line2: "suivi de près" },
      { clip: "book", frames: 45, tag: "Formation", line1: "Allemand pro", line2: "+ préparation examen" },
    ],
    vo: [
      "[0–3 s] Chkoun bech y9arik l'almani ?",
      "[3–6.5 s] Ahna ! Des vrais profs, mouch application.",
      "[6.5–8.5 s] Petits groupes : kol wa7ed nchoufouh w nsal7ouh.",
      "[8.5–10 s] Allemand pro, w préparation l'examen.",
      "[10–13.5 s] Al Mozon, ta route vers l'Allemagne. Remise taw, ab3ath PROF.",
    ],
  },
  {
    id: "AMZ-PLATEFORME",
    keyword: "EN LIGNE",
    hook: {
      tag: "Plateforme en ligne",
      line1: "Réviser l'allemand",
      line2: "même depuis chez toi ?",
    },
    shots: [
      { kind: "platform", frames: 84, tag: "Plateforme pro", line1: "Cours, audio, quiz", line2: "24h/24 sur ton tél", sub: "Rajja3 dars fi dar." },
      { clip: "class", frames: 54, tag: "En classe", line1: "+ les cours", line2: "avec ton prof à Radès" },
      { clip: "wave", frames: 45, tag: "Disponibilité", line1: "On commence", line2: "quand tu veux" },
    ],
    vo: [
      "[0–3 s] T7eb trajja3 l'almani men dar ?",
      "[3–6 s] Plateforme pro en ligne : cours, audio, quiz, 24h/24 3al téléphone.",
      "[6–8 s] W en classe, m3a prof-ek à Radès.",
      "[8–9.5 s] Tabda wa9t ma t7eb.",
      "[9.5–13 s] Al Mozon, ta route vers l'Allemagne. Ab3ath EN LIGNE 3al WhatsApp.",
    ],
  },
  {
    id: "AMZ-DISPO",
    keyword: "HORAIRE",
    hook: {
      tag: "Disponibilité",
      line1: "Tu travailles ?",
      line2: "Tu étudies ?",
    },
    shots: [
      { clip: "wave", frames: 54, tag: "Disponibilité", line1: "On s'adapte", line2: "à ton emploi du temps", sub: "Tabda wa9t ma t7eb." },
      { kind: "platform", frames: 60, tag: "Plateforme en ligne", line1: "Tu rattrapes", line2: "en ligne" },
      { clip: "class2", frames: 54, tag: "Accompagnement", line1: "Ton prof", line2: "te suit chaque semaine" },
    ],
    vo: [
      "[0–3 s] Tekhdem ? Ta9ra ? Ma 3andekch wa9t ?",
      "[3–5 s] Nadaptiw m3a wa9tek, w tabda wa9t ma t7eb.",
      "[5–7 s] Fatek dars ? Trajj3ou en ligne.",
      "[7–8.5 s] W prof-ek yetb3ek kol jem3a.",
      "[8.5–12 s] Al Mozon, ta route vers l'Allemagne. Ab3ath HORAIRE.",
    ],
  },
  {
    id: "AMZ-ESPACE",
    keyword: "VILLA",
    hook: {
      tag: "Notre espace",
      line1: "Apprendre l'allemand",
      line2: "dans une villa ?",
    },
    shots: [
      { clip: "garden", frames: 54, tag: "Espace", line1: "Une villa avec jardin,", line2: "pas un appartement." },
      { clip: "door", frames: 45, tag: "À Radès", line1: "À côté", line2: "de chez toi" },
      { clip: "raum", frames: 45, tag: "Ambition", line1: "Raum Berlin,", line2: "Raum Stuttgart…" },
      { clip: "stairs", frames: 42, tag: "Ton départ", line1: "Ici, on prépare", line2: "ton départ" },
    ],
    vo: [
      "[0–3 s] Ta9ra almani fi villa ? Ey, à Radès.",
      "[3–5 s] Villa b jnina, mouch appartement.",
      "[5–6.5 s] 9rib men darek.",
      "[6.5–8 s] W les salles, esmhom déjà Berlin w Stuttgart.",
      "[8–9.5 s] Lehna, nhadhrou départ-ek.",
      "[9.5–13 s] Al Mozon, ta route vers l'Allemagne. Ab3ath VILLA.",
    ],
  },
  {
    id: "AMZ-AMBITION",
    keyword: "PLAN",
    hook: {
      tag: "Ton ambition",
      line1: "L'Allemagne,",
      line2: "c'est ton projet ?",
    },
    shots: [
      { clip: "test", frames: 54, tag: "Test gratuit", line1: "On construit", line2: "ton plan perso", sub: "Niveau, durée, examen." },
      { clip: "book", frames: 45, tag: "Formation", line1: "De A1 à B2,", line2: "étape par étape" },
      { kind: "dossier", frames: 75, tag: "Jusqu'au départ", line1: "On t'accompagne", line2: "jusqu'au bout" },
    ],
    vo: [
      "[0–3 s] L'Allemagne, howa projet-ek ?",
      "[3–5 s] Test de niveau gratuit, w nebniw m3ak plan-ek.",
      "[5–6.5 s] Men A1 l B2, étape par étape.",
      "[6.5–9 s] W nemchiw m3ak 7atta l'dossier w l'départ.",
      "[9–12.5 s] Al Mozon, ta route vers l'Allemagne. Ab3ath PLAN.",
    ],
  },
];
