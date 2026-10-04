import React from "react";
import { AbsoluteFill } from "remotion";
import { LightRays, TilePattern } from "../components/Decor";
import {
  PackGroup,
  ProductImage,
  type ProductKey,
} from "../components/ProductImage";
import { PACK_PIECES, PRICES, STORE_NAME, VALUE_TOTAL } from "../config";
import { bodyFont, brandFont, colors, displayFont } from "../theme";

// Four static ads (1080×1350, 4:5 feed) — one per avatar / angle. See ADS-STATIQUES.md.
// A · Deal hunter   B · Young man, early thinning   C · Natural-first   D · Gift (women buying for him)

const NATURE = "#3F7A3A";

// ---------- Shared building blocks ----------
const Brand: React.FC<{
  readonly color?: string;
  readonly size?: number;
  readonly style?: React.CSSProperties;
}> = ({ color = colors.goldLight, size = 40, style }) => (
  <div
    style={{
      fontFamily: brandFont,
      fontWeight: 900,
      fontSize: size,
      letterSpacing: size / 6,
      color,
      ...style,
    }}
  >
    {STORE_NAME}
  </div>
);

const Check: React.FC<{ readonly color: string; readonly tick?: string }> = ({
  color,
  tick = colors.white,
}) => (
  <svg width="46" height="46" viewBox="0 0 10 10" style={{ flexShrink: 0 }}>
    <circle cx="5" cy="5" r="5" fill={color} />
    <path
      d="M2.6 5.2 L4.3 6.8 L7.4 3.6"
      stroke={tick}
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PriceTag: React.FC<{
  readonly size?: number;
  readonly style?: React.CSSProperties;
}> = ({ size = 150, style }) => (
  <div
    style={{
      fontFamily: displayFont,
      fontSize: size,
      lineHeight: 1,
      color: colors.charcoal,
      background: colors.goldLight,
      padding: `0 ${size * 0.25}px ${size * 0.16}px`,
      borderRadius: size * 0.18,
      boxShadow: "0 14px 0 #9C7020, 0 26px 44px rgba(0,0,0,0.4)",
      direction: "rtl",
      ...style,
    }}
  >
    {PRICES.pack} د.ت
  </div>
);

const Strike: React.FC<{
  readonly children: React.ReactNode;
  readonly color: string;
  readonly size?: number;
}> = ({ children, color, size = 52 }) => (
  <div
    style={{
      position: "relative",
      fontFamily: bodyFont,
      fontWeight: 900,
      fontSize: size,
      color,
      direction: "rtl",
    }}
  >
    {children}
    <div
      style={{
        position: "absolute",
        left: -6,
        right: -6,
        top: "52%",
        height: 7,
        borderRadius: 4,
        background: colors.red,
        rotate: "-5deg",
      }}
    />
  </div>
);

const Cta: React.FC<{
  readonly children: React.ReactNode;
  readonly bg?: string;
  readonly fg?: string;
  readonly size?: number;
}> = ({ children, bg = colors.bronze, fg = colors.white, size = 58 }) => (
  <div
    style={{
      fontFamily: displayFont,
      fontSize: size,
      color: fg,
      background: bg,
      padding: `4px ${size * 0.8}px ${size * 0.3}px`,
      borderRadius: 999,
      boxShadow: "0 10px 0 rgba(0,0,0,0.25), 0 18px 34px rgba(0,0,0,0.3)",
      direction: "rtl",
    }}
  >
    {children}
  </div>
);

// ---------- A · Deal hunter ----------
export const StaticDeal: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 40%, ${colors.bronze} 0%, ${colors.bronzeDeep} 45%, ${colors.charcoal} 100%)`,
      overflow: "hidden",
    }}
  >
    <TilePattern color="#ffffff" opacity={0.06} />
    <LightRays color="rgba(255,255,255,0.18)" style={{ top: "40%" }} />

    <AbsoluteFill style={{ alignItems: "center", paddingTop: 54 }}>
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 100,
          lineHeight: 1,
          color: colors.white,
          background: colors.red,
          padding: "14px 56px 30px",
          borderRadius: 24,
          rotate: "-3deg",
          direction: "rtl",
          boxShadow: "0 18px 40px rgba(0,0,0,0.4)",
        }}
      >
        عرض استثنائي!
      </div>
    </AbsoluteFill>

    <AbsoluteFill style={{ alignItems: "center", paddingTop: 230 }}>
      <PackGroup scale={1.22} />
    </AbsoluteFill>

    <AbsoluteFill
      style={{ alignItems: "center", paddingTop: 880, direction: "rtl" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 92,
            color: colors.white,
            textShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          {PACK_PIECES} قطع بـ
        </div>
        <PriceTag size={150} />
      </div>
      <div style={{ marginTop: 36 }}>
        <Strike color="rgba(255,255,255,0.85)">بلاصة {VALUE_TOTAL} د.ت</Strike>
      </div>
    </AbsoluteFill>

    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 116,
        background: colors.charcoal,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        fontFamily: bodyFont,
        fontWeight: 900,
        fontSize: 42,
        color: colors.white,
        direction: "rtl",
      }}
    >
      <span style={{ color: colors.goldLight }}>أقل من 10 د.ت للقطعة</span>•
      <span>الخلاص عند الاستلام</span>
    </div>
  </AbsoluteFill>
);

// ---------- B · Young man, early thinning ----------
export const StaticEarly: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(170deg, ${colors.charcoalSoft} 0%, ${colors.charcoal} 75%)`,
      overflow: "hidden",
    }}
  >
    <TilePattern color={colors.bronze} opacity={0.08} />
    <Brand style={{ position: "absolute", top: 46, right: 60 }} size={36} />

    <AbsoluteFill
      style={{
        alignItems: "center",
        paddingTop: 120,
        direction: "rtl",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 118,
          lineHeight: 1.1,
          color: colors.white,
        }}
      >
        الشعر بدا يخفّ؟
      </div>
      <div
        style={{
          marginTop: 8,
          fontFamily: displayFont,
          fontSize: 70,
          lineHeight: 1.15,
          color: colors.bronze,
        }}
      >
        ما تستنّاش لين يفوت الفوت
      </div>
    </AbsoluteFill>

    <AbsoluteFill style={{ alignItems: "center", paddingTop: 400 }}>
      <div
        style={{
          position: "absolute",
          top: 430,
          width: 620,
          height: 620,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(200,150,62,0.35) 0%, rgba(200,150,62,0) 68%)`,
        }}
      />
      <PackGroup scale={1.0} />
    </AbsoluteFill>

    <div
      style={{
        position: "absolute",
        top: 940,
        right: 90,
        left: 90,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        direction: "rtl",
      }}
    >
      {[
        "روتين طبيعي في 3 خطوات",
        "ديرما رولر + زيت إكليل الجبل",
        "سدر بيو بمشط الجذور + فرشة تدليك",
      ].map((t) => (
        <div
          key={t}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 42,
            color: colors.white,
          }}
        >
          <Check color={colors.bronze} />
          {t}
        </div>
      ))}
    </div>

    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        bottom: 46,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        direction: "rtl",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{ fontFamily: displayFont, fontSize: 58, color: colors.white }}
        >
          {PACK_PIECES} قطع بـ
        </div>
        <PriceTag size={92} />
      </div>
      <Cta>ابدا توّا</Cta>
    </div>
  </AbsoluteFill>
);

// ---------- C · Natural-first ----------
const IngredientCard: React.FC<{
  readonly title: string;
  readonly line: string;
}> = ({ title, line }) => (
  <div
    style={{
      width: 440,
      background: colors.white,
      borderRadius: 26,
      padding: "18px 26px 22px",
      boxShadow: "0 14px 30px rgba(18,24,32,0.15)",
      borderTop: `8px solid ${NATURE}`,
      direction: "rtl",
    }}
  >
    <div
      style={{
        fontFamily: displayFont,
        fontSize: 56,
        lineHeight: 1.15,
        color: NATURE,
      }}
    >
      {title}
    </div>
    <div
      style={{
        fontFamily: bodyFont,
        fontWeight: 800,
        fontSize: 36,
        lineHeight: 1.3,
        color: colors.charcoal,
      }}
    >
      {line}
    </div>
  </div>
);

export const StaticNatural: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 38%, #FFFFFF 0%, #EEF2EA 50%, #D9E2D2 100%)`,
      overflow: "hidden",
    }}
  >
    <TilePattern color={NATURE} opacity={0.07} />

    <AbsoluteFill
      style={{ alignItems: "center", paddingTop: 60, direction: "rtl" }}
    >
      <Brand color={colors.bronzeDeep} size={34} />
      <div
        style={{
          marginTop: 10,
          fontFamily: displayFont,
          fontSize: 100,
          lineHeight: 1.1,
          color: colors.charcoal,
        }}
      >
        من الطبيعة لجذور شعرك
      </div>
      <div
        style={{
          marginTop: 6,
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 48,
          color: NATURE,
        }}
      >
        سدر بيو + زيت إكليل الجبل • بلا كيمياء
      </div>
    </AbsoluteFill>

    <AbsoluteFill
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
        gap: 70,
        paddingBottom: 1350 - 790,
      }}
    >
      <ProductImage product="rosemaryOil" height={440} />
      <ProductImage product="sidr" height={430} />
    </AbsoluteFill>

    {/* Price roundel */}
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 330,
        width: 210,
        height: 210,
        borderRadius: "50%",
        background: colors.charcoal,
        color: colors.white,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        rotate: "-8deg",
        boxShadow: "0 16px 34px rgba(0,0,0,0.3)",
        border: `5px solid ${colors.goldLight}`,
      }}
    >
      <div
        style={{
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 34,
          lineHeight: 1.1,
          direction: "rtl",
        }}
      >
        {PACK_PIECES} قطع
      </div>
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 70,
          lineHeight: 1.05,
          color: colors.goldLight,
          direction: "rtl",
        }}
      >
        {PRICES.pack} د.ت
      </div>
    </div>

    <AbsoluteFill
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 30,
        paddingTop: 820,
      }}
    >
      <IngredientCard title="زيت إكليل الجبل" line="يغذّي جذور الشعر" />
      <IngredientCard title="سدر بيو" line="يغسل و ينظّف بلطف" />
    </AbsoluteFill>

    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 1040,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
        direction: "rtl",
        fontFamily: bodyFont,
        fontWeight: 900,
        fontSize: 36,
        color: colors.charcoal,
        whiteSpace: "nowrap",
      }}
    >
      +
      {(
        [
          ["dermaRoller", 64],
          ["bottleBlack", 104],
          ["brushTerracotta", 78],
        ] as [ProductKey, number][]
      ).map(([p, h]) => (
        <ProductImage key={p} product={p} height={h} shadow={false} />
      ))}
      ديرما رولر • مشط الجذور • فرشة تدليك
    </div>

    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 140,
        background: NATURE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 34,
        direction: "rtl",
      }}
    >
      <div
        style={{ fontFamily: displayFont, fontSize: 60, color: colors.white }}
      >
        الباك الكامل بـ {PRICES.pack} د.ت
      </div>
      <Cta bg={colors.goldLight} fg={colors.charcoal} size={50}>
        اطلب توّا
      </Cta>
    </div>
  </AbsoluteFill>
);

