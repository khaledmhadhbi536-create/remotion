import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { LightRays, TilePattern } from "../components/Decor";
import { PIECES, ProductCard } from "../components/NumberedProducts";
import {
  PRODUCTS,
  ProductImage,
  type ProductKey,
} from "../components/ProductImage";
import { PHONE, PRICES, STORE_NAME, VALUE_TOTAL } from "../config";
import { bodyFont, brandFont, colors, displayFont } from "../theme";

// Variants of the winning static (gold background, red stamp, numbered product cards).
// The price block copies the "PROMO 1 بدينار" reference: a giant red number on a yellow brush
// stroke with red spark lines. Two variants push the autumn angle (« الخريف دخل »), two carry a
// « before / routine » panel: the problem (drawn) next to the 5-step routine — no result is shown or
// promised. Once REAL photos of a customer who used the pack (and agreed to be shown) exist, pass
// them in `photos` and the same ads switch to a true before / after.

export type WinnerVariant = "autumn1" | "autumn2" | "ba1" | "ba2";
export type BeforeAfterPhotos = {
  readonly before: string; // staticFile path
  readonly after: string;
};

const YELLOW = "#FFD23F";
const RED = "#E3262F";
const AUTUMN = "#FF8A2B";

// ---------- Shared pieces ----------
const GoldBackground: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 45%, ${colors.bronze} 0%, ${colors.bronzeDeep} 50%, ${colors.charcoal} 100%)`,
      overflow: "hidden",
    }}
  >
    <TilePattern color="#ffffff" opacity={0.06} />
    <LightRays color="rgba(255,255,255,0.14)" style={{ top: "48%" }} />
    {children}
  </AbsoluteFill>
);

const Stamp: React.FC<{
  readonly text: string;
  readonly bg?: string;
  readonly top?: number;
}> = ({ text, bg = colors.red, top = 34 }) => (
  <AbsoluteFill style={{ alignItems: "center", paddingTop: top }}>
    <div
      style={{
        fontFamily: displayFont,
        fontSize: 88,
        lineHeight: 1,
        color: colors.white,
        background: bg,
        padding: "12px 50px 26px",
        borderRadius: 22,
        rotate: "-3deg",
        direction: "rtl",
        boxShadow: "0 16px 36px rgba(0,0,0,0.4)",
      }}
    >
      {text}
    </div>
  </AbsoluteFill>
);

const Headline: React.FC<{
  readonly title: string;
  readonly sub?: string;
  readonly top: number;
  readonly size?: number;
}> = ({ title, sub, top, size = 78 }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 0,
      right: 0,
      textAlign: "center",
      direction: "rtl",
    }}
  >
    <div
      style={{
        fontFamily: displayFont,
        fontSize: size,
        lineHeight: 1.1,
        color: colors.white,
        textShadow: "0 4px 12px rgba(0,0,0,0.35)",
      }}
    >
      {title}
    </div>
    {sub ? (
      <div
        style={{
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 40,
          lineHeight: 1.3,
          color: colors.goldLight,
        }}
      >
        {sub}
      </div>
    ) : null}
  </div>
);

// 3 + 2 grid of the numbered cards, scalable
const Grid: React.FC<{ readonly top: number; readonly scale: number }> = ({
  top,
  scale,
}) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 0,
      width: 1080,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 26,
      scale: String(scale),
      transformOrigin: "top center",
    }}
  >
    <div style={{ display: "flex", gap: 24, direction: "rtl" }}>
      {[0, 1, 2].map((i) => (
        <ProductCard key={i} index={i} accent={colors.red} />
      ))}
    </div>
    <div style={{ display: "flex", gap: 24, direction: "rtl" }}>
      {[3, 4].map((i) => (
        <ProductCard key={i} index={i} accent={colors.red} />
      ))}
    </div>
  </div>
);

// Small numbered card for one-row layouts
const MiniCard: React.FC<{ readonly index: number; readonly w: number }> = ({
  index,
  w,
}) => {
  const { product, name, zoom = 1 } = PIECES[index];
  const imgW = w * 0.82;
  const imgH = w * 0.7;
  const h = Math.min(imgH, imgW / PRODUCTS[product].ratio) * zoom;
  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: w * 1.12,
        background: colors.white,
        borderRadius: 20,
        boxShadow: "0 10px 24px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 10,
      }}
    >
      <div
        style={{
          height: imgH + 6,
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <ProductImage product={product} height={h} shadow={false} />
      </div>
      <div
        style={{
          marginTop: 6,
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: w * 0.12,
          lineHeight: 1.2,
          color: colors.charcoal,
          direction: "rtl",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </div>
      <div
        style={{
          position: "absolute",
          top: -12,
          right: -12,
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: colors.red,
          color: colors.white,
          border: `4px solid ${colors.white}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: displayFont,
          fontSize: 30,
          paddingTop: 4,
        }}
      >
        {index + 1}
      </div>
    </div>
  );
};

