import React from "react";
import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CaptionTrack } from "../components/Captions";
import { LightRays } from "../components/Decor";
import {
  PackGroup,
  ProductImage,
  type ProductKey,
} from "../components/ProductImage";
import { PRICES } from "../config";
import { bodyFont, colors, displayFont } from "../theme";
import {
  CAPTIONS,
  CTA_START,
  f,
  type Framing,
  HOOK_END,
  SPOTS,
  TOTAL_FRAMES,
  UGC_CUTS,
  type UgcCut,
} from "./edit";

// 9:16 UGC ad (Reels / Stories): UGC hook → B-roll of the real pack → UGC call to action.
// The voice-over drives the whole edit — see edit.ts for every timing.

const VOICE = staticFile("ugc/voice-master.m4a");
const PHOTO = staticFile("ugc/pack-photo.jpg");
const PHOTO_W = 1126;
const PHOTO_H = 2000;
const CLIPS = {
  hook: staticFile("ugc/ugc-hook.mp4"),
  cta: staticFile("ugc/ugc-cta.mp4"),
};

const GREEN = "#2EAA5A";
const YELLOW = "#FFE14D";
const CAPTION_TOP = 1260;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pop = Easing.bezier(0.2, 1.4, 0.4, 1);
const smooth = Easing.bezier(0.45, 0, 0.25, 1);

// ---------------------------------------------------------------------------
// UGC clip, re-timed (playbackRate) so the lips land on the voice-over
const UgcClip: React.FC<{ readonly cut: UgcCut }> = ({ cut }) => {
  const frame = useCurrentFrame();
  const duration = f(cut.end) - f(cut.start);
  const rate = (cut.srcEnd - cut.srcStart) / (cut.end - cut.start);
  const push = interpolate(frame, [0, duration], [0, 0.025], clamp);
  return (
    <AbsoluteFill
      style={{
        scale: String(cut.zoom + push),
        // Anchored low: the zoom crops the top of the frame (where the CTA clip has a watermark)
        transformOrigin: "50% 62%",
      }}
    >
      <Video
        src={CLIPS[cut.src]}
        trimBefore={f(cut.srcStart)}
        playbackRate={rate}
        muted
        objectFit="cover"
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// B-roll from the real photo of the pack: a framed crop that drifts like a handheld phone
const framingStyle = (
  { cx, cy, zoom }: Framing,
  width: number,
  height: number,
): React.CSSProperties => {
  const s = Math.max(width / PHOTO_W, height / PHOTO_H) * zoom;
  const w = PHOTO_W * s;
  const h = PHOTO_H * s;
  const x = Math.min(0, Math.max(width - w, width / 2 - cx * s));
  const y = Math.min(0, Math.max(height - h, height / 2 - cy * s));
  return { position: "absolute", left: x, top: y, width: w, height: h };
};

const lerpFraming = (a: Framing, b: Framing, t: number): Framing => ({
  cx: a.cx + (b.cx - a.cx) * t,
  cy: a.cy + (b.cy - a.cy) * t,
  zoom: a.zoom + (b.zoom - a.zoom) * t,
});

const PhotoShot: React.FC<{
  readonly from: Framing;
  readonly to: Framing;
  readonly duration: number;
  readonly blur?: boolean;
}> = ({ from, to, duration, blur = false }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = interpolate(frame, [0, duration], [0, 1], {
    ...clamp,
    easing: smooth,
  });
  // Cut-in punch: the first frames land 6% tighter, then settle
  const punch = interpolate(frame, [0, 7], [1.06, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const shakeX = Math.sin(frame / 9) * 5 + Math.sin(frame / 3.7) * 1.5;
  const shakeY = Math.cos(frame / 11) * 5 + Math.sin(frame / 4.3) * 1.5;
  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: colors.charcoal,
      }}
    >
      <AbsoluteFill
        style={{
          scale: String(punch * 1.03),
          translate: `${shakeX}px ${shakeY}px`,
          rotate: `${Math.sin(frame / 13) * 0.4}deg`,
          filter: blur
            ? "blur(26px) brightness(0.55)"
            : "contrast(1.06) saturate(1.08)",
        }}
      >
        <Img
          src={PHOTO}
          style={framingStyle(lerpFraming(from, to, t), width, height)}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// A round "lens" on part of the photo, used inside the graphic shots
const PhotoLens: React.FC<{
  readonly spot: Framing;
  readonly size: number;
  readonly style?: React.CSSProperties;
}> = ({ spot, size, style }) => (
  <div
    style={{
      position: "relative",
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      border: "8px solid #fff",
      boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
      ...style,
    }}
  >
    <Img src={PHOTO} style={framingStyle(spot, size, size)} />
  </div>
);

// ---------------------------------------------------------------------------
// On-screen keywords
const Chip: React.FC<{
  readonly at: number; // frame (local) the word is spoken
  readonly text: string;
  readonly top: number;
  readonly color?: string;
  readonly textColor?: string;
  readonly size?: number;
  readonly tilt?: number;
  readonly icon?: React.ReactNode;
}> = ({
  at,
  text,
  top,
  color = GREEN,
  textColor = "#fff",
  size = 84,
  tilt = -2,
  icon,
}) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [at, at + 7], [0, 1], { ...clamp, easing: pop });
  if (frame < at) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", top }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          direction: "rtl",
          fontFamily: displayFont,
          fontSize: size,
          lineHeight: 1.1,
          color: textColor,
          background: color,
          padding: "8px 40px 20px",
          borderRadius: 24,
          rotate: `${tilt}deg`,
          scale: String(s),
          boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
          whiteSpace: "nowrap",
        }}
      >
        {icon}
        {text}
      </div>
    </AbsoluteFill>
  );
};

