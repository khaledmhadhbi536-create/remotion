import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { PACK_PIECES, PHONE, PRICES, STORE_NAME, VALUE_TOTAL } from "../config";
import { bodyFont, brandFont, calligraphyFont, displayFont } from "../theme";

// The 4 pack statics (A Deal · B Early · C Natural · D Gift) redone in the style of the
// shop "PROMO" reference: megaphone + PROMO title, price on a yellow brush stroke with red
// spark lines, tilted pink tags, hand-drawn arrows and hearts, light wall and wooden table,
// round logo top-left, pink badge at the bottom. Art is drawn on a 1080×1350 board; the
// 9:16 version scales the board into the story safe zone over a taller backdrop.

export type PromoAngle = "deal" | "early" | "natural" | "gift";

const RED = "#E3262F";
const PINK = "#FF5FA2";
const PINK_DARK = "#D93A82";
const YELLOW = "#FFD23F";
const INK = "#1E1A17";

const COPY: Record<
  PromoAngle,
  { readonly title: string; readonly note: string; readonly tag: string }
> = {
  deal: {
    title: "باك نموّ الشعر للرجال",
    note: "أقل من 10 د.ت للقطعة",
    tag: "عرض استثنائي",
  },
  early: {
    title: "الشعر بدا يخفّ؟",
    note: "ما تستنّاش لين يفوت الفوت",
    tag: "باك الرجال",
  },
  natural: {
    title: "من الطبيعة لجذور شعرك",
    note: "سدر و زيت إكليل الجبل",
    tag: "طبيعي",
  },
  gift: {
    title: "أحسن هدية لراجلك",
    note: "و إلا لبوك و خوك",
    tag: "هدية",
  },
};

// ---------- Backdrop: warm wall, window light, plants, wooden table ----------
const Backdrop: React.FC<{ readonly tableY: number }> = ({ tableY }) => (
  <AbsoluteFill
    style={{
      background: "linear-gradient(180deg, #FBF6EF 0%, #F3E9DC 100%)",
      overflow: "hidden",
    }}
  >
    <AbsoluteFill
      style={{
        background:
          "repeating-linear-gradient(120deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 190px, rgba(120,90,60,0.06) 190px, rgba(120,90,60,0.06) 230px)",
        filter: "blur(18px)",
      }}
    />
    <Plant x={-60} y={tableY - 520} flip={false} />
    <Plant x={900} y={tableY - 470} flip />
    {/* Table */}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: tableY,
        bottom: 0,
        background:
          "repeating-linear-gradient(178deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 22px, rgba(70,35,10,0.10) 23px, rgba(0,0,0,0) 26px), linear-gradient(180deg, #C98C55 0%, #A9693A 45%, #8A5328 100%)",
        boxShadow: "inset 0 14px 22px rgba(255,230,190,0.35)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: tableY - 4,
        height: 10,
        background: "#E3B07E",
      }}
    />
  </AbsoluteFill>
);

