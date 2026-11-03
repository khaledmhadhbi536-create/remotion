# base.py: rebuild the reference (CapCut) timeline from the cleaned 1080 rushes, synced to the voice-over.
# Shots come from match.json (reference time -> source clip/time). Output: base.mp4 (picture only) + edl.json.
import json, os, subprocess, numpy as np, cv2
os.chdir(os.path.dirname(os.path.abspath(__file__)))
REF = '/tmp/claude-0/-home-user-remotion/a8b71fe1-01a5-5807-8adb-1455b098eb86/scratchpad/ref/match.json'
PREP = '/home/user/lasagne/prep'
FPS = 30; END_PIC = 150.6; END = 154.8      # CapCut end card dropped; last shot held for the voice echo
rows = json.load(open(REF))
runs = []
for r in rows:
    if r['t'] >= END_PIC: break
    if runs and runs[-1]['clip'] == r['clip'] and -1.5 < r['src_t'] - runs[-1]['src_end'] < 6:
        runs[-1].update(end=r['t'] + .1, src_end=r['src_t']); runs[-1]['sc'].append(r['score'])
    else:
        runs.append(dict(clip=r['clip'], start=r['t'], end=r['t'] + .1, src_start=r['src_t'], src_end=r['src_t'], sc=[r['score']]))
# drop noise: very short runs or weak matches, absorbed by the previous shot
clean = []
for u in runs:
    if clean and (u['end'] - u['start'] < .45 or (np.mean(u['sc']) < .85 and u['end'] - u['start'] < 1.2)):
        clean[-1]['end'] = u['end']; continue
    clean.append(u)
for a, b in zip(clean, clean[1:]): a['end'] = b['start']
clean[0]['start'] = 0; clean[-1]['end'] = END
def dur(c): return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{PREP}/{c}.mp4'], capture_output=True, text=True).stdout)
def luma(c):
    cap = cv2.VideoCapture(f'{PREP}/{c}.mp4'); n = int(cap.get(7)); v = []
    for i in np.linspace(0, n - 2, 10).astype(int):
        cap.set(1, i); ok, f = cap.read()
        if ok: v.append(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY).mean() / 255)
    return float(np.mean(v))
gam = {}
os.makedirs('seg', exist_ok=True); edl = []; parts = []
for k, u in enumerate(clean):
    c = u['clip']; D = u['end'] - u['start']
    s0 = max(0, u['src_start']); s1 = max(u['src_end'] + .2, s0 + .2); s1 = min(s1, dur(c) - .05)
    last = k == len(clean) - 1
    if last: s1 = min(s0 + (END_PIC - u['start']), dur(c) - .05)   # real motion until 150.6, then held
    sp = (s1 - s0) / (D if not last else (END_PIC - u['start']))
    if c not in gam: gam[c] = float(np.clip(np.log(.47) / np.log(max(.05, luma(c))), .85, 1.2))
    vf = []
    if c == 'xx': vf.append('crop=trunc(ih*9/16/2)*2:ih')
    if sp < .8: vf += [f'minterpolate=fps={FPS / sp:.3f}:mi_mode=mci:mc_mode=aobmc', f'setpts=PTS/{sp:.4f}']
    else: vf.append(f'setpts=PTS/{sp:.4f}')
    vf += ['scale=1080:1920:flags=lanczos', f'eq=gamma={1 / gam[c]:.3f}:contrast=1.07:saturation=1.16',
           'colorbalance=rs=.03:bs=-.03:rh=.03:bh=-.04', 'unsharp=5:5:0.5:5:5:0', f'fps={FPS}']
    if last: vf.append(f'tpad=stop_mode=clone:stop_duration={END - END_PIC:.3f}')
    nfr = round(u['end'] * FPS) - round(u['start'] * FPS)
    vf += [f'trim=end_frame={nfr}', 'setsar=1', 'format=yuv420p']
    out = f'seg/{k:02d}.mov'; parts.append(out)
    edl.append(dict(i=k, clip=c, start=round(u['start'], 3), end=round(u['end'], 3), from_frame=round(u['start'] * FPS), frames=nfr, src=[round(s0, 2), round(s1, 2)], speed=round(sp, 3)))
    if not os.path.exists(out):
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{s0:.3f}', '-t', f'{s1 - s0:.3f}', '-i', f'{PREP}/{c}.mp4', '-an', '-vf', ','.join(vf),
                        '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', out], check=True)
    print(f"{k:02d} {u['start']:6.1f}-{u['end']:6.1f} {c} src {s0:6.1f}-{s1:6.1f} x{sp:.2f}", flush=True)
open('seg/list.txt', 'w').write(''.join(f"file '{os.path.basename(p)}'\n" for p in parts))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', 'seg/list.txt', '-c:v', 'libx264', '-preset', 'medium', '-crf', '15',
                '-r', str(FPS), '-pix_fmt', 'yuv420p', 'base.mp4'], check=True)
json.dump(edl, open('edl.json', 'w'), indent=1)
print('base done', sum(e['frames'] for e in edl), 'frames')
