import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { TilePattern } from "../components/Decor";
import { ProductImage, type ProductKey } from "../components/ProductImage";
import { PHONE, PRICES, STORE_NAME, VALUE_TOTAL } from "../config";
import { bodyFont, brandFont, colors, displayFont } from "../theme";

// "Realistic" infographic static, modelled on the competitor format that works in Tunisia:
// light tiled background + grouped product packshot + benefit list with icons
// + "routine" bar + trust badges + price. Uses only the real product cut-outs.

const NAVY = "#0E2140";
const GOLD = "#B8862B";
const GOLD_LIGHT = "#E9C46A";
const GREEN = "#2F7D4A";

// ---------- Icons (simple line glyphs, navy disc) ----------
const iconPaths: Record<string, React.ReactNode> = {
  root: (
    <>
      <path d="M32 10v26" />
      <path d="M32 36c-6 4-10 10-10 18M32 36c6 4 10 10 10 18M32 36v18" />
      <path d="M20 20l6 4M44 20l-6 4" />
    </>
  ),
  roller: (
    <>
      <rect x="14" y="16" width="22" height="14" rx="5" />
      <path d="M18 23h14M36 23h4l8 22" />
      <circle cx="18" cy="23" r="1" />
      <circle cx="25" cy="23" r="1" />
      <circle cx="32" cy="23" r="1" />
    </>
  ),
  dense: (
    <>
      <path d="M16 52c0-14 2-28 6-38M26 52c0-14 1-28 3-38M36 52c0-14-1-28-3-38M46 52c0-14-2-28-6-38" />
      <path d="M12 52h40" />
    </>
  ),
  drop: (
    <>
      <path d="M32 10c8 12 14 20 14 28a14 14 0 0 1-28 0c0-8 6-16 14-28z" />
      <path d="M26 40a6 6 0 0 0 6 6" />
    </>
  ),
  leaf: (
    <>
      <path d="M14 50C14 26 30 14 52 14c0 22-12 36-36 36z" />
      <path d="M14 50L38 28" />
    </>
  ),
};

