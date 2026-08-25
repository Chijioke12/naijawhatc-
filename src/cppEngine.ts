export type Suit = 'circle' | 'triangle' | 'cross' | 'square' | 'star' | 'whot';

export interface Card {
  id: string;
  suit: Suit;
  number: number;
}

export interface GameSettings {
  sfx: boolean;
  aiBanter: boolean;
  whotCard: boolean;
  pick3: boolean;
  suspend: boolean;
  emptyMarketEnds: boolean;
}

export interface PlayerState {
  id: string;
  name: string;
  isHuman: boolean;
  cardCount: number;
  score: number;
  hand: Card[];
}

export interface DeckState {
  marketCount: number;
  playedCount: number;
  topCard: Card | null;
  requestedSuit: Suit | 'none';
  pendingPickCount: number;
}

export interface GameStateJSON {
  isGameOver: boolean;
  winnerId: string;
  currentTurnPlayerIndex: number;
  human: PlayerState;
  bot: PlayerState;
  deck: DeckState;
  logs: string[];
}

// Map suit to symbol
export function suitToSymbol(suit: Suit | string): string {
  switch (suit) {
    case 'circle': return '●';
    case 'triangle': return '▲';
    case 'cross': return '✖';
    case 'square': return '■';
    case 'star': return '★';
    case 'whot': return '👑';
    default: return '?';
  }
}

export function cardScoreValue(card: Card): number {
  if (card.suit === 'whot') return 20;
  if (card.suit === 'star') return card.number * 2;
  return card.number;
}

// Emscripten C++ Bridge Helper
function getEmscriptenExport(name: string): any {
  if (typeof window === 'undefined') return null;
  const w = window as any;
  if (typeof w[name] === 'function') return w[name];
  if (w.Module && typeof w.Module[name] === 'function') return w.Module[name];
  if (w.Module && typeof w.Module['_' + name] === 'function') return w.Module['_' + name];
  return null;
}

function ptrToString(ptr: any): string {
  if (!ptr) return '';
  if (typeof ptr === 'string') return ptr;
  if (typeof window !== 'undefined') {
    const w = window as any;
    if (typeof w.UTF8ToString === 'function') return w.UTF8ToString(ptr);
    if (w.Module && typeof w.Module.UTF8ToString === 'function') return w.Module.UTF8ToString(ptr);
  }
  return '';
}

// C++ Engine Wrapper with Direct Emscripten Binary Hook
export class CppWhotGameEngine {
  public humanHand: Card[] = [];
  public botHand: Card[] = [];
  public marketPile: Card[] = [];
  public playedPile: Card[] = [];
  public requestedSuit: Suit | 'none' = 'none';
  public pendingPickCount: number = 0;
  public currentTurn: number = 0; // 0 = Human, 1 = Bot
  public isGameOver: boolean = false;
  public winnerId: string = '';
  public logs: string[] = [];
  public settings: GameSettings;

  constructor(settings?: Partial<GameSettings>) {
    this.settings = {
      sfx: true,
      aiBanter: true,
      whotCard: true,
      pick3: true,
      suspend: true,
      emptyMarketEnds: false,
      ...settings
    };
    this.startNewGame();
  }

  public isEmscriptenActive(): boolean {
    return !!getEmscriptenExport('_whot_init_game') || !!getEmscriptenExport('whot_init_game');
  }

