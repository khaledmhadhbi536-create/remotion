// ╔══════════════════════════════════════════════════════════════════════╗
// ║  NOURA · Huile Éclat — pub Meta 30s 1:1                               ║
// ║  TOUT ce qui se change sans toucher aux scènes est ici.               ║
// ╚══════════════════════════════════════════════════════════════════════╝

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1080;
export const DURATION_FRAMES = 30 * FPS; // exactement 30 s

// ── Produit ────────────────────────────────────────────────────────────
export const PRODUCT = {
  brand: "NOURA",
  brandTagline: "Hair Care · Tunisie",
  name: "Huile Éclat",
  nameAr: "زيت نورة",
  subtitle: "7 huiles naturelles",
  heroIngredient: "Figue de Barbarie",
  heroIngredientAr: "زيت الهندي",
  volume: "50 ml",
  price: "59 DT",
  // Mettre `null` pour masquer le prix sur l'écran final
  showPrice: true,
  website: "noura-hair.tn",
  // Couleur du flacon dessiné en code (si aucune photo produit n'est fournie)
  bottle: {
    glass: "#8A4B1F",
    glassLight: "#D08A45",
    liquid: "#E2A447",
    cap: "#1E1712",
    label: "#F7EFE3",
  },
} as const;

// ── Palette (beige, crème, blanc cassé, brun chaud, touches dorées) ───
export const COLORS = {
  cream: "#F7EFE3",
  ivory: "#FBF7F1",
  beige: "#E9D8C1",
  sand: "#D9C0A0",
  brown: "#5A3A22",
  brownDeep: "#2E1E13",
  brownSoft: "#8C6446",
  gold: "#C9A063",
  goldLight: "#E8CC96",
  goldDeep: "#9C7438",
  white: "#FFFFFF",
  red: "#B5473A", // ❌ du problème, chaud et pas criard
  hairDry: "#9B7653",
  hairHealthy: "#3B2416",
} as const;

// ── Timeline (secondes) — respectée à l'image près ─────────────────────
export const TIMELINE = {
  hook: { from: 0, to: 3 },
  problem: { from: 3, to: 8 },
  reveal: { from: 8, to: 14 },
  benefits: { from: 14, to: 21 },
  proof: { from: 21, to: 26 },
  cta: { from: 26, to: 30 },
} as const;

export type SceneKey = keyof typeof TIMELINE;
export const sec = (s: number) => Math.round(s * FPS);

// ── Textes à l'écran (5–7 mots max par écran) ──────────────────────────
// Les icônes (✨ ❌ ❤ 🌿 💧 drapeau) sont dessinées en SVG pour un rendu identique partout :
// ne les ajoutez pas dans les textes.
export const COPY = {
  hook: {
    line1: "شعرك ديما ناشف؟",
    emoji: "😩",
    line2: "ويتكسّر برشا؟",
  },
  problem: {
    items: ["منفوش", "ناشف", "بلا لمعة"],
    // Petit sous-texte français (code-switching naturel)
    itemsFr: ["Frizz", "Cheveux secs", "Zéro brillance"],
    punch: "جرّبتي كل شي… وما تبدّل شي",
  },
  reveal: {
    question: "الحل؟",
    badge: "7 زيوت طبيعية",
    ingredient: "بزيت الهندي التونسي",
  },
  benefits: {
    title: "بضع قطرات برك",
    signature: "والنتيجة تحكي وحدها",
    items: ["شعر أطرى", "لمعة أكثر", "تكسير أقل"],
    before: "قبل",
    after: "بعد",
  },
  proof: {
    // ⚠️ AVANT DE LANCER LA PUB : remplacez par un VRAI avis client
    // (capture WhatsApp / commentaire) avec l'accord de la cliente.
    quote: "شعري تبدّل برشا",
    author: "Mariem · Sousse",
    // ⚠️ Donnée de DÉMONSTRATION : n'affirmez un chiffre que s'il est vrai.
    claim: "عجبت برشا تونسيات",
    claimFr: "Déjà adoptée par des centaines de Tunisiennes",
    madeIn: "صُنع في تونس",
    // ⚠️ Avis illustratifs : remplacez-les par de vrais commentaires clients.
    bubbles: ["ريحتو تهبل", "خفيف وما يدهنش"],
  },
  cta: {
    headline: "جرّبيه توّا",
    button: "COMMANDER MAINTENANT",
    sub: "Commande en ligne",
    trust: "توصيل لكل الولايات · الدفع عند الاستلام",
  },
} as const;

