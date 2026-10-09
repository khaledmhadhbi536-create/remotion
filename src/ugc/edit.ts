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
  // Mapping measured by DTW alignment (MFCC) of each clip's own audio — which is in sync with
  // the lips — against the voice-over, then simplified to one segment per spoken group.
  // Hook — « اليوم عنّا »
  { src: "hook", srcStart: 0.2, srcEnd: 1.25, start: 0, end: 0.85, zoom: 1 },
  // « باك في خمسة حاجات » (jump cut over the clip's pause at src 1.25–1.85)
  {
    src: "hook",
    srcStart: 1.85,
    srcEnd: 3.62,
    start: 0.85,
    end: 2.5,
    zoom: 1.06,
  },
  // « الكل تسعة وأربعين… »
  { src: "hook", srcStart: 3.85, srcEnd: 5.3, start: 2.5, end: 3.85, zoom: 1 },
  // « …دينار » (skips the clip's repeated « واربعين » at src 5.3–5.7)
  {
    src: "hook",
    srcStart: 5.7,
    srcEnd: 6.4,
    start: 3.85,
    end: 4.55,
    zoom: 1.06,
  },
  // CTA — « باش تعدّي »
  {
    src: "cta",
    srcStart: 0,
    srcEnd: 0.58,
    start: 33.95,
    end: 34.75,
    zoom: 1.1,
  },
  // pause in the voice-over: the clip barely moves
  {
    src: "cta",
    srcStart: 0.58,
    srcEnd: 0.7,
    start: 34.75,
    end: 35.3,
    zoom: 1.1,
  },
  // « الكوموند »
  {
    src: "cta",
    srcStart: 0.7,
    srcEnd: 1.25,
    start: 35.3,
    end: 35.8,
    zoom: 1.1,
  },
  // pause
  {
    src: "cta",
    srcStart: 1.25,
    srcEnd: 1.8,
    start: 35.8,
    end: 36.15,
    zoom: 1.1,
  },
  // « انزل اللوطة »
  {
    src: "cta",
    srcStart: 1.8,
    srcEnd: 3.4,
    start: 36.15,
    end: 37.05,
    zoom: 1.1,
  },
  // the pointing-down gesture, kept whole (src 4–7 = finger pointing at the button)
  {
    src: "cta",
    srcStart: 3.4,
    srcEnd: 6.85,
    start: 37.05,
    end: 40.5,
    zoom: 1.1,
  },
];

export const TOTAL_SECONDS = 40.5;
export const TOTAL_FRAMES = f(TOTAL_SECONDS);
export const HOOK_END = 4.55;
export const CTA_START = 33.95;

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
    end: 35.8,
    text: "باش تعدّي الكوموند",
    emphasis: ["الكوموند"],
  },
  { start: 36.15, end: 37.0, text: "انزل اللوطة", emphasis: ["اللوطة"] },
];
