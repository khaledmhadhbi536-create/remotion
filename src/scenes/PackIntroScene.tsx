import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Sparkle, TilePattern } from "../components/Decor";
import { ProductImage } from "../components/ProductImage";
import { bodyFont, colors, displayFont } from "../theme";

// 4–8s · SOLUTION — "a complete routine in one pack": the 5 products drop in on the beat
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const PackIntroScene: React.FC = () => {
  const frame = useCurrentFrame();

  const drop = (at: number) => ({
    opacity: interpolate(frame, [at, at + 4], [0, 1], clamp),
    translate: interpolate(frame, [at, at + 12], ["0px -500px", "0px 0px"], {
      ...clamp,
      easing: Easing.bezier(0.25, 1.35, 0.5, 1),
    }),
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 60%, ${colors.white} 0%, ${colors.blush} 55%, #F6C9D8 100%)`,
        overflow: "hidden",
      }}
    >
      <TilePattern color={colors.rose} opacity={0.08} drift={-frame * 0.4} />

      <AbsoluteFill
        style={{ alignItems: "center", paddingTop: 96, direction: "rtl" }}
      >
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 800,
            fontSize: 52,
            color: colors.roseDeep,
            opacity: interpolate(frame, [6, 12], [0, 1], clamp),
          }}
        >
          ما تقلقيش… الحل موجود
        </div>
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 112,
            lineHeight: 1.15,
            color: colors.plum,
            marginTop: 8,
            opacity: interpolate(frame, [10, 16], [0, 1], clamp),
            scale: interpolate(frame, [10, 22], [0.7, 1], {
              ...clamp,
              easing: Easing.bezier(0.3, 1.6, 0.5, 1),
              output: "perceptual-scale",
            }),
          }}
        >
          روتين كامل في باك واحد
        </div>
      </AbsoluteFill>

      {/* Products land one per beat (every 15 frames) */}
      <AbsoluteFill
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 12,
          paddingBottom: 130,
        }}
      >
        <ProductImage
          product="rosemaryOil"
          height={320}
          style={{ rotate: "-5deg", ...drop(51) }}
        />
        <ProductImage
          product="bottlePink"
          height={400}
          style={{ rotate: "3deg", ...drop(66) }}
        />
        <ProductImage
          product="dermaRoller"
          height={190}
          style={{ marginBottom: 10, ...drop(36) }}
        />
        <ProductImage
          product="sidr"
          height={300}
          style={{ rotate: "4deg", ...drop(81) }}
        />
        <ProductImage
          product="brushPink"
          height={180}
          style={{ rotate: "6deg", ...drop(96) }}
        />
      </AbsoluteFill>

      {/* 5-in-1 badge */}
      <div
        style={{
          position: "absolute",
          right: 70,
          top: 330,
          width: 170,
          height: 170,
          borderRadius: "50%",
          background: colors.rose,
          color: colors.white,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 14px 30px rgba(184,50,106,0.4)",
          rotate: `${interpolate(frame, [108, 120], [-40, 10], { ...clamp, easing: Easing.bezier(0.3, 1.6, 0.5, 1) })}deg`,
          scale: interpolate(frame, [108, 120], [0, 1], {
            ...clamp,
            easing: Easing.bezier(0.3, 1.6, 0.5, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 64,
            lineHeight: 1,
          }}
        >
          5
        </div>
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 30,
            lineHeight: 1.1,
          }}
        >
          في 1
        </div>
      </div>
      <Sparkle
        size={60}
        color={colors.goldLight}
        style={{
          position: "absolute",
          left: 120,
          top: 420,
          rotate: `${frame * 3}deg`,
          scale: interpolate(frame, [70, 80, 100], [0, 1, 0.6], clamp),
        }}
      />
    </AbsoluteFill>
  );
};