const Drop: React.FC<{ readonly size: number; readonly color?: string }> = ({
  size,
  color = "#6EC6FF",
}) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 20 26">
    <path
      d="M10 0 C10 0 0 12 0 17 a10 9 0 0 0 20 0 C20 12 10 0 10 0Z"
      fill={color}
      stroke="#fff"
      strokeWidth={1.6}
    />
  </svg>
);

const Moon: React.FC<{ readonly size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M20 15.5A9 9 0 0 1 8.5 4 9 9 0 1 0 20 15.5Z" fill={YELLOW} />
  </svg>
);

// "5 حاجات • 49 د.ت" sticker
const PriceSticker: React.FC<{
  readonly at: number;
  readonly top: number;
  readonly left?: number;
  readonly scale?: number;
}> = ({ at, top, left, scale = 1 }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [at, at + 8], [2.2, 1], {
    ...clamp,
    easing: pop,
  });
  const o = interpolate(frame, [at, at + 3], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: left ?? "50%",
        translate: left === undefined ? "-50% 0" : undefined,
        opacity: o,
        scale: String(s * scale),
        rotate: "-6deg",
        background: colors.red,
        color: "#fff",
        borderRadius: 30,
        border: "7px solid #fff",
        padding: "6px 40px 18px",
        textAlign: "center",
        direction: "rtl",
        boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 46 }}>
        5 حاجات
      </div>
      <div style={{ fontFamily: displayFont, fontSize: 130, lineHeight: 0.95 }}>
        {PRICES.pack} د.ت
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Graphic shots (on a blurred background of the same photo)
const GraphicStage: React.FC<{
  readonly duration: number;
  readonly children: React.ReactNode;
}> = ({ duration, children }) => (
  <AbsoluteFill>
    <PhotoShot from={SPOTS.sidrBag} to={SPOTS.whole} duration={duration} blur />
    {children}
  </AbsoluteFill>
);

