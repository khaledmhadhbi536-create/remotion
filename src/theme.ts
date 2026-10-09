import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled in public/fonts (SIL Open Font License) so renders work offline.
// Lalezar: punchy Arabic display face for Tunisian headlines
export const displayFont = "Lalezar";
// Cairo (variable): Arabic + Latin body copy
export const bodyFont = "Cairo";
// Playfair Display (variable): brand wordmark
export const brandFont = "Playfair Display";
// Aref Ruqaa Bold: calligraphy for big title words (UGC ad section card)
export const calligraphyFont = "Aref Ruqaa";

loadFont({
  family: displayFont,
  url: staticFile("fonts/Lalezar.ttf"),
  weight: "400",
});
loadFont({
  family: bodyFont,
  url: staticFile("fonts/Cairo.ttf"),
  weight: "200 1000",
});
loadFont({
  family: calligraphyFont,
  url: staticFile("fonts/ArefRuqaa-Bold.ttf"),
  weight: "700",
});
loadFont({
  family: brandFont,
  url: staticFile("fonts/PlayfairDisplay.ttf"),
  weight: "400 900",
});

// Palette: Sidi Bou Said blue & whitewash, jasmine white, gold, and a charcoal/bronze range for the (men's) pack
export const colors = {
  blue: "#0B4F9C",
  blueDeep: "#062B57",
  navy: "#071A33",
  white: "#FFFFFF",
  cream: "#FBF4E8",
  sand: "#F3E3C8",
  gold: "#D9A441",
  goldLight: "#F5D58A",
  amber: "#B8621B",
  magenta: "#D3245F",
  magentaLight: "#FF6B98",
  green: "#4F8A3A",
  red: "#E63946",
  ink: "#14223A",
  // Pack palette — masculine: charcoal, bronze and cool grey
  bronze: "#C8963E",
  bronzeDeep: "#8A6420",
  mist: "#E9ECEF",
  charcoal: "#121820",
  charcoalSoft: "#25303C",
};

// Cuts are 12-frame transitions centred on the bar lines of the 120 BPM soundtrack,
// so every scene change lands on the beat: 4s, 8s, 12s, 16s, 20s, 24s.
export const TRANSITION = 12;
