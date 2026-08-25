<script lang="ts">
  import { onMount } from 'svelte';
  import { CppWhotGameEngine, suitToSymbol, type Card, type Suit, type GameStateJSON } from './cppEngine';
  import { getCardImage, getCardBackImage, getSuitIcon } from './assetManager';
  import { playSound, setSoundMuted } from './soundManager';

  // Screen View State: 'MAIN_MENU' | 'GAME' | 'HOW_TO_PLAY' | 'SETTINGS'
  let currentScreen: 'MAIN_MENU' | 'GAME' | 'HOW_TO_PLAY' | 'SETTINGS' = 'MAIN_MENU';

  // Main Menu State
  let menuSelectedIndex = 0; // 0: Play Game, 1: How to Play, 2: Settings
  const menuOptions = ['PLAY GAME', 'HOW TO PLAY', 'SETTINGS'];

  // Settings State
  let settingsSelectedIndex = 0;
  let settings = {
    sfx: true,
    pick3: true,
    suspend: true,
    emptyMarketEnds: false
  };

  // Game Engine State
  let engine = new CppWhotGameEngine({
    sfx: settings.sfx,
    pick3: settings.pick3,
    suspend: settings.suspend,
    emptyMarketEnds: settings.emptyMarketEnds
  });
  let gameState: GameStateJSON = engine.getStateJSON();

  // In-Game Selection & Modals
  // kaiosSelectedCardIndex: -1 means Market Deck focused; 0..hand.length-1 means hand card focused
  let kaiosSelectedCardIndex = 0;
  let showWhotSuitModal = false;
  let selectedWhotCardIndex = -1;
  let whotSuitSelectedIndex = 0;
  const suitsList: Suit[] = ['circle', 'triangle', 'cross', 'square', 'star'];

  function updateState() {
    gameState = engine.getStateJSON();
    // Keep focus within bounds
    if (gameState.human.hand.length === 0) {
      kaiosSelectedCardIndex = -1;
    } else if (kaiosSelectedCardIndex >= gameState.human.hand.length) {
      kaiosSelectedCardIndex = gameState.human.hand.length - 1;
    }
  }

  function handleStartNewGame() {
    playSound('sfx_card_deal');
    engine = new CppWhotGameEngine({
      sfx: settings.sfx,
      pick3: settings.pick3,
      suspend: settings.suspend,
      emptyMarketEnds: settings.emptyMarketEnds
    });
    updateState();
    kaiosSelectedCardIndex = 0;
    currentScreen = 'GAME';
  }

  function handlePlayCard(index: number) {
    if (gameState.currentTurnPlayerIndex !== 0 || gameState.isGameOver) return;
    if (index < 0 || index >= gameState.human.hand.length) return;

    const card = gameState.human.hand[index];
    if (!card) return;

    if (card.suit === 'whot' || card.number === 20) {
      selectedWhotCardIndex = index;
      whotSuitSelectedIndex = 0;
      showWhotSuitModal = true;
      playSound('sfx_whot_played');
      return;
    }

    const num = card.number;
    const res = engine.humanPlayCard(index);
    if (res.success) {
      // Play specific sound effects for special cards
      if (num === 1) playSound('sfx_hold_on');
      else if (num === 2) playSound('sfx_pick_two');
      else if (num === 5 && settings.pick3) playSound('sfx_pick_three');
      else if (num === 8 && settings.suspend) playSound('sfx_suspension');
      else if (num === 14) playSound('sfx_gen_market');
      else playSound('sfx_card_play');

      if (engine.humanHand.length === 1) {
        playSound('sfx_last_card');
      }

      updateState();

      if (gameState.isGameOver) {
        if (gameState.winnerId === 'You') playSound('sfx_win');
        else playSound('sfx_lose');
      } else if (gameState.currentTurnPlayerIndex === 1) {
        setTimeout(executeBotTurn, 850);
      }
    } else {
      playSound('sfx_invalid_move');
    }
  }

  function handleSelectWhotSuit(suit: Suit) {
    showWhotSuitModal = false;
    if (selectedWhotCardIndex < 0) return;

    const res = engine.humanPlayCard(selectedWhotCardIndex, suit);
    if (res.success) {
      playSound('sfx_whot_played');
      updateState();
      if (engine.humanHand.length === 1) playSound('sfx_last_card');

      if (gameState.isGameOver) {
        if (gameState.winnerId === 'You') playSound('sfx_win');
        else playSound('sfx_lose');
      } else if (gameState.currentTurnPlayerIndex === 1) {
        setTimeout(executeBotTurn, 850);
      }
    } else {
      playSound('sfx_invalid_move');
    }
  }

  function handleDrawMarket() {
    if (gameState.currentTurnPlayerIndex !== 0 || gameState.isGameOver) return;
    const res = engine.humanDrawMarket();
    if (res.success) {
      playSound('sfx_card_draw');
      updateState();
      if (gameState.currentTurnPlayerIndex === 1 && !gameState.isGameOver) {
        setTimeout(executeBotTurn, 850);
      }
    } else {
      playSound('sfx_invalid_move');
    }
  }

  function executeBotTurn() {
    if (gameState.isGameOver || gameState.currentTurnPlayerIndex !== 1) return;
    const topCardBefore = engine.getTopCard();

    const res = engine.executeBotTurn();
    updateState();

    if (res.success) {
      const topCardAfter = engine.getTopCard();
      if (topCardAfter && topCardAfter !== topCardBefore) {
        const num = topCardAfter.number;
        if (num === 20 || topCardAfter.suit === 'whot') playSound('sfx_whot_played');
        else if (num === 1) playSound('sfx_hold_on');
        else if (num === 2) playSound('sfx_pick_two');
        else if (num === 5 && settings.pick3) playSound('sfx_pick_three');
        else if (num === 8 && settings.suspend) playSound('sfx_suspension');
        else if (num === 14) playSound('sfx_gen_market');
        else playSound('sfx_card_play');

        if (engine.botHand.length === 1) playSound('sfx_last_card');
      } else {
        playSound('sfx_card_draw');
      }

      if (gameState.isGameOver) {
        if (gameState.winnerId === 'You') playSound('sfx_win');
        else playSound('sfx_lose');
      } else if (gameState.currentTurnPlayerIndex === 0) {
        playSound('sfx_your_turn');
      }
    }
  }

  // Keypad & Keyboard Listener
  function handleKeyDown(event: KeyboardEvent) {
    const key = event.key;

    if (currentScreen === 'MAIN_MENU') {
      if (key === 'ArrowUp') {
        menuSelectedIndex = (menuSelectedIndex - 1 + menuOptions.length) % menuOptions.length;
        playSound('sfx_btn_click');
      } else if (key === 'ArrowDown') {
        menuSelectedIndex = (menuSelectedIndex + 1) % menuOptions.length;
        playSound('sfx_btn_click');
      } else if (key === 'Enter' || key === ' ' || key === 'SoftRight' || key === 'F2') {
        playSound('sfx_btn_click');
        if (menuSelectedIndex === 0) handleStartNewGame();
        else if (menuSelectedIndex === 1) currentScreen = 'HOW_TO_PLAY';
        else if (menuSelectedIndex === 2) currentScreen = 'SETTINGS';
      }
    } else if (currentScreen === 'HOW_TO_PLAY') {
      if (key === 'SoftLeft' || key === 'SoftRight' || key === 'Escape' || key === 'Backspace' || key === 'Enter' || key === ' ') {
        playSound('sfx_btn_click');
        currentScreen = 'MAIN_MENU';
      }
    } else if (currentScreen === 'SETTINGS') {
      if (key === 'ArrowUp') {
        settingsSelectedIndex = Math.max(0, settingsSelectedIndex - 1);
        playSound('sfx_btn_click');
      } else if (key === 'ArrowDown') {
        settingsSelectedIndex = Math.min(2, settingsSelectedIndex + 1);
        playSound('sfx_btn_click');
      } else if (key === 'Enter' || key === ' ') {
        playSound('sfx_btn_click');
        if (settingsSelectedIndex === 0) {
          settings.sfx = !settings.sfx;
          setSoundMuted(!settings.sfx);
        } else if (settingsSelectedIndex === 1) {
          settings.pick3 = !settings.pick3;
        } else if (settingsSelectedIndex === 2) {
          settings.suspend = !settings.suspend;
        }
      } else if (key === 'SoftLeft' || key === 'SoftRight' || key === 'Escape' || key === 'Backspace') {
        playSound('sfx_btn_click');
        currentScreen = 'MAIN_MENU';
      }
    } else if (currentScreen === 'GAME') {
      if (showWhotSuitModal) {
        if (key === '1') handleSelectWhotSuit('circle');
        else if (key === '2') handleSelectWhotSuit('triangle');
        else if (key === '3') handleSelectWhotSuit('cross');
        else if (key === '4') handleSelectWhotSuit('square');
        else if (key === '5') handleSelectWhotSuit('star');
        else if (key === 'ArrowLeft') {
          whotSuitSelectedIndex = (whotSuitSelectedIndex - 1 + 5) % 5;
          playSound('sfx_btn_click');
        } else if (key === 'ArrowRight') {
          whotSuitSelectedIndex = (whotSuitSelectedIndex + 1) % 5;
          playSound('sfx_btn_click');
        } else if (key === 'Enter' || key === ' ') {
          handleSelectWhotSuit(suitsList[whotSuitSelectedIndex]);
        } else if (key === 'Escape' || key === 'Backspace') {
          showWhotSuitModal = false;
        }
        return;
      }

      if (gameState.isGameOver) {
        if (key === 'SoftLeft' || key === 'Enter' || key === ' ') {
          handleStartNewGame();
        } else if (key === 'SoftRight' || key === 'Escape' || key === 'Backspace') {
          playSound('sfx_btn_click');
          currentScreen = 'MAIN_MENU';
        }
        return;
      }

      // Normal In-Game Key Handling
      if (key === 'ArrowLeft') {
        kaiosSelectedCardIndex = Math.max(-1, kaiosSelectedCardIndex - 1);
        playSound('sfx_btn_click');
      } else if (key === 'ArrowRight') {
        kaiosSelectedCardIndex = Math.min(gameState.human.hand.length - 1, kaiosSelectedCardIndex + 1);
        playSound('sfx_btn_click');
      } else if (key === 'Enter' || key === ' ' || key === 'ArrowUp') {
        if (kaiosSelectedCardIndex === -1) {
          handleDrawMarket();
        } else {
          handlePlayCard(kaiosSelectedCardIndex);
        }
      } else if (key === 'ArrowDown' || key === '0' || key === 'd') {
        handleDrawMarket();
      } else if (key === 'SoftLeft' || key === 'Escape' || key === 'm') {
        playSound('sfx_btn_click');
        currentScreen = 'MAIN_MENU';
      } else if (key === 'SoftRight') {
        if (kaiosSelectedCardIndex >= 0 && engine.isValidPlay(gameState.human.hand[kaiosSelectedCardIndex])) {
          handlePlayCard(kaiosSelectedCardIndex);
        } else {
          handleDrawMarket();
        }
      } else if (key >= '1' && key <= '9') {
        const numIdx = parseInt(key) - 1;
        if (numIdx >= 0 && numIdx < gameState.human.hand.length) {
          kaiosSelectedCardIndex = numIdx;
          handlePlayCard(numIdx);
        }
      }
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

<div class="kaios-app-container">
  <!-- Exact 320x240 Pixel Viewport Stage -->
  <div class="kaios-stage">

    {#if currentScreen === 'MAIN_MENU'}
      <!-- Classic KaiOS Main Menu (Matches kaios_ss_1787655899543.png) -->
      <div class="kaios-menu-screen">
        <div class="gold-border-frame">
          <div class="menu-title-area">
            <h1 class="game-title">NAIJA WHOT</h1>
            <p class="game-subtitle">CLASSIC KAIOS EDITION</p>
          </div>

          <div class="menu-items-list">
            {#each menuOptions as option, idx}
              <button
                class="menu-option-btn"
                class:selected={idx === menuSelectedIndex}
                on:click={() => { menuSelectedIndex = idx; playSound('sfx_btn_click'); if (idx === 0) handleStartNewGame(); else if (idx === 1) currentScreen = 'HOW_TO_PLAY'; else if (idx === 2) currentScreen = 'SETTINGS'; }}
              >
                {option}
              </button>
            {/each}
          </div>

          <div class="menu-prompt-text">
            USE ▲/▼ TO SELECT, OK TO CONFIRM
          </div>

          <!-- Bottom Softkey Bar -->
          <div class="softkey-bar">
            <span class="softkey left">EXIT</span>
            <span class="softkey right">SELECT</span>
          </div>
        </div>
      </div>

    {:else if currentScreen === 'HOW_TO_PLAY'}
      <!-- How To Play Overlay Screen -->
      <div class="kaios-overlay-screen">
        <div class="overlay-header">
          <h2>HOW TO PLAY</h2>
        </div>
        <div class="rules-body">
          <p><strong class="hl">CARD 1:</strong> HOLD ON (Play again)</p>
          <p><strong class="hl">CARD 2:</strong> PICK TWO (Opponent draws 2)</p>
          <p><strong class="hl">CARD 5:</strong> PICK THREE (Opponent draws 3)</p>
          <p><strong class="hl">CARD 8:</strong> SUSPENSION (Opponent turn skipped)</p>
          <p><strong class="hl">CARD 14:</strong> GENERAL MARKET (Everyone draws 1)</p>
          <p><strong class="hl">CARD 20:</strong> WHOT (Call any suit you want)</p>
        </div>
        <div class="softkey-bar">
          <button class="softkey left" on:click={() => { playSound('sfx_btn_click'); currentScreen = 'MAIN_MENU'; }}>BACK</button>
          <button class="softkey right" on:click={() => { playSound('sfx_btn_click'); currentScreen = 'MAIN_MENU'; }}>BACK</button>
        </div>
      </div>

    {:else if currentScreen === 'SETTINGS'}
      <!-- Settings Overlay Screen -->
      <div class="kaios-overlay-screen">
        <div class="overlay-header">
          <h2>SETTINGS</h2>
        </div>
        <div class="settings-body">
          <div class="setting-row" class:selected={settingsSelectedIndex === 0} on:click={() => { settingsSelectedIndex = 0; settings.sfx = !settings.sfx; setSoundMuted(!settings.sfx); playSound('sfx_btn_click'); }}>
            <span>SOUND FX:</span>
            <span class="val">{settings.sfx ? 'ON' : 'OFF'}</span>
          </div>
          <div class="setting-row" class:selected={settingsSelectedIndex === 1} on:click={() => { settingsSelectedIndex = 1; settings.pick3 = !settings.pick3; playSound('sfx_btn_click'); }}>
            <span>PICK 3 (CARD 5):</span>
            <span class="val">{settings.pick3 ? 'ON' : 'OFF'}</span>
          </div>
          <div class="setting-row" class:selected={settingsSelectedIndex === 2} on:click={() => { settingsSelectedIndex = 2; settings.suspend = !settings.suspend; playSound('sfx_btn_click'); }}>
            <span>SUSPEND (CARD 8):</span>
            <span class="val">{settings.suspend ? 'ON' : 'OFF'}</span>
          </div>
        </div>
        <div class="softkey-bar">
          <button class="softkey left" on:click={() => { playSound('sfx_btn_click'); currentScreen = 'MAIN_MENU'; }}>BACK</button>
          <button class="softkey right" on:click={() => { playSound('sfx_btn_click'); currentScreen = 'MAIN_MENU'; }}>BACK</button>
        </div>
      </div>

    {:else if currentScreen === 'GAME'}
      <!-- Classic In-Game Felt Table Screen (Matches kaios_ss_1787656302578.png) -->
      <div class="kaios-game-table">
        <div class="table-border-frame">

          <!-- Top Status Header Bar -->
          <div class="table-header-bar">
            <span class="cpu-label">CPU BOT</span>

            <!-- CPU Bot Hand (Card backs facing down) -->
            <div class="cpu-hand-cards">
              {#each Array(Math.min(6, gameState.bot.cardCount)) as _, i}
                <img src={getCardBackImage()} alt="Card Back" class="cpu-card-back" style="transform: translateX(-{i * 10}px);" />
              {/each}
              {#if gameState.bot.cardCount > 6}
                <span class="bot-more-badge">+{gameState.bot.cardCount - 6}</span>
              {/if}
            </div>

            <span class="turn-banner" class:player-turn={gameState.currentTurnPlayerIndex === 0}>
              {#if gameState.isGameOver}
                GAME OVER
              {:else if gameState.currentTurnPlayerIndex === 0}
                YOUR TURN ({gameState.human.hand.filter(c => engine.isValidPlay(c)).length} VALID)
              {:else}
                CPU THINKING...
              {/if}
            </span>
          </div>

          <!-- Middle Table Playing Field -->
          <div class="table-center-area">

            <!-- Market Deck Stack (Middle Left) -->
            <div
              class="market-deck-group"
              class:focused={kaiosSelectedCardIndex === -1}
              on:click={() => { kaiosSelectedCardIndex = -1; handleDrawMarket(); }}
            >
              <div class="card-stack-shadow"></div>
              <img src={getCardBackImage()} alt="Market Deck" class="market-card-img" />
              <div class="market-label-text">MARKET: {gameState.deck.marketCount}</div>
            </div>

            <!-- Top Played Card Stack (Middle Center) -->
            <div class="played-card-group">
              {#if gameState.deck.topCard}
                {@const top = gameState.deck.topCard}
                <img src={getCardImage(top.suit, top.number)} alt="Top Played Card" class="played-card-img" />
              {/if}
            </div>

            <!-- Requested Suit & Pick Warning Callouts -->
            <div class="table-callouts">
              {#if gameState.deck.requestedSuit !== 'none'}
                <div class="suit-callout-badge">
                  <span>WANTED: {gameState.deck.requestedSuit.toUpperCase()}</span>
                  <img src={getSuitIcon(gameState.deck.requestedSuit)} alt="Suit" class="callout-suit-icon" />
                </div>
              {/if}
              {#if gameState.deck.pendingPickCount > 0}
                <div class="pick-callout-badge">
                  ⚠️ PICK +{gameState.deck.pendingPickCount}
                </div>
              {/if}
            </div>
          </div>

          <!-- Human Hand Cards (Bottom Right / Fanned out) -->
          <div class="player-hand-container">
            <div class="hand-cards-flex">
              {#each gameState.human.hand as card, idx}
                {@const isValid = engine.isValidPlay(card)}
                {@const isFocused = idx === kaiosSelectedCardIndex}
                <div
                  class="hand-card-wrapper"
                  class:focused={isFocused}
                  class:valid={isValid}
                  class:invalid={!isValid}
                  on:click={() => { kaiosSelectedCardIndex = idx; handlePlayCard(idx); }}
                >
                  <img src={getCardImage(card.suit, card.number)} alt="{card.suit} {card.number}" class="hand-card-img" />
                </div>
              {/each}
            </div>
          </div>

          <!-- In-Game Bottom Softkeys Bar -->
          <div class="softkey-bar">
            <button class="softkey left" on:click={() => { playSound('sfx_btn_click'); currentScreen = 'MAIN_MENU'; }}>
              MENU
            </button>
            <button class="softkey right" on:click={() => {
              if (kaiosSelectedCardIndex === -1) handleDrawMarket();
              else handlePlayCard(kaiosSelectedCardIndex);
            }}>
              {#if kaiosSelectedCardIndex === -1}
                MARKET
              {:else if kaiosSelectedCardIndex >= 0 && engine.isValidPlay(gameState.human.hand[kaiosSelectedCardIndex])}
                PLAY
              {:else}
                MARKET
              {/if}
            </button>
          </div>

        </div>

        <!-- WHOT Card Suit Selector Popup Modal -->
        {#if showWhotSuitModal}
          <div class="whot-suit-modal-backdrop">
            <div class="whot-suit-modal">
              <h3>SELECT A SUIT</h3>
              <div class="suits-grid">
                {#each suitsList as suit, idx}
                  <button
                    class="suit-select-btn"
                    class:focused={idx === whotSuitSelectedIndex}
                    on:click={() => handleSelectWhotSuit(suit)}
                  >
                    <span class="suit-key-num">{idx + 1}</span>
                    <img src={getSuitIcon(suit)} alt={suit} class="modal-suit-img" />
                    <span class="suit-name-text">{suit.toUpperCase()}</span>
                  </button>
                {/each}
              </div>
            </div>
          </div>
        {/if}

        <!-- Game Over / Disabled Popup Modal -->
        {#if gameState.isGameOver}
          <div class="gameover-modal-backdrop">
            <div class="gameover-modal">
              {#if gameState.winnerId === 'ENGINE_DISABLED'}
                <h2 style="color: #ef4444; font-size: 0.95rem;">TS ENGINE DISABLED</h2>
                <p style="font-size: 0.58rem; color: #fecaca; text-align: left; margin: 6px 0;">
                  ⚠️ C++ Fallback Engine (src/cppEngine.ts) was explicitly disabled.<br/><br/>
                  The C++ Emscripten binary (whot_engine_asm.js) is missing in this dev container because Emscripten (emcc) compiler is not installed.
                </p>
                <div class="gameover-softkeys">
                  <button class="modal-btn secondary" on:click={() => currentScreen = 'MAIN_MENU'}>MENU (RSK)</button>
                </div>
              {:else}
                <h2>{gameState.winnerId === 'You' ? 'YOU WIN! 🎉' : 'CPU WINS! 🤖'}</h2>
                <p>Your Score: <strong>{gameState.human.score}</strong> | Bot Score: <strong>{gameState.bot.score}</strong></p>
                <div class="gameover-softkeys">
                  <button class="modal-btn" on:click={handleStartNewGame}>REPLAY (LSK)</button>
                  <button class="modal-btn secondary" on:click={() => currentScreen = 'MAIN_MENU'}>MENU (RSK)</button>
                </div>
              {/if}
            </div>
          </div>
        {/if}

      </div>
    {/if}

  </div>
</div>

<style>
  /* Base Container filling 100% of viewport */
  .kaios-app-container {
    width: 100vw;
    height: 100vh;
    background-color: #022c22;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    user-select: none;
    font-family: 'Luckiest Guy', 'Baloo Chettan', system-ui, sans-serif;
  }

  /* Exact 320x240 Pixel Stage viewport */
  .kaios-stage {
    width: 320px;
    height: 240px;
    background-color: #064e3b;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.9);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  /* Smooth scale scaling for large monitors while locking 320x240 aspect ratio */
  @media (min-width: 480px) and (min-height: 360px) {
    .kaios-stage {
      transform: scale(1.4);
      transform-origin: center center;
    }
  }
  @media (min-width: 640px) and (min-height: 480px) {
    .kaios-stage {
      transform: scale(1.9);
      transform-origin: center center;
    }
  }
  @media (min-width: 960px) and (min-height: 720px) {
    .kaios-stage {
      transform: scale(2.6);
      transform-origin: center center;
    }
  }

  /* MAIN MENU SCREEN (kaios_ss_1787655899543.png) */
  .kaios-menu-screen {
    width: 100%;
    height: 100%;
    background-color: #064e3b;
    padding: 6px;
    box-sizing: border-box;
  }

  .gold-border-frame {
    width: 100%;
    height: 100%;
    border: 3px solid #d97706;
    outline: 1px solid #facc15;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    background: radial-gradient(circle at 50% 40%, #065f46 0%, #022c22 100%);
  }

  .menu-title-area {
    text-align: center;
    margin-top: 2px;
  }

  .game-title {
    font-size: 1.55rem;
    color: #facc15;
    margin: 0;
    line-height: 1;
    text-shadow: 2px 2px 0px #000, -1px -1px 0 #92400e;
    letter-spacing: 0.05em;
  }

  .game-subtitle {
    font-size: 0.62rem;
    color: #e2e8f0;
    margin: 2px 0 0 0;
    letter-spacing: 0.12em;
    font-weight: 700;
  }

  .menu-items-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 82%;
  }

  .menu-option-btn {
    background-color: #0f172a;
    border: 1.5px solid #334155;
    border-radius: 6px;
    color: #f8fafc;
    padding: 5px 0;
    font-size: 0.82rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    cursor: pointer;
    text-align: center;
  }

  .menu-option-btn.selected {
    background-color: #1e293b;
    border: 2px solid #facc15;
    color: #facc15;
    box-shadow: 0 0 8px rgba(250, 204, 21, 0.4);
  }

  .menu-prompt-text {
    font-size: 0.58rem;
    color: #94a3b8;
    letter-spacing: 0.08em;
  }

  /* Shared Softkey Bar */
  .softkey-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2px;
    box-sizing: border-box;
  }

  .softkey {
    background: transparent;
    border: none;
    color: #facc15;
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.05em;
    cursor: pointer;
    text-shadow: 1px 1px 0 #000;
  }

  /* OVERLAY SCREENS (How to play & Settings) */
  .kaios-overlay-screen {
    width: 100%;
    height: 100%;
    background-color: #064e3b;
    border: 3px solid #d97706;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 8px 10px;
  }

  .overlay-header h2 {
    color: #facc15;
    font-size: 1.1rem;
    margin: 0;
    text-align: center;
    text-shadow: 1.5px 1.5px 0 #000;
  }

  .rules-body, .settings-body {
    font-size: 0.62rem;
    color: #f8fafc;
    line-height: 1.45;
  }

  .rules-body p {
    margin: 3px 0;
  }

  .hl {
    color: #facc15;
  }

  .setting-row {
    display: flex;
    justify-content: space-between;
    padding: 5px 8px;
    background-color: #0f172a;
    border: 1px solid #334155;
    border-radius: 4px;
    margin-bottom: 5px;
    cursor: pointer;
  }

  .setting-row.selected {
    border-color: #facc15;
    background-color: #1e293b;
    color: #facc15;
  }

  .setting-row .val {
    font-weight: 800;
    color: #38bdf8;
  }

  /* IN-GAME TABLE SCREEN (kaios_ss_1787656302578.png) */
  .kaios-game-table {
    width: 100%;
    height: 100%;
    background-color: #064e3b;
    padding: 4px;
    box-sizing: border-box;
    position: relative;
  }

  .table-border-frame {
    width: 100%;
    height: 100%;
    border: 2px solid #d97706;
    outline: 1px solid #b45309;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 4px 6px;
    background: radial-gradient(circle at 50% 50%, #065f46 0%, #022c22 100%);
    position: relative;
  }

  /* Table Header */
  .table-header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 32px;
  }

  .cpu-label {
    color: #38bdf8;
    font-size: 0.7rem;
    font-weight: 900;
    text-shadow: 1px 1px 0 #000;
  }

  .cpu-hand-cards {
    display: flex;
    align-items: center;
    position: relative;
    height: 28px;
  }

  .cpu-card-back {
    width: 20px;
    height: 28px;
    border-radius: 2px;
    box-shadow: 1px 1px 3px rgba(0,0,0,0.5);
  }

  .bot-more-badge {
    color: #fef08a;
    font-size: 0.6rem;
    font-weight: 800;
    margin-left: 2px;
  }

  .turn-banner {
    color: #e2e8f0;
    font-size: 0.65rem;
    font-weight: 900;
    text-shadow: 1px 1px 0 #000;
  }

  .turn-banner.player-turn {
    color: #4ade80;
  }

  /* Table Playing Field */
  .table-center-area {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
    position: relative;
    height: 110px;
    padding-left: 12px;
  }

  .market-deck-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    position: relative;
  }

  .market-deck-group.focused img {
    outline: 2.5px solid #facc15;
    border-radius: 4px;
    transform: translateY(-2px);
  }

  .card-stack-shadow {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 48px;
    height: 68px;
    background-color: rgba(0,0,0,0.5);
    border-radius: 4px;
  }

  .market-card-img {
    width: 48px;
    height: 68px;
    border-radius: 4px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.5);
    position: relative;
    z-index: 2;
  }

  .market-label-text {
    color: #facc15;
    font-size: 0.62rem;
    font-weight: 900;
    margin-top: 3px;
    text-shadow: 1px 1px 0 #000;
  }

  .played-card-group {
    position: relative;
  }

  .played-card-img {
    width: 52px;
    height: 74px;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.6);
  }

  .table-callouts {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-left: 8px;
  }

  .suit-callout-badge {
    background-color: #3b0764;
    border: 1px solid #a855f7;
    color: #f5d0fe;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.58rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .callout-suit-icon {
    width: 14px;
    height: 14px;
  }

  .pick-callout-badge {
    background-color: #7f1d1d;
    border: 1px solid #ef4444;
    color: #fecaca;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.58rem;
    font-weight: 800;
  }

  /* Player Hand Area */
  .player-hand-container {
    height: 68px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    overflow-x: auto;
    padding-bottom: 2px;
  }

  .hand-cards-flex {
    display: flex;
    gap: 0px;
    padding-right: 6px;
  }

  .hand-card-wrapper {
    width: 40px;
    height: 58px;
    margin-left: -14px;
    cursor: pointer;
    transition: transform 0.1s ease;
    position: relative;
  }

  .hand-card-wrapper:first-child {
    margin-left: 0;
  }

  .hand-card-img {
    width: 100%;
    height: 100%;
    border-radius: 3px;
    box-shadow: -2px 2px 5px rgba(0,0,0,0.4);
  }

  .hand-card-wrapper.focused {
    transform: translateY(-8px);
    z-index: 10;
  }

  .hand-card-wrapper.focused.valid .hand-card-img {
    outline: 2.5px solid #22c55e;
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.8);
  }

  .hand-card-wrapper.focused.invalid .hand-card-img {
    outline: 2.5px solid #ef4444;
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.8);
  }

  /* WHOT Suit Modal */
  .whot-suit-modal-backdrop, .gameover-modal-backdrop {
    position: absolute;
    inset: 0;
    background-color: rgba(0,0,0,0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }

  .whot-suit-modal {
    background-color: #0f172a;
    border: 2px solid #facc15;
    border-radius: 8px;
    padding: 8px 12px;
    width: 260px;
    text-align: center;
  }

  .whot-suit-modal h3 {
    color: #facc15;
    font-size: 0.85rem;
    margin: 0 0 6px 0;
  }

  .suits-grid {
    display: flex;
    justify-content: space-around;
    gap: 4px;
  }

  .suit-select-btn {
    background-color: #1e293b;
    border: 1px solid #334155;
    border-radius: 6px;
    padding: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    width: 44px;
  }

  .suit-select-btn.focused {
    border-color: #facc15;
    background-color: #334155;
  }

  .suit-key-num {
    color: #facc15;
    font-size: 0.6rem;
    font-weight: 900;
  }

  .modal-suit-icon, .modal-suit-img {
    width: 22px;
    height: 22px;
    margin: 2px 0;
  }

  .suit-name-text {
    color: #f8fafc;
    font-size: 0.5rem;
    font-weight: 700;
  }

  /* Game Over Modal */
  .gameover-modal {
    background-color: #0f172a;
    border: 2px solid #facc15;
    border-radius: 8px;
    padding: 12px;
    width: 250px;
    text-align: center;
    color: #f8fafc;
  }

  .gameover-modal h2 {
    color: #facc15;
    font-size: 1.15rem;
    margin: 0 0 6px 0;
  }

  .gameover-modal p {
    font-size: 0.72rem;
    margin: 4px 0 10px 0;
  }

  .gameover-softkeys {
    display: flex;
    justify-content: space-around;
    gap: 8px;
  }

  .modal-btn {
    background-color: #16a34a;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    font-size: 0.65rem;
    font-weight: 900;
  }

  .modal-btn.secondary {
    background-color: #475569;
  }
</style>
