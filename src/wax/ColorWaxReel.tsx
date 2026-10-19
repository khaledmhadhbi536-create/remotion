import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PHONE, WAX } from "../config";
import { bodyFont, colors, displayFont } from "../theme";

// Sevich temporary hair colour wax — 18s vertical ad (9:16) for Reels, Stories and TikTok.
// Every cut lands on a 2s bar of the 120 BPM track (music-18s). Text stays between
// y=250 and y=1440 so the Instagram / TikTok UI never covers it.

export const WAX_FRAMES = 540;

// The 13 shades of the range
export const WAX_COLORS = [
  "#1B1B1F", // black
  "#B9BEC6", // silver
  "#F4F1EA", // white
  "#6B4226", // brown
  "#D9A441", // gold
  "#F5D33B", // yellow
  "#F28C28", // orange
  "#E63946", // red
  "#FF5FA2", // pink
  "#8E44D9", // purple
  "#2F6FE4", // blue
  "#1A3C8F", // dark blue
  "#2BBF6A", // green
];

const SCENES = {
  hook: { from: 0, frames: 120 },
  colors: { from: 120, frames: 120 },
  steps: { from: 240, frames: 120 },
  moments: { from: 360, frames: 60 },
  cta: { from: 420, frames: 120 },
};

const bg = `radial-gradient(circle at 50% 38%, ${colors.charcoalSoft} 0%, ${colors.charcoal} 70%)`;

const usePop = (delay: number, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

// Arabic display headline
const Headline: React.FC<{
  readonly children: React.ReactNode;
  readonly size?: number;
  readonly color?: string;
  readonly delay?: number;
  readonly top: number;
}> = ({ children, size = 110, color = colors.white, delay = 0, top }) => {
  const p = usePop(delay);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 60,
        right: 60,
        textAlign: "center",
        direction: "rtl",
        fontFamily: displayFont,
        fontSize: size,
        lineHeight: 1.15,
        color,
        opacity: p,
        transform: `translateY(${(1 - p) * 60}px) scale(${0.9 + p * 0.1})`,
        textShadow: "0 6px 24px rgba(0,0,0,0.5)",
      }}
    >
      {children}
    </div>
  );
};

