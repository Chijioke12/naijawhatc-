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
