// NOURA — Huile Éclat · soundtrack + sound effects, synthesised from scratch
// (no samples → no copyright claims on Meta).
//
// Style: premium lifestyle / beauty — warm electric piano, soft sub bass, light
// four-on-the-floor, finger snaps, shaker, glassy bell pluck. 120 BPM, F major.
// Every scene cut of the ad lands on a beat: 3s, 8s, 14s, 21s, 26s.
//
//   0–3s   Hook      : filtered piano + pad, a "stop" accent on frame 0
//   3–8s   Problem   : minor colour (Dm7 – Bbmaj7), snaps + shaker, riser into 8s
//   8–14s  Reveal    : sparkle hit, full groove opens (lift), bright major chords
//   14–21s Benefits  : full groove + bell melody
//   21–26s Proof     : groove, melody variation
//   26–30s CTA       : impact, last bar, final chord rings out
//
// Usage: npm run noura:audio   (needs ffmpeg on PATH)

import { mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const SR = 44100;
const BPM = 120;
const BEAT = 60 / BPM; // 0.5 s
const BAR = BEAT * 4; // 2 s
const DURATION = 30;
const OUT_DIR = path.join(process.cwd(), "public", "noura", "audio");

let seed = 2024;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
const noise = () => rand() * 2 - 1;
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

const buffer = (sec) => ({
  L: new Float32Array(Math.ceil(sec * SR)),
  R: new Float32Array(Math.ceil(sec * SR)),
});

const add = (buf, at, samples, gain = 1, pan = 0) => {
  const start = Math.floor(at * SR);
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < samples.length; i++) {
    const idx = start + i;
    if (idx < 0 || idx >= buf.L.length) continue;
    buf.L[idx] += samples[i] * gl;
    buf.R[idx] += samples[i] * gr;
  }
};

// ---------- filters ----------
const biquad = (type, freq, q = 0.707) => {
  const w0 = (2 * Math.PI * Math.min(freq, SR * 0.45)) / SR;
  const alpha = Math.sin(w0) / (2 * q);
  const cos = Math.cos(w0);
  let b0, b1, b2;
  if (type === "lp") [b0, b1, b2] = [(1 - cos) / 2, 1 - cos, (1 - cos) / 2];
  else if (type === "hp") [b0, b1, b2] = [(1 + cos) / 2, -(1 + cos), (1 + cos) / 2];
  else [b0, b1, b2] = [alpha, 0, -alpha];
  const a0 = 1 + alpha;
  return { b0: b0 / a0, b1: b1 / a0, b2: b2 / a0, a1: (-2 * cos) / a0, a2: (1 - alpha) / a0 };
};
const state = () => ({ x1: 0, x2: 0, y1: 0, y2: 0 });
const run = (c, s, x) => {
  const y = c.b0 * x + c.b1 * s.x1 + c.b2 * s.x2 - c.a1 * s.y1 - c.a2 * s.y2;
  s.x2 = s.x1;
  s.x1 = x;
  s.y2 = s.y1;
  s.y1 = y;
  return y;
};
const filt = (samples, type, freq, q) => {
  const c = biquad(type, freq, q);
  const s = state();
  return samples.map((x) => run(c, s, x));
};

// ---------- instruments ----------
const kick = (vel = 1) => {
  const len = Math.floor(0.4 * SR);
  const out = new Float32Array(len);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (48 + 110 * Math.exp(-t / 0.03))) / SR;
    out[i] = Math.sin(ph) * Math.exp(-t / 0.18) * vel;
  }
  return out;
};

const snap = (vel = 1) => {
  const len = Math.floor(0.15 * SR);
  const raw = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    raw[i] = noise() * (Math.exp(-t / 0.012) + 0.3 * Math.exp(-t / 0.05));
  }
  return filt(raw, "bp", 2100, 1.4).map((x) => x * 2.2 * vel);
};

const shaker = (vel = 1) => {
  const len = Math.floor(0.07 * SR);
  const raw = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    raw[i] = noise() * Math.min(1, t / 0.01) * Math.exp(-t / 0.025);
  }
  return filt(raw, "hp", 7000).map((x) => x * vel);
};

// Electric-piano (two-operator FM) with soft tremolo
const keys = (midis, dur, vel = 1, bright = 1) => {
  const len = Math.floor((dur + 0.8) * SR);
  const out = new Float32Array(len);
  for (const m of midis) {
    const f = hz(m);
    for (let i = 0; i < len; i++) {
      const t = i / SR;
      const env = Math.min(1, t / 0.004) * Math.exp(-t / 1.4) * (t > dur ? Math.exp(-(t - dur) / 0.18) : 1);
      const modIdx = 1.6 * bright * Math.exp(-t / 0.3);
      const s = Math.sin(2 * Math.PI * f * t + modIdx * Math.sin(2 * Math.PI * f * t));
      out[i] += s * env * (1 + 0.12 * Math.sin(2 * Math.PI * 4.5 * t));
    }
  }
  return filt(out, "lp", 2600 * bright).map((x) => (x / midis.length) * vel);
};

