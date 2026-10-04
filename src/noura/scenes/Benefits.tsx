import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { Background } from "../components/Background";
import { Chip } from "../components/Chip";
import { HairVisual } from "../components/HairVisual";
import { CheckIcon, DropIcon } from "../components/Icons";
import { MediaSlot } from "../components/MediaSlot";
import { OilDrop } from "../components/OilDrop";
import { ProductBottle } from "../components/ProductBottle";
import { Sparkles } from "../components/Sparkles";
import { ASSETS, COLORS, COPY } from "../config";
import { EASE, FONTS, SHADOW, SPRING } from "../theme";
import { BEATS } from "../timing";

const CARD = { x: 120, y: 205, w: 840, h: 480 };

// 14–21s · BENEFITS — the visual transformation.
// A drop of oil falls on the hair; the "after" wipes over the "before" and stops on a
// 50/50 split (قبل / بعد), then the 3 benefits pop in, one per beat. The bottle stays in
// frame so the transformation is attributed to the product.
export const Benefits: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beats = BEATS.benefits;

  const cardIn = spring({ frame, fps, config: SPRING.soft });
  const wipe = interpolate(frame, [beats.wipeStart, beats.wipeEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });
  // Divider runs from the right edge to the middle: "after" spreads from the right
  const divider = interpolate(wipe, [0, 1], [CARD.w, CARD.w / 2]);
  const labels = spring({
    frame: frame - beats.wipeEnd,
    fps,
    config: SPRING.pop,
  });

  return (
    <Background>
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 92,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <AnimatedText
          text={COPY.benefits.title}
          delay={beats.title}
          size={70}
          weight={900}
        >
          <DropIcon size={58} />
        </AnimatedText>
      </div>

      {/* Before / after card */}
      <div
        style={{
          position: "absolute",
          left: CARD.x,
          top: CARD.y,
          width: CARD.w,
          height: CARD.h,
          borderRadius: 36,
          overflow: "hidden",
          boxShadow: SHADOW.card,
          border: `3px solid ${COLORS.ivory}`,
          opacity: cardIn,
          transform: `translateY(${(1 - cardIn) * 40}px)`,
        }}
      >
        <AbsoluteFill>
          <MediaSlot image={ASSETS.images.before} zoom={[1.02, 1.06]}>
            <HairVisual
              id="before"
              health={0}
              width={CARD.w}
              height={CARD.h}
              strands={70}
            />
          </MediaSlot>
        </AbsoluteFill>
        <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${divider}px)` }}>
          <MediaSlot image={ASSETS.images.after} zoom={[1.02, 1.06]}>
            <HairVisual
              id="after"
              health={1}
              width={CARD.w}
              height={CARD.h}
              strands={70}
              glossY={interpolate(frame, [beats.wipeStart, 210], [0.15, 0.6])}
            />
          </MediaSlot>
        </AbsoluteFill>
        {/* Divider handle */}
        {wipe > 0 ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: divider - 2,
              width: 4,
              background: COLORS.ivory,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: CARD.h / 2 - 26,
                left: -24,
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: COLORS.ivory,
                boxShadow: SHADOW.card,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                color: COLORS.brown,
                fontFamily: FONTS.arabic,
                fontWeight: 900,
              }}
            >
              ‹ ›
            </div>
          </div>
        ) : null}
        <SplitLabel
          text={COPY.benefits.before}
          side="left"
          progress={labels}
          dark
        />
        <SplitLabel text={COPY.benefits.after} side="right" progress={labels} />
      </div>

      <OilDrop
        at={beats.drop}
        x={CARD.x + CARD.w - 260}
        fromY={0}
        toY={CARD.y + 120}
      />
      <Sparkles
        at={beats.wipeEnd - 6}
        cx={CARD.x + CARD.w * 0.75}
        cy={CARD.y + CARD.h / 2}
        radius={190}
        count={7}
        color={COLORS.goldLight}
      />

      {/* Product in frame: the result belongs to it */}
      <div
        style={{
          position: "absolute",
          left: CARD.x + CARD.w - 115,
          top: CARD.y + CARD.h - 250,
          transform: `rotate(6deg) translateY(${(1 - cardIn) * 80}px)`,
          opacity: cardIn,
          filter: "drop-shadow(0 20px 20px rgba(46,30,19,0.35))",
        }}
      >
        <ProductBottle height={270} />
      </div>

      {/* 3 benefits */}
      <div
        style={{
          position: "absolute",
          top: 725,
          left: 90,
          right: 90,
          display: "flex",
          direction: "rtl",
          justifyContent: "center",
          gap: 18,
        }}
      >
        {COPY.benefits.items.map((item, i) => (
          <Chip
            key={item}
            label={item}
            icon={<CheckIcon size={42} />}
            delay={beats.items[i]}
            size={40}
            from="below"
            background={COLORS.white}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          top: 860,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <AnimatedText
          text={COPY.benefits.signature}
          delay={beats.signature}
          mode="mask"
          size={50}
          weight={700}
          color={COLORS.goldDeep}
        />
      </div>
    </Background>
  );
};

const SplitLabel: React.FC<{
  readonly text: string;
  readonly side: "left" | "right";
  readonly progress: number;
  readonly dark?: boolean;
}> = ({ text, side, progress, dark }) => (
  <div
    style={{
      position: "absolute",
      top: 24,
      [side]: 24,
      padding: "8px 26px",
      borderRadius: 999,
      background: dark ? "rgba(46,30,19,0.75)" : COLORS.gold,
      color: COLORS.ivory,
      fontFamily: FONTS.arabic,
      fontWeight: 800,
      fontSize: 36,
      opacity: progress,
      transform: `scale(${interpolate(progress, [0, 1], [0.6, 1])})`,
    }}
  >
    {text}
  </div>
);
