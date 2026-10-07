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
  // added for the 30s reel (photos, each with a different camera move)
  c6: "flamme-noble/clips/c6-buste-ivoire.mp4", // ivory blindfolded bust (push-in)
  c7: "flamme-noble/clips/c7-chevaux.mp4", // pair of horse candles (pan)
  c8: "flamme-noble/clips/c8-couple.mp4", // dark embracing couple (pull-out)
  c9: "flamme-noble/clips/c9-roses.mp4", // ivory rose candles (tilt)
  c10: "flamme-noble/clips/c10-licorne.mp4", // ivory unicorn (push-in)
} as const;
export type ClipId = keyof typeof CLIPS;

export type Entry =
  | "cut" // hard cut + punch-in
  | "punchOut" // hard cut, starts tight and pulls out
  | "slices" // horizontal slices slide into place (the reference's signature)
  | "glitch" // short slice displacement + RGB split
  | "whip" // fast horizontal camera move with motion blur
  | "flash" // white flash
  | "blocks" // rectangles of the new shot pop in over the previous one (mosaic)
  | "silhouette"; // previous shot's subject goes black for a few frames, then cut

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

const SHOTS_20: Shot[] = [
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
const HERO_20: Shot = {
  clip: "c1",
  at: 0,
  beats: 8,
  entry: "flash",
  ramp: "slow",
};

// Leave `price` empty to show the call to action in its place
export type Offer = {
  readonly headline: string;
  readonly price: string;
  readonly note: string;
  readonly phoneLabel: string;
  readonly phone: string;
};
const OFFER_AR: Offer = {
  headline: "اطلب توا",
  price: "",
  note: "الخلاص عند الاستلام",
  phoneLabel: "للطلب",
  phone: "23 424 978", // +216 23 424 978
};

export const BRAND = "FLAMME NOBLE";

export type Look = "natural" | "golden";
export type Lang = "ar" | "fr";

// One edit = a shot list + its final hero shot, soundtrack, colour look, caption
// language and (optional) offer card. The engine in TransitionEdit.tsx renders any spec.
export type EditSpec = {
  readonly shots: Shot[];
  readonly hero: Shot;
  readonly music: string; // file in public/
  readonly look: Look;
  readonly lang: Lang;
  readonly offer: Offer | null; // null → the hero shot only shows the brand name
};

export const REEL_20: EditSpec = {
  shots: SHOTS_20,
  hero: HERO_20,
  music: "audio/phonk-20s.mp3",
  look: "natural",
  lang: "ar",
  offer: OFFER_AR,
};

// Instagram reel, 30s, modelled on the client's "salesman funk" CapCut reference:
// warm golden grade, calmer 2-beat shots with slow camera moves, mosaic-block and
// silhouette transitions, a calm wide ending. French captions only, no offer.
// The client adds the "salesman funk" sound in Instagram; the cuts sit on a 120 BPM grid.
//   0–2s hook · 2–10s rise · 10–14s breath · 14–22s showcase · 22–26s peak · 26–30s ending
const SHOTS_30: Shot[] = [
  // 0–2s · hook
  { clip: "c1", at: 0, beats: 4, entry: "blocks", caption: "Bougies d'art" },
  // 2–10s · rise: one shot every 2 beats, close-ups and wides alternate
  { clip: "c6", at: 0, beats: 2, entry: "blocks" },
  {
    clip: "c2",
    at: 0.3,
    beats: 2,
    entry: "silhouette",
    zoom: 1.3,
    focusX: 30,
    focusY: 60,
  },
  { clip: "c8", at: 0, beats: 2, entry: "blocks" },
  { clip: "c3", at: 0, beats: 2, entry: "cut" },
  { clip: "c10", at: 0, beats: 2, entry: "silhouette" },
  {
    clip: "c5",
    at: 0,
    beats: 2,
    entry: "blocks",
    zoom: 1.4,
    focusX: 45,
    focusY: 70,
  },
  { clip: "c7", at: 0, beats: 2, entry: "cut" },
  { clip: "c9", at: 0, beats: 2, entry: "blocks" },
  // 10–14s · breath: two long, slow shots
  {
    clip: "c2",
    at: 3,
    beats: 4,
    entry: "blocks",
    ramp: "slow",
    caption: "Faites main",
  },
  {
    clip: "c6",
    at: 1,
    beats: 4,
    entry: "silhouette",
    ramp: "slow",
    zoom: 1.3,
    focusY: 35,
  },
  // 14–22s · showcase
  {
    clip: "c4",
    at: 0.2,
    beats: 4,
    entry: "blocks",
    caption: "Cadeaux de mariage",
  },
  {
    clip: "c10",
    at: 2,
    beats: 2,
    entry: "cut",
    zoom: 1.6,
    focusX: 55,
    focusY: 30,
  },
  { clip: "c8", at: 2, beats: 2, entry: "blocks", zoom: 1.4 },
  { clip: "c7", at: 2, beats: 2, entry: "silhouette" },
  { clip: "c9", at: 2, beats: 2, entry: "cut", zoom: 1.5 },
  {
    clip: "c2",
    at: 4.2,
    beats: 2,
    entry: "blocks",
    zoom: 1.5,
    focusX: 60,
    focusY: 70,
  },
  {
    clip: "c3",
    at: 2,
    beats: 2,
    entry: "silhouette",
    zoom: 1.6,
    focusX: 30,
    focusY: 45,
  },
  // 22–26s · peak: tighter cuts
  { clip: "c1", at: 2, beats: 1, entry: "blocks", zoom: 1.8, focusY: 35 },
  { clip: "c6", at: 3, beats: 1, entry: "cut", zoom: 1.7, focusY: 30 },
  { clip: "c5", at: 2, beats: 1, entry: "silhouette" },
  { clip: "c10", at: 4, beats: 1, entry: "cut" },
  { clip: "c8", at: 4, beats: 1, entry: "blocks" },
  {
    clip: "c4",
    at: 2,
    beats: 2,
    entry: "cut",
    caption: "Un cadeau qui impressionne",
  },
  { clip: "c9", at: 4, beats: 1, entry: "silhouette" },
];

export const REEL_30: EditSpec = {
  shots: SHOTS_30,
  // 26–30s · calm wide ending on the full collection, brand name only
  hero: { clip: "c5", at: 0, beats: 8, entry: "blocks", ramp: "slow" },
  music: "audio/phonk-30s.mp3",
  look: "golden",
  lang: "fr",
  offer: null,
};

export const SPECS = { reel20: REEL_20, reel30: REEL_30 } as const;
export type SpecId = keyof typeof SPECS;

export const shotsFrames = (spec: EditSpec) =>
  Math.round(spec.shots.reduce((acc, s) => acc + s.beats, 0) * BEAT);
export const specFrames = (spec: EditSpec) =>
  shotsFrames(spec) + spec.hero.beats * BEAT;

export const FN_COLORS = {
  black: "#07070A",
  red: "#E1061B",
  pink: "#FF2D8A",
  cyan: "#2BD9FF",
  gold: "#E8C26A",
  white: "#FFFFFF",
};
