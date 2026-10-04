import React from "react";
import { AbsoluteFill } from "remotion";
import { LightRays, TilePattern } from "../components/Decor";
import { ProductCard } from "../components/NumberedProducts";
import { PACK_PIECES, PRICES, STORE_NAME, VALUE_TOTAL } from "../config";
import { bodyFont, brandFont, colors, displayFont } from "../theme";

// Four static ads (1080×1350, 4:5 feed) — one per avatar / angle. See ADS-STATIQUES.md.
// A · Deal hunter   B · Young man, early thinning   C · Natural-first   D · Gift (women buying for him)
// Shared layout: « عرض استثنائي! » stamp → angle headline → the 5 products as numbered cards → price + CTA.

const NATURE = "#3F7A3A";

// ---------- Shared building blocks ----------
const Stamp: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", paddingTop: 34 }}>
    <div
      style={{
        fontFamily: displayFont,
        fontSize: 88,
        lineHeight: 1,
        color: colors.white,
        background: colors.red,
        padding: "12px 50px 26px",
        borderRadius: 22,
        rotate: "-3deg",
        direction: "rtl",
        boxShadow: "0 16px 36px rgba(0,0,0,0.4)",
      }}
    >
      عرض استثنائي!
    </div>
  </AbsoluteFill>
);

const Headline: React.FC<{
  readonly title: string;
  readonly sub?: string;
  readonly color: string;
  readonly subColor: string;
}> = ({ title, sub, color, subColor }) => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      paddingTop: 168,
      direction: "rtl",
      textAlign: "center",
    }}
  >
    <div
      style={{ fontFamily: displayFont, fontSize: 78, lineHeight: 1.1, color }}
    >
      {title}
    </div>
    {sub ? (
      <div
        style={{
          marginTop: 2,
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 40,
          lineHeight: 1.3,
          color: subColor,
        }}
      >
        {sub}
      </div>
    ) : null}
  </AbsoluteFill>
);

// 3 + 2 grid, numbered right-to-left
const ProductGrid: React.FC<{
  readonly accent: string;
  readonly top?: number;
}> = ({ accent, top = 330 }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 0,
      right: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 26,
    }}
  >
    <div style={{ display: "flex", gap: 24, direction: "rtl" }}>
      {[0, 1, 2].map((i) => (
        <ProductCard key={i} index={i} accent={accent} />
      ))}
    </div>
    <div style={{ display: "flex", gap: 24, direction: "rtl" }}>
      {[3, 4].map((i) => (
        <ProductCard key={i} index={i} accent={accent} />
      ))}
    </div>
  </div>
);

