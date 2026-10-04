import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { COLORS } from "../config";
import { SparkleIcon } from "./Icons";

// Small golden glints that twinkle around a point (product reveal, gloss).
// Kept sparse on purpose: a hint of shine, not a glitter explosion.
export const Sparkles: React.FC<{
  readonly at: number; // start frame
  readonly count?: number;
  readonly cx?: number;
  readonly cy?: number;
  readonly radius?: number;
  readonly color?: string;
}> = ({
  at,
  count = 9,
  cx = 540,
  cy = 520,
  radius = 300,
  color = COLORS.gold,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const delay = at + random(`d${i}`) * 30;
        const life = interpolate(frame - delay, [0, 10, 28], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (life <= 0) return null;
        const a = random(`a${i}`) * Math.PI * 2;
        const r = radius * (0.45 + random(`r${i}`) * 0.55);
        const size = 18 + random(`s${i}`) * 26;
        return (
          <SparkleIcon
            key={i}
            size={size}
            color={color}
            style={{
              position: "absolute",
              left: cx + Math.cos(a) * r - size / 2,
              top: cy + Math.sin(a) * r - size / 2,
              opacity: life,
              transform: `scale(${life}) rotate(${life * 45}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
