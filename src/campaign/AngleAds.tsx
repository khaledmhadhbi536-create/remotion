import React from "react";
import { Audio } from "@remotion/media";
import {
  linearTiming,
  type TransitionPresentation,
  TransitionSeries,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { AbsoluteFill, staticFile, useVideoConfig } from "remotion";
import type { CaptionPhrase } from "../components/Captions";
import { PACK_PIECES, PRICES, VALUE_TOTAL } from "../config";
import { AdFrame, FEED_45_LAYOUT, SOCIAL_916_LAYOUT } from "../HairPackReel";
import { GiftHookScene, NATURE, NaturalHookScene } from "../scenes/AngleHooks";
import { CtaScene } from "../scenes/CtaScene";
import { HookScene } from "../scenes/HookScene";
import { CARD_BEATS, NumberedPackScene } from "../scenes/NumberedPackScene";
import { OfferHookScene } from "../scenes/OfferHookScene";
import { StepScene } from "../scenes/StepScene";
import { ValueScene } from "../scenes/ValueScene";
import { colors, TRANSITION } from "../theme";

// Campaign creatives: one video per avatar / angle (same angles as the static ads).
//   V1 Deal 18s · V2 Early thinning 30s · V3 Natural 26s · V4 Gift 18s
// Every cut lands on a 2s bar of the soundtrack; each video exists as 1:1 (base), 4:5 and 9:16.

type Kind =
  | "offer"
  | "problem"
  | "natural"
  | "gift"
  | "numbered"
  | "step"
  | "value"
  | "cta";
type Enter = "wipeUp" | "wipeLeft" | "slide" | "fade";
type SceneSpec = {
  readonly name: string;
  readonly frames: number;
  readonly kind: Kind;
  readonly enter?: Enter;
  readonly clicks?: number; // ticks in a step scene
  readonly el: React.ReactNode;
};

// Transitions have different prop types; the series only needs a presentation object
type AnyPresentation = TransitionPresentation<Record<string, unknown>>;
const presentation = (e: Enter): AnyPresentation =>
  (e === "wipeUp"
    ? wipe({ direction: "from-bottom" })
    : e === "wipeLeft"
      ? wipe({ direction: "from-left" })
      : e === "fade"
        ? fade()
        : slide({ direction: "from-right" })) as unknown as AnyPresentation;

const starts = (scenes: SceneSpec[]) => {
  const out: number[] = [];
  let acc = 0;
  for (const s of scenes) {
    out.push(acc);
    acc += s.frames - TRANSITION;
  }
  return out;
};

export const totalFrames = (scenes: SceneSpec[]) =>
  scenes.reduce((a, s) => a + s.frames, 0) - TRANSITION * (scenes.length - 1);

const ctaStart = (scenes: SceneSpec[]) =>
  starts(scenes)[scenes.findIndex((s) => s.kind === "cta")];

// Sound design per scene type: [frame offset, sfx file, volume]
const SFX: Record<Kind, (spec: SceneSpec) => [number, string, number][]> = {
  offer: () => [
    [0, "impact", 0.45],
    [2, "pop", 0.7],
    [2, "whoosh", 0.4],
    [6, "pop", 0.45],
    [9, "pop", 0.45],
    [12, "pop", 0.45],
    [15, "pop", 0.45],
    [18, "pop", 0.45],
    [24, "impact", 0.4],
    [26, "cash-bell", 0.6],
    [44, "click", 0.6],
  ],
  problem: () => [
    [2, "impact", 0.3],
    [30, "pop", 0.55],
    [45, "pop", 0.55],
    [60, "pop", 0.55],
  ],
  natural: () => [
    [2, "pop", 0.6],
    [8, "whoosh", 0.4],
    [14, "whoosh", 0.35],
    [24, "shimmer", 0.35],
    [30, "pop", 0.6],
    [60, "click", 0.55],
  ],
  gift: () => [
    [4, "pop", 0.6],
    [10, "impact", 0.4],
    [36, "whoosh", 0.45],
    [42, "shimmer", 0.5],
    [62, "pop", 0.55],
  ],
  numbered: () => [
    ...CARD_BEATS.map((d): [number, string, number] => [d, "pop", 0.55]),
    [96, "cash-bell", 0.45],
  ],
  step: (s) =>
    [36, 51, 66]
      .slice(0, s.clicks ?? 2)
      .map((d): [number, string, number] => [d, "click", 0.55]),
  value: () => [
    ...[21, 33, 45, 57, 69].map((d): [number, string, number] => [
      d,
      "pop",
      0.55,
    ]),
    [87, "shimmer", 0.4],
  ],
  cta: () => [
    [36, "cash-bell", 0.55],
    [51, "click", 0.55],
    [66, "click", 0.55],
    [81, "pop", 0.6],
    [126, "shimmer", 0.5],
  ],
};

const AngleAd: React.FC<{
  readonly scenes: SceneSpec[];
  readonly music: string;
}> = ({ scenes, music }) => {
  const { fps } = useVideoConfig();
  const timing = linearTiming({ durationInFrames: TRANSITION });
  const st = starts(scenes);
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <TransitionSeries name="Scenes">
        {scenes.flatMap((s, i) => [
          ...(i > 0
            ? [
                <TransitionSeries.Transition
                  key={`t${i}`}
                  presentation={presentation(s.enter ?? "slide")}
                  timing={timing}
                />,
              ]
            : []),
          <TransitionSeries.Sequence
            key={s.name}
            name={s.name}
            durationInFrames={s.frames}
            premountFor={fps}
          >
            {s.el}
          </TransitionSeries.Sequence>,
        ])}
      </TransitionSeries>

      <Audio
        name="Music"
        src={staticFile(`audio/${music}.mp3`)}
        volume={0.7}
        premountFor={fps}
      />
      {scenes.map((s, i) =>
        i > 0 ? (
          <Audio
            key={`w${i}`}
            name={`Whoosh → ${s.name}`}
            from={st[i] - 4}
            src={staticFile("audio/whoosh.mp3")}
            volume={0.45}
            premountFor={fps}
          />
        ) : null,
      )}
      {scenes.flatMap((s, i) =>
        SFX[s.kind](s).map(([d, file, vol]) => (
          <Audio
            key={`${s.name}-${d}-${file}`}
            name={`${s.name} · ${file} @${d}`}
            from={st[i] + d}
            src={staticFile(`audio/${file}.mp3`)}
            volume={vol}
            premountFor={fps}
          />
        )),
      )}
    </AbsoluteFill>
  );
};

