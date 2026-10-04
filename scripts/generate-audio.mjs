// Generates the ad's soundtrack and sound effects from scratch (no samples, no licensing issues).
// Style: Tunisian "mezoued"-inspired groove — darbuka (maqsum rhythm), riq, handclaps,
// a plucked oud-like lead in D harmonic minor and an Andalusian cadence (Dm – C – Bb – A).
//
// Usage: node scripts/generate-audio.mjs   (needs ffmpeg on PATH to output mp3)

import {writeFileSync, mkdirSync, unlinkSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';

const SR = 44100;
const BPM = 120;
const BEAT = 60 / BPM; // 0.5s
const BAR = BEAT * 4; // 2s
const DURATION = 30;
const OUT_DIR = path.join(process.cwd(), 'public', 'audio');

// Deterministic randomness so the track is identical on every run
let seed = 1337;
const rand = () => {
	seed = (seed * 1664525 + 1013904223) % 4294967296;
	return seed / 4294967296;
};
const noise = () => rand() * 2 - 1;

const midiToHz = (m) => 440 * 2 ** ((m - 69) / 12);

const makeBuffer = (seconds) => ({
	L: new Float32Array(Math.ceil(seconds * SR)),
	R: new Float32Array(Math.ceil(seconds * SR)),
});

const add = (buf, startSec, samples, gain = 1, pan = 0) => {
	const start = Math.floor(startSec * SR);
	const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4);
	const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
	for (let i = 0; i < samples.length; i++) {
		const idx = start + i;
		if (idx < 0 || idx >= buf.L.length) continue;
		buf.L[idx] += samples[i] * gl;
		buf.R[idx] += samples[i] * gr;
	}
};

// ---------- Simple biquad (RBJ cookbook) ----------
const biquad = (type, freq, q) => {
	const w0 = (2 * Math.PI * freq) / SR;
	const alpha = Math.sin(w0) / (2 * q);
	const cos = Math.cos(w0);
	let b0, b1, b2;
	if (type === 'lp') {
		b0 = (1 - cos) / 2;
		b1 = 1 - cos;
		b2 = (1 - cos) / 2;
	} else if (type === 'hp') {
		b0 = (1 + cos) / 2;
		b1 = -(1 + cos);
		b2 = (1 + cos) / 2;
	} else {
		b0 = alpha;
		b1 = 0;
		b2 = -alpha;
	}
	const a0 = 1 + alpha;
	return {b0: b0 / a0, b1: b1 / a0, b2: b2 / a0, a1: (-2 * cos) / a0, a2: (1 - alpha) / a0};
};

const filterState = () => ({x1: 0, x2: 0, y1: 0, y2: 0});
const runFilter = (c, s, x) => {
	const y = c.b0 * x + c.b1 * s.x1 + c.b2 * s.x2 - c.a1 * s.y1 - c.a2 * s.y2;
	s.x2 = s.x1;
	s.x1 = x;
	s.y2 = s.y1;
	s.y1 = y;
	return y;
};

const filtered = (samples, type, freq, q = 0.707) => {
	const c = biquad(type, freq, q);
	const s = filterState();
	return samples.map((x) => runFilter(c, s, x));
};

// ---------- Instruments ----------
const dum = (vel = 1) => {
	const len = Math.floor(0.45 * SR);
	const out = new Float32Array(len);
	let phase = 0;
	for (let i = 0; i < len; i++) {
		const t = i / SR;
		const f = 62 + 95 * Math.exp(-t / 0.035);
		phase += (2 * Math.PI * f) / SR;
		const env = Math.exp(-t / 0.16);
		const click = Math.exp(-t / 0.004) * noise() * 0.25;
		out[i] = (Math.sin(phase) * env + click) * vel;
	}
	return out;
};

const tek = (vel = 1, bright = 1) => {
	const len = Math.floor(0.12 * SR);
	const raw = new Float32Array(len);
	for (let i = 0; i < len; i++) {
		const t = i / SR;
		raw[i] = noise() * Math.exp(-t / 0.018) + Math.sin(2 * Math.PI * 820 * t) * Math.exp(-t / 0.03) * 0.6;
	}
	return filtered(filtered(raw, 'hp', 900), 'bp', 2600 * bright, 1.2).map((x) => x * 2.4 * vel);
};

