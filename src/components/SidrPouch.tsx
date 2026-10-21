import React from "react";
import { Img, staticFile } from "remotion";
import { bodyFont, brandFont } from "../theme";

// Aura Bio sidr pouch, restyled like a retail kraft pack: cream label,
// green powder window, a bowl of powder and jujube leaves next to it.
// Built on the real kraft pouch cut-out (public/products/sidr-powder.png).

const POUCH_RATIO = 384 / 612;
const LABEL_GREEN = "#2E6B34";

const Powder: React.FC<{ readonly id: string; readonly base: string }> = ({
  id,
  base,
}) => (
  <defs>
    <filter id={id} x="0" y="0" width="100%" height="100%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.75"
        numOctaves="2"
        seed="7"
        result="n"
      />
      <feColorMatrix
        in="n"
        type="matrix"
        values="0 0 0 0 0.18  0 0 0 0 0.22  0 0 0 0 0.05  0 0 0 0.9 0"
        result="grain"
      />
      <feFlood floodColor={base} result="base" />
      <feComposite in="grain" in2="base" operator="over" result="tex" />
      <feComposite in="tex" in2="SourceAlpha" operator="in" />
    </filter>
  </defs>
);

const Leaf: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly s: number;
}> = ({ x, y, r, s }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path
      d="M0 0 C 18 -22, 58 -24, 80 0 C 58 24, 18 22, 0 0 Z"
      fill="url(#leafGrad)"
    />
    <path d="M2 0 L 76 0" stroke="#9CC27A" strokeWidth="1.6" opacity="0.8" />
  </g>
);