// The jar, drawn in SVG so the wax can take any of the 13 colours.
export const WaxJar: React.FC<{
  readonly color: string;
  readonly size: number;
  readonly label?: boolean;
}> = ({ color, size, label = true }) => {
  const id = color.replace("#", "");
  return (
    <svg width={size} height={size * 0.95} viewBox="0 0 300 285">
      <defs>
        <linearGradient id={`rim-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#5A6068" />
          <stop offset="0.45" stopColor="#C9CED4" />
          <stop offset="1" stopColor="#4A5058" />
        </linearGradient>
        <linearGradient id={`body-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#D8DADD" />
          <stop offset="0.3" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#C4C7CB" />
        </linearGradient>
        <radialGradient id={`wax-${id}`} cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="white" stopOpacity="0.45" />
          <stop offset="0.35" stopColor={color} />
          <stop offset="1" stopColor={color} />
        </radialGradient>
      </defs>
      {/* wax mound with a swirl */}
      <path
        d="M40 92 C 45 55, 95 50, 120 40 C 140 20, 165 8, 175 22 C 170 40, 200 42, 225 55 C 250 65, 262 80, 260 92 Z"
        fill={`url(#wax-${id})`}
      />
      <path
        d="M120 40 C 150 50, 175 45, 175 22"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth={4}
        fill="none"
      />
      {/* rim */}
      <rect
        x={28}
        y={88}
        width={244}
        height={44}
        rx={8}
        fill={`url(#rim-${id})`}
      />
      {[98, 108, 118].map((y) => (
        <line
          key={y}
          x1={30}
          x2={270}
          y1={y}
          y2={y}
          stroke="rgba(0,0,0,0.18)"
          strokeWidth={2}
        />
      ))}
      {/* body */}
      <rect
        x={34}
        y={130}
        width={232}
        height={140}
        rx={10}
        fill={`url(#body-${id})`}
      />
      <rect x={34} y={252} width={232} height={22} rx={6} fill="#3A4048" />
      {label ? (
        <g
          fontFamily="Arial Black, Arial, sans-serif"
          fontWeight={900}
          fill="#111"
        >
          <text x={150} y={170} fontSize={30} textAnchor="middle">
            HAIR
          </text>
          <text x={150} y={200} fontSize={22} textAnchor="middle">
            COLORING
          </text>
          <text x={150} y={232} fontSize={30} textAnchor="middle">
            WAX
          </text>
          <rect
            x={100}
            y={238}
            width={100}
            height={10}
            rx={5}
            fill={color}
            stroke="#111"
            strokeWidth={1}
          />
        </g>
      ) : null}
    </svg>
  );
};

// Stylised head; the hair takes `hair` colour.
const Head: React.FC<{ readonly hair: string; readonly size: number }> = ({
  hair,
  size,
}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 10) * 3;
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 400 460">
      {/* shoulders */}
      <path
        d="M40 460 C 50 380, 120 350, 200 350 C 280 350, 350 380, 360 460 Z"
        fill="#7C8590"
      />
      <rect x={170} y={290} width={60} height={70} fill="#E2B48F" />
      <g transform={`translate(0 ${bob})`}>
        {/* ears */}
        <ellipse cx={108} cy={210} rx={18} ry={30} fill="#DDA982" />
        <ellipse cx={292} cy={210} rx={18} ry={30} fill="#DDA982" />
        {/* face */}
        <ellipse cx={200} cy={200} rx={92} ry={115} fill="#EBC09B" />
        {/* eyes + brows */}
        <ellipse cx={165} cy={205} rx={9} ry={7} fill="#2A2420" />
        <ellipse cx={235} cy={205} rx={9} ry={7} fill="#2A2420" />
        <path
          d="M145 185 Q 165 175 185 183"
          stroke="#3A2E28"
          strokeWidth={7}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M215 183 Q 235 175 255 185"
          stroke="#3A2E28"
          strokeWidth={7}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M200 215 Q 194 240 202 248"
          stroke="#C99572"
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M172 272 Q 200 290 228 272"
          stroke="#A0614A"
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        />
        {/* textured, messy hair */}
        <path
          d="M104 200 C 92 150, 100 95, 140 70 C 150 40, 190 35, 205 50 C 225 30, 270 40, 275 70 C 310 85, 312 140, 298 200
             C 290 170, 280 150, 262 140 C 250 160, 230 150, 225 135 C 210 155, 185 150, 178 132 C 165 152, 140 150, 135 138
             C 120 150, 110 170, 104 200 Z"
          fill={hair}
        />
        <path
          d="M140 70 C 120 60, 130 40, 150 48 M205 50 C 210 25, 235 25, 232 42 M275 70 C 295 55, 310 70, 296 86"
          stroke={hair}
          strokeWidth={16}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M150 90 C 170 75, 200 72, 225 82"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={8}
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
};