// ── Voix off (script exact, Derja) ─────────────────────────────────────
// 67 mots (≈ 2,3 mots/s : rythme naturel d'une créatrice de contenu). Chaque ligne indique quand elle doit commencer (en secondes).
export const VOICEOVER_SCRIPT = [
  { at: 0.15, scene: "hook", text: "شعرك ديما ناشف ويتكسّر؟ إستنّى، هذا ليك." },
  {
    at: 3.1,
    scene: "problem",
    text: "تمشّطيه يتنفّش، تحطّي كريمات وما يتبدّل شي، وفي الآخر تلمّيه بالبنسة وخلاص.",
  },
  {
    at: 8.2,
    scene: "reveal",
    text: "تعرّفي على زيت نورة: سبعة زيوت طبيعية، والسرّ متاعو زيت الهندي التونسي، خفيف وما يدهنش.",
  },
  {
    at: 14.2,
    scene: "benefits",
    text: "بضع قطرات برك على الأطراف، وشعرك يولّي أطرى، يلمع، ويتكسّر أقل. والنتيجة تحكي وحدها.",
  },
  {
    at: 21.2,
    scene: "proof",
    text: "والبنات اللي جرّبوه الكل يقولولك نفس الكلمة: شعري تبدّل برشا!",
  },
  {
    at: 26.2,
    scene: "cta",
    text: "جرّبيه توّا! التوصيل لكل تونس والخلاص عند الاستلام.",
  },
] as const;

// ── Assets ─────────────────────────────────────────────────────────────
// Chemins relatifs à /public. `null` = visuel dessiné en code (placeholder premium).
// Déposez vos fichiers puis remplacez `null` par le chemin, ex. "noura/images/product.png".
export const ASSETS = {
  images: {
    product: null as string | null, // PNG détouré, fond transparent, flacon de face, ≥ 1200 px de haut
    logo: null as string | null, // PNG/SVG transparent, logo horizontal clair sur fond crème
    hookHair: null as string | null, // macro cheveux secs/frisottés (1080×1080)
    problemModel: null as string | null, // femme qui se coiffe, frustrée (1080×1080)
    before: null as string | null, // AVANT : longueurs ternes, même cadrage que after
    after: null as string | null, // APRÈS : mêmes cheveux, brillants
    customer: null as string | null, // photo cliente (avec accord) ou avatar, carré
  },
  // Vidéos optionnelles (remplacent les images ci-dessus si fournies), muettes, 1080×1080
  videos: {
    hookHair: null as string | null, // ex. "noura/video/hook.mp4"
    problemModel: null as string | null,
  },
  audio: {
    music: "noura/audio/music.mp3",
    // Voix off enregistrée en un seul fichier de 30 s, calée sur VOICEOVER_SCRIPT.
    // Mettre le chemin, ex. "noura/audio/voiceover.mp3", une fois le fichier déposé.
    voiceover: null as string | null,
    sfx: {
      stop: "noura/audio/stop-hit.mp3",
      whoosh: "noura/audio/whoosh.mp3",
      pop: "noura/audio/pop.mp3",
      sparkle: "noura/audio/sparkle.mp3",
      click: "noura/audio/click.mp3",
      impact: "noura/audio/impact.mp3",
    },
  },
};

// ── Mixage ─────────────────────────────────────────────────────────────
export const MIX = {
  music: 0.55, // sans voix off
  musicUnderVoice: 0.22, // ducking automatique quand une voix off est fournie
  voiceover: 1,
  sfx: 0.45,
};

// ── Safe zone ──────────────────────────────────────────────────────────
// Rien d'important à moins de 90 px des bords (≈ 8 %). Passez à true pour l'afficher dans le Studio.
export const SAFE_MARGIN = 90;
export const SHOW_SAFE_ZONE = false;
