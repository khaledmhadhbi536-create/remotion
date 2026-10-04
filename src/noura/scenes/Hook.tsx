import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { Grain, Vignette } from "../components/Background";
import { HairVisual } from "../components/HairVisual";
import { MediaSlot } from "../components/MediaSlot";
import { ASSETS, COLORS, COPY } from "../config";
import { SHADOW } from "../theme";
import { BEATS } from "../timing";

// 0–3s · HOOK — stop the scroll.
// Extreme close-up of dry, frizzy hair that PUNCHES in on frame 0 (pattern interrupt),
// with the question the target asks herself every morning, on screen from frame 2.
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const beats = BEATS.hook;

  // Punch-in: starts zoomed and slams back with a short shake
  const punch = spring({ frame, fps, config: { damping: 14, stiffness: 160 } });
  const scale = interpolate(punch, [0, 1], [1.4, 1.06]);
  const shake = frame < 8 ? Math.sin(frame * 2.7) * (8 - frame) * 1.4 : 0;
  const underline = spring({
    frame: frame - beats.line1 - 8,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.brownDeep, overflow: "hidden" }}
    >
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${shake}px, ${shake * 0.6}px)`,
        }}
      >
        <MediaSlot
          image={ASSETS.images.hookHair}
          video={ASSETS.videos.hookHair}
          zoom={[1, 1.08]}
        >
          {/* Lock of hair on a diagonal: more dynamic than a straight curtain */}
          <AbsoluteFill style={{ transform: "rotate(-14deg) scale(1.45)" }}>
            <HairVisual
              id="hook"
              health={0}
              width={width}
              height={height}
              strands={170}
            />
          </AbsoluteFill>
        </MediaSlot>
      </AbsoluteFill>
      <Vignette strength={0.7} />
      {/* Readability band behind the text */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(20,12,6,0) 25%, rgba(20,12,6,0.55) 45%, rgba(20,12,6,0.55) 65%, rgba(20,12,6,0) 85%)",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 110,
          gap: 18,
        }}
      >
        <AnimatedText
          text={COPY.hook.line1}
          delay={beats.line1}
          size={108}
          weight={900}
          color={COLORS.white}
          stagger={2}
          style={{ textShadow: SHADOW.text }}
        >
          <span style={{ fontSize: 96, marginInlineStart: 6 }}>
            {COPY.hook.emoji}
          </span>
        </AnimatedText>
        <div
          style={{
            width: 520 * underline,
            height: 6,
            borderRadius: 3,
            background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
          }}
        />
        <AnimatedText
          text={COPY.hook.line2}
          delay={beats.line2}
          size={78}
          weight={800}
          color={COLORS.goldLight}
          style={{ textShadow: SHADOW.text }}
        />
      </AbsoluteFill>
      <Grain opacity={0.12} />
    </AbsoluteFill>
  );
};
