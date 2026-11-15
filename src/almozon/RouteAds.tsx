import { Audio, Video } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { bodyFont } from "../theme";

// Al Mozon Academy — "Al Mozon, votre route vers l'Allemagne"
// Every ad opens on a 3 s plane flight Al Mozon (Radès) → München, then shows the
// academy's strengths on the real footage of the villa, then the WhatsApp end card.

export const FPS = 30;
export const INTRO = 90; // 3 s plane intro
export const END = 105; // 3.5 s end card

const C = {
  orange: "#F27A1D",
  dark: "#1E1F26",
  cream: "#FBF6EF",
  white: "#FFFFFF",
  muted: "#6B6B76",
};

const F = (p: string) => staticFile(`almozon/${p}`);

// ---------- Footage library (source file, first second, length in source seconds) ----------
type Clip = { src: string; at: number; len: number };
export const CLIPS = {
  signage: { src: "marque.mp4", at: 5.45, len: 0.85 },
  door: { src: "marque.mp4", at: 6.45, len: 2.1 },
  mlogo: { src: "marque.mp4", at: 8.75, len: 1.8 },
  stairs: { src: "marque.mp4", at: 11.25, len: 1.35 },
  raum: { src: "marque.mp4", at: 12.95, len: 1.2 },
  book: { src: "marque.mp4", at: 14.5, len: 1.3 },
  class: { src: "marque.mp4", at: 15.9, len: 1.5 },
  tablet: { src: "marque.mp4", at: 17.5, len: 0.33 },
  wave: { src: "marque.mp4", at: 18.35, len: 1.05 },
  logowall: { src: "plan.mp4", at: 0.0, len: 0.7 },
  worldwall: { src: "plan.mp4", at: 1.9, len: 0.5 },
  test: { src: "plan.mp4", at: 2.6, len: 1.8 },
  class2: { src: "plan.mp4", at: 4.5, len: 1.5 },
  garden: { src: "p6.mp4", at: 0.65, len: 1.9 },
  door2: { src: "p6.mp4", at: 2.65, len: 1.5 },
} satisfies Record<string, Clip>;
export type ClipName = keyof typeof CLIPS;

// ---------- Small building blocks ----------
const useSpringIn = (delay = 0, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.6 } });
};

