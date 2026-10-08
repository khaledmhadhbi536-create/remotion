import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { PHONE } from "../config";
import { P } from "../presentation/Overlays";
import { bodyFont, brandFont, displayFont } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const env = (frame: number, a: number, b: number, len = 8) =>
  interpolate(frame, [a, a + len, b - len, b], [0, 1, 1, 0], clamp);

const springy = Easing.bezier(0.2, 1.4, 0.4, 1);

const Leaf: React.FC<{ readonly size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M20 3C10 3 4 8.5 4 15c0 2 .6 3.6 1.6 4.9C7 13 12 9 17 7c-4.5 3-8 7-9.6 13.3C8.6 20.8 10 21 11.5 21 18 21 21 14 20 3z"
      fill={P.green}
    />
  </svg>
);

// ---------- AURA BIO wordmark: on screen for the whole video (top centre) ----------
export const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 54,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: interpolate(frame, [0, 10], [0, 1], clamp),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 36px 12px 26px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.92)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        }}
      >
        <Leaf size={58} />
        <div
          style={{
            fontFamily: brandFont,
            fontWeight: 800,
            fontSize: 58,
            letterSpacing: 1,
            color: P.greenDeep,
          }}
        >
          aura bio
        </div>
      </div>
    </div>
  );
};

const PhoneIcon: React.FC<{
  readonly size: number;
  readonly color: string;
}> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"
      fill={color}
    />
  </svg>
);

// ---------- Order line: on screen for the whole video, above the Reels/TikTok UI ----------
export const PhoneBadge: React.FC<{ readonly hidden?: boolean }> = ({
  hidden,
}) => {
  const frame = useCurrentFrame();
  if (hidden) return null;
  // Gentle attention pulse every 4 seconds
  const pulse =
    1 + 0.06 * Math.max(0, Math.sin(((frame % 120) / 12) * Math.PI));
  return (
    <div
      style={{
        position: "absolute",
        bottom: 330,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: interpolate(frame, [0, 10], [0, 1], clamp),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "6px 34px 10px",
          borderRadius: 999,
          background: P.green,
          border: `4px solid ${P.white}`,
          boxShadow: "0 10px 28px rgba(0,0,0,0.4)",
          scale: String(frame % 120 < 12 ? pulse : 1),
        }}
      >
        <PhoneIcon size={46} color={P.white} />
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 56,
            color: P.white,
            direction: "ltr",
            letterSpacing: 1,
          }}
        >
          {PHONE}
        </div>
      </div>
    </div>
  );
};

// ---------- Hook (first seconds) ----------
export const Hook: React.FC<{ readonly end: number }> = ({ end }) => {
  const frame = useCurrentFrame();
  const o = env(frame, 0, end, 6);
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 200, opacity: o }}>
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 104,
          lineHeight: 1.05,
          color: P.white,
          background: P.red,
          padding: "10px 44px 26px",
          borderRadius: 26,
          direction: "rtl",
          rotate: "-3deg",
          boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
          scale: String(
            interpolate(frame, [0, 8], [1.9, 1], { ...clamp, easing: springy }),
          ),
        }}
      >
        كيفاش تستعمل الباك؟
      </div>
      <div
        style={{
          marginTop: 28,
          fontFamily: displayFont,
          fontSize: 84,
          color: P.greenDeep,
          background: P.yellow,
          padding: "4px 38px 18px",
          borderRadius: 22,
          direction: "rtl",
          rotate: "2deg",
          boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
          opacity: interpolate(frame, [12, 16], [0, 1], clamp),
          scale: String(
            interpolate(frame, [12, 20], [1.8, 1], {
              ...clamp,
              easing: springy,
            }),
          ),
        }}
      >
        خطوة بخطوة
      </div>
    </AbsoluteFill>
  );
};

