#ifndef WHOT_GAME_ENGINE_HPP
#define WHOT_GAME_ENGINE_HPP

#include "Player.hpp"
#include <vector>
#include <string>

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
    int currentTurnPlayerIndex = 0; // 0 = Human, 1 = Bot
    bool isGameOver = false;
    std::string winnerId = "";
    std::vector<std::string> gameLogs;

    WhotGameEngine(const GameSettings& settings = GameSettings());

    void startNewGame(const GameSettings& settings = GameSettings());
    TurnResult humanPlayCard(size_t handIndex, Suit requestedSuitIfWhot = Suit::NONE);
    TurnResult humanDrawMarket();
    TurnResult executeBotTurn();

    Player& getCurrentPlayer() { return (currentTurnPlayerIndex == 0) ? human : bot; }
    Player& getOpponentPlayer() { return (currentTurnPlayerIndex == 0) ? bot : human; }

    void addLog(const std::string& msg) {
        gameLogs.push_back(msg);
        if (gameLogs.size() > 50) {
            gameLogs.erase(gameLogs.begin());
        }
    }

    std::string getAsciiGameBoard() const;
    std::string getStateJSON() const;

private:
    TurnResult processPlayedCard(Player& player, Player& opponent, Card card, Suit requestedSuit);
    void checkWinCondition();
};

} // namespace Whot

#endif // WHOT_GAME_ENGINE_HPP
