import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { LightRays, TilePattern } from "../components/Decor";
import { PackGroup } from "../components/ProductImage";
import { PRICES, STORE_NAME, VALUE_TOTAL, WEBSITE } from "../config";
import { bodyFont, brandFont, colors, displayFont } from "../theme";

// 24–30s · OFFER + CTA — price anchor, Tunisian e-commerce reassurances
// (free delivery to all governorates + cash on delivery), then a clear "order now".
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const OrderButton: React.FC<{ readonly at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: displayFont,
        fontSize: 78,
        color: colors.charcoal,
        background: `linear-gradient(180deg, ${colors.goldLight} 0%, ${colors.gold} 100%)`,
        padding: "10px 64px 22px",
        borderRadius: 999,
        direction: "rtl",
        boxShadow: "0 16px 0 #9C7020, 0 26px 40px rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        gap: 24,
        opacity: interpolate(frame, [at, at + 5], [0, 1], clamp),
        scale:
          interpolate(frame, [at, at + 12], [0.4, 1], {
            ...clamp,
            easing: Easing.bezier(0.3, 1.7, 0.5, 1),
            output: "perceptual-scale",
          }) *
          (1 + 0.05 * Math.max(0, Math.sin(((frame - at) / 15) * Math.PI))),
      }}
    >
      اطلب توّا
      <svg
        width="60"
        height="60"
        viewBox="0 0 10 10"
        style={{ rotate: "90deg" }}
      >
        <path
          d="M2 5 L8 5 M5 2 L8 5 L5 8"
          stroke={colors.charcoal}
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const Perk: React.FC<{
  readonly at: number;
  readonly children: React.ReactNode;
}> = ({ at, children }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        direction: "rtl",
        fontFamily: bodyFont,
        fontWeight: 900,
        fontSize: 42,
        color: colors.white,
        whiteSpace: "nowrap",
        opacity: interpolate(frame, [at, at + 5], [0, 1], clamp),
        translate: interpolate(frame, [at, at + 10], ["80px 0px", "0px 0px"], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <svg width="50" height="50" viewBox="0 0 10 10">
        <circle cx="5" cy="5" r="5" fill={colors.goldLight} />
        <path
          d="M2.6 5.2 L4.3 6.8 L7.4 3.6"
          stroke={colors.charcoal}
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </div>
  );
};

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  // Final hit of the music (28s) → end card
  const END = 126;
  const offerOut = interpolate(frame, [END, END + 8], [1, 0], clamp);
  const endIn = interpolate(frame, [END, END + 10], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 30% 40%, ${colors.bronze} 0%, ${colors.bronzeDeep} 45%, ${colors.charcoal} 100%)`,
        overflow: "hidden",
      }}
    >
      <TilePattern color="#ffffff" opacity={0.08} drift={frame * 0.5} />

      {/* ---------- Offer ---------- */}
      <AbsoluteFill style={{ opacity: offerOut }}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 70 }}>
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 84,
              color: colors.charcoal,
              background: colors.white,
              padding: "4px 50px 16px",
              borderRadius: 18,
              direction: "rtl",
              rotate: "-2deg",
              boxShadow: "0 14px 30px rgba(0,0,0,0.3)",
              scale: interpolate(frame, [6, 16], [1.8, 1], {
                ...clamp,
                easing: Easing.bezier(0.2, 1.4, 0.4, 1),
                output: "perceptual-scale",
              }),
              opacity: interpolate(frame, [6, 9], [0, 1], clamp),
            }}
          >
            عرض استثنائي!
          </div>
        </AbsoluteFill>

        <div
          style={{
            position: "absolute",
            left: 40,
            top: 230,
            width: 360,
            height: 560,
          }}
        >
          <LightRays
            color="rgba(255,255,255,0.25)"
            style={{
              width: 900,
              height: 900,
              marginLeft: -450,
              marginTop: -450,
            }}
          />
          <PackGroup
            scale={0.66}
            style={{
              position: "absolute",
              left: 0,
              top: 40,
              translate: `0px ${Math.sin(frame / 10) * 8}px`,
            }}
          />
        </div>

        {/* Price block (right side) */}
        <div
          style={{
            position: "absolute",
            right: 70,
            top: 220,
            width: 600,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            direction: "rtl",
          }}
        >
          <div
            style={{
              position: "relative",
              fontFamily: bodyFont,
              fontWeight: 800,
              fontSize: 64,
              color: "rgba(255,255,255,0.75)",
              opacity: interpolate(frame, [21, 26], [0, 1], clamp),
            }}
          >
            بلاصة {VALUE_TOTAL} د.ت
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "52%",
                height: 7,
                borderRadius: 4,
                background: colors.goldLight,
                width: `${interpolate(frame, [26, 34], [0, 100], clamp)}%`,
                rotate: "-4deg",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 210,
              lineHeight: 1,
              color: colors.white,
              textShadow: "0 12px 30px rgba(0,0,0,0.35)",
              marginTop: 10,
              opacity: interpolate(frame, [36, 39], [0, 1], clamp),
              scale: interpolate(frame, [36, 46], [2, 1], {
                ...clamp,
                easing: Easing.bezier(0.2, 1.4, 0.4, 1),
                output: "perceptual-scale",
              }),
            }}
          >
            {PRICES.pack} د.ت
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              marginTop: 30,
            }}
          >
            <Perk at={51}>الكمية محدودة</Perk>
            <Perk at={66}>الخلاص عند الاستلام</Perk>
          </div>
        </div>

        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: 80,
          }}
        >
          <OrderButton at={81} />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ---------- End card ---------- */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: endIn,
          background: colors.mist,
          clipPath: `circle(${endIn * 110}% at 50% 50%)`,
        }}
      >
        <TilePattern color={colors.bronze} opacity={0.1} drift={frame * 0.3} />
        <PackGroup
          scale={0.62}
          style={{
            scale: interpolate(frame, [END, END + 14], [0.6, 1], {
              ...clamp,
              easing: Easing.bezier(0.3, 1.5, 0.5, 1),
              output: "perceptual-scale",
            }),
          }}
        />
        <div
          style={{
            fontFamily: brandFont,
            fontWeight: 900,
            fontSize: 110,
            letterSpacing: interpolate(frame, [END, END + 30], [36, 16], {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            color: colors.charcoal,
            lineHeight: 1.1,
            marginTop: 10,
          }}
        >
          {STORE_NAME}
        </div>
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 64,
            color: colors.bronzeDeep,
            direction: "rtl",
            marginBottom: 36,
          }}
        >
          باك نموّ الشعر للرجال • 5 في 1
        </div>
        <OrderButton at={END + 6} />
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 800,
            fontSize: 44,
            color: colors.charcoal,
            marginTop: 34,
            direction: "rtl",
          }}
        >
          {WEBSITE || "ابعثلنا ميساج على الصفحة"}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
