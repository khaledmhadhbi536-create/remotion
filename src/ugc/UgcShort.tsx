import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { bodyFont } from "../theme";
import { f } from "./edit";
import { PriceSticker, UgcAd, UgcAd4x5 } from "./UgcAd";

// ~21 s cut of the UGC ad (Puck voice-over): pain question + 49 DT from the first frame,
// pack intro, 2 routine steps, offer, then the static A end card with the Commander button.
// Each segment replays a slice of the full edit (seconds of the full UgcAd timeline).
const SEGMENTS = [
  { from: 3.78, to: 7.35 }, // « كان شعرك بدا يطيح ويفرغ… وما لقيتش نتيجة »
  { from: 0, to: 3.75 }, // « اليوم عنّا باك فيه خمسة حاجات الكل 49 دينار »
  { from: 18.1, to: 20.57 }, // « ثانيا الديرما رولر مرتين في الجمعة »
  { from: 23.1, to: 25.26 }, // « نحطّو قطرات من زيت إكليل الجبل الطبيعي »
  { from: 30.37, to: 34.27 }, // offer + « الخلاص عند الاستلام »
  { from: 34.57, to: 39.75 }, // « باش تعدّي الكوموند » + end card + Commander
];

const starts = SEGMENTS.reduce<number[]>(
  (acc, s, i) => [
    ...acc,
    i === 0 ? 0 : acc[i - 1] + f(SEGMENTS[i - 1].to) - f(SEGMENTS[i - 1].from),
  ],
  [],
);
export const SHORT_FRAMES =
  starts[starts.length - 1] +
  f(SEGMENTS[SEGMENTS.length - 1].to) -
  f(SEGMENTS[SEGMENTS.length - 1].from);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// New hook: the pain question and the 49 DT sticker are on screen from frame 0
const HookCard: React.FC<{
  readonly top: number;
  readonly stickerTop: number;
}> = ({ top, stickerTop }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, 5], [0.85, 1], {
    ...clamp,
    easing: Easing.bezier(0.2, 1.4, 0.4, 1),
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", top }}>
        <div
          style={{
            scale: String(s),
            background: "#fff",
            color: "#000",
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 66,
            lineHeight: 1.2,
            textAlign: "center",
            padding: "10px 36px 16px",
            borderRadius: 22,
            direction: "rtl",
            boxShadow: "0 14px 34px rgba(0,0,0,0.35)",
          }}
        >
          شعرك بدا يطيح و يفرغ؟
        </div>
      </AbsoluteFill>
      <PriceSticker at={0} top={stickerTop} left={560} scale={0.75} />
    </AbsoluteFill>
  );
};

const Cut: React.FC<{ readonly Source: React.FC }> = ({ Source }) => (
  <>
    {SEGMENTS.map((s, i) => (
      <Sequence
        key={i}
        from={starts[i]}
        durationInFrames={f(s.to) - f(s.from)}
        name={`Segment ${i + 1}`}
      >
        <Sequence from={-f(s.from)}>
          <Source />
        </Sequence>
      </Sequence>
    ))}
  </>
);

export const UgcShort9x16: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Cut Source={UgcAd} />
    <Sequence durationInFrames={starts[1]} name="Hook card">
      <HookCard top={245} stickerTop={820} />
    </Sequence>
  </AbsoluteFill>
);

export const UgcShort4x5: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Cut Source={UgcAd4x5} />
    <Sequence durationInFrames={starts[1]} name="Hook card">
      <HookCard top={92} stickerTop={640} />
    </Sequence>
  </AbsoluteFill>
);