// 0–4s: the hair flips through every colour
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.floor(frame / 7) % WAX_COLORS.length;
  const p = usePop(0, 14);
  return (
    <AbsoluteFill style={{ background: bg }}>
      <Headline top={270} size={120}>
        بدّل لون شعرك
      </Headline>
      <Headline top={410} size={120} color={colors.goldLight} delay={8}>
        في دقيقة!
      </Headline>
      <div
        style={{
          position: "absolute",
          top: 600,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          transform: `scale(${0.6 + p * 0.4})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 120,
            width: 620,
            height: 620,
            borderRadius: "50%",
            background: WAX_COLORS[idx],
            opacity: 0.25,
            filter: "blur(60px)",
          }}
        />
        <Head hair={WAX_COLORS[idx]} size={640} />
      </div>
    </AbsoluteFill>
  );
};

// 4–8s: the 13 jars pop in
const ColorsScene: React.FC = () => {
  const cols = 4;
  return (
    <AbsoluteFill style={{ background: bg }}>
      <Headline top={260} size={150} color={colors.goldLight}>
        {WAX.colors} لون
      </Headline>
      <Headline top={440} size={64} delay={6}>
        اختار اللي يعجبك
      </Headline>
      <div
        style={{
          position: "absolute",
          top: 580,
          left: 40,
          right: 40,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          rowGap: 10,
        }}
      >
        {WAX_COLORS.map((c, i) => (
          <PopIn key={c} delay={10 + i * 5} width={1000 / cols}>
            <WaxJar color={c} size={220} label={false} />
          </PopIn>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const PopIn: React.FC<{
  readonly delay: number;
  readonly width: number;
  readonly children: React.ReactNode;
}> = ({ delay, width, children }) => {
  const p = usePop(delay, 10);
  return (
    <div
      style={{
        width,
        display: "flex",
        justifyContent: "center",
        opacity: Math.min(1, p * 2),
        transform: `scale(${p}) rotate(${(1 - p) * -20}deg)`,
      }}
    >
      {children}
    </div>
  );
};

const STEPS = [
  "خوذ شويّة في يدّك",
  "حطّو و اعمل الستيل متاعك",
  "يتنحّى بالشامبو",
];
export const STEP_BEATS = [18, 48, 78];

// 8–12s: how it works
const StepsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const jarColor = WAX_COLORS[7 + (Math.floor(frame / 20) % 4)];
  return (
    <AbsoluteFill style={{ background: bg }}>
      <Headline top={260} size={100}>
        ساهل برشا
      </Headline>
      <div
        style={{
          position: "absolute",
          top: 400,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <WaxJar color={jarColor} size={360} />
      </div>
      {STEPS.map((s, i) => (
        <StepRow
          key={s}
          n={i + 1}
          text={s}
          delay={STEP_BEATS[i]}
          top={790 + i * 200}
        />
      ))}
    </AbsoluteFill>
  );
};

const StepRow: React.FC<{
  readonly n: number;
  readonly text: string;
  readonly delay: number;
  readonly top: number;
}> = ({ n, text, delay, top }) => {
  const p = usePop(delay, 14);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 70,
        right: 70,
        height: 160,
        borderRadius: 32,
        background: "rgba(255,255,255,0.08)",
        border: `3px solid ${colors.bronze}`,
        display: "flex",
        alignItems: "center",
        direction: "rtl",
        gap: 32,
        padding: "0 36px",
        opacity: p,
        transform: `translateX(${(1 - p) * 200}px)`,
      }}
    >
      <div
        style={{
          width: 100,
          height: 100,
          flexShrink: 0,
          borderRadius: "50%",
          background: colors.gold,
          color: colors.charcoal,
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {n}
      </div>
      <div
        style={{
          fontFamily: bodyFont,
          fontWeight: 800,
          fontSize: 56,
          color: colors.white,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const MOMENTS = [
  { text: "للماتش", color: "#E63946" },
  { text: "للعرس", color: "#D9A441" },
  { text: "للسهريّة", color: "#8E44D9" },
];

// 12–14s: occasions, one chip per beat
const MomentsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.min(MOMENTS.length - 1, Math.floor(frame / 18));
  return (
    <AbsoluteFill style={{ background: MOMENTS[active].color }}>
      <div
        style={{
          position: "absolute",
          top: 300,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Head
          hair={active === 0 ? "#FFFFFF" : active === 1 ? "#F5D33B" : "#2F6FE4"}
          size={460}
        />
      </div>
      {MOMENTS.map((m, i) => (
        <Chip key={m.text} text={m.text} delay={i * 18} top={880 + i * 170} />
      ))}
    </AbsoluteFill>
  );
};

const Chip: React.FC<{
  readonly text: string;
  readonly delay: number;
  readonly top: number;
}> = ({ text, delay, top }) => {
  const p = usePop(delay, 11);
  return (
    <div
      style={{
        position: "absolute",
        top,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        opacity: p,
        transform: `scale(${p})`,
      }}
    >
      <div
        style={{
          background: colors.white,
          color: colors.charcoal,
          fontFamily: displayFont,
          fontSize: 96,
          padding: "4px 70px 14px",
          borderRadius: 80,
          boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// 14–18s: price and call to action
const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const jar = usePop(0, 12);
  const price = usePop(16, 9);
  const pulse = 1 + Math.sin(Math.max(0, frame - 40) / 5) * 0.04;
  const glow = interpolate(frame, [0, 120], [0, 360], {
    easing: Easing.linear,
  });
  return (
    <AbsoluteFill style={{ background: bg }}>
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 240,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `conic-gradient(from ${glow}deg, ${WAX_COLORS.slice(3).join(", ")}, ${WAX_COLORS[3]})`,
          opacity: 0.35,
          filter: "blur(70px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 300,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          transform: `scale(${jar}) rotate(${(1 - jar) * 15}deg)`,
        }}
      >
        <WaxJar
          color={WAX_COLORS[Math.floor(frame / 10) % WAX_COLORS.length]}
          size={480}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 790,
          width: "100%",
          textAlign: "center",
          direction: "rtl",
          fontFamily: displayFont,
          color: colors.goldLight,
          fontSize: 200,
          lineHeight: 1,
          transform: `scale(${price})`,
          textShadow: "0 8px 30px rgba(0,0,0,0.5)",
        }}
      >
        {WAX.price} <span style={{ fontSize: 110 }}>د.ت</span>
      </div>
      <Headline top={1020} size={60} delay={30}>
        الخلاص عند الاستلام
      </Headline>
      <div
        style={{
          position: "absolute",
          top: 1130,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          opacity: usePop(45),
          transform: `scale(${pulse})`,
        }}
      >
        <div
          style={{
            background: colors.gold,
            color: colors.charcoal,
            fontFamily: displayFont,
            fontSize: 92,
            padding: "6px 90px 18px",
            borderRadius: 90,
            boxShadow: `0 0 40px ${colors.gold}`,
          }}
        >
          اطلب توّا
        </div>
      </div>
      <Headline top={1310} size={64} delay={60}>
        <span
          style={{
            fontFamily: bodyFont,
            fontWeight: 900,
            direction: "ltr",
            unicodeBidi: "embed",
          }}
        >
          {PHONE}
        </span>
      </Headline>
    </AbsoluteFill>
  );
};

const sfx = (from: number, file: string, volume: number) => ({
  from,
  file,
  volume,
});
const SOUNDS = [
  ...[120, 240, 360, 420].map((f) => sfx(f - 4, "whoosh", 0.45)),
  sfx(2, "impact", 0.4),
  ...WAX_COLORS.map((_, i) => sfx(SCENES.colors.from + 10 + i * 5, "pop", 0.4)),
  ...STEP_BEATS.map((d) => sfx(SCENES.steps.from + d, "click", 0.55)),
  ...[0, 18, 36].map((d) => sfx(SCENES.moments.from + d, "pop", 0.6)),
  sfx(SCENES.cta.from + 16, "cash-bell", 0.6),
  sfx(SCENES.cta.from + 45, "pop", 0.55),
  sfx(SCENES.cta.from + 90, "shimmer", 0.45),
];

export const ColorWaxReel: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: colors.charcoal }}>
      <Sequence
        name="Hook"
        from={SCENES.hook.from}
        durationInFrames={SCENES.hook.frames}
      >
        <HookScene />
      </Sequence>
      <Sequence
        name="13 colours"
        from={SCENES.colors.from}
        durationInFrames={SCENES.colors.frames}
      >
        <ColorsScene />
      </Sequence>
      <Sequence
        name="Steps"
        from={SCENES.steps.from}
        durationInFrames={SCENES.steps.frames}
      >
        <StepsScene />
      </Sequence>
      <Sequence
        name="Moments"
        from={SCENES.moments.from}
        durationInFrames={SCENES.moments.frames}
      >
        <MomentsScene />
      </Sequence>
      <Sequence
        name="CTA"
        from={SCENES.cta.from}
        durationInFrames={SCENES.cta.frames}
      >
        <CtaScene />
      </Sequence>
      <Audio
        name="Music"
        src={staticFile("audio/music-18s.mp3")}
        volume={0.7}
      />
      {SOUNDS.map((s) => (
        <Sequence key={`${s.file}-${s.from}`} from={s.from} layout="none">
          <Audio
            name={s.file}
            src={staticFile(`audio/${s.file}.mp3`)}
            volume={s.volume}
            premountFor={fps}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
