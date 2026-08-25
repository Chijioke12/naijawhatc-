#ifndef PLAYER_HPP
#define PLAYER_HPP

#include "Deck.hpp"
#include <string>
#include <vector>
#include <sstream>
#include <map>

namespace Whot {

class Player {
public:
    std::string id;
    std::string name;
    bool isHuman;
    std::vector<Card> hand;

    Player(const std::string& id = "", const std::string& name = "", bool isHuman = false)
        : id(id), name(name), isHuman(isHuman) {}

    void addCard(const Card& card) {
        if (!card.id.empty()) {
            hand.push_back(card);
        }
    }

    bool removeCardAt(size_t index, Card& outCard) {
        if (index >= hand.size()) return false;
        outCard = hand[index];
        hand.erase(hand.begin() + index);
        return true;
    }

    bool hasValidPlay(const Deck& deck) const {
        for (const auto& card : hand) {
            if (deck.isValidPlay(card)) return true;
        }
        return false;
    }

    std::vector<int> getValidCardIndices(const Deck& deck) const {
        std::vector<int> indices;
        for (size_t i = 0; i < hand.size(); ++i) {
            if (deck.isValidPlay(hand[i])) {
                indices.push_back(static_cast<int>(i));
            }
        }
        return indices;
    }

    int calculateScore() const {
        return Deck::calculateHandScore(hand);
    }

    // AI Bot Card Selection Strategy
    int chooseBotPlay(const Deck& deck, Suit& outRequestedSuit) const {
        outRequestedSuit = Suit::NONE;
        std::vector<int> validIndices = getValidCardIndices(deck);
        if (validIndices.empty()) return -1;

        // Prioritize defending against Pick 2 / Pick 3
        if (deck.pendingPickCount > 0) {
            for (int idx : validIndices) {
                if (hand[idx].number == 2 || hand[idx].number == 5) return idx;
            }
        }

        // Prioritize special attack cards (2, 5, 1, 8, 14)
        for (int idx : validIndices) {
            int num = hand[idx].number;
            if (num == 2 || num == 5 || num == 14 || num == 1 || num == 8) {
                if (hand[idx].suit != Suit::WHOT) {
                    return idx;
                }
            }
        }

        // Play standard non-WHOT cards first
        for (int idx : validIndices) {
            if (hand[idx].suit != Suit::WHOT) {
                return idx;
            }
        }

        // Play WHOT 20 wildcard as last resort, and select most frequent suit in hand
        int whotIndex = validIndices[0];
        std::map<Suit, int> suitCounts;
        for (const auto& c : hand) {
            if (c.suit != Suit::WHOT) {
                suitCounts[c.suit]++;
            }
        }

        Suit bestSuit = Suit::CIRCLE;
        int maxCount = -1;
        for (auto const& [suit, count] : suitCounts) {
            if (count > maxCount) {
                maxCount = count;
                bestSuit = suit;
            }
        }
        outRequestedSuit = bestSuit;
        return whotIndex;
    }

    std::string getBotBanter(const std::string& action) const {
        if (action == "pick2") return "Oya pick 2 my friend! No carry last!";
        if (action == "pick3") return "Pick 3 for yourself! Naija Whot no be play!";
        if (action == "whot")  return "I change suit! Show me what you got!";
        if (action == "hold_on") return "Hold On! Let me play again!";
        if (action == "suspend") return "Suspended! Rest small!";
        if (action == "market")  return "Go to market! Buy fresh yam!";
        if (action == "last_card") return "LAST CARD! Warning o!";
        if (action == "check")    return "CHECK! Game over!";
        return "Your turn, play wise!";
    }

    std::string toJSON() const {
        std::ostringstream ss;
        ss << "{"
           << "\"id\":\"" << id << "\","
           << "\"name\":\"" << name << "\","
           << "\"isHuman\":" << (isHuman ? "true" : "false") << ","
           << "\"cardCount\":" << hand.size() << ","
           << "\"score\":" << calculateScore() << ","
           << "\"hand\":[";
        for (size_t i = 0; i < hand.size(); ++i) {
            ss << hand[i].toJSON();
            if (i + 1 < hand.size()) ss << ",";
        }
        ss << "]}";
        return ss.str();
    }
};

} // namespace Whot

#endif // PLAYER_HPP
