import assetsData from '../public/assets_base64.json';

const assets = assetsData as Record<string, string>;

export function getCardImage(suit: string, number: number): string {
  if (suit === 'whot' || number === 20) {
    return assets['card_whot_20'] || '';
  }
  const key = `card_${suit}_${number}`;
  return assets[key] || assets['card_back'] || '';
}

export function getCardBackImage(): string {
  return assets['card_back'] || '';
}

export function getSuitIcon(suit: string): string {
  const key = `suit_${suit}`;
  return assets[key] || '';
}

export function getAsset(key: string): string {
  return assets[key] || '';
}

export function getToggleImage(enabled: boolean): string {
  return assets[enabled ? 'toggle_on' : 'toggle_off'] || '';
}

export const ICON_GEAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23facc15" stroke="%23854d0e" stroke-width="1.5"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path fill-rule="evenodd" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" clip-rule="evenodd"/></svg>`;

export const ICON_LIGHTNING = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2338bdf8" stroke="%230284c7" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`;

export const ICON_CHAT = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f8fafc" stroke="%230f172a" stroke-width="1.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>`;

export const ICON_WARNING = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f59e0b" stroke="%2378350f" stroke-width="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01"/></svg>`;

export const ICON_PAUSE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23facc15" stroke="%2378350f" stroke-width="1.5"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;

export const ICON_TROPHY = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23facc15" stroke="%23854d0e" stroke-width="1.5"><path d="M8 21h8m-4-4v4M6 3h12v5a6 6 0 01-12 0V3z"/><path d="M6 5H4a2 2 0 00-2 2v1a4 4 0 004 4M18 5h2a2 2 0 012 2v1a4 4 0 01-4 4"/></svg>`;

export const ICON_ROBOT = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2338bdf8" stroke="%230f172a" stroke-width="1.5"><rect x="4" y="8" width="16" height="12" rx="2"/><circle cx="9" cy="13" r="1.5" fill="%230f172a"/><circle cx="15" cy="13" r="1.5" fill="%230f172a"/><path d="M12 2v6M9 18h6M2 13h2m16 0h2"/></svg>`;

