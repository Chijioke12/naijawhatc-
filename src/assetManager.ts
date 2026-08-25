// Asset Manager for KaiOS / Web
// Supports pre-rendered PNG assets from assets_base64.json and vector SVG Base64 fallbacks

let asyncAssets: Record<string, string> = {};
const assetCache: Record<string, string> = {};

// Load pre-rendered PNG assets
if (typeof window !== 'undefined') {
  fetch('./assets_base64.json')
    .then(r => {
      if (r.ok) return r.json();
      throw new Error('No assets_base64.json');
    })
    .then(data => {
      if (data && typeof data === 'object') {
        asyncAssets = data;
        console.log('[assetManager] Loaded pre-rendered PNG assets from assets_base64.json');
      }
    })
    .catch(() => {});
}

// Nigerian Whot Standard Suit Colors
const SUIT_COLORS: Record<string, string> = {
  circle: '#dc2626',   // Red
  triangle: '#16a34a', // Green
  cross: '#2563eb',    // Blue
  square: '#d97706',   // Orange
  star: '#9333ea',     // Purple
  whot: '#b45309'      // Gold / Brown
};

function renderSuitSvgPath(suit: string, cx: number, cy: number, size: number, color: string): string {
  const half = size / 2;
  switch (suit) {
    case 'circle':
      return `<circle cx="${cx}" cy="${cy}" r="${half * 0.9}" fill="${color}"/>`;
    case 'triangle':
      return `<polygon points="${cx},${cy - half} ${cx + half},${cy + half} ${cx - half},${cy + half}" fill="${color}"/>`;
    case 'cross': {
      const t = size * 0.28;
      return `<rect x="${cx - t/2}" y="${cy - half}" width="${t}" height="${size}" rx="2" fill="${color}"/><rect x="${cx - half}" y="${cy - t/2}" width="${size}" height="${t}" rx="2" fill="${color}"/>`;
    }
    case 'square':
      return `<rect x="${cx - half * 0.85}" y="${cy - half * 0.85}" width="${size * 0.85}" height="${size * 0.85}" rx="3" fill="${color}"/>`;
    case 'star': {
      const rOuter = half;
      const rInner = half * 0.45;
      let pts = '';
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? rOuter : rInner;
        const angle = (i * 36 - 90) * (Math.PI / 180);
        pts += `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)} `;
      }
      return `<polygon points="${pts.trim()}" fill="${color}"/>`;
    }
    case 'whot':
      return `<circle cx="${cx}" cy="${cy}" r="${half * 0.95}" fill="#1e3a8a"/><text x="${cx}" y="${cy + 5}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="${size * 0.35}" fill="#facc15" text-anchor="middle">WHOT</text>`;
    default:
      return '';
  }
}

