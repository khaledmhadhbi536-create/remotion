import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CaptionTrack, type CaptionPhrase } from "./components/Captions";
import { TilePattern } from "./components/Decor";
import { PACK_PIECES, PRICES, STORE_NAME, VALUE_TOTAL } from "./config";
import { CTA_START, HairPackAd, PACK_AD_FRAMES } from "./HairPackAd";
import { bodyFont, brandFont, colors } from "./theme";

// 9:16 version for Reels / TikTok / Stories: the square ad in the middle,
// a brand header on top and word-by-word Arabic captions (narration) underneath.
export const PACK_REEL_FRAMES = PACK_AD_FRAMES;

// Narration captions (seconds of the 38s timeline, aligned with the scenes)
export const PACK_CAPTIONS: CaptionPhrase[] = [
  { start: 0.2, end: 2.0, text: "عرض استثنائي!", emphasis: ["استثنائي!"] },
  {
    start: 2.0,
    end: 3.8,
    text: `${PACK_PIECES} قطع بـ ${PRICES.pack} دينار برك`,
    emphasis: [`${PRICES.pack}`],
  },
  { start: 4.2, end: 6.0, text: "الشعر يطيح؟", emphasis: ["يطيح؟"] },
  { start: 6.0, end: 7.8, text: "خفيف و بدات الصلعة؟", emphasis: ["الصلعة؟"] },
  {
    start: 8.2,
    end: 11.8,
    text: "الحل: روتين طبيعي في 3 خطوات",
    emphasis: ["روتين", "طبيعي"],
  },
  {
    start: 12.2,
    end: 15.8,
    text: "اغسل بالسدر البيو و مشط الجذور يوصّلو للجذور",
    emphasis: ["بالسدر", "الجذور"],
  },
  {
    start: 16.2,
    end: 19.8,
    text: "ديرما رولر مرّتين في الجمعة و بعدو قطرات إكليل الجبل",
    emphasis: ["ديرما", "رولر", "إكليل"],
  },
  {
    start: 20.2,
    end: 23.8,
    text: "و الفرشة تنشّط الدورة الدموية",
    emphasis: ["الفرشة"],
  },
  {
    start: 24.2,
    end: 27.8,
    text: `كل وحدة وحدها بـ ${VALUE_TOTAL} دينار`,
    emphasis: [`${VALUE_TOTAL}`],
  },
  {
    start: 28.2,
    end: 31.8,
    text: `اليوم الخمسة بـ ${PRICES.pack} دينار برك`,
    emphasis: [`${PRICES.pack}`],
  },
  { start: 32.0, end: 33.9, text: "اطلب توّا!", emphasis: ["توّا!"] },
];

const SQUARE_TOP = 400;

export const HairPackReel: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${colors.charcoalSoft} 0%, ${colors.charcoal} 100%)`,
      }}
    >
      <TilePattern color={colors.bronze} opacity={0.08} drift={frame * 0.3} />

      {/* Header */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 110 }}>
        <div
          style={{
            fontFamily: brandFont,
            fontWeight: 900,
            fontSize: 64,
            letterSpacing: 8,
            color: colors.goldLight,
          }}
        >
          {STORE_NAME}
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 56,
            color: colors.white,
            direction: "rtl",
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          باك نموّ الشعر للرجال • {PACK_PIECES} في 1
          <span
            style={{
              background: colors.bronze,
              borderRadius: 999,
              padding: "0 24px 6px",
              fontSize: 48,
              scale: String(
                interpolate(
                  frame,
                  [CTA_START + 36, CTA_START + 48],
                  [1, 1.25],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.3, 1.6, 0.5, 1),
                  },
                ),
              ),
            }}
          >
            {PRICES.pack} د.ت
          </span>
        </div>
      </AbsoluteFill>

      {/* The square ad (with all its audio) */}
      <div
        style={{
          position: "absolute",
          top: SQUARE_TOP,
          left: 0,
          width: 1080,
          height: 1080,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        }}
      >
        <HairPackAd />
      </div>

      {/* Captions under the square */}
      <CaptionTrack
        phrases={PACK_CAPTIONS}
        top={SQUARE_TOP + 1080 + 70}
        activeColor="rgba(200,150,62,0.95)"
        emphasisColor={colors.goldLight}
        fontSize={76}
      />
    </AbsoluteFill>
  );
};
