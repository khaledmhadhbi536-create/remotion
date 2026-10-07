import React, { createContext, useContext, useMemo } from "react";
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
  BRAND,
  CLIPS,
  type EditSpec,
  type Entry,
  FN_COLORS,
  FPS,
  type Lang,
  type Look,
  type Offer,
  type Shot,
  shotsFrames,
  SPECS,
  type SpecId,
  specFrames,
} from "./config";

// Colour looks. natural: cinematic, high contrast, skin and product colours stay true.
// golden: warm autumn grade of the "salesman funk" reference (plus a warm overlay below).
const GRADES: Record<Look, string> = {
  natural: "contrast(1.18) saturate(1.1) brightness(0.98)",
  golden:
    "sepia(0.32) saturate(1.45) contrast(1.15) hue-rotate(-8deg) brightness(1.03)",
};
const LookContext = createContext<Look>("natural");
const useGrade = () => GRADES[useContext(LookContext)];

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

// One video frame of a shot, cropped to fill the frame. `zoom` + focus reframe the
// clip (close-up / extreme close-up out of the same footage).
const Clip: React.FC<{
  readonly shot: Shot;
  readonly f: number; // local frame of the shot
  readonly style?: React.CSSProperties;
}> = ({ shot, f, style }) => {
  const grade = useGrade();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${shot.zoom ?? 1})`,
          transformOrigin: `${shot.focusX ?? 50}% ${shot.focusY ?? 50}%`,
        }}
      >
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
              filter: grade,
              ...style,
            }}
          />
        </Freeze>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Vignette: React.FC = () => {
  const look = useContext(LookContext);
  if (look === "golden") {
    return (
      <>
        <AbsoluteFill
          style={{
            backgroundColor: "#FF9A2E",
            mixBlendMode: "soft-light",
            opacity: 0.28,
          }}
        />
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(40,15,0,0) 50%, rgba(40,15,0,0.35) 88%, rgba(25,8,0,0.6) 100%)",
          }}
        />
      </>
    );
  }
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.38) 88%, rgba(0,0,0,0.6) 100%)",
      }}
    />
  );
};

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

// Mosaic blocks: rectangles of the new shot pop in one after the other over the
// previous shot (some slightly displaced), one white block flashes, then full frame.
const BLOCKS = 8;
const BLOCKS_FRAMES = 7;
const Blocks: React.FC<{
  readonly shot: Shot;
  readonly prev: Shot | null;
  readonly f: number;
  readonly seed: string;
}> = ({ shot, prev, f, seed }) => {
  const { width } = useVideoConfig();
  return (
    <AbsoluteFill>
      {prev ? <Clip shot={prev} f={shotFrames(prev) - 1} /> : null}
      {Array.from({ length: BLOCKS }).map((_, i) => {
        if (f < i * 0.75) return null;
        const w = 28 + random(`${seed}w${i}`) * 32;
        const h = 10 + random(`${seed}h${i}`) * 16;
        const l = random(`${seed}x${i}`) * (100 - w);
        const t = 4 + random(`${seed}y${i}`) * (88 - h);
        const shift =
          i % 3 === 1 ? (random(`${seed}s${i}`) - 0.5) * width * 0.12 : 0;
        const white = i === 3 && f < 4;
        return (
          <AbsoluteFill
            key={i}
            style={{
              clipPath: `inset(${t}% ${100 - l - w}% ${100 - t - h}% ${l}%)`,
            }}
          >
            {white ? (
              <AbsoluteFill
                style={{ backgroundColor: "rgba(255,250,240,0.95)" }}
              />
            ) : (
              <Clip
                shot={shot}
                f={f}
                style={{ transform: `translateX(${shift}px) scale(1.06)` }}
              />
            )}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

// Silhouette: the centre of the previous shot (where the product sits) turns black
// for a few frames, with a few glitch pixels — an approximation of the reference's
// subject cut-out — then the new shot hard-cuts in.
const SILHOUETTE_FRAMES = 3;
const Silhouette: React.FC<{
  readonly prev: Shot;
  readonly f: number;
  readonly seed: string;
}> = ({ prev, f, seed }) => {
  const pf = shotFrames(prev) - 1;
  const mask =
    "radial-gradient(ellipse 34% 40% at 50% 52%, #000 70%, transparent 100%)";
  return (
    <AbsoluteFill>
      <Clip shot={prev} f={pf} />
      <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask }}>
        <Clip shot={prev} f={pf} style={{ filter: "brightness(0)" }} />
      </AbsoluteFill>
      {Array.from({ length: 7 }).map((_, i) => {
        const size = 1.5 + random(`${seed}p${i}`) * 3;
        const colors = [FN_COLORS.pink, FN_COLORS.cyan, "#FFFFFF", "#FFB347"];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${38 + random(`${seed}px${i}${f}`) * 24}%`,
              top: `${30 + random(`${seed}py${i}${f}`) * 40}%`,
              width: `${size}%`,
              height: `${size * 0.6}%`,
              backgroundColor: colors[i % colors.length],
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const ShotView: React.FC<{
  readonly shot: Shot;
  readonly prev: Shot | null;
  readonly index: number;
  readonly lang: Lang;
}> = ({ shot, prev, index, lang }) => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const grade = useGrade();
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

  const shake =
    shot.entry !== "whip" &&
    shot.entry !== "blocks" &&
    shot.entry !== "silhouette" &&
    f < 4
      ? (4 - f) * 3
      : 0;
  const sx = (random(`sx${index}-${f}`) - 0.5) * shake;
  const sy = (random(`sy${index}-${f}`) - 0.5) * shake;

  const style: React.CSSProperties = {
    transform: `translate(${x + sx}px, ${sy}px) scale(${scale})`,
    filter: blur > 3 ? `${grade} url(#mblur-${blurId(blur)})` : grade,
  };

  const slicesIn = shot.entry === "slices" && f < 8;
  const glitchIn = shot.entry === "glitch" && f < 5;
  const blocksIn = shot.entry === "blocks" && f < BLOCKS_FRAMES;
  const silhouetteIn =
    shot.entry === "silhouette" && prev !== null && f < SILHOUETTE_FRAMES;

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
      ) : blocksIn ? (
        <Blocks shot={shot} prev={prev} f={f} seed={`b${index}`} />
      ) : silhouetteIn && prev ? (
        <Silhouette prev={prev} f={f} seed={`h${index}`} />
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
      {shot.caption ? <Caption text={shot.caption} lang={lang} /> : null}
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ readonly text: string; readonly lang: Lang }> = ({
  text,
  lang,
}) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const pop = interpolate(f, [1, 6], [1.5, 1], { ...clamp, easing: outExpo });
  const op = interpolate(f, [1, 3], [0, 1], clamp);
  const fr = lang === "fr";
  return (
    <>
      {fr ? (
        // soft dark band so the serif stays readable on busy footage
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 68%, rgba(0,0,0,0.5) 76%, rgba(0,0,0,0) 86%)",
            opacity: op,
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: height * 0.27, // clear of the Reels / TikTok UI
        }}
      >
        <div
          style={{
            fontFamily: fr ? brandFont : displayFont,
            fontWeight: fr ? 800 : undefined,
            fontSize: width * (fr ? 0.1 : 0.13),
            color: FN_COLORS.white,
            direction: fr ? "ltr" : "rtl",
            textAlign: "center",
            lineHeight: 1.1,
            padding: "0 6%",
            transform: `scale(${pop})`,
            opacity: op,
            textShadow: fr
              ? "0 4px 24px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.6)"
              : `0 6px 30px rgba(0,0,0,0.85), 3px 0 0 ${FN_COLORS.pink}, -3px 0 0 ${FN_COLORS.cyan}`,
          }}
        >
          {text}
        </div>
      </AbsoluteFill>
    </>
  );
};