const riq = (vel = 1) => {
	const len = Math.floor(0.09 * SR);
	const raw = new Float32Array(len);
	for (let i = 0; i < len; i++) {
		const t = i / SR;
		raw[i] = noise() * Math.exp(-t / 0.035) * (1 + 0.5 * Math.sin(2 * Math.PI * 6800 * t));
	}
	return filtered(raw, 'hp', 6500).map((x) => x * vel);
};

const clap = (vel = 1) => {
	const len = Math.floor(0.25 * SR);
	const raw = new Float32Array(len);
	for (let i = 0; i < len; i++) {
		const t = i / SR;
		// Three quick bursts then a tail: the classic clap shape
		const burst =
			Math.exp(-t / 0.006) + Math.exp(-Math.max(0, t - 0.011) / 0.006) * (t > 0.011 ? 1 : 0) +
			Math.exp(-Math.max(0, t - 0.022) / 0.05) * (t > 0.022 ? 1 : 0);
		raw[i] = noise() * burst;
	}
	return filtered(raw, 'bp', 1400, 0.9).map((x) => x * 1.6 * vel);
};

// Karplus–Strong plucked string — reads like an oud
const oud = (midi, durSec, vel = 1) => {
	const freq = midiToHz(midi);
	const period = Math.round(SR / freq);
	const len = Math.floor((durSec + 0.6) * SR);
	const out = new Float32Array(len);
	const delay = new Float32Array(period);
	for (let i = 0; i < period; i++) delay[i] = noise();
	let idx = 0;
	let prev = 0;
	const releaseAt = Math.floor(durSec * SR);
	for (let i = 0; i < len; i++) {
		const cur = delay[idx];
		const damping = i > releaseAt ? 0.985 : 0.997;
		const next = damping * 0.5 * (cur + prev);
		prev = cur;
		delay[idx] = next;
		idx = (idx + 1) % period;
		out[i] = cur;
	}
	// Body resonance + tame highs
	return filtered(filtered(out, 'lp', 3200), 'bp', 300, 0.7).map((x, i) => (x * 0.6 + out[i] * 0.4) * vel);
};

const bass = (midi, durSec, vel = 1) => {
	const f = midiToHz(midi);
	const len = Math.floor((durSec + 0.1) * SR);
	const out = new Float32Array(len);
	for (let i = 0; i < len; i++) {
		const t = i / SR;
		const env = Math.min(1, t / 0.005) * Math.exp(-t / 0.5) * (t > durSec ? Math.exp(-(t - durSec) / 0.03) : 1);
		const s = Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(4 * Math.PI * f * t);
		out[i] = Math.tanh(s * 1.5) * env * vel;
	}
	return out;
};

const pad = (midis, durSec, vel = 1) => {
	const len = Math.floor(durSec * SR);
	const out = new Float32Array(len);
	for (let i = 0; i < len; i++) {
		const t = i / SR;
		const env = Math.min(1, t / 0.4) * Math.min(1, (durSec - t) / 0.4);
		let s = 0;
		for (const m of midis) {
			const f = midiToHz(m);
			for (const det of [-0.12, 0.12]) {
				const ff = f * 2 ** (det / 12);
				s += Math.sin(2 * Math.PI * ff * t) + 0.35 * Math.sin(4 * Math.PI * ff * t) + 0.15 * Math.sin(6 * Math.PI * ff * t);
			}
		}
		out[i] = (s / (midis.length * 2)) * env * vel;
	}
	return filtered(out, 'lp', 1800);
};

const riser = (durSec, vel = 1) => {
	const len = Math.floor(durSec * SR);
	const out = new Float32Array(len);
	const s = filterState();
	for (let i = 0; i < len; i++) {
		const p = i / len;
		const c = biquad('bp', 300 + 7000 * p * p, 2);
		out[i] = runFilter(c, s, noise()) * p * p * vel;
	}
	return out;
};

