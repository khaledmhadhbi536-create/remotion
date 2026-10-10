// Edit decision list for the UGC ad (public/ugc). The voice-over is Gemini TTS, voice « Puck »
// (voice-puck.m4a), processed into voice-puck-master.m4a (36.5s). It is the
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
  // Hook — « اليوم عنّا باك »
  { src: "hook", srcStart: 0.1, srcEnd: 2.02, start: 0, end: 1.25, zoom: 1 },
  // « فيه خمسة حاجات » (jump cut over the clip's pause)
  {
    src: "hook",
    srcStart: 2.55,
    srcEnd: 3.5,
    start: 1.25,
    end: 2.05,
    zoom: 1.15,
  },
  // « الكل بتسعة وأربعين… »
  {
    src: "hook",
    srcStart: 3.92,
    srcEnd: 5.25,
    start: 2.05,
    end: 3.15,
    zoom: 1,
  },
  // « …دينار » (skips the clip's repeated « واربعين »)
  {
    src: "hook",
    srcStart: 5.8,
    srcEnd: 6.4,
    start: 3.15,
    end: 3.75,
    zoom: 1.15,
  },
  // CTA — the face only comes back on « انزل اللوطة »; « باش تعدّي الكوموند » plays over
  // the pack shot (voice only)
  {
    src: "cta",
    srcStart: 1.75,
    srcEnd: 2.3,
    start: 35.35,
    end: 35.85,
    zoom: 1.22,
  },
  {
    src: "cta",
    srcStart: 2.45,
    srcEnd: 3.4,
    start: 35.85,
    end: 36.35,
    zoom: 1.22,
  },
  // the pointing-down gesture, kept whole (src 4–7 = finger pointing at the button)
  {
    src: "cta",
    srcStart: 3.4,
    srcEnd: 6.8,
    start: 36.35,
    end: 39.75,
    zoom: 1.1,
  },
];

export const TOTAL_SECONDS = 39.75;
export const TOTAL_FRAMES = f(TOTAL_SECONDS);
export const HOOK_END = 3.75;
export const CTA_START = 35.35;

// ---------------------------------------------------------------------------
// Subtitles — Tunisian derja, exactly as spoken (numbers written as digits).
export const CAPTIONS = [
  { start: 0.29, end: 0.99, text: "اليوم عنّا باك", emphasis: ["باك"] },
  { start: 0.98, end: 1.78, text: "فيه خمسة حاجات", emphasis: ["خمسة"] },
  { start: 2.17, end: 3.43, text: "الكل 49 دينار", emphasis: ["49"] },
  {
    start: 3.78,
    end: 5.19,
    text: "كان شعرك بدا يطيح ويفرغ",
    emphasis: ["يطيح"],
  },
  { start: 5.18, end: 6.59, text: "وجرّبت برشا حاجات", emphasis: ["برشا"] },
  { start: 6.58, end: 7.35, text: "وما لقيتش نتيجة", emphasis: ["نتيجة"] },
  {
    start: 7.71,
    end: 9.43,
    text: "تبّعني نفسرلك الروتين كامل",
    emphasis: ["الروتين"],
  },
  { start: 9.73, end: 10.69, text: "أوّلا السدر", emphasis: ["السدر"] },
  { start: 11.07, end: 11.93, text: "نزيدوه شويّة ميّة", emphasis: ["ميّة"] },
  {
    start: 11.92,
    end: 12.97,
    text: "نحطّوه في الأبليكاتور",
    emphasis: ["الأبليكاتور"],
  },
  { start: 12.96, end: 14.35, text: "ونغسلو بيه شعرنا", emphasis: ["شعرنا"] },
  {
    start: 14.71,
    end: 16.24,
    text: "الأبليكاتور يخلّي السدر يوصل",
    emphasis: ["السدر"],
  },
  { start: 16.23, end: 16.77, text: "للجذور", emphasis: ["للجذور"] },
  { start: 16.76, end: 18.11, text: "ينظّف فروة الراس", emphasis: ["ينظّف"] },
  {
    start: 18.1,
    end: 19.58,
    text: "ثانيا الديرما رولر",
    emphasis: ["الديرما"],
  },
  { start: 19.57, end: 20.57, text: "مرتين في الجمعة", emphasis: ["مرتين"] },
  { start: 20.56, end: 21.37, text: "ما أكثرش", emphasis: ["أكثرش"] },
  {
    start: 21.36,
    end: 22.96,
    text: "وبعد الديرما بالضبط",
    emphasis: ["بالضبط"],
  },
  { start: 23.1, end: 24.05, text: "نحطّو قطرات من", emphasis: ["قطرات"] },
  {
    start: 24.04,
    end: 25.26,
    text: "زيت إكليل الجبل الطبيعي",
    emphasis: ["إكليل", "الجبل"],
  },
  { start: 25.83, end: 26.59, text: "بالنسبة للبروس", emphasis: ["للبروس"] },
  {
    start: 26.58,
    end: 28.49,
    text: "تعمل بيها مساج على فروة الراس",
    emphasis: ["مساج"],
  },
  {
    start: 28.48,
    end: 29.97,
    text: "باش تنشّط الدورة الدموية",
    emphasis: ["الدموية"],
  },
  {
    start: 30.37,
    end: 31.75,
    text: "الخمسة برودويات متاعنا",
    emphasis: ["الخمسة"],
  },
  { start: 31.74, end: 33.01, text: "بـ 49 دينار كهو", emphasis: ["49"] },
  {
    start: 33,
    end: 34.27,
    text: "والخلاص عند الاستلام",
    emphasis: ["الاستلام"],
  },
  {
    start: 34.57,
    end: 35.39,
    text: "باش تعدّي الكوموند",
    emphasis: ["الكوموند"],
  },
  { start: 35.38, end: 36.12, text: "انزل اللوطة", emphasis: ["اللوطة"] },
];
