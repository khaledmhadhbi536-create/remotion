import React from "react";
import { PRODUCTS, ProductImage, type ProductKey } from "./ProductImage";
import { bodyFont, colors } from "../theme";

// The 5 pieces, in routine order — shown as numbered cards in statics and videos
export const PIECES: { product: ProductKey; name: string }[] = [
  { product: "sidr", name: "سدر بيو" },
  { product: "dermaRoller", name: "ديرما رولر 540" },
  { product: "rosemaryOil", name: "زيت إكليل الجبل" },
  { product: "bottleBlack", name: "مشط الجذور" },
  { product: "brushTerracotta", name: "فرشة التدليك" },
];

const CARD_W = 314;
const CARD_H = 318;
const IMG_W = 270;
const IMG_H = 210;

// One numbered product card: big photo, number badge, name
export const ProductCard: React.FC<{
  readonly index: number;
  readonly accent: string;
  readonly style?: React.CSSProperties;
}> = ({ index, accent, style }) => {
  const { product, name } = PIECES[index];
  const height = Math.min(IMG_H, IMG_W / PRODUCTS[product].ratio);
  return (
    <div
      style={{
        position: "relative",
        width: CARD_W,
        height: CARD_H,
        background: colors.white,
        borderRadius: 26,
        boxShadow: "0 14px 30px rgba(0,0,0,0.28)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 16,
        ...style,
      }}
    >
      <div
        style={{
          height: IMG_H + 10,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <ProductImage product={product} height={height} shadow={false} />
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 36,
          lineHeight: 1.2,
          color: colors.charcoal,
          direction: "rtl",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </div>
      <div
        style={{
          position: "absolute",
          top: -14,
          right: -14,
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: accent,
          color: colors.white,
          border: `5px solid ${colors.white}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 40,
          boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
        }}
      >
        {index + 1}
      </div>
    </div>
  );
};
