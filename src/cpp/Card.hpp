#ifndef CARD_HPP
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

inline Suit stringToSuit(const std::string& str) {
    if (str == "circle")   return Suit::CIRCLE;
    if (str == "triangle") return Suit::TRIANGLE;
    if (str == "cross")    return Suit::CROSS;
    if (str == "square")   return Suit::SQUARE;
    if (str == "star")     return Suit::STAR;
    if (str == "whot")     return Suit::WHOT;
    return Suit::NONE;
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
        return "{\"id\":\"" + id + "\",\"suit\":\"" + suitToString(suit) + "\",\"number\":" + std::to_string(number) + "}";
    }
};

} // namespace Whot

#endif // CARD_HPP