// ---------- D · Gift (women buying for husband / father / brother) ----------
export const StaticGift: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(165deg, #2A1E14 0%, ${colors.charcoal} 70%)`,
      overflow: "hidden",
    }}
  >
    <TilePattern color={colors.bronze} opacity={0.08} />

    <AbsoluteFill
      style={{
        alignItems: "center",
        paddingTop: 70,
        direction: "rtl",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 112,
          lineHeight: 1.1,
          color: colors.white,
        }}
      >
        أحسن هدية لراجلك
      </div>
      <div
        style={{
          marginTop: 6,
          fontFamily: displayFont,
          fontSize: 64,
          color: colors.goldLight,
        }}
      >
        و إلا لبوك و خوك
      </div>
    </AbsoluteFill>

    {/* Gift box with ribbon behind the pack */}
    <div
      style={{
        position: "absolute",
        left: 170,
        top: 360,
        width: 740,
        height: 620,
        borderRadius: 34,
        background: `linear-gradient(160deg, ${colors.charcoalSoft} 0%, #1A222C 100%)`,
        border: `4px solid ${colors.bronze}`,
        overflow: "hidden",
        boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 340,
          top: 0,
          width: 60,
          height: "100%",
          background: colors.bronze,
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 0,
          width: "100%",
          height: 60,
          background: colors.bronze,
          opacity: 0.9,
        }}
      />
    </div>
    {/* Bow */}
    <svg
      width="240"
      height="130"
      viewBox="0 0 240 130"
      style={{ position: "absolute", left: 420, top: 282 }}
    >
      <path
        d="M120 70 C70 0 10 20 30 70 C45 105 95 90 120 70 Z"
        fill={colors.bronze}
        stroke={colors.bronzeDeep}
        strokeWidth="4"
      />
      <path
        d="M120 70 C170 0 230 20 210 70 C195 105 145 90 120 70 Z"
        fill={colors.bronze}
        stroke={colors.bronzeDeep}
        strokeWidth="4"
      />
      <path
        d="M110 75 L80 128 M130 75 L160 128"
        stroke={colors.bronze}
        strokeWidth="18"
        strokeLinecap="round"
      />
      <circle cx="120" cy="70" r="20" fill={colors.goldLight} />
    </svg>

    <AbsoluteFill style={{ alignItems: "center", paddingTop: 420 }}>
      <PackGroup scale={1.05} />
    </AbsoluteFill>

    <AbsoluteFill
      style={{ alignItems: "center", paddingTop: 1010, direction: "rtl" }}
    >
      <div
        style={{
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 46,
          color: colors.white,
        }}
      >
        باك عناية بالشعر للرجال • {PACK_PIECES} قطع
      </div>
      <div
        style={{
          marginTop: 26,
          display: "flex",
          alignItems: "center",
          gap: 30,
        }}
      >
        <PriceTag size={100} />
        <Cta size={60}>اطلبيه توّا</Cta>
      </div>
      <div
        style={{
          marginTop: 22,
          fontFamily: bodyFont,
          fontWeight: 800,
          fontSize: 36,
          color: colors.goldLight,
        }}
      >
        الخلاص عند الاستلام
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

// ---------- 9:16 Stories frame: the 4:5 ad scaled inside the safe zone ----------
export const StoryFrame: React.FC<{
  readonly ad: "deal" | "early" | "natural" | "gift";
}> = ({ ad }) => {
  const Ad = {
    deal: StaticDeal,
    early: StaticEarly,
    natural: StaticNatural,
    gift: StaticGift,
  }[ad];
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
          <Ad />
        </div>
      </div>
    </AbsoluteFill>
  );
};
