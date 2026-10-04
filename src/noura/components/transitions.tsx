import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { COLORS } from "../config";

// Two custom scene transitions, both short (10 frames) and soft:
//  - zoomBlur : the outgoing scene pushes in and blurs out while the next one settles
//               from a slight zoom — energetic but clean (hook → problem, proof → CTA)
//  - lightFlash : a warm ivory flash, like a studio light switching on (problem → reveal)

type Empty = Record<string, never>;

const ZoomBlur: React.FC<TransitionPresentationComponentProps<Empty>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const entering = presentationDirection === "entering";
  const scale = entering
    ? interpolate(p, [0, 1], [1.12, 1])
    : interpolate(p, [0, 1], [1, 1.25]);
  const blur = entering
    ? interpolate(p, [0, 1], [14, 0])
    : interpolate(p, [0, 1], [0, 18]);
  const opacity = entering
    ? interpolate(p, [0, 0.6], [0, 1], { extrapolateRight: "clamp" })
    : 1;
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const zoomBlur = (): TransitionPresentation<Empty> => ({
  component: ZoomBlur,
  props: {},
});

const LightFlash: React.FC<TransitionPresentationComponentProps<Empty>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const entering = presentationDirection === "entering";
  // Outgoing scene stays, a flash peaks at the middle, the next scene appears under it
  const flash = entering ? interpolate(p, [0, 0.5, 1], [0, 1, 0]) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: entering ? (p > 0.5 ? 1 : 0) : 1 }}>
        {children}
      </AbsoluteFill>
      {entering ? (
        <AbsoluteFill style={{ background: COLORS.ivory, opacity: flash }} />
      ) : null}
    </AbsoluteFill>
  );
};

export const lightFlash = (): TransitionPresentation<Empty> => ({
  component: LightFlash,
  props: {},
});
