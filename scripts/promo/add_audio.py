#!/usr/bin/env python3
"""Add Piper narration + a synthesized ambient music bed to the promo video.

Usage: python add_audio.py <ffmpeg.exe> <piper.exe> <voice.onnx> <video_in> <work> <out_mp4>
"""
import os, sys, subprocess

FFMPEG, PIPER, VOICE, VIN, WORK, OUT = sys.argv[1:7]
os.makedirs(WORK, exist_ok=True)

# (start_seconds, line) — timed to the promo's segments
LINES = [
    (0.25,  "Meet PlanPalette. An AI interior design studio."),
    (5.25,  "Upload your floor plan."),
    (8.25,  "Pick a style. Japanese, Korean, Nordic, and more."),
    (12.85, "Choose a colour theme, and the view you want."),
    (16.65, "Generate whole home renders,"),
    (19.65, "or a detailed three D walkthrough."),
    (23.05, "With custom colour palettes, tuned to your taste."),
    (27.05, "Beautiful concepts, in seconds."),
    (30.25, "PlanPalette. Free, and open source."),
]

def run(args, **kw):
    r = subprocess.run([FFMPEG, "-y", "-hide_banner", "-loglevel", "error", *args], **kw)
    if r.returncode != 0:
        raise SystemExit("ffmpeg failed: " + " ".join(args))

# 1) Piper narration, one wav per line
vo_files = []
for i, (_, text) in enumerate(LINES):
    out = f"{WORK}/vo_{i}.wav"
    r = subprocess.run([PIPER, "--model", VOICE, "--output_file", out],
                       input=text, text=True)
    if r.returncode != 0 or not os.path.exists(out):
        raise SystemExit(f"piper failed on line {i}")
    vo_files.append(out)
print("  narration generated")

# 2) Ambient music bed (C major pad) — fully synthesized, license-free
music = f"{WORK}/music.wav"
run(["-f", "lavfi", "-i", "sine=frequency=261.63:duration=35",
     "-f", "lavfi", "-i", "sine=frequency=329.63:duration=35",
     "-f", "lavfi", "-i", "sine=frequency=392.00:duration=35",
     "-f", "lavfi", "-i", "sine=frequency=523.25:duration=35",
     "-filter_complex",
     "[0][1][2][3]amix=inputs=4:duration=longest,"
     "tremolo=f=0.18:d=0.4,lowpass=f=850,aecho=0.8:0.88:900:0.3,"
     "volume=-22dB,afade=t=in:st=0:d=2.5,afade=t=out:st=31:d=3.5[a]",
     "-map", "[a]", "-ac", "1", music])
print("  music bed generated")

# 3) Mix narration (delayed) + music, then mux onto the video
inputs = ["-i", VIN]
for f in vo_files:
    inputs += ["-i", f]
inputs += ["-i", music]

n = len(vo_files)
fc = []
for i, (start, _) in enumerate(LINES):
    ms = int(start * 1000)
    fc.append(f"[{i+1}:a]adelay={ms}|{ms}[d{i}]")
mixv = "".join(f"[d{i}]" for i in range(n))
fc.append(f"{mixv}amix=inputs={n}:normalize=0[vo]")
fc.append("[vo]volume=2.2[vob]")
fc.append(f"[{n+1}:a]volume=1.0[mus]")
fc.append("[vob][mus]amix=inputs=2:normalize=0:duration=longest[mix]")
filtergraph = ";".join(fc)

run([*inputs, "-filter_complex", filtergraph,
     "-map", "0:v", "-map", "[mix]",
     "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ac", "2",
     "-shortest", "-movflags", "+faststart", OUT])
print(f"DONE -> {OUT}")
