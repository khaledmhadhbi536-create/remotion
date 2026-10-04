import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../config";
import { FONTS, GRADIENTS, SPRING } from "../theme";
import { TapIcon } from "./Icons";

// "COMMANDER MAINTENANT" button: springs in, then breathes (pulse) with a gold
// shine passing across, and a finger "taps" it at `tapAt` (press + ripple).
export const CTAButton: React.FC<{
  readonly label: string;
  readonly delay?: number;
  readonly tapAt?: number;
}> = ({ label, delay = 0, tapAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - delay;
  const enter = spring({ frame: t, fps, config: SPRING.pop });
  const pulse =
    1 + Math.max(0, Math.sin((t - 10) / 7)) * 0.045 * (t > 10 ? 1 : 0);
  const shine = ((t % 45) / 45) * 160 - 30;

  const tap = tapAt === undefined ? -1 : frame - tapAt;
  const press =
    tap >= 0 && tap < 8 ? interpolate(tap, [0, 3, 8], [1, 0.93, 1]) : 1;
  const ripple =
    tap >= 0
      ? interpolate(tap, [0, 18], [0, 1], { extrapolateRight: "clamp" })
      : 0;
  const hand =
    tapAt === undefined
      ? 0
      : interpolate(
          frame,
          [tapAt - 14, tapAt, tapAt + 22, tapAt + 32],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );

  return (
    <div
      style={{
        position: "relative",
        transform: `scale(${interpolate(enter, [0, 1], [0.6, 1]) * pulse * press})`,
        opacity: enter,
      }}
    >
      {/* Ripple */}
      {ripple > 0 && ripple < 1 ? (
        <div
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: 999,
            border: `3px solid ${COLORS.gold}`,
            transform: `scale(${1 + ripple * 0.25})`,
            opacity: 1 - ripple,
          }}
        />
      ) : null}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "26px 64px",
          borderRadius: 999,
          background: GRADIENTS.button,
          border: `2px solid ${COLORS.gold}`,
          boxShadow:
            "0 18px 40px -12px rgba(46,30,19,0.6), inset 0 1px 0 rgba(255,255,255,0.25)",
          color: COLORS.ivory,
          fontFamily: FONTS.arabic,
          fontWeight: 800,
          fontSize: 40,
          letterSpacing: 2,
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <span>{label}</span>
        <span style={{ fontSize: 40, color: COLORS.goldLight }}>→</span>
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${shine}%`,
            width: "22%",
            background:
              "linear-gradient(90deg, transparent, rgba(232,204,150,0.45), transparent)",
            transform: "skewX(-20deg)",
          }}
        />
      </div>
      {hand > 0 ? (
        <TapIcon
          size={92}
          style={{
            position: "absolute",
            right: 70,
            top: 44 + (1 - hand) * 80,
            opacity: hand,
            filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.3))",
          }}
        />
      ) : null}
    </div>
  );
};
