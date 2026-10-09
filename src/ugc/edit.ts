// Edit decision list for the UGC ad (public/ugc). The voice-over (voice.m4a, 37.9s; loudness-normalised
// copy voice-master.m4a) is the
// master clock: every time below is in SECONDS OF THE OUTPUT TIMELINE unless it says "src".
// Word timings come from Whisper large-v3 on the voice-over, checked against its loudness envelope.

export const FPS = 30;
export const f = (s: number) => Math.round(s * FPS);

// ---------------------------------------------------------------------------
// UGC talking-head clips, re-timed so the lips follow the voice-over.
// The person says the same lines as the voice-over in both clips, only at another pace,
// so each spoken group is mapped onto the matching group of the voice-over.
export type UgcCut = {
  readonly src: "hook" | "cta";
  readonly srcStart: number; // src seconds
  readonly srcEnd: number;
  readonly start: number; // output seconds
  readonly end: number;
  readonly zoom: number; // punch-in that hides the jump cut
};

export const UGC_CUTS: UgcCut[] = [
  // Hook — « اليوم عنّا باك في خمسة حاجات »  (src 0.6–3.3 → VO 0.4–2.2)
  { src: "hook", srcStart: 0.2, srcEnd: 3.4, start: 0, end: 2.4, zoom: 1 },
  // « الكل… »  (src onset 4.0 → VO 2.7)
  {
    src: "hook",
    srcStart: 3.65,
    srcEnd: 4.35,
    start: 2.4,
    end: 3.0,
    zoom: 1.1,
  },
  // « …تسعة وأربعين دينار » — the clip's second, cleaner take (src 7.6–8.6 → VO 3.0–4.2).
  // Stops at src 8.95: from 9.0 the camera app's interface is burnt into the clip.
  {
    src: "hook",
    srcStart: 7.55,
    srcEnd: 8.95,
    start: 3.0,
    end: 4.55,
    zoom: 1.02,
  },
  // CTA — « باش تعدّي الكوموند »  (src 0–1.75 → VO 34.0–35.3)
  { src: "cta", srcStart: 0, srcEnd: 1.75, start: 33.95, end: 35.3, zoom: 1.1 },
  // « انزل »
  {
    src: "cta",
    srcStart: 1.75,
    srcEnd: 2.85,
    start: 35.3,
    end: 36.2,
    zoom: 1.1,
  },
  // « اللوطة » + the pointing-down gesture, kept whole (src 4–7 = finger pointing at the button)
  {
    src: "cta",
    srcStart: 2.85,
    srcEnd: 7.15,
    start: 36.2,
    end: 40.5,
    zoom: 1.1,
  },
];

export const TOTAL_SECONDS = 40.5;
export const TOTAL_FRAMES = f(TOTAL_SECONDS);
export const HOOK_END = 4.55;
export const CTA_START = 33.95;

// ---------------------------------------------------------------------------
// B-roll shots of the real pack photo (public/ugc/pack-photo.jpg, 1126×2000).
// cx / cy = point of the photo kept at the centre of the frame, zoom = × "cover" scale.
// Each shot moves from `from` to `to` like a handheld push-in / pan.
export type Framing = {
  readonly cx: number;
  readonly cy: number;
  readonly zoom: number;
};

export const SPOTS = {
  whole: { cx: 563, cy: 900, zoom: 1 },
  sidrLabel: { cx: 815, cy: 1370, zoom: 2.6 },
  sidrBag: { cx: 780, cy: 1250, zoom: 1.25 },
  applicator: { cx: 350, cy: 1150, zoom: 1.45 },
  combTip: { cx: 430, cy: 860, zoom: 2.5 },
  dermaBox: { cx: 140, cy: 1010, zoom: 1.35 },
  oil: { cx: 855, cy: 560, zoom: 1.9 },
  oilLabel: { cx: 850, cy: 650, zoom: 2.6 },
  brush: { cx: 590, cy: 590, zoom: 1.8 },
  brushTop: { cx: 560, cy: 520, zoom: 2.4 },
} satisfies Record<string, Framing>;

// ---------------------------------------------------------------------------
// Subtitles — Tunisian derja, exactly as spoken (numbers written as digits).
export const CAPTIONS = [
  { start: 0.4, end: 1.25, text: "اليوم عنّا باك", emphasis: ["باك"] },
  { start: 1.25, end: 2.4, text: "في خمسة حاجات", emphasis: ["خمسة"] },
  { start: 2.7, end: 4.3, text: "الكل 49 دينار", emphasis: ["49"] },
  { start: 5.18, end: 6.45, text: "عنّا السدر", emphasis: ["السدر"] },
  { start: 6.48, end: 7.58, text: "باش نزيدوه ميّة", emphasis: ["ميّة"] },
  {
    start: 7.6,
    end: 9.1,
    text: "ونحطّوه في الأبليكاتور",
    emphasis: ["الأبليكاتور"],
  },
  { start: 9.18, end: 10.9, text: "نغسلو بيه شعرنا", emphasis: ["شعرنا"] },
  {
    start: 10.96,
    end: 12.22,
    text: "باش نستعملو الأبليكاتور",
    emphasis: ["الأبليكاتور"],
  },
  {
    start: 12.26,
    end: 14.4,
    text: "باش السدر يوصل للجذور",
    emphasis: ["للجذور"],
  },
  { start: 14.44, end: 15.95, text: "وينظّف فروة الراس", emphasis: ["وينظّف"] },
  {
    start: 16.38,
    end: 17.98,
    text: "عنّا ديرما رولر",
    emphasis: ["ديرما", "رولر"],
  },
  {
    start: 18.0,
    end: 20.15,
    text: "باش نستعملوها مرتين في الجمعة",
    emphasis: ["مرتين"],
  },
  { start: 20.2, end: 20.95, text: "ما أكثرش", emphasis: ["أكثرش"] },
  {
    start: 20.98,
    end: 22.52,
    text: "بعد الديرما بالضبط",
    emphasis: ["بالضبط"],
  },
  { start: 22.56, end: 23.7, text: "باش نستعملو زيت", emphasis: ["زيت"] },
  {
    start: 23.72,
    end: 25.3,
    text: "إكليل الجبل الطبيعي",
    emphasis: ["إكليل", "الجبل"],
  },
  { start: 26.0, end: 27.5, text: "بالنسبة للبروس", emphasis: ["للبروس"] },
  // Spoken: « باش نحطّوها [?] في الليل » — one word is unclear in the recording and is left
  // out of the subtitle rather than guessed. Add it here once confirmed.
  {
    start: 27.56,
    end: 29.7,
    text: "باش نحطّوها في الليل",
    emphasis: ["الليل"],
  },
  {
    start: 29.76,
    end: 31.45,
    text: "باش تعمل مساج على فروة الراس",
    emphasis: ["مساج"],
  },
  {
    start: 31.56,
    end: 33.1,
    text: "باش تنشّط الدورة الدموية",
    emphasis: ["الدموية"],
  },
  {
    start: 34.0,
    end: 35.25,
    text: "باش تعدّي الكوموند",
    emphasis: ["الكوموند"],
  },
  { start: 35.3, end: 36.9, text: "انزل اللوطة", emphasis: ["اللوطة"] },
];
