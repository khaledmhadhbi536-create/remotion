// Flamme Noble — high-retention reel cut from the brand's own clips, using the editing
// language of the client's reference (snaptik_7688811699024989458): beat-synced hard cuts,
// horizontal slice glitches, flashes, punch zooms, whips with motion blur, speed ramps,
// freeze-frame emphasis. Nothing from the reference itself is used — only its rhythm.
//
// Structure (120 BPM, 2s bars, music: public/audio/phonk-20s.mp3, starts on the hit):
//   0–8s    hook + drop: strongest shot first, one cut per beat, a few half-beat cuts
//   8–10s   break: one shot held longer in slow motion (contrast)
//   10–12s  build: cuts tighten, glitch into the climax
//   12–16s  climax: run of half-beat cuts, a freeze-frame accent
//   16–20s  hero shot + offer
//
// Footage: the 5 clips in public/flamme-noble/clips/ (see CLIPS). Each shot says which
// clip, where in it (seconds), how it is framed (zoom/focus) and how it enters.

export const FPS = 30;
// one beat = 15 frames
export const BEAT = 15;

// The 5 Flamme Noble sources (from the client's Drive, transcoded to 1080x1920 / 30 fps).
// Photos were turned into 6s clips with a slow push-in so every shot moves.
export const CLIPS = {
  c1: "flamme-noble/clips/c1-buste.mp4", // veiled bust candle (photo) — hook + hero
  c2: "flamme-noble/clips/c2-plateaux.mp4", // trays, candle bowl, rose dish (video 6.8s)
  c3: "flamme-noble/clips/c3-famille.mp4", // family figure candles (photo)
  c4: "flamme-noble/clips/c4-dragees.mp4", // personalised favour box in hand (video 4s)
  c5: "flamme-noble/clips/c5-collection.mp4", // full collection on the table (photo)
} as const;
export type ClipId = keyof typeof CLIPS;

export type Entry =
  | "cut" // hard cut + punch-in
  | "punchOut" // hard cut, starts tight and pulls out
  | "slices" // horizontal slices slide into place (the reference's signature)
  | "glitch" // short slice displacement + RGB split
  | "whip" // fast horizontal camera move with motion blur
  | "flash"; // white flash

export type Ramp = "none" | "in" | "out" | "slow";

export type Shot = {
  readonly clip: ClipId;
  readonly at: number; // seconds into the clip
  readonly beats: number; // 0.5 | 1 | 2 | 4
  readonly entry: Entry;
  readonly ramp?: Ramp; // in: fast → normal · out: normal → fast · slow: slow motion
  readonly freeze?: boolean; // hold the last frames as a freeze-frame accent
  readonly zoom?: number; // reframe: 1 = full frame, 1.5–2 = close-up / detail
  readonly focusX?: number; // zoom centre, 0 → 100
  readonly focusY?: number; // zoom centre, 0 → 100
  readonly caption?: string;
};

