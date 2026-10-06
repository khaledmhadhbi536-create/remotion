import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Freeze,
  interpolate,
  OffthreadVideo,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { bodyFont, brandFont, displayFont } from "../theme";
import {
  BEAT,
  CLIPS,
  END_FRAMES,
  type Entry,
  FN_COLORS,
  FPS,
  HERO,
  OFFER,
  type Shot,
  SHOTS,
  SHOTS_FRAMES,
  TOTAL_FRAMES,
} from "./config";

// Cinematic, high contrast, but skin and product colours stay natural
const GRADE = "contrast(1.18) saturate(1.1) brightness(0.98)";
const ENTRY = 6;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const outExpo = Easing.out(Easing.exp);

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
  amount > 45 ? 60 : amount > 25 ? 36 : amount > 12 ? 18 : 8;

const shotFrames = (s: Shot) => s.beats * BEAT;

// Speed ramps / freeze: local frame of the shot → frame of the source clip
const RAMP_FAST = 2.5;
const rateAt = (s: Shot, f: number, dur: number) => {
  if (s.freeze && f >= dur - 7) return 0;
  switch (s.ramp) {
    case "in":
      return f < 6 ? RAMP_FAST : 0.8;
    case "out":
      return f >= dur - 5 ? RAMP_FAST : 1;
    case "slow":
      return f < 4 ? RAMP_FAST : 0.45;
    default:
      return 1;
  }
};
const sourceFrame = (s: Shot, f: number) => {
  const dur = shotFrames(s);
  let t = 0;
  for (let i = 0; i < Math.min(f, dur - 1); i++) t += rateAt(s, i, dur);
  return Math.round(s.at * FPS + t);
};

// One video frame of a shot, cropped to fill the frame
const Clip: React.FC<{
  readonly shot: Shot;
  readonly f: number; // local frame of the shot
  readonly style?: React.CSSProperties;
}> = ({ shot, f, style }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <Freeze frame={sourceFrame(shot, f)}>
      <OffthreadVideo
        src={staticFile(CLIPS[shot.clip])}
        muted
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `50% ${shot.focusY ?? 50}%`,
          filter: GRADE,
          ...style,
        }}
      />
    </Freeze>
  </AbsoluteFill>
);

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.38) 88%, rgba(0,0,0,0.6) 100%)",
    }}
  />
);

