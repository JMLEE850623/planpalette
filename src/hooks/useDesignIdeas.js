import { useState, useCallback } from 'react';
import { MOCK_IDEAS } from '../data/mockIdeas';
import { STYLES, VIEWS } from '../data/styles';
import { describeScene, hasGeminiKey } from '../services/gemini';
import { fetchImage, imageUrl } from '../services/pollinations';

// Eye-level angles for single-room views.
const ROOM_ANGLES = [
  { suffix: 'Concept A', angle: 'wide eye-level view from the room entrance', mood: 'Bright', lighting: 'natural daylight', seed: 11 },
  { suffix: 'Concept B', angle: 'cozy corner view of the main seating or feature area', mood: 'Cozy', lighting: 'warm ambient', seed: 22 },
  { suffix: 'Concept C', angle: 'view toward the main window with soft shadows', mood: 'Serene', lighting: 'soft indirect', seed: 33 },
];

// Whole-home views vary by lighting/seed only (camera is fixed by the view).
const OVERVIEW_VARIANTS = [
  { suffix: 'Variation 1', mood: 'Bright', lighting: 'bright even', seed: 11 },
  { suffix: 'Variation 2', mood: 'Warm', lighting: 'warm', seed: 22 },
];

const titleCase = s => s.replace(/\b\w/g, m => m.toUpperCase());

function templateDescription(styleObj, view, theme) {
  const subject = view.kind === 'overview' ? `home (${view.label})` : view.label.toLowerCase();
  return `Photorealistic interior render of a ${subject} in ${styleObj.name} style (${styleObj.desc}), featuring ${styleObj.keywords.join(', ')}, in a ${theme.desc} colour palette, fully furnished with realistic materials and lighting`;
}

// Generate one image, retrying with a different seed, then falling back to the
// raw URL (an <img> can still load it even if a CORS fetch is blocked).
async function renderImage(prompt, seed) {
  try {
    return await fetchImage(prompt, { seed });
  } catch {
    try {
      return await fetchImage(prompt, { seed: seed + 100 });
    } catch {
      return imageUrl(prompt, { seed });
    }
  }
}

function mockIdeas(style, viewLabel) {
  return (MOCK_IDEAS[style] || MOCK_IDEAS.japan).map((idea, i) => ({
    ...idea,
    id: `mock-${i}`,
    room: viewLabel,
    image: null,
  }));
}

export function useDesignIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateIdeas = useCallback(async ({ floorPlanBase64, floorPlanMime, style, theme, view }) => {
    setLoading(true);
    setError(null);

    const styleObj = STYLES.find(s => s.id === style) || STYLES[0];
    const viewObj = VIEWS.find(v => v.id === view) || VIEWS[0];
    const themeObj = theme; // resolved {name, desc, colors} passed in from App
    const notes = [];

    // 1. Base scene description — let the free Gemini text model read the plan
    //    when possible, otherwise fall back to a template.
    let base = templateDescription(styleObj, viewObj, themeObj);
    if (hasGeminiKey()) {
      try {
        const instruction = [
          floorPlanBase64
            ? 'Look at this floor plan and describe a photorealistic interior render based on it.'
            : 'Describe a photorealistic interior render.',
          viewObj.kind === 'overview'
            ? `Show ${viewObj.camera}, keeping the room layout faithful to the floor plan.`
            : `Focus on the ${viewObj.label}.`,
          `Design style: ${styleObj.name} (${styleObj.desc}) — ${styleObj.keywords.join(', ')}.`,
          `Colour palette: ${themeObj.name} — ${themeObj.desc}.`,
          'Write ONE vivid English paragraph under 70 words covering layout, furniture, materials and lighting. Output ONLY the description, no preamble.',
        ].join(' ');
        base = await describeScene({ floorPlanBase64, floorPlanMime, instruction });
      } catch (e) {
        notes.push(`Gemini analysis skipped (${e.message})`);
      }
    }

    // 2. Render each variation with Pollinations (free). Sequential keeps the
    //    free tier from throttling/dropping concurrent requests.
    const variants = viewObj.kind === 'overview' ? OVERVIEW_VARIANTS : ROOM_ANGLES;
    try {
      const built = [];
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        const camera = viewObj.kind === 'overview' ? viewObj.camera : v.angle;
        const prompt = `${base}. Render as ${camera}. Colour palette: ${themeObj.desc}. ${v.lighting} lighting, ${styleObj.name} interior design, photorealistic, high detail, no text, no labels, no watermark`;
        try {
          const image = await renderImage(prompt, v.seed);
          built.push({
            id: `render-${i}`,
            image,
            title: `${styleObj.name} · ${v.suffix}`,
            description: base.length > 220 ? `${base.slice(0, 217)}…` : base,
            palette: themeObj.colors,
            materials: styleObj.keywords.slice(0, 4).map(titleCase),
            style: styleObj.name,
            view: viewObj.label,
            mood: v.mood,
            lighting: titleCase(v.lighting),
            room: viewObj.label,
            themeName: themeObj.name,
          });
        } catch {
          notes.push(`render ${i + 1} failed`);
        }
      }

      if (built.length === 0) throw new Error('All renders failed — Pollinations may be busy, try again');
      if (notes.length) setError(notes.join(' · '));
      setIdeas(built);
    } catch (err) {
      setError(`${err.message} · Showing demo ideas instead.`);
      setIdeas(mockIdeas(style, viewObj.label));
    } finally {
      setLoading(false);
    }
  }, []);

  return { ideas, loading, error, generateIdeas, setIdeas };
}
