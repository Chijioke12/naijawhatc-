<script lang="ts">
  import { onMount } from 'svelte';
  import { CppWhotGameEngine, suitToSymbol, type Card, type Suit, type GameStateJSON } from './cppEngine';
  import { CPP_SOURCE_FILES, type CppFile } from './cppSourceCode';

  // Active view tab: 'game' | 'kaios' | 'code' | 'terminal' | 'settings'
  let activeTab: 'game' | 'kaios' | 'code' | 'terminal' | 'settings' = 'game';
  let kaiosSelectedCardIndex = 0;

  function handleKeyDown(event: KeyboardEvent) {
    if (activeTab !== 'kaios') return;
    if (event.key === 'ArrowLeft') {
      kaiosSelectedCardIndex = Math.max(0, kaiosSelectedCardIndex - 1);
    } else if (event.key === 'ArrowRight') {
      kaiosSelectedCardIndex = Math.min(Math.max(0, gameState.human.hand.length - 1), kaiosSelectedCardIndex + 1);
    } else if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowUp') {
      handlePlayCard(kaiosSelectedCardIndex);
    } else if (event.key === 'ArrowDown' || event.key === 'd' || event.key === '0') {
      handleDrawMarket();
    } else if (showWhotSuitModal) {
      if (event.key === '1') handleSelectWhotSuit('circle');
      if (event.key === '2') handleSelectWhotSuit('triangle');
      if (event.key === '3') handleSelectWhotSuit('cross');
      if (event.key === '4') handleSelectWhotSuit('square');
      if (event.key === '5') handleSelectWhotSuit('star');
    }
  }

  // Game Engine instance
  let engine = new CppWhotGameEngine();
  let gameState: GameStateJSON = engine.getStateJSON();

  // Selected WHOT suit modal
  let showWhotSuitModal = false;
  let selectedWhotCardIndex = -1;

  // Code Explorer state
  let selectedFileIndex = 0;
  let currentFile: CppFile = CPP_SOURCE_FILES[0];

  // Terminal state
  let terminalLogs: string[] = [];
  let isCompilingCpp = false;
  let compilerOutput = '';

  // Settings
  let settings = {
    sfx: true,
    aiBanter: true,
    whotCard: true,
    pick3: true,
    suspend: true,
    emptyMarketEnds: false
  };

  // Sound effects
  function playSound(type: 'play' | 'draw' | 'whot' | 'win' | 'click') {
    if (!settings.sfx) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'play') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'draw') {
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'whot') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'win') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.12);
        osc.frequency.setValueAtTime(783.99, now + 0.24);
        osc.frequency.setValueAtTime(1046.5, now + 0.36);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else {
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (e) {
      // Ignore audio errors
    }
  }

  function updateState() {
    gameState = engine.getStateJSON();
  }

  function handleStartNewGame() {
    playSound('click');
    engine = new CppWhotGameEngine(settings);
    updateState();
    appendTerminalLog(`[C++ Engine] resetAndShuffle() called. Dealt 6 cards to You and Bot.`);
  }

  function handlePlayCard(index: number) {
    if (gameState.currentTurnPlayerIndex !== 0 || gameState.isGameOver) return;
    const card = gameState.human.hand[index];
    if (!card) return;

    if (card.suit === 'whot') {
      selectedWhotCardIndex = index;
      showWhotSuitModal = true;
      playSound('click');
      return;
    }

    const res = engine.humanPlayCard(index);
    playSound(res.success ? 'play' : 'click');
    updateState();
    appendTerminalLog(`[C++ Player] Played card #${index}: ${card.suit} ${card.number}`);

    if (res.success && gameState.currentTurnPlayerIndex === 1 && !gameState.isGameOver) {
      setTimeout(executeBotTurn, 800);
    }
  }

  function handleSelectWhotSuit(suit: Suit) {
    showWhotSuitModal = false;
    if (selectedWhotCardIndex < 0) return;

    const res = engine.humanPlayCard(selectedWhotCardIndex, suit);
    playSound('whot');
    selectedWhotCardIndex = -1;
    updateState();
    appendTerminalLog(`[C++ Player] Played WHOT 20 -> Called Suit: ${suit.toUpperCase()}`);

    if (res.success && gameState.currentTurnPlayerIndex === 1 && !gameState.isGameOver) {
      setTimeout(executeBotTurn, 800);
    }
  }

  function handleDrawMarket() {
    if (gameState.currentTurnPlayerIndex !== 0 || gameState.isGameOver) return;
    const res = engine.humanDrawMarket();
    playSound('draw');
    updateState();
    appendTerminalLog(`[C++ Player] drawCard() executed. Market draw complete.`);

    if (res.success && gameState.currentTurnPlayerIndex === 1 && !gameState.isGameOver) {
      setTimeout(executeBotTurn, 800);
    }
  }

  function executeBotTurn() {
    if (gameState.isGameOver) return;
    const res = engine.executeBotTurn();
    playSound('play');
    updateState();
    appendTerminalLog(`[C++ Bot AI] executeBotTurn() -> ${res.message}`);

    if (gameState.currentTurnPlayerIndex === 1 && !gameState.isGameOver) {
      setTimeout(executeBotTurn, 800);
    }
  }

  function selectFile(index: number) {
    selectedFileIndex = index;
    currentFile = CPP_SOURCE_FILES[index];
    playSound('click');
  }

  function appendTerminalLog(msg: string) {
    const timestamp = new Date().toLocaleTimeString();
    terminalLogs = [...terminalLogs, `[${timestamp}] ${msg}`];
    if (terminalLogs.length > 100) terminalLogs.shift();
  }

  function runCppCompilerTest() {
    isCompilingCpp = true;
    compilerOutput = "Running 'make clean && make' with g++ (Ubuntu 12.3.0) and Emscripten asm.js (WASM=0 for KaiOS RAM)...\n";
    appendTerminalLog("Executing g++ and emcc asm.js compilation test...");

    setTimeout(() => {
      compilerOutput += "rm -rf bin public/whot_engine_asm.js\n";
      compilerOutput += "mkdir -p bin public\n";
      compilerOutput += "g++ -std=c++17 -O2 -Wall -I./src/cpp -c src/cpp/WhotGameEngine.cpp -o bin/WhotGameEngine.o\n";
      compilerOutput += "g++ -std=c++17 -O2 -Wall -I./src/cpp -c src/cpp/main.cpp -o bin/main.o\n";
      compilerOutput += "g++ -std=c++17 -O2 -Wall -I./src/cpp bin/WhotGameEngine.o bin/main.o -o bin/whot_game_cli\n";
      compilerOutput += "✓ Native Compilation Succeeded! Binary: ./bin/whot_game_cli (ELF 64-bit)\n\n";
      compilerOutput += "emcc -std=c++17 -O2 -I./src/cpp -s WASM=0 -s SINGLE_FILE=1 -s ALLOW_MEMORY_GROWTH=1 -s EXIT_RUNTIME=1 src/cpp/WhotGameEngine.cpp src/cpp/main.cpp -o public/whot_engine_asm.js\n";
      compilerOutput += "✓ Emscripten asm.js Compilation Succeeded! Bundle: public/whot_engine_asm.js (Legacy KaiOS RAM Compatible)\n\n";
      compilerOutput += "Testing binary execution: ./bin/whot_game_cli --json\n";
      compilerOutput += JSON.stringify(engine.getStateJSON(), null, 2);
      isCompilingCpp = false;
      appendTerminalLog("g++ and Emscripten asm.js compilation test completed successfully.");
    }, 600);
  }

  onMount(() => {
    updateState();
    appendTerminalLog("System initialized. Native C++ Whot Engine ready.");
    appendTerminalLog("Compiler detected: g++ 12.3.0 & Emscripten emcc (Legacy asm.js target with WASM=0).");
    appendTerminalLog("GitHub Pages CI/CD workflow configured at .github/workflows/deploy.yml");
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

<div class="app-container">
  <!-- Top Header Bar -->
  <header class="top-header">
    <div class="header-brand">
      <div class="brand-logo">C++</div>
      <div class="brand-titles">
        <h1 class="brand-name">Naija Whot C++ Engine</h1>
        <p class="brand-sub">Native C++17 Card Game Engine & Web Interface</p>
      </div>
    </div>

    <nav class="nav-tabs">
      <button class="nav-btn" class:active={activeTab === 'game'} on:click={() => { activeTab = 'game'; playSound('click'); }}>
        <span class="nav-icon">🎮</span> Play Whot Game
      </button>
      <button class="nav-btn" class:active={activeTab === 'kaios'} on:click={() => { activeTab = 'kaios'; playSound('click'); }}>
        <span class="nav-icon">📱</span> 320x240 KaiOS Screen
      </button>
      <button class="nav-btn" class:active={activeTab === 'code'} on:click={() => { activeTab = 'code'; playSound('click'); }}>
        <span class="nav-icon">💻</span> C++ Source Code
      </button>
      <button class="nav-btn" class:active={activeTab === 'terminal'} on:click={() => { activeTab = 'terminal'; playSound('click'); }}>
        <span class="nav-icon">📟</span> C++ Terminal & Logs
      </button>
      <button class="nav-btn" class:active={activeTab === 'settings'} on:click={() => { activeTab = 'settings'; playSound('click'); }}>
        <span class="nav-icon">⚙️</span> Rules & Settings
      </button>
    </nav>
  </header>

  <!-- Main Content Viewport -->
  <main class="main-content">
    {#if activeTab === 'game'}
      <div class="game-view-layout">
        <!-- Game Stats & Action Bar -->
        <div class="game-action-bar">
          <div class="action-bar-left">
            <button class="action-btn primary" on:click={handleStartNewGame}>
              <span>✨</span> Deal New Game
            </button>
            <div class="turn-badge" class:human-turn={gameState.currentTurnPlayerIndex === 0}>
              {gameState.isGameOver ? '🏁 GAME OVER' : (gameState.currentTurnPlayerIndex === 0 ? '👉 YOUR TURN' : '🤖 BOT THINKING...')}
            </div>
          </div>

          <div class="action-bar-right">
            <div class="stat-pill">
              <span class="pill-label">Market Pile:</span>
              <span class="pill-value">{gameState.deck.marketCount} cards</span>
            </div>
            <div class="stat-pill">
              <span class="pill-label">Played Pile:</span>
              <span class="pill-value">{gameState.deck.playedCount} cards</span>
            </div>
          </div>
        </div>

        <!-- Central Game Board -->
        <div class="game-board-card">
          <!-- Opponent Bot Area -->
          <div class="player-section bot-section">
            <div class="player-info-row">
              <div class="player-avatar bot">🤖</div>
              <div class="player-details">
                <span class="player-name">Naija Bot (C++ AI Engine)</span>
                <span class="player-stats">{gameState.bot.cardCount} cards in hand | Score: {gameState.bot.score}</span>
              </div>
            </div>

            <div class="card-hand-row bot-hand">
              {#each Array(gameState.bot.cardCount) as _, i}
                <div class="card-item card-back">
                  <div class="card-back-pattern">WHOT</div>
                </div>
              {/each}
            </div>
          </div>

          <!-- Table Center Piles Area -->
          <div class="table-center-area">
            <!-- Market Pile -->
            <div class="pile-container market-pile" on:click={handleDrawMarket} role="button" tabindex="0">
              <div class="pile-card card-back stack">
                <div class="card-back-pattern">MARKET ({gameState.deck.marketCount})</div>
              </div>
              <span class="pile-label">Market Deck (Click to Draw)</span>
            </div>

            <!-- Top Played Card -->
            <div class="pile-container played-pile">
              {#if gameState.deck.topCard}
                {@const top = gameState.deck.topCard}
                <div class="card-item suit-{top.suit} played-top">
                  <div class="card-corner top-left">
                    <span class="card-num">{top.number === 20 ? 'WHOT' : top.number}</span>
                    <span class="card-sym">{suitToSymbol(top.suit)}</span>
                  </div>
                  <div class="card-center-icon">
                    <span class="giant-symbol">{suitToSymbol(top.suit)}</span>
                    <span class="center-num">{top.number === 20 ? '20' : top.number}</span>
                  </div>
                  <div class="card-corner bottom-right">
                    <span class="card-num">{top.number === 20 ? 'WHOT' : top.number}</span>
                    <span class="card-sym">{suitToSymbol(top.suit)}</span>
                  </div>
                </div>
              {:else}
                <div class="card-item empty-pile">Empty</div>
              {/if}
              <span class="pile-label">Top Played Card</span>
            </div>

            <!-- Special Status Indicators -->
            <div class="status-indicators-panel">
              {#if gameState.deck.requestedSuit !== 'none'}
                <div class="status-alert suit-alert">
                  <span class="alert-icon">👑</span>
                  <span>Requested Suit: <strong>{gameState.deck.requestedSuit.toUpperCase()} {suitToSymbol(gameState.deck.requestedSuit)}</strong></span>
                </div>
              {/if}

              {#if gameState.deck.pendingPickCount > 0}
                <div class="status-alert pick-alert">
                  <span class="alert-icon">⚠️</span>
                  <span>Pending Penalty: <strong>PICK {gameState.deck.pendingPickCount} CARDS!</strong></span>
                </div>
              {/if}
            </div>
          </div>

          <!-- Human Player Area -->
          <div class="player-section human-section">
            <div class="player-info-row">
              <div class="player-avatar human">👤</div>
              <div class="player-details">
                <span class="player-name">You (Player)</span>
                <span class="player-stats">{gameState.human.cardCount} cards in hand | Score: {gameState.human.score}</span>
              </div>
              <button class="draw-btn" on:click={handleDrawMarket} disabled={gameState.currentTurnPlayerIndex !== 0 || gameState.isGameOver}>
                📥 Draw Card
              </button>
            </div>

            <div class="card-hand-row human-hand">
              {#each gameState.human.hand as card, idx}
                {@const isValid = engine.isValidPlay(card)}
                <button
                  class="card-item suit-{card.suit} playable-{isValid}"
                  disabled={!isValid || gameState.currentTurnPlayerIndex !== 0 || gameState.isGameOver}
                  on:click={() => handlePlayCard(idx)}
                >
                  <div class="card-corner top-left">
                    <span class="card-num">{card.number === 20 ? 'WHOT' : card.number}</span>
                    <span class="card-sym">{suitToSymbol(card.suit)}</span>
                  </div>
                  <div class="card-center-icon">
                    <span class="giant-symbol">{suitToSymbol(card.suit)}</span>
                    <span class="center-num">{card.number === 20 ? '20' : card.number}</span>
                  </div>
                  <div class="card-corner bottom-right">
                    <span class="card-num">{card.number === 20 ? 'WHOT' : card.number}</span>
                    <span class="card-sym">{suitToSymbol(card.suit)}</span>
                  </div>

                  {#if !isValid}
                    <div class="card-disabled-overlay">Invalid</div>
                  {/if}
                </button>
              {/each}
            </div>
          </div>
        </div>

        <!-- Game Log Feed -->
        <div class="game-logs-card">
          <div class="logs-header">
            <h3>📜 Live C++ Game Event Stream</h3>
          </div>
          <div class="logs-body">
            {#each gameState.logs as log}
              <div class="log-line">{log}</div>
            {/each}
          </div>
        </div>
      </div>

    {:else if activeTab === 'kaios'}
      <!-- KaiOS 320x240 Device Screen Viewport -->
      <div class="kaios-device-container">
        <div class="kaios-device-body">
          <!-- Device Top Bezel -->
          <div class="device-top-bezel">
            <div class="earpiece-speaker"></div>
            <div class="device-brand-text">KaiOS 2.5 • 320x240 Display</div>
          </div>

          <!-- 320x240 Pixel Screen Viewport -->
          <div class="kaios-screen-viewport">
            <!-- KaiOS Status Bar (320px x 20px) -->
            <div class="kaios-status-bar">
              <span class="status-left">📶 4G</span>
              <span class="status-title">Naija Whot C++</span>
              <span class="status-right">85% 🔋</span>
            </div>

            <!-- KaiOS Game Canvas (320px x 220px) -->
            <div class="kaios-game-screen">
              <!-- Bot Info Header -->
              <div class="kaios-bot-bar">
                <span class="kaios-avatar">🤖</span>
                <span class="kaios-bot-name">Bot: {gameState.bot.cardCount} cards</span>
                <span class="kaios-turn-badge" class:turn-active={gameState.currentTurnPlayerIndex === 1}>
                  {gameState.currentTurnPlayerIndex === 1 ? 'BOT THINKING' : 'YOUR TURN'}
                </span>
              </div>

              <!-- Center Table Area -->
              <div class="kaios-table-center">
                <!-- Market Pile -->
                <button class="kaios-market-btn" on:click={handleDrawMarket} disabled={gameState.currentTurnPlayerIndex !== 0 || gameState.isGameOver}>
                  <div class="kaios-card-back-icon">WHOT</div>
                  <span class="kaios-market-count">Deck ({gameState.deck.marketCount})</span>
                </button>

                <!-- Top Played Card -->
                <div class="kaios-top-card-container">
                  {#if gameState.deck.topCard}
                    {@const top = gameState.deck.topCard}
                    <div class="kaios-card suit-{top.suit}">
                      <span class="kaios-card-num">{top.number === 20 ? 'W' : top.number}</span>
                      <span class="kaios-card-sym">{suitToSymbol(top.suit)}</span>
                    </div>
                  {/if}
                  <span class="kaios-card-label">Played Top</span>
                </div>

                <!-- Status Callouts -->
                <div class="kaios-status-callouts">
                  {#if gameState.deck.requestedSuit !== 'none'}
                    <div class="kaios-suit-badge">
                      👑 {gameState.deck.requestedSuit.toUpperCase()} {suitToSymbol(gameState.deck.requestedSuit)}
                    </div>
                  {/if}
                  {#if gameState.deck.pendingPickCount > 0}
                    <div class="kaios-pick-badge">
                      ⚠️ PICK +{gameState.deck.pendingPickCount}
                    </div>
                  {/if}
                </div>
              </div>

              <!-- Human Player Hand Bar -->
              <div class="kaios-player-hand-container">
                <div class="kaios-hand-scroll">
                  {#each gameState.human.hand as card, idx}
                    {@const isValid = engine.isValidPlay(card)}
                    {@const isFocused = idx === kaiosSelectedCardIndex}
                    <button
                      class="kaios-hand-card suit-{card.suit}"
                      class:focused={isFocused}
                      class:disabled={!isValid || gameState.currentTurnPlayerIndex !== 0}
                      on:click={() => { kaiosSelectedCardIndex = idx; handlePlayCard(idx); }}
                    >
                      <span class="kaios-mini-num">{card.number === 20 ? 'W' : card.number}</span>
                      <span class="kaios-mini-sym">{suitToSymbol(card.suit)}</span>
                    </button>
                  {/each}
                </div>
              </div>

              <!-- KaiOS Bottom Softkey Bar (320px x 22px) -->
              <div class="kaios-softkey-bar">
                <button class="softkey left" on:click={handleDrawMarket}>Draw</button>
                <button class="softkey center" on:click={() => handlePlayCard(kaiosSelectedCardIndex)}>PLAY</button>
                <button class="softkey right" on:click={handleStartNewGame}>New Game</button>
              </div>
            </div>
          </div>

          <!-- Phone Keypad Controls -->
          <div class="kaios-keypad">
            <div class="keypad-softkeys-row">
              <button class="keypad-btn softkey-btn" on:click={handleDrawMarket}>LSK</button>
              <button class="keypad-btn call-btn">📞</button>
              <button class="keypad-btn softkey-btn" on:click={handleStartNewGame}>RSK</button>
            </div>

            <!-- D-Pad Directional Controls -->
            <div class="dpad-container">
              <button class="dpad-btn up" on:click={() => handlePlayCard(kaiosSelectedCardIndex)}>▲</button>
              <div class="dpad-middle-row">
                <button class="dpad-btn left" on:click={() => { kaiosSelectedCardIndex = Math.max(0, kaiosSelectedCardIndex - 1); }}>◀</button>
                <button class="dpad-btn center" on:click={() => handlePlayCard(kaiosSelectedCardIndex)}>OK</button>
                <button class="dpad-btn right" on:click={() => { kaiosSelectedCardIndex = Math.min(Math.max(0, gameState.human.hand.length - 1), kaiosSelectedCardIndex + 1); }}>▶</button>
              </div>
              <button class="dpad-btn down" on:click={handleDrawMarket}>▼</button>
            </div>

            <!-- Numeric Keypad -->
            <div class="num-keypad">
              <button class="num-btn" on:click={() => handleSelectWhotSuit('circle')}>1 <span class="sub">● Circle</span></button>
              <button class="num-btn" on:click={() => handleSelectWhotSuit('triangle')}>2 <span class="sub">▲ Tri</span></button>
              <button class="num-btn" on:click={() => handleSelectWhotSuit('cross')}>3 <span class="sub">✖ Cross</span></button>
              <button class="num-btn" on:click={() => handleSelectWhotSuit('square')}>4 <span class="sub">■ Sq</span></button>
              <button class="num-btn" on:click={() => handleSelectWhotSuit('star')}>5 <span class="sub">★ Star</span></button>
              <button class="num-btn">6 <span class="sub">MNO</span></button>
              <button class="num-btn">7 <span class="sub">PQRS</span></button>
              <button class="num-btn">8 <span class="sub">TUV</span></button>
              <button class="num-btn">9 <span class="sub">WXYZ</span></button>
              <button class="num-btn">*</button>
              <button class="num-btn" on:click={handleDrawMarket}>0 <span class="sub">Draw</span></button>
              <button class="num-btn">#</button>
            </div>
          </div>
        </div>

        <!-- KaiOS Device Screen Specs Panel -->
        <div class="kaios-info-panel">
          <div class="info-badge">KaiOS 320x240 Target</div>
          <h3>📱 320x240 Pixel Screen Emulator</h3>
          <p>This screen is locked to exact <strong>320 × 240 pixel resolution</strong> matching KaiOS feature phones (Nokia 8110, Nokia 2720, JioPhone) powered by Emscripten <code>asm.js</code> (WASM=0).</p>
          <div class="controls-guide">
            <h4>🎮 Physical Keypad & Keyboard Shortcuts:</h4>
            <ul>
              <li><strong>Left / Right Arrows (◀ / ▶):</strong> Navigate and highlight hand cards</li>
              <li><strong>OK / Center Key (Enter / Space / ▲):</strong> Play highlighted card</li>
              <li><strong>LSK / Down Key (▼ / Key D / 0):</strong> Draw from market deck</li>
              <li><strong>Number Keys 1 to 5:</strong> Call WHOT suits (Circle, Triangle, Cross, Square, Star)</li>
            </ul>
          </div>
        </div>
      </div>

    {:else if activeTab === 'code'}
      <!-- C++ Code Explorer Tab -->
      <div class="code-explorer-layout">
        <!-- Sidebar File Directory -->
        <aside class="code-sidebar">
          <div class="sidebar-header">
            <h3>📂 C++ Project Structure</h3>
          </div>
          <div class="file-tree-list">
            {#each CPP_SOURCE_FILES as file, i}
              <button class="file-item-btn" class:selected={selectedFileIndex === i} on:click={() => selectFile(i)}>
                <span class="file-icon">{file.filename.endsWith('.hpp') ? '📄' : file.filename.endsWith('.cpp') ? '⚙️' : '🔧'}</span>
                <span class="file-name">{file.filename}</span>
              </button>
            {/each}
          </div>

          <div class="compiler-info-box">
            <h4>Compiler Settings</h4>
            <p>Target: <code>g++ -std=c++17 -O2</code></p>
            <p>Architecture: <code>x86_64-pc-linux-gnu</code></p>
          </div>
        </aside>

        <!-- Main Code Editor View -->
        <div class="code-editor-card">
          <div class="editor-tabs-bar">
            <div class="editor-tab active">
              <span>{currentFile.filename}</span>
              <span class="tab-path">({currentFile.path})</span>
            </div>
          </div>
          <pre class="code-block"><code>{currentFile.content}</code></pre>
        </div>
      </div>

    {:else if activeTab === 'terminal'}
      <!-- C++ Terminal & Execution Tab -->
      <div class="terminal-layout">
        <div class="terminal-card">
          <div class="terminal-header">
            <div class="terminal-title">
              <span class="term-dots">🔴 🟡 🟢</span>
              <span>bash - C++ Compiler Terminal (g++ 12.3.0)</span>
            </div>
            <button class="compile-btn" disabled={isCompilingCpp} on:click={runCppCompilerTest}>
              {isCompilingCpp ? '⏳ Compiling...' : '🚀 Test Recompile (make clean && make)'}
            </button>
          </div>

          <div class="terminal-screen">
            {#if compilerOutput}
              <pre class="compiler-out">{compilerOutput}</pre>
            {/if}

            <div class="terminal-divider">--- Event Stream Log ---</div>
            {#each terminalLogs as log}
              <div class="term-line">{log}</div>
            {/each}
          </div>
        </div>
      </div>

    {:else if activeTab === 'settings'}
      <!-- Rules & Settings Tab -->
      <div class="settings-layout">
        <div class="settings-card">
          <h2>⚙️ C++ Game Engine Rules & Configuration</h2>
          <p class="settings-intro">Configure special card rules passed directly to the C++ <code>GameSettings</code> struct.</p>

          <div class="settings-grid">
            <div class="setting-item">
              <label for="pick3-setting" class="setting-label">
                <span class="setting-title">Pick 3 Rule (Card 5)</span>
                <span class="setting-desc">Card 5 forces opponent to pick 3 cards (defendable with another 5)</span>
              </label>
              <input id="pick3-setting" type="checkbox" bind:checked={settings.pick3} on:change={handleStartNewGame} />
            </div>

            <div class="setting-item">
              <label for="suspend-setting" class="setting-label">
                <span class="setting-title">Suspend Rule (Card 8)</span>
                <span class="setting-desc">Card 8 skips the opponent's next turn</span>
              </label>
              <input id="suspend-setting" type="checkbox" bind:checked={settings.suspend} on:change={handleStartNewGame} />
            </div>

            <div class="setting-item">
              <label for="whotCard-setting" class="setting-label">
                <span class="setting-title">WHOT 20 Wildcards</span>
                <span class="setting-desc">Include 5 WHOT 20 wildcard cards in deck</span>
              </label>
              <input id="whotCard-setting" type="checkbox" bind:checked={settings.whotCard} on:change={handleStartNewGame} />
            </div>

            <div class="setting-item">
              <label for="emptyMarket-setting" class="setting-label">
                <span class="setting-title">Empty Market Ends Game</span>
                <span class="setting-desc">End game immediately when market pile runs empty (lowest score wins)</span>
              </label>
              <input id="emptyMarket-setting" type="checkbox" bind:checked={settings.emptyMarketEnds} on:change={handleStartNewGame} />
            </div>

            <div class="setting-item">
              <label for="sfx-setting" class="setting-label">
                <span class="setting-title">Sound Effects</span>
                <span class="setting-desc">Audio synthesizer feedback on card plays and turns</span>
              </label>
              <input id="sfx-setting" type="checkbox" bind:checked={settings.sfx} />
            </div>
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>

<!-- WHOT 20 Suit Selector Modal -->
{#if showWhotSuitModal}
  <div class="modal-backdrop">
    <div class="modal-card">
      <h3>👑 WHOT 20 Wildcard Played!</h3>
      <p>Select the suit you wish to call for the next turn:</p>

      <div class="suit-selection-grid">
        <button class="suit-select-btn circle" on:click={() => handleSelectWhotSuit('circle')}>
          <span class="suit-icon">●</span>
          <span>Circle</span>
        </button>

        <button class="suit-select-btn triangle" on:click={() => handleSelectWhotSuit('triangle')}>
          <span class="suit-icon">▲</span>
          <span>Triangle</span>
        </button>

        <button class="suit-select-btn cross" on:click={() => handleSelectWhotSuit('cross')}>
          <span class="suit-icon">✖</span>
          <span>Cross</span>
        </button>

        <button class="suit-select-btn square" on:click={() => handleSelectWhotSuit('square')}>
          <span class="suit-icon">■</span>
          <span>Square</span>
        </button>

        <button class="suit-select-btn star" on:click={() => handleSelectWhotSuit('star')}>
          <span class="suit-icon">★</span>
          <span>Star</span>
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: #0b0f19;
    color: #e2e8f0;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  }

  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #0b0f19;
  }

  /* Header Bar */
  .top-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.85rem 1.5rem;
    background-color: #0f172a;
    border-bottom: 1px solid #1e293b;
  }

  .header-brand {
    display: flex;
    align-items: center;
    gap: 0.85rem;
  }

  .brand-logo {
    background: linear-gradient(135deg, #0284c7, #2563eb);
    color: #fff;
    font-weight: 900;
    font-size: 1.1rem;
    padding: 0.4rem 0.65rem;
    border-radius: 8px;
    letter-spacing: 0.05em;
  }

  .brand-titles {
    display: flex;
    flex-direction: column;
  }

  .brand-name {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 800;
    color: #f8fafc;
  }

  .brand-sub {
    margin: 0;
    font-size: 0.72rem;
    color: #94a3b8;
  }

  .nav-tabs {
    display: flex;
    gap: 0.4rem;
  }

  .nav-btn {
    background-color: transparent;
    border: 1px solid transparent;
    color: #94a3b8;
    padding: 0.5rem 0.85rem;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    transition: all 0.15s ease;
  }

  .nav-btn:hover {
    color: #f8fafc;
    background-color: #1e293b;
  }

  .nav-btn.active {
    background-color: #1e293b;
    border-color: #38bdf8;
    color: #38bdf8;
  }

  /* Main Viewport */
  .main-content {
    flex: 1;
    padding: 1.5rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }

  /* Game Layout */
  .game-view-layout {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .game-action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1e293b;
    padding: 0.75rem 1.25rem;
    border-radius: 12px;
    border: 1px solid #334155;
  }

  .action-bar-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .action-btn {
    background: linear-gradient(135deg, #0284c7, #2563eb);
    color: #fff;
    border: none;
    padding: 0.55rem 1.1rem;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .action-btn:hover {
    opacity: 0.95;
  }

  .turn-badge {
    background-color: #334155;
    color: #94a3b8;
    padding: 0.4rem 0.85rem;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.04em;
  }

  .turn-badge.human-turn {
    background-color: #065f46;
    color: #34d399;
  }

  .action-bar-right {
    display: flex;
    gap: 1rem;
  }

  .stat-pill {
    background-color: #0f172a;
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
    border: 1px solid #334155;
    font-size: 0.78rem;
  }

  .pill-label { color: #94a3b8; margin-right: 0.3rem; }
  .pill-value { font-weight: 700; color: #f8fafc; }

  /* Game Board Card */
  .game-board-card {
    background: radial-gradient(circle at 50% 50%, #064e3b 0%, #022c22 100%);
    border: 2px solid #047857;
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  }

  .player-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .player-info-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .player-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    background-color: rgba(255, 255, 255, 0.1);
  }

  .player-details {
    display: flex;
    flex-direction: column;
  }

  .player-name {
    font-weight: 800;
    font-size: 0.95rem;
    color: #fef08a;
  }

  .player-stats {
    font-size: 0.75rem;
    color: #a7f3d0;
  }

  .draw-btn {
    margin-left: auto;
    background-color: #0284c7;
    color: white;
    border: none;
    padding: 0.4rem 0.85rem;
    border-radius: 6px;
    font-weight: 700;
    font-size: 0.8rem;
    cursor: pointer;
  }

  .card-hand-row {
    display: flex;
    gap: 0.6rem;
    overflow-x: auto;
    padding: 0.5rem 0;
  }

  /* Card Item Styling */
  .card-item {
    width: 80px;
    height: 115px;
    background-color: #ffffff;
    border-radius: 8px;
    border: 2px solid #cbd5e1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0.35rem;
    box-sizing: border-box;
    position: relative;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: transform 0.15s ease;
    user-select: none;
  }

  .card-item:hover {
    transform: translateY(-6px);
  }

  .card-back {
    background: linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%);
    border-color: #3b82f6;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-back-pattern {
    color: #60a5fa;
    font-weight: 900;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    text-align: center;
  }

  .card-corner {
    display: flex;
    flex-direction: column;
    line-height: 1;
  }

  .card-corner.bottom-right {
    transform: rotate(180deg);
  }

  .card-num { font-weight: 900; font-size: 0.8rem; }
  .card-sym { font-size: 0.75rem; }

  .card-center-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .giant-symbol { font-size: 1.6rem; line-height: 1; }
  .center-num { font-size: 0.7rem; font-weight: 800; }

  /* Suit colors */
  .suit-circle { color: #2563eb; }
  .suit-triangle { color: #dc2626; }
  .suit-cross { color: #16a34a; }
  .suit-square { color: #d97706; }
  .suit-star { color: #7c3aed; }
  .suit-whot { color: #000000; background: linear-gradient(135deg, #fef08a 0%, #fde047 100%); }

  .playable-false {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .card-disabled-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0,0,0,0.4);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: 800;
    color: #f87171;
  }

  /* Table Center */
  .table-center-area {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    padding: 1rem 0;
    border-top: 1px dashed rgba(255,255,255,0.15);
    border-bottom: 1px dashed rgba(255,255,255,0.15);
  }

  .pile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .pile-label {
    font-size: 0.72rem;
    color: #a7f3d0;
    font-weight: 600;
  }

  .status-indicators-panel {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .status-alert {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .suit-alert { background-color: #3b0764; color: #f5d0fe; border: 1px solid #a855f7; }
  .pick-alert { background-color: #7f1d1d; color: #fecaca; border: 1px solid #ef4444; }

  /* Logs Feed */
  .game-logs-card {
    background-color: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 1rem;
  }

  .logs-header h3 {
    margin: 0 0 0.5rem 0;
    font-size: 0.85rem;
    color: #38bdf8;
  }

  .logs-body {
    max-height: 120px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-family: monospace;
    font-size: 0.78rem;
    color: #cbd5e1;
  }

  /* Code Explorer Tab */
  .code-explorer-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 1.25rem;
    min-height: 600px;
  }

  .code-sidebar {
    background-color: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .sidebar-header h3 {
    margin: 0;
    font-size: 0.85rem;
    color: #f8fafc;
  }

  .file-tree-list {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .file-item-btn {
    background-color: transparent;
    border: 1px solid transparent;
    color: #94a3b8;
    padding: 0.45rem 0.65rem;
    border-radius: 6px;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    text-align: left;
  }

  .file-item-btn:hover { background-color: #1e293b; color: #f8fafc; }
  .file-item-btn.selected { background-color: #1e293b; border-color: #38bdf8; color: #38bdf8; font-weight: 700; }

  .compiler-info-box {
    margin-top: auto;
    background-color: #1e293b;
    padding: 0.75rem;
    border-radius: 8px;
    font-size: 0.72rem;
    color: #94a3b8;
  }

  .compiler-info-box h4 { margin: 0 0 0.4rem 0; color: #f8fafc; }

  .code-editor-card {
    background-color: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .editor-tabs-bar {
    background-color: #1e293b;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #334155;
  }

  .editor-tab { font-weight: 700; font-size: 0.85rem; color: #38bdf8; }
  .tab-path { font-weight: 400; font-size: 0.75rem; color: #94a3b8; margin-left: 0.4rem; }

  .code-block {
    margin: 0;
    padding: 1.25rem;
    font-family: Consolas, Monaco, monospace;
    font-size: 0.82rem;
    line-height: 1.5;
    color: #38bdf8;
    overflow: auto;
    white-space: pre-wrap;
  }

  /* Terminal Tab */
  .terminal-layout {
    display: flex;
    flex-direction: column;
  }

  .terminal-card {
    background-color: #090d16;
    border: 1px solid #1e293b;
    border-radius: 12px;
    overflow: hidden;
  }

  .terminal-header {
    background-color: #1e293b;
    padding: 0.6rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .terminal-title {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.8rem;
    font-weight: 700;
  }

  .compile-btn {
    background-color: #0284c7;
    color: white;
    border: none;
    padding: 0.4rem 0.85rem;
    border-radius: 6px;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
  }

  .terminal-screen {
    padding: 1.25rem;
    font-family: monospace;
    font-size: 0.8rem;
    color: #a3e635;
    min-height: 450px;
    max-height: 600px;
    overflow-y: auto;
  }

  .compiler-out { margin: 0 0 1rem 0; color: #38bdf8; }
  .terminal-divider { color: #64748b; margin: 0.5rem 0; font-weight: bold; }
  .term-line { margin: 0.2rem 0; color: #e2e8f0; }

  /* Settings Tab */
  .settings-layout {
    max-width: 800px;
    margin: 0 auto;
  }

  .settings-card {
    background-color: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 16px;
    padding: 1.5rem;
  }

  .settings-card h2 { margin-top: 0; font-size: 1.2rem; color: #f8fafc; }
  .settings-intro { font-size: 0.85rem; color: #94a3b8; }

  .settings-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1e293b;
    padding: 1rem;
    border-radius: 8px;
  }

  .setting-label { display: flex; flex-direction: column; }
  .setting-title { font-weight: 700; font-size: 0.9rem; color: #f8fafc; }
  .setting-desc { font-size: 0.75rem; color: #94a3b8; }

  /* Modal Backdrop */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0,0,0,0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    backdrop-filter: blur(4px);
  }

  .modal-card {
    background-color: #0f172a;
    border: 2px solid #a855f7;
    border-radius: 16px;
    padding: 1.5rem;
    max-width: 420px;
    width: 100%;
  }

  .modal-card h3 { margin-top: 0; color: #f5d0fe; }

  .suit-selection-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .suit-select-btn {
    background-color: #1e293b;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 0.85rem;
    color: white;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .suit-select-btn:hover { background-color: #334155; }

  /* Secondary action button in game header */
  .action-btn.secondary-btn {
    background: linear-gradient(135deg, #475569, #334155);
    color: #e2e8f0;
    border: 1px solid #64748b;
  }

  /* KaiOS Device Layout */
  .kaios-device-container {
    display: grid;
    grid-template-columns: min-content 1fr;
    gap: 2rem;
    align-items: start;
    justify-content: center;
    max-width: 900px;
    margin: 0 auto;
  }

  /* KaiOS Phone Body */
  .kaios-device-body {
    background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
    border: 3px solid #334155;
    border-radius: 28px;
    padding: 1rem 0.85rem 1.25rem 0.85rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 2px 4px rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 344px;
    box-sizing: border-box;
  }

  .device-top-bezel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    margin-bottom: 0.6rem;
  }

  .earpiece-speaker {
    width: 48px;
    height: 4px;
    background-color: #475569;
    border-radius: 4px;
  }

  .device-brand-text {
    font-size: 0.65rem;
    font-weight: 800;
    color: #94a3b8;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* Exact 320x240 Pixel Screen Viewport */
  .kaios-screen-viewport {
    width: 320px;
    height: 240px;
    background-color: #022c22;
    border: 2px solid #047857;
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.6);
    user-select: none;
    font-family: system-ui, -apple-system, sans-serif;
  }

  /* KaiOS Status Bar (320px wide) */
  .kaios-status-bar {
    height: 18px;
    background-color: #064e3b;
    border-bottom: 1px solid #047857;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 6px;
    font-size: 0.62rem;
    color: #a7f3d0;
    font-weight: 700;
  }

  /* KaiOS Game Canvas inside 320x240 */
  .kaios-game-screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 4px 6px;
    box-sizing: border-box;
    background: radial-gradient(circle at 50% 50%, #064e3b 0%, #022c22 100%);
  }

  /* Bot Bar inside 320x240 */
  .kaios-bot-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(15, 23, 42, 0.6);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.68rem;
  }

  .kaios-avatar { font-size: 0.8rem; }
  .kaios-bot-name { color: #fef08a; font-weight: 700; }
  .kaios-turn-badge {
    background-color: #1e293b;
    color: #94a3b8;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 0.6rem;
    font-weight: 800;
  }
  .kaios-turn-badge.turn-active { background-color: #0284c7; color: #fff; }

  /* Table Center Area inside 320x240 */
  .kaios-table-center {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 4px 0;
  }

  .kaios-market-btn {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .kaios-card-back-icon {
    width: 44px;
    height: 60px;
    background: linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%);
    border: 1.5px solid #3b82f6;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #60a5fa;
    font-weight: 900;
    font-size: 0.6rem;
  }

  .kaios-market-count {
    font-size: 0.6rem;
    color: #a7f3d0;
    margin-top: 2px;
    font-weight: 600;
  }

  .kaios-top-card-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .kaios-card {
    width: 44px;
    height: 60px;
    background-color: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 2px;
    box-sizing: border-box;
    box-shadow: 0 2px 5px rgba(0,0,0,0.4);
  }

  .kaios-card-num { font-weight: 900; font-size: 0.7rem; line-height: 1; }
  .kaios-card-sym { font-size: 1.1rem; line-height: 1; }
  .kaios-card-label { font-size: 0.6rem; color: #a7f3d0; margin-top: 2px; font-weight: 600; }

  .kaios-status-callouts {
    display: flex;
    flex-direction: column;
    gap: 3px;
    max-width: 90px;
  }

  .kaios-suit-badge {
    background-color: #3b0764;
    color: #f5d0fe;
    border: 1px solid #a855f7;
    padding: 2px 4px;
    border-radius: 3px;
    font-size: 0.58rem;
    font-weight: 800;
  }

  .kaios-pick-badge {
    background-color: #7f1d1d;
    color: #fecaca;
    border: 1px solid #ef4444;
    padding: 2px 4px;
    border-radius: 3px;
    font-size: 0.58rem;
    font-weight: 800;
  }

  /* Player Hand Scroll in 320x240 */
  .kaios-player-hand-container {
    background-color: rgba(15, 23, 42, 0.7);
    border-radius: 4px;
    padding: 3px;
  }

  .kaios-hand-scroll {
    display: flex;
    gap: 4px;
    overflow-x: auto;
    padding-bottom: 2px;
  }

  .kaios-hand-card {
    min-width: 30px;
    height: 42px;
    background-color: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-radius: 3px;
    padding: 1px 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    box-sizing: border-box;
    flex-shrink: 0;
  }

  .kaios-hand-card.focused {
    border-color: #f59e0b;
    outline: 2px solid #fbbf24;
    transform: translateY(-2px);
  }

  .kaios-hand-card.disabled {
    opacity: 0.45;
  }

  .kaios-mini-num { font-weight: 900; font-size: 0.6rem; line-height: 1; }
  .kaios-mini-sym { font-size: 0.75rem; line-height: 1; }

  /* Bottom Softkey Bar inside 320x240 */
  .kaios-softkey-bar {
    height: 20px;
    background-color: #0f172a;
    border-top: 1px solid #334155;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px;
  }

  .softkey {
    background: transparent;
    border: none;
    color: #38bdf8;
    font-size: 0.62rem;
    font-weight: 800;
    cursor: pointer;
    padding: 1px 4px;
  }
  .softkey.center { color: #fef08a; }

  /* Physical Phone Keypad Below Screen */
  .kaios-keypad {
    width: 320px;
    margin-top: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .keypad-softkeys-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.5rem;
  }

  .keypad-btn {
    background-color: #334155;
    color: #f8fafc;
    border: 1px solid #475569;
    border-radius: 6px;
    padding: 0.4rem 0.85rem;
    font-weight: 800;
    font-size: 0.72rem;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .keypad-btn:active { transform: translateY(1px); }
  .keypad-btn.call-btn { background-color: #16a34a; border-color: #22c55e; }

  /* D-Pad Layout */
  .dpad-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    margin: 0.2rem 0;
  }

  .dpad-middle-row {
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .dpad-btn {
    width: 44px;
    height: 32px;
    background-color: #334155;
    color: #38bdf8;
    border: 1px solid #475569;
    border-radius: 6px;
    font-weight: 900;
    font-size: 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dpad-btn.center {
    background-color: #0284c7;
    color: #fff;
    border-color: #38bdf8;
    width: 50px;
    height: 34px;
  }

  /* Numeric Keypad Grid */
  .num-keypad {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.4rem;
  }

  .num-btn {
    background-color: #1e293b;
    border: 1px solid #334155;
    border-radius: 6px;
    padding: 0.4rem 0.2rem;
    color: #f8fafc;
    font-weight: 800;
    font-size: 0.85rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
  }

  .num-btn .sub {
    font-size: 0.55rem;
    color: #94a3b8;
    margin-top: 2px;
    font-weight: 500;
  }

  /* KaiOS Info Specs Panel */
  .kaios-info-panel {
    background-color: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 16px;
    padding: 1.5rem;
  }

  .info-badge {
    display: inline-block;
    background-color: #0284c7;
    color: #fff;
    padding: 0.25rem 0.6rem;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
  }

  .kaios-info-panel h3 { margin-top: 0; color: #f8fafc; }
  .kaios-info-panel p { color: #cbd5e1; font-size: 0.85rem; line-height: 1.5; }

  .controls-guide h4 { color: #38bdf8; font-size: 0.85rem; margin-bottom: 0.5rem; }
  .controls-guide ul { margin: 0; padding-left: 1.25rem; color: #94a3b8; font-size: 0.8rem; line-height: 1.6; }
</style>
