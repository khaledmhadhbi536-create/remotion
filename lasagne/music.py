# music.py <seconds> <out.wav>: an elegant modern Italian instrumental, made in code (no samples).
# 100 BPM, A minor: nylon guitar arpeggios, mandolin tremolo melody, upright bass, soft piano, brushes.
import sys, subprocess, numpy as np

SR = 44100
DUR = float(sys.argv[1]); OUT = sys.argv[2]
BPM = 100; BEAT = 60 / BPM; BAR = 4 * BEAT
rng = np.random.default_rng(3)
N = int((DUR + 4) * SR)
L = np.zeros(N); R = np.zeros(N)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)


def put(x, t, g, pan=0.0):
    i = int(t * SR)
    if i >= N: return
    x = x[: N - i]
    L[i:i + len(x)] += x * g * np.cos((pan + 1) * np.pi / 4)
    R[i:i + len(x)] += x * g * np.sin((pan + 1) * np.pi / 4)


def ks(freq, dur, damp=0.5, decay=0.996):
    """Karplus-Strong pluck, vectorised one period at a time."""
    p = max(2, int(SR / freq)); n = int(dur * SR)
    y = np.zeros(n + p + 1)
    y[:p] = rng.uniform(-1, 1, p)
    y[:p] -= y[:p].mean()
    for s in range(p, n + p, p):
        e = min(s + p, n + p)
        a = y[s - p:e - p]; b = y[s - p + 1:e - p + 1]
        y[s:e] = decay * ((1 - damp) * a + damp * b)
    out = y[p:n + p]
    fade = np.minimum(1, np.linspace(dur, 0, n) / 0.05)
    return out * fade


def lp(x, a):  # one-pole low-pass via cumulative filtering in blocks (fast enough for short notes)
    y = np.empty_like(x); z = 0.0
    for i in range(len(x)):
        z += a * (x[i] - z); y[i] = z
    return y


