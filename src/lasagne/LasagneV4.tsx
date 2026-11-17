// LasagneV4: graded 1080 cut (public/lasagne/base.mp4) + motion layers, all timed from plan.json.
// Layer stack (bottom -> top): footage (zooms, freezes) -> light leaks -> grade -> freeze FX -> step chips
// -> captions -> grain + vignette -> final fade.
import React from "react";
import {
  AbsoluteFill,
  Freeze,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "../theme"; // loads Lalezar + Cairo from public/fonts
import plan from "./plan.json";
import { lt } from "./theme";

type Page = { start: number; end: number; words: { w: string; s: number; e: number }[] };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps, t: frame / fps };
};

// ---------- footage: per-shot Ken Burns (alternating in/out), punch zooms, freezes ----------
const Footage: React.FC = () => {
  const { frame, fps, t } = useT();
  const i = Math.max(0, plan.shots.findIndex((s) => t >= s.start && t < s.end));
  const shot = plan.shots[i] ?? plan.shots[plan.shots.length - 1];
  const p = interpolate(t, [shot.start, shot.end], [0, 1], { ...clamp, easing: lt.ease.inOut });
  const kb = i % 2 === 0 ? interpolate(p, [0, 1], [1, 1.07]) : interpolate(p, [0, 1], [1.07, 1]);
  const panY = interpolate(p, [0, 1], i % 2 === 0 ? [0, -14] : [-14, 0]);

  let punch = 1;
  for (const k of plan.punches) {
    const f0 = Math.round(k.t * fps);
    const d = frame - f0;
    if (d < 0 || d > 45) continue;
    if (k.kind === "in") {
      const s = spring({ frame: d, fps, config: lt.spring.snappy });
      const decay = interpolate(d, [10, 44], [1, 0], { ...clamp, easing: lt.ease.inOut });
      punch *= 1 + 0.11 * s * decay; // zoom +
    } else {
      const s = spring({ frame: d, fps, config: lt.spring.smooth });
      punch *= 1 + 0.16 * (1 - s); // zoom - (reveal)
    }
  }
  for (const z of plan.freezes) {
    const f0 = Math.round(z.t * fps);
    const d = frame - f0;
    const len = Math.round(z.d * fps);
    if (d < 0 || d > len + 12) continue;
    const s = spring({ frame: d, fps, config: lt.spring.snappy });
    const out = interpolate(d, [len, len + 10], [1, 0], { ...clamp, easing: lt.ease.in });
    punch *= 1 + 0.05 * s * out;
  }

  // nest one <Freeze> per hold: picture stops, the voice keeps going
  let video: React.ReactNode = (
    <OffthreadVideo src={staticFile("lasagne/base.mp4")} muted style={{ width: "100%", height: "100%" }} />
  );
  for (const z of plan.freezes) {
    const f0 = Math.round(z.t * fps);
    const len = Math.round(z.d * fps);
    video = (
      <Freeze frame={f0} active={(f) => f >= f0 && f < f0 + len}>
        {video}
      </Freeze>
    );
  }
  return (
    <AbsoluteFill style={{ transform: `scale(${kb * punch}) translateY(${panY}px)` }}>{video}</AbsoluteFill>
  );
};

// ---------- warm light leak sweeping across each chapter cut ----------
const LightLeaks: React.FC = () => {
  const { frame, fps } = useT();
  return (
    <>
      {plan.chips.map((c) => {
        const f0 = Math.round(c.t * fps) - 6;
        const d = frame - f0;
        if (d < 0 || d > 22) return null;
        const x = interpolate(d, [0, 22], [-40, 140], { ...clamp, easing: lt.ease.inOut });
        const o = interpolate(d, [0, 7, 22], [0, 0.6, 0], { ...clamp, easing: lt.ease.out });
        return (
          <AbsoluteFill
            key={c.t}
            style={{
              background: `radial-gradient(ellipse 55% 70% at ${x}% 40%, rgba(255,190,110,0.95), rgba(232,120,40,0.35) 45%, transparent 70%)`,
              mixBlendMode: "screen",
              opacity: o,
            }}
          />
        );
      })}
    </>
  );
};

const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: lt.colors.hero, mixBlendMode: "soft-light", opacity: 0.12 }} />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.28), transparent 22%, transparent 52%, rgba(0,0,0,0.45) 78%, rgba(0,0,0,0.25))",
      }}
    />
  </AbsoluteFill>
);

// ---------- freeze FX: flash + photo frame + corner brackets ----------
const FreezeFx: React.FC = () => {
  const { frame, fps } = useT();
  return (
    <>
      {plan.freezes.map((z) => {
        const f0 = Math.round(z.t * fps);
        const len = Math.round(z.d * fps);
        const d = frame - f0;
        if (d < -1 || d > len + 10) return null;
        const flash = interpolate(d, [0, 1, 7], [0, 0.85, 0], { ...clamp, easing: lt.ease.out });
        const s = spring({ frame: d, fps, config: lt.spring.snappy });
        const out = interpolate(d, [len, len + 8], [1, 0], { ...clamp, easing: lt.ease.in });
        const inset = interpolate(s, [0, 1], [0, 44]);
        return (
          <AbsoluteFill key={z.t} style={{ pointerEvents: "none" }}>
            <AbsoluteFill
              style={{
                margin: inset,
                border: `10px solid ${lt.colors.cream}`,
                borderRadius: 28,
                boxShadow: "0 0 0 2000px rgba(0,0,0,0.18), 0 30px 60px rgba(0,0,0,0.5)",
                opacity: s * out,
                transform: `scale(${1.04 - 0.04 * s}) rotate(${(1 - s) * -2}deg)`,
              }}
            />
            <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />
          </AbsoluteFill>
        );
      })}
    </>
  );
};

