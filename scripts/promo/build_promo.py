#!/usr/bin/env python3
"""Build the PlanPalette promo video with PIL (title cards) + ffmpeg (Ken Burns + concat).

Usage: python build_promo.py <ffmpeg.exe> <assets_dir> <work_dir> <out_mp4>
"""
import os, sys, subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter

FFMPEG, ASSETS, WORK, OUT = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
W, H, FPS = 1280, 720, 30
os.makedirs(WORK, exist_ok=True)

FONT_BOLD = "C:/Windows/Fonts/arialbd.ttf"
FONT_REG = "C:/Windows/Fonts/segoeui.ttf"
ACCENT = (96, 150, 230)
INK = (245, 245, 244)
SUB = (170, 185, 215)

def font(path, size):
    return ImageFont.truetype(path, size)

def gradient_bg(c_top=(15, 22, 42), c_bot=(28, 37, 64)):
    img = Image.new("RGB", (W, H), c_top)
    px = img.load()
    for y in range(H):
        t = y / (H - 1)
        col = tuple(int(c_top[i] + (c_bot[i] - c_top[i]) * t) for i in range(3))
        for x in range(W):
            px[x, y] = col
    return img

def center_text(draw, cx, y, text, fnt, fill):
    bb = draw.textbbox((0, 0), text, font=fnt)
    w = bb[2] - bb[0]
    draw.text((cx - w / 2, y), text, font=fnt, fill=fill)
    return bb[3] - bb[1]

def make_card(path, title, subtitle=None, kicker=None, footer=None):
    img = gradient_bg()
    d = ImageDraw.Draw(img)
    # accent bar
    d.rectangle([0, 0, W, 6], fill=ACCENT)
    cy = H // 2
    if kicker:
        center_text(d, W / 2, cy - 150, kicker.upper(), font(FONT_REG, 26), ACCENT)
    # title may be multi-line (split on |)
    lines = title.split("|")
    ty = cy - 70 - (len(lines) - 1) * 35
    for ln in lines:
        center_text(d, W / 2, ty, ln, font(FONT_BOLD, 70), INK)
        ty += 90
    if subtitle:
        center_text(d, W / 2, ty + 6, subtitle, font(FONT_REG, 34), SUB)
    if footer:
        center_text(d, W / 2, H - 90, footer, font(FONT_REG, 28), SUB)
    img.save(path)

def make_caption(src, path, name, tag):
    img = Image.open(src).convert("RGB").resize((W, H))
    # darken bottom for legibility
    overlay = Image.new("RGB", (W, 200), (0, 0, 0))
    grad = Image.new("L", (1, 200), 0)
    for y in range(200):
        grad.putpixel((0, y), int(180 * (y / 199)))
    mask = grad.resize((W, 200))
    img.paste(overlay, (0, H - 200), mask)
    d = ImageDraw.Draw(img)
    d.rectangle([60, H - 118, 66, H - 70], fill=ACCENT)
    d.text((84, H - 122), name, font=font(FONT_BOLD, 40), fill=INK)
    d.text((86, H - 70), tag, font=font(FONT_REG, 26), fill=SUB)
    img.save(path)

def run(args):
    r = subprocess.run([FFMPEG, "-y", "-hide_banner", "-loglevel", "error", *args])
    if r.returncode != 0:
        raise SystemExit(f"ffmpeg failed: {' '.join(args)}")

def seg_from_image(img_path, out_path, dur, zoom_in=True):
    frames = int(dur * FPS)
    # pre-scale up so zoompan has headroom (crisp Ken Burns)
    if zoom_in:
        z = "min(zoom+0.0010,1.12)"
    else:
        z = "if(eq(on,0),1.12,max(zoom-0.0010,1.0))"
    vf = (
        f"scale=1920:-1,"
        f"zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':"
        f"d={frames}:s={W}x{H}:fps={FPS},"
        f"format=yuv420p,fade=t=in:st=0:d=0.4,fade=t=out:st={dur-0.4:.2f}:d=0.4"
    )
    run(["-loop", "1", "-i", img_path, "-t", f"{dur}", "-vf", vf,
         "-r", str(FPS), "-c:v", "libx264", "-preset", "medium", "-crf", "20",
         "-pix_fmt", "yuv420p", "-an", out_path])

# ---- build cards ----
c_intro = f"{WORK}/c_intro.png";  make_card(c_intro, "PlanPalette", "AI Interior Design Studio", kicker="floor plan to render", footer="free  ·  no required keys")
c_tag = f"{WORK}/c_tag.png";      make_card(c_tag, "Upload a floor plan|Pick style, colour & view", "AI does the rest")
c_feat = f"{WORK}/c_feat.png";    make_card(c_feat, "Whole-home 3D|Single rooms", "Custom OKLCH colour palettes")
c_outro = f"{WORK}/c_outro.png";  make_card(c_outro, "PlanPalette", "Free & open source", kicker="try it", footer="github.com/JMLEE850623/planpalette")

# ---- build captioned showcase frames ----
cap = lambda key, name, tag: (lambda p: (make_caption(f"{ASSETS}/{key}.jpg", p, name, tag) or p))(f"{WORK}/{key}.png")
s_jp = cap("1_japanese", "Japanese", "Warm Neutrals")
s_kr = cap("2_korean", "Korean", "Coastal Blue")
s_eu = cap("3_european", "European", "Sage & Cream")
s_iso = cap("4_isometric", "Whole-home 3D", "Isometric view")
s_no = cap("5_nordic", "Nordic", "Blush Terracotta")

# ---- timeline ----
timeline = [
    (c_intro, 5.0, "card"),
    (s_jp, 3.0, "in"),
    (s_kr, 4.6, "out"),
    (c_tag, 3.8, "card"),
    (s_eu, 3.0, "in"),
    (s_iso, 3.4, "out"),
    (c_feat, 4.0, "card"),
    (s_no, 3.2, "in"),
    (c_outro, 4.0, "card"),
]

seg_paths = []
for i, (img, dur, kind) in enumerate(timeline):
    out = f"{WORK}/seg_{i:02d}.mp4"
    seg_from_image(img, out, dur, zoom_in=(kind != "out"))
    seg_paths.append(out)
    print(f"  segment {i} ({dur}s) done")

# ---- concat ----
listfile = f"{WORK}/list.txt"
with open(listfile, "w") as f:
    for p in seg_paths:
        f.write(f"file '{p}'\n")
run(["-f", "concat", "-safe", "0", "-i", listfile,
     "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
     "-movflags", "+faststart", OUT])
print(f"DONE -> {OUT}")
