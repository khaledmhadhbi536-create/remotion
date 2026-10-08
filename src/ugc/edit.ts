// Edit decision list for the AURA BIO UGC tutorial (public/footage/ugc.mp4).
// All times below are in SECONDS OF THE SOURCE FOOTAGE — the helpers convert them to the
// output timeline after the jump cuts, so you can fix a subtitle without recomputing anything.

export const FPS = 30;

// Ranges of the source to KEEP. Removed: dead air, the false start « نحطو… اه »,
// and the repeated phrases « بش نستعملو » (×2), « نستعملو الابليكاتور على الراس »,
// « هذي يوزع » and « هذي هذي ».
// Cut points are snapped to the quietest 10ms of audio near each phrase boundary.
export const KEEP: readonly [number, number][] = [
  [0.47, 5.09],
  [7.52, 15.25],
  [15.89, 20.2],
  [22.85, 31.32],
  [39.92, 50.7],
  [50.96, 55.91],
  [58.24, 60.67],
  [60.88, 65.87],
  [66.34, 67.98],
  [68.5, 70.0],
  [72.08, 72.91],
  [73.31, 76.6],
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
export const END_CARD_SECONDS = 4;
export const TOTAL_FRAMES = Math.round(
  (SPEECH_DURATION + END_CARD_SECONDS) * FPS,
);
export const SPEECH_FRAMES = Math.round(SPEECH_DURATION * FPS);

// Source time → output time (seconds). Times inside a removed part snap to the next kept range.
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
// Subtitles (Tunisian derja, transcribed with Whisper large-v3 and cleaned by hand).
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
    start: 0.5,
    end: 3.54,
    text: "جاونا برشا ميساجات على طريقة الاستعمال",
    emphasis: ["الاستعمال"],
  },
  { start: 3.54, end: 5.0, text: "شنعملو فيديو اليوم", emphasis: ["فيديو"] },
  { start: 7.55, end: 9.2, text: "ما نطوّلش عليكم" },
  {
    start: 9.28,
    end: 11.5,
    text: "ناخذو السدر الطبيعي هذا",
    emphasis: ["السدر", "الطبيعي"],
  },
  {
    start: 11.54,
    end: 15.2,
    text: "يولّي عوض الشامبو فيه برشا منافع",
    emphasis: ["الشامبو", "منافع"],
  },
  {
    start: 15.95,
    end: 20.2,
    text: "من أهم المنافع متاعو ينظّف فروة الراس",
    emphasis: ["ينظّف"],
  },
  {
    start: 22.9,
    end: 26.3,
    text: "باش نستعملو الأبليكاتور هذا",
    emphasis: ["الأبليكاتور"],
  },
  {
    start: 26.45,
    end: 28.2,
    text: "ناخذو مغرفة من السدر",
    emphasis: ["مغرفة"],
  },
  {
    start: 28.24,
    end: 31.2,
    text: "نزيدوها ماء و نخلطوها",
    emphasis: ["ماء"],
    check: true,
  },
  {
    start: 39.95,
    end: 42.35,
    text: "يوزّع السدر على الراس",
    emphasis: ["يوزّع"],
  },
  {
    start: 42.42,
    end: 44.9,
    text: "بالتوازي يوصل للراس",
    emphasis: ["بالتوازي"],
    check: true,
  },
  { start: 45.16, end: 47.08, text: "بعد ما نحطوهم على جنب" },
  {
    start: 47.12,
    end: 50.64,
    text: "نجيو للديرما نستعملوها مرتين في الجمعة ما أكثرش",
    emphasis: ["مرتين"],
  },
  {
    start: 50.96,
    end: 54.58,
    text: "بعد الديرما بالضبط تحط شوية قطرات",
    emphasis: ["قطرات"],
  },
  {
    start: 54.58,
    end: 55.8,
    text: "من زيت إكليل الجبل",
    emphasis: ["إكليل", "الجبل"],
  },
  {
    start: 58.3,
    end: 60.6,
    text: "بالنسبة لفرشاة المساج",
    emphasis: ["المساج"],
  },
  {
    start: 62.36,
    end: 65.75,
    text: "كل ليلة قبل ما ترقد اعمل شوية مساج للراس",
    emphasis: ["ليلة", "مساج"],
    check: true,
  },
  { start: 66.34, end: 67.9, text: "هذي مهمة برشا", emphasis: ["مهمة"] },
  {
    start: 68.5,
    end: 69.9,
    text: "تنشّط الدورة الدموية",
    emphasis: ["الدموية"],
  },
  {
    start: 72.1,
    end: 76.5,
    text: "الخمسة برودويات بـ 49 دينار كهو",
    emphasis: ["49", "دينار"],
  },
];

// ---------------------------------------------------------------------------
// Graphic moments (source seconds)
export const MOMENTS = {
  hookEnd: 5.0,
  sidr: 9.4,
  sidrEnd: 15.2,
  clean: 16.0,
  cleanEnd: 20.2,
  applicator: 22.9,
  applicatorEnd: 26.4,
  mix: 26.5,
  mixEnd: 31.3,
  derma: 47.15,
  dermaEnd: 50.7,
  oil: 51.0,
  oilEnd: 55.9,
  brush: 58.3,
  brushEnd: 65.8,
  blood: 68.5,
  bloodEnd: 70.0,
  promo: 72.1,
};
