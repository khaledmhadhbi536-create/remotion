import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

// Product cut-out composite: the real AURA BIO sidr pouch with a wooden bowl of green sidr
// powder and a few sidr leaves in front, so the content of the pouch is visible (layout idea
// from a sidr pack shot the user shared). Rendered once to public/products/sidr-bowl.png:
// npx remotion still Asset-SidrBowl public/products/sidr-bowl.png --image-format=png
export const SIDR_BOWL_SIZE = { width: 600, height: 640 };

const Leaf: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly s?: number;
  readonly c?: string;
}> = ({ x, y, r, s = 1, c = "#4E8A2E" }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M0 0 C 14 -22, 50 -26, 70 0 C 50 26, 14 22, 0 0 Z" fill={c} />
    <path d="M2 0 L 66 0" stroke="rgba(255,255,255,0.35)" strokeWidth={2.5} />
  </g>
);

export const SidrBowl: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "transparent" }}>
    <Img
      src={staticFile("products/sidr-powder.png")}
      style={{ position: "absolute", right: 0, top: 0, height: 560 }}
    />
    <svg
      width={380}
      height={260}
      viewBox="0 0 380 260"
      style={{ position: "absolute", left: 0, bottom: 0 }}
    >
      <defs>
        <radialGradient id="powder" cx="45%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#A9BC55" />
          <stop offset="60%" stopColor="#7E9638" />
          <stop offset="100%" stopColor="#5E7226" />
        </radialGradient>
        <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B07A45" />
          <stop offset="55%" stopColor="#8A5728" />
          <stop offset="100%" stopColor="#5E3815" />
        </linearGradient>
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            seed={3}
          />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.25 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      {/* Leaves behind the bowl */}
      <Leaf x={250} y={90} r={-35} s={1.3} />
      <Leaf x={270} y={110} r={-5} s={1.15} c="#5E9B38" />
      <Leaf x={40} y={100} r={-150} s={1.2} c="#3F7A26" />
      <Leaf x={70} y={70} r={-120} s={1} c="#5E9B38" />
      {/* Soft contact shadow */}
      <ellipse cx={190} cy={244} rx={160} ry={14} fill="rgba(0,0,0,0.25)" />
      {/* Bowl body */}
      <path
        d="M30 120 Q 40 240, 190 242 Q 340 240, 350 120 Z"
        fill="url(#wood)"
      />
      <path
        d="M60 160 Q 190 200, 320 160"
        stroke="rgba(255,220,170,0.18)"
        strokeWidth={6}
        fill="none"
      />
      {/* Rim and powder mound */}
      <ellipse cx={190} cy={120} rx={160} ry={34} fill="#6B4120" />
      <ellipse cx={190} cy={118} rx={148} ry={28} fill="url(#powder)" />
      <path
        d="M58 118 Q 190 40, 322 118 Q 190 146, 58 118 Z"
        fill="url(#powder)"
      />
      <path
        d="M58 118 Q 190 40, 322 118 Q 190 146, 58 118 Z"
        filter="url(#grain)"
        fill="#7E9638"
      />
      {/* Leaves resting in front */}
      <Leaf x={300} y={200} r={20} s={0.9} />
      <Leaf x={20} y={215} r={-10} s={0.8} c="#5E9B38" />
    </svg>
  </AbsoluteFill>
);