const impact = (vel = 1) => {
	const len = Math.floor(1.6 * SR);
	const out = new Float32Array(len);
	let phase = 0;
	for (let i = 0; i < len; i++) {
		const t = i / SR;
		const f = 45 + 120 * Math.exp(-t / 0.06);
		phase += (2 * Math.PI * f) / SR;
		out[i] = Math.sin(phase) * Math.exp(-t / 0.5) + noise() * Math.exp(-t / 0.25) * 0.35;
	}
	return filtered(out, 'lp', 5000).map((x) => x * vel);
};

const whoosh = () => {
	const dur = 0.7;
	const len = Math.floor(dur * SR);
	const out = new Float32Array(len);
	const s = filterState();
	for (let i = 0; i < len; i++) {
		const p = i / len;
		const env = Math.sin(Math.PI * Math.min(1, p * 1.25)) ** 2;
		const c = biquad('bp', 400 + 3800 * Math.sin(Math.PI * p), 1.4);
		out[i] = runFilter(c, s, noise()) * env * 1.2;
	}
	return out;
};

const shimmer = () => {
	const dur = 1.8;
	const out = new Float32Array(Math.floor(dur * SR));
	const notes = [86, 90, 93, 98, 93, 98, 102]; // D6 F#6 A6 D7 … bright bells
	notes.forEach((m, n) => {
		const f = midiToHz(m);
		const start = Math.floor(n * 0.07 * SR);
		for (let i = start; i < out.length; i++) {
			const t = (i - start) / SR;
			out[i] += (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 2.76 * t)) * Math.exp(-t / 0.45) * 0.18;
		}
	});
	return out;
};

const pop = () => {
	const len = Math.floor(0.15 * SR);
	const out = new Float32Array(len);
	let phase = 0;
	for (let i = 0; i < len; i++) {
		const t = i / SR;
		const f = 300 + 900 * Math.exp(-t / 0.02);
		phase += (2 * Math.PI * f) / SR;
		out[i] = Math.sin(phase) * Math.exp(-t / 0.04) * 0.8;
	}
	return out;
};

// Short UI tick for chips / checkmarks
const click = () => {
	const len = Math.floor(0.06 * SR);
	const out = new Float32Array(len);
	for (let i = 0; i < len; i++) {
		const t = i / SR;
		out[i] = (Math.sin(2 * Math.PI * 2200 * t) * 0.6 + noise() * 0.4) * Math.exp(-t / 0.008);
	}
	return out;
};

const cashBell = () => {
	const out = new Float32Array(Math.floor(1.2 * SR));
	[
		[0, 88],
		[0.09, 93],
	].forEach(([at, m]) => {
		const f = midiToHz(m);
		const start = Math.floor(at * SR);
		for (let i = start; i < out.length; i++) {
			const t = (i - start) / SR;
			out[i] +=
				(Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 2.4 * t) + 0.25 * Math.sin(2 * Math.PI * f * 3.9 * t)) *
				Math.exp(-t / 0.35) *
				0.35;
		}
	});
	return out;
};

// ---------- Arrangement ----------
// D harmonic minor: D4=62 E4=64 F4=65 G4=67 A4=69 Bb4=70 C5=72 C#5=73 D5=74 E5=76 F5=77
const CHORDS = {
	Dm: {root: 38, pad: [50, 53, 57]},
	C: {root: 36, pad: [48, 52, 55]},
	Bb: {root: 34, pad: [46, 50, 53]},
	A: {root: 33, pad: [49, 52, 57]},
};

