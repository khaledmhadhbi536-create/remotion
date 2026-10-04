import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { LightRays, TilePattern } from "../components/Decor";
import { ProductImage, type ProductKey } from "../components/ProductImage";
import { PACK_PIECES, PRICES, VALUE_TOTAL } from "../config";
import { bodyFont, colors, displayFont } from "../theme";

// 0–4s · OFFER HOOK — lead with the deal: flash, stamp, 5 products burst in, giant price.
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const overshoot = Easing.bezier(0.2, 1.5, 0.4, 1);

// Product burst: [product, height, x-centre, start frame]
const BURST: [ProductKey, number, number, number][] = [
  ["rosemaryOil", 340, 150, 8],
  ["bottlePink", 380, 320, 11],
  ["dermaRoller", 220, 545, 6],
  ["sidr", 320, 780, 14],
  ["brushPink", 200, 955, 17],
];

export const OfferHookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [0, 6], [1, 0], clamp);
  // Hard shake on the price slam
  const shake = interpolate(frame, [24, 26, 34], [0, 16, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 42%, ${colors.rose} 0%, ${colors.roseDeep} 45%, ${colors.plum} 100%)`,
        overflow: "hidden",
        translate: `${Math.sin(frame * 3.3) * shake}px ${Math.cos(frame * 2.9) * shake}px`,
      }}
    >
      <TilePattern color="#ffffff" opacity={0.07} drift={frame * 0.6} />
      <LightRays color="rgba(255,255,255,0.22)" style={{ top: "38%" }} />

      {/* Stamp */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 54 }}>
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 104,
            lineHeight: 1,
            color: colors.white,
            background: colors.red,
            padding: "14px 56px 30px",
            borderRadius: 24,
            direction: "rtl",
            rotate: "-3deg",
            boxShadow: "0 18px 40px rgba(0,0,0,0.4)",
            scale: interpolate(frame, [2, 10], [2.6, 1], {
              ...clamp,
              easing: overshoot,
              output: "perceptual-scale",
            }),
            opacity: interpolate(frame, [2, 5], [0, 1], clamp),
          }}
        >
          عرض استثنائي!
        </div>
      </AbsoluteFill>

      {/* 5 products burst out of the centre */}
      {BURST.map(([product, height, x, at]) => (
        <div
          key={product}
          style={{
            position: "absolute",
            left: x,
            top: 600,
            translate: "-50% -100%",
          }}
        >
          <ProductImage
            product={product}
            height={height}
            style={{
              opacity: interpolate(frame, [at, at + 3], [0, 1], clamp),
              translate: interpolate(
                frame,
                [at, at + 12],
                [`${(540 - x) * 0.9}px 120px`, "0px 0px"],
                {
                  ...clamp,
                  easing: overshoot,
                },
              ),
              scale: interpolate(frame, [at, at + 12], [0.2, 1], {
                ...clamp,
                easing: overshoot,
                output: "perceptual-scale",
              }),
              rotate: `${Math.sin((frame + at * 7) / 14) * 3}deg`,
            }}
          />
        </div>
      ))}

      {/* Price block */}
      <AbsoluteFill
        style={{ alignItems: "center", paddingTop: 625, direction: "rtl" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            opacity: interpolate(frame, [24, 27], [0, 1], clamp),
            scale: interpolate(frame, [24, 34], [2.2, 1], {
              ...clamp,
              easing: overshoot,
              output: "perceptual-scale",
            }),
          }}
        >
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 88,
              color: colors.white,
              textShadow: "0 10px 30px rgba(0,0,0,0.4)",
            }}
          >
            {PACK_PIECES} قطع بـ
          </div>
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 160,
              lineHeight: 1,
              color: colors.plum,
              background: colors.goldLight,
              padding: "0 40px 26px",
              borderRadius: 30,
              boxShadow: "0 18px 0 #9C7020, 0 30px 50px rgba(0,0,0,0.4)",
              scale: String(
                1 + 0.04 * Math.max(0, Math.sin(((frame - 40) / 15) * Math.PI)),
              ),
            }}
          >
            {PRICES.pack} د.ت
          </div>
        </div>

        {/* Crossed-out value */}
        <div
          style={{
            position: "relative",
            marginTop: 44,
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 56,
            color: "rgba(255,255,255,0.85)",
            opacity: interpolate(frame, [40, 44], [0, 1], clamp),
          }}
        >
          بلاصة {VALUE_TOTAL} د.ت
          <div
            style={{
              position: "absolute",
              right: -6,
              top: "50%",
              height: 8,
              borderRadius: 4,
              background: colors.goldLight,
              rotate: "-5deg",
              width: `${interpolate(frame, [44, 52], [0, 104], clamp)}%`,
            }}
          />
        </div>

        <div
          style={{
            marginTop: 22,
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 44,
            color: colors.white,
            background: "rgba(0,0,0,0.35)",
            border: `3px solid ${colors.goldLight}`,
            padding: "4px 30px 10px",
            borderRadius: 999,
            opacity:
              interpolate(frame, [62, 66], [0, 1], clamp) *
              (0.75 + 0.25 * Math.abs(Math.sin(frame / 6))),
          }}
        >
          الكمية محدودة • توصيل مجاني
        </div>
      </AbsoluteFill>

      {/* Opening white flash */}
      <AbsoluteFill style={{ backgroundColor: "white", opacity: flash }} />
    </AbsoluteFill>
  );
};
