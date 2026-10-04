import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { TilePattern } from "../components/Decor";
import { ProductCard } from "../components/NumberedProducts";
import { PACK_PIECES, PRICES } from "../config";
import { bodyFont, colors, displayFont } from "../theme";

// 4s · THE PACK — the 5 products pop in as numbered cards, one per beat (1 سدر … 5 فرشة).
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const CARD_BEATS = [21, 36, 51, 66, 81];

export const NumberedPackScene: React.FC<{
  readonly title: string;
  readonly accent: string;
  readonly dark?: boolean;
}> = ({ title, accent, dark = true }) => {
  const frame = useCurrentFrame();
  const textColor = dark ? colors.white : colors.charcoal;

  const pop = (at: number): React.CSSProperties => ({
    opacity: interpolate(frame, [at, at + 3], [0, 1], clamp),
    scale: String(
      interpolate(frame, [at, at + 10], [0.3, 1], {
        ...clamp,
        easing: Easing.bezier(0.3, 1.6, 0.5, 1),
      }),
    ),
    rotate: `${interpolate(frame, [at, at + 10], [-12, 0], clamp)}deg`,
  });

  return (
    <AbsoluteFill
      style={{
        background: dark
          ? `linear-gradient(160deg, ${colors.charcoalSoft} 0%, ${colors.charcoal} 100%)`
          : `radial-gradient(circle at 50% 45%, ${colors.white} 0%, ${colors.mist} 60%, #C9CED6 100%)`,
        overflow: "hidden",
      }}
    >
      <TilePattern color={colors.bronze} opacity={0.08} drift={frame * 0.4} />

      <AbsoluteFill
        style={{ alignItems: "center", paddingTop: 60, direction: "rtl" }}
      >
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 84,
            lineHeight: 1.1,
            color: textColor,
            opacity: interpolate(frame, [4, 10], [0, 1], clamp),
            translate: interpolate(frame, [4, 16], ["0px -40px", "0px 0px"], {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          {title}
        </div>
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          top: 210,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
        }}
      >
        <div style={{ display: "flex", gap: 24, direction: "rtl" }}>
          {[0, 1, 2].map((i) => (
            <ProductCard
              key={i}
              index={i}
              accent={accent}
              style={pop(CARD_BEATS[i])}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: 24, direction: "rtl" }}>
          {[3, 4].map((i) => (
            <ProductCard
              key={i}
              index={i}
              accent={accent}
              style={pop(CARD_BEATS[i])}
            />
          ))}
        </div>
      </div>

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 48,
        }}
      >
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 50,
            color: colors.charcoal,
            background: colors.goldLight,
            padding: "4px 40px 12px",
            borderRadius: 18,
            direction: "rtl",
            boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
            ...pop(96),
          }}
        >
          {PACK_PIECES} قطع في باك واحد بـ {PRICES.pack} د.ت
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
