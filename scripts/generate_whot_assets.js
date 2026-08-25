import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

// Fonts for SVG vector text rendering
const fontLuckiest = path.join(process.cwd(), 'public', 'fonts', 'LuckiestGuy-Regular.ttf');
const fontBaloo = path.join(process.cwd(), 'public', 'fonts', 'BalooChettan-Regular.ttf');

const fontFiles = [fontLuckiest, fontBaloo].filter(f => fs.existsSync(f));
const fontOptions = {
  fontFiles,
  loadSystemFonts: true,
  defaultFontFamily: 'Luckiest Guy'
};

console.log('Generating Whot vector SVG game graphics & exporting as Base64 PNGs...');

const base64Assets = {};

// Suit colors
const SUIT_COLORS = {
  circle: '#E74C3C',   // Red
  triangle: '#2ECC71', // Green
  cross: '#3498DB',    // Blue
  square: '#E67E22',   // Orange
  star: '#9B59B6',     // Purple
  whot: '#F1C40F'      // Gold/Yellow
};

/**
 * Render SVG string to a Base64-encoded PNG Data URL
 */
function renderSvgToPngBase64(svgString) {
  const resvg = new Resvg(svgString, {
    font: fontOptions,
    shapeRendering: 2, // geometricPrecision
    textRendering: 1   // optimizeLegibility
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  return `data:image/png;base64,${pngBuffer.toString('base64')}`;
}

/**
 * Generate vector SVG shape element for a suit
 */
function getSuitSvgShape(suit, cx, cy, radius, color) {
  const strokeW = Math.max(1.5, radius / 4);
  if (suit === 'circle') {
    return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${color}" stroke="${color}" stroke-width="${strokeW}"/>`;
  } else if (suit === 'triangle') {
    const p1 = `${cx},${(cy - radius).toFixed(2)}`;
    const p2 = `${(cx + radius).toFixed(2)},${(cy + radius * 0.9).toFixed(2)}`;
    const p3 = `${(cx - radius).toFixed(2)},${(cy + radius * 0.9).toFixed(2)}`;
    return `<polygon points="${p1} ${p2} ${p3}" fill="${color}" stroke="${color}" stroke-width="${strokeW}" stroke-linejoin="round"/>`;
  } else if (suit === 'square') {
    const size = radius * 1.6;
    const x = cx - size / 2;
    const y = cy - size / 2;
    return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${size.toFixed(2)}" height="${size.toFixed(2)}" rx="2" fill="${color}" stroke="${color}" stroke-width="${strokeW}"/>`;
  } else if (suit === 'cross') {
    const w = radius * 0.5;
    const h = radius * 1.5;
    return `
      <g fill="${color}">
        <rect x="${(cx - w / 2).toFixed(2)}" y="${(cy - h / 2).toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}" rx="1.5"/>
        <rect x="${(cx - h / 2).toFixed(2)}" y="${(cy - w / 2).toFixed(2)}" width="${h.toFixed(2)}" height="${w.toFixed(2)}" rx="1.5"/>
      </g>
    `;
  } else if (suit === 'star') {
    const points = 5;
    const outer = radius;
    const inner = radius * 0.5;
    const pts = [];
    for (let i = 0; i < points * 2; i++) {
      const r = (i % 2 === 0) ? outer : inner;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return `<polygon points="${pts.join(' ')}" fill="${color}" stroke="${color}" stroke-width="${strokeW}" stroke-linejoin="round"/>`;
  } else if (suit === 'whot') {
    return `
      <g>
        <circle cx="${cx}" cy="${cy}" r="${radius}" fill="#111111" stroke="#F1C40F" stroke-width="1.5"/>
        <text x="${cx}" y="${(cy + radius * 0.32).toFixed(2)}" font-family="'Luckiest Guy', 'Baloo Chettan', sans-serif" font-size="${Math.round(radius * 0.85)}" font-weight="bold" fill="#F1C40F" text-anchor="middle">20</text>
      </g>
    `;
  }
  return '';
}

// 1. Generate Card Back Vector (48x68 px) with 2.5D Layering
{
  const width = 48;
  const height = 68;
  
  // Diamond grid pattern lines
  const gridLines = [];
  for (let x = -height; x < width + height; x += 6) {
    gridLines.push(`<line x1="${x}" y1="3" x2="${x + height}" y2="${height - 4}"/>`);
    gridLines.push(`<line x1="${x}" y1="${height - 4}" x2="${x + height}" y2="3"/>`);
  }

  const cardBackSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <!-- 2.5D Physical Card Base with Bottom Bevel -->
    <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="3" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.2"/>
    <rect x="0.75" y="0.75" width="${width - 1.5}" height="${height - 2.5}" rx="2.5" fill="#ffffff"/>
    
    <!-- Royal Blue Pattern Body with 2.5D Inset -->
    <clipPath id="cardBackClip">
      <rect x="2.5" y="2.5" width="${width - 5}" height="${height - 6}" rx="2"/>
    </clipPath>
    <rect x="2.5" y="2.5" width="${width - 5}" height="${height - 6}" rx="2" fill="#1e3a8a" stroke="#172554" stroke-width="0.8"/>
    
    <!-- Diamond Grid Pattern -->
    <g clip-path="url(#cardBackClip)" stroke="#3b82f6" stroke-width="1" opacity="0.85">
      ${gridLines.join('\n')}
    </g>
    
    <!-- Center Whot 2.5D Emblem Frame -->
    <rect x="7" y="15" width="${width - 14}" height="${height - 31}" rx="3" fill="#0f172a" stroke="#f1c40f" stroke-width="1.5"/>
    <rect x="8" y="16" width="${width - 16}" height="${height - 33}" rx="2" fill="#1d4ed8"/>
    <text x="${width / 2}" y="${height / 2 + 3.5}" font-family="'Luckiest Guy', 'Baloo Chettan', sans-serif" font-size="10.5" font-weight="bold" fill="#f1c40f" text-anchor="middle">WHOT</text>
  </svg>
  `;

  base64Assets['card_back'] = renderSvgToPngBase64(cardBackSvg);
}

// 1b. Generate 2.5D Card Shadow Asset
{
  const shadowSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="54" height="74" viewBox="0 0 54 74">
    <defs>
      <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.45"/>
        <stop offset="65%" stop-color="#000000" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="27" cy="37" rx="24" ry="33" fill="url(#shadowGrad)"/>
  </svg>
  `;
  base64Assets['card_shadow'] = renderSvgToPngBase64(shadowSvg);
}

// 2. Generate Individual Cards Vector Spec (48x68 px) with 2.5D Card Depth
const DECK_SPEC = {
  circle: [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14],
  triangle: [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14],
  cross: [1, 2, 3, 5, 7, 10, 11, 13, 14],
  square: [1, 2, 3, 5, 7, 10, 11, 13, 14],
  star: [1, 2, 3, 4, 5, 7, 8],
  whot: [20]
};

for (const [suit, numbers] of Object.entries(DECK_SPEC)) {
  for (const num of numbers) {
    const width = 48;
    const height = 68;
    const suitColor = SUIT_COLORS[suit];
    const isDoubleDigit = num >= 10;
    const cornerFontSize = isDoubleDigit ? 15 : 17;
    const cornerY = isDoubleDigit ? 15 : 16;
    const invCornerY = isDoubleDigit ? 12 : 13;

    let centerContent = '';
    if (suit === 'whot') {
      centerContent = `
        <g text-anchor="middle">
          <text x="${width / 2}" y="${height / 2 - 4}" font-family="'Luckiest Guy', 'Baloo Chettan', sans-serif" font-size="11" font-weight="bold" fill="#111111">WHOT</text>
          <text x="${width / 2}" y="${height / 2 + 16}" font-family="'Luckiest Guy', 'Baloo Chettan', sans-serif" font-size="19" font-weight="bold" fill="#F1C40F">20</text>
        </g>
      `;
    } else {
      centerContent = getSuitSvgShape(suit, width / 2, height / 2, 10.5, suitColor);
    }

    const starDoublePointTop = suit === 'star'
      ? `<text x="3.5" y="24" font-family="'Luckiest Guy', 'Baloo Chettan', sans-serif" font-size="8" font-weight="bold" fill="${suitColor}">(${num * 2})</text>`
      : '';
    const starDoublePointBottom = suit === 'star'
      ? `<text x="0" y="21" font-family="'Luckiest Guy', 'Baloo Chettan', sans-serif" font-size="8" font-weight="bold" fill="${suitColor}">(${num * 2})</text>`
      : '';

    const cardSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <!-- 2.5D Physical Card Depth Base -->
      <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="3" fill="#cbd5e1" stroke="#0f172a" stroke-width="1.2"/>
      
      <!-- Card Front Face with Subtle Shading -->
      <rect x="0.75" y="0.75" width="${width - 1.5}" height="${height - 2.5}" rx="2.5" fill="#ffffff"/>
      
      <!-- Top-Left Large Number -->
      <text x="3.5" y="${cornerY}" font-family="'Luckiest Guy', 'Baloo Chettan', sans-serif" font-size="${cornerFontSize}" font-weight="bold" fill="${suitColor}">${num}</text>
      ${starDoublePointTop}
      
      <!-- Bottom-Right Large Number (Inverted) -->
      <g transform="translate(${width - 3.5}, ${height - 4.5}) rotate(180)">
        <text x="0" y="${invCornerY}" font-family="'Luckiest Guy', 'Baloo Chettan', sans-serif" font-size="${cornerFontSize}" font-weight="bold" fill="${suitColor}">${num}</text>
        ${starDoublePointBottom}
      </g>
      
      <!-- Center Suit Symbol -->
      ${centerContent}
    </svg>
    `;

    const cardKey = `card_${suit}_${num}`;
    base64Assets[cardKey] = renderSvgToPngBase64(cardSvg);
  }
}

// 3. Generate WHOT Selection Graphic Modal Vector (320x240 px)
{
  const width = 320;
  const height = 240;

  const suits = ['circle', 'triangle', 'cross', 'square', 'star'];
  const names = ['CIRCLE', 'TRIANGLE', 'CROSS', 'SQUARE', 'STAR'];
  const keys = ['[1]', '[2]', '[3]', '[4]', '[5]'];

  const suitButtonsSvg = suits.map((s, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);

    let cx, cy;
    if (row === 0) {
      cx = 58 + col * 102;
      cy = 72;
    } else {
      cx = 110 + (idx - 3) * 100;
      cy = 124;
    }

    const boxX = cx - 39;
    const boxY = cy - 21;
    const boxW = 78;
    const boxH = 42;
    const color = SUIT_COLORS[s];

    return `
      <!-- Suit Item Box -->
      <g>
        <rect x="${boxX}" y="${boxY}" width="${boxW}" height="${boxH}" rx="4" fill="#1e293b" stroke="${color}" stroke-width="2"/>
        ${getSuitSvgShape(s, cx, cy - 6, 10, color)}
        <text x="${cx}" y="${cy + 14}" font-family="'Luckiest Guy', 'Baloo Chettan', sans-serif" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">${names[idx]}</text>
        <text x="${cx - 26}" y="${cy - 9}" font-family="'Luckiest Guy', 'Baloo Chettan', sans-serif" font-size="9" font-weight="bold" fill="#F1C40F" text-anchor="middle">${keys[idx]}</text>
      </g>
    `;
  }).join('\n');

  const modalSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <!-- Compact modal window backdrop (top Y=10 to Y=162) -->
    <rect x="8" y="10" width="${width - 16}" height="152" rx="4" fill="#0f172a" fill-opacity="0.96" stroke="#F1C40F" stroke-width="2"/>
    
    <!-- Banner Title Header -->
    <rect x="16" y="16" width="${width - 32}" height="26" rx="3" fill="#F1C40F"/>
    <text x="${width / 2}" y="33.5" font-family="'Luckiest Guy', 'Baloo Chettan', sans-serif" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">I NEED... SELECT CARD SUIT</text>
    
    <!-- 5 Suit Buttons -->
    ${suitButtonsSvg}
    
    <!-- Footer instructions inside modal -->
    <text x="${width / 2}" y="153" font-family="'Luckiest Guy', 'Baloo Chettan', sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">Use 1-5 or D-Pad / Touch to Select</text>
  </svg>
  `;

  base64Assets['whot_selector_modal'] = renderSvgToPngBase64(modalSvg);
}

// 4. Generate Suit Icons (Individual 32x32 Vector SVG textures)
const suitsList = ['circle', 'triangle', 'cross', 'square', 'star', 'whot'];
suitsList.forEach((s) => {
  const size = 32;
  const suitSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    ${getSuitSvgShape(s, size / 2, size / 2, 10, SUIT_COLORS[s])}
  </svg>
  `;

  base64Assets[`suit_${s}`] = renderSvgToPngBase64(suitSvg);
});
console.log('Saved individual suit icon graphics.');

// 5. Generate Switch Toggle Images (toggle_on and toggle_off, 44x22 px)
{
  const toggleW = 44;
  const toggleH = 22;

  const toggleOnSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${toggleW}" height="${toggleH}" viewBox="0 0 ${toggleW} ${toggleH}">
    <defs>
      <filter id="shadowOn" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.3"/>
      </filter>
    </defs>
    <!-- Green track -->
    <rect x="1" y="1" width="${toggleW - 2}" height="${toggleH - 2}" rx="10" fill="#10B981" stroke="#059669" stroke-width="1.5"/>
    <text x="13" y="14.5" font-family="'Luckiest Guy', 'Baloo Chettan', sans-serif" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">ON</text>
    <!-- White Knob -->
    <circle cx="32" cy="11" r="7.5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" filter="url(#shadowOn)"/>
    <circle cx="32" cy="11" r="3" fill="#10B981" opacity="0.6"/>
  </svg>
  `;

  const toggleOffSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${toggleW}" height="${toggleH}" viewBox="0 0 ${toggleW} ${toggleH}">
    <defs>
      <filter id="shadowOff" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.3"/>
      </filter>
    </defs>
    <!-- Dark slate track -->
    <rect x="1" y="1" width="${toggleW - 2}" height="${toggleH - 2}" rx="10" fill="#334155" stroke="#475569" stroke-width="1.5"/>
    <text x="31" y="14.5" font-family="'Luckiest Guy', 'Baloo Chettan', sans-serif" font-size="8.5" font-weight="bold" fill="#94a3b8" text-anchor="middle">OFF</text>
    <!-- Knob -->
    <circle cx="12" cy="11" r="7.5" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1" filter="url(#shadowOff)"/>
    <circle cx="12" cy="11" r="3" fill="#64748b" opacity="0.5"/>
  </svg>
  `;

  base64Assets['toggle_on'] = renderSvgToPngBase64(toggleOnSvg);
  base64Assets['toggle_off'] = renderSvgToPngBase64(toggleOffSvg);
}
console.log('Saved toggle switch graphics.');

// Write base64Assets JSON
const base64JsonPath = path.join(process.cwd(), 'public', 'assets_base64.json');
fs.writeFileSync(base64JsonPath, JSON.stringify(base64Assets, null, 2));
console.log(`Saved assets_base64.json with ${Object.keys(base64Assets).length} vector-rendered assets successfully!`);

console.log('Whot vector graphics generation complete!');