def bass(freq, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + .35 * np.sin(4 * np.pi * freq * t) + .1 * np.sin(6 * np.pi * freq * t)
    return x * np.exp(-t * 2.2) * np.minimum(1, t / .008)


def piano(freqs, dur):
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for f in freqs:
        for k, g in [(1, 1), (2, .4), (3, .18), (4, .08)]:
            x += g * np.sin(2 * np.pi * f * k * t * (1 + .0004 * k)) * np.exp(-t * (1.2 + .8 * k))
    return x * np.minimum(1, t / .004) / len(freqs)


def brush(dur=.25):
    n = int(dur * SR); t = np.arange(n) / SR
    x = rng.uniform(-1, 1, n); x = x - np.concatenate([[0], x[:-1]]) * .6
    return x * np.exp(-t * 18) * np.minimum(1, t / .01)


def kick():
    n = int(.3 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(50 + 60 * np.exp(-t * 30)) / SR) * np.exp(-t * 9)


# A minor progression, 8 bars: Am Dm G C F Dm E7 Am (roots and chord tones, MIDI)
PROG = [(45, [57, 60, 64]), (50, [57, 62, 65]), (43, [55, 59, 62]), (48, [55, 60, 64]),
        (41, [57, 60, 65]), (50, [57, 62, 65]), (40, [56, 59, 62, 64]), (45, [57, 60, 64])]
# melody (one phrase per 8 bars, 8th-note grid: MIDI or 0 = rest), Italian-flavoured with G# on E7
MEL_A = [76, 0, 74, 72, 71, 72, 74, 0,   77, 0, 76, 74, 72, 74, 76, 0,   74, 0, 72, 71, 69, 71, 72, 0,   72, 74, 76, 79, 76, 0, 0, 0,
         77, 0, 76, 74, 72, 0, 69, 72,   74, 0, 72, 71, 69, 71, 72, 74,   76, 0, 75, 76, 80, 0, 76, 74,   72, 71, 69, 0, 0, 0, 0, 0]
MEL_B = [81, 0, 79, 77, 76, 0, 77, 79,   81, 0, 77, 0, 74, 0, 77, 81,   79, 0, 77, 76, 74, 0, 71, 74,   76, 0, 79, 0, 76, 0, 72, 0,
         77, 79, 81, 0, 84, 0, 81, 77,   77, 0, 76, 74, 74, 72, 74, 0,   76, 0, 80, 0, 83, 81, 80, 76,   81, 0, 0, 0, 0, 0, 0, 0]

bars = int(np.ceil(DUR / BAR))
# sections by bar: intro (under the spoken first clip), A, B, A', B' (climax), outro
def section(b):
    if b < 8: return 'intro'
    if b < 24: return 'A'
    if b < 40: return 'B'
    if b < 52: return 'A2'
    if b < bars - 4: return 'B2'
    return 'outro'

for b in range(bars):
    t0 = b * BAR; root, ch = PROG[b % 8]; sec = section(b)
    last = b == bars - 1
    # nylon guitar arpeggio: root-5th-chord tones on 8ths
    pat = [root + 12, ch[0], ch[1], ch[2], ch[1], ch[0], ch[1], ch[-1] + 12 if sec in ('B', 'B2') else ch[2]]
    for k, m in enumerate(pat):
        if last and k > 0: break
        g = .22 if sec == 'intro' else .28
        put(ks(hz(m), 1.6, .55, .997), t0 + k * BEAT / 2 + .004 * (k % 2), g, -.35 + .1 * (k % 3))
    if sec != 'intro' or b >= 4:
        put(bass(hz(root - 12 if root > 44 else root), BEAT * 1.8), t0, .55 if sec != 'intro' else .3)
        if not last: put(bass(hz(root - 5 if root > 44 else root + 7), BEAT * 1.5), t0 + 2 * BEAT, .4 if sec != 'intro' else .22)
    if sec in ('A2', 'B2', 'outro'):
        put(piano([hz(m + 12) for m in ch], BAR), t0, .35, .3)
    if sec in ('A', 'B', 'A2', 'B2') and not last:
        put(kick(), t0, .35); put(kick(), t0 + 2.5 * BEAT, .2)
        for k in (1, 3): put(brush(), t0 + k * BEAT, .22, .2)
        if sec in ('B', 'B2'):
            for k in range(8): put(brush(.06), t0 + k * BEAT / 2 + BEAT / 4, .07, .5)
    # melody: mandolin (tremolo in B sections), from bar 8
    if sec in ('A', 'B', 'A2', 'B2'):
        mel = MEL_B if sec in ('B', 'B2') else MEL_A
        for k in range(8):
            m = mel[(b % 8) * 8 + k]
            if not m: continue
            nt = t0 + k * BEAT / 2
            ln = BEAT / 2
            j = k + 1
            while j < 8 and mel[(b % 8) * 8 + j] == 0: ln += BEAT / 2; j += 1
            if sec in ('B', 'B2'):
                for r in range(int(ln / (BEAT / 4))):
                    put(ks(hz(m), .25, .3, .995), nt + r * BEAT / 4, .16 if r else .2, .25)
            else:
                put(ks(hz(m), ln + .6, .35, .9975), nt, .24, .25)
# final chord ring
fin = bars * BAR - BAR
put(piano([hz(57), hz(60), hz(64), hz(69)], 4), fin, .5, .1)
put(bass(hz(33), 3), fin, .6)

# reverb: FFT convolution with a synthetic hall impulse
irn = int(2.2 * SR); t = np.arange(irn) / SR
ir_l = rng.standard_normal(irn) * np.exp(-t * 3.2); ir_r = rng.standard_normal(irn) * np.exp(-t * 3.2)
ir_l[:int(.012 * SR)] = 0; ir_r[:int(.017 * SR)] = 0
def conv(x, h):
    n = 1 << int(np.ceil(np.log2(len(x) + len(h))))
    return np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(h, n), n)[:len(x)]
wl, wr = conv(L, ir_l), conv(R, ir_r)
k = np.abs(L).max() / max(1e-9, np.abs(wl).max()) * .35
L2, R2 = L + wl * k, R + wr * k
n = int(DUR * SR)
L2, R2 = L2[:n], R2[:n]
fo = int(2.5 * SR); env = np.ones(n); env[-fo:] = np.linspace(1, 0, fo) ** 2
x = np.stack([L2 * env, R2 * env], 1); x = np.tanh(x / np.abs(x).max() * 1.2) * .9
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', OUT], input=x.astype('<f4').tobytes(), check=True)
print('music', DUR, 's ->', OUT)
