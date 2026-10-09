// Edit decision list for the UGC ad (public/ugc). The voice-over is the seller's own recording
// (voice-v2.m4a), pauses tightened and processed into voice-v2-master.m4a (41.2s). It is the
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
  // Hook — « اليوم معانا باك »
  { src: "hook", srcStart: 0.35, srcEnd: 1.8, start: 0, end: 1.05, zoom: 1 },
  // « فيه خمسة حاجات » (jump cut over the clip's pause)
  {
    src: "hook",
    srcStart: 2.25,
    srcEnd: 3.55,
    start: 1.05,
    end: 2.25,
    zoom: 1.15,
  },
  // « الكل 49… »
  { src: "hook", srcStart: 4.0, srcEnd: 5.42, start: 2.25, end: 3.45, zoom: 1 },
  // « …دينار » (skips the clip's repeated « واربعين »)
  {
    src: "hook",
    srcStart: 5.7,
    srcEnd: 6.4,
    start: 3.45,
    end: 4.05,
    zoom: 1.15,
  },
  // CTA — the face only comes back on « انزل اللوطة »; « باش تعدّي الكوموند » plays over
  // the pack shot (voice only)
  {
    src: "cta",
    srcStart: 1.89,
    srcEnd: 2.29,
    start: 40.1,
    end: 40.5,
    zoom: 1.22,
  },
  {
    src: "cta",
    srcStart: 2.44,
    srcEnd: 3.44,
    start: 40.5,
    end: 41.1,
    zoom: 1.22,
  },
  // the pointing-down gesture, kept whole (src 4–7 = finger pointing at the button)
  {
    src: "cta",
    srcStart: 3.44,
    srcEnd: 6.84,
    start: 41.1,
    end: 44.5,
    zoom: 1.1,
  },
];

export const TOTAL_SECONDS = 44.5;
export const TOTAL_FRAMES = f(TOTAL_SECONDS);
export const HOOK_END = 4.05;
export const CTA_START = 40.1;

// ---------------------------------------------------------------------------
// Subtitles — Tunisian derja, exactly as spoken (numbers written as digits).
export const CAPTIONS = [
  { start: 0.0, end: 1.05, text: "اليوم معانا باك", emphasis: ["باك"] },
  { start: 1.05, end: 2.0, text: "فيه خمسة حاجات", emphasis: ["خمسة"] },
  { start: 2.02, end: 3.9, text: "الكل 49 دينار", emphasis: ["49"] },
  { start: 4.1, end: 5.6, text: "كان شعرك بدا يطيح ويفرغ", emphasis: ["يطيح"] },
  { start: 5.72, end: 6.95, text: "وجرّبت برشا حاجات", emphasis: ["برشا"] },
  { start: 6.98, end: 7.95, text: "وما لقيتش نتيجة", emphasis: ["نتيجة"] },
  {
    start: 8.06,
    end: 10.2,
    text: "تبّعني نفسرلك الروتين كامل",
    emphasis: ["الروتين"],
  },
  { start: 10.28, end: 11.6, text: "أوّلا السدر", emphasis: ["السدر"] },
  { start: 11.62, end: 14.4, text: "نزيدوه شويّة ميّة", emphasis: ["ميّة"] },
  {
    start: 14.42,
    end: 15.65,
    text: "نحطّوه في الأبليكاتور",
    emphasis: ["الأبليكاتور"],
  },
  { start: 15.68, end: 17.1, text: "ونغسلو بيه شعرنا", emphasis: ["شعرنا"] },
  {
    start: 17.14,
    end: 18.9,
    text: "الأبليكاتور يخلّي السدر يوصل",
    emphasis: ["السدر"],
  },
  { start: 18.96, end: 19.6, text: "للجذور", emphasis: ["للجذور"] },
  { start: 19.66, end: 21.1, text: "ينظّف فروة الراس", emphasis: ["ينظّف"] },
  {
    start: 21.14,
    end: 22.85,
    text: "ثانيا الديرما رولر",
    emphasis: ["الديرما"],
  },
  { start: 22.88, end: 23.85, text: "مرتين في الجمعة", emphasis: ["مرتين"] },
  { start: 23.9, end: 24.7, text: "ما أكثرش", emphasis: ["أكثرش"] },
  {
    start: 24.76,
    end: 26.1,
    text: "وبعد الديرما بالضبط",
    emphasis: ["بالضبط"],
  },
  { start: 26.16, end: 27.2, text: "نحطّو قطرات من", emphasis: ["قطرات"] },
  {
    start: 27.22,
    end: 29.0,
    text: "زيت إكليل الجبل الطبيعي",
    emphasis: ["إكليل", "الجبل"],
  },
  { start: 29.04, end: 30.25, text: "بالنسبة للبروس", emphasis: ["للبروس"] },
  {
    start: 30.28,
    end: 32.5,
    text: "تعمل بيها مساج على فروة الراس",
    emphasis: ["مساج"],
  },
  {
    start: 32.52,
    end: 34.25,
    text: "باش تنشّط الدورة الدموية",
    emphasis: ["الدموية"],
  },
  {
    start: 34.3,
    end: 35.95,
    text: "الخمسة برودويات متاعنا",
    emphasis: ["الخمسة"],
  },
  { start: 35.98, end: 37.45, text: "بـ 49 دينار كهو", emphasis: ["49"] },
  {
    start: 37.52,
    end: 38.8,
    text: "والخلاص عند الاستلام",
    emphasis: ["الاستلام"],
  },
  {
    start: 38.82,
    end: 40.0,
    text: "باش تعدّي الكوموند",
    emphasis: ["الكوموند"],
  },
  { start: 40.15, end: 41.1, text: "انزل اللوطة", emphasis: ["اللوطة"] },
];
