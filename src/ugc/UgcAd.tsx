import React from "react";
import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { LightRays } from "../components/Decor";
import {
  PackGroup,
  ProductImage,
  type ProductKey,
} from "../components/ProductImage";
import { PRICES } from "../config";
import { bodyFont, colors, displayFont } from "../theme";
import {
  CutTransitions,
  type CutFx,
  NeonWord,
  RefCaptions,
  TitleCard,
} from "./RefStyle";
import {
  CAPTIONS,
  CTA_START,
  f,
  HOOK_END,
  TOTAL_FRAMES,
  UGC_CUTS,
  type UgcCut,
} from "./edit";

// 9:16 UGC ad (Reels / Stories): UGC hook → B-roll of the real pack → UGC call to action.
// The voice-over drives the whole edit — see edit.ts for every timing.

const VOICE = staticFile("ugc/voice-v2-master.m4a");
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
}> = ({ at, text, top, color = GREEN, size = 84, tilt = -2, icon }) => {
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
          fontSize: size * 0.85,
          lineHeight: 1.1,
          // Reference-style label: no box, coloured or white text with a black outline
          color: color === YELLOW || color === colors.red ? color : "#fff",
          WebkitTextStroke: "9px #000",
          paintOrder: "stroke fill",
          textShadow: "0 6px 16px rgba(0,0,0,0.45)",
          rotate: `${tilt}deg`,
          scale: String(s),
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
// Gold sunburst, as on the static ads
const GoldBackdrop: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(circle at 50% 45%, #E9B949 0%, #B8862B 45%, #5C3F10 100%)",
      overflow: "hidden",
    }}
  >
    <LightRays color="rgba(255,236,170,0.35)" style={{ top: "45%" }} />
  </AbsoluteFill>
);