const MiniRow: React.FC<{ readonly top: number; readonly w: number }> = ({
  top,
  w,
}) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      gap: 14,
      direction: "rtl",
    }}
  >
    {PIECES.map((_, i) => (
      <MiniCard key={i} index={i} w={w} />
    ))}
  </div>
);

// ---------- Price block in the reference style ----------
const BrushStroke: React.FC<{ readonly w: number; readonly h: number }> = ({
  w,
  h,
}) => (
  <svg
    width={w}
    height={h}
    viewBox={`0 0 ${w} ${h}`}
    style={{ position: "absolute", inset: 0 }}
  >
    <defs>
      <filter id="winner-rough" x="-10%" y="-30%" width="120%" height="160%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.035 0.22"
          numOctaves={3}
          seed={7}
        />
        <feDisplacementMap in="SourceGraphic" scale={32} />
      </filter>
    </defs>
    <g filter="url(#winner-rough)">
      <path
        d={`M ${w * 0.04} ${h * 0.26} Q ${w * 0.5} ${h * 0.1} ${w * 0.97} ${h * 0.2} L ${w * 0.95} ${h * 0.84} Q ${w * 0.5} ${h * 0.95} ${w * 0.03} ${h * 0.8} Z`}
        fill={YELLOW}
      />
    </g>
  </svg>
);

const Sparks: React.FC<{ readonly style: React.CSSProperties }> = ({
  style,
}) => (
  <svg width={110} height={120} viewBox="0 0 110 120" style={style}>
    {[
      [20, 100, 50, 20],
      [45, 108, 95, 55],
      [12, 70, 15, 8],
    ].map(([x1, y1, x2, y2], i) => (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={RED}
        strokeWidth={10}
        strokeLinecap="round"
      />
    ))}
  </svg>
);

// « الباك كامل بـ / 49 / دينار » on the yellow stroke
const BigPrice: React.FC<{
  readonly w: number;
  readonly h: number;
  readonly style: React.CSSProperties;
}> = ({ w, h, style }) => {
  const k = h / 260;
  return (
    <div style={{ position: "absolute", width: w, height: h, ...style }}>
      <BrushStroke w={w} h={h} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 22 * k,
          direction: "rtl",
        }}
      >
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 220 * k,
            lineHeight: 1,
            color: RED,
            WebkitTextStroke: `${8 * k}px #fff`,
            paintOrder: "stroke fill",
            textShadow: `${6 * k}px ${7 * k}px 0 ${colors.charcoal}`,
            paddingTop: 30 * k,
            rotate: "-4deg",
          }}
        >
          {PRICES.pack}
        </div>
        <div style={{ textAlign: "center", color: colors.charcoal }}>
          <div
            style={{
              fontFamily: bodyFont,
              fontWeight: 900,
              fontSize: 50 * k,
              lineHeight: 1.1,
            }}
          >
            الباك كامل بـ
          </div>
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 104 * k,
              lineHeight: 1.05,
            }}
          >
            دينار
          </div>
        </div>
      </div>
      <Sparks style={{ position: "absolute", right: -70 * k, top: -10 * k }} />
      <Sparks
        style={{
          position: "absolute",
          left: -60 * k,
          bottom: -50 * k,
          scale: "-1 -1",
        }}
      />
    </div>
  );
};

