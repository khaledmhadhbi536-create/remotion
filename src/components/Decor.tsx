import React from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors} from '../theme';

// Five-petal jasmine flower ("fell"), Tunisia's national flower
export const Jasmine: React.FC<{readonly size: number; readonly style?: React.CSSProperties}> = ({size, style}) => (
	<svg width={size} height={size} viewBox="-50 -50 100 100" style={style}>
		{[0, 72, 144, 216, 288].map((r) => (
			<ellipse
				key={r}
				cx="0"
				cy="-22"
				rx="13"
				ry="24"
				fill={colors.white}
				stroke="rgba(200,180,150,0.6)"
				strokeWidth="1.5"
				transform={`rotate(${r})`}
			/>
		))}
		<circle cx="0" cy="0" r="8" fill={colors.goldLight} />
		<circle cx="0" cy="0" r="4" fill={colors.gold} />
	</svg>
);

// Prickly pear ("hindi") on its cactus pad
export const PricklyPear: React.FC<{readonly size: number; readonly style?: React.CSSProperties}> = ({size, style}) => (
	<svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible', ...style}}>
		<defs>
			<radialGradient id="pearSkin" cx="0.35" cy="0.3" r="0.8">
				<stop offset="0" stopColor={colors.magentaLight} />
				<stop offset="0.55" stopColor={colors.magenta} />
				<stop offset="1" stopColor="#7C0F35" />
			</radialGradient>
			<radialGradient id="pad" cx="0.4" cy="0.35" r="0.8">
				<stop offset="0" stopColor="#8BC46A" />
				<stop offset="1" stopColor={colors.green} />
			</radialGradient>
		</defs>
		<ellipse cx="80" cy="120" rx="62" ry="78" fill="url(#pad)" transform="rotate(-18 80 120)" />
		{[
			[60, 80],
			[95, 95],
			[70, 140],
			[105, 150],
			[50, 115],
		].map(([x, y]) => (
			<circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#D9E8B0" />
		))}
		<ellipse cx="130" cy="78" rx="44" ry="56" fill="url(#pearSkin)" transform="rotate(14 130 78)" />
		<path d="M118 26 Q130 14 144 24" stroke="#7C0F35" strokeWidth="6" fill="none" strokeLinecap="round" />
		{[
			[118, 60],
			[142, 70],
			[124, 98],
			[150, 102],
			[134, 124],
		].map(([x, y]) => (
			<circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" fill="#FFD3E0" />
		))}
	</svg>
);

// Golden oil droplet
export const Drop: React.FC<{readonly size: number; readonly style?: React.CSSProperties}> = ({size, style}) => (
	<svg width={size} height={size * 1.35} viewBox="0 0 100 135" style={style}>
		<defs>
			<linearGradient id="oil" x1="0" x2="1" y1="0" y2="1">
				<stop offset="0" stopColor={colors.goldLight} />
				<stop offset="1" stopColor={colors.amber} />
			</linearGradient>
		</defs>
		<path d="M50 0 C50 0 95 60 95 88 A45 45 0 0 1 5 88 C5 60 50 0 50 0 Z" fill="url(#oil)" />
		<ellipse cx="34" cy="86" rx="9" ry="16" fill="rgba(255,255,255,0.55)" />
	</svg>
);

// Repeating Tunisian 8-point-star tile pattern (zellige-style), drawn as an SVG pattern
export const TilePattern: React.FC<{
	readonly color: string;
	readonly opacity: number;
	readonly tile?: number;
	readonly drift?: number;
}> = ({color, opacity, tile = 120, drift = 0}) => {
	const id = `tile-${color.replace('#', '')}-${tile}`;
	return (
		<svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity}}>
			<defs>
				<pattern
					id={id}
					width={tile}
					height={tile}
					patternUnits="userSpaceOnUse"
					patternTransform={`translate(${drift} ${drift * 0.5})`}
				>
					<g fill="none" stroke={color} strokeWidth="2" transform={`translate(${tile / 2} ${tile / 2})`}>
						<rect x={-tile * 0.22} y={-tile * 0.22} width={tile * 0.44} height={tile * 0.44} />
						<rect
							x={-tile * 0.22}
							y={-tile * 0.22}
							width={tile * 0.44}
							height={tile * 0.44}
							transform="rotate(45)"
						/>
						<circle r={tile * 0.08} />
					</g>
					<g fill={color}>
						<circle cx="0" cy="0" r="3" />
						<circle cx={tile} cy="0" r="3" />
						<circle cx="0" cy={tile} r="3" />
						<circle cx={tile} cy={tile} r="3" />
					</g>
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill={`url(#${id})`} />
		</svg>
	);
};

// Rotating sun rays behind the hero product
export const LightRays: React.FC<{readonly color: string; readonly style?: React.CSSProperties}> = ({color, style}) => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				position: 'absolute',
				width: 1600,
				height: 1600,
				left: '50%',
				top: '50%',
				marginLeft: -800,
				marginTop: -800,
				borderRadius: '50%',
				background: `repeating-conic-gradient(from 0deg, ${color} 0deg 7deg, transparent 7deg 22deg)`,
				maskImage: 'radial-gradient(circle, black 0%, transparent 62%)',
				WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 62%)',
				rotate: `${frame * 0.4}deg`,
				...style,
			}}
		/>
	);
};

// Jasmine petals drifting down across the frame (deterministic per seed)
export const FallingJasmine: React.FC<{readonly count: number; readonly seed: string; readonly opacity?: number}> = ({
	count,
	seed,
	opacity = 1,
}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	return (
		<>
			{new Array(count).fill(true).map((_, i) => {
				const x = random(`${seed}-x-${i}`) * width;
				const speed = 1.6 + random(`${seed}-s-${i}`) * 2.2;
				const size = 34 + random(`${seed}-z-${i}`) * 40;
				const offset = random(`${seed}-o-${i}`) * (height + 200);
				const y = ((offset + frame * speed) % (height + 200)) - 100;
				return (
					<Jasmine
						key={i}
						size={size}
						style={{
							position: 'absolute',
							left: x + Math.sin((frame + i * 20) / 18) * 24,
							top: y,
							rotate: `${frame * (i % 2 ? 1.5 : -1.2) + i * 40}deg`,
							opacity,
							filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.18))',
						}}
					/>
				);
			})}
		</>
	);
};

// Sparkle star used for "shine" accents
export const Sparkle: React.FC<{readonly size: number; readonly color?: string; readonly style?: React.CSSProperties}> = ({
	size,
	color = colors.white,
	style,
}) => (
	<svg width={size} height={size} viewBox="-50 -50 100 100" style={style}>
		<path d="M0 -50 Q6 -6 50 0 Q6 6 0 50 Q-6 6 -50 0 Q-6 -6 0 -50 Z" fill={color} />
	</svg>
);
