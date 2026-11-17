// theme.ts: single source of truth for the lasagne/gratin edit (remotion-motion-graphics skill rules).
import { Easing } from "remotion";

export const lt = {
  colors: {
    hero: "#E8A33D", // warm gold: one element per frame (active caption word or chip number)
    cream: "#FFF4E0",
    ink: "#1A120B",
    basil: "#3E7D3A",
    tomato: "#C8402A",
    glow: "rgba(232, 163, 61, 0.45)",
  },
  fonts: {
    display: "Lalezar", // Arabic display (public/fonts, SIL OFL)
    body: "Cairo", // Arabic + Latin, variable weight
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
  },
} as const;
