"""Builds public/products/photo/kit-flatlay.jpg from the kit flat-lay source photo.

Steps: crop the products band and upscale; swap the green applicator for the real
white dotted one; move the scalp brush to the left; rewrite the product names
on the sidr pouch and the rosemary bottle in Arabic.
Needs: Pillow with raqm (Arabic shaping) and rembg.
"""
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance
import random
from rembg import remove, new_session

ROOT = "/home/user/remotion/"
SRC = ROOT + "assets/source-images/kit-flatlay-source.jpg"
OUT = ROOT + "public/products/photo/kit-flatlay.jpg"
FONT = ROOT + "public/fonts/Cairo.ttf"

src = Image.open(SRC).convert("RGB")


def kit_xy(x, y):  # source coords -> kit coords (crop y 592, scale 2)
    return (x * 2, (y - 592) * 2)


im = src.crop((0, 592, 704, 1006)).resize((1408, 828), Image.LANCZOS)
im = im.filter(ImageFilter.UnsharpMask(radius=2, percent=80, threshold=2))
im = ImageEnhance.Contrast(im).enhance(1.04)


def fill_rows(img, x0, x1, y0, y1, blur=5, noise=0):
    """Paint a box by blending the colours just left and right of it, row by row."""
    px = img.load()
    rnd = random.Random(3)
    for y in range(y0, y1):
        L = px[x0 - 4, y]
        R = px[x1 + 4, y]
        for x in range(x0, x1):
            t = (x - x0) / (x1 - x0)
            n = rnd.randint(-noise, noise) if noise else 0
            px[x, y] = tuple(max(0, min(255, int(L[i] * (1 - t) + R[i] * t) + n)) for i in range(3))
    if blur:
        p = img.crop((x0 - 6, y0 - 6, x1 + 6, y1 + 6)).filter(ImageFilter.GaussianBlur(blur))
        if noise:
            p = Image.eval(p, lambda v: v)
        img.paste(p, (x0 - 6, y0 - 6))


def paste_with_shadow(base, obj, x, y, dx=14, dy=12, strength=0.35):
    sh = Image.new("RGBA", base.size, (0, 0, 0, 0))
    a = obj.split()[3].point(lambda v: int(v * strength))
    sh.paste((40, 30, 20, 255), (x + dx, y + dy), a)
    sh = sh.filter(ImageFilter.GaussianBlur(9))
    base = Image.alpha_composite(base, sh)
    base.alpha_composite(obj, (x, y))
    return base


# 1) brush: cut it from the source (full height there), erase it top-right
sess = new_session("isnet-general-use")
brush = remove(src.crop((500, 560, 645, 705)), session=sess)
brush = brush.crop(brush.getbbox())
a = brush.split()[3].point(lambda v: 0 if v < 110 else (255 if v > 200 else int((v - 110) * 255 / 90)))
brush.putalpha(a)
brush = brush.resize((brush.width * 2, brush.height * 2), Image.LANCZOS)
# cover the old spot with real cloth texture taken from the source, above the crop
cloth = src.crop((528, 325, 644, 436)).resize((232, 222), Image.LANCZOS)
mask = Image.new("L", cloth.size, 0)
ImageDraw.Draw(mask).rounded_rectangle((8, 0, 224, 214), radius=30, fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(8))
im.paste(cloth, (1030, 0), mask)

# 2) applicator: green one -> real white dotted one
fill_rows(im, 1060, 1186, 244, 662, blur=5)
base = im.convert("RGBA")
ap = Image.open(ROOT + "public/products/photo/applicator.png").convert("RGBA")
H = 440
W = int(ap.width * H / ap.height)
ap = ap.resize((W, H), Image.LANCZOS)
base = paste_with_shadow(base, ap, 1123 - W // 2, 660 - H)

# brush on the left, on the white cloth
base = paste_with_shadow(base, brush, 24, 40)
im = base.convert("RGB")

# 3) Arabic names
d = ImageDraw.Draw(im)
# sidr pouch: replace "POUDRE DE SIDR ROYAL"
fill_rows(im, 606, 818, 346, 446, blur=3, noise=5)
d = ImageDraw.Draw(im)
f = ImageFont.truetype(FONT, 42)
f.set_variation_by_axes([900])
d.text((708, 396), "السدر البلدي", font=f, fill=(52, 66, 34), anchor="mm", direction="rtl")
# rosemary bottle label: replace "HUILE DE ROMARIN"
fill_rows(im, 364, 472, 402, 484, blur=2)
d = ImageDraw.Draw(im)
f2 = ImageFont.truetype(FONT, 22)
f2.set_variation_by_axes([900])
d.text((418, 428), "زيت إكليل", font=f2, fill=(50, 45, 30), anchor="mm", direction="rtl")
d.text((418, 458), "الجبل", font=f2, fill=(50, 45, 30), anchor="mm", direction="rtl")

im.save(OUT, quality=94)
print("saved", OUT, im.size)
