"""
Extract individual stickers from the flyer PDF into transparent PNGs.

Requires: pymupdf, Pillow   (pip install pymupdf pillow)

Note: the flyer is a flattened image with overlapping stickers on a textured
dark background, so automatic background removal is only reliable for
high-contrast / isolated (esp. round) stickers. For best quality, export each
sticker from the layered source (AI/PSD) instead.

Usage: python tools/extract_stickers.py
Outputs to images/stickers/.
"""
import os
import fitz  # PyMuPDF
from PIL import Image, ImageDraw, ImageFilter

PDF = "STASH_A_01_ol.pdf"
OUT = "images/stickers"
SENT = (0, 255, 1)  # sentinel color for flood-filled background


def render(dpi=200):
    page = fitz.open(PDF)[0]
    zoom = dpi / 72
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
    pix.save("_flyer_full.png")
    return Image.open("_flyer_full.png").convert("RGB")


def round_sticker(img, cx, cy, r, out, size=520):
    """Crop a circular sticker (fractions of width/height; r as fraction of width)."""
    W, H = img.size
    cxp, cyp, rp = cx * W, cy * H, r * W
    R = int(rp) + 2
    crop = img.crop((int(cxp - R), int(cyp - R), int(cxp + R), int(cyp + R))).convert("RGBA")
    w, h = crop.size
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).ellipse((w / 2 - rp, h / 2 - rp, w / 2 + rp, h / 2 + rp), fill=255)
    crop.putalpha(mask)
    bb = crop.getbbox()
    if bb:
        crop = crop.crop(bb)
    crop.thumbnail((size, size))
    crop.save(os.path.join(OUT, out))
    print("saved", out, crop.size)


def floodfill_sticker(img, box, out, thresh=70, size=560):
    """Crop a rectangular region and knock out the edge-connected background."""
    W, H = img.size
    x0, y0, x1, y1 = box
    crop = img.crop((int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H))).convert("RGB")
    w, h = crop.size
    seeds = []
    for x in range(0, w, 14):
        seeds += [(x, 1), (x, h - 2)]
    for y in range(0, h, 14):
        seeds += [(1, y), (w - 2, y)]
    for s in seeds:
        try:
            ImageDraw.floodfill(crop, s, SENT, thresh=thresh)
        except Exception:
            pass
    r = crop.convert("RGBA")
    px = r.load()
    for y in range(h):
        for x in range(w):
            if px[x, y][:3] == SENT:
                px[x, y] = (0, 0, 0, 0)
    a = r.split()[3].filter(ImageFilter.GaussianBlur(0.6))
    r.putalpha(a)
    bb = r.getbbox()
    if bb:
        r = r.crop(bb)
    r.thumbnail((size, size))
    r.save(os.path.join(OUT, out))
    print("saved", out, r.size)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    flyer = render()
    # Clean, reliable: round die-cut sticker
    round_sticker(flyer, 0.812, 0.889, 0.107, "have-a-good-dig.png")
    # Others: tune boxes/thresh per sticker, e.g.
    # floodfill_sticker(flyer, (0.50, 0.12, 0.86, 0.275), "dig-area.png", thresh=58)
