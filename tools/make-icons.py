"""Generate the app icons (run once: python tools/make-icons.py). Needs Pillow."""
import os
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'icons')
os.makedirs(OUT, exist_ok=True)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def icon(size, maskable=False):
    s = size * 2  # draw at 2x then downsample for smooth edges
    img = Image.new('RGB', (s, s))
    px = img.load()
    c1, c2 = (79, 70, 229), (124, 58, 237)
    for y in range(s):
        for x in range(s):
            px[x, y] = lerp(c1, c2, (x + y) / (2 * s))
    d = ImageDraw.Draw(img)
    pad = 0.18 if maskable else 0.12           # maskable icons need a bigger safe zone
    box = [s * pad, s * pad, s * (1 - pad), s * (1 - pad)]
    w = box[2] - box[0]
    # four rising bars (a chart) and a gold dot (the goal)
    bw = w * 0.17
    gap = (w - 4 * bw) / 3
    heights = [0.35, 0.55, 0.75, 0.95]
    base = box[3]
    for i, h in enumerate(heights):
        x0 = box[0] + i * (bw + gap)
        d.rounded_rectangle([x0, base - w * h * 0.8, x0 + bw, base], radius=bw * 0.28, fill=(255, 255, 255))
    r = w * 0.085
    cx, cy = box[2] - r * 0.4, box[1] + r * 0.4
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(251, 191, 36))
    if not maskable:
        # round the corners of the normal icon
        mask = Image.new('L', (s, s), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, s, s], radius=int(s * 0.22), fill=255)
        bg = Image.new('RGBA', (s, s), (0, 0, 0, 0))
        bg.paste(img, (0, 0), mask)
        img = bg
    return img.resize((size, size), Image.LANCZOS)


for name, size, maskable in [('icon-192.png', 192, False), ('icon-512.png', 512, False),
                             ('icon-maskable-512.png', 512, True), ('apple-touch-icon.png', 180, True)]:
    icon(size, maskable).save(os.path.join(OUT, name))
    print('wrote', name)
