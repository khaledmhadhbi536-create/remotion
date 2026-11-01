# edit.py: builds the 9:16 lasagne film from raw/ (Drive numbering kept). Clip 01 is used in full, untouched in length.
import os, subprocess, json, numpy as np, cv2
os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.makedirs('seg2', exist_ok=True); os.makedirs('out', exist_ok=True)

# chapters in recipe order; each shot: (clip, in, out, speed). speed < 1 = slow motion.
CH = [
    ('intro',     [('01', 0, 18.7, 1)]),                                 # cut when the hand reaches for the phone (no sink)                                   # full clip, never cut
    ('ingredients', [('02', .3, 6.5, 1)]),
    ('prep',      [('03', 8, 20, 2), ('03', 46, 58, 2)]),
    ('boil',      [('04', 2, 9, 1), ('05', 4, 7, .8), ('05', 7, 11, 1)]),
    ('meat',      [('06', 6, 10, 1), ('06', 12, 20, 1.5), ('06', 49, 55, 2), ('06', 64, 76, 3)]),
    ('bechamel',  [('07', 3, 11, 2), ('07', 108, 116, 1.5), ('07', 218, 232, 3)]),
    ('cheese',    [('08', 7, 15, 2), ('08', 19.5, 23.5, 1)]),
    ('layout',    [('09', 0, 5.3, 1)]),
    ('assembly',  [('10', 8, 26, 3), ('10', 38, 54, 2.5), ('10', 66, 98, 4)]),
    ('layers',    [('11', 6, 13, 1.5), ('11', 13, 16, .8), ('11', 16, 20, 1.5)]),
    ('topping',   [('12', 4, 28, 3)]),
    ('reveal',    [('14', 0, 9.5, .85)]),
    ('serving',   [('xx', 6, 18, 1.5), ('xx', 23, 27, 1), ('xx', 43, 47, .85), ('xx', 56, 68.7, 1)]),
]
BEAT = 0.6       # music: 100 BPM
XF = BEAT        # one-beat dissolve keeps every chapter start on the beat          # cross-dissolve between chapters (none after the intro, so clip 01 stays whole)
FPS = 30


def luma(clip):
    cap = cv2.VideoCapture(f'prep/{clip}.mp4'); n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)); v = []
    for i in np.linspace(0, n - 2, 12).astype(int):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i); ok, f = cap.read()
        if ok: v.append(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY).mean() / 255)
    return float(np.mean(v))


def dur(clip):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'prep/{clip}.mp4'], capture_output=True, text=True).stdout)


def atempo(s):
    f = []
    while s > 2: f.append('atempo=2'); s /= 2
    while s < .5: f.append('atempo=0.5'); s /= .5
    return f + [f'atempo={s:.4f}']


gam = {}
segs = []
for name, shots in CH:
    parts = []
    for k, (clip, a, b, sp) in enumerate(shots):
        if clip not in gam:
            m = luma(clip); gam[clip] = float(np.clip(np.log(.47) / np.log(max(.05, m)), .85, 1.2))  # gentle exposure match
        b = dur(clip) if b is None else b
        if clip != '01':
            n = max(2, round((b - a) / sp / BEAT)); sp = (b - a) / (n * BEAT)
        out = f'seg2/{name}_{k}.mov'; parts.append(out)
        if os.path.exists(out): continue
        vf = []
        if clip == 'xx': vf.append('crop=trunc(ih*9/16/2)*2:ih')
        if sp < 1:
            vf += [f'minterpolate=fps={FPS / sp:.3f}:mi_mode=mci:mc_mode=aobmc:vsbmc=1', f'setpts=PTS/{sp}']
        elif sp > 1:
            vf.append(f'setpts=PTS/{sp}')
        vf += ['scale=1080:1920:flags=lanczos',
               f'eq=gamma={1 / gam[clip]:.3f}:contrast=1.07:saturation=1.16',
               'colorbalance=rs=.03:gs=.0:bs=-.03:rh=.03:bh=-.04',          # warm, appetising
               'unsharp=5:5:0.55:5:5:0', 'vignette=angle=PI/6', f'fps={FPS}', 'format=yuv420p']
        if clip == '01':
            af = ['volume=1.0']                                       # spoken intro, kept as recorded
        else:  # background TV/music in the rushes: keep only a faint, bright texture (knife, sizzle)
            af = (atempo(sp) if sp != 1 else []) + ['highpass=f=1800', 'volume=0.10']
        cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(a), '-t', f'{b - a:.3f}', '-i', f'prep/{clip}.mp4',
               '-vf', ','.join(vf), '-af', ','.join(af + ['aresample=48000']), '-ac', '2',
               '-c:v', 'libx264', '-preset', 'medium', '-crf', '15', '-c:a', 'pcm_s16le', out]
        print(name, clip, a, b, sp, flush=True); subprocess.run(cmd, check=True)
    # join the shots of a chapter with hard cuts
    chap = f'seg2/ch_{name}.mov'
    if not os.path.exists(chap):
        lst = f'seg2/{name}.txt'; open(lst, 'w').write(''.join(f"file '{os.path.basename(p)}'\n" for p in parts))
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', chap], check=True)
    segs.append(chap)

