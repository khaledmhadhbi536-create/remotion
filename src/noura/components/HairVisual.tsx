import React, { useMemo } from "react";
import { interpolateColors, random, useCurrentFrame } from "remotion";
import { COLORS } from "../config";

// Macro shot of a lock of hair, drawn in SVG.
//   health = 0 → dry: matte, lighter, frizzy, flyaways, split ends
//   health = 1 → nourished: deep brown, smooth waves, a golden gloss band
// Interpolate `health` to show the transformation. This is the placeholder for the
// hook / before–after photos (ASSETS.images.*): it tells the same story without footage.
export const HairVisual: React.FC<{
  readonly health: number;
  readonly width: number;
  readonly height: number;
  readonly strands?: number;
  readonly id: string; // unique per instance (SVG gradient ids)
  readonly glossY?: number; // 0–1, vertical position of the gloss band (defaults to a slow drift)
}> = ({ health, width, height, strands = 140, id, glossY }) => {
  const frame = useCurrentFrame();
  const dry = 1 - health;

  const seeds = useMemo(
    () =>
      new Array(strands).fill(0).map((_, i) => ({
        x: random(`x${i}`) * 1.2 - 0.1,
        phase: random(`p${i}`) * Math.PI * 2,
        amp: 18 + random(`a${i}`) * 26,
        width: 1.4 + random(`w${i}`) ** 2 * 4.2,
        frizzAmp: 0.4 + random(`fa${i}`) * 1.2,
        freqA: 0.18 + random(`fq${i}`) * 0.25,
        freqB: 0.6 + random(`fr${i}`) * 0.5,
        shade: random(`s${i}`),
        flyaway: random(`f${i}`) < 0.22,
        broken: 0.55 + random(`b${i}`) * 0.4,
      })),
    [strands],
  );

  const base = interpolateColors(
    health,
    [0, 1],
    [COLORS.hairDry, COLORS.hairHealthy],
  );
  const light = interpolateColors(health, [0, 1], ["#C4A27E", "#7A4B2A"]);
  const dark = interpolateColors(health, [0, 1], ["#6E5136", "#1C0F07"]);
  const gloss = glossY ?? 0.35 + Math.sin(frame / 40) * 0.08;

  const strandPath = (s: (typeof seeds)[number], i: number) => {
    const pts: string[] = [];
    const x0 = s.x * width;
    const sway = Math.sin(frame / 28 + s.phase) * 6;
    const end = height + 40 - dry * (1 - s.broken) * height * 0.35; // split / broken ends when dry
    for (let y = -40; y <= end; y += 14) {
      const k = y / height;
      const wave =
        Math.sin(y / 170 + s.phase) * s.amp + Math.sin(y / 63 + i) * 4;
      // Frizz grows towards the ends and jitters slightly frame to frame
      const frizz =
        dry *
        (0.25 + k) *
        s.frizzAmp *
        (Math.sin(y * s.freqA + i * 5.3 + frame * 0.3) * 10 +
          Math.sin(y * s.freqB + s.phase * 3) * 6 +
          Math.sin(y * 0.047 + i) * 9);
      pts.push(`${(x0 + wave + sway * k + frizz).toFixed(1)},${y}`);
    }
    return `M${pts.join(" L")}`;
  };

  const flyawayPath = (s: (typeof seeds)[number], i: number) => {
    const x0 = s.x * width;
    const y0 = (0.2 + s.shade * 0.7) * height;
    const dir = s.shade > 0.5 ? 1 : -1;
    const curl = 40 + s.amp * 2;
    const wob = Math.sin(frame / 9 + i) * 6;
    return `M${x0},${y0} q${dir * curl * 0.6},${-curl * 0.5 + wob} ${dir * curl},${-curl * 0.1} t${dir * curl * 0.7},${curl * 0.4}`;
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={`${id}-mass`} x1="0" x2="1">
          <stop offset="0" stopColor={dark} />
          <stop offset="0.5" stopColor={base} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <linearGradient
          id={`${id}-gloss`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="0"
          y2={height}
        >
          <stop
            offset={Math.max(0, gloss - 0.14)}
            stopColor="#F6D9A6"
            stopOpacity={0}
          />
          <stop offset={gloss} stopColor="#FFE8BF" stopOpacity={0.95} />
          <stop
            offset={Math.min(1, gloss + 0.14)}
            stopColor="#F6D9A6"
            stopOpacity={0}
          />
        </linearGradient>
      </defs>
      <rect width={width} height={height} fill={`url(#${id}-mass)`} />
      {seeds.map((s, i) => (
        <path
          key={i}
          d={strandPath(s, i)}
          fill="none"
          stroke={s.shade < 0.33 ? dark : s.shade < 0.75 ? base : light}
          strokeWidth={s.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.55 + s.shade * 0.4}
        />
      ))}
      {/* Gloss: same strands, re-stroked with a golden band, only on healthy hair */}
      {health > 0.02
        ? seeds.map((s, i) =>
            i % 2 === 0 ? (
              <path
                key={`g${i}`}
                d={strandPath(s, i)}
                fill="none"
                stroke={`url(#${id}-gloss)`}
                strokeWidth={s.width * 0.8}
                strokeLinecap="round"
                opacity={health}
              />
            ) : null,
          )
        : null}
      {/* Flyaways / frizz halo on dry hair */}
      {dry > 0.02
        ? seeds.map((s, i) =>
            s.flyaway ? (
              <path
                key={`f${i}`}
                d={flyawayPath(s, i)}
                fill="none"
                stroke={light}
                strokeWidth={1.6}
                strokeLinecap="round"
                opacity={dry * 0.9}
              />
            ) : null,
          )
        : null}
    </svg>
  );
};
