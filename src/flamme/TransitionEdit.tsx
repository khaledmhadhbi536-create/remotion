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
  INTRO_SHOT,
  OFFER,
  type Shot,
  SHOTS,
  TOTAL_FRAMES,
} from "./config";

// Punchy "CapCut" grade: crushed blacks, hot colours
const GRADE = "contrast(1.28) saturate(1.3) brightness(0.96)";
const DUO = "grayscale(1) contrast(1.5) brightness(1.15)";
const ENTRY_FRAMES = 7;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const outExpo = Easing.out(Easing.exp);
const inOutCubic = Easing.inOut(Easing.cubic);

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
  amount > 45 ? 60 : amount > 25 ? 36 : amount > 12 ? 18 : 8;

const Photo: React.FC<{
  readonly src: string;
  readonly focusY?: number;
  readonly filter?: string;
  readonly style?: React.CSSProperties;
}> = ({ src, focusY = 50, filter = GRADE, style }) => (
  <Img
    src={staticFile(src)}
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: `50% ${focusY}%`,
      filter,
      ...style,
    }}
  />
);

// Magenta duotone: grayscale photo multiplied by pink (whites → pink, blacks stay black)
const Duotone: React.FC<{
  readonly src: string;
  readonly focusY?: number;
  readonly style?: React.CSSProperties;
}> = ({ src, focusY, style }) => (
  <AbsoluteFill style={style}>
    <Photo src={src} focusY={focusY} filter={DUO} />
    <AbsoluteFill
      style={{ backgroundColor: FN_COLORS.pink, mixBlendMode: "multiply" }}
    />
  </AbsoluteFill>
);

// Dark cinematic edges, like the reference
const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.5) 85%, rgba(0,0,0,0.78) 100%)",
    }}
  />
);

const WhiteBar: React.FC<{ readonly top: number; readonly h: number }> = ({
  top,
  h,
}) => (
  <div
    style={{
      position: "absolute",
      left: "8%",
      right: "8%",
      top: `${top}%`,
      height: `${h}%`,
      background: "rgba(255,240,246,0.92)",
      boxShadow: "0 0 30px rgba(255,255,255,0.8)",
    }}
  />
);

// ---------------------------------------------------------------------------
// 1 · Build-up: duotone strips stack up on black, light bars flash, then a white
//     vertical bar wipes left → right and reveals the full-colour shot on the drop.
const BANDS = 9;
const BAND_ORDER = [4, 3, 5, 2, 6, 1, 7, 0, 8];

const StripsIntro: React.FC = () => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const wipeStart = INTRO_FRAMES - BEAT;
  const wipe = interpolate(f, [wipeStart, INTRO_FRAMES - 1], [0, 100], {
    ...clamp,
    easing: inOutCubic,
  });
  const bandH = 100 / BANDS;
  return (
    <AbsoluteFill style={{ backgroundColor: FN_COLORS.black }}>
      {BAND_ORDER.map((band, k) => {
        const appear = 2 + k * 5;
        if (f < appear) return null;
        const slide = interpolate(f, [appear, appear + 5], [1, 0], {
          ...clamp,
          easing: outExpo,
        });
        const dir = k % 2 === 0 ? 1 : -1;
        const top = band * bandH;
        // bands are inset a little at the sides, like the reference
        const inset = 4 + random(`bi${band}`) * 10;
        return (
          <AbsoluteFill
            key={band}
            style={{
              clipPath: `inset(${top}% ${inset}% ${100 - top - bandH + 0.4}% ${inset}%)`,
              transform: `translateX(${dir * slide * width * 0.4}px)`,
            }}
          >
            <Duotone src={INTRO_SHOT} style={{ transform: "scale(1.12)" }} />
          </AbsoluteFill>
        );
      })}

      {/* Light bars on the off-beats of the build-up */}
      {[BEAT * 1.5, BEAT * 2.5].map((d, i) =>
        f >= d && f < d + 4 ? (
          <WhiteBar key={i} top={i === 0 ? 30 : 58} h={3.5} />
        ) : null,
      )}

      {/* Drop: full colour revealed behind a white vertical bar */}
      {f >= wipeStart ? (
        <>
          <AbsoluteFill style={{ clipPath: `inset(0 ${100 - wipe}% 0 0)` }}>
            <Photo src={INTRO_SHOT} style={{ transform: "scale(1.12)" }} />
          </AbsoluteFill>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `calc(${wipe}% - ${width * 0.04}px)`,
              width: width * 0.08,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.95) 40%, rgba(255,255,255,0.95) 60%, rgba(255,255,255,0))",
              opacity: wipe < 99 ? 1 : 0,
            }}
          />
        </>
      ) : null}

      <Vignette />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 2 · One shot. The previous shot stays visible underneath while the new one
