import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { bodyFont, displayFont } from "../theme";

// Palette picked from the product boxes (green / yellow)
export const P = {
  green: "#2EAA5A",
  greenDeep: "#0E3B1F",
  yellow: "#FFE14D",
  white: "#FFFFFF",
  red: "#E63946",
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// In/out envelope for an overlay living between frames `a` and `b`
const env = (frame: number, a: number, b: number, len = 8) =>
  interpolate(frame, [a, a + len, b - len, b], [0, 1, 1, 0], clamp);

// ---------- Hook (first 2 seconds) ----------
export const Hook: React.FC<{ readonly end: number }> = ({ end }) => {
  const frame = useCurrentFrame();
  const o = env(frame, 0, end, 6);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 230, opacity: o }}>
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 120,
          lineHeight: 1.05,
          color: P.white,
          background: P.red,
          padding: "10px 46px 26px",
          borderRadius: 26,
          direction: "rtl",
          rotate: "-3deg",
          boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
          scale: String(
            interpolate(frame, [0, 8], [1.9, 1], {
              ...clamp,
              easing: Easing.bezier(0.2, 1.4, 0.4, 1),
            }),
          ),
        }}
      >
        فطريات الظوافر؟
      </div>
      <div
        style={{
          marginTop: 30,
          fontFamily: displayFont,
          fontSize: 92,
          color: P.greenDeep,
          background: P.yellow,
          padding: "4px 40px 18px",
          borderRadius: 22,
          direction: "rtl",
          rotate: "2deg",
          boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
          opacity: interpolate(frame, [12, 16], [0, 1], clamp),
          scale: String(
            interpolate(frame, [12, 20], [1.8, 1], {
              ...clamp,
              easing: Easing.bezier(0.2, 1.4, 0.4, 1),
            }),
          ),
        }}
      >
        الإكزيما؟
      </div>
    </AbsoluteFill>
  );
};

// ---------- Product name card ----------
export const ProductCard: React.FC<{
  readonly from: number;
  readonly to: number;
  readonly title: string;
  readonly subtitle: string;
}> = ({ from, to, title, subtitle }) => {
  const frame = useCurrentFrame();
  const o = env(frame, from, to);
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 170,
        right: 60,
        maxWidth: 900,
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        opacity: o,
        translate: `${interpolate(frame, [from, from + 12], [500, 0], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        })}px 0px`,
      }}
    >
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 74,
          lineHeight: 1.1,
          color: P.white,
          background: P.green,
          padding: "8px 36px 20px",
          borderRadius: "26px 26px 26px 6px",
          boxShadow: "0 16px 36px rgba(0,0,0,0.4)",
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 12,
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 44,
          color: P.greenDeep,
          background: P.yellow,
          padding: "4px 26px 10px",
          borderRadius: 16,
          boxShadow: "0 10px 24px rgba(0,0,0,0.3)",
          opacity: interpolate(frame, [from + 8, from + 14], [0, 1], clamp),
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

// ---------- Benefit chips (text taken from the box) ----------
export const BenefitChips: React.FC<{
  readonly from: number;
  readonly to: number;
  readonly items: readonly string[];
  readonly step: number;
}> = ({ from, to, items, step }) => {
  const frame = useCurrentFrame();
  const o = env(frame, from, to, 6);
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 190,
        left: 60,
        right: 60,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 18,
        direction: "rtl",
        opacity: o,
      }}
    >
      {items.map((it, i) => {
        const at = from + i * step;
        return (
          <div
            key={it}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: bodyFont,
              fontWeight: 900,
              fontSize: 52,
              color: P.greenDeep,
              background: P.white,
              padding: "8px 28px 14px",
              borderRadius: 999,
              border: `5px solid ${P.green}`,
              boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
              opacity: interpolate(frame, [at, at + 3], [0, 1], clamp),
              scale: String(
                interpolate(frame, [at, at + 8], [0.4, 1], {
                  ...clamp,
                  easing: Easing.bezier(0.3, 1.7, 0.5, 1),
                }),
              ),
            }}
          >
            <svg width="44" height="44" viewBox="0 0 10 10">
              <circle cx="5" cy="5" r="5" fill={P.green} />
              <path
                d="M2.6 5.2 L4.3 6.8 L7.4 3.6"
                stroke={P.white}
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {it}
          </div>
        );
      })}
    </div>
  );
};

// ---------- Promo banner ----------
export const PromoBanner: React.FC<{
  readonly from: number;
  readonly to: number;
  readonly price: number | null;
}> = ({ from, to, price }) => {
  const frame = useCurrentFrame();
  const o = env(frame, from, to, 6);
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 200, opacity: o }}>
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 110,
          color: P.white,
          background: P.red,
          padding: "6px 54px 24px",
          borderRadius: 28,
          direction: "rtl",
          rotate: `${-3 + Math.sin(frame / 4) * 1.2}deg`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
          scale: String(
            interpolate(frame, [from, from + 9], [2, 1], {
              ...clamp,
              easing: Easing.bezier(0.2, 1.4, 0.4, 1),
            }),
          ),
        }}
      >
        برومو على الزوز!
      </div>
      {price !== null ? (
        <div
          style={{
            marginTop: 26,
            fontFamily: displayFont,
            fontSize: 150,
            color: P.greenDeep,
            background: P.yellow,
            padding: "0 50px 20px",
            borderRadius: 28,
            direction: "rtl",
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            opacity: interpolate(frame, [from + 15, from + 18], [0, 1], clamp),
            scale: String(
              interpolate(frame, [from + 15, from + 24], [2, 1], {
                ...clamp,
                easing: Easing.bezier(0.2, 1.4, 0.4, 1),
              }),
            ),
          }}
        >
          {price} د.ت
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- Progress bar (retention cue) ----------
export const ProgressBar: React.FC<{ readonly total: number }> = ({
  total,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        height: 12,
        width: `${Math.min(100, (frame / total) * 100)}%`,
        background: `linear-gradient(270deg, ${P.yellow}, ${P.green})`,
        boxShadow: "0 0 12px rgba(255,225,77,0.6)",
      }}
    />
  );
};