const dark = `linear-gradient(160deg, ${colors.charcoalSoft} 0%, ${colors.charcoal} 100%)`;
const natureLight = `radial-gradient(circle at 50% 45%, #FFFFFF 0%, #EEF2EA 55%, #CFDAC6 100%)`;
const priceLine = `اليوم الخمسة بـ ${PRICES.pack} دينار برك`;
const valueLine = `كل وحدة وحدها بـ ${VALUE_TOTAL} دينار`;

// ---------- V1 · Deal (18s) ----------
const V1_SCENES: SceneSpec[] = [
  { name: "Offer hook", frames: 126, kind: "offer", el: <OfferHookScene /> },
  {
    name: "Numbered pack",
    frames: 132,
    kind: "numbered",
    enter: "wipeUp",
    el: (
      <NumberedPackScene title="كل شي يلزمك في باك واحد" accent={colors.red} />
    ),
  },
  {
    name: "Value stack",
    frames: 132,
    kind: "value",
    enter: "fade",
    el: <ValueScene />,
  },
  {
    name: "Offer + CTA",
    frames: 186,
    kind: "cta",
    enter: "wipeLeft",
    el: <CtaScene />,
  },
];
export const V1_CAPTIONS: CaptionPhrase[] = [
  { start: 0.2, end: 1.9, text: "عرض استثنائي!", emphasis: ["استثنائي!"] },
  {
    start: 1.9,
    end: 3.8,
    text: `${PACK_PIECES} قطع بـ ${PRICES.pack} دينار برك`,
    emphasis: [`${PRICES.pack}`],
  },
  {
    start: 4.2,
    end: 7.8,
    text: "سدر، ديرما رولر، زيت الإكليل، مشط الجذور و فرشة",
    emphasis: ["سدر،", "رولر،"],
  },
  { start: 8.2, end: 11.8, text: valueLine, emphasis: [`${VALUE_TOTAL}`] },
  { start: 12.2, end: 15.8, text: priceLine, emphasis: [`${PRICES.pack}`] },
  { start: 16.0, end: 17.9, text: "اطلب توّا!", emphasis: ["توّا!"] },
];
export const V1Deal: React.FC = () => (
  <AngleAd scenes={V1_SCENES} music="music-18s" />
);

