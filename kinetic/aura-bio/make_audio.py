# make_audio.py: the film's music and sound kit, made in code (no samples, no licences).
# Music: 160 BPM, D harmonic minor, Andalusian cadence (Dm C Bb A), darbuka + trap drums + oud-like pluck.
# Beats 0-8 are a filtered intro with a riser; the drop lands on beat 8 (3.0 s).
# Usage: python3 make_audio.py   (writes audio/music.wav and audio/sfx/*.wav; needs numpy and ffmpeg)
import os, subprocess, numpy as np

SR = 44100
BPM = 160
BEAT = 60 / BPM
BEATS = 64
HERE = os.path.dirname(os.path.abspath(__file__))
rng = np.random.default_rng(7)


def buf(sec):
    return np.zeros((int(sec * SR) + SR, 2))


def put(b, t, x, g=1.0, pan=0.0):
    i = int(t * SR)
    x = x[: max(0, len(b) - i)]
    b[i:i + len(x), 0] += x * g * np.cos((pan + 1) * np.pi / 4)
    b[i:i + len(x), 1] += x * g * np.sin((pan + 1) * np.pi / 4)


def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)


def onepole_lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x)
    z = 0.0
    for i, v in enumerate(x):
        z = (1 - a) * v + a * z
        y[i] = z
    return y


def hp(x, fc):
    return x - onepole_lp(x, fc)


def kick(big=False):
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 45 + (150 if big else 110) * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t * (5 if big else 8))
    x[: int(0.004 * SR)] += rng.uniform(-1, 1, int(0.004 * SR)) * 0.6
    return np.tanh(x * 1.6)


def clap():
    n = int(0.25 * SR)
    x = rng.uniform(-1, 1, n)
    e = np.zeros(n)
    for k, d in enumerate([0, 0.008, 0.016, 0.026]):
        i = int(d * SR)
        e[i:] += np.exp(-np.arange(n - i) / SR / (0.012 if k < 3 else 0.09))
    return hp(x * e, 900) * 0.8


def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR)
    x = hp(rng.uniform(-1, 1, n), 6000)
    return x * env(n, 0.001, 0.06 if open_ else 0.012)


def doum():  # darbuka low stroke
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    f = 110 + 60 * np.exp(-t * 40)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11)


def tek():  # darbuka rim stroke
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 2900 * t) * 0.5 + hp(rng.uniform(-1, 1, n), 3000)
    return x * np.exp(-t * 60) * 0.7


def pluck(freq, dur=0.5, bright=0.5):  # Karplus-Strong, oud-like
    n = int(dur * SR)
    p = int(SR / freq)
    line = rng.uniform(-1, 1, p)
    out = np.empty(n)
    for i in range(n):
        v = line[i % p]
        out[i] = v
        line[i % p] = 0.996 * (bright * v + (1 - bright) * line[(i + 1) % p])
    return out * env(n, 0.002, dur * 0.6)


