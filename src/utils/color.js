// Minimal sRGB-hex → OKLCH conversion (Björn Ottosson's OKLab) plus a helper
// that builds a cohesive palette from a single user-picked colour, working in
// OKLCH so the derived tones stay perceptually balanced.

function srgbToLinear(c) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function hexToOklch(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex || '').trim());
  if (!m) return { L: 0.7, C: 0.05, H: 250 };
  const int = parseInt(m[1], 16);
  const r = srgbToLinear((int >> 16) & 255);
  const g = srgbToLinear((int >> 8) & 255);
  const b = srgbToLinear(int & 255);

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m2 = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const L = 0.2104542553 * l + 0.793617785 * m2 - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m2 + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m2 - 0.808675766 * s;

  const C = Math.sqrt(a * a + bb * bb);
  let H = (Math.atan2(bb, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H };
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const oklch = (L, C, H) => `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${((H % 360) + 360) % 360})`;

// Rough plain-English hue name (used inside the image prompt).
export function hueName(H, C) {
  if (C < 0.03) return 'neutral grey';
  const names = [[20, 'red'], [50, 'orange'], [95, 'yellow'], [150, 'green'], [200, 'teal'], [260, 'blue'], [310, 'purple'], [345, 'magenta'], [360, 'red']];
  return names.find(([deg]) => H <= deg)?.[1] || 'colour';
}

/**
 * Build a 4-colour palette from one base colour: a soft tint, the base, an
 * analogous accent and a deep grounding tone — returned in the same shape as
 * the preset COLOR_THEMES so it flows through the rest of the app unchanged.
 */
export function buildOklchPalette(baseHex) {
  const { L, C, H } = hexToOklch(baseHex);
  const base = clamp(L, 0.35, 0.78);
  const chroma = clamp(C, 0.04, 0.16);
  const accentH = H + 150; // analogous-complementary accent

  const colors = [
    oklch(0.95, Math.min(chroma, 0.025), H),       // soft tint
    oklch(base, chroma, H),                          // the chosen colour
    oklch(clamp(base + 0.05, 0.4, 0.7), chroma * 0.9, accentH), // accent
    oklch(0.32, chroma * 0.7, H),                    // deep grounding tone
  ];

  const name = hueName(H, C);
  return {
    id: 'custom',
    name: 'Custom',
    desc: `a custom palette built around ${name} (${baseHex}) with soft tints, an analogous accent and a deep grounding tone`,
    colors,
  };
}
