import React from "react";
import { Img, staticFile } from "remotion";

// Product cut-outs (background removed) from the store's own photos — see assets/source-images
export const PRODUCTS = {
  dermaRoller: { src: "products/derma-roller.png", ratio: 1078 / 626 },
  bottlePink: { src: "products/bottle-pink.png", ratio: 330 / 1164 },
  bottleBlack: { src: "products/bottle-black.png", ratio: 578 / 1725 },
  brushPink: { src: "products/brush-pink.png", ratio: 833 / 862 },
  brushTerracotta: { src: "products/brush-terracotta.png", ratio: 604 / 548 },
  rosemaryOil: { src: "products/rosemary-oil.png", ratio: 400 / 1020 },
  sidr: { src: "products/sidr-powder.png", ratio: 384 / 612 },
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

// The 5-piece pack arranged as one hero group: tall items at the back, roller and brush in front
export const PackGroup: React.FC<{
  readonly scale?: number;
  readonly style?: React.CSSProperties;
}> = ({ scale = 1, style }) => (
  <div
    style={{
      position: "relative",
      width: 520 * scale,
      height: 520 * scale,
      ...style,
    }}
  >
    <ProductImage
      product="sidr"
      height={360 * scale}
      style={{
        position: "absolute",
        left: 250 * scale,
        top: 20 * scale,
        rotate: "5deg",
      }}
    />
    <ProductImage
      product="bottleBlack"
      height={430 * scale}
      style={{
        position: "absolute",
        left: 175 * scale,
        top: 0,
        rotate: "-2deg",
      }}
    />
    <ProductImage
      product="rosemaryOil"
      height={300 * scale}
      style={{
        position: "absolute",
        left: 60 * scale,
        top: 90 * scale,
        rotate: "-6deg",
      }}
    />
    <ProductImage
      product="brushTerracotta"
      height={170 * scale}
      style={{
        position: "absolute",
        left: 330 * scale,
        top: 340 * scale,
        rotate: "8deg",
      }}
    />
    <ProductImage
      product="dermaRoller"
      height={180 * scale}
      style={{
        position: "absolute",
        left: -20 * scale,
        top: 330 * scale,
        rotate: "-6deg",
      }}
    />
  </div>
);
