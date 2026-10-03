import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {FallingJasmine, TilePattern} from '../components/Decor';
import {bodyFont, colors, displayFont} from '../theme';

// 20–24s · SOCIAL PROOF — numbers + a real-sounding customer voice
// NOTE: demo figures for a fictional brand — replace with real, verifiable reviews before running ads.
const Star: React.FC<{readonly fill: number}> = ({fill}) => (
	<svg width="92" height="92" viewBox="0 0 24 24">
		<defs>
			<linearGradient id={`star-${fill.toFixed(2)}`} x1="1" x2="0">
				<stop offset={fill} stopColor={colors.gold} />
				<stop offset={fill} stopColor="rgba(255,255,255,0.25)" />
			</linearGradient>
		</defs>
		<path
			d="M12 2 L14.9 8.6 L22 9.3 L16.6 14 L18.2 21 L12 17.3 L5.8 21 L7.4 14 L2 9.3 L9.1 8.6 Z"
			fill={`url(#star-${fill.toFixed(2)})`}
		/>
	</svg>
);

export const ProofScene: React.FC = () => {
	const frame = useCurrentFrame();
	const count = Math.round(
		interpolate(frame, [6, 50], [0, 10000], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.16, 1, 0.3, 1),
		}),
	);

	return (
		<AbsoluteFill style={{background: colors.navy, overflow: 'hidden'}}>
			<TilePattern color={colors.gold} opacity={0.08} drift={-frame * 0.5} />
			<FallingJasmine count={6} seed="proof" opacity={0.35} />

			<AbsoluteFill style={{alignItems: 'center', paddingTop: 110, direction: 'rtl'}}>
				<div style={{display: 'flex', alignItems: 'baseline', gap: 24}}>
					<div
						style={{
							fontFamily: bodyFont,
							fontWeight: 900,
							fontSize: 170,
							color: colors.goldLight,
							lineHeight: 1,
							direction: 'ltr',
						}}
					>
						+{String(count).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
					</div>
				</div>
				<div style={{fontFamily: displayFont, fontSize: 84, color: colors.white, marginTop: 6}}>
					تونسية جرّبوه و حبّوه
				</div>

				<div style={{display: 'flex', gap: 10, marginTop: 30, direction: 'ltr', alignItems: 'center'}}>
					{[0, 1, 2, 3, 4].map((i) => (
						<Star
							key={i}
							fill={interpolate(frame, [30 + i * 4, 36 + i * 4], [0, i === 4 ? 0.9 : 1], {
								extrapolateLeft: 'clamp',
								extrapolateRight: 'clamp',
							})}
						/>
					))}
					<div style={{fontFamily: bodyFont, fontWeight: 900, fontSize: 60, color: colors.white, marginLeft: 18}}>
						4.9/5
					</div>
				</div>

				{/* Review bubble */}
				<div
					style={{
						marginTop: 54,
						width: 860,
						background: colors.white,
						borderRadius: 32,
						padding: '30px 44px 34px',
						position: 'relative',
						boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
						opacity: interpolate(frame, [60, 68], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
						translate: interpolate(frame, [60, 74], ['0px 80px', '0px 0px'], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.bezier(0.2, 1.3, 0.4, 1),
						}),
					}}
				>
					<div style={{fontFamily: bodyFont, fontWeight: 900, fontSize: 52, color: colors.ink, lineHeight: 1.35}}>
						«شعري ولّى يلمع و ريحتو تهبل! ما عادش نبدّلو»
					</div>
					<div style={{fontFamily: bodyFont, fontWeight: 800, fontSize: 38, color: colors.magenta, marginTop: 12}}>
						— مريم، صفاقس
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
