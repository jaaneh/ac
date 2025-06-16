import type { PossibleCards, PokerHand, HandEvaluator, HandSammenligning } from "../types"

const VERDI_RANGERING: Record<string, number> = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  't': 10,
  'j': 11,
  'q': 12,
  'k': 13,
  'a': 14
}

/**
 * Henter kortverdi fra et kort (f.eks "ah" -> "a")
 */
function getCardValue(card: PossibleCards): string {
  return card.slice(0, -1) // Alle karakterer bortsett fra fargen
}

/**
 * Ekstraherer farge-delen fra et kort (f.eks "ah" -> "h")
 */
function getCardSuit(card: PossibleCards): string {
  return card.slice(-1) // Kun siste karakter (fargen)
}

/**
 * Sorterer kort etter verdi i stigende rekkefølge
 */
function sortCardsByValue(cards: PossibleCards[]): PossibleCards[] {
  return [...cards].sort((a, b) => VERDI_RANGERING[getCardValue(a)] - VERDI_RANGERING[getCardValue(b)])
}

/**
 * Teller frekvensen av hver kortverdi i hånden
 * @returns Objekt som mapper verdi til antall (f.eks {"k": 2, "a": 1})
 */
function countValues(cards: PossibleCards[]): Record<string, number> {
  const counter: Record<string, number> = {}
  for (const k of cards) {
    const value = getCardValue(k)
    counter[value] = (counter[value] || 0) + 1
  }
  return counter
}

/**
 * Sjekker om alle kort har samme farge (flush)
 */
function isFlush(cards: PossibleCards[]): boolean {
  const suit = getCardSuit(cards[0]) // Bruker første kort som referanse
  return cards.every(k => getCardSuit(k) === suit) // Sammenlign alle med første
}

/**
 * Sjekker om kortene danner en straight
 * Håndterer både normal straight og A-2-3-4-5 (wheel)
 */
function isStraight(cards: PossibleCards[]): boolean {
  const sorted = sortCardsByValue(cards)
  const values = sorted.map(k => VERDI_RANGERING[getCardValue(k)])

  // Sjekk normal straight: hver verdi er forrige + 1
  for (let i = 1; i < values.length; i++) {
    if (values[i] !== values[i-1] + 1) {
      break
    }
    if (i === 4) return true
  }

  // Sjekk wheel hvor ess teller som 1
  if (values[0] === 2 && values[1] === 3 && values[2] === 4 && values[3] === 5 && values[4] === 14) {
    return true
  }

  return false
}

/**
 * Sjekker om hånden er en royal flush (A-K-Q-J-10 i samme farge)
 */
function isRoyalFlush(cards: PossibleCards[]): boolean {
  if (!isFlush(cards)) return false
  const values = cards.map(k => getCardValue(k)).sort()
  // Sammenlign med sortert array av royal flush verdier
  return JSON.stringify(values) === JSON.stringify(['a', 'j', 'k', 'q', 't'])
}

