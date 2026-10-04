import React from "react";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { AbsoluteFill, staticFile, useVideoConfig } from "remotion";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { OfferHookScene } from "./scenes/OfferHookScene";
import { PackIntroScene } from "./scenes/PackIntroScene";
import { StepScene } from "./scenes/StepScene";
import { ValueScene } from "./scenes/ValueScene";
import { colors, TRANSITION } from "./theme";

// 34s square (1:1) feed ad — "Hair Growth 5-in-1" pack at 49 DT.
//
// Offer hook 0–4 → Problem 4–8 → Pack 8–12 → Routine in 3 steps 12–24 → Value 24–28 → Offer + CTA 28–34
// Every cut lands on a bar line of the 120 BPM soundtrack (public/audio/music-34s.mp3).
export const PACK_AD_FRAMES = 1020;

// Scene start frames (durations minus the 12-frame transition overlaps)
const PROBLEM_START = 114;
const INTRO_START = 234;
const STEP_START = [354, 474, 594];
const VALUE_START = 714;
export const CTA_START = 834;
const END_CARD = CTA_START + 126; // 32s, final hit of the music

// Remove this line (set to "") for paid ads: "blocks DHT" is a health claim Meta may reject.
const DHT_LINE = "الإكليل معروف ضد الـDHT";

const sfx = (name: string) => staticFile(`audio/${name}.mp3`);
const dark = `linear-gradient(160deg, ${colors.charcoalSoft} 0%, ${colors.charcoal} 100%)`;

export const HairPackAd: React.FC = () => {
  const { fps } = useVideoConfig();
  const timing = linearTiming({ durationInFrames: TRANSITION });
  const slideIn = slide({ direction: "from-right" });

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <TransitionSeries name="Scenes">
        <TransitionSeries.Sequence
          name="Offer hook"
          durationInFrames={126}
          premountFor={fps}
        >
          <OfferHookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-bottom" })}
          timing={timing}
        />
        <TransitionSeries.Sequence
          name="Problem"
          durationInFrames={132}
          premountFor={fps}
        >
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-top" })}
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
          name="Step 1 · Sidr + root comb"
          durationInFrames={132}
          premountFor={fps}
        >
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
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slideIn} timing={timing} />
        <TransitionSeries.Sequence
          name="Step 2 · Derma roller + rosemary"
          durationInFrames={132}
          premountFor={fps}
        >
          <StepScene
            step={2}
            title="ديرما رولر + إكليل الجبل"
            bullets={[
              "مرّتين في الجمعة",
              "و بعدو قطرات زيت الإكليل",
              ...(DHT_LINE ? [DHT_LINE] : []),
            ]}
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
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slideIn} timing={timing} />
        <TransitionSeries.Sequence
          name="Step 3 · Massage brush"
          durationInFrames={132}
          premountFor={fps}
        >
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

      {/* Soundtrack (generated by scripts/generate-audio.mjs, 17 bars = 34s) */}
      <Audio
        name="Music"
        src={sfx("music-34s")}
        volume={0.7}
        premountFor={fps}
      />

      {/* Offer hook: flash impact, stamp, product burst, price slam, strike */}
      <Audio
        name="Impact · open"
        src={sfx("impact")}
        volume={0.5}
        premountFor={fps}
      />
      <Audio
        name="Pop · stamp"
        from={2}
        src={sfx("pop")}
        volume={0.7}
        premountFor={fps}
      />
      <Audio
        name="Whoosh · burst"
        from={2}
        src={sfx("whoosh")}
        volume={0.4}
        premountFor={fps}
      />
      {[6, 9, 12, 15, 18].map((f) => (
        <Audio
          key={f}
          name={`Pop · burst @${f}`}
          from={f}
          src={sfx("pop")}
          volume={0.45}
          premountFor={fps}
        />
      ))}
      <Audio
        name="Impact · price"
        from={24}
        src={sfx("impact")}
        volume={0.4}
        premountFor={fps}
      />
      <Audio
        name="Cash bell · price"
        from={26}
        src={sfx("cash-bell")}
        volume={0.6}
        premountFor={fps}
      />
      <Audio
        name="Click · strike"
        from={44}
        src={sfx("click")}
        volume={0.6}
        premountFor={fps}
      />
      <Audio
        name="Riser → problem"
        from={PROBLEM_START - 40}
        src={sfx("riser")}
        volume={0.25}
        premountFor={fps}
      />

      {/* Whooshes on each cut (peak on the bar line) */}
      {[110, 230, 350, 470, 590, 710, 830].map((f) => (
        <Audio
          key={f}
          name={`Whoosh · cut @${f}`}
          from={f}
          src={sfx("whoosh")}
          volume={0.45}
          premountFor={fps}
        />
      ))}

      {/* Problem: stamps on the pain points */}
      {[30, 45, 60].map((d) => (
        <Audio
          key={d}
          name={`Pop · pain @${d}`}
          from={PROBLEM_START + d}
          src={sfx("pop")}
          volume={0.55}
          premountFor={fps}
        />
      ))}

      {/* Pack intro: 5 products land, then the 5-in-1 badge */}
      {[36, 51, 66, 81, 96].map((d) => (
        <Audio
          key={d}
          name={`Pop · land @${d}`}
          from={INTRO_START + d}
          src={sfx("pop")}
          volume={0.55}
          premountFor={fps}
        />
      ))}
      <Audio
        name="Shimmer · 5-in-1"
        from={INTRO_START + 108}
        src={sfx("shimmer")}
        volume={0.45}
        premountFor={fps}
      />

      {/* Steps: a click on each tick */}
      {STEP_START.flatMap((s, i) =>
        [36, 51, 66].map((d) => (
          <Audio
            key={`${s}-${d}`}
            name={`Click · step ${i + 1} @${d}`}
            from={s + d}
            src={sfx("click")}
            volume={0.55}
            premountFor={fps}
          />
        )),
      )}

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
        name="Cash bell · price"
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
        name="Shimmer · end card"
        from={END_CARD}
        src={sfx("shimmer")}
        volume={0.5}
        premountFor={fps}
      />
    </AbsoluteFill>
  );
};
