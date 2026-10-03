import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { TilePattern } from "../components/Decor";
import { ProductImage, type ProductKey } from "../components/ProductImage";
import { PRICES, VALUE_TOTAL } from "../config";
import { bodyFont, colors, displayFont } from "../theme";

// 20–24s · VALUE STACK — what's in the pack and what it would cost separately
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Row: React.FC<{
  readonly at: number;
  readonly product: ProductKey;
  readonly height: number;
  readonly label: string;
  readonly price: number;
}> = ({ at, product, height, label, price }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        direction: "rtl",
        background: colors.white,
        borderRadius: 26,
        padding: "0 34px",
        height: 130,
        width: 860,
        boxShadow: "0 14px 30px rgba(46,11,36,0.25)",
        opacity: interpolate(frame, [at, at + 5], [0, 1], clamp),
        translate: interpolate(
          frame,
          [at, at + 12],
          ["-260px 0px", "0px 0px"],
          {
            ...clamp,
            easing: Easing.bezier(0.2, 1.3, 0.4, 1),
          },
        ),
      }}
    >
      <div style={{ width: 150, display: "flex", justifyContent: "center" }}>
        <ProductImage product={product} height={height} shadow={false} />
      </div>
      <div
        style={{
          flex: 1,
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 46,
          color: colors.plum,
          marginRight: 20,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 46,
          color: colors.roseDeep,
        }}
      >
        {price} د.ت
      </div>
    </div>
  );
};

export const ValueScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${colors.plumSoft} 0%, ${colors.plum} 100%)`,
        overflow: "hidden",
      }}
    >
      <TilePattern color={colors.rose} opacity={0.1} drift={-frame * 0.5} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 90, gap: 22 }}>
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 96,
            color: colors.white,
            direction: "rtl",
            marginBottom: 16,
            opacity: interpolate(frame, [6, 12], [0, 1], clamp),
            scale: interpolate(frame, [6, 18], [0.7, 1], {
              ...clamp,
              easing: Easing.bezier(0.3, 1.6, 0.5, 1),
              output: "perceptual-scale",
            }),
          }}
        >
          شنوّة فيه الباك؟
        </div>
        <Row
          at={21}
          product="dermaRoller"
          height={80}
          label="ديرما رولر 540 إبرة"
          price={PRICES.dermaRoller}
        />
        <Row
          at={36}
          product="bottlePink"
          height={112}
          label="قارورة بمشط للجذور"
          price={PRICES.applicator}
        />
        <Row
          at={51}
          product="brushPink"
          height={100}
          label="فرشة تدليك الراس"
          price={PRICES.brush}
        />
        <div
          style={{
            marginTop: 26,
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 56,
            color: colors.goldLight,
            direction: "rtl",
            opacity: interpolate(frame, [75, 81], [0, 1], clamp),
            scale: interpolate(frame, [75, 87], [1.6, 1], {
              ...clamp,
              easing: Easing.bezier(0.2, 1.4, 0.4, 1),
              output: "perceptual-scale",
            }),
          }}
        >
          كل وحدة وحدها = {VALUE_TOTAL} د.ت
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
