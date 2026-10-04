import React from "react";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { AbsoluteFill, staticFile, useVideoConfig } from "remotion";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { PackIntroScene } from "./scenes/PackIntroScene";
import { StepScene } from "./scenes/StepScene";
import { ValueScene } from "./scenes/ValueScene";
import { colors, TRANSITION } from "./theme";

// 38s square (1:1) feed ad for the "Hair Growth 5-in-1" pack:
// derma roller + rosemary oil + root-comb applicator + sidr powder + scalp massage brush.
//
// Hook 0–4 → Pack 4–8 → Steps 8–28 (4s each) → Value 28–32 → Offer + CTA 32–38
// Every cut lands on a bar line of the 120 BPM soundtrack (public/audio/music-38s.mp3).
export const PACK_AD_FRAMES = 1140;

// Scene start frames (scene durations minus 12-frame transition overlaps)
const STEP_START = [234, 354, 474, 594, 714];
const VALUE_START = 834;
const CTA_START = 954;
const END_CARD = CTA_START + 126; // 36s, final hit of the music

const sfx = (name: string) => staticFile(`audio/${name}.mp3`);

export const HairPackAd: React.FC = () => {
  const { fps } = useVideoConfig();
  const timing = linearTiming({ durationInFrames: TRANSITION });
  const slideIn = slide({ direction: "from-right" });

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <TransitionSeries name="Scenes">
        <TransitionSeries.Sequence
          name="Hook"
          durationInFrames={126}
          premountFor={fps}
        >
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-bottom" })}
          timing={timing}
        />
        <TransitionSeries.Sequence
          name="Pack intro"
          durationInFrames={132}
          premountFor={fps}
        >
          <PackIntroScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slideIn} timing={timing} />
        <TransitionSeries.Sequence
          name="Step 1 · Derma roller"
          durationInFrames={132}
          premountFor={fps}
        >
          <StepScene
            step={1}
            title="ديرما رولر 540 إبرة"
            bullets={["ينشّط فروة الراس", "يخلّي الزيت يدخل للجذور"]}
            howTo="مرّة في الجمعة على فروة الراس"
            products={[{ product: "dermaRoller", height: 260 }]}
            motion="roll"
            accent={colors.rose}
            background={colors.blush}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slideIn} timing={timing} />
        <TransitionSeries.Sequence
          name="Step 2 · Rosemary oil"
          durationInFrames={132}
          premountFor={fps}
        >
          <StepScene
            step={2}
            title="زيت إكليل الجبل"
            bullets={["يغذّي جذور الشعر", "زيت نباتي 30 مل"]}
            howTo="شويّة قطرات على فروة الراس"
            products={[{ product: "rosemaryOil", height: 440 }]}
            motion="tilt"
            accent={colors.gold}
            background={`linear-gradient(160deg, ${colors.plumSoft} 0%, ${colors.plum} 100%)`}
            dark
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slideIn} timing={timing} />
        <TransitionSeries.Sequence
          name="Step 3 · Applicator"
          durationInFrames={132}
          premountFor={fps}
        >
          <StepScene
            step={3}
            title="قارورة بمشط للجذور"
            bullets={[
              "الزيت يوصل للجذور طول",
              "بلا تبذير و بلا وسخ",
              "بالوردي و إلا بالأكحل",
            ]}
            howTo="حطّي فيها زيت الإكليل و مشّطي"
            products={[
              { product: "bottlePink", height: 470 },
              { product: "bottleBlack", height: 470 },
            ]}
            motion="tilt"
            accent={colors.rose}
            background={colors.blush}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slideIn} timing={timing} />
        <TransitionSeries.Sequence
          name="Step 4 · Sidr"
          durationInFrames={132}
          premountFor={fps}
        >
          <StepScene
            step={4}
            title="سدر طبيعي"
            bullets={["يغسل و ينظّف بلطف", "بلا مواد كيميائية"]}
            howTo="اخلطيه بالماء و اغسلي بيه شعرك"
            products={[{ product: "sidr", height: 420 }]}
            motion="tilt"
            accent={colors.gold}
            background={`linear-gradient(160deg, ${colors.plumSoft} 0%, ${colors.plum} 100%)`}
            dark
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slideIn} timing={timing} />
        <TransitionSeries.Sequence
          name="Step 5 · Massage brush"
          durationInFrames={132}
          premountFor={fps}
        >
          <StepScene
            step={5}
            title="فرشة تدليك الراس"
            bullets={["تحرّك الدورة الدموية", "توزّع السدر مليح"]}
            howTo="دقيقتين تدليك في الدوش"
            products={[{ product: "brushPink", height: 330 }]}
            motion="massage"
            accent={colors.rose}
            background={colors.blush}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />
        <TransitionSeries.Sequence
          name="Value stack"
          durationInFrames={132}
          premountFor={fps}
        >
          <ValueScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={timing}
        />
        <TransitionSeries.Sequence
          name="Offer + CTA"
          durationInFrames={186}
          premountFor={fps}
        >
          <CtaScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Soundtrack (generated by scripts/generate-audio.mjs, 19 bars = 38s) */}
      <Audio
        name="Music"
        src={sfx("music-38s")}
        volume={0.75}
        premountFor={fps}
      />

      {/* Hook: stamps on the pain points */}
      <Audio
        name="Pop · chip 1"
        from={30}
        src={sfx("pop")}
        volume={0.55}
        premountFor={fps}
      />
      <Audio
        name="Pop · chip 2"
        from={45}
        src={sfx("pop")}
        volume={0.55}
        premountFor={fps}
      />
      <Audio
        name="Pop · chip 3"
        from={60}
        src={sfx("pop")}
        volume={0.55}
        premountFor={fps}
      />

      {/* Whooshes on each cut (peak lands on the bar line) */}
      <Audio
        name="Whoosh → Pack"
        from={110}
        src={sfx("whoosh")}
        volume={0.5}
        premountFor={fps}
      />
      <Audio
        name="Whoosh → Step 1"
        from={230}
        src={sfx("whoosh")}
        volume={0.45}
        premountFor={fps}
      />
      <Audio
        name="Whoosh → Step 2"
        from={350}
        src={sfx("whoosh")}
        volume={0.45}
        premountFor={fps}
      />
      <Audio
        name="Whoosh → Step 3"
        from={470}
        src={sfx("whoosh")}
        volume={0.45}
        premountFor={fps}
      />
      <Audio
        name="Whoosh → Step 4"
        from={590}
        src={sfx("whoosh")}
        volume={0.45}
        premountFor={fps}
      />
      <Audio
        name="Whoosh → Step 5"
        from={710}
        src={sfx("whoosh")}
        volume={0.45}
        premountFor={fps}
      />
      <Audio
        name="Whoosh → Value"
        from={830}
        src={sfx("whoosh")}
        volume={0.5}
        premountFor={fps}
      />
      <Audio
        name="Whoosh → CTA"
        from={950}
        src={sfx("whoosh")}
        volume={0.5}
        premountFor={fps}
      />

      {/* Pack intro: 5 products land, then the 5-in-1 badge */}
      <Audio
        name="Pop · roller"
        from={150}
        src={sfx("pop")}
        volume={0.6}
        premountFor={fps}
      />
      <Audio
        name="Pop · rosemary"
        from={165}
        src={sfx("pop")}
        volume={0.6}
        premountFor={fps}
      />
      <Audio
        name="Pop · applicator"
        from={180}
        src={sfx("pop")}
        volume={0.6}
        premountFor={fps}
      />
      <Audio
        name="Pop · sidr"
        from={195}
        src={sfx("pop")}
        volume={0.6}
        premountFor={fps}
      />
      <Audio
        name="Pop · brush"
        from={210}
        src={sfx("pop")}
        volume={0.6}
        premountFor={fps}
      />
      <Audio
        name="Shimmer · 5-in-1"
        from={222}
        src={sfx("shimmer")}
        volume={0.45}
        premountFor={fps}
      />

      {/* Steps: a click on each benefit tick */}
      {STEP_START.map((s, i) => (
        <React.Fragment key={s}>
          <Audio
            name={`Click · step ${i + 1} a`}
            from={s + 36}
            src={sfx("click")}
            volume={0.55}
            premountFor={fps}
          />
          <Audio
            name={`Click · step ${i + 1} b`}
            from={s + 51}
            src={sfx("click")}
            volume={0.55}
            premountFor={fps}
          />
          {i === 2 ? (
            <Audio
              name="Click · step 3 c"
              from={s + 66}
              src={sfx("click")}
              volume={0.55}
              premountFor={fps}
            />
          ) : null}
        </React.Fragment>
      ))}

      {/* Value stack: one pop per row, shimmer on the total */}
      {[21, 33, 45, 57, 69].map((d) => (
        <Audio
          key={d}
          name={`Pop · row @${d}`}
          from={VALUE_START + d}
          src={sfx("pop")}
          volume={0.55}
          premountFor={fps}
        />
      ))}
      <Audio
        name="Shimmer · total"
        from={VALUE_START + 87}
        src={sfx("shimmer")}
        volume={0.4}
        premountFor={fps}
      />

      {/* Offer */}
      <Audio
        name="Cash bell (price)"
        from={CTA_START + 36}
        src={sfx("cash-bell")}
        volume={0.55}
        premountFor={fps}
      />
      <Audio
        name="Click · free delivery"
        from={CTA_START + 51}
        src={sfx("click")}
        volume={0.55}
        premountFor={fps}
      />
      <Audio
        name="Click · cash on delivery"
        from={CTA_START + 66}
        src={sfx("click")}
        volume={0.55}
        premountFor={fps}
      />
      <Audio
        name="Pop · order button"
        from={CTA_START + 81}
        src={sfx("pop")}
        volume={0.6}
        premountFor={fps}
      />
      <Audio
        name="Shimmer (end card)"
        from={END_CARD}
        src={sfx("shimmer")}
        volume={0.5}
        premountFor={fps}
      />
    </AbsoluteFill>
  );
};
