import cv2, sys, subprocess, json, numpy as np
src, out, step = sys.argv[1], sys.argv[2], float(sys.argv[3])
cap = cv2.VideoCapture(src)
dur = cap.get(cv2.CAP_PROP_FRAME_COUNT) / cap.get(cv2.CAP_PROP_FPS)
tiles = []
t = 0.0
while t < dur:
    cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000)
    ok, f = cap.read()
    if not ok: break
    f = cv2.resize(f, (135, 240))
    cv2.putText(f, f'{t:.0f}', (4, 22), 0, .7, (0, 0, 0), 4); cv2.putText(f, f'{t:.0f}', (4, 22), 0, .7, (0, 255, 255), 2)
    tiles.append(f); t += step
cols = 12
while len(tiles) % cols: tiles.append(np.zeros_like(tiles[0]))
cv2.imwrite(out, np.vstack([np.hstack(tiles[i:i + cols]) for i in range(0, len(tiles), cols)]), [cv2.IMWRITE_JPEG_QUALITY, 80])
