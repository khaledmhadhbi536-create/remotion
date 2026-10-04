import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { Background } from "../components/Background";
import { Chip } from "../components/Chip";
import { HeartIcon, StarIcon, TunisiaFlag } from "../components/Icons";
import { ProductBottle } from "../components/ProductBottle";
import { ASSETS, COLORS, COPY } from "../config";
import { FONTS, SHADOW, SPRING } from "../theme";
import { BEATS } from "../timing";

// 21–26s · PROOF / TRUST.
// A customer review card (stars fill one by one), two short comment bubbles that
// suggest volume, then the local-pride trust signal: made in Tunisia.
// ⚠️ Replace the review texts in config.ts with REAL customer reviews before going live.
export const SocialProof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beats = BEATS.proof;
  const card = spring({
    frame: frame - beats.card,
    fps,
    config: SPRING.smooth,
  });

  return (
    <Background>
      {/* Soft, out-of-focus bottle behind: parallax depth */}
      <div
        style={{
          position: "absolute",
          right: 40,
          top: 120 - frame * 0.4,
          filter: "blur(6px)",
          opacity: 0.25,
          transform: "rotate(10deg)",
        }}
      >
        <ProductBottle height={560} />
      </div>

      {/* Review card */}
      <div
        style={{
          position: "absolute",
          left: 150,
          right: 150,
          top: 205,
          padding: "40px 48px 46px",
          borderRadius: 40,
          background: COLORS.white,
          boxShadow: SHADOW.card,
          direction: "rtl",
          opacity: card,
          transform: `translateY(${(1 - card) * 70}px) scale(${interpolate(card, [0, 1], [0.92, 1])})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Avatar />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                fontFamily: FONTS.arabic,
                fontWeight: 800,
                fontSize: 32,
                color: COLORS.brownDeep,
                direction: "ltr",
                textAlign: "right",
              }}
            >
              {COPY.proof.author}
            </div>
            <div style={{ display: "flex", gap: 6, direction: "ltr" }}>
              {new Array(5).fill(0).map((_, i) => {
                const s = spring({
                  frame: frame - beats.stars - i * 3,
                  fps,
                  config: SPRING.pop,
                });
                return (
                  <StarIcon
                    key={i}
                    size={36}
                    style={{ transform: `scale(${s})`, opacity: s }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div
          style={{ marginTop: 28, display: "flex", justifyContent: "center" }}
        >
          <AnimatedText
            text={COPY.proof.quote}
            delay={beats.stars + 4}
            size={68}
            weight={900}
            style={{ flexWrap: "nowrap" }}
          >
            <HeartIcon size={58} />
          </AnimatedText>
        </div>
      </div>

      {/* Comment bubbles */}
      <Bubble
        text={COPY.proof.bubbles[0]}
        delay={beats.bubbles[0]}
        style={{ right: 110, top: 128 }}
      />
      <Bubble
        text={COPY.proof.bubbles[1]}
        delay={beats.bubbles[1]}
        style={{ left: 110, top: 590 }}
        tail="right"
      />

      {/* Claim + made in Tunisia */}
      <AbsoluteFill
        style={{ top: 705, height: 300, alignItems: "center", gap: 6 }}
      >
        <AnimatedText
          text={COPY.proof.claim}
          delay={beats.claim}
          size={60}
          weight={900}
          color={COLORS.brown}
        />
        <AnimatedText
          text={COPY.proof.claimFr}
          delay={beats.claim + 6}
          mode="mask"
          size={26}
          weight={600}
          color={COLORS.brownSoft}
        />
        <div style={{ marginTop: 18 }}>
          <Chip
            label={COPY.proof.madeIn}
            icon={<TunisiaFlag size={30} />}
            delay={beats.claim + 12}
            size={34}
            from="below"
          />
        </div>
      </AbsoluteFill>
    </Background>
  );
};

const Avatar: React.FC = () => (
  <div
    style={{
      width: 84,
      height: 84,
      borderRadius: "50%",
      overflow: "hidden",
      background: `linear-gradient(135deg, ${COLORS.goldLight}, ${COLORS.gold})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONTS.serif,
      fontSize: 44,
      color: COLORS.white,
      border: `3px solid ${COLORS.cream}`,
      flexShrink: 0,
    }}
  >
    {ASSETS.images.customer ? (
      <Img
        src={staticFile(ASSETS.images.customer)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    ) : (
      COPY.proof.author.charAt(0)
    )}
  </div>
);

const Bubble: React.FC<{
  readonly text: string;
  readonly delay: number;
  readonly style: React.CSSProperties;
  readonly tail?: "left" | "right";
}> = ({ text, delay, style, tail = "left" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: SPRING.pop });
  const float = Math.sin((frame - delay) / 16) * 4;
  return (
    <div
      style={{
        position: "absolute",
        padding: "16px 28px",
        borderRadius: 30,
        [tail === "left"
          ? "borderBottomLeftRadius"
          : "borderBottomRightRadius"]: 6,
        background: COLORS.brown,
        color: COLORS.ivory,
        fontFamily: FONTS.arabic,
        fontWeight: 700,
        fontSize: 34,
        direction: "rtl",
        boxShadow: SHADOW.card,
        opacity: s,
        transform: `translateY(${float}px) scale(${interpolate(s, [0, 1], [0.5, 1])})`,
        ...style,
      }}
    >
      {text}
      <HeartIcon
        size={28}
        color={COLORS.goldLight}
        style={{ marginInlineStart: 10, verticalAlign: "middle" }}
      />
    </div>
  );
};
