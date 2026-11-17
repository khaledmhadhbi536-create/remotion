// AlMozonPremium: 9:16 premium spot for Al Mozon Academy, built only from the academy's real footage.
// Timing comes from plan.json (scenes, shots, subtitles, end card), driven by the voice-over lengths.
// Layers: footage (crop that hides old caption cards, slow push, cross-dissolves) -> grade -> scene title
// -> subtitles (optional) -> end card -> grain + vignette.
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "../theme"; // loads Cairo + Playfair Display from public/fonts
import plan from "./plan_v4.json";
import geo from "./benarous_map.json";

const T = {
  orange: "#F07926",
  ink: "#141414",
  cream: "#FBF7F0",
  white: "#FFFFFF",
  serif: "Playfair Display",
  sans: "Cairo",
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.83, 0, 0.17, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CROP = 1.32; // default // bottom-anchored crop: hides the top ~24% where the old ads had caption cards

type Shot = { src: string; from_: number; start: number; end: number; rate: number; crop?: number };

const ShotLayer: React.FC<{ s: Shot; k: number }> = ({ s, k }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t < s.start - 0.05 || t > s.end + 0.05) return null;
  const fadeIn = interpolate(t, [s.start, s.start + 0.4], [0, 1], { ...clamp, easing: T.inOut });
  const p = interpolate(t, [s.start, s.end], [0, 1], { ...clamp, easing: T.inOut });
  const push = k % 2 === 0 ? 1 + 0.06 * p : 1.06 - 0.06 * p; // gentle push in / pull out
  const drift = (k % 3 === 0 ? -1 : 1) * 18 * p;
  return (
    <AbsoluteFill style={{ opacity: fadeIn, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${(s.crop ?? CROP) * push}) translateX(${drift}px)`, transformOrigin: "50% 100%" }}>
        {/* the shot's own timeline starts at its start, so the source plays from `from_` */}
        <Sequence from={Math.round(s.start * fps)} durationInFrames={Math.round((s.end - s.start) * fps) + 2} layout="none">
          <OffthreadVideo
            src={staticFile(s.src)}
            trimBefore={Math.round(s.from_ * fps)}
            playbackRate={s.rate}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Footage: React.FC = () => {
  const shots = plan.scenes.flatMap((sc) => sc.shots as Shot[]);
  return (
    <AbsoluteFill style={{ filter: "contrast(1.07) saturate(1.08) brightness(1.02)" }}>
      {shots.map((s, k) => (
        <ShotLayer key={k} s={s} k={k} />
      ))}
    </AbsoluteFill>
  );
};

const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: "#F2B27A", mixBlendMode: "soft-light", opacity: 0.16 }} />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.15) 26%, transparent 42%, transparent 62%, rgba(10,10,10,0.5) 100%)",
      }}
    />
  </AbsoluteFill>
);

// scene headline: thin orange rule grows, then each line rises in, staggered; leaves before the next scene
const SceneTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const sc = plan.scenes.find((s) => t >= s.start && t < Math.min(s.end, plan.endStart));
  if (!sc) return null;
  const local = t - sc.start - 0.5;
  const outT = Math.min(sc.end, plan.endStart) - t;
  const exit = interpolate(outT, [0, 0.35], [0, 1], { ...clamp, easing: T.in });
  const rule = interpolate(local, [0, 0.6], [0, 1], { ...clamp, easing: T.out });
  const lines = sc.title.split("\n");
  return (
    <AbsoluteFill style={{ top: 250, height: 420, alignItems: "center", opacity: exit }}>
      <div style={{ width: 140 * rule, height: 5, background: T.orange, borderRadius: 3, marginBottom: 28 }} />
      {lines.map((ln, i) => {
        const s = spring({ frame: Math.round((local - 0.15 - i * 0.12) * fps), fps, config: { damping: 20, stiffness: 90, mass: 1 } });
        return (
          <div
            key={i}
            style={{
              fontFamily: T.sans,
              fontWeight: 800,
              fontSize: ln.length > 26 ? 52 : 62,
              letterSpacing: "0.06em",
              lineHeight: 1.18,
              color: T.white,
              textAlign: "center",
              textShadow: "0 4px 24px rgba(0,0,0,0.55)",
              opacity: s,
              transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px) scale(${interpolate(s, [0, 1], [0.96, 1])})`,
              maxWidth: 960,
            }}
          >
            {ln}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const s = plan.subs.find((x) => t >= x.start && t < x.end);
  if (!s) return null;
  const a = interpolate(t, [s.start, s.start + 0.18], [0, 1], { ...clamp, easing: T.out });
  const z = interpolate(t, [s.end - 0.12, s.end], [1, 0], { ...clamp, easing: T.in });
  return (
    <AbsoluteFill style={{ top: t >= plan.endStart ? 1590 : 1330, height: 330, alignItems: "center", justifyContent: "flex-start" }}>
      <div
        style={{
          direction: s.rtl ? "rtl" : "ltr",
          fontFamily: T.sans,
          fontWeight: s.rtl ? 700 : 600,
          fontSize: s.rtl ? 54 : 50,
          lineHeight: 1.35,
          color: T.white,
          textAlign: "center",
          maxWidth: 900,
          padding: "14px 30px",
          borderRadius: 18,
          background: "rgba(12,12,12,0.55)",
          opacity: a * z,
          transform: `translateY(${(1 - a) * 12}px)`,
        }}
      >
        {s.text}
      </div>
    </AbsoluteFill>
  );
};

