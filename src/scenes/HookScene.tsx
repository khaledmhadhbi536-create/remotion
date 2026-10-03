import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {HairStrands} from '../components/HairStrands';
import {TilePattern} from '../components/Decor';
import {bodyFont, colors, displayFont} from '../theme';

// 0–4s · HOOK — call out the pain point in the first second (thumb-stopper)
const PainChip: React.FC<{readonly label: string; readonly at: number; readonly tilt: number}> = ({label, at, tilt}) => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				fontFamily: displayFont,
				fontSize: 76,
				lineHeight: 1,
				color: colors.white,
				background: colors.red,
				padding: '16px 30px 24px',
				borderRadius: 22,
				boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
				display: 'flex',
				alignItems: 'center',
				gap: 14,
				direction: 'rtl',
				scale: interpolate(frame, [at, at + 7], [2.2, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: Easing.bezier(0.2, 1.4, 0.4, 1),
					output: 'perceptual-scale',
				}),
				opacity: interpolate(frame, [at, at + 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
				rotate: `${tilt}deg`,
			}}
		>
			<svg width="44" height="44" viewBox="0 0 10 10">
				<path d="M2 2 L8 8 M8 2 L2 8" stroke={colors.white} strokeWidth="1.8" strokeLinecap="round" />
			</svg>
			{label}
		</div>
	);
};

export const HookScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Camera shake on each stamp
	const shake = [30, 45, 60].reduce(
		(acc, at) => acc + interpolate(frame, [at, at + 2, at + 8], [0, 14, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
		0,
	);

	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(circle at 50% 35%, #2A3346 0%, ${colors.navy} 70%)`,
				overflow: 'hidden',
			}}
		>
			<TilePattern color="#ffffff" opacity={0.05} drift={frame * 0.3} />
			<HairStrands
				frizz={1}
				color="#8C7A63"
				shine="#5D4E3C"
				top={640}
				spread={360}
				count={12}
				opacity={interpolate(frame, [0, 0.5 * fps], [0, 0.85], {extrapolateRight: 'clamp'})}
			/>
			<AbsoluteFill
				style={{
					alignItems: 'center',
					paddingTop: 120,
					translate: `${Math.sin(frame * 3.1) * shake}px ${Math.cos(frame * 2.7) * shake}px`,
				}}
			>
				<div
					style={{
						fontFamily: displayFont,
						fontSize: 150,
						lineHeight: 1.1,
						color: colors.white,
						direction: 'rtl',
						textShadow: '0 10px 30px rgba(0,0,0,0.5)',
						opacity: interpolate(frame, [4, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
						translate: interpolate(frame, [4, 16], ['0px 60px', '0px 0px'], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.bezier(0.16, 1, 0.3, 1),
						}),
					}}
				>
					شعرك تعبان؟
				</div>
				<div style={{display: 'flex', gap: 20, marginTop: 50, direction: 'rtl'}}>
					<PainChip label="ناشف" at={30} tilt={-4} />
					<PainChip label="مقصّف" at={45} tilt={3} />
					<PainChip label="يطيح" at={60} tilt={-2} />
				</div>
				<div
					style={{
						fontFamily: bodyFont,
						fontWeight: 800,
						fontSize: 54,
						color: colors.goldLight,
						direction: 'rtl',
						marginTop: 60,
						background: 'rgba(0,0,0,0.45)',
						padding: '10px 36px',
						borderRadius: 16,
						opacity: interpolate(frame, [78, 88], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
						translate: interpolate(frame, [78, 92], ['0px 30px', '0px 0px'], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.bezier(0.16, 1, 0.3, 1),
						}),
					}}
				>
					جرّبتي كل شي… و ما نفع شي؟
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