// ---------- step chips (RTL): number disc + title, spring in, fast exit ----------
const Chips: React.FC = () => {
  const { frame, fps } = useT();
  return (
    <>
      {plan.chips.map((c) => {
        const f0 = Math.round(c.t * fps);
        const len = Math.round(c.dur * fps);
        const d = frame - f0;
        if (d < 0 || d > len) return null;
        const sNum = spring({ frame: d, fps, config: lt.spring.bouncy });
        const sTxt = spring({ frame: d - 4, fps, config: lt.spring.snappy });
        const exitP = interpolate(d, [len - 10, len], [0, 1], { ...clamp, easing: lt.ease.in });
        const breathe = 1 + Math.sin(d / 22) * 0.012;
        return (
          <AbsoluteFill key={c.t} style={{ alignItems: "center", top: 290, height: 200 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                alignItems: "center",
                gap: 22,
                opacity: (1 - exitP) * Math.min(1, sTxt * 1.4),
                transform: `translateY(${-36 * exitP}px) scale(${breathe})`,
              }}
            >
              <div
                style={{
                  width: 104,
                  height: 104,
                  borderRadius: 52,
                  background: lt.colors.hero,
                  color: lt.colors.ink,
                  fontFamily: lt.fonts.body,
                  fontWeight: 900,
                  fontSize: 58,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 0 50px ${lt.colors.glow}`,
                  transform: `scale(${sNum}) rotate(${(1 - sNum) * 90}deg)`,
                }}
              >
                {c.n}
              </div>
              <div
                style={{
                  direction: "rtl",
                  background: "rgba(255,244,224,0.94)",
                  color: lt.colors.ink,
                  fontFamily: lt.fonts.display,
                  fontSize: 76,
                  lineHeight: 1,
                  padding: "18px 40px 10px",
                  borderRadius: 26,
                  boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
                  transform: `translateX(${interpolate(sTxt, [0, 1], [90, 0])}px) scale(${interpolate(sTxt, [0, 1], [0.9, 1])})`,
                }}
              >
                {c.text}
              </div>
            </div>
          </AbsoluteFill>
        );
      })}
    </>
  );
};

// ---------- captions: Arabic, word by word, active word in gold ----------
const Captions: React.FC = () => {
  const { frame, fps, t } = useT();
  const page = (plan.pages as Page[]).find((p) => t >= p.start && t < p.end);
  if (!page) return null;
  const pf = Math.round(page.end * fps);
  const exit = interpolate(frame, [pf - 5, pf], [1, 0], { ...clamp, easing: lt.ease.in });
  return (
    <AbsoluteFill style={{ top: 1150, height: 420, alignItems: "center" }}>
      <div
        style={{
          direction: "rtl",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "6px 22px",
          maxWidth: 900,
          opacity: exit,
        }}
      >
        {page.words.map((w, k) => {
          const d = frame - Math.round(w.s * fps) + 3;
          const s = spring({ frame: d, fps, config: lt.spring.snappy });
          const active = t >= w.s && t < w.e;
          const pop = active ? spring({ frame: d - 3, fps, config: lt.spring.bouncy }) : 0;
          return (
            <span
              key={k}
              style={{
                fontFamily: lt.fonts.body,
                fontWeight: 900,
                fontSize: 84,
                lineHeight: 1.25,
                color: active ? lt.colors.hero : lt.colors.cream,
                WebkitTextStroke: `3px ${lt.colors.ink}`,
                paintOrder: "stroke fill",
                textShadow: active ? `0 0 30px ${lt.colors.glow}, 0 6px 18px rgba(0,0,0,0.6)` : "0 6px 18px rgba(0,0,0,0.6)",
                opacity: Math.min(1, s * 1.3),
                display: "inline-block",
                transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px) scale(${interpolate(s, [0, 1], [0.85, 1]) * (1 + 0.1 * pop)})`,
              }}
            >
              {w.w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
const GrainVignette: React.FC = () => {
  const { frame } = useT();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          backgroundImage: NOISE,
          backgroundSize: "220px",
          backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
          opacity: 0.06,
          mixBlendMode: "overlay",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.3) 100%)" }} />
    </AbsoluteFill>
  );
};

const FadeOut: React.FC = () => {
  const { frame } = useT();
  const { durationInFrames } = useVideoConfig();
  const o = interpolate(frame, [durationInFrames - 20, durationInFrames - 1], [0, 1], { ...clamp, easing: lt.ease.in });
  return <AbsoluteFill style={{ backgroundColor: "#000", opacity: o }} />;
};

export const LASAGNE_FRAMES = plan.durationInFrames;

export const LasagneV4: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: lt.colors.ink, overflow: "hidden" }}>
    <Footage />
    <LightLeaks />
    <Grade />
    <FreezeFx />
    <Chips />
    <Captions />
    <GrainVignette />
    <FadeOut />
  </AbsoluteFill>
);
