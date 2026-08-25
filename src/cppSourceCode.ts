export interface CppFile {
  filename: string;
  path: string;
  language: string;
  content: string;
}

export const CPP_SOURCE_FILES: CppFile[] = [
  {
    filename: "Card.hpp",
    path: "src/cpp/Card.hpp",
    language: "cpp",
    content: `#ifndef CARD_HPP
#define CARD_HPP

#include <string>
#include <vector>

namespace Whot {

enum class Suit {
    CIRCLE = 0,
    TRIANGLE = 1,
    CROSS = 2,
    SQUARE = 3,
    STAR = 4,
    WHOT = 5,
    NONE = 6
};

inline std::string suitToString(Suit s) {
    switch (s) {
        case Suit::CIRCLE:   return "circle";
        case Suit::TRIANGLE: return "triangle";
        case Suit::CROSS:    return "cross";
        case Suit::SQUARE:   return "square";
        case Suit::STAR:     return "star";
        case Suit::WHOT:     return "whot";
        default:             return "none";
    }
}

inline std::string suitToSymbol(Suit s) {
    switch (s) {
        case Suit::CIRCLE:   return "●";
        case Suit::TRIANGLE: return "▲";
        case Suit::CROSS:    return "✖";
        case Suit::SQUARE:   return "■";
        case Suit::STAR:     return "★";
        case Suit::WHOT:     return "👑";
        default:             return "?";
    }
}

struct Card {
    std::string id;
    Suit suit;
    int number;

    int getScoreValue() const {
        if (suit == Suit::WHOT) return 20;
        if (suit == Suit::STAR) return number * 2;
        return number;
    }

    std::string toString() const {
        if (suit == Suit::WHOT) {
            return "WHOT 20 " + suitToSymbol(suit);
        }
        return suitToString(suit) + " " + std::to_string(number) + " (" + suitToSymbol(suit) + ")";
    }

    std::string toJSON() const {
        return "{\\"id\\":\\"" + id + "\\",\\"suit\\":\\"" + suitToString(suit) + "\\",\\"number\\":" + std::to_string(number) + "}";
    }
};

} // namespace Whot

#endif // CARD_HPP`
  },
  {
    filename: "Deck.hpp",
    path: "src/cpp/Deck.hpp",
    language: "cpp",
    content: `#ifndef DECK_HPP
#define DECK_HPP

#include "Card.hpp"
#include <vector>
#include <algorithm>
#include <random>
#include <chrono>

namespace Whot {

struct GameSettings {
    bool sfx = true;
    bool aiBanter = true;
    bool whotCard = true;
    bool pick3 = true;
    bool suspend = true;
    bool emptyMarketEnds = false;
};

class Deck {
public:
    std::vector<Card> marketPile;
    std::vector<Card> playedPile;
    Suit currentRequestedSuit = Suit::NONE;
    int pendingPickCount = 0;
    GameSettings settings;

    Deck(const GameSettings& settings = GameSettings()) : settings(settings) {
        resetAndShuffle();
    }

    void resetAndShuffle() {
        marketPile.clear();
        playedPile.clear();
        currentRequestedSuit = Suit::NONE;
        pendingPickCount = 0;

        // ... Fisher-Yates shuffle & deck creation
    }

    bool isValidPlay(const Card& card) const {
        const Card* topCard = getTopPlayedCard();
        if (!topCard) return true;
        if (card.suit == Suit::WHOT) return true;
        if (pendingPickCount > 0) {
            if (topCard->number == 2 && card.number == 2) return true;
            if (topCard->number == 5 && card.number == 5 && settings.pick3) return true;
            return false;
        }
        if (currentRequestedSuit != Suit::NONE) {
            return card.suit == currentRequestedSuit;
        }
        return (card.suit == topCard->suit) || (card.number == topCard->number);
    }
};

} // namespace Whot

#endif // DECK_HPP`
  },
  {
    filename: "Player.hpp",
    path: "src/cpp/Player.hpp",
    language: "cpp",
    content: `#ifndef PLAYER_HPP
#define PLAYER_HPP

#include "Deck.hpp"
#include <string>
#include <vector>

namespace Whot {

class Player {
public:
    std::string id;
    std::string name;
    bool isHuman;
    std::vector<Card> hand;

    // AI Bot Card Selection Strategy
    int chooseBotPlay(const Deck& deck, Suit& outRequestedSuit) const {
        outRequestedSuit = Suit::NONE;
        std::vector<int> validIndices = getValidCardIndices(deck);
        if (validIndices.empty()) return -1;

        // Defend Pick 2 / Pick 3
        if (deck.pendingPickCount > 0) {
            for (int idx : validIndices) {
                if (hand[idx].number == 2 || hand[idx].number == 5) return idx;
            }
        }
        return validIndices[0];
    }
};

} // namespace Whot

#endif // PLAYER_HPP`
  },
  {
    filename: "WhotGameEngine.hpp",
    path: "src/cpp/WhotGameEngine.hpp",
    language: "cpp",
    content: `#ifndef WHOT_GAME_ENGINE_HPP
#define WHOT_GAME_ENGINE_HPP

#include "Player.hpp"

namespace Whot {

struct TurnResult {
    bool success = false;
    std::string message;
    bool gameOver = false;
    std::string winnerId;
    std::string botBanter;
};

class WhotGameEngine {
public:
    Player human;
    Player bot;
    Deck deck;
    int currentTurnPlayerIndex = 0;
    bool isGameOver = false;

    void startNewGame(const GameSettings& settings = GameSettings());
    TurnResult humanPlayCard(size_t handIndex, Suit requestedSuitIfWhot = Suit::NONE);
    TurnResult humanDrawMarket();
    TurnResult executeBotTurn();
    std::string getAsciiGameBoard() const;
    std::string getStateJSON() const;
};

} // namespace Whot

#endif`
  },
  {
    filename: "WhotGameEngine.cpp",
    path: "src/cpp/WhotGameEngine.cpp",
    language: "cpp",
    content: `#include "WhotGameEngine.hpp"
#include <iostream>

namespace Whot {

TurnResult WhotGameEngine::processPlayedCard(Player& player, Player& opponent, Card card, Suit requestedSuit) {
    TurnResult res;
    res.success = true;
    deck.playedPile.push_back(card);

    if (card.suit == Suit::WHOT) {
        deck.currentRequestedSuit = requestedSuit;
    } else if (card.number == 1) { // Hold On
        keepTurn = true;
    } else if (card.number == 2) { // Pick 2
        deck.pendingPickCount += 2;
    } else if (card.number == 5 && deck.settings.pick3) { // Pick 3
        deck.pendingPickCount += 3;
    } else if (card.number == 8 && deck.settings.suspend) { // Suspend
        keepTurn = true;
    } else if (card.number == 14) { // General Market
        opponent.addCard(deck.drawCard());
    }
    return res;
}

}`
  },
  {
    filename: "main.cpp",
    path: "src/cpp/main.cpp",
    language: "cpp",
    content: `#include "WhotGameEngine.hpp"
#include <iostream>

using namespace Whot;

int main(int argc, char* argv[]) {
    if (argc > 1 && std::strcmp(argv[1], "--json") == 0) {
        GameSettings settings;
        WhotGameEngine game(settings);
        std::cout << game.getStateJSON() << "\\n";
        return 0;
    }

    runInteractiveCliGame();
    return 0;
}`
  },
  {
    filename: "Makefile",
    path: "Makefile",
    language: "makefile",
    content: `CXX = g++
CXXFLAGS = -std=c++17 -O2 -Wall -I./src/cpp
BUILD_DIR = bin
SRC_DIR = src/cpp

SRCS = $(SRC_DIR)/WhotGameEngine.cpp $(SRC_DIR)/main.cpp
OBJS = $(BUILD_DIR)/WhotGameEngine.o $(BUILD_DIR)/main.o
TARGET = $(BUILD_DIR)/whot_game_cli

# Emscripten target for KaiOS low-RAM legacy devices (asm.js output via -s WASM=0)
EMCC = emcc
EMFLAGS = -std=c++17 -O2 -I./src/cpp -s WASM=0 -s SINGLE_FILE=1 -s ALLOW_MEMORY_GROWTH=1 -s EXIT_RUNTIME=1
ASM_TARGET = public/whot_engine_asm.js

all: $(TARGET) asmjs

$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

$(BUILD_DIR)/%.o: $(SRC_DIR)/%.cpp | $(BUILD_DIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) $(OBJS) -o $(TARGET)

asmjs: $(SRCS)
	@mkdir -p public
	@which emcc > /dev/null 2>&1 && $(EMCC) $(EMFLAGS) $(SRCS) -o $(ASM_TARGET) || echo "emcc not found locally; will compile via GitHub Actions workflow"

clean:
	rm -rf $(BUILD_DIR) $(ASM_TARGET)

run: $(TARGET)
	./$(TARGET)

.PHONY: all clean run asmjs`
  },
  {
    filename: "deploy.yml",
    path: ".github/workflows/deploy.yml",
    language: "yaml",
    content: `name: Compile C++ to asm.js & Deploy to GitHub Pages

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Setup Emscripten (emsdk) for Legacy asm.js (WASM=0)
        uses: mymindstorm/setup-emsdk@v14
        with:
          version: 3.1.50
          actions-cache-folder: 'emsdk-cache'

      - name: Verify Emscripten Compiler
        run: |
          emcc --version

      - name: Compile C++ Engine to asm.js (KaiOS RAM Optimized)
        run: |
          mkdir -p public
          emcc -std=c++17 -O2 -I./src/cpp \\
            -s WASM=0 \\
            -s SINGLE_FILE=1 \\
            -s ALLOW_MEMORY_GROWTH=1 \\
            -s EXIT_RUNTIME=1 \\
            src/cpp/WhotGameEngine.cpp src/cpp/main.cpp \\
            -o public/whot_engine_asm.js
          echo "Emscripten asm.js build successfully generated in public/whot_engine_asm.js"
          ls -lh public/whot_engine_asm.js

      - name: Install Node Dependencies
        run: npm ci || npm install

      - name: Build Web Application (Outputs to dist/)
        run: npm run build

      - name: Ensure asm.js bundle is included in dist/
        run: |
          mkdir -p dist
          cp public/whot_engine_asm.js dist/ || true
          ls -lh dist/

      - name: Upload GitHub Pages Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`
  }
];