def sub(freq, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(4 * np.pi * freq * t)
    return np.tanh(1.8 * x) * env(n, 0.005, dur * 0.9) * 0.55


hz = lambda m: 440 * 2 ** ((m - 69) / 12)
ROOTS = [38, 36, 34, 33]                       # D2 C2 Bb1 A1, one per bar (4 beats)
SCALE = [62, 64, 65, 67, 69, 70, 73, 74]       # D harmonic minor from D4
MEL = [7, 6, 7, 4, 5, 4, 2, 4,  5, 4, 2, 1, 2, 1, 0, 1,  0, 2, 4, 5, 4, 2, 1, 0,  1, 2, 1, 0, 6, 5, 6, 7]

music = buf(BEATS * BEAT + 4)
drums = buf(BEATS * BEAT + 4)
for b in range(BEATS):
    t = b * BEAT
    bar = b // 4
    root = ROOTS[bar % 4]
    drop = b >= 8
    # melody: 8ths, filtered in the intro
    for h in range(2):
        m = SCALE[MEL[(b * 2 + h) % len(MEL)]]
        x = pluck(hz(m), 0.45, 0.5)
        if not drop:
            x = onepole_lp(x, 900 + 300 * b)
        put(music, t + h * BEAT / 2, x, 0.32, -0.2 + 0.4 * h)
    # darbuka maqsum on every bar, all film long
    pos = b % 4
    if pos == 0: put(drums, t, doum(), 0.6, -0.1)
    if pos in (1, 3): put(drums, t, tek(), 0.5, 0.25)
    if pos == 2: put(drums, t + BEAT / 2, doum(), 0.5, -0.1)
    put(drums, t + BEAT * 0.75, tek(), 0.25, 0.3)
    if drop:
        if pos in (0, 2) or (pos == 3 and bar % 2): put(drums, t, kick(), 0.95)
        if pos == 1 and bar % 2 == 0: put(drums, t + BEAT / 2, kick(), 0.7)
        if pos in (1, 3): put(drums, t, clap(), 0.55)
        for s in range(4 if bar % 2 else 2):
            put(drums, t + s * BEAT / (4 if bar % 2 else 2), hat(), 0.22, 0.35)
        if pos == 0:
            put(music, t, sub(hz(root), BEAT * 3.8), 0.9)

# intro riser into the drop, then a gap of half a beat
n = int(BEAT * 7.5 * SR)
tt = np.arange(n) / SR
noise = hp(rng.uniform(-1, 1, n), 1500) * (tt / tt[-1]) ** 3
put(music, 0, noise, 0.35)
put(music, 0, np.sin(2 * np.pi * np.cumsum(200 + 900 * (tt / tt[-1]) ** 2) / SR) * (tt / tt[-1]) ** 2, 0.12)
gap0, gap1 = int(BEAT * 7.5 * SR), int(BEAT * 8 * SR)
music[gap0:gap1] *= 0.05
drums[gap0:gap1] = 0
put(drums, 8 * BEAT, kick(True), 1.0)

mix = music + drums
mix /= np.abs(mix).max() / 0.9
os.makedirs(os.path.join(HERE, 'audio', 'sfx'), exist_ok=True)


def wav(path, x):
    x = np.asarray(x)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    x = x / max(1e-9, np.abs(x).max()) * 0.95
    pcm = (x * 32767).astype('<i2').tobytes()
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', '-', path], input=pcm, check=True)


wav(os.path.join(HERE, 'audio', 'music.wav'), mix)

# sound kit: synthesised one-shots plus the project's existing effects
S = os.path.join(HERE, 'audio', 'sfx')
A = os.path.join(HERE, '..', '..', 'public', 'audio')


def whoosh(dur, lo, hi):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = rng.uniform(-1, 1, n)
    out = np.zeros(n)
    z = 0.0
    fc = lo + (hi - lo) * np.sin(np.pi * t / dur)
    a = np.exp(-2 * np.pi * fc / SR)
    for i in range(n):
        z = (1 - a[i]) * x[i] + a[i] * z
        out[i] = z
    return out * np.sin(np.pi * t / dur) ** 2


wav(f'{S}/whoosh_1.wav', whoosh(0.6, 400, 4000))
wav(f'{S}/whoosh_2.wav', whoosh(0.7, 300, 3000))
wav(f'{S}/whoosh_big.wav', whoosh(1.2, 120, 2000) + 0.5 * sub(45, 1.2) * np.sin(np.pi * np.arange(int(1.2 * SR)) / SR / 1.2))
k = kick(True)
nb = int(1.2 * SR)
crash = hp(rng.uniform(-1, 1, nb), 2500) * env(nb, 0.001, 0.35)
imp = np.zeros(nb); imp[: len(k)] += k; imp += crash * 0.35
wav(f'{S}/impact.wav', imp)
nb2 = int(2.2 * SR)
tb = np.arange(nb2) / SR
boom = np.sin(2 * np.pi * np.cumsum(38 + 90 * np.exp(-tb * 12)) / SR) * np.exp(-tb * 1.6)
wav(f'{S}/impact_big.wav', np.tanh(2 * boom) + 0.3 * hp(rng.uniform(-1, 1, nb2), 2000) * env(nb2, 0.001, 0.5))
c = clap(); h = np.zeros(int(0.4 * SR)); h[: len(c)] += c; h[: len(k)] += 0.6 * k[: len(h)]
wav(f'{S}/hit.wav', h)
wav(f'{S}/slash.wav', whoosh(0.35, 2000, 9000))
wav(f'{S}/glitch.wav', np.concatenate([np.sign(np.sin(2 * np.pi * f * np.arange(int(0.05 * SR)) / SR)) * 0.4 for f in (220, 880, 140, 1320, 440, 660)]))
wav(f'{S}/key_1.wav', tek()[: int(0.05 * SR)])
for name, src in [('pop', 'pop.mp3'), ('tick', 'click.mp3'), ('key_2', 'click.mp3'), ('riser', 'riser.mp3'), ('cash', 'cash-bell.mp3'), ('shimmer', 'shimmer.mp3')]:
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(A, src), '-ar', str(SR), '-ac', '2', f'{S}/{name}.wav'], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{S}/impact_big.wav', '-i', os.path.join(A, 'shimmer.mp3'),
                '-filter_complex', '[1:a]aresample=44100,volume=0.8[s];[0:a][s]amix=inputs=2:normalize=0', '-ac', '2', f'{S}/logo_hit.wav'], check=True)
print('audio ready')
