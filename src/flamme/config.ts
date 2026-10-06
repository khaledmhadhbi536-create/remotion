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
// To use the real footage: put the 5 Flamme Noble clips in public/flamme-noble/clips/
// and point CLIPS at them. Each shot below says which clip, where in it (seconds) and how
// it enters. The current CLIPS are STAND-INS so the edit can be checked.

export const FPS = 30;
// one beat = 15 frames
export const BEAT = 15;

export const CLIPS = {
  c1: "footage/presentation.mp4",
  c2: "footage/presentation.mp4",
  c3: "footage/presentation.mp4",
  c4: "footage/presentation.mp4",
  c5: "footage/presentation.mp4",
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
  readonly focusY?: number; // vertical crop 0 → 100
  readonly caption?: string;
};

export const SHOTS: Shot[] = [
  // 0–8s · hook + drop
  {
    clip: "c1",
    at: 9.5,
    beats: 2,
    entry: "slices",
    ramp: "in",
    caption: "فلام نوبل",
  },
  { clip: "c2", at: 3.0, beats: 1, entry: "cut" },
  { clip: "c3", at: 16.0, beats: 1, entry: "whip" },
  { clip: "c4", at: 24.0, beats: 1, entry: "punchOut" },
  { clip: "c5", at: 33.0, beats: 1, entry: "cut", caption: "الفخامة" },
  { clip: "c1", at: 12.0, beats: 0.5, entry: "cut" },
  { clip: "c3", at: 19.0, beats: 0.5, entry: "cut" },
  { clip: "c2", at: 6.0, beats: 1, entry: "flash" },
  { clip: "c4", at: 27.5, beats: 1, entry: "whip", ramp: "out" },
  { clip: "c5", at: 36.0, beats: 1, entry: "glitch" },
  { clip: "c1", at: 1.0, beats: 1, entry: "cut", caption: "في كل تفصيلة" },
  { clip: "c3", at: 21.0, beats: 1, entry: "punchOut" },
  { clip: "c2", at: 8.0, beats: 1, entry: "cut" },
  { clip: "c5", at: 35.0, beats: 1, entry: "whip" },
  { clip: "c1", at: 13.0, beats: 1, entry: "cut" },
  { clip: "c4", at: 26.0, beats: 1, entry: "punchOut", ramp: "out" },
  // 8–10s · break: held, slow motion
  {
    clip: "c4",
    at: 30.0,
    beats: 4,
    entry: "flash",
    ramp: "slow",
    caption: "جودة عالية",
  },
  // 10–12s · build
  { clip: "c5", at: 38.0, beats: 1, entry: "cut" },
  { clip: "c1", at: 14.0, beats: 1, entry: "whip" },
  { clip: "c3", at: 17.5, beats: 1, entry: "punchOut" },
  { clip: "c2", at: 4.5, beats: 1, entry: "glitch" },
  // 12–16s · climax
  { clip: "c4", at: 25.0, beats: 0.5, entry: "slices" },
  { clip: "c5", at: 34.5, beats: 0.5, entry: "cut" },
  { clip: "c1", at: 10.5, beats: 0.5, entry: "cut" },
  { clip: "c3", at: 22.5, beats: 0.5, entry: "cut" },
  {
    clip: "c2",
    at: 7.0,
    beats: 1,
    entry: "flash",
    freeze: true,
    caption: "سوم مدروس",
  },
  { clip: "c4", at: 28.5, beats: 0.5, entry: "glitch" },
  { clip: "c5", at: 37.0, beats: 0.5, entry: "cut" },
  { clip: "c1", at: 2.5, beats: 0.5, entry: "cut" },
  { clip: "c3", at: 18.5, beats: 0.5, entry: "whip" },
  { clip: "c1", at: 11.5, beats: 1, entry: "glitch" },
  { clip: "c4", at: 29.0, beats: 0.5, entry: "cut" },
  { clip: "c5", at: 39.0, beats: 0.5, entry: "slices" },
  { clip: "c2", at: 5.5, beats: 1, entry: "punchOut", ramp: "out" },
];

// 16–20s · hero shot under the offer
export const HERO: Shot = {
  clip: "c1",
  at: 9.0,
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