// [beatOffsetInBar, durationBeats, midi]
const PHRASE_HOOK = [
	[[0, 1.5, 69], [1.5, 0.5, 70], [2, 2, 69]],
	[[0, 0.5, 67], [0.5, 0.5, 65], [1, 0.5, 64], [1.5, 0.5, 65], [2, 2, 64]],
];
const seq = (notes) => {
	let b = 0;
	return notes.map(([d, m]) => {
		const n = [b, d, m];
		b += d;
		return n;
	});
};
const PHRASE_A = [
	seq([[0.5, 69], [0.25, 70], [0.25, 69], [0.5, 67], [0.5, 65], [0.5, 64], [0.5, 65], [1, 62]]),
	seq([[0.5, 64], [0.5, 65], [0.5, 67], [0.5, 69], [0.25, 67], [0.25, 65], [0.5, 64], [1, 60]]),
	seq([[0.5, 62], [0.5, 65], [0.5, 70], [0.5, 69], [0.5, 67], [0.25, 65], [0.25, 67], [1, 65]]),
	seq([[0.5, 64], [0.25, 65], [0.25, 64], [0.5, 61], [0.5, 64], [2, 69]]),
];
const PHRASE_B = [
	seq([[0.5, 74], [0.25, 73], [0.25, 74], [0.5, 76], [0.5, 77], [0.5, 76], [0.5, 74], [1, 69]]),
	seq([[0.5, 72], [0.5, 74], [0.5, 76], [0.5, 72], [0.5, 70], [0.5, 69], [1, 67]]),
	seq([[0.5, 65], [0.5, 67], [0.5, 69], [0.5, 70], [0.25, 69], [0.25, 67], [0.5, 65], [1, 62]]),
	seq([[0.5, 64], [0.5, 65], [0.5, 67], [0.5, 69], [0.25, 70], [0.25, 69], [0.25, 67], [0.25, 65], [0.5, 64], [0.5, 61]]),
];

// Arrangement for any length (in 2s bars): 2 hook bars, groove, a lighter "break"
// 4 bars before the end, handclaps from there, a riser into the final hit on the last bar.
const buildMusic = (bars) => {
	const final = bars - 1;
	const breakBars = [final - 4, final - 3];
	const progression = ['Dm', 'A'];
	for (let b = 2; b < final; b++) progression.push(['Dm', 'C', 'Bb', 'A'][(b - 2) % 4]);
	progression.push('Dm');

	const melodyForBar = (bar) => {
		if (bar <= 1) return PHRASE_HOOK[bar];
		if (bar >= final) return [[0, 3, 62]];
		const pos = (bar - 2) % 8;
		return pos >= 4 ? PHRASE_B[pos - 4] : PHRASE_A[pos];
	};
	const isB = (bar) => bar > 1 && bar < final && (bar - 2) % 8 >= 4;

	const music = makeBuffer(bars * BAR + 1);
	for (let bar = 0; bar < progression.length; bar++) {
		const t0 = bar * BAR;
		const chord = CHORDS[progression[bar]];
		const isHook = bar <= 1;
		const isBreak = breakBars.includes(bar);
		const isFinal = bar >= final;

		// Pad
		add(music, t0, pad(chord.pad, isFinal ? 2 : BAR + 0.05, isHook ? 0.22 : 0.14), 1, 0);

		// Melody (oud), slightly panned left, octave double on the B phrase
		for (const [b, d, m] of melodyForBar(bar)) {
			add(music, t0 + b * BEAT, oud(m, d * BEAT, isHook ? 0.75 : 0.6), 1, -0.25);
			if (isB(bar)) add(music, t0 + b * BEAT + 0.012, oud(m - 12, d * BEAT, 0.3), 1, 0.3);
		}

		if (isFinal) {
			add(music, t0, impact(0.9));
			add(music, t0, bass(chord.root, 1.5, 0.7));
			continue;
		}

		if (isHook) {
			// Sparse, tense intro
			add(music, t0, dum(0.8));
			add(music, t0 + 3.5 * BEAT, tek(0.45), 1, 0.2);
			if (bar === 1) add(music, t0, riser(BAR, 0.35));
			continue;
		}

		// Bass: root – root – fifth – octave
		add(music, t0, bass(chord.root, 0.7, 0.55));
		add(music, t0 + 1.5 * BEAT, bass(chord.root, 0.25, 0.45));
		add(music, t0 + 2 * BEAT, bass(chord.root + 7, 0.45, 0.45));
		add(music, t0 + 3 * BEAT, bass(chord.root + 12, 0.45, 0.4));

		// Darbuka maqsum
		for (const [b, h] of MAQSUM) {
			if (h === 'D') add(music, t0 + b * BEAT, dum(isBreak ? 0.6 : 0.95));
			else add(music, t0 + b * BEAT, tek(isBreak ? 0.35 : 0.55), 1, 0.15);
		}
		// "ka" fills on sixteenths (lighter), denser from bar 4
		if (bar >= 4 && !isBreak) {
			for (const b of [1, 1.25, 2.75, 3.5, 3.75]) add(music, t0 + b * BEAT, tek(0.22, 1.3), 1, -0.2);
		}
		// Riq shimmer on offbeats from the product reveal
		if (bar >= 4) {
			for (let s = 0; s < 8; s++) add(music, t0 + (s * 0.5 + 0.25) * BEAT, riq(isBreak ? 0.12 : 0.18), 1, 0.45);
		}
		// Handclaps ("tasfiq") on 2 & 4 in the last section
		if (bar >= breakBars[0]) {
			add(music, t0 + 1 * BEAT, clap(0.5), 1, -0.1);
			add(music, t0 + 3 * BEAT, clap(0.5), 1, 0.1);
		}
		// Drop hits
		if (bar === 2 || bar === 4) add(music, t0, impact(0.55));
		// Build into the final hit
		if (bar === final - 1) add(music, t0, riser(BAR, 0.3));
	}
	return music;
};