const pad = (midis, dur, vel = 1, cutoff = 1500) => {
  const len = Math.floor(dur * SR);
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.6) * Math.min(1, (dur - t) / 0.6);
    let s = 0;
    for (const m of midis)
      for (const d of [-0.08, 0.08]) {
        const f = hz(m) * 2 ** (d / 12);
        s += Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(4 * Math.PI * f * t);
      }
    out[i] = (s / (midis.length * 2)) * env * vel;
  }
  return filt(out, "lp", cutoff);
};

const sub = (midi, dur, vel = 1) => {
  const f = hz(midi);
  const len = Math.floor((dur + 0.05) * SR);
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.01) * (t > dur ? Math.exp(-(t - dur) / 0.03) : 1) * (0.7 + 0.3 * Math.exp(-t / 0.3));
    out[i] = Math.tanh(1.3 * Math.sin(2 * Math.PI * f * t)) * env * vel;
  }
  return out;
};

const bell = (midi, vel = 1, dur = 1.2) => {
  const f = hz(midi);
  const len = Math.floor(dur * SR);
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.002) * Math.exp(-t / 0.45);
    out[i] = (Math.sin(2 * Math.PI * f * t) + 0.4 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t / 0.12)) * env * vel;
  }
  return out;
};

const riser = (dur, vel = 1) => {
  const len = Math.floor(dur * SR);
  const out = new Float32Array(len);
  const s = state();
  for (let i = 0; i < len; i++) {
    const p = i / len;
    out[i] = run(biquad("bp", 300 + 6500 * p * p, 2.2), s, noise()) * p * p * vel;
  }
  return out;
};

const reverse = (samples) => Float32Array.from(samples).reverse();

// ---------- sound effects ----------
const whoosh = () => {
  const len = Math.floor(0.6 * SR);
  const out = new Float32Array(len);
  const s = state();
  for (let i = 0; i < len; i++) {
    const p = i / len;
    const env = Math.sin(Math.PI * Math.min(1, p * 1.2)) ** 2;
    out[i] = run(biquad("bp", 350 + 3200 * Math.sin(Math.PI * p), 1.3), s, noise()) * env * 0.9;
  }
  return out;
};

const pop = () => {
  const len = Math.floor(0.12 * SR);
  const out = new Float32Array(len);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (380 + 1100 * Math.exp(-t / 0.015))) / SR;
    out[i] = Math.sin(ph) * Math.exp(-t / 0.035) * 0.8;
  }
  return out;
};

const sparkle = () => {
  const out = new Float32Array(Math.floor(1.6 * SR));
  [89, 93, 96, 101, 96, 101, 105].forEach((m, n) => add({ L: out, R: new Float32Array(out.length) }, n * 0.06, bell(m, 0.32 - n * 0.025, 1.2)));
  return out;
};

const click = () => {
  const len = Math.floor(0.05 * SR);
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    out[i] = (Math.sin(2 * Math.PI * 1800 * t) * 0.6 + noise() * 0.4) * Math.exp(-t / 0.006);
  }
  return out;
};

const impact = () => {
  const len = Math.floor(1.4 * SR);
  const out = new Float32Array(len);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (40 + 90 * Math.exp(-t / 0.05))) / SR;
    out[i] = Math.sin(ph) * Math.exp(-t / 0.45) + noise() * Math.exp(-t / 0.05) * 0.35;
  }
  return filt(out, "lp", 4000);
};

const stopHit = () => {
  // Short tape-stop-like downward "dum" + soft noise: the scroll-stopper on frame 0
  const len = Math.floor(0.5 * SR);
  const out = new Float32Array(len);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (220 * Math.exp(-t / 0.12) + 50)) / SR;
    out[i] = Math.sin(ph) * Math.exp(-t / 0.2) * 0.9 + noise() * Math.exp(-t / 0.02) * 0.2;
  }
  return out;
};

// ---------- the track ----------
// One chord per bar (2s). Bars 0–1 hook/problem minor colour, then bright major loop.
const CHORDS = {
  Fmaj7: { keys: [53, 57, 60, 64], bass: 29 },
  Dm9: { keys: [53, 57, 60, 64], bass: 26 },
  Bbmaj7: { keys: [50, 53, 57, 58], bass: 34 },
  C6: { keys: [52, 55, 57, 60], bass: 36 },
  Am7: { keys: [52, 55, 57, 60], bass: 33 },
  Gm9: { keys: [53, 57, 58, 62], bass: 31 },
};
// Bars start every 2s: 0,2,4,...,28
const PROGRESSION = [
  "Dm9", "Bbmaj7", "Dm9", "Bbmaj7", // 0–8  hook + problem (minor, unresolved)
  "Fmaj7", "C6", "Bbmaj7", // 8–14 reveal
  "Fmaj7", "Am7", "Bbmaj7", "C6", // 14–22 benefits
  "Fmaj7", "Gm9", // 22–26 proof
  "Bbmaj7", "Fmaj7", // 26–30 CTA → home
];

