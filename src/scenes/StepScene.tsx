import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { TilePattern } from "../components/Decor";
import { ProductImage, type ProductKey } from "../components/ProductImage";
import { bodyFont, colors, displayFont } from "../theme";

// 8–20s · THE ROUTINE — one product per step, each with its job and how to use it.
// Each step has a demo motion that mimics how the product is used.
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type StepSceneProps = {
  readonly step: number;
  readonly title: string;
  readonly bullets: readonly string[];
  readonly howTo: string;
  readonly products: readonly { product: ProductKey; height: number }[];
  readonly motion: "roll" | "tilt" | "massage";
  readonly accent: string;
  readonly background: string;
  readonly dark?: boolean;
};

export const StepScene: React.FC<StepSceneProps> = ({
  step,
  title,
  bullets,
  howTo,
  products,
  motion,
  accent,
  background,
  dark = false,
}) => {
  const frame = useCurrentFrame();
  const textColor = dark ? colors.white : colors.plum;

  // Usage demo motions (start once the product has landed)
  const t = Math.max(0, frame - 20);
  const demo: React.CSSProperties =
    motion === "roll"
      ? {
          translate: `${Math.sin(t / 9) * 40}px 0px`,
          rotate: `${Math.sin(t / 9) * -4}deg`,
        }
      : motion === "tilt"
        ? { rotate: `${interpolate(Math.sin(t / 12), [-1, 1], [-4, 14])}deg` }
        : {
            translate: `${Math.cos(t / 7) * 22}px ${Math.sin(t / 7) * 16}px`,
            rotate: `${Math.sin(t / 7) * 6}deg`,
          };

  return (
    <AbsoluteFill style={{ background, overflow: "hidden" }}>
      <TilePattern
        color={dark ? "#ffffff" : colors.rose}
        opacity={dark ? 0.06 : 0.08}
        drift={frame * 0.4}
      />

      {/* Giant step number in the background */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: -60,
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 560,
          lineHeight: 1,
          color: accent,
          opacity: 0.14,
          translate: interpolate(frame, [0, 30], ["-80px 0px", "0px 0px"], {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {step}
      </div>

      {/* Product(s) — left half */}
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 460,
          top: 150,
          bottom: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {/* Accent disc behind product */}
        <div
          style={{
            position: "absolute",
            width: 430,
            height: 430,
            borderRadius: "50%",
            background: accent,
            opacity: 0.9,
            scale: interpolate(frame, [4, 18], [0, 1], {
              ...clamp,
              easing: Easing.bezier(0.3, 1.5, 0.5, 1),
              output: "perceptual-scale",
            }),
          }}
        />
        <div
          style={{ display: "flex", alignItems: "center", gap: 24, ...demo }}
        >
          {products.map(({ product, height }, i) => (
            <ProductImage
              key={product}
              product={product}
              height={height}
              style={{
                opacity: interpolate(
                  frame,
                  [6 + i * 8, 12 + i * 8],
                  [0, 1],
                  clamp,
                ),
                translate: interpolate(
                  frame,
                  [6 + i * 8, 20 + i * 8],
                  ["0px 300px", "0px 0px"],
                  {
                    ...clamp,
                    easing: Easing.bezier(0.2, 1.3, 0.4, 1),
                  },
                ),
              }}
            />
          ))}
        </div>
      </div>

      {/* Copy — right half */}
      <div
        style={{
          position: "absolute",
          right: 50,
          top: 150,
          width: 560,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          direction: "rtl",
        }}
      >
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 40,
            color: colors.white,
            background: accent,
            padding: "4px 28px 8px",
            borderRadius: 999,
            opacity: interpolate(frame, [6, 11], [0, 1], clamp),
            translate: interpolate(frame, [6, 16], ["60px 0px", "0px 0px"], {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          الخطوة {step}
        </div>
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 80,
            lineHeight: 1.12,
            color: textColor,
            marginTop: 18,
            opacity: interpolate(frame, [12, 18], [0, 1], clamp),
            translate: interpolate(frame, [12, 24], ["0px 40px", "0px 0px"], {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 30,
          }}
        >
          {bullets.map((b, i) => {
            const at = 36 + i * 15;
            return (
              <div
                key={b}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  fontFamily: bodyFont,
                  fontWeight: 900,
                  fontSize: 37,
                  color: textColor,
                  whiteSpace: "nowrap",
                  opacity: interpolate(frame, [at, at + 5], [0, 1], clamp),
                  translate: interpolate(
                    frame,
                    [at, at + 10],
                    ["60px 0px", "0px 0px"],
                    {
                      ...clamp,
                      easing: Easing.bezier(0.16, 1, 0.3, 1),
                    },
                  ),
                }}
              >
                <svg
                  width="46"
                  height="46"
                  viewBox="0 0 10 10"
                  style={{ flexShrink: 0 }}
                >
                  <circle cx="5" cy="5" r="5" fill={accent} />
                  <path
                    d="M2.6 5.2 L4.3 6.8 L7.4 3.6"
                    stroke={colors.white}
                    strokeWidth="1.2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {b}
              </div>
            );
          })}
        </div>
      </div>

      {/* How-to strip */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 90,
        }}
      >
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 800,
            fontSize: 40,
            color: dark ? colors.plum : colors.white,
            background: dark ? colors.goldLight : colors.plum,
            padding: "10px 36px 14px",
            borderRadius: 18,
            direction: "rtl",
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: interpolate(frame, [70, 76], [0, 1], clamp),
            scale: interpolate(frame, [70, 82], [0.6, 1], {
              ...clamp,
              easing: Easing.bezier(0.3, 1.6, 0.5, 1),
              output: "perceptual-scale",
            }),
          }}
        >
          <svg width="40" height="40" viewBox="0 0 10 10">
            <circle
              cx="5"
              cy="5"
              r="4.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M5 2.6 L5 5 L6.8 6"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          {howTo}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