const Strike: React.FC<{ readonly size?: number }> = ({ size = 44 }) => (
  <div
    style={{
      position: "relative",
      fontFamily: bodyFont,
      fontWeight: 900,
      fontSize: size,
      color: "rgba(255,255,255,0.9)",
      direction: "rtl",
      whiteSpace: "nowrap",
    }}
  >
    بلاصة {VALUE_TOTAL} د.ت
    <div
      style={{
        position: "absolute",
        left: -6,
        right: -6,
        top: "52%",
        height: 6,
        borderRadius: 3,
        background: colors.red,
        rotate: "-5deg",
      }}
    />
  </div>
);

const Cta: React.FC<{ readonly size?: number }> = ({ size = 56 }) => (
  <div
    style={{
      fontFamily: displayFont,
      fontSize: size,
      color: colors.white,
      background: colors.bronze,
      padding: `4px ${size * 0.75}px ${size * 0.3}px`,
      borderRadius: 999,
      boxShadow: "0 10px 0 rgba(0,0,0,0.25), 0 18px 34px rgba(0,0,0,0.3)",
      direction: "rtl",
      whiteSpace: "nowrap",
    }}
  >
    اطلب توّا
  </div>
);

// Price on the right, crossed value + CTA on the left
const OfferRow: React.FC<{ readonly top: number; readonly h?: number }> = ({
  top,
  h = 250,
}) => (
  <>
    <BigPrice w={h * 2.5} h={h} style={{ right: 40, top }} />
    <div
      style={{
        position: "absolute",
        left: 50,
        top: top + h * 0.12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 26,
      }}
    >
      <Strike />
      <Cta />
    </div>
  </>
);

const Footer: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 76,
      background: colors.charcoal,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 18,
      fontFamily: bodyFont,
      fontWeight: 900,
      fontSize: 34,
      color: colors.white,
      direction: "rtl",
    }}
  >
    <span
      style={{
        fontFamily: brandFont,
        fontSize: 30,
        letterSpacing: 5,
        color: colors.goldLight,
      }}
    >
      {STORE_NAME}
    </span>
    •<span>الخلاص عند الاستلام</span>•
    <span>
      ☎ <span style={{ direction: "ltr", unicodeBidi: "embed" }}>{PHONE}</span>
    </span>
  </div>
);

// ---------- Autumn leaves ----------
const LEAF_COLORS = ["#E8661C", "#C8401E", "#F2A23A", "#A8341A"];

const Leaf: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly rotate: number;
  readonly color: number;
  readonly blur?: number;
}> = ({ x, y, size, rotate, color, blur = 0 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{
      position: "absolute",
      left: x,
      top: y,
      rotate: `${rotate}deg`,
      filter: `blur(${blur}px) drop-shadow(0 6px 8px rgba(0,0,0,0.35))`,
    }}
  >
    {/* Maple-like leaf: five lobes and a stem */}
    <path
      d="M50 6 L58 26 L72 18 L68 38 L90 34 L78 50 L92 60 L70 62 L74 80 L56 70 L52 94 L48 94 L44 70 L26 80 L30 62 L8 60 L22 50 L10 34 L32 38 L28 18 L42 26 Z"
      fill={LEAF_COLORS[color % LEAF_COLORS.length]}
    />
    <path
      d="M50 30 L50 94 M50 58 L30 44 M50 58 L70 44"
      stroke="rgba(0,0,0,0.25)"
      strokeWidth={2.5}
      fill="none"
    />
  </svg>
);

const Leaves: React.FC<{
  readonly items: [number, number, number, number, number?][];
}> = ({ items }) => (
  <>
    {items.map(([x, y, size, rotate, blur], i) => (
      <Leaf
        key={i}
        x={x}
        y={y}
        size={size}
        rotate={rotate}
        color={i}
        blur={blur}
      />
    ))}
  </>
);