const MELODY = [
  // [time, midi] — glassy bell hook, enters on the benefits
  [14, 77], [14.5, 79], [15, 81], [16, 84], [17, 81], [17.75, 79], [18, 76], [19, 77],
  [20, 81], [20.5, 79], [21, 77], [22, 81], [22.5, 84], [23, 86], [24, 84], [24.75, 81], [25, 79],
  [26, 77], [26.5, 81], [27, 84], [28, 89],
];

const buildMusic = () => {
  const buf = buffer(DURATION + 1);
  PROGRESSION.forEach((name, bar) => {
    const at = bar * BAR;
    const c = CHORDS[name];
    const intro = at < 8;
    const bright = intro ? 0.45 : 1;
    // Keys: stabs on 1 and the "and" of 2 (syncopated, lifestyle feel)
    add(buf, at, keys(c.keys, 0.9, 0.42, bright), 1, -0.15);
    add(buf, at + BEAT * 1.5, keys(c.keys, 0.4, 0.26, bright), 1, 0.15);
    add(buf, at + BEAT * 3, keys(c.keys, 0.45, 0.22, bright), 1, 0.05);
    add(buf, at, pad(c.keys.map((m) => m + 12), BAR, intro ? 0.12 : 0.09, intro ? 900 : 1800), 1, 0);
    if (at >= 3) {
      for (let b = 0; b < 4; b++) add(buf, at + b * BEAT, sub(c.bass + 12, BEAT * 0.8, at < 8 ? 0.18 : 0.3));
    }
  });

  for (let t = 0; t < DURATION - 1; t += BEAT) {
    const beatInBar = Math.round(t / BEAT) % 4;
    if (t >= 8 && t < 29) add(buf, t, kick(0.75));
    if (t >= 3 && (beatInBar === 1 || beatInBar === 3)) add(buf, t, snap(t < 8 ? 0.35 : 0.5), 1, 0.1);
    if (t >= 3) for (let k = 0; k < 4; k++) add(buf, t + k * (BEAT / 4), shaker(k % 2 ? 0.08 : 0.14), 1, 0.35);
  }

  MELODY.forEach(([t, m]) => add(buf, t, bell(m, 0.16), 1, 0.25));
  // Tiny echo on the bells for space
  MELODY.forEach(([t, m]) => add(buf, t + BEAT * 0.75, bell(m, 0.06), 1, -0.4));

  add(buf, 6.0, riser(2.0, 0.22)); // build into the product reveal
  add(buf, 7.5, reverse(bell(89, 0.25, 0.5)), 1, 0); // reverse swell
  add(buf, 8.0, impact(), 0.25); // reveal accent (in the music)
  add(buf, 26.0, impact(), 0.3); // CTA accent

  // Final chord ring
  add(buf, 28, keys(CHORDS.Fmaj7.keys.concat([69]), 1.6, 0.4, 1));

  // Master: soft clip + fade-out over the last 0.6s
  const total = DURATION * SR;
  for (const ch of [buf.L, buf.R])
    for (let i = 0; i < ch.length; i++) {
      const t = i / SR;
      const fade = t > DURATION - 0.6 ? Math.max(0, (DURATION - t) / 0.6) : 1;
      ch[i] = i < total ? Math.tanh(ch[i] * 0.9) * 0.85 * fade : 0;
    }
  return { L: buf.L.subarray(0, total), R: buf.R.subarray(0, total) };
};

// ---------- I/O ----------
const writeWav = (file, L, R = L) => {
  const n = L.length;
  const data = Buffer.alloc(44 + n * 4);
  data.write("RIFF", 0);
  data.writeUInt32LE(36 + n * 4, 4);
  data.write("WAVEfmt ", 8);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(2, 22);
  data.writeUInt32LE(SR, 24);
  data.writeUInt32LE(SR * 4, 28);
  data.writeUInt16LE(4, 32);
  data.writeUInt16LE(16, 34);
  data.write("data", 36);
  data.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), 44 + i * 4);
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), 46 + i * 4);
  }
  writeFileSync(file, data);
};

const normalize = (s, peak = 0.9) => {
  let max = 0;
  for (const x of s) max = Math.max(max, Math.abs(x));
  return max ? s.map((x) => (x / max) * peak) : s;
};

const toMp3 = (name, L, R) => {
  const wav = path.join(OUT_DIR, `${name}.wav`);
  const mp3 = path.join(OUT_DIR, `${name}.mp3`);
  writeWav(wav, L, R);
  const r = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", wav, "-codec:a", "libmp3lame", "-b:a", "192k", mp3]);
  if (r.status !== 0) throw new Error(`ffmpeg failed for ${name}: ${r.stderr}`);
  unlinkSync(wav);
  console.log("✓", path.relative(process.cwd(), mp3));
};

mkdirSync(OUT_DIR, { recursive: true });
const music = buildMusic();
toMp3("music", music.L, music.R);
for (const [name, fn] of Object.entries({ whoosh, pop, sparkle, click, impact, "stop-hit": stopHit })) {
  const s = normalize(fn());
  toMp3(name, s, s);
}
