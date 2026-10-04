import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../config";
import { GRADIENTS } from "../theme";

// Warm studio backdrop: cream radial gradient, a slow drifting light leak
// and a fine film grain so flat colours never look "digital".
export const Background: React.FC<{
  readonly variant?: "cream" | "dark";
  readonly glow?: number; // 0–1 extra golden halo behind the centre (product reveal)
  readonly children?: React.ReactNode;
}> = ({ variant = "cream", glow = 0, children }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 70) * 60;

  return (
    <AbsoluteFill
      style={{
        background: variant === "cream" ? GRADIENTS.cream : GRADIENTS.warmDark,
      }}
    >
      {/* Light leak */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(40% 35% at ${70 + drift / 20}% ${18 + drift / 30}%, ${
            variant === "cream"
              ? "rgba(255,255,255,0.75)"
              : "rgba(232,204,150,0.18)"
          } 0%, transparent 70%)`,
        }}
      />
      {/* Golden halo */}
      {glow > 0 ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(34% 34% at 50% 50%, ${COLORS.goldLight} 0%, rgba(232,204,150,0) 100%)`,
            opacity:
              glow * interpolate(Math.sin(frame / 18), [-1, 1], [0.75, 1]),
          }}
        />
      ) : null}
      {children}
      <Grain opacity={variant === "cream" ? 0.07 : 0.1} />
    </AbsoluteFill>
  );
};

export const Grain: React.FC<{ readonly opacity?: number }> = ({
  opacity = 0.08,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{ opacity, mixBlendMode: "multiply", pointerEvents: "none" }}
    >
      <svg width="100%" height="100%">
        <filter id="noura-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            // Re-seed every 2 frames: living grain, like film
            seed={Math.floor(frame / 2) % 12}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noura-grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ readonly strength?: number }> = ({
  strength = 0.55,
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(75% 75% at 50% 45%, transparent 40%, rgba(20,12,6,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);
