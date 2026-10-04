import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { Background } from "../components/Background";
import { CTAButton } from "../components/CTAButton";
import { SparkleIcon } from "../components/Icons";
import { Logo } from "../components/Logo";
import { ProductCard } from "../components/ProductCard";
import { COLORS, COPY, PRODUCT } from "../config";
import { FONTS, GRADIENTS, SPRING } from "../theme";
import { BEATS } from "../timing";

// 26–30s · CTA — end card.
// Same staging as the reveal (bottle on its pedestal) for brand memory, logo on top,
// the action in big letters, a pulsing button that gets "tapped", and the two
// friction removers that matter most in Tunisia: nationwide delivery + cash on delivery.
export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beats = BEATS.cta;
  const price = spring({
    frame: frame - beats.button + 6,
    fps,
    config: SPRING.pop,
  });
  const trust = spring({
    frame: frame - beats.trust,
    fps,
    config: SPRING.soft,
  });

  return (
    <Background glow={0.8}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <Logo delay={beats.logo} scale={0.85} />
        <div style={{ marginTop: 18 }}>
          <AnimatedText
            text={COPY.cta.headline}
            delay={beats.headline}
            size={96}
            weight={900}
            mode="pop"
          >
            <SparkleIcon size={72} />
          </AnimatedText>
        </div>
      </AbsoluteFill>

      {/* Product */}
      <AbsoluteFill style={{ alignItems: "center", top: 330 }}>
        <ProductCard height={330} delay={0} sweepAt={18} />
      </AbsoluteFill>

      {/* Price tag */}
      {PRODUCT.showPrice ? (
        <div
          style={{
            position: "absolute",
            left: 640,
            top: 400,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: GRADIENTS.gold,
            boxShadow: "0 16px 30px -10px rgba(156,116,56,0.7)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: COLORS.white,
            transform: `rotate(${interpolate(price, [0, 1], [-30, 8])}deg) scale(${price})`,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.arabic,
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: 1,
            }}
          >
            {PRODUCT.volume}
          </div>
          <div
            style={{
              fontFamily: FONTS.arabic,
              fontWeight: 900,
              fontSize: 42,
              lineHeight: 1,
            }}
          >
            {PRODUCT.price}
          </div>
        </div>
      ) : null}

      {/* Button */}
      <AbsoluteFill style={{ alignItems: "center", top: 735 }}>
        <CTAButton
          label={COPY.cta.button}
          delay={beats.button}
          tapAt={beats.tap}
        />
      </AbsoluteFill>

      {/* Trust line */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          top: 868,
          gap: 6,
          opacity: trust,
          transform: `translateY(${(1 - trust) * 20}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.arabic,
            fontWeight: 800,
            fontSize: 32,
            color: COLORS.brown,
            direction: "rtl",
          }}
        >
          {COPY.cta.trust}
        </div>
        <div
          style={{
            fontFamily: FONTS.arabic,
            fontWeight: 600,
            fontSize: 22,
            color: COLORS.brownSoft,
            letterSpacing: 1,
          }}
        >
          {COPY.cta.sub} · {PRODUCT.website}
        </div>
      </AbsoluteFill>
    </Background>
  );
};