// Hair strands rooted in a scalp, seen in cross-section. Drops slide down to the roots.
const Scalp: React.FC<{
  readonly dropsFrom: number; // frame
  readonly rootsGlow: number; // frame, -1 = never
  readonly cleanAt: number; // frame, -1 = never
  readonly pulseAt: number; // frame, -1 = never
}> = ({ dropsFrom, rootsGlow, cleanAt, pulseAt }) => {
  const frame = useCurrentFrame();
  const W = 940;
  const H = 620;
  const skinY = 430;
  const strands = new Array(11).fill(true).map((_, i) => 70 + i * 80);
  const glow =
    rootsGlow < 0
      ? 0
      : interpolate(frame, [rootsGlow, rootsGlow + 10], [0, 1], clamp);
  const clean =
    cleanAt < 0
      ? 0
      : interpolate(frame, [cleanAt, cleanAt + 14], [0, 1], clamp);
  const pulse =
    pulseAt < 0
      ? 0
      : interpolate(frame, [pulseAt, pulseAt + 10], [0, 1], clamp);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="skin" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#F2C7A5" />
          <stop offset="1" stopColor="#C98F6B" />
        </linearGradient>
      </defs>
      <rect
        x={0}
        y={0}
        width={W}
        height={H}
        rx={40}
        fill="rgba(255,255,255,0.93)"
      />
      <rect
        x={20}
        y={skinY}
        width={W - 40}
        height={H - skinY - 20}
        rx={24}
        fill="url(#skin)"
      />
      {/* Blood flow under the scalp */}
      {pulse > 0
        ? [0, 1, 2].map((k) => {
            const phase = ((frame - pulseAt) / 24 + k / 3) % 1;
            return (
              <path
                key={k}
                d={`M 40 ${skinY + 110 + k * 22} Q ${W / 2} ${skinY + 60 + k * 22} ${W - 40} ${skinY + 110 + k * 22}`}
                stroke={colors.red}
                strokeWidth={10}
                fill="none"
                strokeLinecap="round"
                strokeDasharray="60 40"
                strokeDashoffset={-phase * 400}
                opacity={pulse * 0.85}
              />
            );
          })
        : null}
      {strands.map((x, i) => (
        <g key={i}>
          {/* Root bulb */}
          <ellipse
            cx={x}
            cy={skinY + 50}
            rx={14}
            ry={22}
            fill="#5B3A29"
            stroke={GREEN}
            strokeWidth={glow * 8}
          />
          <path
            d={`M ${x} ${skinY + 40} C ${x - 10} ${skinY - 120}, ${x + 14} ${skinY - 260}, ${x - 6 + Math.sin(frame / 12 + i) * 8} 40`}
            stroke="#2B1B12"
            strokeWidth={9}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ))}
      {/* Residue on the scalp that disappears when it is cleaned */}
      {strands.map((x, i) => (
        <circle
          key={`r${i}`}
          cx={x + 40}
          cy={skinY + 6}
          r={11 * (1 - clean)}
          fill="#E9E0C9"
        />
      ))}
      {/* Sidr drops travelling down the strands */}
      {frame >= dropsFrom
        ? strands.map((x, i) => {
            const t = ((frame - dropsFrom) / 34 + i * 0.13) % 1;
            return (
              <circle
                key={`d${i}`}
                cx={x - 2}
                cy={60 + t * (skinY - 30)}
                r={12}
                fill={GREEN}
                opacity={interpolate(t, [0, 0.1, 0.85, 1], [0, 1, 1, 0])}
              />
            );
          })
        : null}
      {clean > 0
        ? [0, 1, 2, 3].map((k) => (
            <path
              key={`s${k}`}
              d="M0 -18 L5 -5 L18 0 L5 5 L0 18 L-5 5 L-18 0 L-5 -5Z"
              fill={YELLOW}
              transform={`translate(${160 + k * 210} ${skinY - 20}) scale(${interpolate(
                (frame - cleanAt - k * 3) % 30,
                [0, 15, 30],
                [0.2, 1.3, 0.2],
              )})`}
            />
          ))
        : null}
    </svg>
  );
};

