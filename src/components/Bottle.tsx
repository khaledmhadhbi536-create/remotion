import React from 'react';
import {bodyFont, brandFont, colors} from '../theme';

// Amber dropper bottle drawn in SVG — the hero product of the ad
export const Bottle: React.FC<{
	readonly height: number;
	readonly style?: React.CSSProperties;
}> = ({height, style}) => {
	const width = (height * 200) / 460;
	return (
		<svg width={width} height={height} viewBox="0 0 200 460" style={{overflow: 'visible', ...style}}>
			<defs>
				<linearGradient id="glass" x1="0" x2="1" y1="0" y2="0">
					<stop offset="0" stopColor="#5A2606" />
					<stop offset="0.35" stopColor={colors.amber} />
					<stop offset="0.55" stopColor="#E08A33" />
					<stop offset="1" stopColor="#4A1E04" />
				</linearGradient>
				<linearGradient id="goldCap" x1="0" x2="1" y1="0" y2="0">
					<stop offset="0" stopColor="#8C6420" />
					<stop offset="0.4" stopColor={colors.goldLight} />
					<stop offset="0.6" stopColor={colors.gold} />
					<stop offset="1" stopColor="#7A5418" />
				</linearGradient>
				<linearGradient id="bulb" x1="0" x2="1" y1="0" y2="0">
					<stop offset="0" stopColor="#0E0E0E" />
					<stop offset="0.45" stopColor="#3A3A3A" />
					<stop offset="1" stopColor="#0A0A0A" />
				</linearGradient>
				<radialGradient id="shadow" cx="0.5" cy="0.5" r="0.5">
					<stop offset="0" stopColor="rgba(0,0,0,0.45)" />
					<stop offset="1" stopColor="rgba(0,0,0,0)" />
				</radialGradient>
			</defs>

			{/* Ground shadow */}
			<ellipse cx="100" cy="458" rx="100" ry="14" fill="url(#shadow)" />

			{/* Rubber bulb */}
			<path d="M62 78 L62 30 Q62 0 100 0 Q138 0 138 30 L138 78 Z" fill="url(#bulb)" />
			<rect x="74" y="8" width="8" height="60" rx="4" fill="rgba(255,255,255,0.18)" />

			{/* Gold collar with ridges */}
			<rect x="48" y="74" width="104" height="58" rx="8" fill="url(#goldCap)" />
			{[86, 98, 110, 122].map((y) => (
				<rect key={y} x="48" y={y} width="104" height="2" fill="rgba(90,60,10,0.35)" />
			))}

			{/* Neck */}
			<rect x="66" y="130" width="68" height="22" fill="url(#glass)" />

			{/* Body */}
			<rect x="14" y="146" width="172" height="304" rx="34" fill="url(#glass)" />
			<rect x="30" y="166" width="16" height="262" rx="8" fill="rgba(255,255,255,0.28)" />
			<rect x="158" y="176" width="6" height="230" rx="3" fill="rgba(255,255,255,0.12)" />

			{/* Label */}
			<rect x="26" y="222" width="148" height="182" rx="10" fill={colors.cream} />
			<rect x="26" y="222" width="148" height="34" rx="10" fill={colors.blue} />
			<rect x="26" y="246" width="148" height="10" fill={colors.blue} />
			<text
				x="100"
				y="245"
				textAnchor="middle"
				fill={colors.white}
				style={{fontFamily: bodyFont, fontWeight: 800, fontSize: 15}}
			>
				نوّار
			</text>
			<text
				x="100"
				y="296"
				textAnchor="middle"
				fill={colors.blueDeep}
				style={{fontFamily: brandFont, fontWeight: 900, fontSize: 31, letterSpacing: 2}}
			>
				NAWAR
			</text>
			<line x1="52" x2="148" y1="308" y2="308" stroke={colors.gold} strokeWidth="2" />
			<text
				x="100"
				y="330"
				textAnchor="middle"
				fill={colors.ink}
				style={{fontFamily: bodyFont, fontWeight: 800, fontSize: 11, letterSpacing: 1.5}}
			>
				HAIR SERUM
			</text>
			<text
				x="100"
				y="350"
				textAnchor="middle"
				fill={colors.magenta}
				style={{fontFamily: bodyFont, fontWeight: 800, fontSize: 13}}
			>
				زيت الهندي و الياسمين
			</text>
			{/* Tiny jasmine mark */}
			{[0, 72, 144, 216, 288].map((r) => (
				<ellipse key={r} cx="100" cy="378" rx="4" ry="9" fill={colors.gold} transform={`rotate(${r} 100 386)`} />
			))}
			<circle cx="100" cy="386" r="3" fill={colors.magenta} />
		</svg>
	);
};
