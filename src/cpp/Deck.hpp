#ifndef DECK_HPP
#define DECK_HPP

#include "Card.hpp"
#include <vector>
#include <algorithm>
#include <random>
#include <chrono>
#include <sstream>

namespace Whot {

struct GameSettings {
    bool sfx = true;
    bool aiBanter = true;
    bool whotCard = true;
    bool pick3 = true;
    bool suspend = true;
    bool emptyMarketEnds = false;

    std::string toJSON() const {
        std::ostringstream ss;
        ss << "{"
           << "\"sfx\":" << (sfx ? "true" : "false") << ","
           << "\"aiBanter\":" << (aiBanter ? "true" : "false") << ","
           << "\"whotCard\":" << (whotCard ? "true" : "false") << ","
           << "\"pick3\":" << (pick3 ? "true" : "false") << ","
           << "\"suspend\":" << (suspend ? "true" : "false") << ","
           << "\"emptyMarketEnds\":" << (emptyMarketEnds ? "true" : "false")
           << "}";
        return ss.str();
    }
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

        struct GroupConfig {
            Suit suit;
            std::vector<int> numbers;
        };

        std::vector<GroupConfig> deckConfig = {
            { Suit::CIRCLE,   {1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14} },
            { Suit::TRIANGLE, {1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14} },
            { Suit::CROSS,    {1, 2, 3, 5, 7, 10, 11, 13, 14} },
            { Suit::SQUARE,   {1, 2, 3, 5, 7, 10, 11, 13, 14} },
            { Suit::STAR,     {1, 2, 3, 4, 5, 7, 8} },
            { Suit::WHOT,     {20, 20, 20, 20, 20} }
        };

        std::vector<Card> cards;
        int idCounter = 1;

        for (const auto& group : deckConfig) {
            if (group.suit == Suit::WHOT && !settings.whotCard) {
                continue;
            }
            for (int num : group.numbers) {
                Card c;
                c.id = "card_" + suitToString(group.suit) + "_" + std::to_string(num) + "_" + std::to_string(idCounter++);
                c.suit = group.suit;
                c.number = num;
                cards.push_back(c);
            }
        }

        // Shuffle using random seed
        unsigned seed = std::chrono::system_clock::now().time_since_epoch().count();
        std::default_random_engine rng(seed);
        std::shuffle(cards.begin(), cards.end(), rng);

        marketPile = cards;

        // Draw initial card to played pile (must not be WHOT 20 or special card for first card if possible)
        if (!marketPile.empty()) {
            playedPile.push_back(marketPile.back());
            marketPile.pop_back();
        }
    }

    Card* getTopPlayedCard() {
        if (playedPile.empty()) return nullptr;
        return &playedPile.back();
    }

    const Card* getTopPlayedCard() const {
        if (playedPile.empty()) return nullptr;
        return &playedPile.back();
    }

    Card drawCard() {
        if (marketPile.empty()) {
            if (settings.emptyMarketEnds) {
                return Card{"", Suit::NONE, 0};
            }
            refillMarketFromPlayed();
        }
        if (marketPile.empty()) {
            return Card{"", Suit::NONE, 0};
        }
        Card c = marketPile.back();
        marketPile.pop_back();
        return c;
    }

    void refillMarketFromPlayed() {
        if (playedPile.size() <= 1) return;

        Card topCard = playedPile.back();
        playedPile.pop_back();

        std::vector<Card> remaining = playedPile;
        playedPile.clear();
        playedPile.push_back(topCard);

        unsigned seed = std::chrono::system_clock::now().time_since_epoch().count();
        std::default_random_engine rng(seed);
        std::shuffle(remaining.begin(), remaining.end(), rng);

        marketPile = remaining;
    }

    bool isValidPlay(const Card& card) const {
        const Card* topCard = getTopPlayedCard();
        if (!topCard) return true;

        // WHOT 20 is wildcard
        if (card.suit == Suit::WHOT) {
            return true;
        }

        // Pending pick defense
        if (pendingPickCount > 0) {
            if (topCard->number == 2 && card.number == 2) return true;
            if (topCard->number == 5 && card.number == 5 && settings.pick3) return true;
            return false;
        }

        // If WHOT suit call is active
        if (currentRequestedSuit != Suit::NONE) {
            return card.suit == currentRequestedSuit;
        }

        // Matching suit OR matching number
        return (card.suit == topCard->suit) || (card.number == topCard->number);
    }

    static int calculateHandScore(const std::vector<Card>& hand) {
        int score = 0;
        for (const auto& c : hand) {
            score += c.getScoreValue();
        }
        return score;
    }

    std::string toJSON() const {
        std::ostringstream ss;
        ss << "{"
           << "\"marketCount\":" << marketPile.size() << ","
           << "\"playedCount\":" << playedPile.size() << ","
           << "\"topCard\":" << (getTopPlayedCard() ? getTopPlayedCard()->toJSON() : "null") << ","
           << "\"requestedSuit\":\"" << suitToString(currentRequestedSuit) << "\","
           << "\"pendingPickCount\":" << pendingPickCount
           << "}";
        return ss.str();
    }
};

} // namespace Whot

#endif // DECK_HPP