// ---------- Before / after panel ----------
const Slot: React.FC<{
  readonly label: "قبل" | "بعد";
  readonly src?: string;
  readonly w: number;
  readonly h: number;
}> = ({ label, src, w, h }) => (
  <div
    style={{
      position: "relative",
      width: w,
      height: h,
      borderRadius: 26,
      overflow: "hidden",
      border: "6px solid #fff",
      boxShadow: "0 14px 30px rgba(0,0,0,0.35)",
      background: "rgba(18,24,32,0.55)",
    }}
  >
    {src ? (
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    ) : (
      <div
        style={{
          position: "absolute",
          inset: 18,
          border: "4px dashed rgba(255,255,255,0.7)",
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          direction: "rtl",
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 34,
          lineHeight: 1.35,
          color: "rgba(255,255,255,0.9)",
          padding: 20,
        }}
      >
        تصويرة حريف حقيقية
        <br />({label})
      </div>
    )}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 70,
        background: label === "قبل" ? colors.charcoal : colors.red,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: displayFont,
        fontSize: 50,
        paddingTop: 8,
      }}
    >
      {label}
    </div>
  </div>
);

const ArrowRight: React.FC<{ readonly size: number }> = ({ size }) => (
  // Points from « قبل » (right) to « بعد » (left), the RTL reading order
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={46} fill={YELLOW} />
    <path
      d="M66 50 L34 50 M48 34 L32 50 L48 66"
      stroke={colors.charcoal}
      strokeWidth={10}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const BeforeAfter: React.FC<{
  readonly photos?: BeforeAfterPhotos;
  readonly top: number;
  readonly w: number;
  readonly h: number;
}> = ({ photos, top, w, h }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 18,
      direction: "rtl",
    }}
  >
    <Slot label="قبل" src={photos?.before} w={w} h={h} />
    <ArrowRight size={90} />
    <Slot label="بعد" src={photos?.after} w={w} h={h} />
  </div>
);

// ---------- Problem → routine panel (no result claim) ----------
const ThinningHead: React.FC<{ readonly size: number }> = ({ size }) => (
  // Top-down view of a head with a thinning crown and a few falling hairs — a drawing, not a photo
  <svg width={size} height={size} viewBox="0 0 400 400">
    <defs>
      <radialGradient id="crown" cx="50%" cy="42%" r="34%">
        <stop offset="0%" stopColor="#D9A07A" stopOpacity={1} />
        <stop offset="55%" stopColor="#C98F6A" stopOpacity={0.75} />
        <stop offset="100%" stopColor="#C98F6A" stopOpacity={0} />
      </radialGradient>
      <radialGradient id="front" cx="50%" cy="75%" r="60%">
        <stop offset="0%" stopColor="#D9A07A" stopOpacity={1} />
        <stop offset="60%" stopColor="#D2996F" stopOpacity={0.9} />
        <stop offset="100%" stopColor="#C98F6A" stopOpacity={0} />
      </radialGradient>
      <radialGradient id="hair" cx="50%" cy="45%" r="60%">
        <stop offset="0%" stopColor="#3A2A1E" />
        <stop offset="100%" stopColor="#1C140E" />
      </radialGradient>
    </defs>
    <ellipse cx={200} cy={190} rx={145} ry={160} fill="url(#hair)" />
    {/* Receding front + thinning crown */}
    <ellipse cx={200} cy={322} rx={120} ry={60} fill="url(#front)" />
    <ellipse cx={200} cy={165} rx={110} ry={105} fill="url(#crown)" />
    {/* Sparse strands across the thin area */}
    {Array.from({ length: 40 }).map((_, i) => {
      const a = (i * 137.5 * Math.PI) / 180;
      const r = 20 + ((i * 53) % 90);
      const x = 200 + Math.cos(a) * r;
      const y = 165 + Math.sin(a) * r * 0.95;
      return (
        <line
          key={i}
          x1={x}
          y1={y}
          x2={x + Math.cos(a + 1.2) * 10}
          y2={y + Math.sin(a + 1.2) * 10}
          stroke="#2B1F16"
          strokeWidth={2.2}
          strokeLinecap="round"
          opacity={0.75}
        />
      );
    })}
    {/* Falling hairs */}
    {[
      [40, 250, 0],
      [345, 230, 1],
      [70, 340, 2],
      [330, 330, 3],
      [20, 150, 4],
    ].map(([x, y, k]) => (
      <path
        key={k}
        d={`M ${x} ${y} q 12 18 0 34 q -12 16 4 30`}
        stroke="#2B1F16"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        opacity={0.85}
      />
    ))}
  </svg>
);

