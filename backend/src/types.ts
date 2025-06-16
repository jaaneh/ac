export const CARD_SUITS = ['k', 'r', 'h', 's'] as const
export const CARD_VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', 't', 'j', 'q', 'k', 'a'] as const

export type CardSuits = (typeof CARD_SUITS)[number]
export type CardValues = (typeof CARD_VALUES)[number]
export type PossibleCards = `${CardValues}${CardSuits}`

export interface Card {
  value: CardValues
  suit: CardSuits
  ranking: number // Numerisk rangering for sammenligning (2=2, a=14)
}

// Union type for alle mulige pokerhender
export type PokerHandType =
  | 'high-card'
  | 'one-pair'
  | 'two-pair'
  | 'three-of-a-kind'
  | 'straight'
  | 'flush'
  | 'full-house'
  | 'four-of-a-kind'
  | 'straight-flush'
  | 'royal-flush'

export interface PokerHand {
  id?: number                // Database ID (valgfri for nye hender)
  card: PossibleCards[]         // Array med 5 kort i string format
  type: PokerHandType        // Analysert håndtype
  ranking: number          // Styrke 1-10 (10 = royal flush)
  description: string        // Menneskelesbar beskrivelse
  created_at?: string         // Tidsstempel fra database
}

export interface HandSammenligning {
  hands: PokerHand[]        // Alle hender som ble sammenlignet
  winner: PokerHand          // Den sterkeste hånden
  description: string        // Forklaring av resultatet
}

export interface HandEvaluator {
  type: PokerHandType
  ranking: number
  check: (cards: PossibleCards[], counter: Record<string, number>) => boolean
  description: (cards: PossibleCards[], counter: Record<string, number>) => string
}