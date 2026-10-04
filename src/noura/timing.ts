import { sec, TIMELINE, type SceneKey } from "./config";

// Scene-relative "beats" (frames from the start of each scene).
// Scenes use them for their animations and NouraAd.tsx uses the same values
// to place the sound effects, so picture and sound can never drift apart.
export const BEATS = {
  hook: {
    line1: 0, // on screen from the very first frames (autoplay thumbnail)
    line2: sec(1.3),
  },
  problem: {
    items: [sec(0.35), sec(1.05), sec(1.75)],
    comb: sec(0.2),
    punch: sec(2.9),
  },
  reveal: {
    question: 0,
    bottle: sec(1.0),
    name: sec(2.0),
    badges: [sec(2.9), sec(3.5)],
  },
  benefits: {
    title: 0,
    drop: sec(0.4),
    wipeStart: sec(1.0),
    wipeEnd: sec(2.6),
    items: [sec(3.4), sec(4.15), sec(4.9)],
    signature: sec(5.7),
  },
  proof: {
    card: sec(0.1),
    stars: sec(0.6),
    bubbles: [sec(1.6), sec(2.1)],
    claim: sec(2.7),
  },
  cta: {
    logo: 0,
    headline: sec(0.25),
    button: sec(1.0),
    tap: sec(2.3),
    trust: sec(1.5),
  },
} as const;

// Transition length between scenes (frames). Each scene's <Sequence> is extended by
// this amount so the next scene still starts exactly on its TIMELINE second.
export const TRANSITION_FRAMES = 10;

export const sceneStart = (key: SceneKey) => sec(TIMELINE[key].from);
export const sceneLength = (key: SceneKey) =>
  sec(TIMELINE[key].to) - sec(TIMELINE[key].from);
