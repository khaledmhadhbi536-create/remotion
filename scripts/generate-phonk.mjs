// Energetic "drift phonk / trap" track for the Flamme Noble reels, synthesised from scratch
// (no samples, no licensing issues). 120 BPM so one beat = 15 frames at 30 fps, like the edit.
//
// Arrangement (2s bars), built to start on the hook — no intro:
//   bars 0-3  drop: 808 + kick + clap, 16th hats, cowbell riff
//   bar  4    break: filtered, half-time, a held hit (the "longer shot" moment)
//   bar  5    build: hat rolls + snare roll + riser
//   bars 6-7  climax: full beat, 32nd hat rolls, double cowbell
//   bars 8-9  final hit, half-time groove under the hero shot + offer
//
// Usage: node scripts/generate-phonk.mjs   → public/audio/phonk-20s.mp3 (needs ffmpeg)

import { writeFileSync, unlinkSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const SR = 44100;
const BPM = 120;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const SECONDS = 20;

let seed = 4242;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
const noise = () => rand() * 2 - 1;
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

const L = new Float32Array(SECONDS * SR);
const R = new Float32Array(SECONDS * SR);
const add = (t, s, gain = 1, pan = 0) => {
  const st = Math.floor(t * SR);
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < s.length; i++) {
    const k = st + i;
    if (k < 0 || k >= L.length) continue;
    L[k] += s[i] * gl;
    R[k] += s[i] * gr;
  }
};

// one-pole filters
const lp = (s, f) => {
  const a = 1 - Math.exp((-2 * Math.PI * f) / SR);
  let y = 0;
  return s.map((x) => (y += a * (x - y)));
};
const hp = (s, f) => {
  const low = lp(s, f);
  return s.map((x, i) => x - low[i]);
};

const kick = (v = 1) => {
  const n = Math.floor(0.35 * SR);
  const s = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const f = 45 + 160 * Math.exp(-t * 40);
    ph += (2 * Math.PI * f) / SR;
    s[i] = Math.tanh(2.2 * Math.sin(ph) * Math.exp(-t * 9)) * v;
    if (i < 200) s[i] += noise() * 0.5 * (1 - i / 200) * v;
  }
  return s;
};

// 808 with pitch glide from the previous note and soft saturation
const sub808 = (m, dur, from = m, v = 1) => {
  const n = Math.floor(dur * SR);
  const s = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const mm = from + (m - from) * Math.min(1, t / 0.07);
    ph += (2 * Math.PI * hz(mm)) / SR;
    const env =
      Math.min(1, t / 0.004) *
      Math.exp(-t * 1.1) *
      Math.min(1, (dur - t) / 0.03);
    s[i] = Math.tanh(1.8 * Math.sin(ph)) * env * v;
  }
  return s;
};

const clap = (v = 1) => {
  const n = Math.floor(0.25 * SR);
  const raw = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const bursts = [0, 0.008, 0.017].reduce(
      (a, o) => a + (t >= o ? Math.exp(-(t - o) * 90) : 0),
      0,
    );
    raw[i] = noise() * (bursts * 0.6 + Math.exp(-t * 14) * 0.5) * v;
  }
  return hp(lp(raw, 6000), 900);
};

const hat = (v = 1, open = false) => {
  const n = Math.floor((open ? 0.18 : 0.05) * SR);
  const raw = new Float32Array(n);
  for (let i = 0; i < n; i++)
    raw[i] = noise() * Math.exp(-(i / SR) * (open ? 18 : 70)) * v;
  return hp(raw, 7000);
};

// Phonk cowbell: two detuned square-ish tones through a band-ish filter
const cowbell = (m, v = 1) => {
  const n = Math.floor(0.3 * SR);
  const s = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const a = Math.sign(Math.sin(2 * Math.PI * hz(m) * t));
    const b = Math.sign(Math.sin(2 * Math.PI * hz(m) * 1.48 * t));
    s[i] = (a + b) * 0.5 * Math.exp(-t * 9) * v;
  }
  return hp(lp(s, 4200), 500);
};

const riser = (dur, v = 1) => {
  const n = Math.floor(dur * SR);
  const s = new Float32Array(n);
  for (let i = 0; i < n; i++) s[i] = noise() * (i / n) ** 2 * v;
  return hp(s, 1500);
};

const impact = (v = 1) => {
  const n = Math.floor(1.6 * SR);
  const s = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (35 + 80 * Math.exp(-t * 12))) / SR;
    s[i] =
      (Math.tanh(2 * Math.sin(ph)) * Math.exp(-t * 2.2) +
        noise() * Math.exp(-t * 18) * 0.5) *
      v;
  }
  return s;
};

// ---------- arrangement ----------
// F minor-ish phonk riff (cowbell), one per bar, 16th grid positions
const RIFF = [
  [0, 77],
  [3, 77],
  [6, 80],
  [8, 77],
  [10, 75],
  [12, 72],
  [14, 75],
];
const BASS = [
  [0, 41, 1.5],
  [6, 41, 0.5],
  [8, 44, 0.75],
  [11, 39, 0.75],
  [14, 36, 0.5],
];
const sx = BEAT / 4; // 16th