const HAND_EVALUATORS: HandEvaluator[] = [
  {
    type: 'royal-flush',
    ranking: 10,
    check: (cards) => isFlush(cards) && isRoyalFlush(cards),
    description: () => 'Royal flush'
  },
  {
    type: 'straight-flush',
    ranking: 9,
    check: (cards) => isFlush(cards) && isStraight(cards),
    description: () => 'Straight flush'
  },
  {
    type: 'four-of-a-kind',
    ranking: 8,
    check: (_, counter) => Object.values(counter).includes(4),
    description: (_, counter) => {
      const verdi = Object.entries(counter)
        .filter(([_, count]) => count === 4)
        .map(([verdi]) => verdi)
        .sort((a, b) => VERDI_RANGERING[b] - VERDI_RANGERING[a])[0]
      return `Four of a kind: ${verdi?.toUpperCase()}`
    }
  },
  {
    type: 'full-house',
    ranking: 7,
    check: (_, counter) => {
      const antall = Object.values(counter).sort((a, b) => b - a) // Sorterer fallende
      return antall[0] === 3 && antall[1] === 2
    },
    description: (_, counter) => {
      // Sorter etter verdi-rangering
      const trelike = Object.entries(counter)
        .filter(([_, count]) => count === 3)
        .map(([verdi]) => verdi)
        .sort((a, b) => VERDI_RANGERING[b] - VERDI_RANGERING[a])[0]?.toUpperCase()
      const par = Object.entries(counter)
        .filter(([_, count]) => count === 2)
        .map(([verdi]) => verdi)
        .sort((a, b) => VERDI_RANGERING[b] - VERDI_RANGERING[a])[0]?.toUpperCase()
      return `Full house: ${trelike} over ${par}`
    }
  },
  {
    type: 'flush',
    ranking: 6,
    check: (cards) => isFlush(cards),
    description: () => 'Flush'
  },
  {
    type: 'straight',
    ranking: 5,
    check: (cards) => isStraight(cards),
    description: () => 'Straight'
  },
  {
    type: 'three-of-a-kind',
    ranking: 4,
    check: (_, counter) => Object.values(counter).includes(3),
    description: (_, counter) => {
      const verdi = Object.entries(counter)
        .filter(([_, count]) => count === 3)
        .map(([verdi]) => verdi)
        .sort((a, b) => VERDI_RANGERING[b] - VERDI_RANGERING[a])[0]
      return `Three of a kind: ${verdi?.toUpperCase()}`
    }
  },
  {
    type: 'two-pair',
    ranking: 3,
    check: (_, counter) => {
      const par = Object.values(counter).filter(count => count === 2)
      return par.length === 2
    },
    description: (_, counter) => {
      const par = Object.entries(counter)
        .filter(([_, count]) => count === 2)
        .map(([verdi]) => verdi)
        .sort((a, b) => VERDI_RANGERING[b] - VERDI_RANGERING[a])
        .map(verdi => verdi.toUpperCase())
      return `Two pair: ${par.join(' and ')}`
    }
  },
  {
    type: 'one-pair',
    ranking: 2,
    check: (_, counter) => Object.values(counter).includes(2),
    description: (_, counter) => {
      const parVerdi = Object.entries(counter)
        .filter(([_, count]) => count === 2)
        .map(([verdi]) => verdi)
        .sort((a, b) => VERDI_RANGERING[b] - VERDI_RANGERING[a])[0]
      return `One pair: ${parVerdi?.toUpperCase() ?? ''}`
    }
  },
  {
    type: 'high-card',
    ranking: 1,
    check: () => true,
    description: (cards) => {
      const highest = sortCardsByValue(cards)[4]
      return `High card: ${getCardValue(highest).toUpperCase()}`
    }
  }
]

/**
 * Analyserer en pokerhånd og returnerer komplett hånd-objekt
 */
export function analyseHand(cards: PossibleCards[]): PokerHand {
  if (cards.length !== 5) {
    throw new Error('A poker hand must have exactly 5 cards')
  }

  const counter = countValues(cards)

  for (const evaluator of HAND_EVALUATORS) {
    if (evaluator.check(cards, counter)) {
      return {
        card: cards,
        type: evaluator.type,
        ranking: evaluator.ranking,
        description: evaluator.description(cards, counter)
      }
    }
  }

  throw new Error('Could not analyse hand')
}

/**
 * Sammenligner to pokerhender for sortering
 * Bruker først rangering, deretter høye kort ved uavgjort
 * @returns Negativt tall hvis hånd1 er bedre, positivt hvis hånd2 er bedre, 0 ved uavgjort
 */
function sammenliknHander(hand1: PokerHand, hand2: PokerHand): number {
  // Først sammenlign på rangering
  if (hand1.ranking !== hand2.ranking) {
    return hand2.ranking - hand1.ranking // Høyere først
  }

  // Ved like rangeringer, sammenlign høye kort
  const kort1 = sortCardsByValue(hand1.card).reverse()
  const kort2 = sortCardsByValue(hand2.card).reverse()

  // Sammenlign kort for kort fra høyest til lavest
  for (let i = 0; i < 5; i++) {
    const verdi1 = VERDI_RANGERING[getCardValue(kort1[i])]
    const verdi2 = VERDI_RANGERING[getCardValue(kort2[i])]
    if (verdi1 !== verdi2) {
      return verdi2 - verdi1
    }
  }

  return 0
}

/**
 * Finner vinneren av en konkuranse mellom flere pokerhender
 */
export function findWinner(hands: PokerHand[]): HandSammenligning {
  if (hands.length < 2) {
    throw new Error('Must have at least 2 hands for comparison')
  }

  const sorterte = [...hands].sort(sammenliknHander)
  const vinner = sorterte[0]

  return {
    hands,
    winner: vinner,
    description: `${vinner.description} wins`
  }
}