// ---------- V2 · Early thinning (30s) ----------
const V2_SCENES: SceneSpec[] = [
  {
    name: "Problem hook",
    frames: 126,
    kind: "problem",
    el: (
      <HookScene
        title="الشعر بدا يخفّ؟"
        chips={["خفيف", "يطيح", "الصلعة"]}
        sub="ما تستنّاش لين يفوت الفوت"
      />
    ),
  },
  {
    name: "Numbered pack",
    frames: 132,
    kind: "numbered",
    enter: "wipeUp",
    el: (
      <NumberedPackScene
        title="الحل: روتين في 3 خطوات"
        accent={colors.bronze}
      />
    ),
  },
  {
    name: "Step 1 · Sidr + root comb",
    frames: 132,
    kind: "step",
    clicks: 3,
    el: (
      <StepScene
        step={1}
        title="اغسل بالسدر البيو"
        bullets={[
          "اخلطو بالماء في مشط الجذور",
          "يوصل للجذور طول",
          "تنظيف طبيعي بلا كيمياء",
        ]}
        howTo="طبّقو بالمشط على الجذور و اشطف"
        products={[
          { product: "sidr", height: 330 },
          { product: "bottleBlack", height: 400 },
        ]}
        motion="tilt"
        accent={colors.bronze}
        background={colors.mist}
      />
    ),
  },
  {
    name: "Step 2 · Derma roller + rosemary",
    frames: 132,
    kind: "step",
    clicks: 2,
    el: (
      <StepScene
        step={2}
        title="ديرما رولر + إكليل الجبل"
        bullets={["مرّتين في الجمعة", "و بعدو قطرات زيت الإكليل"]}
        howTo="رولّ على فروة الراس و حطّ القطرات"
        products={[
          { product: "dermaRoller", height: 145 },
          { product: "rosemaryOil", height: 330 },
        ]}
        motion="roll"
        accent={colors.gold}
        background={dark}
        dark
      />
    ),
  },
  {
    name: "Step 3 · Massage brush",
    frames: 132,
    kind: "step",
    clicks: 2,
    el: (
      <StepScene
        step={3}
        title="فرشة تدليك الراس"
        bullets={["تنشّط الدورة الدموية", "دلّك فروة الراس بلطف"]}
        howTo="دقيقتين تدليك في الدوش"
        products={[{ product: "brushTerracotta", height: 330 }]}
        motion="massage"
        accent={colors.bronze}
        background={colors.mist}
      />
    ),
  },
  {
    name: "Value stack",
    frames: 132,
    kind: "value",
    enter: "fade",
    el: <ValueScene />,
  },
  {
    name: "Offer + CTA",
    frames: 186,
    kind: "cta",
    enter: "wipeLeft",
    el: <CtaScene cta="ابدا توّا" />,
  },
];
export const V2_CAPTIONS: CaptionPhrase[] = [
  { start: 0.2, end: 1.9, text: "الشعر بدا يخفّ؟", emphasis: ["يخفّ؟"] },
  {
    start: 1.9,
    end: 3.8,
    text: "ما تستنّاش لين يفوت الفوت",
    emphasis: ["تستنّاش"],
  },
  {
    start: 4.2,
    end: 7.8,
    text: `روتين طبيعي في 3 خطوات بـ ${PACK_PIECES} قطع`,
    emphasis: ["روتين"],
  },
  {
    start: 8.2,
    end: 11.8,
    text: "اغسل بالسدر البيو و مشط الجذور يوصّلو للجذور",
    emphasis: ["بالسدر"],
  },
  {
    start: 12.2,
    end: 15.8,
    text: "ديرما رولر مرّتين في الجمعة و بعدو قطرات إكليل الجبل",
    emphasis: ["ديرما", "إكليل"],
  },
  {
    start: 16.2,
    end: 19.8,
    text: "و الفرشة تنشّط الدورة الدموية",
    emphasis: ["الفرشة"],
  },
  { start: 20.2, end: 23.8, text: valueLine, emphasis: [`${VALUE_TOTAL}`] },
  { start: 24.2, end: 27.8, text: priceLine, emphasis: [`${PRICES.pack}`] },
  { start: 28.0, end: 29.9, text: "ابدا توّا!", emphasis: ["توّا!"] },
];
export const V2Early: React.FC = () => (
  <AngleAd scenes={V2_SCENES} music="music" />
);