export const SHOTS: Shot[] = [
  // 0–8s · hook + drop
  {
    clip: "c1",
    at: 0,
    beats: 2,
    entry: "slices",
    ramp: "in",
    caption: "شموع فنية",
  },
  {
    clip: "c2",
    at: 0.3,
    beats: 1,
    entry: "cut",
    zoom: 1.4,
    focusX: 25,
    focusY: 60,
  },
  { clip: "c3", at: 0, beats: 1, entry: "whip" },
  { clip: "c4", at: 0.5, beats: 1, entry: "punchOut" },
  { clip: "c5", at: 0, beats: 1, entry: "cut" },
  { clip: "c1", at: 2, beats: 0.5, entry: "cut", zoom: 1.9, focusY: 35 },
  {
    clip: "c2",
    at: 4.2,
    beats: 0.5,
    entry: "cut",
    zoom: 1.5,
    focusX: 60,
    focusY: 70,
  },
  {
    clip: "c5",
    at: 1,
    beats: 1,
    entry: "flash",
    zoom: 1.7,
    focusX: 45,
    focusY: 70,
  },
  {
    clip: "c3",
    at: 2,
    beats: 1,
    entry: "whip",
    ramp: "out",
    zoom: 1.4,
    focusX: 30,
    focusY: 45,
  },
  { clip: "c4", at: 2, beats: 1, entry: "glitch" },
  { clip: "c2", at: 1.6, beats: 1, entry: "cut" },
  { clip: "c1", at: 3, beats: 1, entry: "punchOut", zoom: 1.4, focusY: 80 },
  {
    clip: "c5",
    at: 2,
    beats: 1,
    entry: "cut",
    zoom: 1.9,
    focusX: 40,
    focusY: 30,
  },
  { clip: "c2", at: 3.2, beats: 1, entry: "whip" },
  {
    clip: "c3",
    at: 3,
    beats: 1,
    entry: "cut",
    zoom: 1.8,
    focusX: 85,
    focusY: 25,
  },
  { clip: "c4", at: 1.2, beats: 1, entry: "punchOut", ramp: "out" },
  // 8–10s · break: held, slow motion
  {
    clip: "c1",
    at: 1,
    beats: 4,
    entry: "flash",
    ramp: "slow",
    zoom: 1.1,
    caption: "مصنوعة باليد",
  },
  // 10–12s · build
  { clip: "c2", at: 5, beats: 1, entry: "cut" },
  { clip: "c5", at: 3, beats: 1, entry: "whip", zoom: 1.3, focusX: 60 },
  { clip: "c3", at: 4, beats: 1, entry: "punchOut", zoom: 1.2 },
  { clip: "c4", at: 3, beats: 1, entry: "glitch" },
  // 12–16s · climax
  { clip: "c1", at: 4, beats: 0.5, entry: "slices", zoom: 1.6, focusY: 30 },
  {
    clip: "c2",
    at: 0.8,
    beats: 0.5,
    entry: "cut",
    zoom: 1.4,
    focusX: 30,
    focusY: 40,
  },
  {
    clip: "c5",
    at: 4,
    beats: 0.5,
    entry: "cut",
    zoom: 1.6,
    focusX: 70,
    focusY: 55,
  },
  {
    clip: "c3",
    at: 1,
    beats: 0.5,
    entry: "cut",
    zoom: 1.7,
    focusX: 25,
    focusY: 60,
  },
  {
    clip: "c4",
    at: 0.2,
    beats: 1,
    entry: "flash",
    freeze: true,
    caption: "توزيعات أفراح",
  },
  {
    clip: "c2",
    at: 4.6,
    beats: 1,
    entry: "glitch",
    zoom: 1.3,
    focusX: 60,
    focusY: 70,
  },
  { clip: "c1", at: 4.5, beats: 0.5, entry: "cut", zoom: 2, focusY: 25 },
  { clip: "c5", at: 5, beats: 0.5, entry: "cut", zoom: 1.3 },
  {
    clip: "c3",
    at: 4.5,
    beats: 0.5,
    entry: "cut",
    zoom: 1.3,
    focusX: 70,
    focusY: 40,
  },
  { clip: "c2", at: 5.6, beats: 0.5, entry: "slices" },
  { clip: "c5", at: 2.5, beats: 1, entry: "cut", caption: "هدية تبهر" },
  { clip: "c4", at: 2.5, beats: 1, entry: "punchOut", ramp: "out" },
];

// 16–20s · hero shot under the offer
export const HERO: Shot = {
  clip: "c1",
  at: 0,
  beats: 8,
  entry: "flash",
  ramp: "slow",
};

// PLACEHOLDERS until the real prices are confirmed
export const OFFER = {
  brand: "FLAMME NOBLE",
  headline: "اطلب توا",
  price: "?? د.ت",
  note: "الخلاص عند الاستلام",
  phone: "50 500 051",
};

const cumBeats = SHOTS.reduce((acc, s) => acc + s.beats, 0);
export const SHOTS_FRAMES = Math.round(cumBeats * BEAT);
export const END_FRAMES = HERO.beats * BEAT;
export const TOTAL_FRAMES = SHOTS_FRAMES + END_FRAMES;

export const FN_COLORS = {
  black: "#07070A",
  red: "#E1061B",
  pink: "#FF2D8A",
  cyan: "#2BD9FF",
  gold: "#E8C26A",
  white: "#FFFFFF",
};
