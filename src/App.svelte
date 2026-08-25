<script lang="ts">
  import { onMount } from 'svelte';
  import { CppWhotGameEngine, suitToSymbol, type Card, type Suit, type GameStateJSON } from './cppEngine';
  import { getCardImage, getCardBackImage, getSuitIcon, getToggleImage, ICON_GEAR, ICON_LIGHTNING, ICON_CHAT, ICON_WARNING, ICON_PAUSE, ICON_TROPHY, ICON_ROBOT } from './assetManager';
  import { playSound, setSoundMuted } from './soundManager';

  // Screen View State: 'MAIN_MENU' | 'GAME' | 'HOW_TO_PLAY' | 'SETTINGS'
  let currentScreen: 'MAIN_MENU' | 'GAME' | 'HOW_TO_PLAY' | 'SETTINGS' = 'MAIN_MENU';

  // Main Menu State
  let menuSelectedIndex = 0;
  let hasActiveGame = false;

  $: menuOptions = hasActiveGame
    ? ['RESUME GAME', 'START AGAIN', 'HOW TO PLAY', 'SETTINGS']
    : ['START GAME', 'HOW TO PLAY', 'SETTINGS'];

  // Pause Menu State
  let showPauseModal = false;
  let pauseSelectedIndex = 0;
  const pauseOptions = ['RESUME GAME', 'START AGAIN', 'MAIN MENU'];

  // Settings State
  let settingsSelectedIndex = 0;
  let settings = {
    sfx: true,
    pick3: true,
    suspend: true,
    aiBanter: true,
    whotCard: true,
    emptyMarketEnds: false
  };

  let botBanterMessage = '';
  let banterTimeout: ReturnType<typeof setTimeout> | null = null;

  function loadSettings() {
    const saved = localStorage.getItem('naija_whot_settings_hd');
    if (saved) {
      try {
        settings = { ...settings, ...JSON.parse(saved) };
        setSoundMuted(!settings.sfx);
      } catch {}
    }
  }

  function saveSettings() {
    localStorage.setItem('naija_whot_settings_hd', JSON.stringify(settings));
  }

  function saveActiveSession() {
    if (gameState && !gameState.isGameOver && hasActiveGame) {
      try {
        localStorage.setItem('naija_whot_active_session', JSON.stringify(engine.serialize()));
      } catch {}
    } else {
      localStorage.removeItem('naija_whot_active_session');
    }
  }

  function loadActiveSession() {
    const saved = localStorage.getItem('naija_whot_active_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const tempEngine = new CppWhotGameEngine(settings);
        if (tempEngine.deserialize(parsed) && !tempEngine.isGameOver) {
          engine = tempEngine;
          hasActiveGame = true;
          updateState();
          return;
        }
      } catch {}
    }
    hasActiveGame = false;
  }

  // Active Engine Detection
  let isEmscriptenCppActive = false;
  let activeEngineLabel = 'AI STUDIO DEV (TS MIRROR)';

  async function checkActiveEngine() {
    try {
      const res = await fetch('./whot_engine_asm.js', { method: 'GET' });
      const contentType = res.headers.get('content-type') || '';
      // SPA servers (like Vite in dev mode) return 200 with index.html for missing files
      if (res.ok && !contentType.includes('html') && (contentType.includes('javascript') || contentType.includes('ecmascript'))) {
        isEmscriptenCppActive = true;
        activeEngineLabel = 'PROD: EMSCRIPTEN C++ BINARY';
      } else {
        isEmscriptenCppActive = false;
        activeEngineLabel = 'AI STUDIO DEV (TS MIRROR)';
      }
    } catch {
      isEmscriptenCppActive = false;
      activeEngineLabel = 'AI STUDIO DEV (TS MIRROR)';
    }
  }

  // Game Engine State
  let engine = new CppWhotGameEngine(settings);
  let gameState: GameStateJSON = engine.getStateJSON();

  // Card Flip Animation States
  let playedCardFlipKey = 0;
  let isDealing = false;
  let drawFlightCard: { target: 'player' | 'bot'; key: number } | null = null;
  let drawFlightCounter = 0;

  // In-Game Selection & Modals
  // kaiosSelectedCardIndex: -1 means Market Deck focused; 0..hand.length-1 means hand card focused
  let kaiosSelectedCardIndex = 0;
  let showWhotSuitModal = false;
  let selectedWhotCardIndex = -1;
  let whotSuitSelectedIndex = 0;
  const suitsList: Suit[] = ['circle', 'triangle', 'cross', 'square', 'star'];

  function triggerDrawFlight(target: 'player' | 'bot') {
    drawFlightCounter++;
    drawFlightCard = { target, key: drawFlightCounter };
    setTimeout(() => {
      if (drawFlightCard && drawFlightCard.key === drawFlightCounter) {
        drawFlightCard = null;
      }
    }, 450);
  }

  function updateState() {
    gameState = engine.getStateJSON();
    if (gameState.isGameOver) {
      hasActiveGame = false;
      localStorage.removeItem('naija_whot_active_session');
    } else {
      saveActiveSession();
    }
    // Keep focus within bounds
    if (gameState.human.hand.length === 0) {
      kaiosSelectedCardIndex = -1;
    } else if (kaiosSelectedCardIndex >= gameState.human.hand.length) {
      kaiosSelectedCardIndex = gameState.human.hand.length - 1;
    }
  }

  function handleStartNewGame() {
    playSound('sfx_card_deal');
    botBanterMessage = '';
    showPauseModal = false;
    engine = new CppWhotGameEngine(settings);
    hasActiveGame = true;
    isDealing = true;
    playedCardFlipKey++;
    updateState();
    kaiosSelectedCardIndex = 0;
    currentScreen = 'GAME';
    setTimeout(() => {
      isDealing = false;
    }, 900);
  }

  function handleResumeGame() {
    playSound('sfx_btn_click');
    showPauseModal = false;
    currentScreen = 'GAME';
  }

  function handleOpenPauseMenu() {
    playSound('sfx_btn_click');
    pauseSelectedIndex = 0;
    showPauseModal = true;
  }

  function handleMenuOptionSelect(idx: number) {
    playSound('sfx_btn_click');
    if (hasActiveGame) {
      if (idx === 0) handleResumeGame();
      else if (idx === 1) handleStartNewGame();
      else if (idx === 2) currentScreen = 'HOW_TO_PLAY';
      else if (idx === 3) currentScreen = 'SETTINGS';
    } else {
      if (idx === 0) handleStartNewGame();
      else if (idx === 1) currentScreen = 'HOW_TO_PLAY';
      else if (idx === 2) currentScreen = 'SETTINGS';
    }
  }

  function handlePauseOptionSelect(idx: number) {
    playSound('sfx_btn_click');
    if (idx === 0) handleResumeGame();
    else if (idx === 1) handleStartNewGame();
    else if (idx === 2) { showPauseModal = false; currentScreen = 'MAIN_MENU'; }
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
      playedCardFlipKey++;
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
      playedCardFlipKey++;
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
      triggerDrawFlight('player');
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

    if (res.banter && settings.aiBanter) {
      if (banterTimeout) clearTimeout(banterTimeout);
      botBanterMessage = res.banter;
      banterTimeout = setTimeout(() => { botBanterMessage = ''; }, 2800);
    }

    if (res.success) {
      const topCardAfter = engine.getTopCard();
      if (topCardAfter && topCardAfter !== topCardBefore) {
        playedCardFlipKey++;
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
        triggerDrawFlight('bot');
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
        handleMenuOptionSelect(menuSelectedIndex);
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
        settingsSelectedIndex = Math.min(5, settingsSelectedIndex + 1);
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
        } else if (settingsSelectedIndex === 3) {
          settings.aiBanter = !settings.aiBanter;
        } else if (settingsSelectedIndex === 4) {
          settings.whotCard = !settings.whotCard;
        } else if (settingsSelectedIndex === 5) {
          settings.emptyMarketEnds = !settings.emptyMarketEnds;
        }
        saveSettings();
      } else if (key === 'SoftLeft' || key === 'SoftRight' || key === 'Escape' || key === 'Backspace') {
        playSound('sfx_btn_click');
        currentScreen = 'MAIN_MENU';
      }
    } else if (currentScreen === 'GAME') {
      if (showPauseModal) {
        if (key === 'ArrowUp') {
          pauseSelectedIndex = (pauseSelectedIndex - 1 + pauseOptions.length) % pauseOptions.length;
          playSound('sfx_btn_click');
        } else if (key === 'ArrowDown') {
          pauseSelectedIndex = (pauseSelectedIndex + 1) % pauseOptions.length;
          playSound('sfx_btn_click');
        } else if (key === 'Enter' || key === ' ' || key === 'SoftRight' || key === 'F2') {
          handlePauseOptionSelect(pauseSelectedIndex);
        } else if (key === 'SoftLeft' || key === 'Escape' || key === 'Backspace') {
          handleResumeGame();
        }
        return;
      }

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
          showPauseModal = false;
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
        handleOpenPauseMenu();
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
    loadSettings();
    loadActiveSession();
    window.addEventListener('keydown', handleKeyDown);
    checkActiveEngine();
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
            <div class="engine-badge" class:prod={isEmscriptenCppActive}>
              {#if isEmscriptenCppActive}
                <img src={ICON_GEAR} alt="Engine" class="badge-icon-img" /> {activeEngineLabel}
              {:else}
                <img src={ICON_LIGHTNING} alt="Engine" class="badge-icon-img" /> {activeEngineLabel}
              {/if}
            </div>
          </div>

          <div class="menu-items-list">
            {#each menuOptions as option, idx}
              <button
                class="menu-option-btn"
                class:selected={idx === menuSelectedIndex}
                on:click={() => { menuSelectedIndex = idx; handleMenuOptionSelect(idx); }}
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
        <div class="settings-body" style="overflow-y: auto; max-height: 160px;">
          <div class="setting-row" class:selected={settingsSelectedIndex === 0} on:click={() => { settingsSelectedIndex = 0; settings.sfx = !settings.sfx; setSoundMuted(!settings.sfx); saveSettings(); playSound('sfx_btn_click'); }}>
            <span>SOUND FX:</span>
            <img src={getToggleImage(settings.sfx)} alt={settings.sfx ? 'ON' : 'OFF'} class="toggle-switch-img" />
          </div>
          <div class="setting-row" class:selected={settingsSelectedIndex === 1} on:click={() => { settingsSelectedIndex = 1; settings.pick3 = !settings.pick3; saveSettings(); playSound('sfx_btn_click'); }}>
            <span>PICK 3 (CARD 5):</span>
            <img src={getToggleImage(settings.pick3)} alt={settings.pick3 ? 'ON' : 'OFF'} class="toggle-switch-img" />
          </div>
          <div class="setting-row" class:selected={settingsSelectedIndex === 2} on:click={() => { settingsSelectedIndex = 2; settings.suspend = !settings.suspend; saveSettings(); playSound('sfx_btn_click'); }}>
            <span>SUSPEND (CARD 8):</span>
            <img src={getToggleImage(settings.suspend)} alt={settings.suspend ? 'ON' : 'OFF'} class="toggle-switch-img" />
          </div>
          <div class="setting-row" class:selected={settingsSelectedIndex === 3} on:click={() => { settingsSelectedIndex = 3; settings.aiBanter = !settings.aiBanter; saveSettings(); playSound('sfx_btn_click'); }}>
            <span>CPU BANTER:</span>
            <img src={getToggleImage(settings.aiBanter)} alt={settings.aiBanter ? 'ON' : 'OFF'} class="toggle-switch-img" />
          </div>
          <div class="setting-row" class:selected={settingsSelectedIndex === 4} on:click={() => { settingsSelectedIndex = 4; settings.whotCard = !settings.whotCard; saveSettings(); playSound('sfx_btn_click'); }}>
            <span>INCLUDE WHOT 20:</span>
            <img src={getToggleImage(settings.whotCard)} alt={settings.whotCard ? 'ON' : 'OFF'} class="toggle-switch-img" />
          </div>
          <div class="setting-row" class:selected={settingsSelectedIndex === 5} on:click={() => { settingsSelectedIndex = 5; settings.emptyMarketEnds = !settings.emptyMarketEnds; saveSettings(); playSound('sfx_btn_click'); }}>
            <span>EMPTY MARKET ENDS:</span>
            <img src={getToggleImage(settings.emptyMarketEnds)} alt={settings.emptyMarketEnds ? 'ON' : 'OFF'} class="toggle-switch-img" />
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

            {#if botBanterMessage && settings.aiBanter}
              <div class="bot-banter-bubble">
                <img src={ICON_CHAT} alt="Chat" class="banter-icon-img" />
                <span>{botBanterMessage}</span>
              </div>
            {/if}

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

            <!-- Market Deck 2.5D Stack (Middle Left) -->
            <div
              class="market-deck-group"
              class:focused={kaiosSelectedCardIndex === -1}
              on:click={() => { kaiosSelectedCardIndex = -1; handleDrawMarket(); }}
            >
              <div class="market-deck-3d-stack">
                <div class="card-stack-shadow-3d"></div>
                {#if gameState.deck.marketCount > 2}
                  <img src={getCardBackImage()} alt="Stack Base" class="market-card-img stack-layer layer-3" />
                {/if}
                {#if gameState.deck.marketCount > 1}
                  <img src={getCardBackImage()} alt="Stack Mid" class="market-card-img stack-layer layer-2" />
                {/if}
                <img src={getCardBackImage()} alt="Market Deck" class="market-card-img stack-layer layer-top" />
              </div>
              <div class="market-label-text">MARKET: {gameState.deck.marketCount}</div>
            </div>

            <!-- Top Played Card Stack 2.5D (Middle Center) with 3D Flip Land Animation -->
            <div class="played-card-group">
              <div class="played-card-shadow-3d"></div>
              {#if gameState.deck.topCard}
                {@const top = gameState.deck.topCard}
                {#key playedCardFlipKey}
                  <div class="played-card-flip-box">
                    <div class="card-flip-inner played-card-flip-inner">
                      <div class="card-face card-front">
                        <img src={getCardImage(top.suit, top.number)} alt="Top Played Card" class="played-card-img card-3d" />
                      </div>
                      <div class="card-face card-back">
                        <img src={getCardBackImage()} alt="Card Back" class="played-card-img card-3d" />
                      </div>
                    </div>
                  </div>
                {/key}
              {/if}
            </div>

            <!-- Flying 3D Flip Draw Card (Market -> Player / Bot) -->
            {#if drawFlightCard}
              <div class="draw-flight-card flight-{drawFlightCard.target}">
                <div class="card-flip-inner flight-card-flip-inner">
                  <div class="card-face card-front">
                    <img src={getCardBackImage()} alt="Flight Card" class="flight-card-img" />
                  </div>
                  <div class="card-face card-back">
                    <img src={getCardBackImage()} alt="Flight Card" class="flight-card-img" />
                  </div>
                </div>
              </div>
            {/if}

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
                  <img src={ICON_WARNING} alt="Pick Alert" class="pick-icon-img" />
                  <span>PICK +{gameState.deck.pendingPickCount}</span>
                </div>
              {/if}
            </div>
          </div>

          <!-- Human Hand Cards (2.5D Fanned out with 3D Flip Effect) -->
          <div class="player-hand-container">
            <div class="hand-cards-flex">
              {#each gameState.human.hand as card, idx}
                {@const isValid = engine.isValidPlay(card)}
                {@const isFocused = idx === kaiosSelectedCardIndex}
                {@const isAnyFocused = kaiosSelectedCardIndex >= 0}
                {@const total = gameState.human.hand.length}
                {@const mid = (total - 1) / 2}
                {@const offset = idx - mid}
                {@const rotZ = isFocused ? 0 : offset * 2.0}
                {@const overlap = total > 8 ? -22 : total > 5 ? -16 : -11}
                {@const shiftX = isAnyFocused
                  ? (idx < kaiosSelectedCardIndex ? -8 : idx > kaiosSelectedCardIndex ? 18 : 0)
                  : 0}
                {@const transY = isFocused ? -10 : -Math.abs(offset) * 0.6}
                {@const scale = isFocused ? 1.08 : 1}
                {@const zIndex = isFocused ? 50 : idx + 1}
                <div
                  class="hand-card-wrapper"
                  class:focused={isFocused}
                  class:valid={isValid}
                  class:invalid={!isValid}
                  class:deal-flip={isDealing}
                  style="--deal-delay: {idx * 70}ms; transform: translate3d({shiftX}px, {transY}px, 0) rotateZ({rotZ}deg) scale({scale}); margin-left: {idx === 0 ? 0 : overlap}px; z-index: {zIndex};"
                  on:click={() => { kaiosSelectedCardIndex = idx; handlePlayCard(idx); }}
                >
                  <div class="card-flip-inner hand-card-flip-inner">
                    <div class="card-face card-front">
                      <img src={getCardImage(card.suit, card.number)} alt="{card.suit} {card.number}" class="hand-card-img" />
                    </div>
                    <div class="card-face card-back">
                      <img src={getCardBackImage()} alt="Card Back" class="hand-card-img" />
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <!-- In-Game Bottom Softkeys Bar -->
          <div class="softkey-bar in-game-softkeys">
            <button class="softkey left" on:click={handleOpenPauseMenu}>
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

        <!-- Pause Menu Popup Modal -->
        {#if showPauseModal}
          <div class="pause-modal-backdrop">
            <div class="pause-modal">
              <h3 class="pause-title">GAME PAUSED</h3>
              <div class="pause-options-list">
                {#each pauseOptions as opt, idx}
                  <button
                    class="pause-option-btn"
                    class:selected={idx === pauseSelectedIndex}
                    on:click={() => { pauseSelectedIndex = idx; handlePauseOptionSelect(idx); }}
                  >
                    {opt}
                  </button>
                {/each}
              </div>
              <div class="softkey-bar modal-softkeys">
                <button class="softkey left" on:click={handleResumeGame}>RESUME</button>
                <button class="softkey right" on:click={() => handlePauseOptionSelect(pauseSelectedIndex)}>SELECT</button>
              </div>
            </div>
          </div>
        {/if}

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

        <!-- Game Over Popup Modal -->
        {#if gameState.isGameOver}
          <div class="gameover-modal-backdrop">
            <div class="gameover-modal">
              <h2 class="gameover-title">
                {#if gameState.winnerId === 'You'}
                  YOU WIN!
                {:else}
                  CPU WINS!
                {/if}
              </h2>
              <p class="gameover-scores">Your Score: <strong>{gameState.human.score}</strong> | Bot Score: <strong>{gameState.bot.score}</strong></p>
              <div class="gameover-softkeys">
                <button class="modal-btn" on:click={handleStartNewGame}>START AGAIN (LSK)</button>
                <button class="modal-btn secondary" on:click={() => { showPauseModal = false; currentScreen = 'MAIN_MENU'; }}>MENU (RSK)</button>
              </div>
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
    padding: 3px;
    box-sizing: border-box;
  }

  .gold-border-frame {
    width: 100%;
    height: 100%;
    border: 2.5px solid #d97706;
    outline: 1px solid #facc15;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 4px 8px;
    background: radial-gradient(circle at 50% 40%, #065f46 0%, #022c22 100%);
  }

  .menu-title-area {
    text-align: center;
    margin-top: 0px;
  }

  .game-title {
    font-size: 1.25rem;
    color: #facc15;
    margin: 0;
    line-height: 1.1;
    text-shadow: 2px 2px 0px #000, -1px -1px 0 #92400e;
    letter-spacing: 0.05em;
  }

  .game-subtitle {
    font-size: 0.52rem;
    color: #e2e8f0;
    margin: 1px 0 0 0;
    letter-spacing: 0.12em;
    font-weight: 700;
  }

  .engine-badge {
    font-size: 0.42rem;
    padding: 1.5px 5px;
    border-radius: 3px;
    background-color: rgba(14, 116, 144, 0.4);
    color: #67e8f9;
    border: 1px solid #06b6d4;
    margin: 2px auto 0 auto;
    letter-spacing: 0.3px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    font-family: monospace, system-ui;
    font-weight: 600;
  }
  .engine-badge.prod {
    background-color: rgba(21, 128, 61, 0.4);
    color: #86efac;
    border: 1px solid #22c55e;
  }

  .badge-icon-img {
    width: 8px;
    height: 8px;
    display: inline-block;
    vertical-align: middle;
  }

  .banter-icon-img {
    width: 10px;
    height: 10px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 3px;
  }

  .pick-icon-img {
    width: 10px;
    height: 10px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 3px;
  }

  .modal-title-icon-img {
    width: 12px;
    height: 12px;
    display: inline-block;
    vertical-align: middle;
    margin-left: 4px;
  }

  .gameover-title-icon-img {
    width: 18px;
    height: 18px;
    display: inline-block;
    vertical-align: middle;
    margin: 0 3px;
  }

  .menu-items-list {
    display: flex;
    flex-direction: column;
    gap: 3.5px;
    width: 84%;
    margin: 1px 0;
  }

  .menu-option-btn {
    background-color: #0f172a;
    border: 1.5px solid #334155;
    border-radius: 5px;
    color: #f8fafc;
    padding: 3px 0;
    font-size: 0.74rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    cursor: pointer;
    text-align: center;
  }

  .menu-option-btn.selected {
    background-color: #1e293b;
    border: 1.5px solid #facc15;
    color: #facc15;
    box-shadow: 0 0 8px rgba(250, 204, 21, 0.4);
  }

  .menu-prompt-text {
    font-size: 0.52rem;
    color: #94a3b8;
    letter-spacing: 0.06em;
    margin-bottom: 1px;
  }

  /* Shared Softkey Bar */
  .softkey-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 6px;
    box-sizing: border-box;
    position: relative;
    z-index: 40;
    background: rgba(0, 0, 0, 0.45);
    border-radius: 3px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .softkey {
    background: transparent;
    border: none;
    color: #facc15;
    font-size: 0.68rem;
    font-weight: 900;
    letter-spacing: 0.05em;
    cursor: pointer;
    text-shadow: 1px 1px 0 #000;
    padding: 0;
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
    align-items: center;
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

  .toggle-switch-img {
    height: 18px;
    width: auto;
    display: block;
    object-fit: contain;
  }

  /* IN-GAME TABLE SCREEN 2.5D PERSPECTIVE */
  .kaios-game-table {
    width: 100%;
    height: 100%;
    background-color: #022c22;
    padding: 4px;
    box-sizing: border-box;
    position: relative;
    perspective: 700px;
    perspective-origin: 50% 80%;
    overflow: hidden;
  }

  .table-border-frame {
    width: 100%;
    height: 100%;
    border: 3px solid #b45309;
    outline: 1.5px solid #facc15;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 4px 6px;
    background: radial-gradient(ellipse at 50% 50%, #065f46 0%, #043f2e 55%, #022c22 100%);
    position: relative;
    transform-style: preserve-3d;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8), 0 8px 16px rgba(0,0,0,0.6);
    border-radius: 4px;
  }

  /* Table Header */
  .table-header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 32px;
    position: relative;
    transform: translateZ(10px);
  }

  .bot-banter-bubble {
    position: absolute;
    top: 32px;
    left: 4px;
    background-color: #1e293b;
    border: 1.5px solid #facc15;
    color: #facc15;
    font-size: 0.52rem;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 6px;
    z-index: 50;
    box-shadow: 0 4px 10px rgba(0,0,0,0.7);
    white-space: nowrap;
    animation: banterPop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform: translateZ(25px);
  }

  @keyframes banterPop {
    0% { transform: scale(0.6) translateZ(0px); opacity: 0; }
    100% { transform: scale(1) translateZ(25px); opacity: 1; }
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
    transform: rotateX(-15deg) translateZ(5px);
  }

  .cpu-card-back {
    width: 20px;
    height: 28px;
    border-radius: 2px;
    box-shadow: -2px 3px 6px rgba(0,0,0,0.6);
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

  /* Table Playing Field 2.5D Center */
  .table-center-area {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
    position: relative;
    height: 82px;
    padding-left: 10px;
    transform-style: preserve-3d;
  }

  .market-deck-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.15s ease;
  }

  .market-deck-3d-stack {
    position: relative;
    width: 42px;
    height: 60px;
    transform-style: preserve-3d;
    transform: rotateX(15deg) rotateZ(-3deg);
  }

  .card-stack-shadow-3d {
    position: absolute;
    top: 5px;
    left: 3px;
    width: 42px;
    height: 60px;
    background-color: rgba(0,0,0,0.65);
    border-radius: 4px;
    filter: blur(3px);
    transform: translateZ(0px);
  }

  .market-card-img {
    width: 42px;
    height: 60px;
    border-radius: 3.5px;
    box-shadow: -2px 2px 4px rgba(0,0,0,0.4);
    position: absolute;
    top: 0;
    left: 0;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .market-card-img.stack-layer.layer-3 {
    transform: translate3d(-3px, 3px, 3px);
  }

  .market-card-img.stack-layer.layer-2 {
    transform: translate3d(-1.5px, 1.5px, 6px);
  }

  .market-card-img.stack-layer.layer-top {
    transform: translate3d(0, 0, 10px);
    border: 1px solid rgba(255,255,255,0.2);
  }

  .market-deck-group.focused .market-deck-3d-stack {
    transform: rotateX(10deg) rotateZ(-2deg) translateZ(15px);
  }

  .market-deck-group.focused .layer-top {
    outline: 2.5px solid #facc15;
    box-shadow: 0 0 12px rgba(250, 204, 21, 0.9);
  }

  .market-label-text {
    color: #facc15;
    font-size: 0.6rem;
    font-weight: 900;
    margin-top: 4px;
    text-shadow: 1px 1.5px 2px #000;
    transform: translateZ(12px);
  }

  .played-card-group {
    position: relative;
    transform-style: preserve-3d;
  }

  .played-card-shadow-3d {
    position: absolute;
    top: 6px;
    left: 5px;
    width: 46px;
    height: 66px;
    background-color: rgba(0,0,0,0.65);
    border-radius: 4px;
    filter: blur(4px);
  }

  .played-card-flip-box {
    position: relative;
    width: 46px;
    height: 66px;
    perspective: 800px;
  }

  /* Universal 3D Flip Card Styles */
  .card-flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .card-face {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 3.5px;
  }

  .card-face.card-front {
    transform: rotateY(0deg);
    z-index: 2;
  }

  .card-face.card-back {
    transform: rotateY(180deg);
    z-index: 1;
  }

  /* Played Card 3D Flip Land Animation */
  .played-card-flip-inner {
    animation: playedCardFlipLand 0.36s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }

  @keyframes playedCardFlipLand {
    0% {
      transform: translate3d(0, -28px, 48px) rotateY(180deg) rotateX(30deg) rotateZ(12deg) scale(1.2);
      opacity: 0.5;
      filter: drop-shadow(0 14px 20px rgba(0, 0, 0, 0.85));
    }
    60% {
      transform: translate3d(0, -4px, 18px) rotateY(0deg) rotateX(16deg) rotateZ(-2deg) scale(1.04);
      opacity: 1;
      filter: drop-shadow(-4px 8px 14px rgba(0, 0, 0, 0.75));
    }
    100% {
      transform: translate3d(0, 0, 12px) rotateY(0deg) rotateX(14deg) rotateZ(-4deg) scale(1);
      opacity: 1;
      filter: drop-shadow(-3px 4px 10px rgba(0, 0, 0, 0.7));
    }
  }

  .played-card-img.card-3d {
    width: 46px;
    height: 66px;
    border-radius: 3.5px;
    box-shadow: -3px 4px 10px rgba(0,0,0,0.7);
    border: 1px solid rgba(255,255,255,0.25);
  }

  /* Flying Market Draw 3D Card Animation */
  .draw-flight-card {
    position: absolute;
    width: 42px;
    height: 60px;
    z-index: 80;
    pointer-events: none;
    perspective: 800px;
  }

  .draw-flight-card.flight-player {
    animation: drawFlightPlayer 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  .draw-flight-card.flight-bot {
    animation: drawFlightBot 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  .flight-card-flip-inner {
    animation: flightFlipRoll 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  .flight-card-img {
    width: 42px;
    height: 60px;
    border-radius: 3.5px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.8);
    border: 1px solid rgba(255,255,255,0.3);
  }

  @keyframes drawFlightPlayer {
    0% {
      top: 65px;
      left: 30px;
      transform: scale(0.95);
      opacity: 1;
    }
    50% {
      top: 100px;
      left: 80px;
      transform: scale(1.15);
      opacity: 1;
    }
    100% {
      top: 145px;
      left: 120px;
      transform: scale(0.9);
      opacity: 0;
    }
  }

  @keyframes drawFlightBot {
    0% {
      top: 65px;
      left: 30px;
      transform: scale(0.95);
      opacity: 1;
    }
    50% {
      top: 35px;
      left: 70px;
      transform: scale(1.15);
      opacity: 1;
    }
    100% {
      top: 10px;
      left: 110px;
      transform: scale(0.85);
      opacity: 0;
    }
  }

  @keyframes flightFlipRoll {
    0% {
      transform: rotateY(0deg) rotateZ(0deg);
    }
    50% {
      transform: rotateY(180deg) rotateZ(18deg);
    }
    100% {
      transform: rotateY(360deg) rotateZ(0deg);
    }
  }

  .table-callouts {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-left: 6px;
    transform: translateZ(15px);
  }

  .suit-callout-badge {
    background-color: #3b0764;
    border: 1.5px solid #a855f7;
    color: #f5d0fe;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.58rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.6);
  }

  .callout-suit-icon {
    width: 14px;
    height: 14px;
  }

  .pick-callout-badge {
    background-color: #7f1d1d;
    border: 1.5px solid #ef4444;
    color: #fecaca;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.58rem;
    font-weight: 800;
    box-shadow: 0 4px 8px rgba(0,0,0,0.6);
  }

  /* Player Hand Area 2.5D */
  .player-hand-container {
    height: 58px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: relative;
    z-index: 20;
    margin-bottom: 2px;
    perspective: 900px;
  }

  .hand-cards-flex {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding: 0 4px;
    transform-style: preserve-3d;
  }

  .hand-card-wrapper {
    width: 36px;
    height: 52px;
    cursor: pointer;
    transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.15s ease;
    position: relative;
    flex-shrink: 0;
    transform-origin: bottom center;
    transform-style: preserve-3d;
    perspective: 700px;
  }

  /* Hand Card Deal 3D Flip Cascade */
  .hand-card-wrapper.deal-flip .hand-card-flip-inner {
    animation: handDealCardFlip 0.46s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
    animation-delay: var(--deal-delay, 0ms);
  }

  @keyframes handDealCardFlip {
    0% {
      transform: translateY(30px) rotateY(180deg) scale(0.7);
      opacity: 0.1;
    }
    65% {
      transform: translateY(-6px) rotateY(0deg) scale(1.08);
      opacity: 1;
    }
    100% {
      transform: translateY(0) rotateY(0deg) scale(1);
      opacity: 1;
    }
  }

  .hand-card-img {
    width: 100%;
    height: 100%;
    border-radius: 3.5px;
    box-shadow: -2px 3px 6px rgba(0,0,0,0.55);
    border: 0.5px solid rgba(255,255,255,0.2);
  }

  .hand-card-wrapper.focused.valid .hand-card-img {
    outline: 2.5px solid #22c55e;
    box-shadow: 0 6px 16px rgba(34, 197, 94, 0.9), -4px 8px 12px rgba(0,0,0,0.7);
  }

  .hand-card-wrapper.focused.invalid .hand-card-img {
    outline: 2.5px solid #ef4444;
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.9), -4px 8px 12px rgba(0,0,0,0.7);
  }

  /* Pause Modal */
  .pause-modal-backdrop {
    position: absolute;
    inset: 0;
    background-color: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 60;
  }

  .pause-modal {
    background: radial-gradient(circle at 50% 40%, #0f172a 0%, #020617 100%);
    border: 2px solid #facc15;
    border-radius: 6px;
    padding: 6px 10px;
    width: 200px;
    text-align: center;
    box-shadow: 0 8px 20px rgba(0,0,0,0.9);
  }

  .pause-title {
    color: #facc15;
    font-size: 0.82rem;
    margin: 0 0 5px 0;
    text-shadow: 1px 1px 2px #000;
  }

  .pause-options-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 6px;
  }

  .pause-option-btn {
    background-color: #1e293b;
    border: 1.5px solid #334155;
    color: #cbd5e1;
    font-weight: 800;
    font-size: 0.68rem;
    padding: 4px;
    border-radius: 5px;
    cursor: pointer;
    text-shadow: 1px 1px 1px #000;
  }

  .pause-option-btn.selected {
    background-color: #d97706;
    border-color: #facc15;
    color: #ffffff;
    box-shadow: 0 0 8px rgba(250, 204, 21, 0.5);
  }

  .modal-softkeys {
    padding: 1px 4px;
    background: rgba(0, 0, 0, 0.6);
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
    border-radius: 6px;
    padding: 6px 8px;
    width: 230px;
    text-align: center;
  }

  .whot-suit-modal h3 {
    color: #facc15;
    font-size: 0.78rem;
    margin: 0 0 4px 0;
  }

  .suits-grid {
    display: flex;
    justify-content: space-around;
    gap: 3px;
  }

  .suit-select-btn {
    background-color: #1e293b;
    border: 1px solid #334155;
    border-radius: 5px;
    padding: 3px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    width: 40px;
  }

  .suit-select-btn.focused {
    border-color: #facc15;
    background-color: #334155;
  }

  .suit-key-num {
    color: #facc15;
    font-size: 0.55rem;
    font-weight: 900;
  }

  .modal-suit-icon, .modal-suit-img {
    width: 18px;
    height: 18px;
    margin: 1px 0;
  }

  .suit-name-text {
    color: #f8fafc;
    font-size: 0.48rem;
    font-weight: 700;
  }

  /* Game Over Modal */
  .gameover-modal {
    background-color: #0f172a;
    border: 2px solid #facc15;
    border-radius: 6px;
    padding: 8px 10px;
    width: 220px;
    text-align: center;
    color: #f8fafc;
  }

  .gameover-modal h2 {
    color: #facc15;
    font-size: 1rem;
    margin: 0 0 4px 0;
  }

  .gameover-modal p {
    font-size: 0.65rem;
    margin: 2px 0 8px 0;
  }

  .gameover-softkeys {
    display: flex;
    justify-content: space-around;
    gap: 6px;
  }

  .modal-btn {
    background-color: #16a34a;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 0.62rem;
    font-weight: 900;
  }

  .modal-btn.secondary {
    background-color: #475569;
  }
</style>
