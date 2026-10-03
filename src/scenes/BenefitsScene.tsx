import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Bottle} from '../components/Bottle';
import {Drop, Jasmine, TilePattern} from '../components/Decor';
import {HairStrands} from '../components/HairStrands';
import {bodyFont, colors, displayFont} from '../theme';

// 14–20s · BENEFITS — three concrete results, one per beat
const StrengthIcon: React.FC = () => (
	<svg width="62" height="62" viewBox="0 0 100 100">
		<path d="M50 6 L88 20 L88 50 Q88 80 50 96 Q12 80 12 50 L12 20 Z" fill={colors.white} />
		<path d="M32 52 L45 65 L70 36" stroke={colors.blue} strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const BenefitCard: React.FC<{
	readonly at: number;
	readonly icon: React.ReactNode;
	readonly iconBg: string;
	readonly children: React.ReactNode;
}> = ({at, icon, iconBg, children}) => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 28,
				direction: 'rtl',
				background: colors.white,
				borderRadius: 28,
				padding: '22px 30px',
				boxShadow: '0 18px 40px rgba(0,0,0,0.25)',
				opacity: interpolate(frame, [at, at + 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
				translate: interpolate(frame, [at, at + 12], ['220px 0px', '0px 0px'], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: Easing.bezier(0.2, 1.3, 0.4, 1),
				}),
			}}
		>
			<div
				style={{
					width: 96,
					height: 96,
					borderRadius: '50%',
					background: iconBg,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexShrink: 0,
				}}
			>
				{icon}
			</div>
			<div style={{fontFamily: bodyFont, fontWeight: 900, fontSize: 46, color: colors.ink, lineHeight: 1.25, whiteSpace: 'nowrap'}}>
				{children}
			</div>
		</div>
	);
};

export const BenefitsScene: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill
			style={{
				background: `linear-gradient(160deg, ${colors.blue} 0%, ${colors.blueDeep} 100%)`,
				overflow: 'hidden',
			}}
		>
			<TilePattern color="#ffffff" opacity={0.07} drift={frame * 0.4} />
			{/* Smooth, glossy hair — the "after" state */}
			<HairStrands frizz={0} color={colors.gold} shine={colors.goldLight} top={800} spread={260} count={14} opacity={0.75} />

			<AbsoluteFill style={{alignItems: 'center', paddingTop: 96}}>
				<div
					style={{
						fontFamily: displayFont,
						fontSize: 100,
						color: colors.white,
						direction: 'rtl',
						lineHeight: 1.1,
						opacity: interpolate(frame, [4, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
						translate: interpolate(frame, [4, 16], ['0px -40px', '0px 0px'], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.bezier(0.16, 1, 0.3, 1),
						}),
					}}
				>
					شنوّة يعمل لشعرك؟
				</div>
			</AbsoluteFill>

			<Bottle
				height={440}
				style={{
					position: 'absolute',
					left: 50,
					top: 300,
					filter: 'drop-shadow(0 30px 30px rgba(0,0,0,0.4))',
					rotate: `${-6 + Math.sin(frame / 18) * 2}deg`,
					translate: interpolate(frame, [0, 18], ['-360px 0px', '0px 0px'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.bezier(0.16, 1, 0.3, 1),
					}),
				}}
			/>

			<div
				style={{
					position: 'absolute',
					right: 60,
					top: 270,
					width: 720,
					display: 'flex',
					flexDirection: 'column',
					gap: 30,
				}}
			>
				<BenefitCard at={21} iconBg={colors.gold} icon={<Drop size={46} />}>
					يرطّب من أول استعمال
				</BenefitCard>
				<BenefitCard at={51} iconBg={colors.blue} icon={<StrengthIcon />}>
					يقوّي الشعر من الجذور
				</BenefitCard>
				<BenefitCard at={81} iconBg={colors.magenta} icon={<Jasmine size={80} />}>
					ريحة الياسمين تدوم
				</BenefitCard>
			</div>

			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 110}}>
				<div
					style={{
						fontFamily: displayFont,
						fontSize: 64,
						color: colors.blueDeep,
						background: colors.goldLight,
						padding: '6px 40px 14px',
						borderRadius: 20,
						direction: 'rtl',
						boxShadow: '0 14px 30px rgba(0,0,0,0.3)',
						opacity: interpolate(frame, [111, 117], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
						scale: interpolate(frame, [111, 123], [0.5, 1], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.bezier(0.3, 1.6, 0.5, 1),
							output: 'perceptual-scale',
						}),
					}}
				>
					3 قطرات في النهار و شعرك يلمع
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