//     comes in (window, diamond, glitch), as in the reference.
const ShotView: React.FC<{
  readonly shot: Shot;
  readonly prev: { src: string; focusY?: number };
  readonly index: number;
}> = ({ shot, prev, index }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const dur = shot.beats * BEAT;
  const focusY = shot.focusY ?? 50;
  const sinceBeat = f % BEAT;
  const inEntry = f < ENTRY_FRAMES;

  const push = interpolate(f, [0, dur], [1.12, 1.04], clamp);
  const punch = 0.1 * Math.exp(-sinceBeat / 2.5);
  const shakeAmt = sinceBeat < 4 ? (4 - sinceBeat) * 4 : 0;
  const sx = (random(`sx${index}-${f}`) - 0.5) * shakeAmt;
  const sy = (random(`sy${index}-${f}`) - 0.5) * shakeAmt;
  const t = interpolate(f, [0, ENTRY_FRAMES], [0, 1], {
    ...clamp,
    easing: outExpo,
  });

  let x = 0;
  let extraScale = 0;
  let rotate = 0;
  let blur = 0;
  let clipPath: string | undefined;
  if (shot.entry === "whip") {
    x = (1 - t) * width * 0.9;
    blur = (1 - t) * 70;
  } else if (shot.entry === "spin") {
    extraScale = (1 - t) * 0.5;
    rotate = (1 - t) * -25;
  } else if (shot.entry === "window" && inEntry) {
    // box opens from a random spot, like a picture-in-picture growing to full frame
    const cx = 25 + random(`wx${index}`) * 50;
    const cy = 30 + random(`wy${index}`) * 40;
    const w = interpolate(t, [0, 1], [18, 100]);
    const h = interpolate(t, [0, 1], [12, 100]);
    const l = Math.max(0, cx - w / 2) * (1 - t);
    const tp = Math.max(0, cy - h / 2) * (1 - t);
    clipPath = `inset(${tp}% ${Math.max(0, 100 - l - w)}% ${Math.max(0, 100 - tp - h)}% ${l}%)`;
  } else if (shot.entry === "diamond" && inEntry) {
    const r = interpolate(t, [0, 1], [0, 110]);
    clipPath = `polygon(50% ${50 - r}%, ${50 + r}% 50%, 50% ${50 + r}%, ${50 - r}% 50%)`;
  } else if (shot.entry === "cut") {
    extraScale = 0.15 * Math.exp(-f / 2.5);
  }

  const scale = push + punch + extraScale;
  const transform = `translate(${x + sx}px, ${sy}px) scale(${scale}) rotate(${rotate}deg)`;
  const filter = blur > 3 ? `${GRADE} url(#mblur-${blurId(blur)})` : GRADE;
  const showPrev =
    inEntry &&
    (shot.entry === "window" ||
      shot.entry === "diamond" ||
      shot.entry === "whip");

  return (
    <AbsoluteFill
      style={{ backgroundColor: FN_COLORS.black, overflow: "hidden" }}
    >
      {showPrev ? (
        <Photo
          src={prev.src}
          focusY={prev.focusY}
          style={{
            transform: `translateX(${shot.entry === "whip" ? -t * width * 0.9 : 0}px) scale(1.06)`,
            filter:
              shot.entry === "whip"
                ? `${GRADE} url(#mblur-${blurId(t * 70)})`
                : GRADE,
          }}
        />
      ) : null}

      <AbsoluteFill style={{ clipPath }}>
        <Photo src={shot.src} focusY={focusY} style={{ transform, filter }} />
      </AbsoluteFill>

      {/* Ghost copies: horizontal for whips, rotational for spins */}
      {inEntry && (shot.entry === "whip" || shot.entry === "spin")
        ? [1, 2, 3].map((k) => (
            <Photo
              key={k}
              src={shot.src}
              focusY={focusY}
              style={{
                opacity: (1 - t) * (0.45 - k * 0.1),
                mixBlendMode: "screen",
                filter,
                transform:
                  shot.entry === "whip"
                    ? `translate(${x + sx + k * 90}px, ${sy}px) scale(${scale})`
                    : `scale(${scale + k * 0.08}) rotate(${rotate - k * 9 * (1 - t)}deg)`,
              }}
            />
          ))
        : null}

      {/* White outline of the window / diamond while it opens */}
      {shot.entry === "window" && inEntry ? (
        <AbsoluteFill
          style={{
            clipPath,
            boxShadow: `inset 0 0 0 ${width * 0.012}px rgba(255,255,255,${1 - t})`,
          }}
        />
      ) : null}
      {shot.entry === "diamond" && inEntry ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: Math.min(width, height) * 2.2 * t,
            height: Math.min(width, height) * 2.2 * t,
            transform: "translate(-50%, -50%) rotate(45deg)",
            border: `${width * 0.012}px solid rgba(255,255,255,${0.9 * (1 - t)})`,
          }}
        />
      ) : null}

      {shot.entry === "glitch" ? (
        <Glitch shot={shot} prev={prev} index={index} />
      ) : null}

      {shot.entry === "tint" && f < 6 ? (
        <AbsoluteFill
          style={{
            backgroundColor: FN_COLORS.ice,
            mixBlendMode: "color",
            opacity: interpolate(f, [0, 6], [0.85, 0], clamp),
          }}
        />
      ) : null}

      {shot.entry === "flash" ? (
        <AbsoluteFill
          style={{
            backgroundColor: FN_COLORS.white,
            opacity: interpolate(f, [0, 4], [1, 0], clamp),
          }}
        />
      ) : null}

      {/* Small white flash on each beat inside long shots */}
      {sinceBeat < 2 && f >= BEAT ? (
        <AbsoluteFill
          style={{ backgroundColor: FN_COLORS.white, opacity: 0.3 }}
        />
      ) : null}

      <Vignette />

      {shot.caption ? <Caption text={shot.caption} /> : null}
    </AbsoluteFill>
  );
};

