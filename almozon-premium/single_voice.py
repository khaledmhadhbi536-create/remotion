# single_voice.py: the whole Al Mozon voice-over in ONE TTS call (one voice from start to finish),
# then split into the 13 lines of plan_v5 by silences, each chunk matched to its line by transcription.
# Output: voice1/l_<k>.wav for k = 0..12, and voice1/align.json. Exit code 1 if the lines cannot be matched.
import json, os, re, subprocess, sys, time, base64, urllib.request, difflib
os.chdir(os.path.dirname(os.path.abspath(__file__)))
LINES = ["Vous cherchez un centre d'allemand qui sort de l'ordinaire ?",
         "في المزن أكاديمي، فضاء استثنائي يعطيك الجو المناسب باش تتعلّم.",
         "La réussite commence par un bon encadrement.",
         "عندنا أساتذة أكفاء، يرافقوك خطوة بخطوة.",
         "Vous êtes à Radès ou à Ben Arous ? Notre centre est à Radès.",
         "السنتر متاعنا موجود في رادس، قريب منك.",
         "Programme flexible : sur place, ou en ligne sur notre plateforme pro.",
         "اللي ما ينجمش يجي، يقرا en ligne من دارو.",
         "De A1 à B2, avec préparation aux examens Goethe.",
         "On vous accompagne aussi : préparation de dossier, traduction et préparation de CV.",
         "ونعاونوك زادة في الدوسي، الترجمة والسي في.",
         "مستقبلك يبدا مع المزن أكاديمي.",
         "اتصل بينا لمزيد من المعلومات !"]
API = 'https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent'
def call(model, body, timeout=300):
    req = urllib.request.Request(API.format(model), data=json.dumps(body).encode(), headers={'Content-Type': 'application/json', 'x-goog-api-key': 'dummy'})
    return json.load(urllib.request.urlopen(req, timeout=timeout))
def tts(text, out):
    body = {"contents": [{"parts": [{"text": text}]}], "generationConfig": {"responseModalities": ["AUDIO"],
            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": "Charon"}}}}}
    for model in ['gemini-3.1-flash-tts-preview', 'gemini-2.5-flash-preview-tts', 'gemini-2.5-pro-preview-tts']:
        try:
            r = call(model, body); p = r['candidates'][0]['content']['parts'][0]['inlineData']
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', '24000', '-ac', '1', '-i', '-', out], input=base64.b64decode(p['data']), check=True)
            print('tts ok', model); return True
        except Exception as e: print('tts fail', model, getattr(e, 'code', e))
    return False
def transcribe(wav):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-ac', '1', '-ar', '16000', '-b:a', '48k', 'voice1/t.mp3'], check=True)
    body = {"contents": [{"parts": [{"inline_data": {"mime_type": "audio/mp3", "data": base64.b64encode(open('voice1/t.mp3', 'rb').read()).decode()}},
            {"text": "Transcribe exactly what is said (French in French, Arabic in Arabic script). Output only the text."}]}], "generationConfig": {"temperature": 0}}
    for m in ['gemini-3.5-flash', 'gemini-3.7-flash', 'gemini-3.5-flash-lite', 'gemini-3-flash-preview']:
        try: return ''.join(p.get('text', '') for p in call(m, body, 120)['candidates'][0]['content']['parts']).strip()
        except Exception: time.sleep(3)
    return ''
norm = lambda s: re.sub(r'[^\w]', '', s.lower().replace('أ', 'ا').replace('إ', 'ا').replace('ّ', '').replace('ة', 'ه'))
sim = lambda a, b: difflib.SequenceMatcher(None, norm(a), norm(b)).ratio()
os.makedirs('voice1', exist_ok=True)
script = ("Read the following script as one continuous voice-over, with the same warm, confident, premium male voice from start to finish. "
          "French sentences in natural French; Arabic sentences in authentic Tunisian derja accent (\"المزن\" is pronounced al-muzn). "
          "Leave a clear pause of about one second between each line.\n\n" + '\n\n'.join(LINES))
if not os.path.exists('voice1/full_ok.wav'):
    if not tts(script, 'voice1/full_ok.wav'): sys.exit('no TTS quota')
# speech chunks between pauses >= 0.45 s
log = subprocess.run(['ffmpeg', '-i', 'voice1/full_ok.wav', '-af', 'silencedetect=noise=-40dB:d=0.45', '-f', 'null', '-'], capture_output=True, text=True).stderr
starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]; ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
D = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', 'voice1/full_ok.wav'], capture_output=True, text=True).stdout)
bounds = [0.0] + ends; stops = starts + [D]
if starts and starts[0] < 0.05: bounds, stops = ends, starts[1:] + [D]
chunks = [(a, b) for a, b in zip(bounds, stops) if b - a > 0.25]
texts = []
for i, (a, b) in enumerate(chunks):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-i', 'voice1/full_ok.wav', 'voice1/chunk.wav'], check=True)
    texts.append(transcribe('voice1/chunk.wav')); print(i, round(a, 2), round(b, 2), texts[-1], flush=True)
# greedy: each line takes 1-3 consecutive chunks, whichever matches best
align = []; c = 0
for k, line in enumerate(LINES):
    best = None
    for n in (1, 2, 3):
        if c + n > len(chunks): break
        s = sim(' '.join(texts[c:c + n]), line)
        if best is None or s > best[0] + 0.03: best = (s, n)
    s, n = best; a, b = chunks[c][0], chunks[c + n - 1][1]
    align.append(dict(line=k, start=a, end=b, score=round(s, 2), heard=' '.join(texts[c:c + n]))); c += n
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{max(0, a - .03):.3f}', '-to', f'{b + .05:.3f}', '-i', 'voice1/full_ok.wav',
                    '-af', 'aresample=48000,atempo=1.15', '-ac', '2', f'voice1/l_{k}.wav'], check=True)
json.dump(align, open('voice1/align.json', 'w'), ensure_ascii=False, indent=1)
for x in align: print(x['line'], x['score'], x['heard'])
bad = [x for x in align if x['score'] < 0.55]
print('weak lines:', [x['line'] for x in bad])
sys.exit(1 if bad or c != len(chunks) else 0)
