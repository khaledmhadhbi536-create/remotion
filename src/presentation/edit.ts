// Edit decision list for the product presentation video (public/footage/presentation.mp4).
// All times below are in SECONDS OF THE SOURCE FOOTAGE — the helpers convert them to the
// output timeline after the jump cuts, so you can fix a subtitle without recomputing anything.

export const FPS = 30;

// Ranges of the source to KEEP (pauses > 0.3s and dead air removed → tighter pacing)
export const KEEP: readonly [number, number][] = [
  [0.0, 1.98],
  [2.38, 8.6],
  [8.8, 10.9],
  [11.15, 12.4],
  [13.3, 15.45],
  [16.3, 18.1],
  [18.4, 22.0],
  [22.42, 24.55],
  [25.35, 27.13],
  [27.55, 30.85],
  [31.4, 34.8],
  [35.85, 39.9],
];

const outStarts: number[] = [];
{
  let acc = 0;
  for (const [a, b] of KEEP) {
    outStarts.push(acc);
    acc += b - a;
  }
}

export const SPEECH_DURATION = KEEP.reduce((s, [a, b]) => s + (b - a), 0);
export const END_CARD_SECONDS = 3.5;
export const TOTAL_FRAMES = Math.round(
  (SPEECH_DURATION + END_CARD_SECONDS) * FPS,
);
export const SPEECH_FRAMES = Math.round(SPEECH_DURATION * FPS);

// Source time → output time (seconds). Times inside a removed pause snap to the next kept range.
export const srcToOut = (t: number): number => {
  for (let i = 0; i < KEEP.length; i++) {
    const [a, b] = KEEP[i];
    if (t < a) return outStarts[i];
    if (t <= b) return outStarts[i] + (t - a);
  }
  return SPEECH_DURATION;
};

export const srcToFrame = (t: number) => Math.round(srcToOut(t) * FPS);

export const clips = KEEP.map(([a, b], i) => ({
  trimBefore: Math.round(a * FPS),
  from: Math.round(outStarts[i] * FPS),
  durationInFrames: Math.round(b * FPS) - Math.round(a * FPS),
}));

// ---------------------------------------------------------------------------
// Subtitles (Tunisian derja, transcribed with Whisper large-v3 / turbo and cleaned by hand).
// `emphasis` words are highlighted. `check: true` = audio was unclear, please verify.
export type Phrase = {
  start: number;
  end: number;
  text: string;
  emphasis?: string[];
  check?: boolean;
};

export const PHRASES: Phrase[] = [
  {
    start: 0.0,
    end: 1.95,
    text: "اليوم جبتلكم زوز برودويات",
    emphasis: ["زوز"],
  },
  {
    start: 2.43,
    end: 8.56,
    text: "هذا دهان الكبريت المغربي للظوافر و الشقوق",
    emphasis: ["الكبريت", "للظوافر"],
    check: true,
  },
  {
    start: 8.85,
    end: 10.87,
    text: "اللي عندو فطريات في الظوافر",
    emphasis: ["فطريات"],
    check: true,
  },
  { start: 11.2, end: 12.35, text: "و يلزمو حاجة قوية", emphasis: ["قوية"] },
  {
    start: 13.35,
    end: 15.41,
    text: "دور السند و الهند ما تلقاش كيفو",
    emphasis: ["تلقاش", "كيفو"],
  },
  {
    start: 16.35,
    end: 18.07,
    text: "دهان الكبريت و القطران الفرنسي",
    emphasis: ["القطران"],
  },
  {
    start: 18.43,
    end: 21.96,
    text: "راهو ضربة ضربة قوية برشا",
    emphasis: ["قوية", "برشا"],
  },
  {
    start: 22.45,
    end: 24.51,
    text: "للظوافر و للإكزيما",
    emphasis: ["للإكزيما"],
    check: true,
  },
  {
    start: 25.4,
    end: 27.11,
    text: "و هاذا فازلين بزيت حبّة البركة",
    emphasis: ["حبّة", "البركة"],
  },
  { start: 27.58, end: 30.82, text: "الكل يستعملو فيه", check: true },
  {
    start: 31.45,
    end: 34.77,
    text: "عوض برودويات بـ 120 دينار",
    emphasis: ["120"],
    check: true,
  },
  { start: 35.88, end: 37.29, text: "الزوز برودويات", emphasis: ["الزوز"] },
  {
    start: 37.61,
    end: 39.82,
    text: "في البرومو",
    emphasis: ["البرومو"],
    check: true,
  },
];

// Optional promo price shown on the promo banner + end card. Unclear in the audio → set it, e.g. 35.
export const PROMO_PRICE: number | null = null;

// ---------------------------------------------------------------------------
// Graphic moments (source seconds)
export const MOMENTS = {
  hookEnd: 2.3,
  product1: 2.6, // "هذا دهان الكبريت المغربي"
  product1End: 8.6,
  benefits: 22.42, // "للظوافر و للإكزيما"
  benefitsEnd: 25.3,
  product2: 25.4, // "فازلين بزيت حبّة البركة"
  product2End: 30.85,
  promo: 35.88, // "الزوز برودويات"
};
