import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "../components/Background";
import { Chip } from "../components/Chip";
import { DropIcon, LeafIcon, SparkleIcon } from "../components/Icons";
import { ProductCard } from "../components/ProductCard";
import { Sparkles } from "../components/Sparkles";
import { COLORS, COPY, PRODUCT } from "../config";
import { EASE, FONTS, SPRING } from "../theme";
import { BEATS } from "../timing";

// 8–14s · SOLUTION / PRODUCT REVEAL.
// "الحل؟" lands big in the middle, lifts to become the header, the bottle rises onto
// its pedestal with a light sweep + sparkles (sound accent), then slides left to make
// room for its name and the two reasons to believe (7 natural oils, Tunisian prickly pear).
export const ProductReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beats = BEATS.reveal;

  const q = spring({ frame: frame - beats.question, fps, config: SPRING.pop });
  const lift = interpolate(
    frame,
    [beats.bottle - 6, beats.bottle + 14],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.inOut,
    },
  );
  const qScale =
    interpolate(q, [0, 1], [1.5, 1]) * interpolate(lift, [0, 1], [1, 0.55]);
  const qY = interpolate(lift, [0, 1], [0, -350]);

  const side = interpolate(frame, [beats.name - 8, beats.name + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });
  const glow = interpolate(frame, [beats.bottle, beats.bottle + 20], [0, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textIn = spring({
    frame: frame - beats.name,
    fps,
    config: SPRING.soft,
  });

  return (
    <Background glow={glow}>
      {/* Question → header */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            direction: "rtl",
            transform: `translateY(${qY}px) scale(${qScale})`,
            opacity: Math.min(1, q * 1.4),
          }}
        >
          <span
            style={{
              fontFamily: FONTS.arabic,
              fontWeight: 900,
              fontSize: 170,
              color: COLORS.brownDeep,
              lineHeight: 1.1,
            }}
          >
            {COPY.reveal.question}
          </span>
          <SparkleIcon
            size={110}
            style={{ transform: `rotate(${frame * 1.5}deg)` }}
          />
        </div>
      </AbsoluteFill>

      {/* Bottle: centre → left third */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 110,
          transform: `translateX(${interpolate(side, [0, 1], [0, -215])}px)`,
        }}
      >
        <ProductCard
          height={500}
          delay={beats.bottle}
          sweepAt={beats.bottle + 24}
        />
      </AbsoluteFill>
      <Sparkles
        at={beats.bottle + 16}
        cx={540 - 215 * side}
        cy={560}
        radius={270}
      />

      {/* Name + reasons to believe (right column, RTL) */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 330,
          width: 470,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 14,
          opacity: textIn,
          transform: `translateX(${(1 - textIn) * 60}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.arabic,
            fontWeight: 900,
            fontSize: 92,
            color: COLORS.brownDeep,
            lineHeight: 1.05,
            direction: "rtl",
          }}
        >
          {PRODUCT.nameAr}
        </div>
        <div
          style={{
            fontFamily: FONTS.serif,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 56,
            color: COLORS.goldDeep,
            lineHeight: 1.1,
          }}
        >
          {PRODUCT.name}
        </div>
        <div
          style={{
            width: 220 * textIn,
            height: 2,
            background: `linear-gradient(270deg, ${COLORS.gold}, transparent)`,
            margin: "10px 0 16px",
          }}
        />
        <Chip
          label={COPY.reveal.badge}
          icon={<LeafIcon size={40} />}
          delay={beats.badges[0]}
          size={38}
        />
        <Chip
          label={COPY.reveal.ingredient}
          icon={<DropIcon size={40} />}
          delay={beats.badges[1]}
          size={38}
        />
      </div>
    </Background>
  );
};
