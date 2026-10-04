import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../config";
import { GRADIENTS, SPRING } from "../theme";
import { ProductBottle } from "./ProductBottle";

// Bottle on a round travertine-like pedestal with a golden halo.
// Used for the product reveal and the end card (same staging = brand memory).
export const ProductCard: React.FC<{
  readonly height: number;
  readonly delay?: number;
  readonly sweepAt?: number; // frame at which the light sweep crosses the glass
  readonly float?: boolean;
}> = ({ height, delay = 0, sweepAt, float = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - delay,
    fps,
    config: SPRING.smooth,
    durationInFrames: 40,
  });
  const bob = float ? Math.sin((frame - delay) / 22) * 6 : 0;
  const sweep =
    sweepAt === undefined
      ? -1
      : interpolate(frame, [sweepAt, sweepAt + 26], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  const pedestalW = height * 0.82;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Halo ring */}
      <div
        style={{
          position: "absolute",
          top: height * 0.08,
          width: height * 0.95,
          height: height * 0.95,
          borderRadius: "50%",
          border: `1.5px solid ${COLORS.gold}`,
          opacity: 0.55 * enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.6, 1])})`,
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 2,
          transform: `translateY(${interpolate(enter, [0, 1], [height * 0.45, 0]) + bob}px) scale(${interpolate(enter, [0, 1], [0.85, 1])})`,
          opacity: interpolate(enter, [0, 0.4], [0, 1], {
            extrapolateRight: "clamp",
          }),
          filter: `blur(${interpolate(enter, [0, 1], [12, 0])}px)`,
        }}
      >
        <ProductBottle height={height} sweep={sweep} />
      </div>
      {/* Pedestal */}
      <div
        style={{
          marginTop: -height * 0.05,
          width: pedestalW,
          height: pedestalW * 0.2,
          borderRadius: "50%",
          background: `linear-gradient(180deg, ${COLORS.ivory} 0%, ${COLORS.sand} 100%)`,
          boxShadow: `0 ${height * 0.05}px ${height * 0.08}px -${height * 0.02}px rgba(46,30,19,0.35), inset 0 -6px 0 ${COLORS.beige}`,
          opacity: enter,
          transform: `scaleX(${interpolate(enter, [0, 1], [0.7, 1])})`,
          zIndex: 1,
        }}
      />
      <div
        style={{
          width: pedestalW * 0.5,
          height: 3,
          marginTop: 8,
          background: GRADIENTS.gold,
          opacity: 0.6 * enter,
          borderRadius: 2,
        }}
      />
    </div>
  );
};
