# plan.py: timing plan for the Al Mozon Academy premium spot, driven by the voice-over segment lengths.
# Uses voice/vo_<i>.wav when present, otherwise an estimate (so the edit can be previewed before the voice exists).
import json, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
FPS = 30
REBUILD = os.environ.get('REBUILD') == '1'
os.makedirs('clips', exist_ok=True)
VO = [  # (scene, lang, exact brief wording)
    (0, 'fr', "Vous cherchez un centre d'allemand qui sort de l'ordinaire ?"),
    (0, 'ar', "في Al Mozon Academy، اخترنالك فضاء مختلف، فيلا راقية وحديقة تعطيك الراحة والجو المناسب باش تتعلّم."),
    (1, 'fr', "Parce que la réussite commence par un bon encadrement."),
    (1, 'ar', "مع أساتذة أكفاء وعندهم الخبرة، يرافقوك خطوة بخطوة باش تطوّر مستواك في اللغة الألمانية."),
    (2, 'fr', "Un espace exceptionnel, dans un emplacement privilégié à Ben Arous."),
    (2, 'ar', "موش كان تقرا الألمانية، زادة تتعلّم في محيط مريح ومميّز."),
    (3, 'fr', "Des formations adaptées à tous les niveaux : A1, A2, B1 et B2, avec préparation aux examens Goethe."),
    (3, 'ar', "مستقبلك يبدأ باللغة الألمانية، والبداية تكون مع Al Mozon Academy."),
    (4, 'ar', "سجّل توا وخوذ بلاصتك !"),
]
TITLES = ["UN CADRE D'APPRENTISSAGE\nEXCEPTIONNEL.", "DES ENSEIGNANTS COMPÉTENTS\nET EXPÉRIMENTÉS.", "UN ESPACE UNIQUE\nÀ BEN AROUS.",
          "ALLEMAND A1 • A2 • B1 • B2\nPRÉPARATION AUX EXAMENS GOETHE"]
# real academy footage only: (file, in, out) in seconds; every shot is cropped to hide the old caption cards
SHOTS = [  # (file, in, out[, crop]) - crop 1.5 where the old ad's hook card sits lower
    [('p6', 0.8, 2.6, 1.5), ('p4', 5.85, 6.9), ('marque', 5.6, 6.4), ('marque', 6.6, 8.6), ('marque', 11.0, 12.6)],   # garden paths, gate + sign, entrance, villa staircase
    [('p2', 4.0, 5.6), ('p5', 4.2, 5.4), ('p3', 4.2, 5.4), ('p5', 3.0, 4.0)],                                        # teachers with students
    [('marque', 17.9, 19.2), ('marque', 13.0, 14.2), ('plan', 2.6, 4.0), ('plan', 0.0, 0.7, 1.6)],                     # villa stairs, Berlin/Stuttgart rooms, lounge, logo wall
    [('p3', 0.0, 2.6, 1.5), ('marque', 14.5, 15.7), ('p3', 5.85, 6.8), ('p5', 0.3, 1.8, 1.5), ('p5', 5.6, 7.0)],        # students, books, Goethe prep, flag
]
def dur(p): return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout)
segs = []
for i, (sc, lang, text) in enumerate(VO):
    f = f'voice/vo_{i}.wav'
    d = dur(f) if os.path.exists(f) else len(text.split()) / (2.9 if lang == 'fr' else 2.4) + .3
    segs.append(dict(i=i, scene=sc, lang=lang, text=text, d=round(d, 3), file=f if os.path.exists(f) else None))
t = 0.6; scenes = [dict(start=0.0) for _ in range(4)]
for s in segs:
    prev = segs[s['i'] - 1] if s['i'] else None
    if prev is not None:
        t += .45 if s['scene'] != prev['scene'] else .15
        if s['scene'] != prev['scene'] and s['scene'] < 4: scenes[s['scene']]['start'] = round(t - .35, 3)
    s['start'] = round(t, 3); s['end'] = round(t + s['d'], 3); t = s['end']
END_START = round(segs[8]['start'] - .5, 3)
TOTAL = round(segs[8]['end'] + 1.95, 3)
for k in range(4):
    scenes[k]['end'] = scenes[k + 1]['start'] if k < 3 else END_START + .5
    a, b = scenes[k]['start'], scenes[k]['end']; tot = sum(x[2] - x[1] for x in SHOTS[k]); rate = tot / (b - a); shots = []; st = a
    for j, shot in enumerate(SHOTS[k]):
        f, s0, s1 = shot[:3]; crop = shot[3] if len(shot) > 3 else 1.32
        en = st + (s1 - s0) / rate; ov = 0.4 if not (k == 3 and j == len(SHOTS[k]) - 1) else 0.5   # 0.4 s overlap = cross-dissolve
        out = f'clips/s{k}_{j}.mp4'; length = en - st + ov
        if not os.path.exists(out) or REBUILD:
            # pre-rendered slow motion with motion interpolation: plays at 1x in the edit
            speed = (s1 - s0) / (en - st)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{s0:.3f}', '-t', f'{(s1 - s0) + ov * speed + .1:.3f}', '-i', f'/home/user/almozon/src/{f}.mp4', '-an',
                            '-vf', f'minterpolate=fps={30 / speed:.3f}:mi_mode=mci:mc_mode=aobmc:vsbmc=1,setpts=PTS/{speed:.4f},fps=30,format=yuv420p',
                            '-c:v', 'libx264', '-crf', '14', '-preset', 'medium', out], check=True)
        shots.append(dict(src=f'almozon/clips/s{k}_{j}.mp4', from_=0, start=round(st, 3), end=round(en + ov, 3), rate=1, crop=crop, source=[f, s0, s1]))
        st = en
    scenes[k].update(title=TITLES[k], shots=shots)
# subtitles: chunks of <= 7 words, timed by length inside each voice segment
subs = []
for s in segs:
    w = s['text'].split(); n = max(1, round(len(w) / 7)); per = -(-len(w) // n)
    chunks = [' '.join(w[i:i + per]) for i in range(0, len(w), per)]
    L = sum(len(c) for c in chunks); t0 = s['start']
    for c in chunks:
        d = s['d'] * len(c) / L; subs.append(dict(start=round(t0, 3), end=round(t0 + d, 3), text=c, rtl=s['lang'] == 'ar')); t0 += d
plan = dict(fps=FPS, total=TOTAL, durationInFrames=round(TOTAL * FPS), scenes=scenes, endStart=END_START, subs=subs, voice=segs,
            contact=dict(whatsapp='99 008 008', place='Radès · Ben Arous'))
json.dump(plan, open('plan.json', 'w'), ensure_ascii=False, indent=1)
print('total', TOTAL, 's; scenes', [(round(s['start'], 1), round(s['end'], 1)) for s in scenes], 'end card', END_START)
