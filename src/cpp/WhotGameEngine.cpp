#include "WhotGameEngine.hpp"
#include <iostream>
#include <sstream>
#include <iomanip>

namespace Whot {

WhotGameEngine::WhotGameEngine(const GameSettings& settings) {
    startNewGame(settings);
}

void WhotGameEngine::startNewGame(const GameSettings& settings) {
    deck = Deck(settings);
    human = Player("player_human", "You (Player)", true);
    bot = Player("player_bot", "Naija Bot (AI)", false);
    currentTurnPlayerIndex = 0;
    isGameOver = false;
    winnerId = "";
    gameLogs.clear();

    // Deal 6 cards to each player
    for (int i = 0; i < 6; ++i) {
        human.addCard(deck.drawCard());
        bot.addCard(deck.drawCard());
    }

    addLog("--- New C++ Whot Game Started ---");
    addLog("Dealt 6 cards to You and Naija Bot.");
    if (deck.getTopPlayedCard()) {
        addLog("Top card on table: " + deck.getTopPlayedCard()->toString());
    }
}

TurnResult WhotGameEngine::humanPlayCard(size_t handIndex, Suit requestedSuitIfWhot) {
    TurnResult res;
    if (isGameOver) {
        res.message = "Game is already over.";
        return res;
    }
    if (currentTurnPlayerIndex != 0) {
        res.message = "It is not your turn!";
        return res;
    }

    if (handIndex >= human.hand.size()) {
        res.message = "Invalid card selection index.";
        return res;
    }

    Card cardToPlay = human.hand[handIndex];
    if (!deck.isValidPlay(cardToPlay)) {
        res.message = "Cannot play " + cardToPlay.toString() + " against " + 
                     (deck.getTopPlayedCard() ? deck.getTopPlayedCard()->toString() : "empty pile");
        return res;
    }

    // Remove from hand
    Card removed;
    human.removeCardAt(handIndex, removed);

    res = processPlayedCard(human, bot, cardToPlay, requestedSuitIfWhot);
    return res;
}

TurnResult WhotGameEngine::humanDrawMarket() {
    TurnResult res;
    if (isGameOver) {
        res.message = "Game is already over.";
        return res;
    }
    if (currentTurnPlayerIndex != 0) {
        res.message = "It is not your turn!";
        return res;
    }

    // Handle pending pick stack (Pick 2 or Pick 3)
    int cardsToDraw = (deck.pendingPickCount > 0) ? deck.pendingPickCount : 1;
    deck.pendingPickCount = 0; // reset penalty count after drawing

    int drawnCount = 0;
    for (int i = 0; i < cardsToDraw; ++i) {
        Card drawn = deck.drawCard();
        if (!drawn.id.empty()) {
            human.addCard(drawn);
            drawnCount++;
        }
    }

    addLog("You went to market and drew " + std::to_string(drawnCount) + " card(s).");
    res.success = true;
    res.message = "Drew " + std::to_string(drawnCount) + " card(s) from market.";

    // Pass turn to Bot
    currentTurnPlayerIndex = 1;

    // Check if market empty ends game
    if (deck.marketPile.empty() && deck.settings.emptyMarketEnds) {
        checkWinCondition();
        res.gameOver = isGameOver;
        res.winnerId = winnerId;
    }

    return res;
}

TurnResult WhotGameEngine::executeBotTurn() {
    TurnResult res;
    if (isGameOver || currentTurnPlayerIndex != 1) {
        res.message = "Not Bot's turn or game over.";
        return res;
    }

    Suit requestedSuit = Suit::NONE;
    int choiceIdx = bot.chooseBotPlay(deck, requestedSuit);

    if (choiceIdx >= 0) {
        Card cardToPlay = bot.hand[choiceIdx];
        Card removed;
        bot.removeCardAt(choiceIdx, removed);
        res = processPlayedCard(bot, human, cardToPlay, requestedSuit);
    } else {
        // Bot draws from market
        int cardsToDraw = (deck.pendingPickCount > 0) ? deck.pendingPickCount : 1;
        deck.pendingPickCount = 0;

        int drawnCount = 0;
        for (int i = 0; i < cardsToDraw; ++i) {
            Card drawn = deck.drawCard();
            if (!drawn.id.empty()) {
                bot.addCard(drawn);
                drawnCount++;
            }
        }
        addLog("Naija Bot drew " + std::to_string(drawnCount) + " card(s) from market.");
        res.success = true;
        res.message = "Bot drew cards.";
        res.botBanter = bot.getBotBanter("market");

        // Pass turn to Human
        currentTurnPlayerIndex = 0;

        if (deck.marketPile.empty() && deck.settings.emptyMarketEnds) {
            checkWinCondition();
            res.gameOver = isGameOver;
            res.winnerId = winnerId;
        }
    }

    return res;
}

TurnResult WhotGameEngine::processPlayedCard(Player& player, Player& opponent, Card card, Suit requestedSuit) {
    TurnResult res;
    res.success = true;

    // Place card on played pile
    deck.playedPile.push_back(card);
    deck.currentRequestedSuit = Suit::NONE; // Reset requested suit unless WHOT 20 is played

    addLog(player.name + " played " + card.toString() + ".");

    // Check Last Card / Check
    if (player.hand.size() == 1) {
        addLog(player.name + ": LAST CARD!");
        res.botBanter = player.getBotBanter("last_card");
    } else if (player.hand.empty()) {
        addLog(player.name + ": CHECK! GAME OVER!");
        isGameOver = true;
        winnerId = player.id;
        res.gameOver = true;
        res.winnerId = winnerId;
        res.message = player.name + " won the game (CHECK)!";
        res.botBanter = player.getBotBanter("check");
        return res;
    }

    // Process Special Cards
    bool keepTurn = false;

    // WHOT 20 (Wildcard)
    if (card.suit == Suit::WHOT) {
        if (requestedSuit == Suit::NONE) {
            requestedSuit = Suit::CIRCLE; // Default if unspecified
        }
        deck.currentRequestedSuit = requestedSuit;
        addLog(player.name + " called WHOT suit: " + suitToString(requestedSuit) + " (" + suitToSymbol(requestedSuit) + ")");
        res.botBanter = player.getBotBanter("whot");
    }
    // Number 1: Hold On (Play again)
    else if (card.number == 1) {
        addLog("HOLD ON! " + player.name + " gets another turn!");
        keepTurn = true;
        res.botBanter = player.getBotBanter("hold_on");
    }
    // Number 2: Pick 2
    else if (card.number == 2) {
        deck.pendingPickCount += 2;
        addLog("PICK 2! Pending pick count is now " + std::to_string(deck.pendingPickCount) + ".");
        res.botBanter = player.getBotBanter("pick2");
    }
    // Number 5: Pick 3
    else if (card.number == 5 && deck.settings.pick3) {
        deck.pendingPickCount += 3;
        addLog("PICK 3! Pending pick count is now " + std::to_string(deck.pendingPickCount) + ".");
        res.botBanter = player.getBotBanter("pick3");
    }
    // Number 8: Suspend
    else if (card.number == 8 && deck.settings.suspend) {
        addLog("SUSPEND! " + opponent.name + "'s turn is skipped!");
        keepTurn = true;
        res.botBanter = player.getBotBanter("suspend");
    }
    // Number 14: General Market
    else if (card.number == 14) {
        addLog("GENERAL MARKET! " + opponent.name + " draws 1 card.");
        Card gMarket = deck.drawCard();
        if (!gMarket.id.empty()) {
            opponent.addCard(gMarket);
        }
        res.botBanter = player.getBotBanter("market");
    }

    // Determine turn succession
    if (!keepTurn) {
        currentTurnPlayerIndex = (currentTurnPlayerIndex == 0) ? 1 : 0;
    }

    res.message = player.name + " played " + card.toString() + ".";
    return res;
}

void WhotGameEngine::checkWinCondition() {
    int humanScore = human.calculateScore();
    int botScore = bot.calculateScore();

    isGameOver = true;
    if (human.hand.empty()) {
        winnerId = human.id;
    } else if (bot.hand.empty()) {
        winnerId = bot.id;
    } else {
        // Compare scores (lowest hand score wins)
        if (humanScore < botScore) {
            winnerId = human.id;
        } else if (botScore < humanScore) {
            winnerId = bot.id;
        } else {
            winnerId = "DRAW";
        }
    }
}

std::string WhotGameEngine::getAsciiGameBoard() const {
    std::ostringstream ss;
    ss << "========================================================\n";
    ss << "               NAIJA WHOT CARD GAME (C++ ENGINE)         \n";
    ss << "========================================================\n\n";

    ss << "[OPPONENT]: " << bot.name << " | Cards in hand: " << bot.hand.size() << " | Score: " << bot.calculateScore() << "\n";
    ss << "Hand (Hidden): ";
    for (size_t i = 0; i < bot.hand.size(); ++i) ss << "[🎴] ";
    ss << "\n\n";

    ss << "--------------------------------------------------------\n";
    ss << " Market Pile: " << deck.marketPile.size() << " cards remaining\n";
    ss << " Played Pile: " << deck.playedPile.size() << " cards\n";
    if (deck.getTopPlayedCard()) {
        ss << " TOP CARD ON TABLE: >>> [ " << deck.getTopPlayedCard()->toString() << " ] <<<\n";
    }
    if (deck.currentRequestedSuit != Suit::NONE) {
        ss << " REQUESTED SUIT: *** " << suitToString(deck.currentRequestedSuit) << " (" << suitToSymbol(deck.currentRequestedSuit) << ") ***\n";
    }
    if (deck.pendingPickCount > 0) {
        ss << " ATTENTION: Pending Penalty Pick Count = " << deck.pendingPickCount << " cards!\n";
    }
    ss << "--------------------------------------------------------\n\n";

    ss << "[YOUR HAND]: " << human.name << " | Score: " << human.calculateScore() << "\n";
    for (size_t i = 0; i < human.hand.size(); ++i) {
        bool valid = deck.isValidPlay(human.hand[i]);
        ss << " [" << i << "] " << human.hand[i].toString() << (valid ? "  <-- VALID PLAY" : "") << "\n";
    }
    ss << "\nTurn: " << (currentTurnPlayerIndex == 0 ? "YOUR TURN!" : "NAIJA BOT'S TURN...") << "\n";
    if (isGameOver) {
        ss << "\n🎉 GAME OVER! Winner: " << (winnerId == human.id ? "YOU!" : (winnerId == bot.id ? "NAIJA BOT!" : "DRAW!")) << "\n";
    }
    ss << "========================================================\n";

    return ss.str();
}

std::string WhotGameEngine::getStateJSON() const {
    std::ostringstream ss;
    ss << "{"
       << "\"isGameOver\":" << (isGameOver ? "true" : "false") << ","
       << "\"winnerId\":\"" << winnerId << "\","
       << "\"currentTurnPlayerIndex\":" << currentTurnPlayerIndex << ","
       << "\"human\":" << human.toJSON() << ","
       << "\"bot\":" << bot.toJSON() << ","
       << "\"deck\":" << deck.toJSON() << ","
       << "\"logs\":[";
    for (size_t i = 0; i < gameLogs.size(); ++i) {
        std::string escaped = gameLogs[i];
        // escape double quotes
        size_t pos = 0;
        while ((pos = escaped.find('"', pos)) != std::string::npos) {
            escaped.replace(pos, 1, "\\\"");
            pos += 2;
        }
        ss << "\"" << escaped << "\"";
        if (i + 1 < gameLogs.size()) ss << ",";
    }
    ss << "]}";
    return ss.str();
}

} // namespace Whot
