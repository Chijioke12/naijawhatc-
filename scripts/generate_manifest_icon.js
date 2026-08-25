import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

const fontLuckiest = path.join(process.cwd(), 'public', 'fonts', 'LuckiestGuy-Regular.ttf');
const fontBaloo = path.join(process.cwd(), 'public', 'fonts', 'BalooChettan-Regular.ttf');

const fontFiles = [fontLuckiest, fontBaloo].filter(f => fs.existsSync(f));
const fontOptions = {
  fontFiles,
  loadSystemFonts: true,
  defaultFontFamily: 'Luckiest Guy'
};

function generateIconSvgBase64(size) {
  const strokeWidth = size * 0.05;
  const padding = size * 0.05;
  const rectSize = size * 0.9;
  const radius = size * 0.2;

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect x="${padding}" y="${padding}" width="${rectSize}" height="${rectSize}" rx="${radius}" fill="#064e3b" stroke="#f1c40f" stroke-width="${strokeWidth}"/>
    <text x="${size / 2}" y="${size * 0.42}" font-family="'Luckiest Guy', 'Baloo Chettan', sans-serif" font-size="${size * 0.28}" font-weight="bold" fill="#f1c40f" text-anchor="middle">NAIJA</text>
    <text x="${size / 2}" y="${size * 0.74}" font-family="'Luckiest Guy', 'Baloo Chettan', sans-serif" font-size="${size * 0.28}" font-weight="bold" fill="#f1c40f" text-anchor="middle">WHOT</text>
  </svg>
  `;

  const resvg = new Resvg(svg, { font: fontOptions });
  const pngData = resvg.render();
  return `data:image/png;base64,${pngData.asPng().toString('base64')}`;
}

const icon56 = generateIconSvgBase64(56);
const icon112 = generateIconSvgBase64(112);
const icon128 = generateIconSvgBase64(128);

const manifestPath = path.join(process.cwd(), 'public', 'manifest.webapp');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.icons = {
    "56": icon56,
    "112": icon112,
    "128": icon128
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log("Updated manifest.webapp with vector-rendered base64 icons!");
}