// ---------- V3 · Natural (26s) ----------
const V3_SCENES: SceneSpec[] = [
  {
    name: "Natural hook",
    frames: 126,
    kind: "natural",
    el: <NaturalHookScene />,
  },
  {
    name: "Ingredient · Sidr",
    frames: 132,
    kind: "step",
    clicks: 3,
    enter: "slide",
    el: (
      <StepScene
        step={1}
        tag="مكوّن طبيعي"
        title="سدر بيو AURA BIO"
        bullets={[
          "يغسل و ينظّف بلطف",
          "بلا مواد كيميائية",
          "يتخلط بالماء في مشط الجذور",
        ]}
        howTo="اخلطو بالماء و طبّقو على الجذور"
        products={[{ product: "sidr", height: 420 }]}
        motion="tilt"
        accent={NATURE}
        background={natureLight}
      />
    ),
  },
  {
    name: "Ingredient · Rosemary",
    frames: 132,
    kind: "step",
    clicks: 3,
    el: (
      <StepScene
        step={2}
        tag="مكوّن طبيعي"
        title="زيت إكليل الجبل"
        bullets={[
          "يغذّي جذور الشعر",
          "زيت نباتي 30 مل",
          "قطرات بعد الديرما رولر",
        ]}
        howTo="مرّتين في الجمعة على فروة الراس"
        products={[{ product: "rosemaryOil", height: 440 }]}
        motion="tilt"
        accent={NATURE}
        background={natureLight}
      />
    ),
  },
  {
    name: "Numbered pack",
    frames: 132,
    kind: "numbered",
    enter: "wipeUp",
    el: (
      <NumberedPackScene
        title="و الباك الكامل فيه 5 قطع"
        accent={NATURE}
        dark={false}
      />
    ),
  },
  {
    name: "Value stack",
    frames: 132,
    kind: "value",
    enter: "fade",
    el: <ValueScene />,
  },
  {
    name: "Offer + CTA",
    frames: 186,
    kind: "cta",
    enter: "wipeLeft",
    el: <CtaScene />,
  },
];
export const V3_CAPTIONS: CaptionPhrase[] = [
  { start: 0.2, end: 1.9, text: "من الطبيعة", emphasis: ["الطبيعة"] },
  { start: 1.9, end: 3.8, text: "لجذور شعرك", emphasis: ["لجذور"] },
  {
    start: 4.2,
    end: 7.8,
    text: "سدر بيو يغسل و ينظّف بلا كيمياء",
    emphasis: ["سدر", "بيو"],
  },
  {
    start: 8.2,
    end: 11.8,
    text: "زيت إكليل الجبل يغذّي الجذور",
    emphasis: ["إكليل", "الجبل"],
  },
  {
    start: 12.2,
    end: 15.8,
    text: "و معاهم ديرما رولر، مشط الجذور و فرشة",
    emphasis: ["ديرما"],
  },
  { start: 16.2, end: 19.8, text: valueLine, emphasis: [`${VALUE_TOTAL}`] },
  { start: 20.2, end: 23.8, text: priceLine, emphasis: [`${PRICES.pack}`] },
  { start: 24.0, end: 25.9, text: "اطلب توّا!", emphasis: ["توّا!"] },
];
export const V3Natural: React.FC = () => (
  <AngleAd scenes={V3_SCENES} music="music-26s" />
);