  public startNewGame(): void {
    const fnInit = getEmscriptenExport('_whot_init_game') || getEmscriptenExport('whot_init_game');
    if (fnInit) {
      fnInit(
        this.settings.sfx ? 1 : 0,
        this.settings.aiBanter ? 1 : 0,
        this.settings.whotCard ? 1 : 0,
        this.settings.pick3 ? 1 : 0,
        this.settings.suspend ? 1 : 0,
        this.settings.emptyMarketEnds ? 1 : 0
      );
      this.syncFromEmscripten();
      return;
    }

    // High-fidelity TypeScript mirror for dev / web preview
    const deckConfig: { suit: Suit; numbers: number[] }[] = [
      { suit: 'circle', numbers: [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14] },
      { suit: 'triangle', numbers: [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14] },
      { suit: 'cross', numbers: [1, 2, 3, 5, 7, 10, 11, 13, 14] },
      { suit: 'square', numbers: [1, 2, 3, 5, 7, 10, 11, 13, 14] },
      { suit: 'star', numbers: [1, 2, 3, 4, 5, 7, 8] },
      { suit: 'whot', numbers: [20, 20, 20, 20, 20] }
    ];

    const cards: Card[] = [];
    let idCounter = 1;

    for (const group of deckConfig) {
      if (group.suit === 'whot' && !this.settings.whotCard) continue;
      for (const num of group.numbers) {
        cards.push({
          id: `card_${group.suit}_${num}_${idCounter++}`,
          suit: group.suit,
          number: num
        });
      }
    }

    // Fisher-Yates shuffle
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    this.marketPile = cards;
    this.playedPile = [];
    this.humanHand = [];
    this.botHand = [];
    this.requestedSuit = 'none';
    this.pendingPickCount = 0;
    this.currentTurn = 0;
    this.isGameOver = false;
    this.winnerId = '';
    this.logs = [];

    // Deal 6 cards to each player
    for (let i = 0; i < 6; i++) {
      if (this.marketPile.length > 0) this.humanHand.push(this.marketPile.pop()!);
      if (this.marketPile.length > 0) this.botHand.push(this.marketPile.pop()!);
    }

    // Top card onto played pile (ensure it's not empty)
    if (this.marketPile.length > 0) {
      this.playedPile.push(this.marketPile.pop()!);
    }
  }

