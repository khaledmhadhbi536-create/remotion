import { Composition, Folder, Still } from "remotion";
import {
  StaticDeal,
  StaticEarly,
  StaticGift,
  StaticNatural,
  StoryFrame,
} from "./statics/StaticAds";
import { HairPackAd, PACK_AD_FRAMES } from "./HairPackAd";
import { FEED_45_LAYOUT, HairPackReel, REEL_LAYOUT } from "./HairPackReel";
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
        defaultProps={REEL_LAYOUT}
      />
      <Composition
        id="HairPackFeed45"
        component={HairPackReel}
        durationInFrames={PACK_AD_FRAMES}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={FEED_45_LAYOUT}
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

      {/* Static ads — 4 avatars / angles, 4:5 feed + 9:16 stories */}
      <Folder name="StaticAds">
        <Still
          id="Static-A-Deal-4x5"
          component={StaticDeal}
          width={1080}
          height={1350}
        />
        <Still
          id="Static-B-Early-4x5"
          component={StaticEarly}
          width={1080}
          height={1350}
        />
        <Still
          id="Static-C-Natural-4x5"
          component={StaticNatural}
          width={1080}
          height={1350}
        />
        <Still
          id="Static-D-Gift-4x5"
          component={StaticGift}
          width={1080}
          height={1350}
        />
        <Still
          id="Static-A-Deal-9x16"
          component={StoryFrame}
          width={1080}
          height={1920}
          defaultProps={{ ad: "deal" as const }}
        />
        <Still
          id="Static-B-Early-9x16"
          component={StoryFrame}
          width={1080}
          height={1920}
          defaultProps={{ ad: "early" as const }}
        />
        <Still
          id="Static-C-Natural-9x16"
          component={StoryFrame}
          width={1080}
          height={1920}
          defaultProps={{ ad: "natural" as const }}
        />
        <Still
          id="Static-D-Gift-9x16"
          component={StoryFrame}
          width={1080}
          height={1920}
          defaultProps={{ ad: "gift" as const }}
        />
      </Folder>

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
