import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { bodyFont, brandFont, displayFont } from "../theme";
import {
  BEAT,
  END_FRAMES,
  type Entry,
  FN_COLORS,
  INTRO_FRAMES,
  OFFER,
  type Shot,
  SHOTS,
  TOTAL_FRAMES,
} from "./config";

// Punchy "CapCut" grade: crushed blacks, hot colours, slight sharpen feel via contrast
const GRADE = "contrast(1.28) saturate(1.3) brightness(0.96)";
const ENTRY_FRAMES = 6;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const outExpo = Easing.out(Easing.exp);

// Horizontal motion blur (SVG filter, referenced from CSS as url(#mblur-N))
const MotionBlurDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    {[8, 18, 36, 60].map((s) => (
      <filter
        key={s}
        id={`mblur-${s}`}
        x="-20%"
        y="0"
        width="140%"
        height="100%"
      >
        <feGaussianBlur stdDeviation={`${s} 0`} />
      </filter>
    ))}
  </svg>
);
const blurId = (amount: number) =>
  amount > 45 ? 60 : amount > 25 ? 36 : amount > 12 ? 18 : amount > 3 ? 8 : 0;

const Photo: React.FC<{
  readonly src: string;
  readonly focusY: number;
  readonly style?: React.CSSProperties;
}> = ({ src, focusY, style }) => (
  <Img
    src={staticFile(src)}
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: `50% ${focusY}%`,
      filter: GRADE,
      ...style,
    }}
  />
);

// One shot: slow push-in, a punch-zoom + shake on every beat, and its entry transition
const ShotView: React.FC<{ readonly shot: Shot; readonly index: number }> = ({
  shot,
  index,
}) => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const dur = shot.beats * BEAT;
  const focusY = shot.focusY ?? 50;
  const sinceBeat = f % BEAT;

  const push = interpolate(f, [0, dur], [1.12, 1.04], clamp);
  const punch = 0.14 * Math.exp(-sinceBeat / 2.5);
  const shakeAmt = sinceBeat < 5 ? (5 - sinceBeat) * 4 : 0;
  const sx = (random(`sx${index}-${f}`) - 0.5) * shakeAmt;
  const sy = (random(`sy${index}-${f}`) - 0.5) * shakeAmt;

  const t = interpolate(f, [0, ENTRY_FRAMES], [0, 1], {
    ...clamp,
    easing: outExpo,
  });
  const inEntry = f < ENTRY_FRAMES;

  let x = 0;
  let extraScale = 0;
  let blur = 0;
  if (shot.entry === "whip") {
    x = (1 - t) * width * 0.9;
    blur = (1 - t) * 70;
  } else if (shot.entry === "zoom") {
    extraScale = (1 - t) * 0.6;
  }

  const base: React.CSSProperties = {
    transform: `translate(${x + sx}px, ${sy}px) scale(${push + punch + extraScale})`,
    filter: blur > 3 ? `${GRADE} url(#mblur-${blurId(blur)})` : GRADE,
  };

  return (
    <AbsoluteFill
      style={{ backgroundColor: FN_COLORS.black, overflow: "hidden" }}
    >
      <Photo src={shot.src} focusY={focusY} style={base} />

      {/* Echo layers: offset ghost copies while the shot comes in (stacked tracks in the reference) */}
      {inEntry && shot.entry !== "glitch"
        ? [1, 2, 3].map((k) => (
            <Photo
              key={k}
              src={shot.src}
              focusY={focusY}
              style={{
                ...base,
                opacity: (1 - t) * (0.45 - k * 0.1),
                transform: `translate(${x + sx + (shot.entry === "whip" ? k * 90 : 0)}px, ${sy}px) scale(${push + punch + extraScale + (shot.entry === "zoom" ? k * 0.12 : 0)})`,
                mixBlendMode: "screen",
              }}
            />
          ))
        : null}

      {shot.entry === "glitch" && f < ENTRY_FRAMES + 2 ? (
        <Glitch shot={shot} index={index} />
      ) : null}

      {shot.entry === "flash" ? (
        <AbsoluteFill
          style={{
            backgroundColor: FN_COLORS.white,
            opacity: interpolate(f, [0, 4], [1, 0], clamp),
          }}
        />
      ) : null}

      {/* Mini white flash on each beat inside long shots */}
      {sinceBeat < 2 && f >= BEAT ? (
        <AbsoluteFill
          style={{ backgroundColor: FN_COLORS.white, opacity: 0.35 }}
        />
      ) : null}

      <Vignette />

      {shot.caption ? <Caption text={shot.caption} /> : null}
    </AbsoluteFill>
  );
};