const Pill: React.FC<{ children: React.ReactNode; size?: number }> = ({
  children,
  size = 30,
}) => (
  <div
    style={{
      display: "inline-block",
      background: C.orange,
      color: C.white,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: 1.5,
      padding: `${size * 0.22}px ${size * 0.7}px`,
      borderRadius: 999,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

const PlaneIcon: React.FC<{ size: number; color?: string }> = ({
  size,
  color = C.orange,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      fill={color}
      d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
    />
  </svg>
);

// Top card. Its size and position also hide the captions burned into the source footage.
const TopCard: React.FC<{
  tag?: string;
  line1: string;
  line2?: string;
  sub?: string;
  delay?: number;
  top?: number;
  minHeight?: number;
}> = ({ tag, line1, line2, sub, delay = 0, top = 200, minHeight = 520 }) => {
  const s = useSpringIn(delay);
  return (
    <div
      style={{
        position: "absolute",
        left: 48,
        right: 48,
        top,
        minHeight,
        background: C.white,
        borderRadius: 36,
        padding: "40px 52px",
        boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 14,
        fontFamily: bodyFont,
        transform: `translateY(${(1 - s) * -40}px) scale(${0.94 + 0.06 * s})`,
        opacity: Math.min(1, s * 1.4),
      }}
    >
      {tag ? (
        <div>
          <Pill>{tag}</Pill>
        </div>
      ) : null}
      <div
        style={{
          fontSize: 76,
          fontWeight: 900,
          lineHeight: 1.08,
          color: C.dark,
        }}
      >
        {line1}
        {line2 ? (
          <>
            <br />
            <span style={{ color: C.orange }}>{line2}</span>
          </>
        ) : null}
      </div>
      {sub ? (
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: C.muted,
            lineHeight: 1.2,
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

const Brandmark: React.FC<{ bottom?: number }> = ({ bottom = 70 }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom,
      display: "flex",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        background: "rgba(255,255,255,0.94)",
        borderRadius: 999,
        padding: "14px 34px 14px 22px",
        fontFamily: bodyFont,
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
      }}
    >
      <PlaneIcon size={44} />
      <div style={{ fontSize: 36, fontWeight: 800, color: C.dark }}>
        Al Mozon,{" "}
        <span style={{ color: C.orange }}>votre route vers l'Allemagne</span>
      </div>
    </div>
  </div>
);

// ---------- 1. Plane intro: Al Mozon (Radès) → München in 3 s ----------
const A = { x: 501, y: 1371 }; // Al Mozon dot on map.png
const B = { x: 612, y: 556 }; // München
const Q = { x: 250, y: 930 }; // curve control point

const bez = (t: number) => ({
  x: (1 - t) ** 2 * A.x + 2 * (1 - t) * t * Q.x + t ** 2 * B.x,
  y: (1 - t) ** 2 * A.y + 2 * (1 - t) * t * Q.y + t ** 2 * B.y,
});
const bezAngle = (t: number) => {
  const dx = 2 * (1 - t) * (Q.x - A.x) + 2 * t * (B.x - Q.x);
  const dy = 2 * (1 - t) * (Q.y - A.y) + 2 * t * (B.y - Q.y);
  return (Math.atan2(dy, dx) * 180) / Math.PI + 90;
};

export type Hook = { tag?: string; line1: string; line2?: string; sub?: string };

export const PlaneIntro: React.FC<{ hook: Hook; brand?: boolean }> = ({
  hook,
  brand = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame, [8, 74], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const p = bez(t);
  const ang = bezAngle(Math.max(0.01, Math.min(0.99, t)));
  const path = `M ${A.x} ${A.y} Q ${Q.x} ${Q.y} ${B.x} ${B.y}`;
  const len = 1000; // pathLength
  const zoom = interpolate(frame, [0, 90], [1, 1.07]);
  const pin = spring({ frame: frame - 70, fps, config: { damping: 9 } });
  const badge = spring({ frame: frame - 30, fps, config: { damping: 12 } });
  const mid = bez(0.5);
  const planeScale = interpolate(t, [0, 0.5, 1], [0.8, 1.25, 0.9]);

  return (
    <AbsoluteFill style={{ background: C.cream, fontFamily: bodyFont }}>
      <AbsoluteFill
        style={{ transform: `scale(${zoom})`, transformOrigin: "50% 55%" }}
      >
        <Img src={F("map.png")} style={{ width: "100%", height: "100%" }} />
        <svg
          width={1080}
          height={1920}
          style={{ position: "absolute", inset: 0 }}
        >
          <path
            d={path}
            pathLength={len}
            fill="none"
            stroke={C.orange}
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray={`${t * len} ${len}`}
            opacity={0.35}
          />
          <path
            d={path}
            pathLength={len}
            fill="none"
            stroke={C.orange}
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray="22 22"
            style={{
              clipPath: "none",
            }}
            strokeDashoffset={0}
            mask="url(#reveal)"
          />
          <defs>
            <mask id="reveal">
              <path
                d={path}
                pathLength={len}
                fill="none"
                stroke="white"
                strokeWidth={14}
                strokeDasharray={`${t * len} ${len}`}
              />
            </mask>
          </defs>
          {/* München pin */}
          <g
            transform={`translate(${B.x} ${B.y}) scale(${pin})`}
            opacity={Math.min(1, pin)}
          >
            <circle r={34} fill={C.orange} opacity={0.25} />
            <circle r={18} fill={C.orange} stroke="white" strokeWidth={6} />
          </g>
        </svg>
        {/* München label */}
        <div
          style={{
            position: "absolute",
            left: B.x + 40,
            top: B.y - 44,
            background: C.white,
            borderRadius: 18,
            padding: "10px 22px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            opacity: Math.min(1, pin),
            transform: `scale(${0.7 + 0.3 * Math.min(1, pin)})`,
            transformOrigin: "left center",
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 800, color: C.dark }}>
            München
          </div>
          <div style={{ fontSize: 24, color: C.muted, marginTop: -6 }}>
            Allemagne
          </div>
        </div>
        {/* distance badge */}
        <div
          style={{
            position: "absolute",
            left: mid.x - 150,
            top: mid.y - 40,
            background: C.orange,
            color: C.white,
            borderRadius: 999,
            padding: "8px 26px",
            fontSize: 34,
            fontWeight: 800,
            opacity: Math.min(1, badge),
            transform: `scale(${Math.min(1, badge)})`,
          }}
        >
          ≈ 1 270 km
        </div>
        {/* plane */}
        <div
          style={{
            position: "absolute",
            left: p.x - 60,
            top: p.y - 60,
            width: 120,
            height: 120,
            transform: `rotate(${ang}deg) scale(${planeScale})`,
            filter: "drop-shadow(0 14px 10px rgba(0,0,0,0.25))",
          }}
        >
          <PlaneIcon size={120} />
        </div>
      </AbsoluteFill>
      <TopCard {...hook} top={150} minHeight={330} />
      {brand ? <Brandmark bottom={110} /> : null}
      <Audio src={staticFile("audio/whoosh.mp3")} volume={0.7} />
      <Sequence from={8}>
        <Audio src={staticFile("audio/riser.mp3")} volume={0.35} />
      </Sequence>
      <Sequence from={70}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.6} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------- 2. Strength scene on real footage ----------
export type Shot = {
  kind?: "footage" | "prof" | "platform" | "dossier";
  clip?: ClipName;
  frames: number;
  tag: string;
  line1: string;
  line2?: string;
  sub?: string;
};

const Footage: React.FC<{ clip: ClipName; frames: number; zoomIn?: boolean }> = ({
  clip,
  frames,
  zoomIn = true,
}) => {
  const frame = useCurrentFrame();
  const c = CLIPS[clip];
  // Slow the clip down if it is shorter than the shot.
  const rate = Math.min(1, (c.len * FPS) / frames);
  const z = interpolate(frame, [0, frames], zoomIn ? [1.04, 1.12] : [1.12, 1.04]);
  return (
    <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 15%" }}>
      <Video
        src={F(c.src)}
        trimBefore={Math.round(c.at * FPS)}
        playbackRate={rate}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

// Prof talking head: the source has its own header/footer, keep only the video band.
const ProfScene: React.FC<{ frames: number }> = ({ frames }) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, frames], [1, 1.05]);
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <div
        style={{
          position: "absolute",
          left: 48,
          right: 48,
          top: 760,
          height: 1020,
          borderRadius: 36,
          overflow: "hidden",
          boxShadow: "0 18px 50px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -48,
            top: -540 - 0,
            width: 1080,
            height: 1920,
            transform: `scale(${z})`,
            transformOrigin: "50% 55%",
          }}
        >
          <Video
            src={F("prof.mp4")}
            trimBefore={Math.round(0.4 * FPS)}
            muted
            style={{ width: 1080, height: 1920 }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Online platform: a phone mock-up over the blurred class footage.
const PlatformScene: React.FC<{ frames: number }> = ({ frames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ph = spring({ frame: frame - 4, fps, config: { damping: 13 } });
  const rows = [
    { t: "Lektion 1 · Begrüßung", d: true },
    { t: "Lektion 2 · Familie", d: true },
    { t: "Hörverstehen · Audio", d: true },
    { t: "Quiz A1 · Prüfung", d: false },
  ];
  const prog = interpolate(frame, [10, frames - 10], [0.35, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: "blur(14px) brightness(0.75)" }}>
        <Footage clip="class" frames={frames} />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 250,
          top: 790,
          width: 580,
          height: 1000,
          background: C.dark,
          borderRadius: 64,
          padding: 18,
          transform: `translateY(${(1 - ph) * 300}px) rotate(${(1 - ph) * -8}deg)`,
          boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
          fontFamily: bodyFont,
        }}
      >
        <div
          style={{
            background: C.cream,
            borderRadius: 48,
            width: "100%",
            height: "100%",
            padding: "50px 34px",
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Img src={F("logo.png")} style={{ height: 70 }} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: C.dark }}>
            Mon parcours · A1 → B2
          </div>
          <div
            style={{
              height: 20,
              background: "#EADFD2",
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${prog * 100}%`,
                height: "100%",
                background: C.orange,
              }}
            />
          </div>
          {rows.map((r, i) => {
            const s = spring({
              frame: frame - 12 - i * 6,
              fps,
              config: { damping: 14 },
            });
            return (
              <div
                key={r.t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  background: C.white,
                  borderRadius: 20,
                  padding: "18px 20px",
                  fontSize: 27,
                  fontWeight: 700,
                  color: C.dark,
                  opacity: s,
                  transform: `translateX(${(1 - s) * 60}px)`,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 99,
                    background: r.d ? C.orange : "#EADFD2",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                  }}
                >
                  {r.d ? "✓" : "▶"}
                </div>
                {r.t}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Dossier: a checklist that fills up, ending on the plane.
const DossierScene: React.FC<{ frames: number }> = ({ frames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steps = [
    "Test de niveau gratuit",
    "Formation A1 → B2",
    "Préparation à l'examen",
    "Ton dossier, traité avec toi",
  ];
  const per = Math.max(8, Math.floor((frames - 20) / steps.length));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: "blur(10px) brightness(0.7)" }}>
        <Footage clip="test" frames={frames} />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 820,
          display: "flex",
          flexDirection: "column",
          gap: 26,
          fontFamily: bodyFont,
        }}
      >
        {steps.map((st, i) => {
          const s = spring({
            frame: frame - 6 - i * per,
            fps,
            config: { damping: 13 },
          });
          return (
            <div
              key={st}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26,
                background: C.white,
                borderRadius: 28,
                padding: "26px 32px",
                fontSize: 44,
                fontWeight: 800,
                color: C.dark,
                opacity: Math.min(1, s * 1.5),
                transform: `translateX(${(1 - s) * -80}px)`,
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 99,
                  background: C.orange,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                  flexShrink: 0,
                }}
              >
                {i === steps.length - 1 ? <PlaneIcon size={40} color="white" /> : "✓"}
              </div>
              {st}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const ShotScene: React.FC<{ shot: Shot }> = ({ shot }) => {
  const kind = shot.kind ?? "footage";
  return (
    <AbsoluteFill style={{ background: "black" }}>
      {kind === "footage" && shot.clip ? (
        <Footage clip={shot.clip} frames={shot.frames} />
      ) : null}
      {kind === "prof" ? <ProfScene frames={shot.frames} /> : null}
      {kind === "platform" ? <PlatformScene frames={shot.frames} /> : null}
      {kind === "dossier" ? <DossierScene frames={shot.frames} /> : null}
      <TopCard
        tag={shot.tag}
        line1={shot.line1}
        line2={shot.line2}
        sub={shot.sub}
        delay={2}
        minHeight={kind === "footage" ? 560 : 440}
      />
      <Audio src={staticFile("audio/pop.mp3")} volume={0.35} />
    </AbsoluteFill>
  );
};

// ---------- 3. End card ----------
export const EndCard: React.FC<{ keyword?: string }> = ({ keyword }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (d: number) => spring({ frame: frame - d, fps, config: { damping: 13 } });
  const fly = interpolate(frame, [0, END], [-200, 1280]);
  return (
    <AbsoluteFill
      style={{
        background: C.white,
        fontFamily: bodyFont,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 260,
          left: fly,
          transform: "rotate(90deg)",
          opacity: 0.9,
        }}
      >
        <PlaneIcon size={90} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          width: fly + 40,
          borderTop: `6px dashed ${C.orange}`,
          opacity: 0.35,
        }}
      />
      <div style={{ transform: `scale(${s(0)})` }}>
        <Img src={F("logo.png")} style={{ width: 520 }} />
      </div>
      <div
        style={{
          marginTop: 40,
          fontSize: 66,
          fontWeight: 900,
          color: C.dark,
          lineHeight: 1.1,
          opacity: s(6),
        }}
      >
        Votre route vers
        <br />
        <span style={{ color: C.orange }}>l'Allemagne</span>
      </div>
      <div style={{ marginTop: 44, transform: `scale(${s(14)})` }}>
        <Pill size={46}>Remise en ce moment</Pill>
      </div>
      <div
        style={{
          marginTop: 44,
          fontSize: 44,
          fontWeight: 700,
          color: C.dark,
          opacity: s(20),
        }}
      >
        {keyword ? (
          <>
            Écris <span style={{ color: C.orange }}>« {keyword} »</span> sur
            WhatsApp
          </>
        ) : (
          "Écris-nous sur WhatsApp"
        )}
      </div>
      <div
        style={{
          fontSize: 110,
          fontWeight: 900,
          color: C.dark,
          letterSpacing: 2,
          opacity: s(24),
          transform: `scale(${0.9 + 0.1 * s(24)})`,
        }}
      >
        99 008 008
      </div>
      <div
        style={{
          marginTop: 20,
          fontSize: 32,
          color: C.muted,
          fontWeight: 600,
          opacity: s(30),
        }}
      >
        Test de niveau gratuit · 5 av. de la République, Radès
      </div>
      <Sequence from={14}>
        <Audio src={staticFile("audio/shimmer.mp3")} volume={0.4} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------- Full ad ----------
export type AdSpec = {
  id: string;
  hook: Hook;
  shots: Shot[];
  keyword?: string;
  voice?: string; // optional file in public/almozon/voice/
};

export const adFrames = (spec: AdSpec) =>
  INTRO + spec.shots.reduce((a, s) => a + s.frames, 0) + END;

export const RouteAd: React.FC<{ spec: AdSpec }> = ({ spec }) => {
  const total = adFrames(spec);
  let from = INTRO;
  const hasVoice = Boolean(spec.voice);
  return (
    <AbsoluteFill style={{ background: "black" }}>
      <Sequence durationInFrames={INTRO} name="Intro avion">
        <PlaneIntro hook={spec.hook} brand={false} />
      </Sequence>
      {spec.shots.map((shot, i) => {
        const el = (
          <Sequence
            key={i}
            from={from}
            durationInFrames={shot.frames}
            name={shot.tag}
            premountFor={30}
          >
            <ShotScene shot={shot} />
          </Sequence>
        );
        from += shot.frames;
        return el;
      })}
      <Sequence from={total - END} durationInFrames={END} name="Fin">
        <EndCard keyword={spec.keyword} />
      </Sequence>
      <Audio
        src={staticFile("audio/music.mp3")}
        loop
        volume={(f) =>
          interpolate(
            f,
            [0, 10, total - END, total - END + 10, total - 15, total],
            hasVoice ? [0, 0.1, 0.1, 0.35, 0.35, 0] : [0, 0.3, 0.3, 0.45, 0.45, 0],
            { extrapolateRight: "clamp" },
          )
        }
      />
      {spec.voice ? (
        <Audio src={F(`voice/${spec.voice}`)} volume={1} />
      ) : null}
    </AbsoluteFill>
  );
};

// Standalone 3-second plane clip.
export const Plane3s: React.FC = () => (
  <PlaneIntro
    hook={{
      line1: "Al Mozon,",
      line2: "votre route vers l'Allemagne",
    }}
  />
);