export function encodeSvgDataUri(svgString: string): string {
  try {
    if (typeof btoa === 'function') {
      return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
    }
  } catch {}
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

// Generate Card SVG String
function generateCardSvgString(suit: string, number: number): string {
  const isWhot = suit === 'whot' || number === 20;
  const color = isWhot ? '#b45309' : (SUIT_COLORS[suit] || '#1e293b');
  const numStr = number.toString();
  const subText = number === 1 ? '(HOLD ON)' : number === 2 ? '(PICK 2)' : number === 5 ? '(PICK 3)' : number === 8 ? '(SUSPEND)' : number === 14 ? '(GEN MKT)' : '';

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 170" width="120" height="170">
  <defs>
    <linearGradient id="cardBg_${suit}_${number}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="116" height="166" rx="9" fill="url(#cardBg_${suit}_${number})" stroke="#cbd5e1" stroke-width="2"/>
  
  <!-- Corner Top-Left -->
  <text x="12" y="24" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="20" fill="${color}">${numStr}</text>
  ${!isWhot ? renderSuitSvgPath(suit, 18, 38, 14, color) : ''}
  
  <!-- Corner Bottom-Right (Rotated) -->
  <g transform="rotate(180 106 146)">
    <text x="96" y="156" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="20" fill="${color}">${numStr}</text>
    ${!isWhot ? renderSuitSvgPath(suit, 102, 132, 14, color) : ''}
  </g>

  <!-- Center Symbol -->
  ${isWhot 
    ? `<circle cx="60" cy="85" r="38" fill="#1e3a8a" stroke="#facc15" stroke-width="4"/>
       <text x="60" y="80" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="20" fill="#facc15" text-anchor="middle">WHOT</text>
       <text x="60" y="104" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="22" fill="#ffffff" text-anchor="middle">20</text>`
    : `${renderSuitSvgPath(suit, 60, 85, 48, color)}
       ${subText ? `<text x="60" y="125" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="10" fill="${color}" text-anchor="middle">${subText}</text>` : ''}`
  }
</svg>`.trim();
}

function generateCardBackSvgString(): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 170" width="120" height="170">
  <defs>
    <pattern id="cardBackPattern" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="16" height="16" fill="#1e3a8a"/>
      <rect x="0" y="0" width="8" height="8" fill="#1d4ed8"/>
      <rect x="8" y="8" width="8" height="8" fill="#1d4ed8"/>
      <path d="M0 0h16v16H0z" fill="none" stroke="#3b82f6" stroke-width="0.5"/>
    </pattern>
  </defs>
  <rect x="2" y="2" width="116" height="166" rx="9" fill="#172554" stroke="#e2e8f0" stroke-width="2.5"/>
  <rect x="8" y="8" width="104" height="154" rx="6" fill="url(#cardBackPattern)"/>
  <rect x="26" y="55" width="68" height="60" rx="6" fill="#1e3a8a" stroke="#facc15" stroke-width="2.5"/>
  <text x="60" y="91" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="16" fill="#facc15" text-anchor="middle" letter-spacing="1">WHOT</text>
</svg>`.trim();
}

export function getCardImage(suit: string, number: number): string {
  const key = `card_${suit}_${number}`;
  if (asyncAssets[key]) return asyncAssets[key];
  if (assetCache[key]) return assetCache[key];

  const svgStr = generateCardSvgString(suit, number);
  const dataUrl = encodeSvgDataUri(svgStr);
  assetCache[key] = dataUrl;
  return dataUrl;
}

export function getCardBackImage(): string {
  const key = 'card_back';
  if (asyncAssets[key]) return asyncAssets[key];
  if (assetCache[key]) return assetCache[key];

  const svgStr = generateCardBackSvgString();
  const dataUrl = encodeSvgDataUri(svgStr);
  assetCache[key] = dataUrl;
  return dataUrl;
}

export function getSuitIcon(suit: string): string {
  const key = `suit_${suit}`;
  if (asyncAssets[key]) return asyncAssets[key];
  if (assetCache[key]) return assetCache[key];

  const color = SUIT_COLORS[suit] || '#facc15';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">${renderSuitSvgPath(suit, 16, 16, 26, color)}</svg>`;
  const dataUrl = encodeSvgDataUri(svg);
  assetCache[key] = dataUrl;
  return dataUrl;
}

export function getToggleImage(enabled: boolean): string {
  const key = enabled ? 'toggle_on' : 'toggle_off';
  if (asyncAssets[key]) return asyncAssets[key];
  if (assetCache[key]) return assetCache[key];

  const color = enabled ? '#22c55e' : '#64748b';
  const label = enabled ? 'ON' : 'OFF';
  const cx = enabled ? 34 : 14;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 24" width="48" height="24">
  <rect width="48" height="24" rx="12" fill="${color}"/>
  <circle cx="${cx}" cy="12" r="9" fill="#ffffff" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.4))"/>
  <text x="${enabled ? 16 : 32}" y="16" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="9" fill="#ffffff" text-anchor="middle">${label}</text>
</svg>`.trim();
  const dataUrl = encodeSvgDataUri(svg);
  assetCache[key] = dataUrl;
  return dataUrl;
}

export const ICON_GEAR = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#facc15" stroke="#854d0e" stroke-width="1.5"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path fill-rule="evenodd" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" clip-rule="evenodd"/></svg>')}`;

export const ICON_LIGHTNING = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>')}`;

export const ICON_CHAT = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f8fafc" stroke="#0f172a" stroke-width="1.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>')}`;

export const ICON_WARNING = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f59e0b" stroke="#78350f" stroke-width="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01"/></svg>')}`;

export const ICON_PAUSE = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#facc15" stroke="#78350f" stroke-width="1.5"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>')}`;

export const ICON_TROPHY = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#facc15" stroke="#854d0e" stroke-width="1.5"><path d="M8 21h8m-4-4v4M6 3h12v5a6 6 0 01-12 0V3z"/><path d="M6 5H4a2 2 0 00-2 2v1a4 4 0 004 4M18 5h2a2 2 0 012 2v1a4 4 0 01-4 4"/></svg>')}`;

export const ICON_ROBOT = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#38bdf8" stroke="#0f172a" stroke-width="1.5"><rect x="4" y="8" width="16" height="12" rx="2"/><circle cx="9" cy="13" r="1.5" fill="#0f172a"/><circle cx="15" cy="13" r="1.5" fill="#0f172a"/><path d="M12 2v6M9 18h6M2 13h2m16 0h2"/></svg>')}`;
