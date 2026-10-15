"""Generate PinkFlix brand icons: pure black AMOLED background, soft pink stage-light
glow, and a gradient pink play-glyph. Produces standard + maskable PWA icons,
apple-touch-icon, and favicons.
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import math
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
os.makedirs(OUT, exist_ok=True)

PINK_A = np.array([255, 62, 138])   # #FF3E8A
PINK_B = np.array([200, 30, 92])    # #C81E5C
GLOW = np.array([255, 90, 160])     # soft glow tint


def radial_glow(size, center, radius, color, max_alpha=90):
    """Return an RGBA numpy array with a soft radial glow."""
    yy, xx = np.mgrid[0:size, 0:size]
    dist = np.sqrt((xx - center[0]) ** 2 + (yy - center[1]) ** 2)
    t = np.clip(1 - dist / radius, 0, 1) ** 1.8
    alpha = (t * max_alpha).astype(np.uint8)
    rgba = np.zeros((size, size, 4), dtype=np.uint8)
    rgba[..., 0] = color[0]
    rgba[..., 1] = color[1]
    rgba[..., 2] = color[2]
    rgba[..., 3] = alpha
    return rgba


def make_icon(size, maskable=False):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 255))

    # Soft pink stage-light glow, centered slightly above middle
    glow_center = (size * 0.5, size * 0.46)
    glow_radius = size * (0.62 if not maskable else 0.5)
    glow = radial_glow(size, glow_center, glow_radius, GLOW, max_alpha=110)
    glow_img = Image.fromarray(glow, "RGBA").filter(ImageFilter.GaussianBlur(size * 0.03))
    img = Image.alpha_composite(img, glow_img)

    draw = ImageDraw.Draw(img)

    # content scale: maskable icons need content inside the safe ~80% zone
    scale = 0.66 if maskable else 0.78

    # Glass rounded-square panel
    pad = size * (1 - scale) / 2
    panel_radius = size * scale * 0.28
    panel_box = [pad, pad, size - pad, size - pad]
    draw.rounded_rectangle(
        panel_box, radius=panel_radius,
        outline=(255, 160, 200, 70), width=max(2, int(size * 0.006)),
        fill=(255, 255, 255, 10),
    )

    # Play triangle, gradient pink, centered with slight right offset for optical balance
    tri_h = size * scale * 0.42
    tri_w = tri_h * 0.86
    cx, cy = size / 2 + size * 0.02, size / 2
    p1 = (cx - tri_w / 2, cy - tri_h / 2)
    p2 = (cx - tri_w / 2, cy + tri_h / 2)
    p3 = (cx + tri_w / 2, cy)

    tri_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    tri_draw = ImageDraw.Draw(tri_layer)
    tri_draw.polygon([p1, p2, p3], fill=(255, 255, 255, 255))

    # build vertical gradient pink->deep pink clipped to triangle mask
    grad = np.zeros((size, size, 4), dtype=np.uint8)
    top = int(cy - tri_h / 2)
    bot = int(cy + tri_h / 2)
    for y in range(max(top, 0), min(bot, size)):
        t = (y - top) / max(1, (bot - top))
        color = (PINK_A * (1 - t) + PINK_B * t).astype(np.uint8)
        grad[y, :, 0] = color[0]
        grad[y, :, 1] = color[1]
        grad[y, :, 2] = color[2]
        grad[y, :, 3] = 255
    grad_img = Image.fromarray(grad, "RGBA")
    mask = tri_layer.split()[3]
    img.paste(grad_img, (0, 0), mask)

    img = img.convert("RGB") if maskable else img
    return img.convert("RGBA")


sizes = [16, 32, 180, 192, 512]
for s in sizes:
    make_icon(s).save(os.path.join(OUT, f"icon-{s}.png"))

make_icon(512, maskable=True).save(os.path.join(OUT, "icon-512-maskable.png"))
make_icon(192, maskable=True).save(os.path.join(OUT, "icon-192-maskable.png"))

print("icons written to", OUT)
