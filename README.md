# 🎨 PlanPalette — AI Interior Design Studio

Upload a floor plan, pick a **style**, a **colour theme** and a **view**, and get
AI-rendered interior design concepts — **for free**.

- **Free image generation** via [Pollinations](https://pollinations.ai) — no key, no billing.
- **Optional** [Google Gemini](https://ai.google.dev) (free tier) reads your floor
  plan and writes a richer scene description. The app works fine without it.

> Note: renders are *style references*, not exact reconstructions of your floor
> plan — the free image model paints from a text description, so wall/window
> positions won't match precisely.

## Quick start

```bash
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

That's it — image generation works out of the box via Pollinations, no key needed.

## Optional: enable Gemini floor-plan reading

For descriptions tailored to your actual floor plan, add a free Gemini key:

1. Get a free key at https://ai.google.dev (no credit card).
2. Copy the example env file and paste your key:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env`:
   ```
   VITE_GEMINI_API_KEY=your_key_here
   ```
3. Restart the dev server.

The sidebar shows a green badge when a key is detected.

> The free Gemini tier grants **text** quota only (it can read images), not image
> generation — that's why the actual renders come from Pollinations.

## How it works

```
Floor plan ─► Gemini (optional, free) reads it ─► scene description
                                                      │
                       style + colour theme + view ───┤
                                                      ▼
                                  Pollinations (free) renders the image
```

## Tech

React 19 · Vite · plain CSS (OKLCH colour). No backend.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