// Pink RGB slices + a big X sweep (the magenta frame of the reference)
const Glitch: React.FC<{ readonly shot: Shot; readonly index: number }> = ({
  shot,
  index,
}) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const slices = 9;
  const strength = interpolate(f, [0, ENTRY_FRAMES + 2], [1, 0], clamp);
  return (
    <AbsoluteFill>
      {Array.from({ length: slices }).map((_, i) => {
        const top = (i / slices) * 100;
        const off =
          (random(`g${index}-${i}-${Math.floor(f / 2)}`) - 0.5) *
          width *
          0.35 *
          strength;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              clipPath: `inset(${top}% 0 ${100 - top - 100 / slices}% 0)`,
              transform: `translateX(${off}px)`,
            }}
          >
            <Photo
              src={shot.src}
              focusY={shot.focusY ?? 50}
              style={{ transform: "scale(1.15)" }}
            />
          </div>
        );
      })}
      <AbsoluteFill
        style={{
          backgroundColor: FN_COLORS.pink,
          mixBlendMode: "color",
          opacity: 0.75 * strength,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: FN_COLORS.pink,
          mixBlendMode: "screen",
          opacity: 0.25 * strength,
        }}
      />
      {[45, -45].map((r) => (
        <div
          key={r}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: Math.hypot(width, height) * 1.1,
            height: width * 0.09,
            marginLeft: (-Math.hypot(width, height) * 1.1) / 2,
            marginTop: -width * 0.045,
            transform: `translateX(${interpolate(f, [0, ENTRY_FRAMES + 2], [-width * 0.25, width * 0.1])}px) rotate(${r}deg)`,
            background: "rgba(255,225,240,0.85)",
            filter: "blur(6px)",
            opacity: strength,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// Dark cinematic edges, like the reference
const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.8) 100%)",
    }}
  />
);

