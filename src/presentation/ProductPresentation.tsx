import React from "react";
import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { EndCard } from "./EndCard";
import {
  clips,
  MOMENTS,
  PROMO_PRICE,
  SPEECH_FRAMES,
  srcToFrame,
  TOTAL_FRAMES,
} from "./edit";
import {
  BenefitChips,
  Hook,
  ProductCard,
  ProgressBar,
  PromoBanner,
} from "./Overlays";
import { Subtitles } from "./Subtitles";

// 9:16 product presentation (Reels / TikTok / Stories), cut from the seller's own footage.
// Footage is pre-processed (stabilised, colour graded, voice cleaned): see README.
const FOOTAGE = staticFile("footage/presentation.mp4");

// Jump cut with alternating punch-in (1.0 ↔ 1.12) to hide the cut, plus a slow push-in
const Clip: React.FC<{
  readonly index: number;
  readonly trimBefore: number;
  readonly duration: number;
}> = ({ index, trimBefore, duration }) => {
  const frame = useCurrentFrame();
  const base = index % 2 === 0 ? 1 : 1.12;
  const push = interpolate(frame, [0, duration], [0, 0.03], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{ scale: String(base + push), transformOrigin: "50% 45%" }}
    >
      <Video
        src={FOOTAGE}
        trimBefore={trimBefore}
        durationInFrames={duration}
        volume={0.85}
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  );
};

export const ProductPresentation: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = srcToFrame;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* ---------- Footage: jump cuts ---------- */}
      {clips.map((c, i) => (
        <Sequence
          key={i}
          name={`Clip ${i + 1}`}
          from={c.from}
          durationInFrames={c.durationInFrames}
          premountFor={fps}
        >
          <Clip
            index={i}
            trimBefore={c.trimBefore}
            duration={c.durationInFrames}
          />
        </Sequence>
      ))}

      {/* Vignette for text legibility */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* ---------- Graphics ---------- */}
      <Hook end={f(MOMENTS.hookEnd)} />
      <ProductCard
        from={f(MOMENTS.product1)}
        to={f(MOMENTS.product1End)}
        title="دهان الكبريت و القطران"
        subtitle="المغربي الأصيل • 2 في 1"
      />
      <BenefitChips
        from={f(MOMENTS.benefits)}
        to={f(MOMENTS.benefitsEnd)}
        items={["الظوافر", "الإكزيما", "الصدفية", "البشرة و الشعر"]}
        step={7}
      />
      <ProductCard
        from={f(MOMENTS.product2)}
        to={f(MOMENTS.product2End)}
        title="فازلين بزيت حبّة البركة"
        subtitle="ترطيب طبيعي"
      />
      <PromoBanner
        from={f(MOMENTS.promo)}
        to={SPEECH_FRAMES}
        price={PROMO_PRICE}
      />

      <Sequence durationInFrames={SPEECH_FRAMES} name="Subtitles">
        <Subtitles top={1300} />
      </Sequence>

      <Sequence
        from={SPEECH_FRAMES}
        durationInFrames={TOTAL_FRAMES - SPEECH_FRAMES}
        name="End card"
        premountFor={fps}
      >
        <EndCard price={PROMO_PRICE} />
      </Sequence>

      <ProgressBar total={TOTAL_FRAMES} />

      {/* ---------- Music bed (ducked under the voice, up on the end card) ---------- */}
      <Audio
        name="Music under voice"
        src={staticFile("audio/music.mp3")}
        trimBefore={4 * fps}
        loop
        durationInFrames={SPEECH_FRAMES}
        volume={0.08}
        premountFor={fps}
      />
      <Audio
        name="Music end card"
        from={SPEECH_FRAMES}
        src={staticFile("audio/music.mp3")}
        trimBefore={24 * fps}
        volume={0.5}
        premountFor={fps}
      />

      {/* ---------- Sound design ---------- */}
      <Audio
        name="Impact · hook"
        src={staticFile("audio/impact.mp3")}
        volume={0.35}
        premountFor={fps}
      />
      <Audio
        name="Pop · hook 2"
        from={12}
        src={staticFile("audio/pop.mp3")}
        volume={0.6}
        premountFor={fps}
      />
      <Audio
        name="Whoosh · product 1"
        from={f(MOMENTS.product1) - 8}
        src={staticFile("audio/whoosh.mp3")}
        volume={0.45}
        premountFor={fps}
      />
      <Audio
        name="Click · chip 1"
        from={f(MOMENTS.benefits)}
        src={staticFile("audio/click.mp3")}
        volume={0.6}
        premountFor={fps}
      />
      <Audio
        name="Click · chip 2"
        from={f(MOMENTS.benefits) + 7}
        src={staticFile("audio/click.mp3")}
        volume={0.6}
        premountFor={fps}
      />
      <Audio
        name="Click · chip 3"
        from={f(MOMENTS.benefits) + 14}
        src={staticFile("audio/click.mp3")}
        volume={0.6}
        premountFor={fps}
      />
      <Audio
        name="Click · chip 4"
        from={f(MOMENTS.benefits) + 21}
        src={staticFile("audio/click.mp3")}
        volume={0.6}
        premountFor={fps}
      />
      <Audio
        name="Whoosh · product 2"
        from={f(MOMENTS.product2) - 8}
        src={staticFile("audio/whoosh.mp3")}
        volume={0.45}
        premountFor={fps}
      />
      <Audio
        name="Shimmer · product 2"
        from={f(MOMENTS.product2) + 4}
        src={staticFile("audio/shimmer.mp3")}
        volume={0.3}
        premountFor={fps}
      />
      <Audio
        name="Cash bell · promo"
        from={f(MOMENTS.promo)}
        src={staticFile("audio/cash-bell.mp3")}
        volume={0.5}
        premountFor={fps}
      />
      <Audio
        name="Riser → end card"
        from={SPEECH_FRAMES - 45}
        src={staticFile("audio/riser.mp3")}
        volume={0.35}
        premountFor={fps}
      />
      <Audio
        name="Impact · end card"
        from={SPEECH_FRAMES}
        src={staticFile("audio/impact.mp3")}
        volume={0.35}
        premountFor={fps}
      />
      <Audio
        name="Pop · CTA"
        from={SPEECH_FRAMES + 24}
        src={staticFile("audio/pop.mp3")}
        volume={0.6}
        premountFor={fps}
      />
    </AbsoluteFill>
  );
};
