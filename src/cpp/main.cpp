#include "WhotGameEngine.hpp"
#include <iostream>
#include <string>
#include <cstring>
#include <memory>

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#endif

using namespace Whot;

// Global Game Engine Instance for Emscripten / WebAssembly / asm.js
static std::unique_ptr<WhotGameEngine> g_engine = nullptr;
static std::string g_lastJsonState = "{}";
static std::string g_lastMessage = "";
static std::string g_lastBanter = "";

extern "C" {

EMSCRIPTEN_KEEPALIVE
void whot_init_game(int sfx, int aiBanter, int whotCard, int pick3, int suspend, int emptyMarketEnds) {
    GameSettings settings;
    settings.sfx = (sfx != 0);
    settings.aiBanter = (aiBanter != 0);
    settings.whotCard = (whotCard != 0);
    settings.pick3 = (pick3 != 0);
    settings.suspend = (suspend != 0);
    settings.emptyMarketEnds = (emptyMarketEnds != 0);

    g_engine = std::make_unique<WhotGameEngine>(settings);
    g_lastJsonState = g_engine->getStateJSON();
    g_lastMessage = "Game initialized (C++ Engine)";
    g_lastBanter = "";
}

EMSCRIPTEN_KEEPALIVE
int whot_play_card(int handIndex, int reqSuitInt) {
    if (!g_engine) {
        GameSettings s;
        g_engine = std::make_unique<WhotGameEngine>(s);
    }
    Suit reqSuit = Suit::NONE;
    if (reqSuitInt == 1) reqSuit = Suit::CIRCLE;
    else if (reqSuitInt == 2) reqSuit = Suit::TRIANGLE;
    else if (reqSuitInt == 3) reqSuit = Suit::CROSS;
    else if (reqSuitInt == 4) reqSuit = Suit::SQUARE;
    else if (reqSuitInt == 5) reqSuit = Suit::STAR;

    TurnResult res = g_engine->humanPlayCard(static_cast<size_t>(handIndex), reqSuit);
    g_lastJsonState = g_engine->getStateJSON();
    g_lastMessage = res.message;
    g_lastBanter = res.botBanter;
    return res.success ? 1 : 0;
}

EMSCRIPTEN_KEEPALIVE
int whot_draw_market() {
    if (!g_engine) return 0;
    TurnResult res = g_engine->humanDrawMarket();
    g_lastJsonState = g_engine->getStateJSON();
    g_lastMessage = res.message;
    g_lastBanter = res.botBanter;
    return res.success ? 1 : 0;
}

EMSCRIPTEN_KEEPALIVE
int whot_bot_turn() {
    if (!g_engine) return 0;
    TurnResult res = g_engine->executeBotTurn();
    g_lastJsonState = g_engine->getStateJSON();
    g_lastMessage = res.message;
    g_lastBanter = res.botBanter;
    return res.success ? 1 : 0;
}

EMSCRIPTEN_KEEPALIVE
const char* whot_get_state_json() {
    if (!g_engine) return "{}";
    g_lastJsonState = g_engine->getStateJSON();
    return g_lastJsonState.c_str();
}

EMSCRIPTEN_KEEPALIVE
const char* whot_get_last_message() {
    return g_lastMessage.c_str();
}

EMSCRIPTEN_KEEPALIVE
const char* whot_get_last_banter() {
    return g_lastBanter.c_str();
}

EMSCRIPTEN_KEEPALIVE
const char* whot_serialize_state() {
    if (!g_engine) return "{}";
    g_lastJsonState = g_engine->serializeState();
    return g_lastJsonState.c_str();
}

EMSCRIPTEN_KEEPALIVE
int whot_deserialize_state(const char* jsonStr) {
    if (!jsonStr) return 0;
    if (!g_engine) {
        GameSettings s;
        g_engine = std::make_unique<WhotGameEngine>(s);
    }
    bool ok = g_engine->deserializeState(jsonStr);
    if (ok) {
        g_lastJsonState = g_engine->getStateJSON();
    }
    return ok ? 1 : 0;
}

} // extern "C"

