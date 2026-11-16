# mix_videos.py: place each voice line in its slot (speed-fitted), duck the video's music under it, export 9:16 videos with voice.
import json, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
import sys
L = json.load(open(sys.argv[1] if len(sys.argv) > 1 else 'lines.json')); SR = 48000; os.makedirs('fit', exist_ok=True); os.makedirs('../out', exist_ok=True)
def dur(p): return float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',p],capture_output=True,text=True).stdout)
def atempo(s):
    f=[]
    while s>2: f.append('atempo=2'); s/=2
    return f+[f'atempo={s:.4f}']
for vid, lines in L.items():
    V = f'../{vid}.mp4'; VD = dur(V)
    trs = []
    for k, (a, b, _) in enumerate(lines):
        src = f'raw/{vid}_{k}.wav'; tr = f'trim/{vid}_{k}.wav'
        subprocess.run(['ffmpeg','-v','error','-y','-i',src,'-af','silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.08,areverse',tr],check=True)
        trs.append((a, tr, dur(tr)))
    # one even pace for the whole video: each line starts at its slot or right after the previous one
    f = 1.0
    while True:
        t = 0.0; starts = []
        for a, tr, d in trs:
            st = max(a, t + 0.12 if starts else a); starts.append(st); t = st + d / f
        if t <= VD - 0.15 or f >= 1.3: break
        f += 0.02
    placed = []
    for (a, tr, d), st, k in zip(trs, starts, range(len(trs))):
        out = f'fit/{vid}_{k}.wav'
        subprocess.run(['ffmpeg','-v','error','-y','-i',tr,'-af',','.join(atempo(f)+[f'aresample={SR}']),'-ac','1',out],check=True)
        placed.append((st, out)); print(f'{vid} {k} start {st:5.2f} dur {d/f:4.2f} pace {f:.2f}')
    OD = VD; VD = max(VD, t + 0.45)   # hold the end card if the voice needs a little longer
    inputs = ['-i', V] + sum([['-i', p] for _, p in placed], [])
    fc = [f'[{i+1}:a]adelay={int(s*1000)}:all=1[d{i}]' for i, (s, _) in enumerate(placed)]
    fc.append(''.join(f'[d{i}]' for i in range(len(placed))) + f'amix=inputs={len(placed)}:normalize=0,highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=5:release=80:makeup=2,apad=whole_dur={VD},asplit=2[vo][sc]')
    fc.append(f'[0:a]aresample={SR},volume=0.8[mu];[mu][sc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=350[duck]')
    fc.append(f'[vo][duck]amix=inputs=2:normalize=0:duration=first,atrim=0:{VD},loudnorm=I=-14:TP=-1.5:LRA=11[out]')
    subprocess.run(['ffmpeg','-v','error','-y',*inputs,'-filter_complex',';'.join(fc),*(['-map','0:v','-c:v','copy'] if VD <= OD else ['-filter_complex:v' if False else '-vf', f'tpad=stop_mode=clone:stop_duration={VD-OD:.3f}', '-map','0:v','-c:v','libx264','-crf','18','-preset','medium','-pix_fmt','yuv420p']),'-map','[out]','-c:a','aac','-b:a','192k','-ar',str(SR),'-movflags','+faststart',f'../out/{vid}_voix.mp4'],check=True)
print('done')
