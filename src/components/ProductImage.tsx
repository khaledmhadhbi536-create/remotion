import React from "react";
import { Img, staticFile } from "remotion";

// Product cut-outs (background removed) from the store's own photos — see assets/source-images
export const PRODUCTS = {
  dermaRoller: { src: "products/derma-roller.png", ratio: 1078 / 626 },
  bottlePink: { src: "products/bottle-pink.png", ratio: 330 / 1164 },
  bottleBlack: { src: "products/bottle-black.png", ratio: 578 / 1725 },
  brushPink: { src: "products/brush-pink.png", ratio: 833 / 862 },
  brushTerracotta: { src: "products/brush-terracotta.png", ratio: 604 / 548 },
} as const;

export type ProductKey = keyof typeof PRODUCTS;

// Renders a product at a given height with a soft contact shadow underneath
export const ProductImage: React.FC<{
  readonly product: ProductKey;
  readonly height: number;
  readonly style?: React.CSSProperties;
  readonly shadow?: boolean;
}> = ({ product, height, style, shadow = true }) => {
  const { src, ratio } = PRODUCTS[product];
  const width = height * ratio;
  return (
    <div style={{ position: "relative", width, height, ...style }}>
      {shadow ? (
        <div
          style={{
            position: "absolute",
            left: "8%",
            right: "8%",
            bottom: -height * 0.04,
            height: Math.max(18, height * 0.08),
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side, rgba(0,0,0,0.35), rgba(0,0,0,0))",
          }}
        />
      ) : null}
      <Img
        src={staticFile(src)}
        style={{ position: "absolute", inset: 0, width, height }}
      />
    </div>
  );
};

// The 3-piece pack arranged as one hero group (bottle at the back, roller and brush in front)
export const PackGroup: React.FC<{
  readonly scale?: number;
  readonly style?: React.CSSProperties;
}> = ({ scale = 1, style }) => (
  <div
    style={{
      position: "relative",
      width: 420 * scale,
      height: 520 * scale,
      ...style,
    }}
  >
    <ProductImage
      product="bottleBlack"
      height={440 * scale}
      style={{
        position: "absolute",
        left: 150 * scale,
        top: 0,
        rotate: "4deg",
      }}
    />
    <ProductImage
      product="brushPink"
      height={180 * scale}
      style={{
        position: "absolute",
        left: 230 * scale,
        top: 320 * scale,
        rotate: "8deg",
      }}
    />
    <ProductImage
      product="dermaRoller"
      height={190 * scale}
      style={{
        position: "absolute",
        left: -30 * scale,
        top: 310 * scale,
        rotate: "-6deg",
      }}
    />
  </div>
);
