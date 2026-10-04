import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../config";
import { FONTS, SHADOW, SPRING } from "../theme";

// Rounded pill with an icon + Arabic label (+ optional small French label).
// Springs in at `delay`. Used for problems (❌), benefits (✓) and badges.
export const Chip: React.FC<{
  readonly label: string;
  readonly sub?: string;
  readonly icon?: React.ReactNode;
  readonly delay?: number;
  readonly size?: number;
  readonly background?: string;
  readonly color?: string;
  readonly from?: "right" | "left" | "below";
  readonly style?: React.CSSProperties;
}> = ({
  label,
  sub,
  icon,
  delay = 0,
  size = 52,
  background = "rgba(251,247,241,0.96)",
  color = COLORS.brownDeep,
  from = "right",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: SPRING.pop });
  const offset = interpolate(s, [0, 1], [80, 0]);
  const translate =
    from === "below"
      ? `translateY(${offset}px)`
      : `translateX(${from === "right" ? offset : -offset}px)`;

  return (
    <div
      style={{
        display: "flex",
        direction: "rtl",
        alignItems: "center",
        gap: size * 0.35,
        padding: `${size * 0.26}px ${size * 0.55}px`,
        borderRadius: 999,
        background,
        boxShadow: SHADOW.card,
        opacity: interpolate(s, [0, 0.5], [0, 1], {
          extrapolateRight: "clamp",
        }),
        transform: `${translate} scale(${interpolate(s, [0, 1], [0.85, 1])})`,
        ...style,
      }}
    >
      {icon}
      <span
        style={{
          fontFamily: FONTS.arabic,
          fontWeight: 800,
          fontSize: size,
          color,
          lineHeight: 1.15,
        }}
      >
        {label}
      </span>
      {sub ? (
        <span
          style={{
            fontFamily: FONTS.arabic,
            fontWeight: 600,
            fontSize: size * 0.48,
            color: COLORS.brownSoft,
            direction: "ltr",
            paddingTop: size * 0.1,
          }}
        >
          {sub}
        </span>
      ) : null}
    </div>
  );
};
