import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { buildPages, type CaptionPhrase } from "../components/Captions";
import { bodyFont, calligraphyFont, displayFont } from "../theme";

// Editing language copied from the reference short (doctor talking head + B-roll):
// three caption looks that change with the section, light-leak / glitch / zoom-blur cuts,
// a "تابعني نفسرلك" title card on a white wall, and giant neon key words.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pop = Easing.bezier(0.2, 1.5, 0.4, 1);

const NEON_GREEN = "#39FF14";
const LILAC = "#8E7CFF";
const PINK = "#FF2E93";

// ---------------------------------------------------------------------------
// Captions
export type CaptionLook = "band" | "glow" | "neon";
export type CaptionSection = {
  readonly from: number; // seconds
  readonly to: number;
  readonly look: CaptionLook;
};

const MAX_WORDS: Record<CaptionLook, number> = { band: 3, glow: 2, neon: 2 };

export const RefCaptions: React.FC<{
  readonly phrases: CaptionPhrase[];
  readonly sections: CaptionSection[];
  readonly top: number;
}> = ({ phrases, sections, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const section = sections.find((s) => t >= s.from && t < s.to);
  const look = section?.look ?? "band";
  const pages = useMemo(
    () => ({
      band: buildPages(phrases, fps, MAX_WORDS.band),
      glow: buildPages(phrases, fps, MAX_WORDS.glow),
      neon: buildPages(phrases, fps, MAX_WORDS.neon),
    }),
    [phrases, fps],
  );
  const page = pages[look].find((p) => frame >= p.start && frame < p.end);
  if (!page) return null;

  if (look === "band") {
    // White words typed in one by one over a soft dark band
    return (
      <AbsoluteFill style={{ top, height: 130, justifyContent: "center" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.42) 22%, rgba(0,0,0,0.42) 78%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            gap: 16,
            direction: "rtl",
            fontFamily: bodyFont,
            fontWeight: 800,
            fontSize: 66,
            color: "#fff",
            textShadow: "0 3px 10px rgba(0,0,0,0.7)",
          }}
        >
          {page.words.map((w, i) => (
            <span key={i} style={{ opacity: frame >= w.start ? 1 : 0 }}>
              {w.text}
            </span>
          ))}
        </div>
      </AbsoluteFill>
    );
  }

  if (look === "glow") {
    // Lilac bubble words with a white outline, one per line, each popping in
    return (
      <AbsoluteFill
        style={{ top: top - 60, alignItems: "center", direction: "rtl" }}
      >
        {page.words.map((w, i) => {
          const s = interpolate(frame, [w.start, w.start + 6], [0.3, 1], {
            ...clamp,
            easing: pop,
          });
          return (
            <div
              key={i}
              style={{
                fontFamily: displayFont,
                fontSize: 104,
                lineHeight: 1.05,
                color: LILAC,
                WebkitTextStroke: "12px #fff",
                paintOrder: "stroke fill",
                filter: `drop-shadow(0 0 14px ${LILAC})`,
                scale: String(frame >= w.start ? s : 0),
                rotate: i % 2 === 0 ? "-3deg" : "2deg",
              }}
            >
              {w.text}
            </div>
          );
        })}
      </AbsoluteFill>
    );
  }

  // neon: green text in a tight black box
  const s = interpolate(frame, [page.start, page.start + 4], [0.85, 1], clamp);
  return (
    <AbsoluteFill style={{ top, alignItems: "center" }}>
      <div
        style={{
          scale: String(s),
          background: "#000",
          color: NEON_GREEN,
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 64,
          lineHeight: 1.3,
          padding: "2px 22px 8px",
          borderRadius: 8,
          direction: "rtl",
          whiteSpace: "nowrap",
          textShadow: `0 0 10px ${NEON_GREEN}88`,
        }}
      >
        {page.words.map((w) => w.text).join(" ")}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Giant neon key word (the reference's pink « وزيت »)
export const NeonWord: React.FC<{
  readonly text: string;
  readonly at: number; // frame
  readonly top: number;
  readonly duration?: number;
}> = ({ text, at, top, duration = 24 }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > at + duration) return null;
  const s = interpolate(frame, [at, at + 6], [2, 1], { ...clamp, easing: pop });
  const o = interpolate(
    frame,
    [at, at + 3, at + duration - 5, at + duration],
    [0, 1, 1, 0],
    clamp,
  );
  return (
    <AbsoluteFill style={{ top, alignItems: "center" }}>
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 230,
          lineHeight: 1,
          color: "#fff",
          scale: String(s),
          opacity: o,
          direction: "rtl",
          textShadow: `0 0 18px ${PINK}, 0 0 42px ${PINK}, 0 0 80px ${PINK}`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Section card: white wall with window light, « تابعني نفسرلك » then a big calligraphy word
export const TitleCard: React.FC<{
  readonly line1: string;
  readonly line2: string;
  readonly big: string;
}> = ({ line1, line2, big }) => {
  const frame = useCurrentFrame();
  const appear = (at: number) =>
    interpolate(frame, [at, at + 6], [0, 1], { ...clamp, easing: pop });
  const marks = ["؟", "!", "؟"];
  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #F4F4F2 0%, #E2E2DF 100%)",
        overflow: "hidden",
      }}
    >
      {/* Window shadow across the wall, drifting slowly */}
      <AbsoluteFill
        style={{
          background:
            "repeating-linear-gradient(115deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 150px, rgba(0,0,0,0.09) 150px, rgba(0,0,0,0.09) 175px)",
          filter: "blur(14px)",
          translate: `${frame * 0.8}px 0`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 230,
          right: 70,
          fontFamily: displayFont,
          fontSize: 104,
          color: "#FFD54A",
          textShadow: "4px 5px 0 #000",
          textDecoration: "underline",
          textDecorationThickness: 6,
          textUnderlineOffset: 18,
          direction: "rtl",
          opacity: appear(0),
          translate: `${(1 - appear(0)) * 80}px 0`,
        }}
      >
        {line1}
      </div>
      <div
        style={{
          position: "absolute",
          top: 380,
          right: 120,
          fontFamily: displayFont,
          fontSize: 110,
          color: "#E3262F",
          direction: "rtl",
          scale: String(appear(6)),
        }}
      >
        {line2}
      </div>
      <AbsoluteFill style={{ top: 520, alignItems: "center" }}>
        <div
          style={{
            fontFamily: calligraphyFont,
            fontWeight: 700,
            fontSize: 330,
            lineHeight: 1.2,
            color: "#111",
            direction: "rtl",
            scale: String(appear(12)),
          }}
        >
          {big}
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          top: 1010,
          flexDirection: "row",
          justifyContent: "center",
          gap: 120,
        }}
      >
        {marks.map((m, i) => (
          <div
            key={i}
            style={{
              fontFamily: displayFont,
              fontSize: 150,
              color: "#E3262F",
              textShadow: "3px 4px 0 rgba(0,0,0,0.35)",
              scale: String(appear(18 + i * 3)),
              rotate: `${(i - 1) * 12}deg`,
            }}
          >
            {m}
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Cut transitions applied to the whole picture
export type CutFx = {
  readonly at: number;
  readonly kind: "leak" | "glitch" | "zoomBlur";
};

const nearest = (cuts: CutFx[], t: number, fps: number) => {
  let best: { cut: CutFx; d: number } | null = null;
  for (const c of cuts) {
    const d = (t - c.at) * fps; // frames after the cut (negative = before)
    if (best === null || Math.abs(d) < Math.abs(best.d)) best = { cut: c, d };
  }
  return best;
};

export const CutTransitions: React.FC<{
  readonly cuts: CutFx[];
  readonly children: React.ReactNode;
}> = ({ cuts, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = nearest(cuts, frame / fps, fps);
  let style: React.CSSProperties = {};
  let overlay: React.ReactNode = null;

  if (n && n.cut.kind === "zoomBlur" && Math.abs(n.d) < 5) {
    const k = 1 - Math.abs(n.d) / 5;
    style = { scale: String(1 + 0.3 * k), filter: `blur(${12 * k}px)` };
  }
  if (n && n.cut.kind === "glitch" && n.d >= -3 && n.d < 4) {
    const seed = Math.round(n.d) + n.cut.at;
    style = {
      translate: `${(random(`gx${seed}`) - 0.5) * 70}px 0`,
      filter: `hue-rotate(${(random(`gh${seed}`) - 0.5) * 50}deg) contrast(1.3)`,
    };
    overlay = (
      <AbsoluteFill style={{ mixBlendMode: "difference" }}>
        {new Array(7).fill(true).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: (random(`sl${seed}${i}`) - 0.3) * 600,
              top: random(`st${seed}${i}`) * 1920,
              width: 500 + random(`sw${seed}${i}`) * 900,
              height: 12 + random(`sh${seed}${i}`) * 70,
              background: i % 2 ? "#00FFF0" : "#FF0055",
              opacity: 0.85,
            }}
          />
        ))}
      </AbsoluteFill>
    );
  }
  if (n && n.cut.kind === "leak" && Math.abs(n.d) < 11) {
    const k = interpolate(Math.abs(n.d), [0, 11], [1, 0], clamp);
    style = { filter: `brightness(${1 + 0.35 * k})` };
    overlay = (
      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          opacity: k,
          background:
            "radial-gradient(circle at 70% 30%, rgba(255,160,60,0.95) 0%, rgba(255,90,120,0.6) 35%, rgba(255,200,150,0) 70%)",
        }}
      />
    );
  }

  return (
    <AbsoluteFill>
      <AbsoluteFill style={style}>{children}</AbsoluteFill>
      {overlay}
    </AbsoluteFill>
  );
};