const PriceTag: React.FC<{
  readonly size?: number;
  readonly style?: React.CSSProperties;
}> = ({ size = 110, style }) => (
  <div
    style={{
      fontFamily: displayFont,
      fontSize: size,
      lineHeight: 1,
      color: colors.charcoal,
      background: colors.goldLight,
      padding: `0 ${size * 0.25}px ${size * 0.16}px`,
      borderRadius: size * 0.18,
      boxShadow: "0 12px 0 #9C7020, 0 22px 40px rgba(0,0,0,0.4)",
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
}> = ({ children, color, size = 44 }) => (
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
        height: 6,
        borderRadius: 3,
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
}> = ({ children, bg = colors.bronze, fg = colors.white, size = 56 }) => (
  <div
    style={{
      fontFamily: displayFont,
      fontSize: size,
      color: fg,
      background: bg,
      padding: `4px ${size * 0.75}px ${size * 0.3}px`,
      borderRadius: 999,
      boxShadow: "0 10px 0 rgba(0,0,0,0.25), 0 18px 34px rgba(0,0,0,0.3)",
      direction: "rtl",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

// Bottom block: "5 قطع بـ [49 د.ت]" + crossed value + CTA
const OfferRow: React.FC<{
  readonly cta: string;
  readonly textColor: string;
  readonly strikeColor: string;
  readonly ctaBg?: string;
  readonly ctaFg?: string;
}> = ({ cta, textColor, strikeColor, ctaBg, ctaFg }) => (
  <div
    style={{
      position: "absolute",
      left: 50,
      right: 50,
      top: 1060,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      direction: "rtl",
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{ fontFamily: displayFont, fontSize: 60, color: textColor }}
        >
          {PACK_PIECES} قطع بـ
        </div>
        <PriceTag size={104} />
      </div>
      <Strike color={strikeColor}>بلاصة {VALUE_TOTAL} د.ت</Strike>
    </div>
    <Cta bg={ctaBg} fg={ctaFg}>
      {cta}
    </Cta>
  </div>
);

const Footer: React.FC<{
  readonly bg: string;
  readonly color: string;
  readonly children: React.ReactNode;
}> = ({ bg, color, children }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 76,
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 18,
      fontFamily: bodyFont,
      fontWeight: 900,
      fontSize: 34,
      color,
      direction: "rtl",
    }}
  >
    {children}
  </div>
);

const Brand: React.FC<{ readonly color: string }> = ({ color }) => (
  <div
    style={{
      fontFamily: brandFont,
      fontWeight: 900,
      fontSize: 30,
      letterSpacing: 5,
      color,
    }}
  >
    {STORE_NAME}
  </div>
);

// ---------- A · Deal hunter ----------
export const StaticDeal: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 45%, ${colors.bronze} 0%, ${colors.bronzeDeep} 50%, ${colors.charcoal} 100%)`,
      overflow: "hidden",
    }}
  >
    <TilePattern color="#ffffff" opacity={0.06} />
    <LightRays color="rgba(255,255,255,0.14)" style={{ top: "48%" }} />
    <Stamp />
    <Headline
      title="باك نموّ الشعر للرجال"
      sub="أقل من 10 د.ت للقطعة"
      color={colors.white}
      subColor={colors.goldLight}
    />
    <ProductGrid accent={colors.red} />
    <OfferRow
      cta="اطلب توّا"
      textColor={colors.white}
      strikeColor="rgba(255,255,255,0.85)"
    />
    <Footer bg={colors.charcoal} color={colors.white}>
      <Brand color={colors.goldLight} />•<span>الخلاص عند الاستلام</span>•
      <span>الكمية محدودة</span>
    </Footer>
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
    <Stamp />
    <Headline
      title="الشعر بدا يخفّ؟"
      sub="ما تستنّاش لين يفوت الفوت"
      color={colors.white}
      subColor={colors.bronze}
    />
    <ProductGrid accent={colors.bronze} />
    <OfferRow
      cta="ابدا توّا"
      textColor={colors.white}
      strikeColor="rgba(255,255,255,0.75)"
    />
    <Footer bg={colors.bronze} color={colors.charcoal}>
      <Brand color={colors.charcoal} />•<span>الخلاص عند الاستلام</span>
    </Footer>
  </AbsoluteFill>
);

// ---------- C · Natural-first ----------
export const StaticNatural: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 40%, #FFFFFF 0%, #EEF2EA 50%, #D2DDCA 100%)`,
      overflow: "hidden",
    }}
  >
    <TilePattern color={NATURE} opacity={0.08} />
    <Stamp />
    <Headline
      title="من الطبيعة لجذور شعرك"
      sub="سدر بيو + زيت إكليل الجبل • بلا كيمياء"
      color={colors.charcoal}
      subColor={NATURE}
    />
    <ProductGrid accent={NATURE} />
    <OfferRow
      cta="اطلب توّا"
      textColor={colors.charcoal}
      strikeColor={colors.charcoalSoft}
      ctaBg={NATURE}
    />
    <Footer bg={NATURE} color={colors.white}>
      <Brand color={colors.goldLight} />•<span>الخلاص عند الاستلام</span>
    </Footer>
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
    {/* Ribbon behind the grid */}
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 510,
        width: 60,
        background: colors.bronze,
        opacity: 0.55,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 655,
        height: 60,
        background: colors.bronze,
        opacity: 0.55,
      }}
    />
    <Stamp />
    <Headline
      title="أحسن هدية لراجلك"
      sub="و إلا لبوك و خوك"
      color={colors.white}
      subColor={colors.goldLight}
    />
    <ProductGrid accent={colors.bronze} />
    <OfferRow
      cta="اطلبيه توّا"
      textColor={colors.white}
      strikeColor="rgba(255,255,255,0.75)"
    />
    <Footer bg={colors.bronze} color={colors.charcoal}>
      <Brand color={colors.charcoal} />•<span>الخلاص عند الاستلام</span>
    </Footer>
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
