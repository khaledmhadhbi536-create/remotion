// Edit decision list for the UGC ad (public/ugc). The voice-over is the seller's own recording
// (voice-v2.m4a), pauses tightened, a repeated take removed and processed into
// voice-v2-master.m4a (39.2s). It is the
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
    start: 38.07,
    end: 38.47,
    zoom: 1.22,
  },
  {
    src: "cta",
    srcStart: 2.44,
    srcEnd: 3.44,
    start: 38.47,
    end: 39.07,
    zoom: 1.22,
  },
  // the pointing-down gesture, kept whole (src 4–7 = finger pointing at the button)
  {
    src: "cta",
    srcStart: 3.44,
    srcEnd: 6.84,
    start: 39.07,
    end: 42.47,
    zoom: 1.1,
  },
];

export const TOTAL_SECONDS = 42.47;
export const TOTAL_FRAMES = f(TOTAL_SECONDS);
export const HOOK_END = 4.05;
export const CTA_START = 38.07;

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
  { start: 10.27, end: 11.28, text: "أوّلا السدر", emphasis: ["السدر"] },
  { start: 11.31, end: 12.37, text: "نزيدوه شويّة ميّة", emphasis: ["ميّة"] },
  {
    start: 12.39,
    end: 13.62,
    text: "نحطّوه في الأبليكاتور",
    emphasis: ["الأبليكاتور"],
  },
  { start: 13.65, end: 15.07, text: "ونغسلو بيه شعرنا", emphasis: ["شعرنا"] },
  {
    start: 15.11,
    end: 16.87,
    text: "الأبليكاتور يخلّي السدر يوصل",
    emphasis: ["السدر"],
  },
  { start: 16.93, end: 17.57, text: "للجذور", emphasis: ["للجذور"] },
  { start: 17.63, end: 19.07, text: "ينظّف فروة الراس", emphasis: ["ينظّف"] },
  {
    start: 19.11,
    end: 20.82,
    text: "ثانيا الديرما رولر",
    emphasis: ["الديرما"],
  },
  { start: 20.85, end: 21.82, text: "مرتين في الجمعة", emphasis: ["مرتين"] },
  { start: 21.87, end: 22.67, text: "ما أكثرش", emphasis: ["أكثرش"] },
  {
    start: 22.73,
    end: 24.07,
    text: "وبعد الديرما بالضبط",
    emphasis: ["بالضبط"],
  },
  { start: 24.13, end: 25.17, text: "نحطّو قطرات من", emphasis: ["قطرات"] },
  {
    start: 25.19,
    end: 26.97,
    text: "زيت إكليل الجبل الطبيعي",
    emphasis: ["إكليل", "الجبل"],
  },
  { start: 27.01, end: 28.22, text: "بالنسبة للبروس", emphasis: ["للبروس"] },
  {
    start: 28.25,
    end: 30.47,
    text: "تعمل بيها مساج على فروة الراس",
    emphasis: ["مساج"],
  },
  {
    start: 30.49,
    end: 32.22,
    text: "باش تنشّط الدورة الدموية",
    emphasis: ["الدموية"],
  },
  {
    start: 32.27,
    end: 33.92,
    text: "الخمسة برودويات متاعنا",
    emphasis: ["الخمسة"],
  },
  { start: 33.95, end: 35.42, text: "بـ 49 دينار كهو", emphasis: ["49"] },
  {
    start: 35.49,
    end: 36.77,
    text: "والخلاص عند الاستلام",
    emphasis: ["الاستلام"],
  },
  {
    start: 36.79,
    end: 37.97,
    text: "باش تعدّي الكوموند",
    emphasis: ["الكوموند"],
  },
  { start: 38.12, end: 39.07, text: "انزل اللوطة", emphasis: ["اللوطة"] },
];
