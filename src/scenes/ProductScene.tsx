import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Bottle} from '../components/Bottle';
import {FallingJasmine, LightRays, Sparkle} from '../components/Decor';
import {bodyFont, brandFont, colors, displayFont} from '../theme';

// 8–14s · PRODUCT REVEAL — hero shot of the bottle with the brand promise
export const ProductScene: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(circle at 50% 45%, #FFF6E3 0%, ${colors.sand} 45%, #E3C08C 100%)`,
				overflow: 'hidden',
			}}
		>
			<LightRays
				color="rgba(255,255,255,0.55)"
				style={{
					opacity: interpolate(frame, [6, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
				}}
			/>
			<FallingJasmine count={9} seed="reveal" opacity={0.9} />

			{/* Brand line */}
			<AbsoluteFill style={{alignItems: 'center', paddingTop: 96}}>
				<div
					style={{
						fontFamily: brandFont,
						fontWeight: 900,
						fontSize: 132,
						color: colors.blueDeep,
						lineHeight: 1,
						opacity: interpolate(frame, [30, 44], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
						letterSpacing: interpolate(frame, [30, 70], [40, 14], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.bezier(0.16, 1, 0.3, 1),
						}),
					}}
				>
					NAWAR
				</div>
				<div
					style={{
						fontFamily: bodyFont,
						fontWeight: 800,
						fontSize: 46,
						color: colors.magenta,
						direction: 'rtl',
						marginTop: 8,
						opacity: interpolate(frame, [44, 56], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
					}}
				>
					سيروم الشعر بزيت الهندي و الياسمين
				</div>
			</AbsoluteFill>

			{/* Hero bottle */}
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 150}}>
				<div
					style={{
						position: 'relative',
						translate: interpolate(frame, [4, 30], ['0px 700px', '0px 0px'], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.bezier(0.2, 1.25, 0.4, 1),
						}),
						rotate: `${interpolate(frame, [4, 30], [-14, 0], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.bezier(0.2, 1.25, 0.4, 1),
						}) + Math.sin(frame / 22) * 2}deg`,
					}}
				>
					<Bottle height={560} style={{filter: 'drop-shadow(0 30px 40px rgba(90,50,10,0.35))'}} />
					{[
						{left: -60, top: 90, size: 54, at: 34},
						{left: 250, top: 40, size: 40, at: 40},
						{left: 270, top: 300, size: 60, at: 46},
					].map(({left, top, size, at}) => (
						<Sparkle
							key={at}
							size={size}
							color={colors.white}
							style={{
								position: 'absolute',
								left,
								top,
								filter: 'drop-shadow(0 0 12px rgba(255,220,140,0.9))',
								scale: interpolate((frame - at) % 50, [0, 10, 24], [0, 1.15, 0], {
									extrapolateLeft: 'clamp',
									extrapolateRight: 'clamp',
								}),
								rotate: `${frame * 3}deg`,
							}}
						/>
					))}
				</div>
			</AbsoluteFill>

			{/* Trust badges */}
			<AbsoluteFill
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'flex-end',
					gap: 24,
					paddingBottom: 60,
					direction: 'rtl',
				}}
			>
				{[
					{label: '100% طبيعي', at: 66},
					{label: 'صنع في تونس', at: 76},
					{label: 'بلا سيليكون', at: 86},
				].map(({label, at}) => (
					<div
						key={label}
						style={{
							fontFamily: displayFont,
							fontSize: 46,
							color: colors.white,
							background: colors.blue,
							padding: '6px 30px 12px',
							borderRadius: 999,
							border: `3px solid ${colors.goldLight}`,
							boxShadow: '0 10px 24px rgba(6,43,87,0.3)',
							opacity: interpolate(frame, [at, at + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
							translate: interpolate(frame, [at, at + 10], ['0px 50px', '0px 0px'], {
								extrapolateLeft: 'clamp',
								extrapolateRight: 'clamp',
								easing: Easing.bezier(0.3, 1.5, 0.5, 1),
							}),
						}}
					>
						{label}
					</div>
				))}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
