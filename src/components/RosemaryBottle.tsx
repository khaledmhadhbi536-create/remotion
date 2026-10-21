import React from "react";
import { bodyFont, brandFont } from "../theme";
import { ProductImage } from "./ProductImage";

// Rosemary oil as in the real pack: clear bottle, olive oil, white cap, small white sticker.
export const RosemaryBottle: React.FC<{
  readonly height: number;
  readonly style?: React.CSSProperties;
  readonly shadow?: boolean;
}> = ({ height, style, shadow = true }) => {
  const u = height / 1020;
  return (
    <div style={{ position: "relative", width: height * (400 / 1020), height, ...style }}>
      <ProductImage product="rosemaryReal" height={height} shadow={shadow} />
      <div
        style={{
          position: "absolute",
          left: 80 * u,
          top: 500 * u,
          width: 230 * u,
          height: 260 * u,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          direction: "rtl",
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 46 * u, lineHeight: 1.15, color: "#2B2B2B" }}>
          زيت إكليل
          <br />
          للشعر
        </div>
        <div style={{ fontFamily: brandFont, fontWeight: 700, fontSize: 36 * u, color: "#2E6B34", marginTop: 8 * u }}>
          aura bio
        </div>
      </div>
    </div>
  );
};