const Icon: React.FC<{ readonly name: string; readonly size: number }> = ({
  name,
  size,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: NAVY,
      border: `4px solid ${GOLD_LIGHT}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxShadow: "0 6px 14px rgba(14,33,64,0.25)",
    }}
  >
    <svg
      width={size * 0.62}
      height={size * 0.62}
      viewBox="0 0 64 64"
      fill="none"
      stroke={colors.white}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconPaths[name]}
    </svg>
  </div>
);

const BENEFITS: { icon: string; title: string; sub: string }[] = [
  { icon: "drop", title: "سرّ السدر البلدي", sub: "ينظّف الفروة و ينحّي القشرة" },
  { icon: "root", title: "يقلّل طيحان الشعر", sub: "يقوّي الجذور و البصيلات" },
  { icon: "roller", title: "يفيّق البصيلات", sub: "الديرما رولر يدخّل الزيت للجذور" },
  { icon: "dense", title: "يزيد في الكثافة", sub: "شعر أكثف و فيه حياة" },
  { icon: "leaf", title: "مكوّنات طبيعية", sub: "سدر بلدي + زيت إكليل الجبل" },
];

const BenefitList: React.FC = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 14,
      direction: "rtl",
    }}
  >
    {BENEFITS.map((b, i) => (
      <div key={b.icon}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Icon name={b.icon} size={78} />
          <div>
            <div
              style={{
                fontFamily: bodyFont,
                fontWeight: 900,
                fontSize: 34,
                lineHeight: 1.15,
                color: NAVY,
              }}
            >
              {b.title}
            </div>
            <div
              style={{
                fontFamily: bodyFont,
                fontWeight: 600,
                fontSize: 23,
                lineHeight: 1.25,
                color: "#4A5568",
              }}
            >
              {b.sub}
            </div>
          </div>
        </div>
        {i < BENEFITS.length - 1 ? (
          <div
            style={{
              marginTop: 12,
              marginRight: 94,
              borderTop: `2px dotted ${GOLD}`,
              opacity: 0.6,
            }}
          />
        ) : null}
      </div>
    ))}
  </div>
);

// ---------- Grouped packshot ----------
const Packshot: React.FC = () => (
  <div style={{ position: "relative", width: 500, height: 600 }}>
    {/* soft floor glow + shared shadow so the items sit on one surface */}
    <div
      style={{
        position: "absolute",
        left: -20,
        right: -20,
        bottom: 6,
        height: 110,
        borderRadius: "50%",
        background:
          "radial-gradient(closest-side, rgba(70,45,10,0.30), rgba(70,45,10,0))",
      }}
    />
    {/* supporting pieces behind / around (real photos) */}
    <ProductImage
      product="applicatorPhoto"
      height={340}
      style={{ position: "absolute", left: 22, top: 80 }}
    />
    <ProductImage
      product="leavesPhoto"
      height={110}
      shadow={false}
      style={{ position: "absolute", left: 60, top: 330, rotate: "-12deg" }}
    />
    {/* hero: sidr pouch, front and centre */}
    <ProductImage
      product="sidrPhoto"
      height={430}
      style={{ position: "absolute", left: 120, top: 20 }}
    />
    <ProductImage
      product="oilPhoto"
      height={250}
      style={{ position: "absolute", left: 75, top: 250 }}
    />
    <ProductImage
      product="spoonPhoto"
      height={78}
      style={{ position: "absolute", left: 335, top: 395 }}
    />
    <ProductImage
      product="dermaRoller"
      height={150}
      style={{
        position: "absolute",
        left: -6,
        top: 425,
        rotate: "-6deg",
      }}
    />
    <ProductImage
      product="brushPhoto"
      height={140}
      style={{ position: "absolute", left: 250, top: 455 }}
    />
  </div>
);

// ---------- Routine bar ----------
const ROUTINE: { product: ProductKey; label: string }[] = [
  { product: "sidrPhoto", label: "السدر البلدي ⭐" },
  { product: "dermaRoller", label: "ديرما رولر 540" },
  { product: "oilPhoto", label: "زيت إكليل الجبل" },
  { product: "applicatorPhoto", label: "مشط الجذور" },
  { product: "brushPhoto", label: "فرشة تدليك" },
];

const RoutineBar: React.FC = () => (
  <div
    style={{
      margin: "0 36px",
      background: NAVY,
      borderRadius: 28,
      border: `3px solid ${GOLD_LIGHT}`,
      padding: "10px 18px 12px",
      direction: "rtl",
      boxShadow: "0 12px 28px rgba(14,33,64,0.3)",
    }}
  >
    <div
      style={{
        textAlign: "center",
        fontFamily: displayFont,
        fontSize: 40,
        lineHeight: 1.1,
        color: GOLD_LIGHT,
      }}
    >
      5 قطع ... روتين كامل في الدار
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
      }}
    >
      {ROUTINE.map((r, i) => (
        <React.Fragment key={r.product}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 150,
            }}
          >
            <div
              style={{
                width: r.product === "sidrPhoto" ? 118 : 100,
                height: r.product === "sidrPhoto" ? 118 : 100,
                borderRadius: "50%",
                background: r.product === "sidrPhoto" ? "#FFF6D8" : colors.white,
                border: `${r.product === "sidrPhoto" ? 6 : 3}px solid ${GOLD_LIGHT}`,
                boxShadow:
                  r.product === "sidrPhoto" ? `0 0 22px ${GOLD_LIGHT}` : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <ProductImage
                product={r.product}
                height={
                  r.product === "dermaRoller"
                    ? 48
                    : r.product === "brushPhoto"
                      ? 66
                      : r.product === "sidrPhoto"
                        ? 96
                        : 84
                }
                shadow={false}
              />
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily: bodyFont,
                fontWeight: 800,
                fontSize: 22,
                color: colors.white,
                whiteSpace: "nowrap",
              }}
            >
              {r.label}
            </div>
          </div>
          {i < ROUTINE.length - 1 ? (
            <div
              style={{
                fontFamily: bodyFont,
                fontWeight: 900,
                fontSize: 40,
                color: GOLD_LIGHT,
                marginBottom: 30,
              }}
            >
              +
            </div>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  </div>
);

// ---------- Trust badges ----------
const BADGES = ["الخلاص عند الاستلام", "آمن للاستعمال اليومي", "مكوّنات طبيعية"];

const Badges: React.FC = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      gap: 14,
      direction: "rtl",
      margin: "0 36px",
    }}
  >
    {BADGES.map((b) => (
      <div
        key={b}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 18px",
          borderRadius: 40,
          border: `2px solid ${GOLD}`,
          background: "rgba(255,255,255,0.75)",
          fontFamily: bodyFont,
          fontWeight: 800,
          fontSize: 24,
          color: NAVY,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: GREEN, fontSize: 26 }}>✔</span>
        {b}
      </div>
    ))}
  </div>
);

// ---------- Price row ----------
const PriceRow: React.FC = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      margin: "0 36px",
      direction: "rtl",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div
        style={{
          background: colors.red,
          color: colors.white,
          fontFamily: displayFont,
          fontSize: 70,
          lineHeight: 1,
          padding: "8px 28px 18px",
          borderRadius: 22,
          boxShadow: "0 10px 22px rgba(230,57,70,0.35)",
        }}
      >
        {PRICES.pack} د.ت
      </div>
      <div
        style={{
          fontFamily: bodyFont,
          fontWeight: 800,
          fontSize: 34,
          color: "#7A8796",
          textDecoration: "line-through",
          textDecorationColor: colors.red,
          textDecorationThickness: 4,
        }}
      >
        {VALUE_TOTAL} د.ت
      </div>
    </div>
    <div
      style={{
        background: GREEN,
        color: colors.white,
        fontFamily: bodyFont,
        fontWeight: 900,
        fontSize: 46,
        lineHeight: 1,
        padding: "20px 44px 24px",
        borderRadius: 60,
        boxShadow: "0 10px 22px rgba(47,125,74,0.35)",
      }}
    >
      Commander
    </div>
  </div>
);

// ---------- Full 4:5 card (1080×1350) ----------
// ---------- Flat-lay variant: one big photo of the whole kit ----------
const KitPhoto: React.FC = () => (
  <div
    style={{
      position: "relative",
      margin: "0 40px",
      height: 450,
      borderRadius: 30,
      overflow: "hidden",
      border: `5px solid ${colors.white}`,
      boxShadow: "0 18px 40px rgba(14,33,64,0.28)",
    }}
  >
    <Img
      src={staticFile("products/photo/kit-flatlay.jpg")}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "50% 18%",
      }}
    />
    {KIT_ITEMS.map((k) => (
      <NumBadge key={k.n} n={k.n} x={k.x} y={k.y} size={56} />
    ))}
  </div>
);

// The 5 pieces: number, name, benefit, and where the number sits on the photo
const KIT_ITEMS = [
  {
    n: 1,
    name: "السدر البلدي",
    benefits: ["يوقف التساقط و يعزّز النمو", "ينظّف الفروة بعمق و يقضي على القشرة", "يعطي لمعان و حيوية", "يمنح كثافة و قوة من الجذور"],
    x: 500,
    y: 44,
  },
  {
    n: 2,
    name: "زيت إكليل الجبل",
    benefits: ["يحفّز نمو الشعر", "يكثّف الفراغات", "يقوّي البصيلات", "يمنع التساقط"],
    x: 298,
    y: 372,
  },
  {
    n: 3,
    name: "ديرما رولر 540",
    benefits: ["ينشّط الدورة الدموية", "يدخّل الزيت للجذور", "يفيّق البصيلات النايمة"],
    x: 678,
    y: 30,
  },
  {
    n: 4,
    name: "مشط الجذور",
    benefits: ["يوصّل الزيت و السدر للجذور مباشرة", "بلا تبذير و بلا وسخ"],
    x: 797,
    y: 92,
  },
  {
    n: 5,
    name: "فرشة التدليك",
    benefits: ["تدلّك الفروة", "تنشّط الدورة الدموية", "تنحّي القشرة"],
    x: 178,
    y: 34,
  },
];

const NumBadge: React.FC<{
  readonly n: number;
  readonly x?: number;
  readonly y?: number;
  readonly size: number;
}> = ({ n, x, y, size }) => (
  <div
    style={{
      ...(x !== undefined && y !== undefined
        ? { position: "absolute" as const, left: x - size / 2, top: y - size / 2 }
        : {}),
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: "50%",
      background: colors.red,
      border: `3px solid ${colors.white}`,
      color: colors.white,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: bodyFont,
      fontWeight: 900,
      fontSize: size * 0.55,
      lineHeight: 1,
      boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
    }}
  >
    {n}
  </div>
);

const KitList: React.FC = () => (
  <div
    style={{
      margin: "0 40px",
      display: "flex",
      flexDirection: "column",
      gap: 11,
      direction: "rtl",
    }}
  >
    {KIT_ITEMS.map((k) => (
      <div key={k.n} style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <NumBadge n={k.n} size={44} />
        <div
          style={{
            width: 220,
            flexShrink: 0,
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 29,
            lineHeight: 1.1,
            color: NAVY,
            whiteSpace: "nowrap",
          }}
        >
          {k.name}
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexWrap: "wrap",
            columnGap: 14,
            rowGap: 0,
            fontFamily: bodyFont,
            fontWeight: 700,
            fontSize: 22,
            lineHeight: 1.3,
            color: "#3D4A5C",
          }}
        >
          {k.benefits.map((b) => (
            <span key={b} style={{ whiteSpace: "nowrap" }}>
              <span style={{ color: GREEN, fontWeight: 900 }}>✓ </span>
              {b}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

type Variant = "packshot" | "flatlay";

const Card: React.FC<{ readonly variant: Variant }> = ({ variant }) => (
  <div style={{ position: "relative", width: 1080, height: 1350 }}>
    {/* Header */}
    <div
      style={{
        position: "absolute",
        top: 34,
        left: 0,
        right: 0,
        textAlign: "center",
        direction: "rtl",
      }}
    >
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 92,
          lineHeight: 1.05,
          color: NAVY,
        }}
      >
        شعرك يطيح و يفرغ؟
      </div>
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 76,
          lineHeight: 1.1,
          color: GOLD,
        }}
      >
        رجّعلو كثافتو من الدار
      </div>
      <div
        style={{
          display: "inline-block",
          marginTop: 10,
          background: NAVY,
          color: colors.white,
          fontFamily: bodyFont,
          fontWeight: 800,
          fontSize: 28,
          padding: "6px 30px 10px",
          borderRadius: 40,
          transform: "rotate(-1.5deg)",
        }}
      >
        باك نموّ الشعر للرجال · بالسدر البلدي
      </div>
    </div>

    {variant === "packshot" ? (
      <>
        {/* Benefits (right, read first) + packshot (left) */}
        <div style={{ position: "absolute", top: 300, right: 40, width: 520 }}>
          <BenefitList />
        </div>
        <div style={{ position: "absolute", top: 275, left: 10 }}>
          <Packshot />
        </div>
      </>
    ) : (
      <>
        <div style={{ position: "absolute", top: 305, left: 0, right: 0 }}>
          <KitPhoto />
        </div>
        <div style={{ position: "absolute", top: 772, left: 0, right: 0 }}>
          <KitList />
        </div>
      </>
    )}

    {/* Seal */}
    <div
      style={{
        position: "absolute",
        top: 120,
        left: 34,
        width: 150,
        height: 150,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%, ${GOLD_LIGHT}, ${GOLD})`,
        border: `5px solid ${NAVY}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        rotate: "-10deg",
        boxShadow: "0 10px 22px rgba(0,0,0,0.25)",
        direction: "rtl",
      }}
    >
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 60,
          lineHeight: 0.9,
          color: NAVY,
        }}
      >
        5 قطع
      </div>
      <div
        style={{
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 22,
          color: NAVY,
        }}
      >
        في باك واحد
      </div>
    </div>

    {variant === "packshot" ? (
      <div style={{ position: "absolute", top: 868, left: 0, right: 0 }}>
        <RoutineBar />
      </div>
    ) : null}
    <div style={{ position: "absolute", top: 1116, left: 0, right: 0 }}>
      <Badges />
    </div>
    <div style={{ position: "absolute", top: 1192, left: 0, right: 0 }}>
      <PriceRow />
    </div>
  </div>
);

const Footer: React.FC<{ readonly bottom: number }> = ({ bottom }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom,
      textAlign: "center",
      direction: "rtl",
      fontFamily: bodyFont,
      fontWeight: 800,
      fontSize: 26,
      color: NAVY,
    }}
  >
    <span style={{ fontFamily: brandFont, fontWeight: 800, color: GOLD }}>
      {STORE_NAME}
    </span>
    {"  ·  "}
    ☎ {PHONE}
  </div>
);

const Background: React.FC = () => (
  <>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #FFFDF8 0%, #F6EEDF 60%, #EADBC0 100%)",
      }}
    />
    <TilePattern color="#5B7FA8" opacity={0.12} tile={140} />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 45%, rgba(255,253,248,0.9) 0%, rgba(255,253,248,0) 65%)",
      }}
    />
  </>
);

export const RealPackAd: React.FC<{
  readonly format: "4x5" | "9x16";
  readonly variant?: Variant;
}> = ({ format, variant = "packshot" }) => {
  if (format === "4x5") {
    return (
      <AbsoluteFill>
        <Background />
        <Card variant={variant} />
        <Footer bottom={6} />
      </AbsoluteFill>
    );
  }
  // 9:16: same card, centred so the top and bottom story UI stay clear
  return (
    <AbsoluteFill>
      <Background />
      <div style={{ position: "absolute", top: 250, left: 0 }}>
        <Card variant={variant} />
      </div>
      <Footer bottom={300} />
    </AbsoluteFill>
  );
};
