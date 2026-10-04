import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../config";
import { EASE, FONTS, SPRING } from "../theme";

const ARABIC = /[؀-ۿ]/;

type Mode = "rise" | "mask" | "pop";

// Kinetic typography for short ad lines (5–7 words).
// - rise : word by word, slides up out of a blur (default — reads like premium beauty ads)
// - mask : the whole line is uncovered by a sliding mask (reading direction aware)
// - pop  : the line springs from 70 % scale (punch lines, prices)
// `exitAt` (scene-relative frame) blurs the line out over 8 frames.
export const AnimatedText: React.FC<{
  readonly text: string;
  readonly delay?: number;
  readonly size?: number;
  readonly color?: string;
  readonly weight?: number;
  readonly font?: string;
  readonly mode?: Mode;
  readonly stagger?: number;
  readonly exitAt?: number;
  readonly lineHeight?: number;
  readonly letterSpacing?: number;
  readonly style?: React.CSSProperties;
  readonly children?: React.ReactNode; // optional icon placed at the end of the line
}> = ({
  text,
  delay = 0,
  size = 72,
  color = COLORS.brownDeep,
  weight = 800,
  font = FONTS.arabic,
  mode = "rise",
  stagger = 3,
  exitAt,
  lineHeight = 1.25,
  letterSpacing = 0,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rtl = ARABIC.test(text);

  const exit =
    exitAt === undefined
      ? 0
      : interpolate(frame, [exitAt, exitAt + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE.in,
        });

  const base: React.CSSProperties = {
    fontFamily: font,
    fontSize: size,
    fontWeight: weight,
    color,
    lineHeight,
    letterSpacing,
    direction: rtl ? "rtl" : "ltr",
    textAlign: "center",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    columnGap: size * 0.26,
    opacity: 1 - exit,
    filter: exit > 0 ? `blur(${exit * 14}px)` : undefined,
    transform: exit > 0 ? `translateY(${-exit * 24}px)` : undefined,
    ...style,
  };

  if (mode === "mask") {
    const p = interpolate(frame - delay, [0, 16], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.out,
    });
    const hidden = (1 - p) * 100;
    return (
      <div
        style={{
          ...base,
          clipPath: rtl ? `inset(0 0 0 ${hidden}%)` : `inset(0 ${hidden}% 0 0)`,
          transform: `${base.transform ?? ""} translateX(${(rtl ? -1 : 1) * (1 - p) * -30}px)`,
        }}
      >
        <span>{text}</span>
        {children}
      </div>
    );
  }

  if (mode === "pop") {
    const s = spring({ frame: frame - delay, fps, config: SPRING.pop });
    return (
      <div
        style={{
          ...base,
          opacity: Math.min(1, s * 1.5) * (1 - exit),
          transform: `${base.transform ?? ""} scale(${interpolate(s, [0, 1], [0.7, 1])})`,
        }}
      >
        <span>{text}</span>
        {children}
      </div>
    );
  }

  const words = text.split(" ");
  return (
    <div style={base}>
      {words.map((word, i) => {
        const s = spring({
          frame: frame - delay - i * stagger,
          fps,
          config: SPRING.smooth,
        });
        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: "inline-block",
              opacity: interpolate(s, [0, 0.6], [0, 1], {
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${interpolate(s, [0, 1], [size * 0.55, 0])}px)`,
              filter: `blur(${interpolate(s, [0, 1], [10, 0])}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
      {children ? (
        <span
          style={{
            display: "inline-flex",
            opacity: interpolate(
              spring({
                frame: frame - delay - words.length * stagger,
                fps,
                config: SPRING.pop,
              }),
              [0, 1],
              [0, 1],
            ),
          }}
        >
          {children}
        </span>
      ) : null}
    </div>
  );
};
