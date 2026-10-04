import React from "react";
import { AbsoluteFill } from "remotion";
import { SAFE_MARGIN, SHOW_SAFE_ZONE } from "../config";

// Debug overlay: the dashed square is the area where logo, CTA, price and text must stay.
// Toggle with SHOW_SAFE_ZONE in config.ts (never visible in the final render by default).
export const SafeZone: React.FC = () =>
  SHOW_SAFE_ZONE ? (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: SAFE_MARGIN,
          border: "3px dashed rgba(255,0,90,0.8)",
        }}
      />
    </AbsoluteFill>
  ) : null;