void runInteractiveCliGame() {
    GameSettings settings;
    WhotGameEngine game(settings);

    std::cout << "\n========================================================\n";
    std::cout << "        WELCOME TO NAIJA WHOT CARD GAME (C++ CLI)        \n";
    std::cout << "========================================================\n";

    while (!game.isGameOver) {
        std::cout << "\n" << game.getAsciiGameBoard() << "\n";

        if (game.currentTurnPlayerIndex == 0) {
            std::cout << "Your Move Options:\n";
            std::cout << "  [0-" << (game.human.hand.size() > 0 ? game.human.hand.size() - 1 : 0) << "] Play card index\n";
            std::cout << "  [m] Go to Market (Draw Card)\n";
            std::cout << "  [q] Quit game\n";
            std::cout << "Enter command: ";

            std::string input;
            if (!(std::cin >> input)) break;

            if (input == "q" || input == "Q") {
                std::cout << "Exiting game...\n";
                break;
            } else if (input == "m" || input == "M") {
                TurnResult res = game.humanDrawMarket();
                std::cout << "-> " << res.message << "\n";
            } else {
                try {
                    int cardIdx = std::stoi(input);
                    if (cardIdx >= 0 && cardIdx < static_cast<int>(game.human.hand.size())) {
                        Card selected = game.human.hand[cardIdx];
                        Suit reqSuit = Suit::NONE;

                        if (selected.suit == Suit::WHOT) {
                            std::cout << "WHOT 20! Select requested suit:\n";
                            std::cout << "  [1] Circle (●)\n  [2] Triangle (▲)\n  [3] Cross (✖)\n  [4] Square (■)\n  [5] Star (★)\n";
                            std::cout << "Select suit [1-5]: ";
                            int sChoice = 1;
                            std::cin >> sChoice;
                            if (sChoice == 1) reqSuit = Suit::CIRCLE;
                            else if (sChoice == 2) reqSuit = Suit::TRIANGLE;
                            else if (sChoice == 3) reqSuit = Suit::CROSS;
                            else if (sChoice == 4) reqSuit = Suit::SQUARE;
                            else if (sChoice == 5) reqSuit = Suit::STAR;
                        }

                        TurnResult res = game.humanPlayCard(cardIdx, reqSuit);
                        std::cout << "-> " << res.message << "\n";
                    } else {
                        std::cout << "Invalid card index!\n";
                    }
                } catch (...) {
                    std::cout << "Invalid command!\n";
                }
            }
        } else {
            std::cout << "Naija Bot is thinking...\n";
            TurnResult res = game.executeBotTurn();
            std::cout << "-> " << res.message << "\n";
            if (!res.botBanter.empty()) {
                std::cout << "Naija Bot says: \"" << res.botBanter << "\"\n";
            }
        }
    }

    if (game.isGameOver) {
        std::cout << "\n========================================================\n";
        std::cout << "                    GAME OVER RESULTS                    \n";
        std::cout << "========================================================\n";
        std::cout << "Winner: " << (game.winnerId == game.human.id ? "YOU!" : (game.winnerId == game.bot.id ? "NAIJA BOT!" : "DRAW!")) << "\n";
        std::cout << "Your Final Score: " << game.human.calculateScore() << "\n";
        std::cout << "Bot Final Score:  " << game.bot.calculateScore() << "\n";
        std::cout << "========================================================\n";
    }
}

void runAiVsAiSimulation() {
    GameSettings settings;
    WhotGameEngine game(settings);
    std::cout << "Running AI vs AI C++ Simulation...\n";
    int turnCount = 0;
    while (!game.isGameOver && turnCount < 200) {
        turnCount++;
        TurnResult res = game.executeBotTurn();
        if (game.isGameOver) break;
    }
    std::cout << game.getStateJSON() << "\n";
}

int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::strcmp(argv[1], "--ai-vs-ai") == 0) {
            runAiVsAiSimulation();
            return 0;
        } else if (std::strcmp(argv[1], "--json") == 0) {
            GameSettings settings;
            WhotGameEngine game(settings);
            std::cout << game.getStateJSON() << "\n";
            return 0;
        }
    }

#ifndef __EMSCRIPTEN__
    runInteractiveCliGame();
#endif
    return 0;
}
