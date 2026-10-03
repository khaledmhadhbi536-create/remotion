import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';

// Flowing hair strands. `frizz` = 1 gives dry, broken, jittery strands;
// `frizz` = 0 gives smooth, glossy waves. Interpolate it to show the transformation.
export const HairStrands: React.FC<{
	readonly frizz: number;
	readonly color: string;
	readonly shine: string;
	readonly count?: number;
	readonly top: number;
	readonly spread: number;
	readonly opacity?: number;
}> = ({frizz, color, shine, count = 14, top, spread, opacity = 1}) => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();

	const strand = (i: number) => {
		const baseY = top + (i / (count - 1)) * spread;
		const phase = frame / 14 + i * 0.35;
		const points: string[] = [];
		for (let x = -40; x <= width + 40; x += 12) {
			const wave = Math.sin(x / 140 + phase) * 26 + Math.sin(x / 61 + phase * 0.7 + i) * 8;
			// High-frequency "frizz" that also jitters frame to frame
			const jitter =
				(Math.sin(x * 0.37 + i * 7.1 + frame * 1.9) + Math.sin(x * 0.91 + i * 3.3 - frame * 1.3)) * 9 * frizz;
			points.push(`${x},${(baseY + wave + jitter).toFixed(1)}`);
		}
		return `M${points.join(' L')}`;
	};

	return (
		<svg width={width} height={width} style={{position: 'absolute', inset: 0, opacity}}>
			{new Array(count).fill(true).map((_, i) => (
				<path
					key={i}
					d={strand(i)}
					fill="none"
					stroke={i % 3 === 1 ? shine : color}
					strokeWidth={5 - frizz * 2}
					strokeLinecap="round"
					strokeLinejoin="round"
					// Broken ends when frizzy
					strokeDasharray={frizz > 0.05 ? `${220 - frizz * 120} ${frizz * 40}` : undefined}
					opacity={0.55 + (i % 4) * 0.12}
				/>
			))}
		</svg>
	);
};
