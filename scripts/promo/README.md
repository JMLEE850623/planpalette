# Promo video builder

Builds the PlanPalette promo clip with **PIL** (title cards) + **ffmpeg**
(Ken Burns pan/zoom + concat), then adds **Piper** offline narration and a
synthesized, license-free ambient music bed. No GPU and no paid APIs.

## Requirements
- Python 3 with `pillow` (`pip install pillow`)
- `ffmpeg` / `ffprobe` on your system (or pass a portable build's path)
- [Piper](https://github.com/rhasspy/piper) binary + a voice model
  (e.g. `en_US-amy-medium.onnx` + `.onnx.json`) — only for the narrated version

## Build

1. Showcase images live in `assets/` (1280×720 interior renders). Replace them
   to change what's shown.

2. Render the silent base video:
   ```bash
   python build_promo.py <ffmpeg> ./assets ./work ./promo.mp4
   ```

3. Add narration + music:
   ```bash
   python add_audio.py <ffmpeg> <piper> <voice.onnx> ./promo.mp4 ./work_audio ./promo_v2.mp4
   ```

Edit the `timeline` in `build_promo.py` (segment durations) and `LINES` in
`add_audio.py` (narration text + timing) together — each spoken line must fit
inside its segment.

> Font paths in `build_promo.py` point at Windows fonts (`arialbd.ttf`,
> `segoeui.ttf`); change them on other platforms.
