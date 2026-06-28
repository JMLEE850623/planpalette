export const STYLES = [
  {
    id: 'japan',
    name: 'Japanese',
    desc: 'Wabi-sabi',
    emoji: '⛩️',
    palette: [
      { name: 'Shiro', oklch: 'oklch(0.97 0.005 80)', label: 'Wall' },
      { name: 'Sumi', oklch: 'oklch(0.18 0.01 250)', label: 'Accent' },
      { name: 'Misu', oklch: 'oklch(0.78 0.04 100)', label: 'Wood' },
      { name: 'Matcha', oklch: 'oklch(0.55 0.1 145)', label: 'Plant' },
      { name: 'Kuri', oklch: 'oklch(0.62 0.06 60)', label: 'Tatami' },
    ],
    keywords: ['minimalist', 'natural', 'zen', 'wooden', 'neutral', 'paper screens', 'low furniture'],
  },
  {
    id: 'korea',
    name: 'Korean',
    desc: 'Modern hanok',
    emoji: '🏯',
    palette: [
      { name: 'Baek', oklch: 'oklch(0.96 0.006 250)', label: 'Wall' },
      { name: 'Cheong', oklch: 'oklch(0.45 0.12 220)', label: 'Accent' },
      { name: 'Hwang', oklch: 'oklch(0.72 0.08 80)', label: 'Wood' },
      { name: 'Hwal', oklch: 'oklch(0.5 0.09 165)', label: 'Celadon' },
      { name: 'Juk', oklch: 'oklch(0.38 0.08 150)', label: 'Bamboo' },
    ],
    keywords: ['elegant', 'celadon', 'hanji', 'understated', 'geometric patterns', 'ondol floor'],
  },
  {
    id: 'black',
    name: 'Black Theme',
    desc: 'Dark luxury',
    emoji: '🖤',
    palette: [
      { name: 'Obsidian', oklch: 'oklch(0.12 0.01 250)', label: 'Wall' },
      { name: 'Charcoal', oklch: 'oklch(0.22 0.01 250)', label: 'Floor' },
      { name: 'Slate', oklch: 'oklch(0.35 0.01 250)', label: 'Surface' },
      { name: 'Gold', oklch: 'oklch(0.72 0.14 85)', label: 'Trim' },
      { name: 'Ivory', oklch: 'oklch(0.92 0.02 90)', label: 'Detail' },
    ],
    keywords: ['dramatic', 'moody', 'luxurious', 'bold contrast', 'metallic accents', 'dark marble'],
  },
  {
    id: 'white',
    name: 'White Theme',
    desc: 'Pure minimal',
    emoji: '🤍',
    palette: [
      { name: 'Pure', oklch: 'oklch(1 0 0)', label: 'Wall' },
      { name: 'Linen', oklch: 'oklch(0.95 0.015 90)', label: 'Soft' },
      { name: 'Pearl', oklch: 'oklch(0.9 0.01 250)', label: 'Surface' },
      { name: 'Fog', oklch: 'oklch(0.82 0.01 250)', label: 'Shadow' },
      { name: 'Warm', oklch: 'oklch(0.88 0.02 80)', label: 'Accent' },
    ],
    keywords: ['airy', 'light-filled', 'serene', 'Scandinavian influence', 'clean lines', 'soft textures'],
  },
  {
    id: 'nordic',
    name: 'Nordic',
    desc: 'Hygge comfort',
    emoji: '🌲',
    palette: [
      { name: 'Snow', oklch: 'oklch(0.96 0.005 210)', label: 'Wall' },
      { name: 'Pine', oklch: 'oklch(0.38 0.08 155)', label: 'Forest' },
      { name: 'Bark', oklch: 'oklch(0.52 0.06 65)', label: 'Wood' },
      { name: 'Wool', oklch: 'oklch(0.82 0.04 75)', label: 'Textile' },
      { name: 'Steel', oklch: 'oklch(0.6 0.03 230)', label: 'Metal' },
    ],
    keywords: ['cozy', 'natural materials', 'warm textiles', 'functional', 'candles', 'raw wood'],
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    desc: 'Coastal warmth',
    emoji: '🌊',
    palette: [
      { name: 'Azure', oklch: 'oklch(0.58 0.18 230)', label: 'Sea' },
      { name: 'Terracotta', oklch: 'oklch(0.58 0.12 40)', label: 'Clay' },
      { name: 'Lime', oklch: 'oklch(0.94 0.02 100)', label: 'Wall' },
      { name: 'Sand', oklch: 'oklch(0.84 0.06 85)', label: 'Floor' },
      { name: 'Olive', oklch: 'oklch(0.5 0.09 130)', label: 'Plant' },
    ],
    keywords: ['warm', 'earthy tones', 'textured walls', 'arched doorways', 'mosaic tiles', 'terracotta pots'],
  },
  {
    id: 'european',
    name: 'European',
    desc: 'Classic elegance',
    emoji: '🏛️',
    palette: [
      { name: 'Ivory', oklch: 'oklch(0.95 0.015 85)', label: 'Wall' },
      { name: 'Gilt', oklch: 'oklch(0.72 0.12 85)', label: 'Trim' },
      { name: 'Sage', oklch: 'oklch(0.6 0.05 150)', label: 'Accent' },
      { name: 'Mahogany', oklch: 'oklch(0.4 0.08 40)', label: 'Wood' },
      { name: 'Slate', oklch: 'oklch(0.45 0.03 250)', label: 'Stone' },
    ],
    keywords: ['ornate mouldings', 'classic European', 'elegant', 'wainscoting', 'crystal chandelier', 'marble', 'antique furniture'],
  },
];