// ---------- Mixing steps: 1 spoon of sidr + water → mix ----------
export const Steps: React.FC<{
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
        left: 50,
        right: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 14,
        direction: "rtl",
        opacity: o,
      }}
    >
      {items.map((it, i) => {
        const at = from + i * step;
        return (
          <React.Fragment key={it}>
            {i > 0 ? (
              <div
                style={{
                  fontFamily: displayFont,
                  fontSize: 70,
                  color: P.yellow,
                  WebkitTextStroke: "8px #000",
                  paintOrder: "stroke fill",
                  opacity: interpolate(frame, [at - 2, at + 2], [0, 1], clamp),
                }}
              >
                ←
              </div>
            ) : null}
            <div
              style={{
                fontFamily: bodyFont,
                fontWeight: 900,
                fontSize: 50,
                color: P.greenDeep,
                background: P.white,
                padding: "8px 26px 14px",
                borderRadius: 24,
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
              {it}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ---------- Promo banner: 5 pieces for 49 DT ----------
export const Promo: React.FC<{
  readonly from: number;
  readonly to: number;
}> = ({ from, to }) => {
  const frame = useCurrentFrame();
  const o = env(frame, from, to, 6);
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 190, opacity: o }}>
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 100,
          color: P.white,
          background: P.red,
          padding: "6px 50px 24px",
          borderRadius: 28,
          direction: "rtl",
          rotate: `${-3 + Math.sin(frame / 4) * 1.2}deg`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
          scale: String(
            interpolate(frame, [from, from + 9], [2, 1], {
              ...clamp,
              easing: springy,
            }),
          ),
        }}
      >
        5 قطع في باك واحد
      </div>
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
              easing: springy,
            }),
          ),
        }}
      >
        49 د.ت
      </div>
    </AbsoluteFill>
  );
};

// ---------- Quick white flash on hard cuts between topics ----------
export const Flash: React.FC<{ readonly at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at - 1, at, at + 6], [0, 0.55, 0], clamp);
  if (o <= 0) return null;
  return <AbsoluteFill style={{ background: P.white, opacity: o }} />;
};

// ---------- End card: pack + price + CTA button with a bouncing arrow ----------
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = (at: number) => ({
    opacity: interpolate(frame, [at, at + 4], [0, 1], clamp),
    scale: String(
      interpolate(frame, [at, at + 10], [0.5, 1], {
        ...clamp,
        easing: Easing.bezier(0.3, 1.6, 0.5, 1),
      }),
    ),
  });
  const bounce =
    Math.abs(Math.sin((Math.max(0, frame - 30) / 14) * Math.PI)) * 34;
  const ctaPulse =
    1 + 0.05 * Math.max(0, Math.sin(((frame - 40) / 15) * Math.PI));
  return (
    <AbsoluteFill style={{ backgroundColor: P.greenDeep }}>
      <Img
        src={staticFile("footage/ugc-endcard.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(6px) brightness(0.45)",
          scale: String(interpolate(frame, [0, 120], [1.08, 1.18])),
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          direction: "rtl",
          gap: 28,
          padding: "0 70px",
        }}
      >
        <div
          style={{ ...pop(2), display: "flex", alignItems: "center", gap: 16 }}
        >
          <Leaf size={80} />
          <div
            style={{
              fontFamily: brandFont,
              fontWeight: 800,
              fontSize: 92,
              color: P.white,
              direction: "ltr",
            }}
          >
            aura bio
          </div>
        </div>
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 84,
            lineHeight: 1.15,
            color: P.white,
            textAlign: "center",
            ...pop(8),
          }}
        >
          باك تطويل الشعر 5 في 1
        </div>
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 140,
            color: P.greenDeep,
            background: P.yellow,
            padding: "0 54px 18px",
            borderRadius: 28,
            ...pop(16),
          }}
        >
          49 د.ت
        </div>
        {/* Bouncing arrow pointing at the CTA */}
        <svg
          width="150"
          height="150"
          viewBox="0 0 100 100"
          style={{
            ...pop(26),
            translate: `0px ${bounce}px`,
            filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.5))",
          }}
        >
          <path
            d="M50 92 L14 52 H36 V8 H64 V52 H86 Z"
            fill={P.yellow}
            stroke={P.greenDeep}
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </svg>
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 100,
            color: P.white,
            background: P.red,
            padding: "6px 64px 26px",
            borderRadius: 999,
            boxShadow: "0 16px 0 #9E1F2A, 0 26px 50px rgba(0,0,0,0.45)",
            ...pop(32),
            scale: String(
              interpolate(frame, [32, 42], [0.5, 1], {
                ...clamp,
                easing: Easing.bezier(0.3, 1.6, 0.5, 1),
              }) * ctaPulse,
            ),
          }}
        >
          اطلب توّا
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginTop: 18,
            padding: "6px 40px 12px",
            borderRadius: 999,
            background: P.white,
            ...pop(42),
          }}
        >
          <PhoneIcon size={60} color={P.green} />
          <div
            style={{
              fontFamily: bodyFont,
              fontWeight: 900,
              fontSize: 76,
              color: P.greenDeep,
              direction: "ltr",
            }}
          >
            {PHONE}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
