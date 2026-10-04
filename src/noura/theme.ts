import { Easing } from "remotion";
// Loads the bundled fonts (public/fonts, SIL OFL): Cairo (Arabic + Latin), Playfair Display (wordmark)
import { bodyFont, brandFont } from "../theme";
import { COLORS } from "./config";

export const FONTS = {
  // Arabic + Latin UI text. Cairo is variable: 200 → 1000.
  arabic: `${bodyFont}, sans-serif`,
  // Serif wordmark / product name: the "premium beauty" signal
  serif: `${brandFont}, serif`,
};

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
};

// Spring presets: "soft" for premium motion, "pop" for chips/badges
export const SPRING = {
  soft: { damping: 200 },
  smooth: { damping: 18, stiffness: 90, mass: 0.9 },
  pop: { damping: 12, stiffness: 180, mass: 0.6 },
};

export const SHADOW = {
  card: "0 30px 60px -20px rgba(46, 30, 19, 0.35), 0 8px 20px -8px rgba(46, 30, 19, 0.2)",
  text: "0 4px 24px rgba(20, 12, 6, 0.55)",
};

export const GRADIENTS = {
  cream: `radial-gradient(120% 90% at 50% 30%, ${COLORS.ivory} 0%, ${COLORS.cream} 45%, ${COLORS.beige} 100%)`,
  warmDark: `radial-gradient(120% 100% at 50% 20%, #5B3B24 0%, ${COLORS.brownDeep} 70%, #1B110A 100%)`,
  gold: `linear-gradient(135deg, ${COLORS.goldLight} 0%, ${COLORS.gold} 45%, ${COLORS.goldDeep} 100%)`,
  button: `linear-gradient(180deg, #6B4529 0%, ${COLORS.brown} 50%, ${COLORS.brownDeep} 100%)`,
};