// end card: cream panel over the blurred villa, real logo, tagline, registrations pill, contact
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps - plan.endStart;
  if (t < 0) return null;
  const f = Math.round(t * fps);
  const bg = interpolate(t, [0, 0.6], [0, 1], { ...clamp, easing: T.inOut });
  const sp = (d: number) => spring({ frame: f - Math.round(d * fps), fps, config: { damping: 18, stiffness: 110, mass: 0.8 } });
  const logo = sp(0.25), l1 = sp(0.6), l2 = sp(0.8), pill = sp(1.0), c = sp(1.2);
  const breathe = 1 + Math.sin(f / 24) * 0.01;
  const rise = (s: number) => ({ opacity: s, transform: `translateY(${(1 - s) * 26}px)` });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: T.cream, opacity: bg * 0.93 }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 0 }}>
        <Img
          src={staticFile("almozon/logo.png")}
          style={{ width: 430, opacity: logo, transform: `scale(${interpolate(logo, [0, 1], [0.88, 1]) * breathe})` }}
        />
        <div style={{ marginTop: 34, fontFamily: T.sans, fontWeight: 800, fontSize: 64, letterSpacing: "0.08em", color: T.ink, ...rise(l1) }}>
          AL MOZON ACADEMY
        </div>
        <div style={{ marginTop: 14, fontFamily: T.serif, fontStyle: "italic", fontSize: 46, color: "#3A3A3A", ...rise(l2) }}>
          Apprenez l'allemand, préparez votre avenir.
        </div>
        <div
          style={{
            marginTop: 46,
            padding: "18px 46px",
            borderRadius: 999,
            background: T.orange,
            color: T.white,
            fontFamily: T.sans,
            fontWeight: 800,
            fontSize: 44,
            letterSpacing: "0.1em",
            boxShadow: "0 18px 40px rgba(240,121,38,0.35)",
            ...rise(pill),
          }}
        >
          INSCRIPTIONS OUVERTES
        </div>
        <div style={{ marginTop: 34, fontFamily: T.sans, fontWeight: 600, fontSize: 40, color: "#3A3A3A", ...rise(c) }}>
          Contactez-nous pour plus d'informations
        </div>
        <div style={{ marginTop: 10, fontFamily: T.sans, fontWeight: 700, fontSize: 48, color: T.ink, ...rise(c) }}>
          WhatsApp {plan.contact.whatsapp}
        </div>
        <div style={{ marginTop: 6, fontFamily: T.sans, fontWeight: 500, fontSize: 36, color: "#555", ...rise(c) }}>
          {plan.contact.place}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};


