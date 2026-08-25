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
export function suitToSymbol(suit: Suit): string {
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

// C++ Engine Wrapper
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

  public startNewGame(): void {
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

    // Deal 6 cards
    for (let i = 0; i < 6; i++) {
      if (this.marketPile.length > 0) this.humanHand.push(this.marketPile.pop()!);
      if (this.marketPile.length > 0) this.botHand.push(this.marketPile.pop()!);
    }

    // Top card
    if (this.marketPile.length > 0) {
      this.playedPile.push(this.marketPile.pop()!);
    }

    this.addLog('--- C++ Whot Engine Initialized ---');
    this.addLog('Dealt 6 cards to You and Naija Bot.');
    if (this.getTopCard()) {
      const top = this.getTopCard()!;
      this.addLog(`Top card on table: ${top.suit} ${top.number} (${suitToSymbol(top.suit)})`);
    }
  }

  public getTopCard(): Card | null {
    return this.playedPile.length > 0 ? this.playedPile[this.playedPile.length - 1] : null;
  }

  public addLog(msg: string): void {
    this.logs.push(msg);
    if (this.logs.length > 50) this.logs.shift();
  }

  public isValidPlay(card: Card): boolean {
    const top = this.getTopCard();
    if (!top) return true;

    if (card.suit === 'whot') return true;

    if (this.pendingPickCount > 0) {
      if (top.number === 2 && card.number === 2) return true;
      if (top.number === 5 && card.number === 5 && this.settings.pick3) return true;
      return false;
    }

    if (this.requestedSuit !== 'none') {
      return card.suit === this.requestedSuit;
    }

    return card.suit === top.suit || card.number === top.number;
  }

  public humanPlayCard(handIndex: number, reqSuit: Suit = 'circle'): { success: boolean; message: string } {
    if (this.isGameOver) return { success: false, message: 'Game is over.' };
    if (this.currentTurn !== 0) return { success: false, message: 'Not your turn!' };
    if (handIndex < 0 || handIndex >= this.humanHand.length) return { success: false, message: 'Invalid card.' };

    const card = this.humanHand[handIndex];
    if (!this.isValidPlay(card)) {
      return { success: false, message: `Cannot play ${card.suit} ${card.number}` };
    }

    this.humanHand.splice(handIndex, 1);
    return this.processPlay('You', this.humanHand, this.botHand, card, reqSuit);
  }

  public humanDrawMarket(): { success: boolean; message: string } {
    if (this.isGameOver) return { success: false, message: 'Game is over.' };
    if (this.currentTurn !== 0) return { success: false, message: 'Not your turn!' };

    const count = this.pendingPickCount > 0 ? this.pendingPickCount : 1;
    this.pendingPickCount = 0;

    let drawn = 0;
    for (let i = 0; i < count; i++) {
      const c = this.drawFromMarket();
      if (c) {
        this.humanHand.push(c);
        drawn++;
      }
    }

    this.addLog(`You drew ${drawn} card(s) from market.`);
    this.currentTurn = 1;
    this.checkMarketEmpty();

    return { success: true, message: `Drew ${drawn} card(s) from market.` };
  }

  public executeBotTurn(): { success: boolean; message: string; banter?: string } {
    if (this.isGameOver || this.currentTurn !== 1) return { success: false, message: 'Not Bot turn.' };

    const validIndices: number[] = [];
    for (let i = 0; i < this.botHand.length; i++) {
      if (this.isValidPlay(this.botHand[i])) validIndices.push(i);
    }

    if (validIndices.length > 0) {
      // Pick strategy
      let choiceIdx = validIndices[0];
      if (this.pendingPickCount > 0) {
        const def = validIndices.find(i => this.botHand[i].number === 2 || this.botHand[i].number === 5);
        if (def !== undefined) choiceIdx = def;
      } else {
        const special = validIndices.find(i => [2, 5, 14, 1, 8].includes(this.botHand[i].number) && this.botHand[i].suit !== 'whot');
        if (special !== undefined) choiceIdx = special;
        else {
          const nonWhot = validIndices.find(i => this.botHand[i].suit !== 'whot');
          if (nonWhot !== undefined) choiceIdx = nonWhot;
        }
      }

      const card = this.botHand[choiceIdx];
      this.botHand.splice(choiceIdx, 1);

      // Suit calculation if WHOT
      let reqSuit: Suit = 'circle';
      if (card.suit === 'whot') {
        const counts: Record<string, number> = {};
        for (const c of this.botHand) {
          if (c.suit !== 'whot') counts[c.suit] = (counts[c.suit] || 0) + 1;
        }
        let max = -1;
        for (const s of ['circle', 'triangle', 'cross', 'square', 'star'] as Suit[]) {
          if ((counts[s] || 0) > max) {
            max = counts[s] || 0;
            reqSuit = s;
          }
        }
      }

      const res = this.processPlay('Naija Bot', this.botHand, this.humanHand, card, reqSuit);
      let banter = 'Your turn!';
      if (card.number === 2) banter = 'Oya pick 2 my friend!';
      else if (card.number === 5) banter = 'Pick 3 for yourself!';
      else if (card.suit === 'whot') banter = `I change suit to ${reqSuit}!`;
      else if (card.number === 1) banter = 'Hold On! Let me play again!';
      else if (card.number === 8) banter = 'Suspended! Rest small!';
      else if (card.number === 14) banter = 'Go to market!';

      return { ...res, banter };
    } else {
      const count = this.pendingPickCount > 0 ? this.pendingPickCount : 1;
      this.pendingPickCount = 0;

      let drawn = 0;
      for (let i = 0; i < count; i++) {
        const c = this.drawFromMarket();
        if (c) {
          this.botHand.push(c);
          drawn++;
        }
      }

      this.addLog(`Naija Bot drew ${drawn} card(s) from market.`);
      this.currentTurn = 0;
      this.checkMarketEmpty();

      return { success: true, message: `Bot drew ${drawn} card(s).`, banter: 'Market time! Buy fresh yam!' };
    }
  }

  private drawFromMarket(): Card | null {
    if (this.marketPile.length === 0) {
      if (this.settings.emptyMarketEnds) return null;
      this.refillMarket();
    }
    return this.marketPile.pop() || null;
  }

  private refillMarket(): void {
    if (this.playedPile.length <= 1) return;
    const top = this.playedPile.pop()!;
    const remaining = [...this.playedPile];
    this.playedPile = [top];

    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    this.marketPile = remaining;
  }

  private processPlay(
    playerName: string,
    playerHand: Card[],
    opponentHand: Card[],
    card: Card,
    reqSuit: Suit
  ): { success: boolean; message: string } {
    this.playedPile.push(card);
    this.requestedSuit = 'none';

    this.addLog(`${playerName} played ${card.suit} ${card.number} (${suitToSymbol(card.suit)})`);

    if (playerHand.length === 1) {
      this.addLog(`${playerName}: LAST CARD!`);
    } else if (playerHand.length === 0) {
      this.addLog(`${playerName}: CHECK! GAME OVER!`);
      this.isGameOver = true;
      this.winnerId = playerName.includes('You') ? 'player_human' : 'player_bot';
      return { success: true, message: `${playerName} won the game (CHECK)!` };
    }

    let keepTurn = false;

    if (card.suit === 'whot') {
      this.requestedSuit = reqSuit;
      this.addLog(`${playerName} requested suit: ${reqSuit} (${suitToSymbol(reqSuit)})`);
    } else if (card.number === 1) {
      this.addLog(`HOLD ON! ${playerName} gets another turn!`);
      keepTurn = true;
    } else if (card.number === 2) {
      this.pendingPickCount += 2;
      this.addLog(`PICK 2! Pending picks: ${this.pendingPickCount}`);
    } else if (card.number === 5 && this.settings.pick3) {
      this.pendingPickCount += 3;
      this.addLog(`PICK 3! Pending picks: ${this.pendingPickCount}`);
    } else if (card.number === 8 && this.settings.suspend) {
      this.addLog(`SUSPEND! Opponent skipped.`);
      keepTurn = true;
    } else if (card.number === 14) {
      this.addLog(`GENERAL MARKET! Opponent draws 1 card.`);
      const g = this.drawFromMarket();
      if (g) opponentHand.push(g);
    }

    if (!keepTurn) {
      this.currentTurn = this.currentTurn === 0 ? 1 : 0;
    }

    return { success: true, message: `${playerName} played ${card.suit} ${card.number}` };
  }

  private checkMarketEmpty(): void {
    if (this.marketPile.length === 0 && this.settings.emptyMarketEnds) {
      this.isGameOver = true;
      const hScore = this.calculateHandScore(this.humanHand);
      const bScore = this.calculateHandScore(this.botHand);
      if (hScore < bScore) this.winnerId = 'player_human';
      else if (bScore < hScore) this.winnerId = 'player_bot';
      else this.winnerId = 'DRAW';
    }
  }

  public calculateHandScore(hand: Card[]): number {
    return hand.reduce((acc, c) => acc + cardScoreValue(c), 0);
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