const GraphicStage: React.FC<{
  readonly duration: number;
  readonly children: React.ReactNode;
}> = ({ children }) => (
  <AbsoluteFill>
    <GoldBackdrop />
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

// « كان شعرك بدا يطيح ويفرغ… » — strands come loose and fall, then the "tried everything" beat
const HairFallShot: React.FC<{
  readonly duration: number;
  readonly triedAt: number; // frame of « وجرّبت برشا حاجات »
  readonly noResultAt: number; // frame of « وما لقيتش نتيجة »
}> = ({ duration, triedAt, noResultAt }) => {
  const frame = useCurrentFrame();
  const W = 940;
  const H = 620;
  const skinY = 430;
  const strands = new Array(11).fill(true).map((_, i) => 70 + i * 80);
  // Every other strand falls, one after the other
  const fall = (i: number) =>
    i % 2 === 1
      ? interpolate(frame, [6 + i * 4, 30 + i * 4], [0, 1], {
          ...clamp,
          easing: Easing.in(Easing.quad),
        })
      : 0;
  return (
    <GraphicStage duration={duration}>
      <AbsoluteFill style={{ alignItems: "center", top: 560 }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
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
            fill="#E8B48F"
          />
          {strands.map((x, i) => {
            const k = fall(i);
            return (
              <g
                key={i}
                transform={`translate(${k * (i % 4 === 1 ? 60 : -50)} ${k * 520}) rotate(${k * (i % 4 === 1 ? 70 : -60)} ${x} ${skinY})`}
                opacity={1 - k * 0.8}
              >
                <ellipse
                  cx={x}
                  cy={skinY + 50}
                  rx={14}
                  ry={22}
                  fill="#5B3A29"
                />
                <path
                  d={`M ${x} ${skinY + 40} C ${x - 10} ${skinY - 120}, ${x + 14} ${skinY - 260}, ${x - 6} 40`}
                  stroke="#2B1B12"
                  strokeWidth={9}
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
      <Chip at={2} text="شعرك يطيح؟" top={300} color={colors.red} />
      {frame < noResultAt ? (
        <Chip
          at={triedAt}
          text="جرّبت برشا حاجات"
          top={430}
          size={72}
          tilt={2}
        />
      ) : (
        <Chip
          at={noResultAt}
          text="✗ ما لقيتش نتيجة"
          top={430}
          color={colors.red}
          size={80}
          tilt={-3}
        />
      )}
    </GraphicStage>
  );
};

const RootsShot: React.FC<{
  readonly duration: number;
  readonly rootsAt: number; // frame of « للجذور »
  readonly cleanAt: number; // frame of « ينظّف »
}> = ({ duration, rootsAt, cleanAt }) => (
  <GraphicStage duration={duration}>
    <AbsoluteFill style={{ alignItems: "center", top: 520 }}>
      <Scalp dropsFrom={0} rootsGlow={rootsAt} cleanAt={cleanAt} pulseAt={-1} />
    </AbsoluteFill>
    <Chip at={rootsAt} text="يوصل للجذور" top={270} />
    <Chip
      at={cleanAt}
      text="ينظّف فروة الراس"
      top={400}
      color={YELLOW}
      textColor={colors.charcoal}
      tilt={2}
      size={74}
    />
  </GraphicStage>
);

const TwiceAWeekShot: React.FC<{
  readonly duration: number;
  readonly litAt: [number, number]; // frames of « مرتين » … « في الجمعة »
  readonly stampAt: number; // frame of « ما أكثرش »
  readonly footage: React.ReactNode; // the roller in use, full frame behind the calendar
}> = ({ litAt, stampAt, footage }) => {
  const frame = useCurrentFrame();
  const lit = litAt;
  return (
    <AbsoluteFill>
      {footage}
      <AbsoluteFill style={{ alignItems: "center", top: 260, scale: "0.82" }}>
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
        at={stampAt}
        text="ما أكثرش!"
        top={720}
        color={colors.red}
        tilt={-5}
        size={96}
      />
    </AbsoluteFill>
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
    <AbsoluteFill>
      <GoldBackdrop />
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

// Real footage, full frame like the reference's B-roll. `zoom` + `origin` push the source's own
// captions / stickers out of frame (e.g. origin "50% 100%" crops the top).
const FullClip: React.FC<{
  readonly file: string; // under public/ugc
  readonly srcStart: number; // seconds
  readonly duration: number; // frames
  readonly zoom?: number;
  readonly origin?: string;
}> = ({ file, srcStart, duration, zoom = 1, origin = "50% 50%" }) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, duration], [0, 0.05], clamp);
  const punch = interpolate(frame, [0, 6], [1.07, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          scale: String(zoom * punch + push),
          transformOrigin: origin,
          filter: "contrast(1.06) saturate(1.08)",
        }}
      >
        <Video
          src={staticFile(`ugc/${file}`)}
          trimBefore={f(srcStart)}
          muted
          objectFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const full =
  (
    clip: Omit<React.ComponentProps<typeof FullClip>, "duration">,
    overlay?: () => React.ReactNode,
  ) =>
  (duration: number) => (
    <>
      <FullClip {...clip} duration={duration} />
      {overlay ? overlay() : null}
    </>
  );

// Demo footage in a rounded card that pops up with a blur (the reference's image cards).
// `crop` is the part of the source kept, in fractions of its width / height: it leaves out the
// source's own captions, badges and logos.
type Crop = { x: number; y: number; w: number; h: number };
const DemoCard: React.FC<{
  readonly file: string; // public/ugc/demo
  readonly srcW: number;
  readonly srcH: number;
  readonly srcStart: number; // seconds
  readonly crop: Crop;
  readonly cardW: number;
  readonly top: number;
}> = ({ file, srcW, srcH, srcStart, crop, cardW, top }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 9], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const cardH = (cardW * crop.h * srcH) / (crop.w * srcW);
  const vw = cardW / crop.w;
  const vh = (vw * srcH) / srcW;
  return (
    <AbsoluteFill style={{ alignItems: "center", top }}>
      <div
        style={{
          position: "relative",
          width: cardW,
          height: cardH,
          borderRadius: 36,
          overflow: "hidden",
          border: "6px solid #fff",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          opacity: enter,
          translate: `0 ${(1 - enter) * 140}px`,
          scale: String(0.9 + 0.1 * enter),
          filter: `blur(${(1 - enter) * 16}px)`,
        }}
      >
        <Video
          src={staticFile(`ugc/demo/${file}`)}
          trimBefore={f(srcStart)}
          muted
          style={{
            position: "absolute",
            width: vw,
            height: vh,
            left: -crop.x * vw,
            top: -crop.y * vh,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const demo =
  (
    card: Omit<React.ComponentProps<typeof DemoCard>, "top">,
    top: number,
    overlay?: () => React.ReactNode,
  ) =>
  () => (
    <>
      <GoldBackdrop />
      <DemoCard {...card} top={top} />
      {overlay ? overlay() : null}
    </>
  );

const OIL_CLIP = { file: "oil-massage.mp4", srcW: 480, srcH: 854 };
const BRUSH_CLIP = { file: "brush-anim.mp4", srcW: 788, srcH: 720 };

const SHOTS: Shot[] = [
  {
    name: "Hair falling",
    start: HOOK_END,
    end: 8.0,
    render: (d) => (
      <HairFallShot
        duration={d}
        triedAt={f(5.72 - HOOK_END)}
        noResultAt={f(6.98 - HOOK_END)}
      />
    ),
  },
  {
    name: "Title card",
    start: 8.0,
    end: 10.25,
    render: () => (
      <TitleCard line1="تبّعني نفسرلك" line2="الروتين" big="كامل" />
    ),
  },
  {
    name: "Sidr",
    start: 10.25,
    end: 11.6,
    render: product("sidr", 720, "out", () => (
      <Chip at={f(0.57)} text="سدر طبيعي" top={330} />
    )),
  },
  {
    name: "Sidr in the bowl",
    start: 11.6,
    end: 14.4,
    render: full(
      {
        file: "demo/sidr-mix.mp4",
        srcStart: 1.8,
        zoom: 1.38,
        origin: "50% 100%",
      },
      () => (
        <Chip
          at={f(14.04 - 11.6)}
          text="+ ميّة"
          top={300}
          color="#1E88E5"
          tilt={3}
          icon={<Drop size={54} />}
        />
      ),
    ),
  },
  {
    name: "Into the applicator",
    start: 14.4,
    end: 15.65,
    render: full(
      {
        file: "demo/applicator.mp4",
        srcStart: 0.6,
        zoom: 1.45,
        origin: "50% 100%",
      },
      () => (
        <Chip at={f(0.58)} text="في الأبليكاتور" top={300} color={YELLOW} />
      ),
    ),
  },
  {
    name: "Wash",
    start: 15.65,
    end: 17.1,
    // hands massaging the back of the head (crop leaves out the source's sticker and caption)
    render: demo(
      {
        ...OIL_CLIP,
        srcStart: 5.3,
        crop: { x: 0, y: 0.345, w: 1, h: 0.32 },
        cardW: 960,
      },
      520,
      () => <Chip at={2} text="نغسلو شعرنا" top={330} />,
    ),
  },
  {
    name: "Applicator comb",
    start: 17.1,
    end: 18.9,
    render: full(
      {
        file: "demo/applicator.mp4",
        srcStart: 4.3,
        zoom: 1.5,
        origin: "50% 100%",
      },
      () => <Chip at={2} text="الأبليكاتور" top={300} />,
    ),
  },
  {
    name: "To the roots",
    start: 18.9,
    end: 21.1,
    render: (d) => (
      <RootsShot
        duration={d}
        rootsAt={f(18.96 - 18.9)}
        cleanAt={f(19.66 - 18.9)}
      />
    ),
  },
  {
    name: "Derma roller",
    start: 21.1,
    end: 22.85,
    render: full({ file: "broll/derma.mp4", srcStart: 22.0 }, () => (
      <Chip
        at={f(0.74)}
        text="ديرما رولر 540"
        top={300}
        color={colors.magenta}
      />
    )),
  },
  {
    name: "Twice a week",
    start: 22.85,
    end: 24.7,
    render: (d) => (
      <TwiceAWeekShot
        duration={d}
        litAt={[f(22.88 - 22.85), f(23.3 - 22.85)]}
        stampAt={f(23.9 - 22.85)}
        footage={
          <FullClip file="broll/derma.mp4" srcStart={38.6} duration={d} />
        }
      />
    ),
  },
  {
    name: "Then the oil",
    start: 24.7,
    end: 26.1,
    render: full(
      {
        file: "broll/rosemary.mp4",
        srcStart: 4.0,
        zoom: 1.42,
        origin: "50% 100%",
      },
      () => <Chip at={2} text="بعد الديرما بالضبط" top={300} color={YELLOW} />,
    ),
  },
  {
    name: "Oil drops",
    start: 26.1,
    end: 27.2,
    render: full(
      {
        file: "broll/rosemary.mp4",
        srcStart: 6.0,
        zoom: 1.42,
        origin: "50% 100%",
      },
      () => <Chip at={2} text="قطرات" top={300} color={YELLOW} />,
    ),
  },
  {
    name: "Rosemary oil",
    start: 27.2,
    end: 29.0,
    render: product("rosemaryOil", 730, "out", () => (
      <>
        <Chip at={f(27.22 - 27.2)} text="زيت إكليل الجبل" top={330} />
        <Chip
          at={f(28.32 - 27.2)}
          text="طبيعي"
          top={470}
          color={YELLOW}
          tilt={4}
        />
      </>
    )),
  },
  {
    name: "Brush",
    start: 29.0,
    end: 30.95,
    render: full({ file: "broll/brush.mp4", srcStart: 3.0 }, () => (
      <Chip at={f(29.68 - 29.0)} text="البروس" top={300} />
    )),
  },
  {
    name: "Massage + circulation",
    start: 30.95,
    end: 34.25,
    // brush massaging a skin cross-section with blood vessels (crop leaves out badges,
    // captions and the brand name on the brush)
    render: demo(
      {
        ...BRUSH_CLIP,
        srcStart: 29.85,
        crop: { x: 0, y: 0.12, w: 1, h: 0.78 },
        cardW: 960,
      },
      470,
      () => (
        <>
          <Chip at={2} text="مساج على فروة الراس" top={300} size={74} />
          <Chip
            at={f(32.52 - 30.95)}
            text="تنشّط الدورة الدموية"
            top={385}
            color={colors.red}
            tilt={2}
            size={74}
          />
        </>
      ),
    ),
  },
  {
    name: "Offer",
    start: 34.25,
    end: 38.8,
    render: pack("in", () => (
      <>
        <PriceSticker at={f(35.98 - 34.25)} top={190} scale={0.85} />
        <Chip
          at={f(37.52 - 34.25)}
          text="الخلاص عند الاستلام"
          top={1185}
          color={YELLOW}
          size={80}
        />
      </>
    )),
  },
  {
    name: "Pack recap",
    start: 38.8,
    end: CTA_START,
    render: pack("out", () => <PriceSticker at={0} top={190} scale={0.85} />),
  },
];

// Jump cuts: on these words the B-roll punches in (1.0 ↔ 1.12) like a cut, every 2–3 s
const PUNCHES = [
  5.72, 6.98, 12.28, 14.04, 19.66, 23.9, 27.22, 32.52, 35.98, 37.52,
];

const JumpCuts: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const shot = SHOTS.find((s) => t >= s.start && t < s.end);
  const n = shot ? PUNCHES.filter((p) => p > shot.start && p <= t).length : 0;
  return (
    <AbsoluteFill
      style={{
        scale: String(n % 2 === 1 ? 1.12 : 1),
        transformOrigin: "50% 40%",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Hook and CTA overlays
const HookOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const badge = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: pop });
  return (
    <AbsoluteFill>
      {/* Pain-point question + "watch to the end", as in the reference video */}
      <AbsoluteFill style={{ alignItems: "center", top: 210 }}>
        <div
          style={{
            scale: String(badge),
            background: "#fff",
            color: "#000",
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 58,
            lineHeight: 1.25,
            textAlign: "center",
            padding: "10px 34px 16px",
            borderRadius: 22,
            direction: "rtl",
            boxShadow: "0 14px 34px rgba(0,0,0,0.35)",
          }}
        >
          كان شعرك بدا يطيح و يفرغ
          <br />
          تبّع الفيديو للآخر
        </div>
      </AbsoluteFill>
      {/* « خمسة حاجات » then « 49 دينار » land as stickers on the chest, clear of the face */}
      <PriceSticker at={f(2.3)} top={840} left={600} scale={0.8} />
    </AbsoluteFill>
  );
};

const CtaOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const btnAt = 2; // « انزل » opens the CTA clip
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
// Reference-style editing (see RefStyle.tsx): caption look per section, cut transitions,
// giant neon key words
const CAPTION_SECTIONS = [
  { from: 0, to: 14.4, look: "band" as const },
  { from: 14.4, to: 24.7, look: "glow" as const },
  { from: 24.7, to: 99, look: "neon" as const },
];

const CUT_FX: CutFx[] = [
  { at: 2.25, kind: "leak" },
  { at: HOOK_END, kind: "leak" },
  { at: 8.0, kind: "glitch" },
  { at: 10.25, kind: "zoomBlur" },
  { at: 15.65, kind: "glitch" },
  { at: 18.9, kind: "zoomBlur" },
  { at: 21.1, kind: "glitch" },
  { at: 26.1, kind: "zoomBlur" },
  { at: 29.0, kind: "glitch" },
  { at: 34.25, kind: "zoomBlur" },
  { at: CTA_START, kind: "leak" },
];

const NEON_WORDS = [
  { text: "السدر", at: 10.82, top: 780 },
  { text: "مرتين", at: 22.88, top: 960 },
  { text: "طبيعي", at: 28.32, top: 780 },
  { text: "مساج", at: 31.04, top: 780 },
  { text: "49 د.ت", at: 35.98, top: 780 },
];

// ---------------------------------------------------------------------------
export const UgcAd: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <CutTransitions cuts={CUT_FX}>
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

        <JumpCuts>
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
        </JumpCuts>
      </CutTransitions>

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

      {NEON_WORDS.map((w) => (
        <NeonWord key={w.text} text={w.text} at={f(w.at)} top={w.top} />
      ))}

      <RefCaptions
        phrases={CAPTIONS}
        sections={CAPTION_SECTIONS}
        top={CAPTION_TOP}
      />

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
