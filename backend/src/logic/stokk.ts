import { type PossibleCards, CARD_SUITS, CARD_VALUES } from "../types";

/**
 * Genererer en komplett kortstokk med alle 52 kort
 */
function generateDeck(): PossibleCards[] {
  // flatMap for kartesisk produkt uten nesting
  // [[2k, 2r, 2h, 2s], [3k, 3r, 3h, 3s]] => [2k, 2r, 2h, 2s, 3k, 3r, 3h, 3s]
  const deck: PossibleCards[] = CARD_VALUES.flatMap(value =>
    CARD_SUITS.map(suit => `${value}${suit}` as PossibleCards)
  )
  return deck
}

/**
 * Stokker kortene ved hjelp av Fisher-Yates algoritme
 */
function shuffleDeck(deck: PossibleCards[]): PossibleCards[] {
  // kopi for å unngå mutering
  const shuffled = [...deck]

  // Fisher-Yates stokking: start fra slutten og bytt med tilfeldig tidligere
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // bytt elementene. dette trengs for å ikke velge samme element to ganger
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Deler ut et spesifisert antall kort fra toppen av stokken
 */
function dealCards(deck: PossibleCards[], amount: number): PossibleCards[] {
  return deck.slice(0, amount)
}

/**
 * Genererer en komplett pokerhånd (5 kort)
 */
export function generatePokerHand(): PossibleCards[] {
  const deck = generateDeck()
  const shuffled = shuffleDeck(deck)
  return dealCards(shuffled, 5)
}