const WashShot: React.FC<{ readonly duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const tilt = interpolate(frame, [0, 14], [0, -38], {
    ...clamp,
    easing: smooth,
  });
  return (
    <GraphicStage duration={duration}>
      <AbsoluteFill style={{ alignItems: "center", top: 560 }}>
        <Scalp dropsFrom={10} rootsGlow={-1} cleanAt={-1} pulseAt={-1} />
      </AbsoluteFill>
      <PhotoLens
        spot={SPOTS.applicator}
        size={330}
        style={{
          position: "absolute",
          top: 300,
          left: 640,
          rotate: `${tilt}deg`,
        }}
      />
      <Chip at={2} text="نغسلو شعرنا" top={330} tilt={2} />
    </GraphicStage>
  );
};

const RootsShot: React.FC<{ readonly duration: number }> = ({ duration }) => (
  <GraphicStage duration={duration}>
    <AbsoluteFill style={{ alignItems: "center", top: 520 }}>
      <Scalp dropsFrom={0} rootsGlow={f(1.21)} cleanAt={f(2.19)} pulseAt={-1} />
    </AbsoluteFill>
    <Chip at={f(1.21)} text="يوصل للجذور" top={270} />
    <Chip
      at={f(2.19)}
      text="ينظّف فروة الراس"
      top={400}
      color={YELLOW}
      textColor={colors.charcoal}
      tilt={2}
      size={74}
    />
  </GraphicStage>
);

const MassageShot: React.FC<{
  readonly duration: number;
  readonly pulseAt: number;
}> = ({ duration, pulseAt }) => {
  const frame = useCurrentFrame();
  const a = frame / 6;
  return (
    <GraphicStage duration={duration}>
      <AbsoluteFill style={{ alignItems: "center", top: 560 }}>
        <Scalp
          dropsFrom={100000}
          rootsGlow={-1}
          cleanAt={-1}
          pulseAt={pulseAt}
        />
      </AbsoluteFill>
      {/* Brush massaging in small circles */}
      <PhotoLens
        spot={SPOTS.brush}
        size={300}
        style={{
          position: "absolute",
          top: 640 + Math.sin(a) * 30,
          left: 390 + Math.cos(a) * 60,
        }}
      />
      <Chip at={2} text="مساج على فروة الراس" top={300} size={74} />
      <Chip
        at={pulseAt}
        text="تنشّط الدورة الدموية"
        top={420}
        color={colors.red}
        tilt={2}
        size={74}
      />
    </GraphicStage>
  );
};

