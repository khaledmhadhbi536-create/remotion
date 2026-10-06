// Flamme Noble — "transition edit" ad, modelled on the CapCut template the client sent
// (snaptik_7688811699024989458, ~126 BPM, 21s):
//   1. build-up: black screen, magenta duotone strips stack up one per beat, light bars,
//      then a white vertical wipe reveals the full-colour shot on the drop;
//   2. drop: one cut per beat — picture-in-picture windows, spin blurs, whips, colour flashes;
//   3. break: two longer shots (captions live here);
//   4. second drop: white bar → pink glitch slices with an X sweep, then fast cuts
//      (windows, diamond reveal, spins);
//   5. diagonal wipe to black → end card.
//
// Everything that changes per product lives here. The shots in public/flamme-noble/ are
// STAND-INS (AURA BIO photos) until the Flamme Noble product photos are available:
// drop the new files in public/flamme-noble/ and update SHOTS / OFFER.

export const FPS = 30;
// 120 BPM soundtrack → one beat = 15 frames. Every cut lands on a beat.
export const BEAT = 15;

export type Entry =
  | "cut" // hard cut + punch zoom
  | "whip" // horizontal slide with motion blur and ghost copies
  | "window" // next shot opens from a rectangle (picture-in-picture)
  | "spin" // rotational blur, zooming in
  | "diamond" // diamond-shaped mask grows
  | "tint" // cold blue colour flash
  | "glitch" // white bar, pink slices and an X sweep
  | "flash"; // white flash

export type Shot = {
  readonly src: string; // file in public/
  readonly entry: Entry; // how the shot comes in
  readonly beats: number; // length in beats
  readonly focusY?: number; // vertical crop, 0 (top) → 100 (bottom)
  readonly caption?: string; // Arabic punchline, optional
};

const s = (
  n: number,
  entry: Entry,
  beats = 1,
  focusY = 50,
  caption?: string,
): Shot => ({
  src: `flamme-noble/shot-${n}.jpg`,
  entry,
  beats,
  focusY,
  caption,
});

// Shot used by the build-up intro (strips + reveal on the drop)
export const INTRO_SHOT = "flamme-noble/shot-1.jpg";
export const INTRO_BEATS = 4;

export const SHOTS: Shot[] = [
  // drop
  s(2, "window", 1, 45),
  s(3, "spin", 1, 50),
  s(4, "whip", 1, 50),
  s(5, "window", 1, 40),
  s(6, "tint", 1, 50),
  s(1, "spin", 1, 65),
  // break
  s(2, "flash", 2, 30, "الفخامة في كل تفصيلة"),
  s(4, "whip", 2, 40, "جودة عالية"),
  // second drop
  s(3, "glitch", 2, 45, "فلام نوبل"),
  s(5, "window", 1, 55),
  s(6, "diamond", 1, 50),
  s(1, "spin", 1, 40),
  s(2, "window", 1, 60),
  s(4, "tint", 1, 45),
  s(3, "diamond", 1, 60),
  s(5, "whip", 1, 45),
  s(1, "cut", 2, 50, "توصيل لكل الولايات"),
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

export const INTRO_FRAMES = BEAT * INTRO_BEATS;
export const SHOTS_FRAMES = SHOTS.reduce((acc, x) => acc + x.beats * BEAT, 0);
export const END_FRAMES = BEAT * 8;
export const TOTAL_FRAMES = INTRO_FRAMES + SHOTS_FRAMES + END_FRAMES;

export const FN_COLORS = {
  black: "#07070A",
  red: "#E1061B",
  pink: "#FF2D8A",
  magentaDeep: "#5A0630",
  ice: "#3FA9FF",
  gold: "#E8C26A",
  white: "#FFFFFF",
};
