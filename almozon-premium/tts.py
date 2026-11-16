import json, base64, sys, urllib.request, subprocess, time
MODELS = sys.argv[3].split(',') if len(sys.argv) > 3 else ['gemini-3.8-flash-tts', 'gemini-2.5-flash-preview-tts', 'gemini-3.1-flash-tts-preview', 'gemini-3.8-flash-lite-tts', 'gemini-2.5-pro-preview-tts']
text, out = open(sys.argv[1]).read(), sys.argv[2]
body = {"contents": [{"parts": [{"text": text}]}],
        "generationConfig": {"responseModalities": ["AUDIO"],
                             "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": "Charon"}}}}}
for m in MODELS:
    try:
        req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent', data=json.dumps(body).encode(),
                                     headers={'Content-Type': 'application/json', 'x-goog-api-key': 'dummy'})
        r = json.load(urllib.request.urlopen(req, timeout=300))
        p = r['candidates'][0]['content']['parts'][0]['inlineData']
        pcm = base64.b64decode(p['data']); rate = int(p['mimeType'].split('rate=')[1].split(';')[0]) if 'rate=' in p['mimeType'] else 24000
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(rate), '-ac', '1', '-i', '-', out], input=pcm, check=True)
        print('ok', m, out); break
    except Exception as e:
        print('fail', m, getattr(e, 'code', ''), str(e)[:120]); time.sleep(2)
else:
    sys.exit(1)
