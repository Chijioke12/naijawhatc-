#include "WhotGameEngine.hpp"
#include <iostream>
#include <string>
#include <cstring>

using namespace Whot;

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

    runInteractiveCliGame();
    return 0;
}
