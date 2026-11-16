# plan_v5.py: V5 (services + المزن pronunciation) of the Al Mozon Academy spot (Radès location + map, flexible programme, plane to Munich, contact CTA);, driven by the voice-over segment lengths.
# Uses voice/vo_<i>.wav when present, otherwise an estimate (so the edit can be previewed before the voice exists).
import json, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
FPS = 30
REBUILD = os.environ.get('REBUILD') == '1'
os.makedirs('clips_v5', exist_ok=True)
VO = [  # (scene, lang, on-screen wording, voice file)
    (0, 'fr', "Vous cherchez un centre d'allemand qui sort de l'ordinaire ?", 'n_vo_0'),
    (0, 'ar', "في Al Mozon Academy، فضاء استثنائي يعطيك الجو المناسب باش تتعلّم.", 'n_vo_v5_s0ar'),
    (1, 'fr', "La réussite commence par un bon encadrement.", 'n_vo_v4_s1fr'),
    (1, 'ar', "عندنا أساتذة أكفاء، يرافقوك خطوة بخطوة.", 'n_vo_v4_s1ar'),
    (2, 'fr', "Vous êtes à Radès ou à Ben Arous ? Notre centre est à Radès.", 'n_vo_v4_s2fr'),
    (2, 'ar', "السنتر متاعنا موجود في رادس، قريب منك.", 'n_vo_v4_s2ar'),
    (3, 'fr', "Programme flexible : sur place, ou en ligne sur notre plateforme pro.", 'n_vo_v4_s3fr'),
    (3, 'ar', "اللي ما ينجمش يجي، يقرا en ligne من دارو.", 'n_vo_v4_s3ar'),
    (4, 'fr', "De A1 à B2, avec préparation aux examens Goethe.", 'n_vo_v4_s4fr'),
    (5, 'fr', "On vous accompagne aussi : préparation de dossier, traduction et préparation de CV.", 'n_vo_v5_svfr'),
    (5, 'ar', "ونعاونوك زادة في الدوسي، الترجمة والـCV.", 'n_vo_v5_svar'),
    (6, 'ar', "مستقبلك يبدا مع Al Mozon Academy.", 'n_vo_v5_futar'),
    (7, 'ar', "اتصل بينا لمزيد من المعلومات !", 'n_vo_ctaar'),
]
TITLES = ["UN CADRE D'APPRENTISSAGE\nEXCEPTIONNEL.", "DES ENSEIGNANTS COMPÉTENTS\nET EXPÉRIMENTÉS.", "UN ESPACE UNIQUE\nÀ RADÈS.",
          "PROGRAMME FLEXIBLE\nSUR PLACE OU EN LIGNE", "ALLEMAND A1 • A2 • B1 • B2\nPRÉPARATION AUX EXAMENS GOETHE",
          "DOSSIER • TRADUCTION • CV\nON VOUS ACCOMPAGNE", "VOTRE AVENIR\nCOMMENCE ICI"]
PLANE_AFTER = 8; PLANE_LEN = 2.1   # the plane (Al Mozon -> München) flies right after "... examens Goethe."
# real academy footage only: (file, in, out) in seconds; every shot is cropped to hide the old caption cards
SHOTS = [  # (file, in, out[, crop]) - crop 1.5 where the old ad's hook card sits lower
    [('p6', 0.8, 2.6, 1.5), ('p4', 5.85, 6.9), ('marque', 5.6, 6.4), ('marque', 6.6, 8.6), ('marque', 11.0, 12.6)],   # garden paths, gate + sign, entrance, villa staircase
    [('p2', 4.0, 5.6), ('p5', 4.2, 5.4), ('p3', 4.2, 5.4), ('p5', 3.0, 4.0)],                                        # teachers with students
    [('marque', 17.9, 19.2), ('marque', 13.0, 14.2), ('plan', 2.6, 4.0), ('plan', 0.0, 0.7, 1.6)],                     # villa stairs, Berlin/Stuttgart rooms, lounge, logo wall
    [('marque', 17.45, 17.85), ('p2', 5.72, 6.0), ('plan', 6.0, 6.38), ('plan', 4.2, 6.0)],                             # the real tablet shots of the platform, then class
    [('p3', 0.0, 2.6, 1.68), ('marque', 14.5, 15.7), ('p3', 5.85, 6.8)],                                               # students, books, Goethe prep
    [('p2', 6.1, 7.3), ('p5', 0.3, 1.8, 1.5), ('p4', 0.3, 2.5, 1.68)],                                                  # counselling on the sofa, paperwork
    [('p5', 5.6, 7.0)],                                                                                                # German flag
]
def dur(p): return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout)
segs = []
for i, (sc, lang, text, vf) in enumerate(VO):
    f = f'voice/{vf}.wav'
    d = dur(f) if os.path.exists(f) else len(text.split()) / (2.9 if lang == 'fr' else 2.4) + .3
    segs.append(dict(i=i, scene=sc, lang=lang, text=text, d=round(d, 3), file=f if os.path.exists(f) else None))
