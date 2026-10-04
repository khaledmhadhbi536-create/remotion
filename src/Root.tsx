import { Composition, Folder } from "remotion";
import { HairPackAd, PACK_AD_FRAMES } from "./HairPackAd";
import { HairPackReel } from "./HairPackReel";
import { TOTAL_FRAMES } from "./presentation/edit";
import { ProductPresentation } from "./presentation/ProductPresentation";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { PackIntroScene } from "./scenes/PackIntroScene";
import { StepScene } from "./scenes/StepScene";
import { ValueScene } from "./scenes/ValueScene";
import { colors } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 5-piece hair pack: 38s, 1080×1080 (1:1 feed) + 9:16 reel with captions */}
      <Composition
        id="HairPackAd"
        component={HairPackAd}
        durationInFrames={PACK_AD_FRAMES}
        fps={30}
        width={1080}
        height={1080}
      />

      <Composition
        id="HairPackReel"
        component={HairPackReel}
        durationInFrames={PACK_AD_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Seller's footage, re-edited: 9:16 with Arabic subtitles and sound design */}
      <Composition
        id="ProductPresentation"
        component={ProductPresentation}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />

      <Folder name="Scenes">
        <Composition
          id="Hook"
          component={HookScene}
          durationInFrames={126}
          fps={30}
          width={1080}
          height={1080}
        />
        <Composition
          id="PackIntro"
          component={PackIntroScene}
          durationInFrames={132}
          fps={30}
          width={1080}
          height={1080}
        />
        <Composition
          id="Step"
          component={StepScene}
          durationInFrames={132}
          fps={30}
          width={1080}
          height={1080}
          defaultProps={{
            step: 1,
            title: "ديرما رولر 540 إبرة",
            bullets: ["ينشّط بصيلات الشعر", "يخلّي الزيت يدخل للجذور"],
            howTo: "مرّة في الجمعة على فروة الراس",
            products: [{ product: "dermaRoller", height: 260 }],
            motion: "roll",
            accent: colors.bronze,
            background: colors.mist,
          }}
        />
        <Composition
          id="ValueStack"
          component={ValueScene}
          durationInFrames={132}
          fps={30}
          width={1080}
          height={1080}
        />
        <Composition
          id="OfferCta"
          component={CtaScene}
          durationInFrames={186}
          fps={30}
          width={1080}
          height={1080}
        />
      </Folder>
    </>
  );
};
