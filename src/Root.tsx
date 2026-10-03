import { Composition, Folder } from "remotion";
import { HairPackAd } from "./HairPackAd";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { PackIntroScene } from "./scenes/PackIntroScene";
import { StepScene } from "./scenes/StepScene";
import { ValueScene } from "./scenes/ValueScene";
import { colors } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main deliverable: 30s, 1080×1080 (1:1 feed format) */}
      <Composition
        id="HairPackAd"
        component={HairPackAd}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1080}
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
            accent: colors.rose,
            background: colors.blush,
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