// Horizontal slices: each band of the image displaced sideways, settling to 0
const Slices: React.FC<{
  readonly shot: Shot;
  readonly f: number;
  readonly strength: number; // 1 → full displacement, 0 → clean image
  readonly seed: string;
  readonly bands?: number;
  readonly rgb?: boolean;
}> = ({ shot, f, strength, seed, bands = 9, rgb }) => {
  const { width } = useVideoConfig();
  const h = 100 / bands;
  return (
    <AbsoluteFill>
      {Array.from({ length: bands }).map((_, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const off =
          dir *
          (0.25 + random(`${seed}-${i}-${Math.floor(f / 2)}`) * 0.6) *
          width *
          0.5 *
          strength;
        return (
          <AbsoluteFill
            key={i}
            style={{
              clipPath: `inset(${i * h}% 0 ${100 - (i + 1) * h - 0.2}% 0)`,
              transform: `translateX(${off}px)`,
            }}
          >
            <Clip shot={shot} f={f} />
          </AbsoluteFill>
        );
      })}
      {rgb && strength > 0.05 ? (
        <>
          <AbsoluteFill
            style={{
              backgroundColor: FN_COLORS.pink,
              mixBlendMode: "screen",
              opacity: 0.35 * strength,
              transform: `translateX(${width * 0.012}px)`,
            }}
          />
          <AbsoluteFill
            style={{
              backgroundColor: FN_COLORS.cyan,
              mixBlendMode: "multiply",
              opacity: 0.18 * strength,
              transform: `translateX(${-width * 0.012}px)`,
            }}
          />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

const ShotView: React.FC<{ readonly shot: Shot; readonly index: number }> = ({
  shot,
  index,
}) => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const dur = shotFrames(shot);
  const sinceBeat = f % BEAT;
  const t = interpolate(f, [0, ENTRY], [0, 1], { ...clamp, easing: outExpo });

  // Base movement: slow drift + small punch on every beat inside longer shots
  const drift = interpolate(f, [0, dur], [1.06, 1.1], clamp);
  const beatPunch = f >= BEAT ? 0.05 * Math.exp(-sinceBeat / 2.5) : 0;
  let scale = drift + beatPunch;
  let x = 0;
  let blur = 0;
  if (shot.entry === "cut") scale += 0.14 * Math.exp(-f / 2.5);
  if (shot.entry === "punchOut")
    scale += interpolate(f, [0, 7], [0.35, 0], { ...clamp, easing: outExpo });
  if (shot.entry === "whip") {
    x = (1 - t) * width * 0.8;
    blur = (1 - t) * 70;
  }
  // freeze-frame accent: hard zoom on the frozen frame
  const frozen = shot.freeze && f >= dur - 7;
  if (frozen) scale += 0.08;

  const shake = shot.entry !== "whip" && f < 4 ? (4 - f) * 3 : 0;
  const sx = (random(`sx${index}-${f}`) - 0.5) * shake;
  const sy = (random(`sy${index}-${f}`) - 0.5) * shake;

  const style: React.CSSProperties = {
    transform: `translate(${x + sx}px, ${sy}px) scale(${scale})`,
    filter: blur > 3 ? `${GRADE} url(#mblur-${blurId(blur)})` : GRADE,
  };

  const slicesIn = shot.entry === "slices" && f < 8;
  const glitchIn = shot.entry === "glitch" && f < 5;

  return (
    <AbsoluteFill
      style={{ backgroundColor: FN_COLORS.black, overflow: "hidden" }}
    >
      {slicesIn ? (
        <Slices
          shot={shot}
          f={f}
          seed={`s${index}`}
          strength={interpolate(f, [0, 8], [1, 0], {
            ...clamp,
            easing: outExpo,
          })}
        />
      ) : glitchIn ? (
        <Slices
          shot={shot}
          f={f}
          seed={`g${index}`}
          bands={14}
          rgb
          strength={interpolate(f, [0, 5], [0.35, 0], clamp)}
        />
      ) : (
        <Clip shot={shot} f={f} style={style} />
      )}

      {/* whip: wrap-around copy so the pan never shows black */}
      {shot.entry === "whip" && x > 1 ? (
        <Clip
          shot={shot}
          f={f}
          style={{
            ...style,
            transform: `translate(${x - width * scale}px, 0) scale(${scale})`,
          }}
        />
      ) : null}

      {/* whip: ghosted trail */}
      {shot.entry === "whip" && f < ENTRY
        ? [1, 2].map((k) => (
            <AbsoluteFill
              key={k}
              style={{
                opacity: (1 - t) * (0.35 - k * 0.1),
                mixBlendMode: "screen",
              }}
            >
              <Clip
                shot={shot}
                f={f}
                style={{
                  ...style,
                  transform: `translate(${x + k * 110}px, 0) scale(${scale})`,
                }}
              />
            </AbsoluteFill>
          ))
        : null}

      {shot.entry === "flash" ? (
        <AbsoluteFill
          style={{
            backgroundColor: FN_COLORS.white,
            opacity: interpolate(f, [0, 4], [0.95, 0], clamp),
          }}
        />
      ) : null}
      {frozen && f === dur - 7 ? (
        <AbsoluteFill
          style={{ backgroundColor: FN_COLORS.white, opacity: 0.6 }}
        />
      ) : null}

      <Vignette />
      {shot.caption ? <Caption text={shot.caption} /> : null}
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ readonly text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const pop = interpolate(f, [1, 6], [1.5, 1], { ...clamp, easing: outExpo });
  const op = interpolate(f, [1, 3], [0, 1], clamp);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: height * 0.27, // clear of the Reels / TikTok UI
      }}
    >
      <div
        style={{
          fontFamily: displayFont,
          fontSize: width * 0.13,
          color: FN_COLORS.white,
          direction: "rtl",
          textAlign: "center",
          lineHeight: 1.1,
          padding: "0 6%",
          transform: `scale(${pop})`,
          opacity: op,
          textShadow: `0 6px 30px rgba(0,0,0,0.85), 3px 0 0 ${FN_COLORS.pink}, -3px 0 0 ${FN_COLORS.cyan}`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

// Final hero shot, product stays visible; offer builds up on the beats
const Hero: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const rise = (d: number) => ({
    opacity: interpolate(f, [d, d + 4], [0, 1], clamp),
    transform: `translateY(${interpolate(f, [d, d + 7], [50, 0], { ...clamp, easing: outExpo })}px) scale(${1 + 0.12 * Math.exp(-Math.max(0, f - d) / 3)})`,
  });
  return (
    <AbsoluteFill style={{ backgroundColor: FN_COLORS.black }}>
      <Clip
        shot={HERO}
        f={f}
        style={{
          transform: `scale(${interpolate(f, [0, END_FRAMES], [1.05, 1.15])})`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(7,7,10,0) 35%, rgba(7,7,10,0.75) 62%, rgba(7,7,10,0.92) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          gap: width * 0.025,
          paddingBottom: height * 0.2,
        }}
      >
        <div
          style={{
            fontFamily: brandFont,
            fontWeight: 800,
            fontSize: width * 0.075,
            letterSpacing: width * 0.01,
            color: FN_COLORS.gold,
            ...rise(4),
          }}
        >
          {OFFER.brand}
        </div>
        <div
          style={{
            fontFamily: displayFont,
            fontSize: width * 0.17,
            color: FN_COLORS.white,
            direction: "rtl",
            lineHeight: 1,
            textShadow: `4px 0 0 ${FN_COLORS.pink}, -4px 0 0 ${FN_COLORS.cyan}`,
            ...rise(BEAT),
          }}
        >
          {OFFER.price}
        </div>
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 800,
            fontSize: width * 0.048,
            color: FN_COLORS.white,
            direction: "rtl",
            ...rise(BEAT * 2),
          }}
        >
          {OFFER.note}
        </div>
        <div
          style={{
            marginTop: width * 0.015,
            padding: `${width * 0.02}px ${width * 0.08}px`,
            borderRadius: width,
            backgroundColor: FN_COLORS.red,
            fontFamily: displayFont,
            fontSize: width * 0.072,
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
          opacity: interpolate(f, [0, 4], [0.95, 0], clamp),
        }}
      />
    </AbsoluteFill>
  );
};

// Shot starts on the beat grid (half-beats round to the nearest frame)
const starts = (() => {
  const out: number[] = [];
  let beats = 0;
  for (const s of SHOTS) {
    out.push(Math.round(beats * BEAT));
    beats += s.beats;
  }
  out.push(Math.round(beats * BEAT));
  return out;
})();

const SFX: Record<Entry, [string, number] | null> = {
  cut: null, // hard cuts ride the beat itself
  punchOut: ["click", 0.4],
  slices: ["impact", 0.45],
  glitch: ["click", 0.55],
  whip: ["whoosh", 0.5],
  flash: ["impact", 0.35],
};

export const FlammeTransitionEdit: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: FN_COLORS.black }}>
      <MotionBlurDefs />
      {SHOTS.map((s, i) => (
        <Sequence
          key={i}
          from={starts[i]}
          durationInFrames={starts[i + 1] - starts[i]}
          name={`${i + 1} · ${s.clip}@${s.at}s · ${s.entry}${s.ramp ? ` · ${s.ramp}` : ""}`}
        >
          <ShotView shot={s} index={i} />
        </Sequence>
      ))}
      <Sequence
        from={SHOTS_FRAMES}
        durationInFrames={END_FRAMES}
        name="Hero + offer"
      >
        <Hero />
      </Sequence>

      <Audio
        name="Music"
        src={staticFile("audio/phonk-20s.mp3")}
        volume={(f) =>
          interpolate(f, [TOTAL_FRAMES - 15, TOTAL_FRAMES], [0.9, 0], clamp)
        }
        premountFor={fps}
      />
      {SHOTS.map((s, i) => {
        const sfx = SFX[s.entry];
        return sfx ? (
          <Audio
            key={`sfx${i}`}
            name={`${sfx[0]} → ${i + 1}`}
            from={Math.max(0, starts[i] - (sfx[0] === "whoosh" ? 4 : 0))}
            src={staticFile(`audio/${sfx[0]}.mp3`)}
            volume={sfx[1]}
            premountFor={fps}
          />
        ) : null;
      })}
      <Audio
        name="Whoosh → hero"
        from={SHOTS_FRAMES - 4}
        src={staticFile("audio/whoosh.mp3")}
        volume={0.5}
        premountFor={fps}
      />
      <Audio
        name="Cash bell"
        from={SHOTS_FRAMES + BEAT}
        src={staticFile("audio/cash-bell.mp3")}
        volume={0.5}
        premountFor={fps}
      />
    </AbsoluteFill>
  );
};
