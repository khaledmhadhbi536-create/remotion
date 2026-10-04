import React from "react";
import { Audio } from "@remotion/media";
import {
  linearTiming,
  type TransitionPresentation,
  TransitionSeries,
} from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { lightFlash, zoomBlur } from "./components/transitions";
import { SafeZone } from "./components/SafeZone";
import { ASSETS, MIX, sec, VOICEOVER_SCRIPT, type SceneKey } from "./config";
import { Benefits } from "./scenes/Benefits";
import { CTA } from "./scenes/CTA";
import { Hook } from "./scenes/Hook";
import { Problem } from "./scenes/Problem";
import { ProductReveal } from "./scenes/ProductReveal";
import { SocialProof } from "./scenes/SocialProof";
import { BEATS, sceneLength, sceneStart, TRANSITION_FRAMES } from "./timing";

// NOURA · Huile Éclat — 30s, 1080×1080, Facebook + Instagram feed.
//
// 00:00–00:03 Hook → 00:03–00:08 Problem → 00:08–00:14 Product reveal
// → 00:14–00:21 Benefits → 00:21–00:26 Social proof → 00:26–00:30 CTA
//
// Every scene starts exactly on its second: each <Sequence> is TRANSITION_FRAMES longer
// than its slot, and the transition eats those frames at the start of the next scene.

const SCENES: { key: SceneKey; Component: React.FC; name: string }[] = [
  { key: "hook", Component: Hook, name: "00–03 Hook" },
  { key: "problem", Component: Problem, name: "03–08 Problème" },
  { key: "reveal", Component: ProductReveal, name: "08–14 Product reveal" },
  { key: "benefits", Component: Benefits, name: "14–21 Bénéfices" },
  { key: "proof", Component: SocialProof, name: "21–26 Preuve" },
  { key: "cta", Component: CTA, name: "26–30 CTA" },
];

// Transition INTO each scene (index = scene index - 1)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSITIONS: TransitionPresentation<any>[] = [
  zoomBlur(), // hook → problem
  lightFlash(), // problem → reveal (the "light switches on" moment)
  slide({ direction: "from-left" }), // reveal → benefits (forward motion in RTL reading)
  wipe({ direction: "from-left" }), // benefits → proof
  zoomBlur(), // proof → CTA
];

// Sound-design cues (absolute frames), derived from the same BEATS the scenes animate on
const at = (key: SceneKey, beat = 0) => sceneStart(key) + beat;
const SFX_CUES: {
  name: keyof typeof ASSETS.audio.sfx;
  frame: number;
  volume?: number;
}[] = [
  { name: "stop", frame: 0, volume: 0.9 },
  { name: "whoosh", frame: at("problem") - 4 },
  ...BEATS.problem.items.map((b) => ({
    name: "pop" as const,
    frame: at("problem", b),
  })),
  { name: "whoosh", frame: at("problem", BEATS.problem.punch), volume: 0.6 },
  { name: "sparkle", frame: at("reveal"), volume: 0.6 },
  { name: "whoosh", frame: at("reveal", BEATS.reveal.bottle) - 6, volume: 0.7 },
  { name: "sparkle", frame: at("reveal", BEATS.reveal.bottle + 16), volume: 1 },
  ...BEATS.reveal.badges.map((b) => ({
    name: "pop" as const,
    frame: at("reveal", b),
    volume: 0.7,
  })),
  { name: "whoosh", frame: at("benefits") - 4 },
  { name: "pop", frame: at("benefits", BEATS.benefits.drop + 16), volume: 0.8 },
  {
    name: "whoosh",
    frame: at("benefits", BEATS.benefits.wipeStart),
    volume: 0.5,
  },
  {
    name: "sparkle",
    frame: at("benefits", BEATS.benefits.wipeEnd - 6),
    volume: 0.8,
  },
  ...BEATS.benefits.items.map((b) => ({
    name: "pop" as const,
    frame: at("benefits", b),
  })),
  { name: "whoosh", frame: at("proof") - 4, volume: 0.7 },
  { name: "sparkle", frame: at("proof", BEATS.proof.stars), volume: 0.6 },
  ...BEATS.proof.bubbles.map((b) => ({
    name: "pop" as const,
    frame: at("proof", b),
    volume: 0.7,
  })),
  { name: "impact", frame: at("cta"), volume: 0.8 },
  { name: "click", frame: at("cta", BEATS.cta.tap), volume: 1 },
];

// Voice-over windows (to duck the music under the voice when a voice-over file is set)
const VO_WINDOWS = VOICEOVER_SCRIPT.map((line) => {
  const words = line.text.split(" ").length;
  return [sec(line.at), sec(line.at + words * 0.43)] as const;
});

export const NouraAd: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const timing = linearTiming({ durationInFrames: TRANSITION_FRAMES });
  const hasVoice = Boolean(ASSETS.audio.voiceover);

  const musicVolume = (f: number) => {
    const fadeOut = interpolate(
      f,
      [durationInFrames - 15, durationInFrames],
      [1, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );
    if (!hasVoice) return MIX.music * fadeOut;
    const speaking = VO_WINDOWS.some(([a, b]) => f >= a - 4 && f <= b + 4);
    return (speaking ? MIX.musicUnderVoice : MIX.music) * fadeOut;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <TransitionSeries name="Scènes">
        {SCENES.map(({ key, Component, name }, i) => {
          const last = i === SCENES.length - 1;
          return (
            <React.Fragment key={key}>
              {i > 0 ? (
                <TransitionSeries.Transition
                  presentation={TRANSITIONS[i - 1]}
                  timing={timing}
                />
              ) : null}
              <TransitionSeries.Sequence
                name={name}
                durationInFrames={
                  sceneLength(key) + (last ? 0 : TRANSITION_FRAMES)
                }
                premountFor={fps}
              >
                <Component />
              </TransitionSeries.Sequence>
            </React.Fragment>
          );
        })}
      </TransitionSeries>

      <SafeZone />

      {/* ── Audio ── */}
      <Audio src={staticFile(ASSETS.audio.music)} volume={musicVolume} />
      {ASSETS.audio.voiceover ? (
        <Audio
          src={staticFile(ASSETS.audio.voiceover)}
          volume={MIX.voiceover}
        />
      ) : null}
      {SFX_CUES.map((cue, i) => (
        <Sequence
          key={i}
          from={Math.max(0, cue.frame)}
          durationInFrames={fps * 2}
          name={`SFX ${cue.name}`}
          layout="none"
        >
          <Audio
            src={staticFile(ASSETS.audio.sfx[cue.name])}
            volume={MIX.sfx * (cue.volume ?? 1)}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