const PanelCard: React.FC<{
  readonly label: string;
  readonly labelBg: string;
  readonly bg: string;
  readonly w: number;
  readonly h: number;
  readonly children: React.ReactNode;
}> = ({ label, labelBg, bg, w, h, children }) => (
  <div
    style={{
      position: "relative",
      width: w,
      height: h,
      borderRadius: 26,
      overflow: "hidden",
      border: "6px solid #fff",
      boxShadow: "0 14px 30px rgba(0,0,0,0.35)",
      background: bg,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 70,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 70,
        background: labelBg,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: displayFont,
        fontSize: 50,
        paddingTop: 8,
      }}
    >
      {label}
    </div>
  </div>
);

const ROUTINE: { product: ProductKey; text: string }[] = [
  { product: "sidrBowl", text: "السدر بالأبليكاتور" },
  { product: "dermaRoller", text: "الديرما مرتين في الجمعة" },
  { product: "rosemaryOil", text: "قطرات زيت إكليل الجبل" },
  { product: "brushTerracotta", text: "مساج بالبروس" },
];

const ProblemRoutine: React.FC<{
  readonly top: number;
  readonly w: number;
  readonly h: number;
}> = ({ top, w, h }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 18,
      direction: "rtl",
    }}
  >
    <PanelCard label="قبل" labelBg={colors.charcoal} bg="#2A2F36" w={w} h={h}>
      <ThinningHead size={w * 0.78} />
      <div
        style={{
          marginTop: 4,
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 34,
          lineHeight: 1.3,
          color: "#fff",
          textAlign: "center",
          direction: "rtl",
          padding: "0 20px",
        }}
      >
        الشعر يطيح و يفرغ
        <br />
        <span style={{ color: colors.goldLight, fontSize: 30 }}>
          جرّبت برشا حاجات و ما نفعش
        </span>
      </div>
    </PanelCard>
    <ArrowRight size={90} />
    <PanelCard label="الروتين" labelBg={colors.red} bg="#fff" w={w} h={h}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          width: w - 40,
          direction: "rtl",
        }}
      >
        {ROUTINE.map(({ product, text }, i) => {
          const ih = 112;
          const iw = 140;
          const ph = Math.min(ih, iw / PRODUCTS[product].ratio);
          return (
            <div
              key={product}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  flexShrink: 0,
                  borderRadius: "50%",
                  background: colors.red,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: displayFont,
                  fontSize: 28,
                  paddingTop: 4,
                }}
              >
                {i + 1}
              </div>
              <div
                style={{
                  width: iw,
                  height: ih,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ProductImage product={product} height={ph} shadow={false} />
              </div>
              <div
                style={{
                  fontFamily: bodyFont,
                  fontWeight: 900,
                  fontSize: 30,
                  lineHeight: 1.2,
                  color: colors.charcoal,
                }}
              >
                {text}
              </div>
            </div>
          );
        })}
      </div>
    </PanelCard>
  </div>
);

// ---------- The 4 variants (1080×1350) ----------
const Autumn1: React.FC = () => (
  <GoldBackground>
    <Leaves
      items={[
        [40, 40, 120, -20],
        [930, 30, 110, 25],
        [10, 260, 80, 40, 2],
        [990, 250, 70, -30, 2],
        [960, 760, 90, 15],
        [20, 820, 70, -40, 1],
      ]}
    />
    <Stamp text="الخريف دخل!" bg={AUTUMN} />
    <Headline title="و الشعر بدا يطيح؟" sub="حضّرلو روتين كامل" top={160} />
    <Grid top={320} scale={0.86} />
    <OfferRow top={900} h={250} />
    <Footer />
  </GoldBackground>
);