// ---------- V4 · Gift (18s) — speaks to women buying for him ----------
const V4_SCENES: SceneSpec[] = [
  { name: "Gift hook", frames: 126, kind: "gift", el: <GiftHookScene /> },
  {
    name: "Numbered pack",
    frames: 132,
    kind: "numbered",
    enter: "wipeUp",
    el: <NumberedPackScene title="شنوّة فيه الهدية؟" accent={colors.bronze} />,
  },
  {
    name: "Value stack",
    frames: 132,
    kind: "value",
    enter: "fade",
    el: <ValueScene />,
  },
  {
    name: "Offer + CTA",
    frames: 186,
    kind: "cta",
    enter: "wipeLeft",
    el: <CtaScene cta="اطلبيه توّا" />,
  },
];
export const V4_CAPTIONS: CaptionPhrase[] = [
  { start: 0.2, end: 1.9, text: "أحسن هدية لراجلك", emphasis: ["هدية"] },
  { start: 1.9, end: 3.8, text: "و إلا لبوك و خوك", emphasis: ["لبوك"] },
  {
    start: 4.2,
    end: 7.8,
    text: `باك عناية بالشعر فيه ${PACK_PIECES} قطع`,
    emphasis: [`${PACK_PIECES}`],
  },
  { start: 8.2, end: 11.8, text: valueLine, emphasis: [`${VALUE_TOTAL}`] },
  { start: 12.2, end: 15.8, text: priceLine, emphasis: [`${PRICES.pack}`] },
  { start: 16.0, end: 17.9, text: "اطلبيه توّا!", emphasis: ["توّا!"] },
];
export const V4Gift: React.FC = () => (
  <AngleAd scenes={V4_SCENES} music="music-18s" />
);

// ---------- Metadata for Root + framed versions ----------
export const CAMPAIGN = {
  v1: { frames: totalFrames(V1_SCENES), cta: ctaStart(V1_SCENES) },
  v2: { frames: totalFrames(V2_SCENES), cta: ctaStart(V2_SCENES) },
  v3: { frames: totalFrames(V3_SCENES), cta: ctaStart(V3_SCENES) },
  v4: { frames: totalFrames(V4_SCENES), cta: ctaStart(V4_SCENES) },
};

type Fmt = "feed45" | "social916";
const layoutFor = (f: Fmt) =>
  f === "feed45" ? FEED_45_LAYOUT : SOCIAL_916_LAYOUT;

export const V1Framed: React.FC<{ readonly format: Fmt }> = ({ format }) => (
  <AdFrame
    layout={layoutFor(format)}
    captions={V1_CAPTIONS}
    priceBumpAt={CAMPAIGN.v1.cta + 36}
  >
    <V1Deal />
  </AdFrame>
);
export const V2Framed: React.FC<{ readonly format: Fmt }> = ({ format }) => (
  <AdFrame
    layout={layoutFor(format)}
    captions={V2_CAPTIONS}
    priceBumpAt={CAMPAIGN.v2.cta + 36}
  >
    <V2Early />
  </AdFrame>
);
export const V3Framed: React.FC<{ readonly format: Fmt }> = ({ format }) => (
  <AdFrame
    layout={layoutFor(format)}
    captions={V3_CAPTIONS}
    priceBumpAt={CAMPAIGN.v3.cta + 36}
  >
    <V3Natural />
  </AdFrame>
);
export const V4Framed: React.FC<{ readonly format: Fmt }> = ({ format }) => (
  <AdFrame
    layout={layoutFor(format)}
    captions={V4_CAPTIONS}
    priceBumpAt={CAMPAIGN.v4.cta + 36}
  >
    <V4Gift />
  </AdFrame>
);