// White bar over the previous shot, then pink duotone slices + a big X sweep
const Glitch: React.FC<{
  readonly shot: Shot;
  readonly prev: { src: string; focusY?: number };
  readonly index: number;
}> = ({ shot, prev, index }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const end = BEAT;
  if (f >= end) return null;
  if (f < 2) {
    return (
      <AbsoluteFill>
        <Photo src={prev.src} focusY={prev.focusY} />
        <WhiteBar top={44} h={6} />
      </AbsoluteFill>
    );
  }
  const slices = 9;
  const strength = interpolate(f, [2, end], [1, 0], clamp);
  const diag = Math.hypot(width, height) * 1.1;
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
          <AbsoluteFill
            key={i}
            style={{
              clipPath: `inset(${top}% 0 ${100 - top - 100 / slices}% 0)`,
              transform: `translateX(${off}px)`,
              opacity: strength > 0.3 ? 1 : strength / 0.3,
            }}
          >
            <Duotone
              src={shot.src}
              focusY={shot.focusY}
              style={{ transform: "scale(1.15)" }}
            />
          </AbsoluteFill>
        );
      })}
      {[45, -45].map((r) => (
        <div
          key={r}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: diag,
            height: width * 0.09,
            marginLeft: -diag / 2,
            marginTop: -width * 0.045,
            transform: `translateX(${interpolate(f, [2, end], [-width * 0.25, width * 0.15])}px) rotate(${r}deg)`,
            background: "rgba(255,225,240,0.85)",
            filter: "blur(6px)",
            opacity: strength,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

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
        // keep clear of the TikTok / Reels UI at the bottom
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

// ---------------------------------------------------------------------------
// 3 · Diagonal wipe to black over the last shot, then the offer.
const OUTRO_WIPE = 9;

const EndCard: React.FC<{ readonly last: Shot }> = ({ last }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tall = height > 1500;
  const zoom = interpolate(f, [0, END_FRAMES], [1.2, 1.05], clamp);
  const d0 = OUTRO_WIPE + 2;
  const rise = (d: number) => ({
    opacity: interpolate(f, [d0 + d, d0 + d + 5], [0, 1], clamp),
    transform: `translateY(${interpolate(f, [d0 + d, d0 + d + 8], [60, 0], { ...clamp, easing: outExpo })}px) scale(${1 + 0.12 * Math.exp(-Math.max(0, f - d0 - d) / 3)})`,
  });
  // diagonal edge travelling from bottom-left to top-right
  const p = interpolate(f, [0, OUTRO_WIPE], [-20, 220], {
    ...clamp,
    easing: inOutCubic,
  });
  return (
    <AbsoluteFill
      style={{ backgroundColor: FN_COLORS.black, overflow: "hidden" }}
    >
      <Photo
        src={OFFER.hero}
        focusY={45}
        style={{
          transform: `scale(${zoom})`,
          opacity: interpolate(
            f,
            [OUTRO_WIPE, OUTRO_WIPE + 10],
            [0, 0.55],
            clamp,
          ),
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(7,7,10,0.2) 0%, rgba(7,7,10,0.85) 60%, ${FN_COLORS.black} 100%)`,
        }}
      />

      {f < OUTRO_WIPE + 1 ? (
        <>
          {/* last shot, eaten by a black diagonal */}
          <AbsoluteFill
            style={{
              clipPath: `polygon(${p}% 0, 100% 0, 100% 100%, ${p - 60}% 100%)`,
            }}
          >
            <Photo src={last.src} focusY={last.focusY} />
          </AbsoluteFill>
          <div
            style={{
              position: "absolute",
              top: "-20%",
              bottom: "-20%",
              left: `${p - 30}%`,
              width: width * 0.12,
              transform: "skewX(-28deg)",
              background: "rgba(200,200,205,0.9)",
            }}
          />
        </>
      ) : null}

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
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
const shotStarts = (() => {
  const out: number[] = [];
  let acc = INTRO_FRAMES;
  for (const s of SHOTS) {
    out.push(acc);
    acc += s.beats * BEAT;
  }
  return out;
})();
const END_START = TOTAL_FRAMES - END_FRAMES;

const SFX: Record<Entry, [string, number]> = {
  cut: ["impact", 0.45],
  whip: ["whoosh", 0.55],
  window: ["click", 0.55],
  spin: ["whoosh", 0.5],
  diamond: ["pop", 0.5],
  tint: ["click", 0.45],
  glitch: ["impact", 0.6],
  flash: ["click", 0.6],
};

export const FlammeTransitionEdit: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: FN_COLORS.black }}>
      <MotionBlurDefs />
      <Sequence durationInFrames={INTRO_FRAMES} name="Build-up (strips)">
        <StripsIntro />
      </Sequence>
      {SHOTS.map((s, i) => (
        <Sequence
          key={i}
          from={shotStarts[i]}
          durationInFrames={s.beats * BEAT}
          name={`Shot ${i + 1} · ${s.entry}`}
        >
          <ShotView
            shot={s}
            index={i}
            prev={i === 0 ? { src: INTRO_SHOT } : SHOTS[i - 1]}
          />
        </Sequence>
      ))}
      <Sequence from={END_START} durationInFrames={END_FRAMES} name="End card">
        <EndCard last={SHOTS[SHOTS.length - 1]} />
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
        name="Riser (build-up)"
        src={staticFile("audio/riser.mp3")}
        volume={0.5}
        premountFor={fps}
      />
      <Audio
        name="Drop"
        from={INTRO_FRAMES - 2}
        src={staticFile("audio/impact.mp3")}
        volume={0.7}
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
        name="Outro whoosh"
        from={END_START - 2}
        src={staticFile("audio/whoosh.mp3")}
        volume={0.55}
        premountFor={fps}
      />
      <Audio
        name="Cash bell"
        from={END_START + OUTRO_WIPE + 2 + BEAT}
        src={staticFile("audio/cash-bell.mp3")}
        volume={0.6}
        premountFor={fps}
      />
    </AbsoluteFill>
  );
};
