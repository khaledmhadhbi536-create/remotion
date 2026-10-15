import sys, json, base64, subprocess, urllib.request
model, voice, out, text = sys.argv[1:5]
style = ("You are a Tunisian woman in her forties from Tunis recording a casual, honest TikTok video for other women. "
 "Speak ONLY in Tunisian Arabic (Tunisian derja / Tounsi), with a strong, authentic Tunis accent and Tunisian intonation and rhythm. "
 "Do NOT use Modern Standard Arabic, Egyptian, Levantine or Gulf pronunciation. "
 "Pronounce typical Tunisian words the Tunisian way: « برشا », « توّا », « باش », « نفسرلك », « اللوطة », « كهو », « ميّة ». "
 "Short vowels are reduced like in Tunis, the sentence melody goes up and down like everyday Tunisian talk. "
 "Warm, convincing, friendly, natural, medium pace, never like a formal announcer.\n\nText:\n")
body={"contents":[{"parts":[{"text":style+text}]}],"generationConfig":{"responseModalities":["AUDIO"],"speechConfig":{"voiceConfig":{"prebuiltVoiceConfig":{"voiceName":voice}}}}}
req=urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",data=json.dumps(body).encode(),headers={"Content-Type":"application/json"})
d=json.load(urllib.request.urlopen(req,timeout=300))
p=d["candidates"][0]["content"]["parts"][0]["inlineData"]; pcm=base64.b64decode(p["data"])
rate=int(p.get("mimeType","rate=24000").split("rate=")[1].split(";")[0]) if "rate=" in p.get("mimeType","") else 24000
open(out+".pcm","wb").write(pcm)
subprocess.run(["ffmpeg","-v","error","-y","-f","s16le","-ar",str(rate),"-ac","1","-i",out+".pcm","-c:a","aac","-b:a","160k",out],check=True); print(out)
