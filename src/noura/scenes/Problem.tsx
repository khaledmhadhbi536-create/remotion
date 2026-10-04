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
import { Chip } from "../components/Chip";
import { HairVisual } from "../components/HairVisual";
import { CrossIcon } from "../components/Icons";
import { MediaSlot } from "../components/MediaSlot";
import { ASSETS, COLORS, COPY } from "../config";
import { SHADOW } from "../theme";
import { BEATS } from "../timing";

// 3–8s · PROBLEM — the daily frustration.
// A comb goes down the hair and SNAGS (everyone has lived it), while the three
// pain points stack up as ❌ chips. Then the emotional punch line.
export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const beats = BEATS.problem;
  const punchIn = spring({
    frame: frame - beats.punch,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.brownDeep, overflow: "hidden" }}
    >
      <MediaSlot
        image={ASSETS.images.problemModel}
        video={ASSETS.videos.problemModel}
        zoom={[1.06, 1.16]}
      >
        <AbsoluteFill style={{ filter: "saturate(0.75) brightness(0.95)" }}>
          <AbsoluteFill style={{ transform: "rotate(8deg) scale(1.3)" }}>
            <HairVisual
              id="problem"
              health={0}
              width={width}
              height={height}
              strands={150}
            />
          </AbsoluteFill>
        </AbsoluteFill>
        {ASSETS.images.problemModel ? null : <Comb startAt={beats.comb} />}
      </MediaSlot>
      <Vignette strength={0.6} />
      {/* Darken the reading side (right, RTL) and the whole frame for the punch line */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(270deg, rgba(20,12,6,0.6) 0%, rgba(20,12,6,0.1) 70%)",
        }}
      />
      <AbsoluteFill
        style={{ background: "rgba(20,12,6,0.55)", opacity: punchIn }}
      />

      {/* Pain points, right-aligned (Arabic reading side) */}
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 250,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 30,
          opacity: 1 - punchIn,
          transform: `translateX(${punchIn * 60}px)`,
          filter: punchIn > 0 ? `blur(${punchIn * 10}px)` : undefined,
        }}
      >
        {COPY.problem.items.map((item, i) => (
          <Chip
            key={item}
            label={item}
            sub={COPY.problem.itemsFr[i]}
            delay={beats.items[i]}
            icon={<CrossIcon size={50} />}
            size={58}
          />
        ))}
      </div>

      {/* Punch line */}
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", padding: 120 }}
      >
        <AnimatedText
          text={COPY.problem.punch}
          delay={beats.punch + 4}
          size={84}
          weight={900}
          color={COLORS.white}
          stagger={3}
          style={{ textShadow: SHADOW.text, maxWidth: 840 }}
        />
      </AbsoluteFill>
      <Grain opacity={0.12} />
    </AbsoluteFill>
  );
};

// Tortoiseshell comb that slides down the lock, catches on a knot and jerks.
const Comb: React.FC<{ readonly startAt: number }> = ({ startAt }) => {
  const frame = useCurrentFrame();
  const t = frame - startAt;
  const down = interpolate(
    t,
    [0, 26, 40, 46, 60, 66],
    [-260, 330, 380, 360, 400, 385],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  // Snag: shake when the comb hits the knot
  const snag =
    t > 26 && t < 70 ? Math.sin(t * 2.2) * 7 * (1 - (t - 26) / 44) : 0;
  const tilt = interpolate(t, [26, 40, 66], [0, -9, -4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: down,
        transform: `translateX(${snag}px) rotate(${tilt}deg)`,
        filter: "drop-shadow(0 18px 18px rgba(0,0,0,0.45))",
      }}
    >
      <svg width={420} height={130} viewBox="0 0 420 130">
        <defs>
          <linearGradient id="comb-tortoise" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#C58A4E" />
            <stop offset="0.35" stopColor="#6B3C1C" />
            <stop offset="0.6" stopColor="#A86A35" />
            <stop offset="1" stopColor="#3E200D" />
          </linearGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width="420"
          height="44"
          rx="14"
          fill="url(#comb-tortoise)"
        />
        {new Array(26).fill(0).map((_, i) => (
          <rect
            key={i}
            x={10 + i * 15.6}
            y="36"
            width="8"
            height={i < 12 ? 90 : 76}
            rx="4"
            fill="url(#comb-tortoise)"
          />
        ))}
        <rect
          x="14"
          y="8"
          width="380"
          height="6"
          rx="3"
          fill="#fff"
          opacity={0.25}
        />
      </svg>
    </div>
  );
};