  private syncFromEmscripten(): void {
    const fnGetJson = getEmscriptenExport('_whot_get_state_json') || getEmscriptenExport('whot_get_state_json');
    if (!fnGetJson) return;
    try {
      const jsonPtr = fnGetJson();
      const jsonStr = ptrToString(jsonPtr);
      if (jsonStr) {
        const state = JSON.parse(jsonStr);
        if (state && state.human) {
          this.humanHand = state.human.hand || [];
          this.botHand = state.bot.hand || [];
          this.requestedSuit = state.deck?.requestedSuit || 'none';
          this.pendingPickCount = state.deck?.pendingPickCount || 0;
          this.currentTurn = state.currentTurnPlayerIndex ?? 0;
          this.isGameOver = !!state.isGameOver;
          this.winnerId = state.winnerId || '';
          this.logs = state.logs || [];

          if (state.deck) {
            if (state.deck.topCard) {
              this.playedPile = [state.deck.topCard];
            }
            if (typeof state.deck.marketCount === 'number') {
              const needed = state.deck.marketCount;
              if (this.marketPile.length !== needed) {
                this.marketPile = new Array(needed).fill(null).map((_, i) => ({
                  id: `market_${i}`,
                  suit: 'circle',
                  number: 1
                }));
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn('Emscripten sync notice:', e);
    }
  }

  public getTopCard(): Card | null {
    return this.playedPile.length > 0 ? this.playedPile[this.playedPile.length - 1] : null;
  }

  public isValidPlay(card: Card): boolean {
    return this.canPlayCard(card);
  }

  public canPlayCard(card: Card): boolean {
    const top = this.getTopCard();
    if (!top) return true;

    // Penalty defense check
    if (this.pendingPickCount > 0) {
      if (top.number === 2 && card.number === 2) return true;
      if (top.number === 5 && card.number === 5 && this.settings.pick3) return true;
      return false;
    }

    if (card.suit === 'whot' || card.number === 20) return true;

    if (this.requestedSuit !== 'none') {
      return card.suit === this.requestedSuit;
    }
    return card.suit === top.suit || card.number === top.number;
  }

  public humanPlayCard(index: number, requestedSuitIfWhot: Suit | 'none' = 'none'): { success: boolean; message: string } {
    if (this.isGameOver || this.currentTurn !== 0) {
      return { success: false, message: "Not your turn!" };
    }

    const fnPlay = getEmscriptenExport('_whot_play_card') || getEmscriptenExport('whot_play_card');
    if (fnPlay) {
      let suitInt = 0;
      if (requestedSuitIfWhot === 'circle') suitInt = 1;
      else if (requestedSuitIfWhot === 'triangle') suitInt = 2;
      else if (requestedSuitIfWhot === 'cross') suitInt = 3;
      else if (requestedSuitIfWhot === 'square') suitInt = 4;
      else if (requestedSuitIfWhot === 'star') suitInt = 5;

      const ok = fnPlay(index, suitInt);
      this.syncFromEmscripten();
      const fnMsg = getEmscriptenExport('_whot_get_last_message') || getEmscriptenExport('whot_get_last_message');
      const msg = fnMsg ? ptrToString(fnMsg()) : (ok ? 'Card played' : 'Invalid move');
      return { success: ok !== 0, message: msg };
    }

    if (index < 0 || index >= this.humanHand.length) {
      return { success: false, message: "Invalid card selection" };
    }

    const card = this.humanHand[index];
    if (!this.canPlayCard(card)) {
      return { success: false, message: "Card does not match suit or number" };
    }

    this.humanHand.splice(index, 1);
    this.playedPile.push(card);
    this.logs.push(`You played ${card.number} of ${card.suit}`);

    if (card.suit === 'whot') {
      this.requestedSuit = requestedSuitIfWhot !== 'none' ? requestedSuitIfWhot : 'circle';
    } else {
      this.requestedSuit = 'none';
    }

    // Special Action Rules
    if (card.number === 1) { // Hold on
      this.logs.push("Hold On! You play again.");
    } else if (card.number === 2) { // Pick 2
      this.pendingPickCount += 2;
      this.currentTurn = 1;
    } else if (card.number === 5 && this.settings.pick3) { // Pick 3
      this.pendingPickCount += 3;
      this.currentTurn = 1;
    } else if (card.number === 8 && this.settings.suspend) { // Suspension
      this.logs.push("Suspension! Bot skipped.");
    } else if (card.number === 14) { // General Market
      this.drawCardForPlayer(this.botHand);
      this.logs.push("General Market! Bot drew 1 card.");
    } else {
      this.currentTurn = 1;
    }

    this.checkWinCondition();
    return { success: true, message: `Played ${card.number} ${card.suit}` };
  }

  public humanDrawMarket(): { success: boolean; message: string } {
    if (this.isGameOver || this.currentTurn !== 0) {
      return { success: false, message: "Not your turn!" };
    }

    const fnDraw = getEmscriptenExport('_whot_draw_market') || getEmscriptenExport('whot_draw_market');
    if (fnDraw) {
      const ok = fnDraw();
      this.syncFromEmscripten();
      const fnMsg = getEmscriptenExport('_whot_get_last_message') || getEmscriptenExport('whot_get_last_message');
      const msg = fnMsg ? ptrToString(fnMsg()) : 'Drew from market';
      return { success: ok !== 0, message: msg };
    }

    const count = this.pendingPickCount > 0 ? this.pendingPickCount : 1;
    this.pendingPickCount = 0;

    for (let i = 0; i < count; i++) {
      this.drawCardForPlayer(this.humanHand);
    }
    this.logs.push(`You drew ${count} card(s) from Market.`);
    this.requestedSuit = 'none';
    this.currentTurn = 1;
    this.checkWinCondition();
    return { success: true, message: `Drew ${count} card(s)` };
  }

  public executeBotTurn(): { success: boolean; message: string; botBanter?: string } {
    if (this.isGameOver || this.currentTurn !== 1) {
      return { success: false, message: "Not Bot turn" };
    }

    const fnBot = getEmscriptenExport('_whot_bot_turn') || getEmscriptenExport('whot_bot_turn');
    if (fnBot) {
      const ok = fnBot();
      this.syncFromEmscripten();
      const fnMsg = getEmscriptenExport('_whot_get_last_message') || getEmscriptenExport('whot_get_last_message');
      const fnBanter = getEmscriptenExport('_whot_get_last_banter') || getEmscriptenExport('whot_get_last_banter');
      const msg = fnMsg ? ptrToString(fnMsg()) : 'Bot turn finished';
      const banter = fnBanter ? ptrToString(fnBanter()) : '';
      return { success: ok !== 0, message: msg, botBanter: banter };
    }

    // Bot AI Logic
    let playableIdx = -1;
    for (let i = 0; i < this.botHand.length; i++) {
      if (this.canPlayCard(this.botHand[i])) {
        playableIdx = i;
        break;
      }
    }

    if (playableIdx !== -1) {
      const card = this.botHand.splice(playableIdx, 1)[0];
      this.playedPile.push(card);
      this.logs.push(`Bot played ${card.number} of ${card.suit}`);

      if (card.suit === 'whot') {
        const suits: Suit[] = ['circle', 'triangle', 'cross', 'square', 'star'];
        this.requestedSuit = suits[Math.floor(Math.random() * suits.length)];
        this.logs.push(`Bot calls for: ${this.requestedSuit.toUpperCase()}`);
      } else {
        this.requestedSuit = 'none';
      }

      if (card.number === 1) {
        this.logs.push("Bot says: Hold on!");
      } else if (card.number === 2) {
        this.pendingPickCount += 2;
        this.currentTurn = 0;
      } else if (card.number === 5 && this.settings.pick3) {
        this.pendingPickCount += 3;
        this.currentTurn = 0;
      } else if (card.number === 8 && this.settings.suspend) {
        this.logs.push("Bot suspended you!");
      } else if (card.number === 14) {
        this.drawCardForPlayer(this.humanHand);
        this.logs.push("Bot played General Market! You drew 1.");
      } else {
        this.currentTurn = 0;
      }

      this.checkWinCondition();
      return { success: true, message: `Bot played ${card.number} ${card.suit}` };
    } else {
      const count = this.pendingPickCount > 0 ? this.pendingPickCount : 1;
      this.pendingPickCount = 0;
      for (let i = 0; i < count; i++) {
        this.drawCardForPlayer(this.botHand);
      }
      this.logs.push(`Bot drew ${count} card(s) from Market.`);
      this.requestedSuit = 'none';
      this.currentTurn = 0;
      this.checkWinCondition();
      return { success: true, message: `Bot drew ${count} card(s)` };
    }
  }

  private drawCardForPlayer(targetHand: Card[]): void {
    if (this.marketPile.length === 0) {
      if (this.playedPile.length > 1) {
        const top = this.playedPile.pop()!;
        this.marketPile = this.playedPile.reverse();
        this.playedPile = [top];
      } else {
        return;
      }
    }
    if (this.marketPile.length > 0) {
      targetHand.push(this.marketPile.pop()!);
    }
  }

  public checkWinCondition(): void {
    if (this.humanHand.length === 0) {
      this.isGameOver = true;
      this.winnerId = 'You';
      this.logs.push("CHECK! You have won the game!");
    } else if (this.botHand.length === 0) {
      this.isGameOver = true;
      this.winnerId = 'Naija Bot';
      this.logs.push("CHECK! Naija Bot has won!");
    } else if (this.settings.emptyMarketEnds && this.marketPile.length === 0) {
      this.isGameOver = true;
      const humanScore = this.calculateHandScore(this.humanHand);
      const botScore = this.calculateHandScore(this.botHand);
      this.winnerId = humanScore <= botScore ? 'You' : 'Naija Bot';
    }
  }

  public calculateHandScore(hand: Card[]): number {
    return hand.reduce((acc, c) => acc + cardScoreValue(c), 0);
  }

  public serialize(): any {
    return {
      humanHand: this.humanHand,
      botHand: this.botHand,
      marketPile: this.marketPile,
      playedPile: this.playedPile,
      requestedSuit: this.requestedSuit,
      pendingPickCount: this.pendingPickCount,
      currentTurn: this.currentTurn,
      isGameOver: this.isGameOver,
      winnerId: this.winnerId,
      logs: this.logs
    };
  }

  public deserialize(data: any): boolean {
    if (!data || !Array.isArray(data.humanHand) || !Array.isArray(data.botHand)) return false;
    this.humanHand = data.humanHand;
    this.botHand = data.botHand;
    this.marketPile = data.marketPile || [];
    this.playedPile = data.playedPile || [];
    this.requestedSuit = data.requestedSuit || 'none';
    this.pendingPickCount = data.pendingPickCount || 0;
    this.currentTurn = typeof data.currentTurn === 'number' ? data.currentTurn : 0;
    this.isGameOver = !!data.isGameOver;
    this.winnerId = data.winnerId || '';
    this.logs = data.logs || [];
    return true;
  }

  public getStateJSON(): GameStateJSON {
    return {
      isGameOver: this.isGameOver,
      winnerId: this.winnerId,
      currentTurnPlayerIndex: this.currentTurn,
      human: {
        id: 'player_human',
        name: 'You (Player)',
        isHuman: true,
        cardCount: this.humanHand.length,
        score: this.calculateHandScore(this.humanHand),
        hand: this.humanHand
      },
      bot: {
        id: 'player_bot',
        name: 'Naija Bot (AI)',
        isHuman: false,
        cardCount: this.botHand.length,
        score: this.calculateHandScore(this.botHand),
        hand: this.botHand
      },
      deck: {
        marketCount: this.marketPile.length,
        playedCount: this.playedPile.length,
        topCard: this.getTopCard(),
        requestedSuit: this.requestedSuit,
        pendingPickCount: this.pendingPickCount
      },
      logs: this.logs
    };
  }
}
