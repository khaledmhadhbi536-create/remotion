import React from "react";
import { CaptionTrack, type CaptionPhrase } from "../components/Captions";
import { PHRASES, srcToOut } from "./edit";

// Subtitles of the seller's video: phrase times are in source seconds → map them through the jump cuts
const phrases: CaptionPhrase[] = PHRASES.map((p) => ({
  start: srcToOut(p.start),
  end: srcToOut(p.end),
  text: p.text,
  emphasis: p.emphasis,
}));

export const Subtitles: React.FC<{ readonly top: number }> = ({ top }) => (
  <CaptionTrack phrases={phrases} top={top} />
);