// Maqsum in eighths: D T . T D . T .
const MAQSUM = [
	[0, 'D'],
	[0.5, 'T'],
	[1.5, 'T'],
	[2, 'D'],
	[3, 'T'],
];

const music = buildMusic(15);

// ---------- Master: soft-clip, normalize, fade ----------
const master = (buf, seconds) => {
	const len = Math.floor(seconds * SR);
	let peak = 0;
	for (let i = 0; i < len; i++) {
		buf.L[i] = Math.tanh(buf.L[i] * 0.9);
		buf.R[i] = Math.tanh(buf.R[i] * 0.9);
		peak = Math.max(peak, Math.abs(buf.L[i]), Math.abs(buf.R[i]));
	}
	const g = 0.89 / (peak || 1);
	for (let i = 0; i < len; i++) {
		const fade = Math.min(1, (len - i) / (0.6 * SR));
		buf.L[i] *= g * fade;
		buf.R[i] *= g * fade;
	}
	return {L: buf.L.subarray(0, len), R: buf.R.subarray(0, len)};
};

const writeWav = (file, {L, R}) => {
	const n = L.length;
	const data = Buffer.alloc(44 + n * 4);
	data.write('RIFF', 0);
	data.writeUInt32LE(36 + n * 4, 4);
	data.write('WAVE', 8);
	data.write('fmt ', 12);
	data.writeUInt32LE(16, 16);
	data.writeUInt16LE(1, 20);
	data.writeUInt16LE(2, 22);
	data.writeUInt32LE(SR, 24);
	data.writeUInt32LE(SR * 4, 28);
	data.writeUInt16LE(4, 32);
	data.writeUInt16LE(16, 34);
	data.write('data', 36);
	data.writeUInt32LE(n * 4, 40);
	for (let i = 0; i < n; i++) {
		data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), 44 + i * 4);
		data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), 46 + i * 4);
	}
	writeFileSync(file, data);
};

const mono = (samples) => {
	const b = makeBuffer(samples.length / SR);
	add(b, 0, samples);
	return b;
};

mkdirSync(OUT_DIR, {recursive: true});
const outputs = {
	music: master(music, DURATION),
	whoosh: master(mono(whoosh()), 0.7),
	shimmer: master(mono(shimmer()), 1.8),
	pop: master(mono(pop()), 0.15),
	'cash-bell': master(mono(cashBell()), 1.2),
	impact: master(mono(impact(1)), 1.6),
	riser: master(mono(riser(1.5, 1)), 1.5),
	click: master(mono(click()), 0.06),
};
// 38s version (19 bars) for the 5-piece pack ad — generated last so the files above stay identical
outputs['music-38s'] = master(buildMusic(19), 38);

const hasFfmpeg = spawnSync('ffmpeg', ['-version']).status === 0;
for (const [name, buf] of Object.entries(outputs)) {
	const wav = path.join(OUT_DIR, `${name}.wav`);
	writeWav(wav, buf);
	if (hasFfmpeg) {
		const mp3 = path.join(OUT_DIR, `${name}.mp3`);
		spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '192k', mp3]);
		unlinkSync(wav);
		console.log('✓', path.relative(process.cwd(), mp3));
	} else {
		console.log('✓', path.relative(process.cwd(), wav), '(install ffmpeg to get mp3)');
	}
}
