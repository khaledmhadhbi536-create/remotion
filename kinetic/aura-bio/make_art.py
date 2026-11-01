# make_art.py: the pack picture for the Picture block (2560x1440), from the cut-out product photos.
import cv2, numpy as np, json, os
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'public', 'products')
W, H = 2560, 1440
yy, xx = np.mgrid[0:H, 0:W]
r = np.sqrt(((xx - W / 2) / W) ** 2 + ((yy - H * .55) / H) ** 2)
c0, c1 = np.array([0x9C, 0x4F, 0x0B]), np.array([0x33, 0x1A, 0x07])   # BGR: blue centre to navy edge
img = (c0 * np.clip(1 - r * 1.6, 0, 1)[..., None] + c1 * np.clip(r * 1.6, 0, 1)[..., None]).astype(np.float32)
items = [('derma-roller.png', 700), ('rosemary-oil.png', 800), ('bottle-black.png', 760), ('sidr-powder.png', 560), ('brush-terracotta.png', 420)]
slots = [.24, .37, .5, .63, .76]
foc = []
for (f, h), sx in zip(items, slots):
    im = cv2.imread(os.path.join(P, f), cv2.IMREAD_UNCHANGED).astype(np.float32)
    s = h / im.shape[0]
    if im.shape[1] * s > 320: s = 320 / im.shape[1]
    im = cv2.resize(im, None, fx=s, fy=s, interpolation=cv2.INTER_LANCZOS4)
    ih, iw = im.shape[:2]
    x0, y0 = int(sx * W - iw / 2), int(H * .9 - ih)
    a = im[..., 3:] / 255
    # soft shadow under each product
    sh = np.zeros((H, W), np.float32)
    cv2.ellipse(sh, (int(sx * W), int(H * .9)), (int(iw * .55), 28), 0, 0, 360, 1, -1)
    sh = cv2.GaussianBlur(sh, (0, 0), 18)[..., None]
    img = img * (1 - .55 * sh)
    img[y0:y0 + ih, x0:x0 + iw] = img[y0:y0 + ih, x0:x0 + iw] * (1 - a) + im[..., :3] * a
    foc.append([round(sx, 3), round((y0 + ih / 2) / H, 3)])
cv2.imwrite('art/pack.png', np.clip(img, 0, 255).astype(np.uint8))
print(json.dumps(foc))
