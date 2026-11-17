# mix.py: soundtrack for the Al Mozon spot = voice segments placed from plan.json + corporate bed ducked under the voice
# + two subtle sound cues (soft whoosh on scene changes, shimmer on the logo). Output: final_audio.wav at -14 LUFS.
import json, os, subprocess, numpy as np
os.chdir(os.path.dirname(os.path.abspath(__file__)))
SR = 48000; plan = json.load(open('plan.json')); END = plan['total']
KIT = '/home/user/remotion/kinetic/aura-bio/audio/sfx'
def load(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2)
n = int((END + 1) * SR); vo = np.zeros((n, 2), np.float32); fx = np.zeros((n, 2), np.float32)
def put(buf, x, t, g):
    i = max(0, int(t * SR)); x = x[: n - i]; buf[i:i + len(x)] += x * g
for s in plan['voice']:
    if s['file']: put(vo, load(s['file']), s['start'], 1.0)
for sc in plan['scenes'][1:]:
    put(fx, load(f'{KIT}/whoosh_2.wav'), sc['start'] - 0.25, 0.18)
put(fx, load(f'{KIT}/shimmer.wav'), plan['endStart'] + 0.25, 0.3)
for name, buf in (('vo_track.wav', vo), ('fx_track.wav', fx)):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', name], input=np.clip(buf, -1, 1).tobytes(), check=True)
if not os.path.exists('music.wav') or os.path.getmtime('music.wav') < os.path.getmtime('plan.json'):
    subprocess.run(['python3', '-I', '/home/user/almozon/corporate.py', f'{END:.3f}', 'music.wav'], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'vo_track.wav', '-i', 'music.wav', '-i', 'fx_track.wav', '-filter_complex',
    "[0:a]highpass=f=80,equalizer=f=3000:t=q:w=1.2:g=2,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=90:makeup=2,asplit=2[v][sc];"
    f"[1:a]aresample={SR},volume=0.5[m];[m][sc]sidechaincompress=threshold=0.02:ratio=6:attack=30:release=500[duck];"
    f"[v][duck][2:a]amix=inputs=3:normalize=0:duration=longest,atrim=0:{END},loudnorm=I=-14:TP=-1.5:LRA=11[out]",
    '-map', '[out]', '-ar', str(SR), '-ac', '2', 'final_audio.wav'], check=True)
print('audio done', END)
