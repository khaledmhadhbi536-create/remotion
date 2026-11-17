# corporate.py <seconds> <out.wav>: premium corporate bed (piano arpeggios, warm strings pad, soft pulse), made in code.
# 96 BPM, C major / A minor: C - G - Am - F. Soft intro, pulse from bar 3, lift in the middle, warm final chord.
import sys, subprocess, numpy as np
SR = 44100; DUR = float(sys.argv[1]); OUT = sys.argv[2]
BPM = 96; BEAT = 60 / BPM; BAR = 4 * BEAT
rng = np.random.default_rng(11)
N = int((DUR + 5) * SR); L = np.zeros(N); R = np.zeros(N)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
def put(x, t, g, pan=0.0):
    i = int(t * SR)
    if i >= N: return
    x = x[:N - i]; L[i:i + len(x)] += x * g * np.cos((pan + 1) * np.pi / 4); R[i:i + len(x)] += x * g * np.sin((pan + 1) * np.pi / 4)
def piano(f, d, vel=1.0):
    n = int(d * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for k, g in [(1, 1), (2, .45), (3, .2), (4, .1), (5, .05)]:
        x += g * np.sin(2 * np.pi * f * k * t * (1 + .0003 * k * k)) * np.exp(-t * (1.6 + .9 * k))
    return x * np.minimum(1, t / .003) * vel
def pad(freqs, d):
    n = int(d * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for f in freqs:
        for det in (-.004, 0, .005):
            for k, g in [(1, 1), (2, .3), (3, .12)]:
                x += g * np.sin(2 * np.pi * f * (1 + det) * k * t + rng.uniform(0, 6))
    env = np.minimum(1, t / 1.2) * np.minimum(1, (d - t) / 1.0)
    return x * env / (len(freqs) * 4)
def sub(f, d):
    n = int(d * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * f * t) * np.exp(-t * 1.5) * np.minimum(1, t / .01)
def kick():
    n = int(.35 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(48 + 70 * np.exp(-t * 25)) / SR) * np.exp(-t * 8)
def tick(d=.05):
    n = int(d * SR); t = np.arange(n) / SR; x = rng.uniform(-1, 1, n)
    x = x - np.concatenate([[0], x[:-1]]); return x * np.exp(-t * 70)
PROG = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [57, 60, 64]), (41, [57, 60, 65])]   # C G Am F
bars = int(np.ceil(DUR / BAR)) + 1
for b in range(bars):
    t0 = b * BAR; root, ch = PROG[b % 4]; last = b >= bars - 1
    lift = 1.0 if b < 6 else 1.15
    if last:
        put(piano(hz(root + 12), 4), t0, .5); [put(piano(hz(m + 12), 4, .8), t0 + .02 * i, .35) for i, m in enumerate(ch)]
        put(pad([hz(m) for m in ch], 4), t0, .5); put(sub(hz(root - 12), 4), t0, .5); break
    put(pad([hz(m) for m in ch] + [hz(ch[0] + 12)], BAR + .6), t0, .55 * lift)
    arp = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 12, ch[0] + 24, ch[2] + 12, ch[1] + 12, ch[2] + 12]
    for k, m in enumerate(arp):
        put(piano(hz(m), 1.4, .75 if k % 2 else .95), t0 + k * BEAT / 2, .22 * lift, -.3 + .6 * (k % 2))
    if b >= 2:
        put(sub(hz(root - 12), BAR), t0, .35)
        for k in range(4): put(kick(), t0 + k * BEAT, .22 if k % 2 == 0 else .12)
        for k in range(8): put(tick(), t0 + k * BEAT / 2 + BEAT / 4, .05, .4)
irn = int(2.4 * SR); t = np.arange(irn) / SR
def conv(x, h):
    n = 1 << int(np.ceil(np.log2(len(x) + len(h)))); return np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(h, n), n)[:len(x)]
irl = rng.standard_normal(irn) * np.exp(-t * 2.8); irr = rng.standard_normal(irn) * np.exp(-t * 2.8)
wl, wr = conv(L, irl), conv(R, irr); k = np.abs(L).max() / max(1e-9, np.abs(wl).max()) * .3
n = int(DUR * SR); x = np.stack([(L + wl * k)[:n], (R + wr * k)[:n]], 1)
fo = int(2.0 * SR); x[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5
x = np.tanh(x / np.abs(x).max() * 1.1) * .9
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', OUT], input=x.astype('<f4').tobytes(), check=True)
print('music', DUR, OUT)
