import React from "react";
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ASSETS, COLORS, PRODUCT } from "../config";
import { FONTS, SPRING } from "../theme";

// Brand wordmark: "NOURA" in a high-contrast serif with a gold rule and tagline.
// Replace with ASSETS.images.logo once the real logo file exists.
export const Logo: React.FC<{
  readonly delay?: number;
  readonly scale?: number;
  readonly color?: string;
}> = ({ delay = 0, scale = 1, color = COLORS.brownDeep }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: SPRING.soft });
  const tracking = interpolate(s, [0, 1], [26, 14]);

  const wrap: React.CSSProperties = {
    opacity: s,
    transform: `scale(${scale})`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  if (ASSETS.images.logo) {
    return (
      <div style={wrap}>
        <Img src={staticFile(ASSETS.images.logo)} style={{ height: 70 }} />
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div
        style={{
          fontFamily: FONTS.serif,
          fontWeight: 600,
          fontSize: 54,
          letterSpacing: tracking,
          marginRight: -tracking, // keep optical centre despite tracking
          color,
          lineHeight: 1,
        }}
      >
        {PRODUCT.brand}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginTop: 10,
        }}
      >
        <div style={{ width: 34 * s, height: 1.5, background: COLORS.gold }} />
        <div
          style={{
            fontFamily: FONTS.arabic,
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: 4,
            color: COLORS.goldDeep,
            textTransform: "uppercase",
          }}
        >
          {PRODUCT.brandTagline}
        </div>
        <div style={{ width: 34 * s, height: 1.5, background: COLORS.gold }} />
      </div>
    </div>
  );
};
