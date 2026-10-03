import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { bodyFont, displayFont } from "../theme";
import { P } from "./Overlays";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Final 3.5s: frozen shot of both products (public/footage/endcard.jpg, source 15.6s) + CTA.
export const EndCard: React.FC<{ readonly price: number | null }> = ({
  price,
}) => {
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
  return (
    <AbsoluteFill style={{ backgroundColor: P.greenDeep }}>
      <Img
        src={staticFile("footage/endcard.jpg")}
        style={{
          width: "100%",
          height: "100%",
          filter: "blur(5px) brightness(0.5)",
          scale: String(interpolate(frame, [0, 105], [1.08, 1.18])),
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          direction: "rtl",
          gap: 34,
          padding: "0 70px",
        }}
      >
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 96,
            lineHeight: 1.15,
            color: P.white,
            textAlign: "center",
            ...pop(4),
          }}
        >
          دهان الكبريت و القطران
          <br />+ فازلين حبّة البركة
        </div>
        {price !== null ? (
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 140,
              color: P.greenDeep,
              background: P.yellow,
              padding: "0 54px 18px",
              borderRadius: 28,
              ...pop(14),
            }}
          >
            الزوز بـ {price} د.ت
          </div>
        ) : (
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 100,
              color: P.greenDeep,
              background: P.yellow,
              padding: "0 50px 18px",
              borderRadius: 28,
              ...pop(14),
            }}
          >
            برومو على الزوز
          </div>
        )}
        <div
          style={{
            marginTop: 20,
            fontFamily: displayFont,
            fontSize: 96,
            color: P.white,
            background: P.green,
            padding: "6px 60px 24px",
            borderRadius: 999,
            boxShadow: "0 16px 0 #1B7A3E, 0 26px 50px rgba(0,0,0,0.45)",
            ...pop(24),
            scale: String(
              interpolate(frame, [24, 34], [0.5, 1], {
                ...clamp,
                easing: Easing.bezier(0.3, 1.6, 0.5, 1),
              }) *
                (1 +
                  0.05 * Math.max(0, Math.sin(((frame - 34) / 15) * Math.PI))),
            ),
          }}
        >
          اطلب توّا
        </div>
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 50,
            color: P.yellow,
            ...pop(34),
          }}
        >
          ابعثلنا ميساج على الصفحة
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
