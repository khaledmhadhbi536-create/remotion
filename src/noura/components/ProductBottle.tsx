import React from "react";
import { Img, staticFile } from "remotion";
import { ASSETS, COLORS, PRODUCT } from "../config";
import { FONTS } from "../theme";

// The hero product. If a real packshot is set in ASSETS.images.product it is used;
// otherwise a premium amber dropper bottle is drawn in SVG (with the brand label),
// so the ad is fully shippable before the photo shoot.
//
// `sweep` 0→1 moves a soft light reflection across the glass (product-reveal moment).
export const ProductBottle: React.FC<{
  readonly height: number;
  readonly sweep?: number;
  readonly style?: React.CSSProperties;
}> = ({ height, sweep = -1, style }) => {
  const width = height * 0.5;

  if (ASSETS.images.product) {
    return (
      <div style={{ position: "relative", height, width, ...style }}>
        <Img
          src={staticFile(ASSETS.images.product)}
          style={{ height: "100%", width: "100%", objectFit: "contain" }}
        />
      </div>
    );
  }

  const b = PRODUCT.bottle;
  const sweepX = -120 + sweep * 520;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 300 600"
      style={{ overflow: "visible", ...style }}
    >
      <defs>
        <linearGradient id="nb-glass" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={b.glass} />
          <stop offset="0.18" stopColor={b.glassLight} />
          <stop offset="0.5" stopColor={b.glass} />
          <stop offset="0.85" stopColor="#5E3013" />
          <stop offset="1" stopColor="#3D1E0B" />
        </linearGradient>
        <linearGradient id="nb-liquid" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={b.liquid} stopOpacity={0.55} />
          <stop offset="1" stopColor="#A8611F" stopOpacity={0.35} />
        </linearGradient>
        <linearGradient id="nb-cap" x1="0" x2="1">
          <stop offset="0" stopColor="#0E0B08" />
          <stop offset="0.3" stopColor="#4A3B30" />
          <stop offset="0.55" stopColor={b.cap} />
          <stop offset="1" stopColor="#050403" />
        </linearGradient>
        <linearGradient id="nb-gold" x1="0" x2="1">
          <stop offset="0" stopColor={COLORS.goldDeep} />
          <stop offset="0.35" stopColor={COLORS.goldLight} />
          <stop offset="0.6" stopColor={COLORS.gold} />
          <stop offset="1" stopColor={COLORS.goldDeep} />
        </linearGradient>
        <linearGradient id="nb-sweep" x1="0" x2="1" y1="0" y2="0.25">
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="0.5" stopColor="#fff" stopOpacity={0.55} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <clipPath id="nb-body">
          <path d="M112 196 L188 196 C188 222 262 228 262 270 L262 560 C262 580 248 592 228 592 L72 592 C52 592 38 580 38 560 L38 270 C38 228 112 222 112 196 Z" />
        </clipPath>
      </defs>

      {/* Contact shadow */}
      <ellipse cx="150" cy="596" rx="128" ry="14" fill="rgba(46,30,19,0.35)" />

      {/* Dropper bulb (ribbed rubber) */}
      <path
        d="M122 12 C122 0 178 0 178 12 L182 104 L118 104 Z"
        fill="url(#nb-cap)"
      />
      {[28, 44, 60, 76, 92].map((y) => (
        <line
          key={y}
          x1="121"
          x2="179"
          y1={y}
          y2={y}
          stroke="#000"
          strokeOpacity={0.35}
          strokeWidth={2}
        />
      ))}
      {/* Gold collar */}
      <rect
        x="106"
        y="102"
        width="88"
        height="62"
        rx="6"
        fill="url(#nb-gold)"
      />
      <rect x="106" y="112" width="88" height="3" fill="#fff" opacity={0.35} />
      <rect x="106" y="150" width="88" height="3" fill="#000" opacity={0.15} />
      {/* Neck */}
      <rect x="114" y="162" width="72" height="40" fill="url(#nb-glass)" />

      {/* Glass body */}
      <g clipPath="url(#nb-body)">
        <rect x="0" y="150" width="300" height="460" fill="url(#nb-glass)" />
        {/* Oil + pipette seen through the glass */}
        <rect x="0" y="252" width="300" height="360" fill="url(#nb-liquid)" />
        <rect
          x="143"
          y="170"
          width="14"
          height="380"
          rx="7"
          fill="#fff"
          opacity={0.12}
        />
        {/* Glass highlights */}
        <rect
          x="56"
          y="230"
          width="16"
          height="340"
          rx="8"
          fill="#fff"
          opacity={0.28}
        />
        <rect
          x="80"
          y="240"
          width="5"
          height="320"
          rx="2.5"
          fill="#fff"
          opacity={0.18}
        />
        <rect
          x="238"
          y="250"
          width="8"
          height="300"
          rx="4"
          fill="#fff"
          opacity={0.12}
        />
        {/* Light sweep */}
        <rect
          x={sweepX}
          y="120"
          width="120"
          height="520"
          fill="url(#nb-sweep)"
          transform="skewX(-14)"
        />
      </g>

      {/* Label */}
      <rect x="62" y="318" width="176" height="226" rx="10" fill={b.label} />
      <rect
        x="70"
        y="326"
        width="160"
        height="210"
        rx="6"
        fill="none"
        stroke={COLORS.gold}
        strokeWidth={1.6}
      />
      <text
        x="150"
        y="380"
        textAnchor="middle"
        fontFamily={FONTS.serif}
        fontWeight={600}
        fontSize={34}
        letterSpacing={6}
        fill={COLORS.brownDeep}
      >
        {PRODUCT.brand}
      </text>
      <line
        x1="112"
        x2="188"
        y1="396"
        y2="396"
        stroke={COLORS.gold}
        strokeWidth={1.5}
      />
      <text
        x="150"
        y="424"
        textAnchor="middle"
        fontFamily={FONTS.serif}
        fontStyle="italic"
        fontSize={22}
        fill={COLORS.brown}
      >
        {PRODUCT.name}
      </text>
      <text
        x="150"
        y="462"
        textAnchor="middle"
        fontFamily={FONTS.arabic}
        fontWeight={700}
        fontSize={22}
        fill={COLORS.brownSoft}
        direction="rtl"
      >
        {PRODUCT.nameAr}
      </text>
      <text
        x="150"
        y="494"
        textAnchor="middle"
        fontFamily={FONTS.arabic}
        fontWeight={600}
        fontSize={13}
        letterSpacing={2}
        fill={COLORS.goldDeep}
      >
        {PRODUCT.subtitle.toUpperCase()}
      </text>
      <text
        x="150"
        y="520"
        textAnchor="middle"
        fontFamily={FONTS.arabic}
        fontSize={12}
        fill={COLORS.brownSoft}
      >
        {PRODUCT.volume}
      </text>
    </svg>
  );
};
