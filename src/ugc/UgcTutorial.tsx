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
import { CaptionTrack, type CaptionPhrase } from "../components/Captions";
import {
  BenefitChips,
  ProductCard,
  ProgressBar,
} from "../presentation/Overlays";
import { EndCard, Flash, Hook, Logo, PhoneBadge, Promo, Steps } from "./Brand";
import {
  clips,
  MOMENTS,
  PHRASES,
  SPEECH_FRAMES,
  srcToFrame,
  srcToOut,
  TOTAL_FRAMES,
} from "./edit";

// 9:16 UGC tutorial (Reels / TikTok / Stories): how to use the AURA BIO 5-in-1 hair pack.
// Footage is pre-processed (8K → 1080×1920, stabilised, colour graded, voice cleaned): see README.
const FOOTAGE = staticFile("footage/ugc.mp4");

// Jump cut with alternating punch-in (1.0 ↔ 1.1) to hide the cut, plus a slow push-in
const Clip: React.FC<{
  readonly index: number;
  readonly trimBefore: number;
  readonly duration: number;
}> = ({ index, trimBefore, duration }) => {
  const frame = useCurrentFrame();
  const base = index % 2 === 0 ? 1 : 1.1;
  const push = interpolate(frame, [0, duration], [0, 0.03], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{ scale: String(base + push), transformOrigin: "50% 55%" }}
    >
      <Video
        src={FOOTAGE}
        trimBefore={trimBefore}
        durationInFrames={duration}
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  );
};

const phrases: CaptionPhrase[] = PHRASES.map((p) => ({
  start: srcToOut(p.start),
  end: srcToOut(p.end),
  text: p.text,
  emphasis: p.emphasis,
}));

export const UgcTutorial: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = srcToFrame;

  const whooshes = [
    MOMENTS.sidr,
    MOMENTS.applicator,
    MOMENTS.derma,
    MOMENTS.oil,
    MOMENTS.brush,
  ];
  const pops = [MOMENTS.clean, MOMENTS.blood];
  const flashes = [MOMENTS.applicator, MOMENTS.derma, MOMENTS.brush];

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
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {flashes.map((t) => (
        <Flash key={t} at={f(t)} />
      ))}

      {/* ---------- Graphics ---------- */}
      <Hook end={f(MOMENTS.hookEnd)} />
      <ProductCard
        from={f(MOMENTS.sidr)}
        to={f(MOMENTS.sidrEnd)}
        title="سدر طبيعي"
        subtitle="عوض الشامبو"
      />
      <BenefitChips
        from={f(MOMENTS.clean)}
        to={f(MOMENTS.cleanEnd)}
        items={["ينظّف فروة الراس"]}
        step={7}
      />
      <ProductCard
        from={f(MOMENTS.applicator)}
        to={f(MOMENTS.applicatorEnd)}
        title="الأبليكاتور"
        subtitle="يوزّع السدر على الراس"
      />
      <Steps
        from={f(MOMENTS.mix)}
        to={f(MOMENTS.mixEnd)}
        items={["مغرفة سدر", "ماء", "نخلطو"]}
        step={22}
      />
      <ProductCard
        from={f(MOMENTS.derma)}
        to={f(MOMENTS.dermaEnd)}
        title="ديرما رولر 540"
        subtitle="مرتين في الجمعة ماكثرش"
      />
      <ProductCard
        from={f(MOMENTS.oil)}
        to={f(MOMENTS.oilEnd)}
        title="زيت إكليل الجبل"
        subtitle="شوية قطرات بعد الديرما"
      />
      <ProductCard
        from={f(MOMENTS.brush)}
        to={f(MOMENTS.brushEnd)}
        title="فرشاة المساج"
        subtitle="كل ليلة قبل النوم"
      />
      <BenefitChips
        from={f(MOMENTS.blood)}
        to={f(MOMENTS.bloodEnd)}
        items={["تنشّط الدورة الدموية"]}
        step={7}
      />
      <Promo from={f(MOMENTS.promo)} to={SPEECH_FRAMES} />

      <Sequence durationInFrames={SPEECH_FRAMES} name="Subtitles">
        <CaptionTrack phrases={phrases} top={1230} fontSize={80} />
      </Sequence>

      <Sequence
        from={SPEECH_FRAMES}
        durationInFrames={TOTAL_FRAMES - SPEECH_FRAMES}
        name="End card"
        premountFor={fps}
      >
        <EndCard />
      </Sequence>

      {/* ---------- Brand: logo + order line on screen the whole video ---------- */}
      <Logo />
      <Sequence durationInFrames={SPEECH_FRAMES} name="Phone badge">
        <PhoneBadge />
      </Sequence>
      <ProgressBar total={TOTAL_FRAMES} />

      {/* ---------- Music bed: very low under the voice, up on the end card ---------- */}
      <Audio
        name="Music under voice"
        src={staticFile("audio/music.mp3")}
        trimBefore={4 * fps}
        loop
        durationInFrames={SPEECH_FRAMES}
        volume={0.06}
        premountFor={fps}
      />
      <Audio
        name="Music end card"
        from={SPEECH_FRAMES}
        src={staticFile("audio/music.mp3")}
        trimBefore={24 * fps}
        volume={0.45}
        premountFor={fps}
      />

      {/* ---------- Sound design ---------- */}
      <Audio
        name="Impact · hook"
        src={staticFile("audio/impact.mp3")}
        volume={0.3}
        premountFor={fps}
      />
      <Audio
        name="Pop · hook 2"
        from={12}
        src={staticFile("audio/pop.mp3")}
        volume={0.5}
        premountFor={fps}
      />
      {whooshes.map((t) => (
        <Audio
          key={`w${t}`}
          name="Whoosh · product card"
          from={Math.max(0, f(t) - 8)}
          src={staticFile("audio/whoosh.mp3")}
          volume={0.35}
          premountFor={fps}
        />
      ))}
      {pops.map((t) => (
        <Audio
          key={`p${t}`}
          name="Pop · benefit"
          from={f(t)}
          src={staticFile("audio/pop.mp3")}
          volume={0.5}
          premountFor={fps}
        />
      ))}
      {[0, 22, 44].map((d) => (
        <Audio
          key={`c${d}`}
          name="Click · mixing step"
          from={f(MOMENTS.mix) + d}
          src={staticFile("audio/click.mp3")}
          volume={0.5}
          premountFor={fps}
        />
      ))}
      <Audio
        name="Shimmer · oil"
        from={f(MOMENTS.oil) + 4}
        src={staticFile("audio/shimmer.mp3")}
        volume={0.25}
        premountFor={fps}
      />
      <Audio
        name="Cash bell · promo"
        from={f(MOMENTS.promo) + 15}
        src={staticFile("audio/cash-bell.mp3")}
        volume={0.45}
        premountFor={fps}
      />
      <Audio
        name="Riser → end card"
        from={SPEECH_FRAMES - 45}
        src={staticFile("audio/riser.mp3")}
        volume={0.3}
        premountFor={fps}
      />
      <Audio
        name="Impact · end card"
        from={SPEECH_FRAMES}
        src={staticFile("audio/impact.mp3")}
        volume={0.3}
        premountFor={fps}
      />
      <Audio
        name="Pop · CTA"
        from={SPEECH_FRAMES + 32}
        src={staticFile("audio/pop.mp3")}
        volume={0.55}
        premountFor={fps}
      />
    </AbsoluteFill>
  );
};
