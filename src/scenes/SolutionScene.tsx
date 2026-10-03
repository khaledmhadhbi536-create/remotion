import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Jasmine, PricklyPear, TilePattern} from '../components/Decor';
import {bodyFont, colors, displayFont} from '../theme';

// 4–8s · SOLUTION — the secret ingredients, rooted in Tunisian heritage
export const SolutionScene: React.FC = () => {
	const frame = useCurrentFrame();

	const pop = (at: number) => ({
		opacity: interpolate(frame, [at, at + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
		scale: interpolate(frame, [at, at + 10], [0.6, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.3, 1.6, 0.5, 1),
			output: 'perceptual-scale' as const,
		}),
	});

	return (
		<AbsoluteFill style={{background: colors.cream, overflow: 'hidden'}}>
			<TilePattern color={colors.blue} opacity={0.08} drift={-frame * 0.4} />

			{/* Sidi Bou Said blue arch */}
			<div
				style={{
					position: 'absolute',
					left: 140,
					right: 140,
					top: 70,
					bottom: -40,
					borderRadius: '400px 400px 0 0',
					background: `linear-gradient(180deg, ${colors.blue} 0%, ${colors.blueDeep} 100%)`,
					boxShadow: 'inset 0 0 0 18px rgba(255,255,255,0.9)',
					translate: interpolate(frame, [0, 14], ['0px 900px', '0px 0px'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.bezier(0.16, 1, 0.3, 1),
					}),
				}}
			/>

			<AbsoluteFill style={{alignItems: 'center', paddingTop: 250, direction: 'rtl'}}>
				<div style={{fontFamily: bodyFont, fontWeight: 800, fontSize: 52, color: colors.goldLight, ...pop(8)}}>
					ما تقلقيش… السرّ من تونس
				</div>
				<div
					style={{
						fontFamily: displayFont,
						fontSize: 124,
						lineHeight: 1.15,
						color: colors.white,
						marginTop: 26,
						textShadow: '0 8px 24px rgba(0,0,0,0.35)',
						...pop(36),
					}}
				>
					زيت حبّ الهندي
				</div>
				<div
					style={{
						fontFamily: displayFont,
						fontSize: 96,
						lineHeight: 1.15,
						color: colors.magentaLight,
						textShadow: '0 8px 24px rgba(0,0,0,0.35)',
						...pop(62),
					}}
				>
					+ الياسمين
				</div>
				<div
					style={{
						fontFamily: bodyFont,
						fontWeight: 600,
						fontSize: 34,
						color: 'rgba(255,255,255,0.85)',
						direction: 'ltr',
						marginTop: 14,
						opacity: interpolate(frame, [80, 92], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
					}}
				>
					Huile de figue de Barbarie & jasmin
				</div>
			</AbsoluteFill>

			{/* Ingredients sliding in */}
			<PricklyPear
				size={330}
				style={{
					position: 'absolute',
					left: -20,
					bottom: -30,
					rotate: `${Math.sin(frame / 20) * 4}deg`,
					translate: interpolate(frame, [32, 48], ['-420px 0px', '0px 0px'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.bezier(0.16, 1, 0.3, 1),
					}),
				}}
			/>
			{[
				{right: 40, bottom: 70, size: 190, at: 60},
				{right: 210, bottom: 10, size: 130, at: 66},
				{right: 30, bottom: 260, size: 110, at: 72},
			].map(({right, bottom, size, at}) => (
				<Jasmine
					key={at}
					size={size}
					style={{
						position: 'absolute',
						right,
						bottom,
						filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.3))',
						scale: interpolate(frame, [at, at + 12], [0, 1], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.bezier(0.3, 1.6, 0.5, 1),
							output: 'perceptual-scale',
						}),
						rotate: `${interpolate(frame, [at, at + 40], [-90, 0], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.bezier(0.16, 1, 0.3, 1),
						})}deg`,
					}}
				/>
			))}
		</AbsoluteFill>
	);
};