// map of Ben Arous governorate (OpenStreetMap outlines), then a flash and a pin on Radès, the camera eases in on it
const MapOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const m = plan.map;
  if (t < m.start - 0.05 || t > m.end + 0.4) return null;
  const inP = spring({ frame: Math.round((t - m.start) * fps), fps, config: { damping: 20, stiffness: 90, mass: 1 } });
  const out = interpolate(t, [m.end, m.end + 0.35], [1, 0], { ...clamp, easing: T.in });
  const fl = t - m.flash;
  const hit = spring({ frame: Math.round(fl * fps), fps, config: { damping: 12, stiffness: 160, mass: 0.6 } });
  const flash = interpolate(fl, [0, 0.06, 0.5], [0, 0.9, 0], clamp);
  const rades = geo.deleg.find((d) => d.name === "Radès")!;
  const [cx, cy] = rades.c;
  const zoom = 1 + 0.35 * interpolate(fl, [0.1, 1.4], [0, 1], { ...clamp, easing: T.inOut });
  const S = 0.95, W = geo.w * S, X = (1080 - W) / 2, Y = 560;
  const ox = X + cx * S, oy = Y + cy * S;
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, inP * 1.2) * out }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #13110F 0%, #1E1A16 100%)" }} />
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${ox}px ${oy}px` }}>
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <g transform={`translate(${X},${Y + (1 - inP) * 40}) scale(${S})`}>
            <path d={geo.gov} fill="#3A332C" stroke="#8C7B6A" strokeWidth={3} />
            {geo.deleg.map((d) => (
              <path key={d.name} d={d.d} fill={d.name === "Radès" ? T.orange : "#4A4139"} fillOpacity={d.name === "Radès" ? hit : 1}
                stroke="#BFAF9C" strokeOpacity={0.55} strokeWidth={1.6} />
            ))}
            {[0, 1, 2].map((k) => {
              const r = interpolate(((fl - k * 0.35) % 1.05 + 1.05) % 1.05, [0, 1.05], [10, 120]);
              const o = fl > 0 ? interpolate(((fl - k * 0.35) % 1.05 + 1.05) % 1.05, [0, 1.05], [0.7, 0]) : 0;
              return <circle key={k} cx={cx} cy={cy} r={r} fill="none" stroke={T.orange} strokeWidth={4} opacity={o} />;
            })}
          </g>
        </svg>
        {/* pin + label on Radès */}
        <div style={{ position: "absolute", left: ox, top: oy, transform: `translate(-50%, -100%) translateY(${(1 - hit) * -60}px) scale(${hit})`, opacity: hit }}>
          <div style={{ background: T.white, color: T.ink, borderRadius: 18, padding: "10px 22px", fontFamily: T.sans, fontWeight: 800, fontSize: 38, whiteSpace: "nowrap", boxShadow: "0 12px 30px rgba(0,0,0,0.45)" }}>
            Al Mozon Academy · <span style={{ color: T.orange }}>Radès</span>
          </div>
          <div style={{ width: 4, height: 46, background: T.white, margin: "0 auto" }} />
          <div style={{ width: 22, height: 22, borderRadius: 11, background: T.orange, border: "4px solid #fff", margin: "-4px auto 0" }} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1700, textAlign: "center", fontFamily: T.sans, fontWeight: 700, fontSize: 34, letterSpacing: "0.2em", color: "#CDBFAE", opacity: inP }}>
        GOUVERNORAT DE BEN AROUS
      </div>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${ox}px ${oy}px, rgba(255,240,220,${flash}) 0%, rgba(255,200,140,${flash * 0.5}) 18%, transparent 45%)` }} />
    </AbsoluteFill>
  );
};

// the plane flies from Al Mozon (Radès) to München: real clip from the academy's campaign
const PlaneOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const p = plan.plane;
  if (t < p.start - 0.05 || t > p.end + 0.3) return null;
  const o = interpolate(t, [p.start, p.start + 0.25, p.end, p.end + 0.3], [0, 1, 1, 0], { ...clamp, easing: T.inOut });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Sequence from={Math.round(p.start * fps)} layout="none">
        <OffthreadVideo src={staticFile("almozon/avion.mp4")} trimBefore={Math.round(0.8 * fps)} playbackRate={1.05} muted style={{ width: "100%", height: "100%" }} />
      </Sequence>
    </AbsoluteFill>
  );
};

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
const Finish: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{ backgroundImage: NOISE, backgroundSize: "220px", backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`, opacity: 0.04, mixBlendMode: "overlay" }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.28) 100%)" }} />
    </AbsoluteFill>
  );
};

export const ALMOZON_V4_FRAMES = plan.durationInFrames;

export const AlMozonPremiumV4: React.FC<{ subtitles: boolean }> = ({ subtitles }) => (
  <AbsoluteFill style={{ backgroundColor: T.ink }}>
    <Footage />
    <Grade />
    <MapOverlay />
    <SceneTitle />
    <PlaneOverlay />
    {subtitles ? <Subtitles /> : null}
    <EndCard />
    <Finish />
  </AbsoluteFill>
);
