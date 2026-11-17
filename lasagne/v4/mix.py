# mix.py: final soundtrack = cleaned voice-over (echo on its last 5 s) + Italian music ducked under it + SFX from plan.json.
import json, os, subprocess, numpy as np
os.chdir(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
plan = json.load(open('plan.json')); END = plan['durationInFrames'] / plan['fps']
SEP = '/tmp/claude-0/-home-user-remotion/a8b71fe1-01a5-5807-8adb-1455b098eb86/scratchpad/ref/sep/htdemucs/ref_audio/vocals.wav'
KIT = '/home/user/remotion/kinetic/aura-bio/audio/sfx'
VOICE_END, ECHO = 152.45, 5.0
run = lambda *a: subprocess.run(['ffmpeg', '-v', 'error', '-y', *a], check=True)
# 1. voice: clean, then echo only on the last 5 seconds
e0 = VOICE_END - ECHO
run('-i', SEP, '-filter_complex',
    f"[0:a]atrim=0:{VOICE_END},asetpts=PTS-STARTPTS,highpass=f=90,afftdn=nf=-30,equalizer=f=3200:t=q:w=1.2:g=2.5,"
    f"acompressor=threshold=-20dB:ratio=3:attack=5:release=90:makeup=3,aresample={SR},asplit=2[a][b];"
    f"[a]atrim=0:{e0},asetpts=PTS-STARTPTS[dry];"
    f"[b]atrim={e0},asetpts=PTS-STARTPTS,apad=pad_dur=2.4,aecho=0.85:0.85:260|520|780:0.5|0.32|0.2,afade=t=out:st={ECHO + 1.2}:d=1.2[wet];"
    f"[dry][wet]concat=n=2:v=0:a=1,apad=whole_dur={END}[v]", '-map', '[v]', '-ac', '2', 'voice.wav')
# 2. music (100 BPM Italian, generated in code)
if not os.path.exists('music.wav'):
    subprocess.run(['python3', '-I', '/home/user/lasagne/music.py', f'{END:.3f}', 'music.wav'], check=True)
# 3. SFX bed
n = int(END * SR) + SR
bed = np.zeros((n, 2), np.float32)
def load(name):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{KIT}/{name}.wav', '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2)
def put(x, t, g):
    i = max(0, int(t * SR)); x = x[: n - i]; bed[i:i + len(x)] += x * g
rng = np.random.default_rng(5)
def shutter():
    m = int(.18 * SR); t = np.arange(m) / SR
    click = np.zeros(m); click[:int(.004 * SR)] = 1; click[int(.07 * SR):int(.074 * SR)] = .7
    noise = rng.uniform(-1, 1, m) * (np.exp(-t * 60) + .6 * np.exp(-np.maximum(0, t - .07) * 60) * (t > .07))
    x = (click + .5 * noise) * .8; return np.stack([x, x], 1).astype(np.float32)
W = [load('whoosh_1'), load('whoosh_2')]; POP = load('pop'); HIT = load('hit'); SHIM = load('shimmer')
for k, c in enumerate(plan['chips']):
    put(W[k % 2], c['t'] - .3, .45)          # whoosh lands on the cut
    put(POP, c['t'] + .13, .5)               # chip pops in
for z in plan['freezes']:
    put(shutter(), z['t'] - .02, .7)
    if abs(z['t'] - 140.6) < .1: put(SHIM, z['t'], .5)   # golden gratin
for p in plan['punches']:
    if p['kind'] == 'in': put(HIT, p['t'] - .03, .18)
bed = np.clip(bed, -1, 1)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', 'sfx.wav'], input=bed.tobytes(), check=True)
# 4. mix: music ducked by the voice (sidechain), SFX on top, loudness for TikTok
run('-i', 'voice.wav', '-i', 'music.wav', '-i', 'sfx.wav', '-filter_complex',
    f"[0:a]asplit=2[vo][sc];[1:a]aresample={SR},volume=0.42[mu];"
    "[mu][sc]sidechaincompress=threshold=0.025:ratio=7:attack=25:release=450:makeup=1[duck];"
    f"[vo][duck][2:a]amix=inputs=3:normalize=0:duration=longest,atrim=0:{END},loudnorm=I=-14:TP=-1.5:LRA=11[out]",
    '-map', '[out]', '-ar', str(SR), '-ac', '2', 'final_audio.wav')
print('audio done', END)