export const SidrPouch: React.FC<{
  readonly height: number;
  readonly withBowl?: boolean;
  readonly style?: React.CSSProperties;
}> = ({ height, withBowl = true, style }) => {
  const w = height * POUCH_RATIO;
  const u = height / 612; // pouch pixel unit
  return (
    <div
      style={{
        position: "relative",
        width: withBowl ? w * 1.55 : w,
        height,
        ...style,
      }}
    >
      {/* leaves behind the pouch */}
      {withBowl ? (
        <svg
          width={w * 0.9}
          height={height * 0.7}
          viewBox="0 0 200 300"
          style={{
            position: "absolute",
            left: w * 0.75,
            top: height * 0.02,
            transform: "scaleX(-1)",
          }}
        >
          <defs>
            <linearGradient id="leafGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#5FA046" />
              <stop offset="1" stopColor="#2F6B26" />
            </linearGradient>
          </defs>
          <path
            d="M150 290 C 130 220, 120 140, 140 30"
            stroke="#5B4A2A"
            strokeWidth="3"
            fill="none"
          />
          <Leaf x={135} y={60} r={-150} s={0.9} />
          <Leaf x={132} y={110} r={-160} s={1} />
          <Leaf x={128} y={165} r={-165} s={1.05} />
          <Leaf x={130} y={220} r={-170} s={1} />
          <Leaf x={140} y={40} r={-120} s={0.7} />
        </svg>
      ) : null}

      {/* pouch */}
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height }}>
        <Img
          src={staticFile("products/sidr-powder.png")}
          style={{
            width: w,
            height,
            filter: "drop-shadow(0 10px 18px rgba(60,40,10,0.28))",
          }}
        />
        {/* cream label */}
        <div
          style={{
            position: "absolute",
            left: 34 * u,
            right: 34 * u,
            top: 105 * u,
            height: 285 * u,
            background: "linear-gradient(180deg, #FFFDF6, #F4EEDD)",
            borderRadius: 6 * u,
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 14 * u,
          }}
        >
          <div
            style={{
              background: LABEL_GREEN,
              color: "#fff",
              fontFamily: brandFont,
              fontWeight: 800,
              fontSize: 22 * u,
              padding: `${4 * u}px ${12 * u}px`,
              borderRadius: 4 * u,
              letterSpacing: 2 * u,
            }}
          >
            AURA BIO
          </div>
          <div
            style={{
              marginTop: 10 * u,
              fontFamily: brandFont,
              fontWeight: 800,
              fontSize: 26 * u,
              lineHeight: 1,
              color: LABEL_GREEN,
            }}
          >
            POUDRE DE
          </div>
          <div
            style={{
              fontFamily: brandFont,
              fontWeight: 900,
              fontSize: 62 * u,
              lineHeight: 1,
              color: LABEL_GREEN,
            }}
          >
            SIDR
          </div>
          <div
            style={{
              marginTop: 4 * u,
              fontFamily: bodyFont,
              fontWeight: 900,
              fontSize: 26 * u,
              color: "#5A4A2A",
              direction: "rtl",
            }}
          >
            سدر طبيعي 100%
          </div>
          <div
            style={{
              marginTop: 6 * u,
              display: "flex",
              gap: 10 * u,
              fontFamily: bodyFont,
              fontWeight: 800,
              fontSize: 13 * u,
              lineHeight: 1.15,
              color: LABEL_GREEN,
              textAlign: "center",
            }}
          >
            <span>SHAMPOING<br />VÉGÉTAL</span>
            <span style={{ borderLeft: `1px solid ${LABEL_GREEN}`, borderRight: `1px solid ${LABEL_GREEN}`, padding: `0 ${8 * u}px` }}>
              CUIR<br />CHEVELU
            </span>
            <span>ANTI<br />PELLICULES</span>
          </div>
        </div>
        {/* green powder window */}
        <svg
          width={w - 68 * u}
          height={110 * u}
          style={{ position: "absolute", left: 34 * u, top: 400 * u }}
        >
          <Powder id="sidrWindow" base="#7E9A3E" />
          <rect
            width="100%"
            height="100%"
            rx={4 * u}
            fill="#000"
            filter="url(#sidrWindow)"
          />
          <rect
            width="100%"
            height="100%"
            rx={4 * u}
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth={2}
          />
        </svg>
      </div>

      {/* bowl of powder */}
      {withBowl ? (
        <svg
          width={w * 0.95}
          height={w * 0.62}
          viewBox="0 0 300 196"
          style={{ position: "absolute", left: w * 0.78, top: height - w * 0.42 }}
        >
          <Powder id="sidrBowl" base="#9DB856" />
          <defs>
            <linearGradient id="bowlGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#B06A3A" />
              <stop offset="1" stopColor="#6E3A1C" />
            </linearGradient>
            <radialGradient id="moundShade" cx="0.4" cy="0.2" r="0.8">
              <stop offset="0" stopColor="rgba(255,255,220,0.25)" />
              <stop offset="0.6" stopColor="rgba(0,0,0,0)" />
              <stop offset="1" stopColor="rgba(30,40,10,0.35)" />
            </radialGradient>
            <radialGradient id="bowlShadow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="rgba(60,35,10,0.35)" />
              <stop offset="1" stopColor="rgba(60,35,10,0)" />
            </radialGradient>
          </defs>
          <ellipse cx="150" cy="180" rx="130" ry="16" fill="url(#bowlShadow)" />
          {/* little spilled pile */}
          <path
            d="M10 182 C 30 160, 60 158, 90 182 Z"
            fill="#000"
            filter="url(#sidrBowl)"
          />
          {/* powder mound */}
          <path
            d="M46 92 C 70 4, 230 4, 254 92 Z"
            fill="#000"
            filter="url(#sidrBowl)"
          />
          <path
            d="M46 92 C 70 4, 230 4, 254 92 Z"
            fill="url(#moundShade)"
          />
          {/* bowl body */}
          <path
            d="M40 90 C 50 160, 110 178, 150 178 C 190 178, 250 160, 260 90 Z"
            fill="url(#bowlGrad)"
          />
          <ellipse
            cx="150"
            cy="90"
            rx="110"
            ry="12"
            fill="none"
            stroke="#C98552"
            strokeWidth="5"
          />
          <path
            d="M70 110 C 80 140, 100 155, 120 160"
            stroke="rgba(255,220,180,0.35)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      ) : null}
    </div>
  );
};