const Plant: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly flip: boolean;
}> = ({ x, y, flip }) => (
  <svg
    width={260}
    height={540}
    viewBox="0 0 260 540"
    style={{
      position: "absolute",
      left: x,
      top: y,
      scale: flip ? "-1 1" : undefined,
      opacity: 0.55,
      filter: "blur(3px)",
    }}
  >
    {[
      [130, 540, 60, 120, -28],
      [130, 540, 170, 90, 18],
      [130, 540, 90, 230, -12],
      [130, 540, 200, 260, 30],
      [130, 540, 40, 330, -40],
      [130, 540, 150, 20, 4],
    ].map(([x1, y1, x2, y2, r], i) => (
      <g key={i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5E8A4C" strokeWidth={6} />
        <ellipse
          cx={x2}
          cy={y2}
          rx={34}
          ry={70}
          fill={i % 2 ? "#6FA05A" : "#4E8040"}
          transform={`rotate(${r} ${x2} ${y2})`}
        />
      </g>
    ))}
  </svg>
);

// ---------- Hand-drawn bits ----------
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
      <filter id="rough" x="-10%" y="-30%" width="120%" height="160%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.035 0.22"
          numOctaves={3}
          seed={4}
        />
        <feDisplacementMap in="SourceGraphic" scale={30} />
      </filter>
    </defs>
    <g filter="url(#rough)">
      <path
        d={`M ${w * 0.04} ${h * 0.3} Q ${w * 0.5} ${h * 0.12} ${w * 0.97} ${h * 0.24} L ${w * 0.95} ${h * 0.8} Q ${w * 0.5} ${h * 0.92} ${w * 0.03} ${h * 0.78} Z`}
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

const Arrow: React.FC<{
  readonly d: string;
  readonly head: [number, number, number]; // x, y, angle (deg) of the tip
  readonly color?: string;
  readonly style: React.CSSProperties;
  readonly w: number;
  readonly h: number;
}> = ({ d, head, color = INK, style, w, h }) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={style}>
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={7}
      strokeLinecap="round"
    />
    <g transform={`translate(${head[0]} ${head[1]}) rotate(${head[2]})`}>
      <path
        d="M -26 -16 L 0 0 L -26 16"
        fill="none"
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

const Heart: React.FC<{
  readonly size: number;
  readonly x: number;
  readonly y: number;
  readonly rotate: number;
  readonly filled?: boolean;
}> = ({ size, x, y, rotate, filled = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{ position: "absolute", left: x, top: y, rotate: `${rotate}deg` }}
  >
    <path
      d="M50 88 C 10 60, 2 34, 20 18 C 34 6, 48 14, 50 28 C 52 14, 66 6, 80 18 C 98 34, 90 60, 50 88 Z"
      fill={filled ? RED : "none"}
      stroke={RED}
      strokeWidth={7}
      strokeLinejoin="round"
    />
  </svg>
);

const Megaphone: React.FC<{ readonly size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <path d="M18 48 L18 76 L34 76 L34 48 Z" fill={INK} />
    <path d="M34 48 L88 22 L88 102 L34 76 Z" fill={RED} />
    <path
      d="M34 76 L44 104 L58 100 L50 80 Z"
      fill={INK}
      stroke={INK}
      strokeWidth={3}
      strokeLinejoin="round"
    />
    <rect x={86} y={18} width={10} height={88} rx={5} fill={INK} />
    {[
      [104, 42, 116, 34],
      [106, 62, 118, 62],
      [104, 82, 116, 90],
    ].map(([x1, y1, x2, y2], i) => (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={RED}
        strokeWidth={6}
        strokeLinecap="round"
      />
    ))}
  </svg>
);

// Pink price-tag label with a punched hole and string
const PinkTag: React.FC<{
  readonly text: string;
  readonly x: number;
  readonly y: number;
  readonly rotate: number;
  readonly size?: number;
}> = ({ text, x, y, rotate, size = 40 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      rotate: `${rotate}deg`,
      display: "flex",
      alignItems: "center",
      gap: 14,
      background: PINK,
      color: "#fff",
      fontFamily: bodyFont,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1.25,
      padding: `${size * 0.18}px ${size * 0.6}px ${size * 0.26}px ${size * 0.4}px`,
      borderRadius: `${size * 0.2}px ${size * 0.5}px ${size * 0.5}px ${size * 0.2}px`,
      boxShadow: `0 6px 0 ${PINK_DARK}, 0 14px 24px rgba(0,0,0,0.22)`,
      direction: "rtl",
      whiteSpace: "nowrap",
    }}
  >
    {text}
    <div
      style={{
        width: size * 0.32,
        height: size * 0.32,
        borderRadius: "50%",
        background: "#FBF6EF",
        boxShadow: "inset 0 2px 3px rgba(0,0,0,0.3)",
      }}
    />
  </div>
);

// ---------- Products standing on the table ----------
const Product: React.FC<{
  readonly src: string;
  readonly x: number;
  readonly bottom: number;
  readonly h?: number;
  readonly w?: number;
  readonly rotate?: number;
}> = ({ src, x, bottom, h, w, rotate = 0 }) => (
  <Img
    src={staticFile(src)}
    style={{
      position: "absolute",
      left: x,
      bottom,
      height: h,
      width: w,
      rotate: `${rotate}deg`,
      filter: "drop-shadow(0 18px 14px rgba(60,30,10,0.45))",
    }}
  />
);

const ProductsOnTable: React.FC = () => (
  // Board coordinates; the table starts at y = 990 → bottom 360 of a 1350 board
  <>
    <Product src="products/rosemary-oil.png" x={120} bottom={205} h={300} />
    <Product src="products/sidr-powder.png" x={255} bottom={200} h={270} />
    <Product src="products/bottle-black.png" x={690} bottom={205} h={310} />
    <Product
      src="products/brush-terracotta.png"
      x={780}
      bottom={190}
      w={220}
      rotate={-8}
    />
    <Product
      src="products/derma-roller.png"
      x={385}
      bottom={175}
      w={380}
      rotate={-6}
    />
  </>
);