const TwiceAWeekShot: React.FC<{ readonly duration: number }> = ({
  duration,
}) => {
  const frame = useCurrentFrame();
  const lit = [f(0.83), f(1.3)]; // « مرتين » … « في الجمعة »
  const roll = interpolate(frame, [0, duration], [-260, 260]);
  return (
    <GraphicStage duration={duration}>
      <AbsoluteFill style={{ alignItems: "center", top: 280 }}>
        <ProductImage
          product="dermaRoller"
          height={260}
          style={{
            translate: `${roll}px 0`,
            rotate: `${Math.sin(frame / 5) * 3}deg`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", top: 640 }}>
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 40,
            padding: "30px 40px 40px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            direction: "rtl",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 120,
              color: colors.charcoal,
              lineHeight: 1.1,
            }}
          >
            مرتين في الجمعة
          </div>
          <div
            style={{
              display: "flex",
              gap: 22,
              marginTop: 24,
              justifyContent: "center",
            }}
          >
            {new Array(7).fill(true).map((_, i) => {
              const on = i === 1 ? lit[0] : i === 4 ? lit[1] : -1;
              const p =
                on < 0
                  ? 0
                  : interpolate(frame, [on, on + 6], [0, 1], {
                      ...clamp,
                      easing: pop,
                    });
              return (
                <div
                  key={i}
                  style={{
                    width: 92,
                    height: 92,
                    borderRadius: 24,
                    background: p > 0 ? GREEN : colors.mist,
                    scale: String(1 + p * 0.12),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontFamily: bodyFont,
                    fontWeight: 900,
                    fontSize: 56,
                  }}
                >
                  {p > 0 ? "✓" : ""}
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
      <Chip
        at={f(2.25)}
        text="ما أكثرش!"
        top={1000}
        color={colors.red}
        tilt={-5}
        size={96}
      />
    </GraphicStage>
  );
};

const ThenOilShot: React.FC<{ readonly duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const arrow = interpolate(frame, [8, 20], [0, 1], {
    ...clamp,
    easing: smooth,
  });
  const oil = interpolate(frame, [18, 26], [0, 1], { ...clamp, easing: pop });
  const badge = (n: number) => (
    <div
      style={{
        position: "absolute",
        top: -10,
        right: -10,
        width: 90,
        height: 90,
        borderRadius: "50%",
        background: GREEN,
        border: "6px solid #fff",
        color: "#fff",
        fontFamily: displayFont,
        fontSize: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {n}
    </div>
  );
  return (
    <GraphicStage duration={duration}>
      <Chip
        at={0}
        text="بعد الديرما بالضبط"
        top={300}
        color={YELLOW}
        textColor={colors.charcoal}
      />
      <AbsoluteFill
        style={{
          top: 560,
          flexDirection: "row-reverse",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 30,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "#fff",
            border: "8px solid #fff",
            boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ProductImage product="dermaRoller" height={200} shadow={false} />
          {badge(1)}
        </div>
        <svg
          width={120}
          height={380}
          viewBox="0 0 120 380"
          style={{ opacity: arrow }}
        >
          <path
            d={`M 110 190 L ${110 - 90 * arrow} 190`}
            stroke="#fff"
            strokeWidth={16}
            strokeLinecap="round"
          />
          <path
            d="M 40 150 L 0 190 L 40 230"
            stroke="#fff"
            strokeWidth={16}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div style={{ position: "relative", scale: String(oil) }}>
          <PhotoLens spot={SPOTS.oil} size={380} />
          {badge(2)}
        </div>
      </AbsoluteFill>
    </GraphicStage>
  );
};

// ---------------------------------------------------------------------------
// B-roll timeline (output seconds). Every shot change sits on the word it illustrates.
type Shot = {
  readonly name: string;
  readonly start: number;
  readonly end: number;
  readonly render: (duration: number) => React.ReactNode;
};

// Catalogue shot (same visuals as the static ads): one product on the gold sunburst,
// with an alternating zoom in / zoom out.
const ProductZoom: React.FC<{
  readonly duration: number;
  readonly zoom: "in" | "out";
  readonly children: React.ReactNode;
  readonly top?: number;
}> = ({ duration, zoom, children, top = 500 }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 8], [0.75, 1], {
    ...clamp,
    easing: pop,
  });
  const t = interpolate(frame, [0, duration], [0, 1], {
    ...clamp,
    easing: smooth,
  });
  const z = zoom === "in" ? 1 + 0.2 * t : 1.2 - 0.2 * t;
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 45%, #E9B949 0%, #B8862B 45%, #5C3F10 100%)",
        overflow: "hidden",
      }}
    >
      <LightRays color="rgba(255,236,170,0.35)" style={{ top: "45%" }} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          top,
          scale: String(enter * z),
          transformOrigin: "50% 30%",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const product =
  (
    key: ProductKey,
    height: number,
    zoom: "in" | "out",
    overlay?: (duration: number) => React.ReactNode,
  ) =>
  (duration: number) => (
    <>
      <ProductZoom duration={duration} zoom={zoom}>
        <ProductImage product={key} height={height} />
      </ProductZoom>
      {overlay ? overlay(duration) : null}
    </>
  );

const pack =
  (zoom: "in" | "out", overlay?: (duration: number) => React.ReactNode) =>
  (duration: number) => (
    <>
      <ProductZoom duration={duration} zoom={zoom} top={470}>
        <PackGroup scale={1.35} />
      </ProductZoom>
      {overlay ? overlay(duration) : null}
    </>
  );

const SHOTS: Shot[] = [
  {
    name: "Pack reveal",
    start: HOOK_END,
    end: 5.95,
    render: pack("in", () => <PriceSticker at={2} top={190} scale={0.85} />),
  },
  {
    name: "Sidr",
    start: 5.95,
    end: 7.55,
    render: product("sidr", 720, "out", () => (
      <>
        <Chip at={2} text="سدر طبيعي" top={330} />
        <Chip
          at={f(0.81)}
          text="+ ميّة"
          top={470}
          color="#1E88E5"
          tilt={3}
          size={72}
          icon={<Drop size={54} />}
        />
      </>
    )),
  },
  {
    name: "Into the applicator",
    start: 7.55,
    end: 9.1,
    render: product("bottleBlack", 730, "in", () => (
      <Chip
        at={f(0.63)}
        text="في الأبليكاتور"
        top={330}
        color={YELLOW}
        textColor={colors.charcoal}
      />
    )),
  },
  {
    name: "Wash",
    start: 9.1,
    end: 10.95,
    render: (d) => <WashShot duration={d} />,
  },
  {
    name: "Applicator comb",
    start: 10.95,
    end: 12.25,
    render: product("bottleBlack", 1300, "out", () => (
      <Chip at={f(0.59)} text="الأبليكاتور" top={330} />
    )),
  },
  {
    name: "To the roots",
    start: 12.25,
    end: 15.95,
    render: (d) => <RootsShot duration={d} />,
  },
  {
    name: "Derma roller",
    start: 15.95,
    end: 17.95,
    render: product("dermaRoller", 480, "in", () => (
      <Chip
        at={f(1.27)}
        text="ديرما رولر 540"
        top={330}
        color={colors.magenta}
      />
    )),
  },
  {
    name: "Twice a week",
    start: 17.95,
    end: 20.95,
    render: (d) => <TwiceAWeekShot duration={d} />,
  },
  {
    name: "Then the oil",
    start: 20.95,
    end: 22.75,
    render: (d) => <ThenOilShot duration={d} />,
  },
  {
    name: "Rosemary oil",
    start: 22.75,
    end: 25.95,
    render: product("rosemaryOil", 730, "out", () => (
      <>
        <Chip at={f(0.55)} text="زيت إكليل الجبل" top={330} />
        <Chip
          at={f(1.95)}
          text="طبيعي"
          top={470}
          color={YELLOW}
          textColor={colors.charcoal}
          tilt={4}
        />
      </>
    )),
  },
  {
    name: "Brush",
    start: 25.95,
    end: 29.65,
    render: product("brushPink", 560, "in", () => (
      <>
        <Chip at={f(0.89)} text="البروس" top={330} />
        <Chip
          at={f(3.21)}
          text="في الليل"
          top={470}
          color={colors.navy}
          tilt={3}
          icon={<Moon size={70} />}
        />
      </>
    )),
  },
  {
    name: "Massage + circulation",
    start: 29.65,
    end: 33.2,
    render: (d) => <MassageShot duration={d} pulseAt={f(1.91)} />,
  },
  {
    name: "Pack recap",
    start: 33.2,
    end: CTA_START,
    render: pack("out", () => <PriceSticker at={0} top={190} scale={0.85} />),
  },
];

// ---------------------------------------------------------------------------
// Hook and CTA overlays
const HookOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const badge = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: pop });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 240,
          right: 60,
          scale: String(badge),
          rotate: "4deg",
          background: YELLOW,
          color: colors.charcoal,
          fontFamily: displayFont,
          fontSize: 70,
          padding: "4px 34px 16px",
          borderRadius: 22,
          direction: "rtl",
          boxShadow: "0 14px 34px rgba(0,0,0,0.4)",
        }}
      >
        عرض استثنائي!
      </div>
      {/* « خمسة حاجات » then « 49 دينار » land as stickers on the chest, clear of the face */}
      <PriceSticker at={f(2.75)} top={840} left={600} scale={0.8} />
    </AbsoluteFill>
  );
};

const CtaOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const btnAt = f(35.3 - CTA_START); // « انزل »
  const s = interpolate(frame, [btnAt, btnAt + 8], [0, 1], {
    ...clamp,
    easing: pop,
  });
  const breathe = 1 + Math.max(0, Math.sin((frame - btnAt) / 5)) * 0.05;
  const bounce = Math.abs(Math.sin(frame / 6)) * 26;
  return (
    <AbsoluteFill>
      <PriceSticker at={4} top={230} left={60} scale={0.7} />
      {frame >= btnAt ? (
        <AbsoluteFill style={{ alignItems: "center", top: 960 }}>
          <div
            style={{
              scale: String(s * breathe),
              background: GREEN,
              color: "#fff",
              fontFamily: displayFont,
              fontSize: 100,
              padding: "6px 70px 26px",
              borderRadius: 999,
              border: "7px solid #fff",
              direction: "rtl",
              boxShadow: "0 18px 46px rgba(0,0,0,0.5)",
              whiteSpace: "nowrap",
            }}
          >
            اطلب توّا
          </div>
          <svg
            width={90}
            height={110}
            viewBox="0 0 90 110"
            style={{ marginTop: 8 + bounce, opacity: s }}
          >
            <path
              d="M45 0 V80 M10 50 L45 90 L80 50"
              stroke="#fff"
              strokeWidth={16}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// MOCK-UP ONLY: usage footage borrowed from other creators (other brands, logos, a real person),
// to judge the pacing before the seller films the same shots with the real pack.
// Never run this version as an ad — the "MAQUETTE" watermark is there to make that obvious.
type Broll = {
  readonly name: string;
  readonly file: string; // public/ugc/broll
  readonly srcStart: number; // src seconds
  readonly start: number; // output seconds
  readonly end: number;
  readonly zoom?: number;
  readonly origin?: string; // where the zoom is anchored (moves burnt-in text out of frame)
  readonly overlay?: React.ReactNode;
};

const BROLL: Broll[] = [
  {
    name: "Sidr in the bowl",
    file: "sidr-mix.mp4",
    srcStart: 3.2,
    start: 5.95,
    end: 6.75,
    zoom: 1.15,
    overlay: <Chip at={1} text="سدر طبيعي" top={330} />,
  },
  {
    name: "Water",
    file: "sidr-mix.mp4",
    srcStart: 7.9,
    start: 6.75,
    end: 7.55,
    zoom: 1.15,
    overlay: (
      <Chip
        at={1}
        text="+ ميّة"
        top={330}
        color="#1E88E5"
        icon={<Drop size={54} />}
      />
    ),
  },
  {
    name: "Applicator in hand",
    file: "applicator.mp4",
    srcStart: 1.2,
    start: 7.55,
    end: 9.1,
    zoom: 1.6,
    origin: "100% 90%",
    overlay: (
      <Chip
        at={f(0.63)}
        text="في الأبليكاتور"
        top={330}
        color={YELLOW}
        textColor={colors.charcoal}
      />
    ),
  },
  {
    name: "Applicator on the roots",
    file: "applicator.mp4",
    srcStart: 4.0,
    start: 9.1,
    end: 10.95,
    zoom: 1.6,
    origin: "100% 100%",
    overlay: <Chip at={2} text="نغسلو شعرنا" top={330} />,
  },
  {
    name: "Applicator comb",
    file: "applicator.mp4",
    srcStart: 6.0,
    start: 10.95,
    end: 12.25,
    zoom: 1.5,
    origin: "0% 60%",
    overlay: <Chip at={f(0.59)} text="الأبليكاتور" top={330} />,
  },
  {
    name: "Derma roller needles",
    file: "derma.mp4",
    srcStart: 20.5,
    start: 15.95,
    end: 17.95,
    zoom: 1.25,
    origin: "50% 0%",
    overlay: (
      <Chip
        at={f(1.27)}
        text="ديرما رولر 540"
        top={330}
        color={colors.magenta}
      />
    ),
  },
  {
    name: "Oil on the scalp",
    file: "rosemary.mp4",
    srcStart: 6.0,
    start: 22.75,
    end: 24.25,
    zoom: 1.3,
    origin: "50% 100%",
    overlay: <Chip at={f(0.55)} text="زيت إكليل الجبل" top={330} />,
  },
  {
    name: "Brush in hand",
    file: "brush.mp4",
    srcStart: 3.0,
    start: 25.95,
    end: 27.9,
    zoom: 1.15,
    overlay: <Chip at={f(0.89)} text="البروس" top={330} />,
  },
];

const BrollClip: React.FC<{ readonly b: Broll; readonly duration: number }> = ({
  b,
  duration,
}) => {
  const frame = useCurrentFrame();
  const punch = interpolate(frame, [0, 7], [1.06, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const push = interpolate(frame, [0, duration], [0, 0.04], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill
        style={{
          scale: String((b.zoom ?? 1) * punch + push),
          transformOrigin: b.origin ?? "50% 50%",
        }}
      >
        <Video
          src={staticFile(`ugc/broll/${b.file}`)}
          trimBefore={f(b.srcStart)}
          muted
          objectFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
      </AbsoluteFill>
      {b.overlay}
    </AbsoluteFill>
  );
};

const MockupWatermark: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
    }}
  >
    <div
      style={{
        rotate: "-30deg",
        fontFamily: bodyFont,
        fontWeight: 900,
        fontSize: 170,
        letterSpacing: 10,
        color: "rgba(255,255,255,0.16)",
        WebkitTextStroke: "3px rgba(230,57,70,0.35)",
      }}
    >
      MAQUETTE
    </div>
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
export const UgcAd: React.FC<{ readonly mockup?: boolean }> = ({
  mockup = false,
}) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {UGC_CUTS.map((cut, i) => (
        <Sequence
          key={`ugc${i}`}
          name={`UGC ${cut.src} ${i + 1}`}
          from={f(cut.start)}
          durationInFrames={f(cut.end) - f(cut.start)}
          premountFor={fps}
        >
          <UgcClip cut={cut} />
        </Sequence>
      ))}

      {SHOTS.map((s) => (
        <Sequence
          key={s.name}
          name={s.name}
          from={f(s.start)}
          durationInFrames={f(s.end) - f(s.start)}
          premountFor={fps}
        >
          {s.render(f(s.end) - f(s.start))}
        </Sequence>
      ))}

      {mockup
        ? BROLL.map((b) => (
            <Sequence
              key={b.name}
              name={`Mock-up: ${b.name}`}
              from={f(b.start)}
              durationInFrames={f(b.end) - f(b.start)}
              premountFor={fps}
            >
              <BrollClip b={b} duration={f(b.end) - f(b.start)} />
            </Sequence>
          ))
        : null}

      {/* Bottom gradient for subtitle legibility */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.45) 78%, rgba(0,0,0,0.2) 100%)",
        }}
      />

      <Sequence name="Hook overlay" durationInFrames={f(HOOK_END)}>
        <HookOverlay />
      </Sequence>
      <Sequence name="CTA overlay" from={f(CTA_START)}>
        <CtaOverlay />
      </Sequence>

      <CaptionTrack phrases={CAPTIONS} top={CAPTION_TOP} fontSize={80} />

      {mockup ? <MockupWatermark /> : null}

      <Audio src={VOICE} volume={1} />
      <Audio
        src={staticFile("audio/music.mp3")}
        loop
        volume={(fr) =>
          0.07 *
          interpolate(
            fr,
            [0, 10, TOTAL_FRAMES - 30, TOTAL_FRAMES],
            [0, 1, 1, 0],
            clamp,
          )
        }
      />
    </AbsoluteFill>
  );
};