const Autumn2: React.FC = () => (
  <GoldBackground>
    <Leaves
      items={[
        [60, 70, 130, -18],
        [890, 50, 140, 22],
        [200, 30, 70, 50, 2],
        [770, 210, 70, -35, 2],
        [30, 560, 90, 30],
        [970, 600, 80, -25],
      ]}
    />
    <div
      style={{
        position: "absolute",
        top: 40,
        left: 0,
        right: 0,
        textAlign: "center",
        direction: "rtl",
        fontFamily: displayFont,
        fontSize: 150,
        lineHeight: 1.1,
        color: AUTUMN,
        WebkitTextStroke: "10px #fff",
        paintOrder: "stroke fill",
        textShadow: `6px 8px 0 ${colors.charcoal}`,
        rotate: "-3deg",
      }}
    >
      الخريف دخل
    </div>
    <Headline
      title="شعرك يستحقّ روتين كامل"
      sub="5 قطع من السدر للبروس"
      top={255}
      size={70}
    />
    <MiniRow top={450} w={188} />
    <BigPrice w={820} h={300} style={{ left: 130, top: 710 }} />
    <div
      style={{
        position: "absolute",
        top: 1060,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 60,
        direction: "rtl",
      }}
    >
      <Strike />
      <Cta />
    </div>
    <Footer />
  </GoldBackground>
);

// Real before / after when photos exist, otherwise the problem → routine panel
const Comparison: React.FC<{ readonly photos?: BeforeAfterPhotos }> = ({
  photos,
}) =>
  photos ? (
    <>
      <BeforeAfter photos={photos} top={270} w={430} h={460} />
      <MiniRow top={765} w={176} />
    </>
  ) : (
    <ProblemRoutine top={270} w={460} h={690} />
  );

const Ba1: React.FC<{ readonly photos?: BeforeAfterPhotos }> = ({ photos }) => (
  <GoldBackground>
    <Stamp text="عرض استثنائي!" />
    <Headline title="باك نموّ الشعر للرجال" top={160} size={72} />
    <Comparison photos={photos} />
    <OfferRow top={995} h={220} />
    <Footer />
  </GoldBackground>
);

const Ba2: React.FC<{ readonly photos?: BeforeAfterPhotos }> = ({ photos }) => (
  <GoldBackground>
    <Leaves
      items={[
        [30, 30, 110, -20],
        [950, 40, 100, 25],
      ]}
    />
    <Stamp text="الخريف دخل!" bg={AUTUMN} />
    <Headline
      title={photos ? "قبل و بعد الروتين" : "شعرك يطيح؟ هاو الروتين"}
      top={160}
      size={72}
    />
    <Comparison photos={photos} />
    <OfferRow top={995} h={220} />
    <Footer />
  </GoldBackground>
);

export const WinnerFeed: React.FC<{
  readonly variant: WinnerVariant;
  readonly photos?: BeforeAfterPhotos;
}> = ({ variant, photos }) => {
  if (variant === "autumn1") return <Autumn1 />;
  if (variant === "autumn2") return <Autumn2 />;
  if (variant === "ba1") return <Ba1 photos={photos} />;
  return <Ba2 photos={photos} />;
};

// 9:16 — the 4:5 ad scaled inside the story safe zone, like the original StoryFrame
export const WinnerStory: React.FC<{
  readonly variant: WinnerVariant;
  readonly photos?: BeforeAfterPhotos;
}> = ({ variant, photos }) => {
  const scale = 0.88;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${colors.charcoalSoft} 0%, ${colors.charcoal} 100%)`,
      }}
    >
      <TilePattern color={colors.bronze} opacity={0.08} />
      <div
        style={{
          position: "absolute",
          left: (1080 - 1080 * scale) / 2,
          top: 285,
          width: 1080 * scale,
          height: 1350 * scale,
          borderRadius: 30,
          overflow: "hidden",
          boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 1080,
            height: 1350,
            scale: String(scale),
            transformOrigin: "0 0",
          }}
        >
          <WinnerFeed variant={variant} photos={photos} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
