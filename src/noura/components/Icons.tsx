import React from "react";
import { COLORS } from "../config";

// Vector icons instead of emoji: identical rendering on every machine and
// they follow the brand palette (gold, warm brown) rather than emoji colours.
type IconProps = {
  readonly size?: number;
  readonly color?: string;
  readonly style?: React.CSSProperties;
};

export const SparkleIcon: React.FC<IconProps> = ({
  size = 48,
  color = COLORS.gold,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={style}>
    <path
      d="M24 2 C26 16 32 22 46 24 C32 26 26 32 24 46 C22 32 16 26 2 24 C16 22 22 16 24 2Z"
      fill={color}
    />
    <path
      d="M39 4 C39.6 8.4 41.6 10.4 46 11 C41.6 11.6 39.6 13.6 39 18 C38.4 13.6 36.4 11.6 32 11 C36.4 10.4 38.4 8.4 39 4Z"
      fill={color}
      opacity={0.75}
    />
  </svg>
);

export const CrossIcon: React.FC<IconProps> = ({
  size = 44,
  color = COLORS.red,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 44 44" style={style}>
    <circle cx="22" cy="22" r="21" fill={color} />
    <path
      d="M14 14 L30 30 M30 14 L14 30"
      stroke="#fff"
      strokeWidth={4.5}
      strokeLinecap="round"
    />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({
  size = 44,
  color = COLORS.gold,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 44 44" style={style}>
    <circle cx="22" cy="22" r="21" fill={color} />
    <path
      d="M12.5 22.5 L19 29 L31.5 15.5"
      stroke="#fff"
      strokeWidth={4.5}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({
  size = 48,
  color = "#C8473F",
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={style}>
    <path
      d="M24 42 C10 32 3 24 3 15.5 C3 9.5 7.8 5 13.5 5 C17.8 5 21.6 7.4 24 11 C26.4 7.4 30.2 5 34.5 5 C40.2 5 45 9.5 45 15.5 C45 24 38 32 24 42Z"
      fill={color}
    />
    <ellipse
      cx="14"
      cy="14"
      rx="5"
      ry="3.2"
      fill="#fff"
      opacity={0.35}
      transform="rotate(-30 14 14)"
    />
  </svg>
);

export const LeafIcon: React.FC<IconProps> = ({
  size = 40,
  color = "#6E8B4E",
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={style}>
    <path d="M6 34 C6 16 18 6 36 4 C35 22 26 34 8 34 Z" fill={color} />
    <path
      d="M8 33 C16 24 22 18 30 10"
      stroke="#fff"
      strokeWidth={2}
      fill="none"
      opacity={0.6}
      strokeLinecap="round"
    />
  </svg>
);

export const DropIcon: React.FC<IconProps> = ({
  size = 40,
  color = COLORS.gold,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={style}>
    <defs>
      <linearGradient id="noura-drop-icon" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={COLORS.goldLight} />
        <stop offset="1" stopColor={color} />
      </linearGradient>
    </defs>
    <path
      d="M20 3 C26 13 32 19 32 26 C32 33 26.6 38 20 38 C13.4 38 8 33 8 26 C8 19 14 13 20 3Z"
      fill="url(#noura-drop-icon)"
    />
    <ellipse cx="15" cy="26" rx="2.6" ry="5" fill="#fff" opacity={0.55} />
  </svg>
);

export const StarIcon: React.FC<IconProps> = ({
  size = 40,
  color = COLORS.gold,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={style}>
    <path
      d="M20 2.5 L25.3 13.6 L37.5 15.1 L28.5 23.5 L30.9 35.6 L20 29.6 L9.1 35.6 L11.5 23.5 L2.5 15.1 L14.7 13.6 Z"
      fill={color}
    />
  </svg>
);

// Five-pointed star polygon (outer radius r, inner radius ri), pointing right like the flag's star
const star = (cx: number, cy: number, r: number, ri: number) =>
  new Array(10)
    .fill(0)
    .map((_, i) => {
      const a = (i * Math.PI) / 5;
      const rad = i % 2 === 0 ? r : ri;
      return `${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`;
    })
    .join(" ");

export const TunisiaFlag: React.FC<{ readonly size?: number }> = ({
  size = 40,
}) => (
  <svg
    width={size * 1.5}
    height={size}
    viewBox="0 0 60 40"
    style={{ borderRadius: 4, overflow: "hidden" }}
  >
    <rect width="60" height="40" fill="#E70013" />
    <circle cx="30" cy="20" r="10" fill="#fff" />
    <circle cx="31.5" cy="20" r="7.4" fill="#E70013" />
    <circle cx="33.4" cy="20" r="6" fill="#fff" />
    <polygon points={star(34.6, 20, 4.4, 1.8)} fill="#E70013" />
  </svg>
);

export const TapIcon: React.FC<IconProps> = ({ size = 90, style }) => (
  <svg width={size} height={size} viewBox="0 0 90 90" style={style}>
    <path
      d="M34 46 V18 a7 7 0 0 1 14 0 V40 l4 -1 a7 7 0 0 1 8 5 l1 2 a7 7 0 0 1 8 4 l1 2 a7 7 0 0 1 9 6 V66 C79 78 70 86 58 86 H50 C42 86 36 82 32 75 L20 56 a7 7 0 0 1 11 -9 Z"
      fill="#fff"
      stroke={COLORS.brownDeep}
      strokeWidth={4}
      strokeLinejoin="round"
    />
  </svg>
);
