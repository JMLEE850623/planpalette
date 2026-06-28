// Google Gemini text service (free tier via https://ai.google.dev).
// The free tier does NOT grant image-generation quota (Nano Banana = 0/day),
// but the text models DO have a free quota and can read images. So we use the
// free text model to "look at" the uploaded floor plan and write a vivid scene
// description, which is then handed to Pollinations for the actual render.

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const TEXT_MODEL = 'gemini-2.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent`;

export function hasGeminiKey() {
  return Boolean(API_KEY && API_KEY.trim());
}

/**
 * Read the floor plan + design brief and return a single vivid prompt paragraph.
 * @returns {Promise<string>}
 */
export async function describeScene({ floorPlanBase64, floorPlanMime, instruction }) {
  if (!hasGeminiKey()) throw new Error('Missing VITE_GEMINI_API_KEY');

  const parts = [];
  if (floorPlanBase64) {
    parts.push({
      inline_data: { mime_type: floorPlanMime || 'image/jpeg', data: floorPlanBase64 },
    });
  }
  parts.push({ text: instruction });

  const res = await fetch(`${ENDPOINT}?key=${API_KEY.trim()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts }] }),
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      msg = err.error?.message || msg;
    } catch {
      // body wasn't JSON — keep the status
    }
    throw new Error(msg);
  }

  const data = await res.json();
  const text = (data?.candidates?.[0]?.content?.parts || [])
    .map(p => p.text)
    .filter(Boolean)
    .join(' ')
    .trim();

  if (!text) {
    const reason = data?.candidates?.[0]?.finishReason || data?.promptFeedback?.blockReason;
    throw new Error(reason ? `No description (${reason})` : 'No description returned');
  }
  return text;
}
