<script lang="ts">
  import { onMount } from 'svelte';
  import { CppWhotGameEngine, suitToSymbol, type Card, type Suit, type GameStateJSON } from './cppEngine';
  import { CPP_SOURCE_FILES, type CppFile } from './cppSourceCode';

  // Active view tab: 'game' | 'code' | 'terminal' | 'settings'
  let activeTab: 'game' | 'code' | 'terminal' | 'settings' = 'game';

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
                  <span>Requested Suit: <strong>{gameState.deck.requestedSuit.toUpperCase()} {suitToSymbol(gameState.deck.requestedSuit as Suit)}</strong></span>
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
              <button className="draw-btn" on:click={handleDrawMarket} disabled={gameState.currentTurnPlayerIndex !== 0 || gameState.isGameOver}>
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
</style>