// Final hero shot, product stays visible. With an offer it builds up on the beats;
// without one only the brand name fades in.
const Hero: React.FC<{
  readonly hero: Shot;
  readonly prev: Shot | null;
  readonly offer: Offer | null;
}> = ({ hero, prev, offer }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const dur = shotFrames(hero);
  const rise = (d: number) => ({
    opacity: interpolate(f, [d, d + 4], [0, 1], clamp),
    transform: `translateY(${interpolate(f, [d, d + 7], [50, 0], { ...clamp, easing: outExpo })}px) scale(${1 + 0.12 * Math.exp(-Math.max(0, f - d) / 3)})`,
  });
  const zoomStyle = {
    transform: `scale(${interpolate(f, [0, dur], [1.05, 1.15])})`,
  };
  return (
    <AbsoluteFill style={{ backgroundColor: FN_COLORS.black }}>
      {hero.entry === "blocks" && f < BLOCKS_FRAMES ? (
        <Blocks shot={hero} prev={prev} f={f} seed="hero" />
      ) : (
        <Clip shot={hero} f={f} style={zoomStyle} />
      )}
      {offer ? null : <Vignette />}
      {offer ? (
        <>
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
              {BRAND}
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
              {offer.price || offer.headline}
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
              {offer.note}
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
              {offer.price ? offer.headline : offer.phoneLabel} ·{" "}
              <span style={{ direction: "ltr", unicodeBidi: "isolate" }}>
                {offer.phone}
              </span>
            </div>
          </AbsoluteFill>
        </>
      ) : (
        <>
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(180deg, rgba(7,7,10,0) 55%, rgba(7,7,10,0.55) 80%, rgba(7,7,10,0.7) 100%)",
              opacity: interpolate(f, [BEAT, BEAT * 3], [0, 1], clamp),
            }}
          />
          <AbsoluteFill
            style={{
              justifyContent: "flex-end",
              alignItems: "center",
              paddingBottom: height * 0.27,
            }}
          >
            <div
              style={{
                fontFamily: brandFont,
                fontWeight: 800,
                fontSize: width * 0.085,
                letterSpacing: interpolate(
                  f,
                  [BEAT, dur],
                  [width * 0.004, width * 0.014],
                  clamp,
                ),
                color: FN_COLORS.gold,
                textShadow: "0 4px 24px rgba(0,0,0,0.7)",
                opacity: interpolate(f, [BEAT, BEAT * 3], [0, 1], clamp),
              }}
            >
              {BRAND}
            </div>
          </AbsoluteFill>
        </>
      )}
      {hero.entry === "flash" ? (
        <AbsoluteFill
          style={{
            backgroundColor: FN_COLORS.white,
            opacity: interpolate(f, [0, 4], [0.95, 0], clamp),
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

const SFX: Record<Entry, [string, number] | null> = {
  cut: null, // hard cuts ride the beat itself
  punchOut: ["click", 0.4],
  slices: ["impact", 0.45],
  glitch: ["click", 0.55],
  whip: ["whoosh", 0.5],
  flash: ["impact", 0.35],
  blocks: ["click", 0.45],
  silhouette: ["impact", 0.3],
};

export type FlammeEditProps = {
  readonly spec: SpecId;
  readonly withMusic: boolean;
};

export const flammeEditFrames = (spec: SpecId) => specFrames(SPECS[spec]);

export const FlammeTransitionEdit: React.FC<FlammeEditProps> = ({
  spec: specId,
  withMusic,
}) => {
  const { fps } = useVideoConfig();
  const spec: EditSpec = SPECS[specId];
  const { shots, hero } = spec;
  const total = specFrames(spec);
  const heroStart = shotsFrames(spec);

  // Shot starts on the beat grid (half-beats round to the nearest frame)
  const starts = useMemo(() => {
    const out: number[] = [];
    let beats = 0;
    for (const s of shots) {
      out.push(Math.round(beats * BEAT));
      beats += s.beats;
    }
    out.push(Math.round(beats * BEAT));
    return out;
  }, [shots]);

  return (
    <LookContext.Provider value={spec.look}>
      <AbsoluteFill style={{ backgroundColor: FN_COLORS.black }}>
        <MotionBlurDefs />
        {shots.map((s, i) => (
          <Sequence
            key={i}
            from={starts[i]}
            durationInFrames={starts[i + 1] - starts[i]}
            name={`${i + 1} · ${s.clip}@${s.at}s · ${s.entry}${s.ramp ? ` · ${s.ramp}` : ""}`}
          >
            <ShotView
              shot={s}
              prev={i > 0 ? shots[i - 1] : null}
              index={i}
              lang={spec.lang}
            />
          </Sequence>
        ))}
        <Sequence
          from={heroStart}
          durationInFrames={total - heroStart}
          name={spec.offer ? "Hero + offer" : "Hero + brand"}
        >
          <Hero
            hero={hero}
            prev={shots[shots.length - 1] ?? null}
            offer={spec.offer}
          />
        </Sequence>

        {withMusic ? (
          <Audio
            name="Music"
            src={staticFile(spec.music)}
            volume={(f) => interpolate(f, [total - 15, total], [0.9, 0], clamp)}
            premountFor={fps}
          />
        ) : null}
        {shots.map((s, i) => {
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
          from={heroStart - 4}
          src={staticFile("audio/whoosh.mp3")}
          volume={0.5}
          premountFor={fps}
        />
        {spec.offer ? (
          <Audio
            name="Cash bell"
            from={heroStart + BEAT}
            src={staticFile("audio/cash-bell.mp3")}
            volume={0.5}
            premountFor={fps}
          />
        ) : null}
      </AbsoluteFill>
    </LookContext.Provider>
  );
};