const Caption: React.FC<{ readonly text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const pop = interpolate(f, [2, 7], [1.6, 1], { ...clamp, easing: outExpo });
  const op = interpolate(f, [2, 4], [0, 1], clamp);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        // keep clear of TikTok/Reels UI at the bottom
        paddingBottom: height > 1500 ? height * 0.27 : height * 0.12,
      }}
    >
      <div
        style={{
          fontFamily: displayFont,
          fontSize: width * 0.115,
          color: FN_COLORS.white,
          direction: "rtl",
          textAlign: "center",
          lineHeight: 1.15,
          padding: "0 6%",
          transform: `scale(${pop})`,
          opacity: op,
          textShadow: `0 0 24px rgba(0,0,0,0.9), 4px 0 0 ${FN_COLORS.pink}, -4px 0 0 #2BD9FF`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const letters = OFFER.brand.split("");
  return (
    <AbsoluteFill
      style={{
        backgroundColor: FN_COLORS.black,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: brandFont,
          fontWeight: 800,
          fontSize: width * 0.082,
          letterSpacing: width * 0.006,
          color: FN_COLORS.gold,
        }}
      >
        {letters.map((ch, i) => {
          const d = i * 1.2;
          const o = interpolate(f, [d, d + 3], [0, 1], clamp);
          const jitter = f - d < 4 ? (random(`i${i}-${f}`) - 0.5) * 40 : 0;
          return (
            <span
              key={i}
              style={{
                opacity: o,
                transform: `translate(${jitter}px, ${(1 - o) * -30}px)`,
                textShadow: `3px 0 0 ${FN_COLORS.pink}, -3px 0 0 #2BD9FF, 0 0 30px ${FN_COLORS.red}`,
                whiteSpace: "pre",
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      <AbsoluteFill
        style={{
          backgroundColor: FN_COLORS.white,
          opacity: interpolate(
            f,
            [INTRO_FRAMES - 3, INTRO_FRAMES],
            [0, 1],
            clamp,
          ),
        }}
      />
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tall = height > 1500;
  const zoom = interpolate(f, [0, END_FRAMES], [1.2, 1.05], clamp);
  const rise = (d: number) => ({
    opacity: interpolate(f, [d, d + 5], [0, 1], clamp),
    transform: `translateY(${interpolate(f, [d, d + 8], [60, 0], { ...clamp, easing: outExpo })}px) scale(${1 + 0.12 * Math.exp(-Math.max(0, f - d) / 3)})`,
  });
  return (
    <AbsoluteFill
      style={{ backgroundColor: FN_COLORS.black, overflow: "hidden" }}
    >
      <Photo
        src={OFFER.hero}
        focusY={45}
        style={{ transform: `scale(${zoom})`, opacity: 0.55 }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(7,7,10,0.2) 0%, rgba(7,7,10,0.85) 60%, ${FN_COLORS.black} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: width * 0.035,
          paddingBottom: tall ? height * 0.12 : 0,
        }}
      >
        <div
          style={{
            fontFamily: brandFont,
            fontWeight: 800,
            fontSize: width * 0.085,
            letterSpacing: width * 0.01,
            color: FN_COLORS.gold,
            ...rise(0),
          }}
        >
          {OFFER.brand}
        </div>
        <div
          style={{
            fontFamily: displayFont,
            fontSize: width * 0.2,
            color: FN_COLORS.white,
            direction: "rtl",
            lineHeight: 1,
            textShadow: `5px 0 0 ${FN_COLORS.pink}, -5px 0 0 #2BD9FF`,
            ...rise(BEAT),
          }}
        >
          {OFFER.price}
        </div>
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 800,
            fontSize: width * 0.05,
            color: FN_COLORS.white,
            direction: "rtl",
            ...rise(BEAT * 2),
          }}
        >
          {OFFER.note}
        </div>
        <div
          style={{
            marginTop: width * 0.02,
            padding: `${width * 0.02}px ${width * 0.08}px`,
            borderRadius: width,
            backgroundColor: FN_COLORS.red,
            fontFamily: displayFont,
            fontSize: width * 0.075,
            color: FN_COLORS.white,
            direction: "rtl",
            boxShadow: `0 0 ${40 + 20 * Math.sin(f / 4)}px ${FN_COLORS.red}`,
            ...rise(BEAT * 3),
          }}
        >
          {OFFER.headline} ·{" "}
          <span style={{ direction: "ltr", unicodeBidi: "isolate" }}>
            {OFFER.phone}
          </span>
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundColor: FN_COLORS.white,
          opacity: interpolate(f, [0, 4], [1, 0], clamp),
        }}
      />
    </AbsoluteFill>
  );
};

const shotStarts = (() => {
  const out: number[] = [];
  let acc = INTRO_FRAMES;
  for (const s of SHOTS) {
    out.push(acc);
    acc += s.beats * BEAT;
  }
  return out;
})();
const END_START = INTRO_FRAMES + SHOTS.reduce((s, x) => s + x.beats * BEAT, 0);

const SFX: Record<Entry, [string, number]> = {
  whip: ["whoosh", 0.55],
  glitch: ["impact", 0.5],
  flash: ["click", 0.6],
  zoom: ["whoosh", 0.45],
};

export const FlammeTransitionEdit: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: FN_COLORS.black }}>
      <MotionBlurDefs />
      <Sequence durationInFrames={INTRO_FRAMES} name="Intro">
        <Intro />
      </Sequence>
      {SHOTS.map((s, i) => (
        <Sequence
          key={i}
          from={shotStarts[i]}
          durationInFrames={s.beats * BEAT}
          name={`Shot ${i + 1} · ${s.entry}`}
        >
          <ShotView shot={s} index={i} />
        </Sequence>
      ))}
      <Sequence from={END_START} durationInFrames={END_FRAMES} name="End card">
        <EndCard />
      </Sequence>

      <Audio
        name="Music"
        src={staticFile("audio/music-18s.mp3")}
        volume={(f) =>
          interpolate(f, [TOTAL_FRAMES - 20, TOTAL_FRAMES], [0.75, 0], clamp)
        }
        premountFor={fps}
      />
      <Audio
        name="Riser"
        src={staticFile("audio/riser.mp3")}
        volume={0.4}
        premountFor={fps}
      />
      {SHOTS.map((s, i) => (
        <Audio
          key={`sfx${i}`}
          name={`${SFX[s.entry][0]} → shot ${i + 1}`}
          from={Math.max(0, shotStarts[i] - 2)}
          src={staticFile(`audio/${SFX[s.entry][0]}.mp3`)}
          volume={SFX[s.entry][1]}
          premountFor={fps}
        />
      ))}
      <Audio
        name="Cash bell"
        from={END_START + BEAT}
        src={staticFile("audio/cash-bell.mp3")}
        volume={0.6}
        premountFor={fps}
      />
    </AbsoluteFill>
  );
};
