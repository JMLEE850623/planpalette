// Pollinations.ai — free, no-key, no-billing text-to-image generation.
// Used for the actual interior renders (Gemini's free tier can't generate images).

const BASE = 'https://image.pollinations.ai/prompt/';

export function imageUrl(prompt, { seed = 0, width = 1024, height = 768 } = {}) {
  const params = new URLSearchParams({
    width: String(width),
    height: String(height),
    seed: String(seed),
    model: 'flux',
    nologo: 'true',
  });
  return `${BASE}${encodeURIComponent(prompt)}?${params.toString()}`;
}

/**
 * Fetch the generated image as a blob URL so it displays instantly and can be
 * downloaded. Throws on failure — callers can fall back to imageUrl() (which an
 * <img> tag can still load even if a CORS fetch is blocked).
 * @returns {Promise<string>} object URL
 */
export async function fetchImage(prompt, opts = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);
  try {
    const res = await fetch(imageUrl(prompt, opts), { signal: controller.signal });
    if (!res.ok) throw new Error(`Pollinations HTTP ${res.status}`);
    const blob = await res.blob();
    if (!blob.type.startsWith('image/')) throw new Error('Pollinations returned a non-image response');
    return URL.createObjectURL(blob);
  } finally {
    clearTimeout(timer);
  }
}
