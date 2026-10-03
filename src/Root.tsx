import {Composition, Folder} from 'remotion';
import {NawarAd} from './NawarAd';
import {BenefitsScene} from './scenes/BenefitsScene';
import {CtaScene} from './scenes/CtaScene';
import {HookScene} from './scenes/HookScene';
import {ProductScene} from './scenes/ProductScene';
import {ProofScene} from './scenes/ProofScene';
import {SolutionScene} from './scenes/SolutionScene';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			{/* Main deliverable: 30s, 1080×1080 (1:1 feed format) */}
			<Composition id="NawarAd" component={NawarAd} durationInFrames={900} fps={30} width={1080} height={1080} />

			<Folder name="Scenes">
				<Composition id="Hook" component={HookScene} durationInFrames={126} fps={30} width={1080} height={1080} />
				<Composition id="Solution" component={SolutionScene} durationInFrames={132} fps={30} width={1080} height={1080} />
				<Composition id="Product" component={ProductScene} durationInFrames={192} fps={30} width={1080} height={1080} />
				<Composition id="Benefits" component={BenefitsScene} durationInFrames={192} fps={30} width={1080} height={1080} />
				<Composition id="SocialProof" component={ProofScene} durationInFrames={132} fps={30} width={1080} height={1080} />
				<Composition id="OfferCta" component={CtaScene} durationInFrames={186} fps={30} width={1080} height={1080} />
			</Folder>
		</>
	);
};
