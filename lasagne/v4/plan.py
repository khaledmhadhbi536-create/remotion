# plan.py: one timing plan shared by the Remotion overlay and the audio mix.
import json, os, re
os.chdir(os.path.dirname(os.path.abspath(__file__)))
FPS = 30; END = 154.8
T = json.load(open('/tmp/claude-0/-home-user-remotion/a8b71fe1-01a5-5807-8adb-1455b098eb86/scratchpad/ref/transcript.json'))
edl = json.load(open('edl.json'))
segs = [dict(s) for s in T['segments'] if s['text'].strip()]
# light clean-up: Latin transliteration of the closing line, stray punctuation
for s in segs:
    if 'A9sim' in s['text']: s['text'] = 'قسما بالله من أبنّ ما كليت'
    s['text'] = re.sub(r'\s+', ' ', s['text'].replace('.', '').replace('،', '').replace(',', '')).strip()
# overlapping segments: clip each to the next one's start
segs.sort(key=lambda s: s['start'])
for a, b in zip(segs, segs[1:]): a['end'] = min(a['end'], b['start'] - .02)
# caption pages: <= 4 words, word times spread by character length inside each segment
pages = []
for s in segs:
    words = s['text'].split(); n = len(words)
    if not n: continue
    L = sum(len(w) + 1 for w in words); t = s['start']; span = max(.3, s['end'] - s['start']); wt = []
    for w in words:
        d = span * (len(w) + 1) / L; wt.append(dict(w=w, s=round(t, 3), e=round(t + d, 3))); t += d
    for i in range(0, n, 4):
        chunk = wt[i:i + 4]
        pages.append(dict(start=chunk[0]['s'], end=chunk[-1]['e'], words=chunk))
for a, b in zip(pages, pages[1:]): a['end'] = min(max(a['end'], a['start'] + .4), b['start'])
# chapters -> step chips (graphics), transitions (light leak + whoosh), zoom-out reveal
chapters = [(18.3, 'المكونات'), (24.6, 'التحضير'), (31.7, 'نسمطو الخضرة'), (49.6, 'اللحم'), (69.8, 'البشاميل'),
            (98.0, 'الدريساج'), (119.2, 'الموتزاريلا'), (137.3, 'للفور'), (144.8, 'بالشفاء')]
# snap each chapter to the nearest shot cut
cuts = [e['start'] for e in edl]
chapters = [(min(cuts, key=lambda c: abs(c - t)), name) for t, name in chapters]
chips = [dict(t=round(t, 3), n=i + 1, text=name, dur=2.6) for i, (t, name) in enumerate(chapters)]
# freeze frames ("temps d'arret"): picture holds with a flash and a photo frame
freezes = [dict(t=22.0, d=1.0), dict(t=88.3, d=0.8), dict(t=117.4, d=0.9), dict(t=127.0, d=0.9), dict(t=140.6, d=1.3), dict(t=149.0, d=1.6)]
# punch zooms: 'in' on strong words, 'out' (reveal) on chapter starts
punches = [dict(t=c['t'], kind='out') for c in chips] + [dict(t=t, kind='in') for t in (12.0, 28.3, 59.0, 89.4, 106.4, 124.4, 143.2, 145.3)]
plan = dict(fps=FPS, durationInFrames=round(END * FPS), shots=[dict(start=e['start'], end=e['end']) for e in edl],
            pages=pages, chips=chips, freezes=freezes, punches=sorted(punches, key=lambda p: p['t']))
json.dump(plan, open('plan.json', 'w'), ensure_ascii=False, indent=1)
print(len(pages), 'caption pages,', len(chips), 'chips,', len(freezes), 'freezes,', len(punches), 'punches')
