import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled in public/fonts (SIL Open Font License) so renders work offline.
// Lalezar: punchy Arabic display face for Tunisian headlines
export const displayFont = "Lalezar";
// Cairo (variable): Arabic + Latin body copy
export const bodyFont = "Cairo";
// Playfair Display (variable): brand wordmark
export const brandFont = "Playfair Display";

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
  family: brandFont,
  url: staticFile("fonts/PlayfairDisplay.ttf"),
  weight: "400 900",
});

// Palette: Sidi Bou Said blue & whitewash, jasmine white, gold, and a rose/plum range for the pack
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
  // Pack palette, matched to the pink products
  rose: "#E8578A",
  roseDeep: "#B8326A",
  blush: "#FCE8EE",
  plum: "#2E0B24",
  plumSoft: "#4A1639",
};

// Cuts are 12-frame transitions centred on the bar lines of the 120 BPM soundtrack,
// so every scene change lands on the beat: 4s, 8s, 12s, 16s, 20s, 24s.
export const TRANSITION = 12;
