import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { LightRays, TilePattern } from "../components/Decor";
import { PackGroup, ProductImage } from "../components/ProductImage";
import { bodyFont, colors, displayFont } from "../theme";

// Opening 4s hooks for the "natural" and "gift" angles.
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const overshoot = Easing.bezier(0.2, 1.5, 0.4, 1);
export const NATURE = "#3F7A3A";

// ---------- Natural: the two AURA BIO ingredients slide in, headline lands on the beat ----------
export const NaturalHookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const slideIn = (from: string, at: number) =>
    interpolate(frame, [at, at + 14], [from, "0px 0px"], {
      ...clamp,
      easing: overshoot,
    });
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 55%, #FFFFFF 0%, #EEF2EA 50%, #CFDAC6 100%)`,
        overflow: "hidden",
      }}
    >
      <TilePattern color={NATURE} opacity={0.08} drift={frame * 0.4} />
      <LightRays color="rgba(255,255,255,0.6)" style={{ top: "62%" }} />

      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: 70,
          direction: "rtl",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 116,
            lineHeight: 1.05,
            color: colors.charcoal,
            opacity: interpolate(frame, [2, 6], [0, 1], clamp),
            scale: String(
              interpolate(frame, [2, 12], [1.8, 1], {
                ...clamp,
                easing: overshoot,
              }),
            ),
          }}
        >
          من الطبيعة
        </div>
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 96,
            lineHeight: 1.1,
            color: NATURE,
            opacity: interpolate(frame, [30, 34], [0, 1], clamp),
            scale: String(
              interpolate(frame, [30, 40], [1.8, 1], {
                ...clamp,
                easing: overshoot,
              }),
            ),
          }}
        >
          لجذور شعرك
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: 90,
          paddingBottom: 170,
        }}
      >
        <ProductImage
          product="rosemaryOil"
          height={500}
          style={{ translate: slideIn("-700px 0px", 10), rotate: "-4deg" }}
        />
        <ProductImage
          product="sidr"
          height={490}
          style={{ translate: slideIn("700px 0px", 16), rotate: "4deg" }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 60,
        }}
      >
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 48,
            color: colors.white,
            background: NATURE,
            padding: "4px 36px 12px",
            borderRadius: 999,
            direction: "rtl",
            opacity: interpolate(frame, [60, 64], [0, 1], clamp),
            scale: String(
              interpolate(frame, [60, 70], [0.5, 1], {
                ...clamp,
                easing: overshoot,
              }),
            ),
          }}
        >
          سدر بيو + زيت إكليل الجبل • بلا كيمياء
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Gift: a wrapped box drops, the lid flies off, the pack is revealed ----------
export const GiftHookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const boxDrop = interpolate(frame, [0, 12], [-700, 0], {
    ...clamp,
    easing: overshoot,
  });
  const lidOff = interpolate(frame, [36, 48], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.5, 0, 0.7, 0.4),
  });
  const reveal = interpolate(frame, [40, 54], [0, 1], {
    ...clamp,
    easing: overshoot,
  });
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(165deg, #2A1E14 0%, ${colors.charcoal} 70%)`,
        overflow: "hidden",
      }}
    >
      <TilePattern color={colors.bronze} opacity={0.08} drift={frame * 0.4} />
      <LightRays
        color="rgba(200,150,62,0.18)"
        style={{ top: "62%", opacity: reveal }}
      />

      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: 60,
          direction: "rtl",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 108,
            lineHeight: 1.08,
            color: colors.white,
            opacity: interpolate(frame, [4, 8], [0, 1], clamp),
            scale: String(
              interpolate(frame, [4, 14], [1.7, 1], {
                ...clamp,
                easing: overshoot,
              }),
            ),
          }}
        >
          أحسن هدية لراجلك
        </div>
        <div
          style={{
            marginTop: 4,
            fontFamily: displayFont,
            fontSize: 68,
            color: colors.goldLight,
            opacity: interpolate(frame, [62, 66], [0, 1], clamp),
            translate: interpolate(frame, [62, 74], ["0px 30px", "0px 0px"], {
              ...clamp,
              easing: overshoot,
            }),
          }}
        >
          و إلا لبوك و خوك
        </div>
      </AbsoluteFill>

      {/* Revealed pack */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 110,
        }}
      >
        <PackGroup
          scale={1.0}
          style={{
            opacity: reveal,
            translate: `0px ${(1 - reveal) * 160}px`,
            scale: String(0.7 + 0.3 * reveal),
          }}
        />
      </AbsoluteFill>

      {/* Box body (drops, then sinks away under the pack) */}
      <div
        style={{
          position: "absolute",
          left: 270,
          top: 520,
          width: 540,
          height: 400,
          translate: `0px ${boxDrop + reveal * 600}px`,
          borderRadius: 20,
          background: `linear-gradient(160deg, ${colors.bronze} 0%, ${colors.bronzeDeep} 100%)`,
          boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 240,
            top: 0,
            width: 60,
            height: "100%",
            background: colors.charcoal,
            opacity: 0.85,
          }}
        />
      </div>
      {/* Lid + bow (flies off) */}
      <div
        style={{
          position: "absolute",
          left: 250,
          top: 450,
          width: 580,
          height: 100,
          translate: `${lidOff * 420}px ${boxDrop - lidOff * 700}px`,
          rotate: `${lidOff * 40}deg`,
          borderRadius: 16,
          background: colors.bronze,
          boxShadow: "0 12px 24px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 260,
            top: 0,
            width: 60,
            height: "100%",
            background: colors.charcoal,
            opacity: 0.85,
          }}
        />
        <svg
          width="200"
          height="110"
          viewBox="0 0 240 130"
          style={{ position: "absolute", left: 190, top: -92 }}
        >
          <path
            d="M120 70 C70 0 10 20 30 70 C45 105 95 90 120 70 Z"
            fill={colors.goldLight}
            stroke={colors.bronzeDeep}
            strokeWidth="4"
          />
          <path
            d="M120 70 C170 0 230 20 210 70 C195 105 145 90 120 70 Z"
            fill={colors.goldLight}
            stroke={colors.bronzeDeep}
            strokeWidth="4"
          />
          <circle cx="120" cy="70" r="20" fill={colors.bronze} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