// ---------- The 1080×1350 board ----------
const Board: React.FC<{ readonly angle: PromoAngle }> = ({ angle }) => {
  const copy = COPY[angle];
  return (
    <AbsoluteFill>
      {/* Round logo */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 40,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: INK,
          border: `6px solid ${YELLOW}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#fff",
          fontFamily: brandFont,
          fontWeight: 700,
          fontSize: 34,
          lineHeight: 1,
          boxShadow: "0 10px 22px rgba(0,0,0,0.25)",
        }}
      >
        {STORE_NAME.split(" ").map((p, i) => (
          <React.Fragment key={i}>
            {i ? <br /> : null}
            {p}
          </React.Fragment>
        ))}
      </div>

      {/* PROMO + megaphone */}
      <div
        style={{
          position: "absolute",
          top: 36,
          right: 60,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Megaphone size={150} />
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 190,
            lineHeight: 1,
            color: RED,
            textShadow: `6px 7px 0 ${INK}`,
            letterSpacing: 4,
            rotate: "-3deg",
            paddingTop: 30,
          }}
        >
          PROMO
        </div>
      </div>

      {/* Angle headline */}
      <div
        style={{
          position: "absolute",
          top: 214,
          left: 0,
          right: 0,
          textAlign: "center",
          direction: "rtl",
          fontFamily: displayFont,
          fontSize: 82,
          lineHeight: 1.15,
          color: INK,
        }}
      >
        {copy.title}
      </div>

      {/* Price on the brush stroke */}
      <div
        style={{
          position: "absolute",
          top: 316,
          left: 150,
          width: 780,
          height: 250,
          rotate: "-3deg",
        }}
      >
        <BrushStroke w={780} h={250} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 26,
            direction: "rtl",
            paddingBottom: 18,
          }}
        >
          <div
            style={{
              fontFamily: bodyFont,
              fontWeight: 900,
              fontSize: 64,
              lineHeight: 1.05,
              color: INK,
              textAlign: "center",
            }}
          >
            {PACK_PIECES} قطع
            <br />
            بـ
          </div>
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 200,
              lineHeight: 1,
              color: RED,
              paddingTop: 24,
            }}
          >
            {PRICES.pack}
          </div>
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 96,
              lineHeight: 1,
              color: INK,
              paddingTop: 24,
            }}
          >
            د.ت
          </div>
        </div>
        <Sparks style={{ position: "absolute", left: -70, top: -60 }} />
        <Sparks
          style={{
            position: "absolute",
            right: -70,
            top: -60,
            scale: "-1 1",
          }}
        />
      </div>

      {/* Crossed-out value + angle tag */}
      <div
        style={{
          position: "absolute",
          top: 568,
          right: 170,
          direction: "rtl",
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 46,
          color: "#7A6A5C",
        }}
      >
        بلاصة{" "}
        <span
          style={{
            textDecoration: "line-through",
            textDecorationColor: RED,
            textDecorationThickness: 6,
          }}
        >
          {VALUE_TOTAL} د.ت
        </span>
      </div>
      <PinkTag text={copy.tag} x={120} y={566} rotate={-7} size={44} />

      {/* Handwritten note + arrows down to the products */}
      <div
        style={{
          position: "absolute",
          top: 650,
          left: 0,
          right: 0,
          textAlign: "center",
          direction: "rtl",
          fontFamily: calligraphyFont,
          fontWeight: 700,
          fontSize: 64,
          lineHeight: 1.3,
          color: PINK_DARK,
        }}
      >
        {copy.note}
      </div>
      <Arrow
        w={180}
        h={200}
        d="M 150 10 C 60 20, 30 80, 50 180"
        head={[50, 180, 95]}
        style={{ position: "absolute", left: 30, top: 640 }}
      />
      <Arrow
        w={180}
        h={200}
        d="M 30 10 C 120 20, 150 80, 130 180"
        head={[130, 180, 85]}
        style={{ position: "absolute", right: 30, top: 640 }}
      />

      <ProductsOnTable />

      {angle === "gift" ? (
        <>
          <Heart size={90} x={50} y={210} rotate={-14} filled />
          <Heart size={70} x={960} y={220} rotate={12} />
          <Heart size={60} x={560} y={740} rotate={-8} filled />
        </>
      ) : (
        <>
          <Heart size={70} x={50} y={215} rotate={-14} />
          <Heart size={56} x={970} y={225} rotate={12} filled />
        </>
      )}

      {/* Bottom pink badge */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          bottom: 40,
          height: 136,
          borderRadius: 68,
          background: PINK,
          boxShadow: `0 8px 0 ${PINK_DARK}, 0 18px 30px rgba(0,0,0,0.3)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          direction: "rtl",
          color: "#fff",
        }}
      >
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 48,
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          الخلاص عند الاستلام
        </div>
        <div style={{ width: 4, height: 80, background: "#fff", opacity: 0.6 }} />
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 70,
            lineHeight: 1,
            direction: "ltr",
            paddingTop: 12,
          }}
        >
          {PHONE}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const BOARD_TABLE_Y = 990;

export const PromoFeed: React.FC<{ readonly angle: PromoAngle }> = ({
  angle,
}) => (
  <AbsoluteFill>
    <Backdrop tableY={BOARD_TABLE_Y} />
    <Board angle={angle} />
  </AbsoluteFill>
);

// 9:16 — the board scaled into the story safe zone (top 250, bottom 400)
const STORY_SCALE = 0.94;
const STORY_TOP = 250;

export const PromoStory: React.FC<{ readonly angle: PromoAngle }> = ({
  angle,
}) => (
  <AbsoluteFill>
    <Backdrop tableY={STORY_TOP + BOARD_TABLE_Y * STORY_SCALE} />
    <div
      style={{
        position: "absolute",
        top: STORY_TOP,
        left: 0,
        width: 1080,
        height: 1350,
        scale: String(STORY_SCALE),
        transformOrigin: "top center",
      }}
    >
      <Board angle={angle} />
    </div>
  </AbsoluteFill>
);