// Curated 2–3 colour combinations the user picks from. `desc` is plain-English
// colour wording (works far better than hex codes inside an image prompt).
export const COLOR_THEMES = [
  { id: 'warm-neutral', name: 'Warm Neutrals', desc: 'cream, soft taupe and warm walnut tones', colors: ['#efe7da', '#c9b39a', '#7d6450'] },
  { id: 'coastal-blue', name: 'Coastal Blue', desc: 'pale sky blue, slate blue and crisp white', colors: ['#dfe9f0', '#5b87a8', '#2f4b63'] },
  { id: 'sage-cream', name: 'Sage & Cream', desc: 'soft sage green with cream and oak', colors: ['#eef0e6', '#9aa888', '#5d6b4e'] },
  { id: 'blush-terra', name: 'Blush Terracotta', desc: 'blush pink, terracotta and warm clay', colors: ['#f3e3da', '#d99a7c', '#a85b43'] },
  { id: 'mono-charcoal', name: 'Charcoal & White', desc: 'crisp white, soft grey and deep charcoal', colors: ['#f5f5f4', '#9a9a98', '#2b2b2b'] },
  { id: 'muted-jewel', name: 'Muted Jewel', desc: 'dusty lavender, plum and deep indigo', colors: ['#e7e1ea', '#7a6b8f', '#3c4a6b'] },
];

// What to render. `overview` views show the whole home; `room` views are
// single-room eye-level shots.
export const VIEWS = [
  { id: 'plan2d', label: '2D Floor Plan', icon: '🗺️', kind: 'overview', camera: 'a top-down 2D architectural floor-plan render, overhead orthographic view, every room furnished and seen from directly above, clean presentation' },
  { id: 'isometric', label: 'Whole Home 3D', icon: '🏠', kind: 'overview', camera: 'an isometric 3D cutaway dollhouse render of the entire home with no ceiling, every room furnished and clearly visible from above at an angle' },
  { id: 'living', label: 'Living Room', icon: '🛋️', kind: 'room' },
  { id: 'kitchen', label: 'Kitchen', icon: '🍳', kind: 'room' },
  { id: 'bedroom', label: 'Bedroom', icon: '🛏️', kind: 'room' },
  { id: 'bathroom', label: 'Bathroom', icon: '🚿', kind: 'room' },
  { id: 'dining', label: 'Dining Room', icon: '🍽️', kind: 'room' },
  { id: 'office', label: 'Home Office', icon: '💻', kind: 'room' },
];

export const ROOMS = [
  { id: 'living', label: 'Living Room', icon: '🛋️' },
  { id: 'bedroom', label: 'Bedroom', icon: '🛏️' },
  { id: 'kitchen', label: 'Kitchen', icon: '🍳' },
  { id: 'bathroom', label: 'Bathroom', icon: '🚿' },
  { id: 'office', label: 'Home Office', icon: '💻' },
  { id: 'dining', label: 'Dining Room', icon: '🍽️' },
];