# chain the chapters: hard cut after the intro, cross-dissolves elsewhere
lens = [dur(s.replace('raw/', '')) if False else float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', s], capture_output=True, text=True).stdout) for s in segs]
inputs = sum([['-i', s] for s in segs], [])
fc = [f'[{i}:v]fps={FPS},settb=1/{FPS},setpts=N/({FPS}*TB),setsar=1,format=yuv420p[n{i}];[{i}:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,asetpts=N/SR/TB[m{i}]' for i in range(len(segs))]
v, a = '[n0]', '[m0]'; t = lens[0]
for i in range(1, len(segs)):
    if i == 1:  # hard cut: clip 01 plays to its last frame
        fc.append(f'{v}[n{i}]concat=n=2:v=1:a=0,settb=1/{FPS}[v{i}]'); fc.append(f'{a}[m{i}]concat=n=2:v=0:a=1[a{i}]'); t += lens[i]
    else:
        fc.append(f'{v}[n{i}]xfade=transition=fade:duration={XF}:offset={t - XF:.3f}[v{i}]')
        fc.append(f'{a}[m{i}]acrossfade=d={XF}[a{i}]'); t += lens[i] - XF
    v, a = f'[v{i}]', f'[a{i}]'
total = t
json.dump({'total': total, 'intro': lens[0], 'chapters': list(zip([c[0] for c in CH], lens))}, open('out/timeline2.json', 'w'), indent=1)
print('total', round(total, 2), 's', flush=True)
M0 = lens[0] - 8 * 4 * BEAT   # music time at film 0 is -M0; a bar line lands on the cut after clip 01
subprocess.run(['python3', '-I', 'music.py', f'{total - M0:.3f}', 'out/music2.wav'], check=True)
# music: quiet under the spoken intro, then full; final 2.5 s fade on picture and sound
it = lens[0]
fc.append(f"[{len(segs)}:a]{(f'adelay={int(M0*1000)}:all=1,' if M0 >= 0 else f'atrim=start={-M0:.3f},asetpts=PTS-STARTPTS,')}volume='if(lt(t,{it - 1.5:.2f}),0.32,if(lt(t,{it + .5:.2f}),0.32+0.68*(t-{it - 1.5:.2f})/2,1))':eval=frame[mus]")
fc.append(f'{a}[mus]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1:LRA=11[aout]')
fc.append(f'{v}fade=t=out:st={total - 2.5:.3f}:d=2.5[vout]')
subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-i', 'out/music2.wav', '-filter_complex', ';'.join(fc),
                '-map', '[vout]', '-map', '[aout]', '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-profile:v', 'high',
                '-level', '4.2', '-pix_fmt', 'yuv420p', '-r', str(FPS), '-c:a', 'aac', '-b:a', '256k', '-ar', '48000',
                '-movflags', '+faststart', 'out/lasagne_9x16_v3.mp4'], check=True)
print('done')