NS = len(SHOTS); LAST = len(VO) - 1
t = 0.6; scenes = [dict(start=0.0) for _ in range(NS)]
for s in segs:
    prev = segs[s['i'] - 1] if s['i'] else None
    if prev is not None:
        t += .45 if s['scene'] != prev['scene'] else .15
        if s['scene'] != prev['scene'] and s['scene'] < NS: scenes[s['scene']]['start'] = round(t - .35, 3)
    if s['i'] == PLANE_AFTER + 1: t += PLANE_LEN
    s['start'] = round(t, 3); s['end'] = round(t + s['d'], 3); t = s['end']
END_START = round(segs[LAST]['start'] - .5, 3)
TOTAL = round(segs[LAST]['end'] + 1.95, 3)
for k in range(NS):
    scenes[k]['end'] = scenes[k + 1]['start'] if k < NS - 1 else END_START + .5
    a, b = scenes[k]['start'], scenes[k]['end']; tot = sum(x[2] - x[1] for x in SHOTS[k]); rate = tot / (b - a); shots = []; st = a
    for j, shot in enumerate(SHOTS[k]):
        f, s0, s1 = shot[:3]; crop = shot[3] if len(shot) > 3 else 1.32
        en = st + (s1 - s0) / rate; ov = 0.4 if not (k == NS - 1 and j == len(SHOTS[k]) - 1) else 0.5   # 0.4 s overlap = cross-dissolve
        out = f'clips_v5/s{k}_{j}.mp4'; length = en - st + ov
        if not os.path.exists(out) or REBUILD:
            # pre-rendered slow motion with motion interpolation: plays at 1x in the edit
            speed = (s1 - s0) / (en - st)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{s0:.3f}', '-t', f'{(s1 - s0) + ov * speed + .1:.3f}', '-i', f'/home/user/almozon/src/{f}.mp4', '-an',
                            '-vf', f'minterpolate=fps={30 / speed:.3f}:mi_mode=mci:mc_mode=aobmc:vsbmc=1,setpts=PTS/{speed:.4f},fps=30,format=yuv420p',
                            '-c:v', 'libx264', '-crf', '14', '-preset', 'medium', out], check=True)
        shots.append(dict(src=f'almozon/clips_v5/s{k}_{j}.mp4', from_=0, start=round(st, 3), end=round(en + ov, 3), rate=1, crop=crop, source=[f, s0, s1]))
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
            contact=dict(whatsapp='99 008 008', place='Radès'),
            map=dict(start=round(segs[4]['start'] + .2, 3), flash=round(segs[4]['start'] + segs[4]['d'] * .55, 3), end=round(segs[5]['end'] - .2, 3)),
            plane=dict(start=round(segs[PLANE_AFTER]['end'] + .1, 3), end=round(segs[PLANE_AFTER]['end'] + .1 + PLANE_LEN, 3)))
json.dump(plan, open('plan_v5.json', 'w'), ensure_ascii=False, indent=1)
print('total', TOTAL, 's; scenes', [(round(s['start'], 1), round(s['end'], 1)) for s in scenes], 'end card', END_START)
