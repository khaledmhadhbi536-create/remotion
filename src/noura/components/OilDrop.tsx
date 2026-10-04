import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EASE } from "../theme";
import { DropIcon } from "./Icons";

// A golden drop of oil falling from (x, fromY) to (x, toY), then a soft splash ring.
export const OilDrop: React.FC<{
  readonly at: number;
  readonly x: number;
  readonly fromY: number;
  readonly toY: number;
  readonly size?: number;
  readonly duration?: number;
}> = ({ at, x, fromY, toY, size = 46, duration = 16 }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > duration + 18) return null;
  const p = interpolate(t, [0, duration], [0, 1], {
    extrapolateRight: "clamp",
    easing: EASE.in,
  });
  const splash = interpolate(t, [duration, duration + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      {p < 1 ? (
        <DropIcon
          size={size}
          style={{
            position: "absolute",
            left: x - size / 2,
            top: fromY + (toY - fromY) * p - size,
            transform: `scaleY(${1 + p * 0.25})`,
            filter: "drop-shadow(0 6px 10px rgba(156,116,56,0.5))",
          }}
        />
      ) : null}
      {splash > 0 ? (
        <div
          style={{
            position: "absolute",
            left: x - 70,
            top: toY - 22,
            width: 140,
            height: 44,
            borderRadius: "50%",
            border: "3px solid rgba(232,204,150,0.9)",
            transform: `scale(${0.3 + splash})`,
            opacity: 1 - splash,
          }}
        />
      ) : null}
    </>
  );
};
