import React, { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { bodyFont } from "../theme";
import { FPS, PHRASES, srcToOut } from "./edit";

// TikTok-style Arabic captions: 1–3 words per page, the spoken word is highlighted,
// key words get their own colour and a small pop.
type Word = { text: string; start: number; end: number; emphasis: boolean };
type Page = { words: Word[]; start: number; end: number };

const MAX_WORDS = 3;
const MAX_CHARS = 18;

const buildPages = (): Page[] => {
  const pages: Page[] = [];
  for (const p of PHRASES) {
    const start = srcToOut(p.start) * FPS;
    const end = srcToOut(p.end) * FPS;
    const tokens = p.text.split(/\s+/).filter(Boolean);
    // Word timing ∝ character count (Arabic words are fairly uniform in speaking rate)
    const weights = tokens.map((t) => t.length + 1);
    const total = weights.reduce((a, b) => a + b, 0);
    let t = start;
    const words: Word[] = tokens.map((tok, i) => {
      const d = ((end - start) * weights[i]) / total;
      const w = {
        text: tok,
        start: t,
        end: t + d,
        emphasis: (p.emphasis ?? []).includes(tok),
      };
      t += d;
      return w;
    });
    // Short connector words ("و", "في"…) stick to the following word
    let cur: Word[] = [];
    const flush = () => {
      if (cur.length) {
        pages.push({
          words: cur,
          start: cur[0].start,
          end: cur[cur.length - 1].end,
        });
        cur = [];
      }
    };
    for (const w of words) {
      const chars = cur.reduce((a, x) => a + x.text.length + 1, 0);
      const last = cur[cur.length - 1];
      const lastIsConnector = last && last.text.length <= 2;
      if (
        cur.length &&
        !lastIsConnector &&
        (cur.length >= MAX_WORDS || chars + w.text.length > MAX_CHARS)
      ) {
        flush();
      }
      cur.push(w);
    }
    flush();
  }
  // Keep each page on screen until the next one (no flicker in short pauses)
  for (let i = 0; i < pages.length - 1; i++) {
    const gap = pages[i + 1].start - pages[i].end;
    if (gap < 12) pages[i].end = pages[i + 1].start;
  }
  return pages;
};

export const Subtitles: React.FC<{ readonly top: number }> = ({ top }) => {
  const frame = useCurrentFrame();
  const pages = useMemo(buildPages, []);
  const page = pages.find((p) => frame >= p.start && frame < p.end);
  if (!page) return null;

  const enter = interpolate(frame, [page.start, page.start + 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 1.4, 0.4, 1),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "6px 18px",
        direction: "rtl",
        scale: String(0.85 + 0.15 * enter),
        opacity: Math.min(1, enter * 1.5),
      }}
    >
      {page.words.map((w, i) => {
        const active = frame >= w.start && frame < w.end;
        const pop = w.emphasis
          ? interpolate(
              frame,
              [w.start, w.start + 4, w.start + 9],
              [1, 1.18, 1.06],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            )
          : 1;
        return (
          <span
            key={i}
            style={{
              fontFamily: bodyFont,
              fontWeight: 900,
              fontSize: 84,
              lineHeight: 1.25,
              color: w.emphasis ? "#FFE14D" : "#FFFFFF",
              WebkitTextStroke: "14px #000",
              paintOrder: "stroke fill",
              textShadow: "0 8px 18px rgba(0,0,0,0.55)",
              padding: "0 14px 6px",
              borderRadius: 18,
              background: active ? "rgba(46,170,90,0.95)" : "transparent",
              scale: String(pop),
              display: "inline-block",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