let lastBass = 41;
const bassBar = (t0, v = 1) => {
  for (const [p, m, d] of BASS) {
    add(t0 + p * sx, sub808(m, d * BEAT * 2, lastBass, 0.85 * v));
    lastBass = m;
  }
};
const drumsBar = (t0, { rolls = false, halfTime = false, v = 1 } = {}) => {
  const kicks = halfTime ? [0] : [0, 6, 10];
  for (const k of kicks) add(t0 + k * sx, kick(0.95 * v));
  const claps = halfTime ? [8] : [4, 12];
  for (const c of claps) add(t0 + c * sx, clap(0.7 * v), 1, 0.05);
  for (let h = 0; h < 16; h++) {
    const accent = h % 4 === 2 ? 0.5 : 0.28;
    add(t0 + h * sx, hat(accent * v), 1, 0.3);
    if (rolls && (h === 7 || h === 15)) {
      for (let r = 1; r < 4; r++)
        add(t0 + h * sx + (r * sx) / 4, hat(0.22 * v), 1, 0.3);
    }
  }
  add(t0 + 14 * sx, hat(0.25 * v, true), 1, -0.3);
};
const riffBar = (t0, { double = false, v = 1 } = {}) => {
  for (const [p, m] of RIFF) {
    add(t0 + p * sx, cowbell(m, 0.32 * v), 1, -0.2);
    if (double) add(t0 + p * sx, cowbell(m + 12, 0.14 * v), 1, 0.25);
  }
};

const bar = (i) => i * BAR;
add(0, impact(0.8)); // hits on frame 0 — the hook
for (let i = 0; i < 4; i++) {
  drumsBar(bar(i));
  bassBar(bar(i));
  riffBar(bar(i));
}
// break: half-time, cowbell filtered later by the low volume
drumsBar(bar(4), { halfTime: true, v: 0.8 });
add(bar(4), sub808(41, BAR, lastBass, 0.7));
riffBar(bar(4), { v: 0.45 });
// build
drumsBar(bar(5), { rolls: true, v: 0.9 });
bassBar(bar(5), 0.8);
for (let r = 0; r < 16; r++)
  add(bar(5) + BAR / 2 + (r * BAR) / 32, clap(0.15 + r * 0.03), 1, 0);
add(bar(5), riser(BAR, 0.5));
// climax
for (const i of [6, 7]) {
  add(bar(i), impact(i === 6 ? 0.7 : 0.4));
  drumsBar(bar(i), { rolls: true });
  bassBar(bar(i));
  riffBar(bar(i), { double: true });
}
// final hit + tail
add(bar(8), impact(0.9));
add(bar(8), sub808(41, 1.8, lastBass, 0.8));
add(bar(8), cowbell(77, 0.3));
drumsBar(bar(8), { halfTime: true, v: 0.55 });
drumsBar(bar(9), { halfTime: true, v: 0.5 });
add(bar(9), sub808(41, 1.6, 41, 0.6));
riffBar(bar(9), { v: 0.35 });

// master: gentle glue + limiter, fade the last 0.8s
let peak = 0;
for (let i = 0; i < L.length; i++) {
  L[i] = Math.tanh(L[i] * 0.9);
  R[i] = Math.tanh(R[i] * 0.9);
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const fadeFrom = (SECONDS - 0.8) * SR;
for (let i = 0; i < L.length; i++) {
  const g =
    (0.95 / peak) * (i > fadeFrom ? 1 - (i - fadeFrom) / (0.8 * SR) : 1);
  L[i] *= g;
  R[i] *= g;
}

const wav = Buffer.alloc(44 + L.length * 4);
wav.write("RIFF", 0);
wav.writeUInt32LE(36 + L.length * 4, 4);
wav.write("WAVEfmt ", 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(2, 22);
wav.writeUInt32LE(SR, 24);
wav.writeUInt32LE(SR * 4, 28);
wav.writeUInt16LE(4, 32);
wav.writeUInt16LE(16, 34);
wav.write("data", 36);
wav.writeUInt32LE(L.length * 4, 40);
for (let i = 0; i < L.length; i++) {
  wav.writeInt16LE(Math.round(L[i] * 32767), 44 + i * 4);
  wav.writeInt16LE(Math.round(R[i] * 32767), 46 + i * 4);
}
const out = path.join(process.cwd(), "public", "audio", "phonk-20s");
writeFileSync(`${out}.wav`, wav);
spawnSync("ffmpeg", [
  "-y",
  "-loglevel",
  "error",
  "-i",
  `${out}.wav`,
  "-b:a",
  "192k",
  `${out}.mp3`,
]);
unlinkSync(`${out}.wav`);
console.log("✓ public/audio/phonk-20s.mp3");
