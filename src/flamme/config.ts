// Flamme Noble — "transition edit" ad (CapCut-template style: hard cuts on the beat,
// whip pans with motion blur, echo layers, pink RGB glitch slices, white flashes, punchy grade).
//
// Everything that changes per product lives here. The shots in public/flamme-noble/ are
// STAND-INS (AURA BIO photos) until the Flamme Noble product photos are exported from Drive:
// drop the new files in public/flamme-noble/ and update SHOTS / OFFER.

export const FPS = 30;
// 120 BPM soundtrack → one beat = 15 frames. Every cut below lands on a beat.
export const BEAT = 15;

export type Entry = "whip" | "glitch" | "flash" | "zoom";

export type Shot = {
  readonly src: string; // file in public/
  readonly entry: Entry; // how the shot comes in
  readonly beats: number; // length in beats
  readonly focusY?: number; // vertical crop, 0 (top) → 100 (bottom)
  readonly caption?: string; // Arabic punchline, optional
};

export const SHOTS: Shot[] = [
  {
    src: "flamme-noble/shot-1.jpg",
    entry: "flash",
    beats: 2,
    focusY: 45,
    caption: "فلام نوبل",
  },
  { src: "flamme-noble/shot-2.jpg", entry: "whip", beats: 1, focusY: 50 },
  { src: "flamme-noble/shot-3.jpg", entry: "whip", beats: 1, focusY: 45 },
  {
    src: "flamme-noble/shot-4.jpg",
    entry: "glitch",
    beats: 2,
    focusY: 50,
    caption: "الفخامة في كل تفصيلة",
  },
  { src: "flamme-noble/shot-5.jpg", entry: "zoom", beats: 1, focusY: 40 },
  { src: "flamme-noble/shot-1.jpg", entry: "whip", beats: 1, focusY: 70 },
  {
    src: "flamme-noble/shot-2.jpg",
    entry: "flash",
    beats: 2,
    focusY: 30,
    caption: "جودة عالية",
  },
  { src: "flamme-noble/shot-6.jpg", entry: "glitch", beats: 1, focusY: 50 },
  { src: "flamme-noble/shot-3.jpg", entry: "zoom", beats: 1, focusY: 60 },
  {
    src: "flamme-noble/shot-4.jpg",
    entry: "whip",
    beats: 2,
    focusY: 35,
    caption: "سوم مدروس",
  },
  { src: "flamme-noble/shot-5.jpg", entry: "glitch", beats: 1, focusY: 60 },
  { src: "flamme-noble/shot-6.jpg", entry: "flash", beats: 1, focusY: 50 },
  {
    src: "flamme-noble/shot-1.jpg",
    entry: "zoom",
    beats: 2,
    focusY: 50,
    caption: "توصيل لكل الولايات",
  },
  { src: "flamme-noble/shot-3.jpg", entry: "whip", beats: 1, focusY: 50 },
  { src: "flamme-noble/shot-2.jpg", entry: "glitch", beats: 1, focusY: 50 },
];

// End card — PLACEHOLDERS until the real prices are confirmed
export const OFFER = {
  brand: "FLAMME NOBLE",
  hero: "flamme-noble/shot-1.jpg",
  headline: "اطلب توا",
  price: "?? د.ت",
  note: "الخلاص عند الاستلام",
  phone: "50 500 051",
};

export const INTRO_FRAMES = BEAT * 2;
export const SHOTS_FRAMES = SHOTS.reduce((s, x) => s + x.beats * BEAT, 0);
export const END_FRAMES = BEAT * 8;
export const TOTAL_FRAMES = INTRO_FRAMES + SHOTS_FRAMES + END_FRAMES;

// Pink/magenta glitch + Ferrari-ish red, gold for the brand
export const FN_COLORS = {
  black: "#07070A",
  red: "#E1061B",
  pink: "#FF2D8A",
  gold: "#E8C26A",
  white: "#FFFFFF",
};
