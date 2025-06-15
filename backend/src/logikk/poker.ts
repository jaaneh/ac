import { type MuligeKort, type PokerHand, type HandEvaluator, type HandSammenligning } from "../types"

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
function hentKortVerdi(kort: MuligeKort): string {
  return kort.slice(0, -1) // Alle karakterer bortsett fra fargen
}

/**
 * Ekstraherer farge-delen fra et kort (f.eks "ah" -> "h")
 */
function hentKortFarge(kort: MuligeKort): string {
  return kort.slice(-1) // Kun siste karakter (fargen)
}

/**
 * Sorterer kort etter verdi i stigende rekkefølge
 */
function sorterKortEtterVerdi(kort: MuligeKort[]): MuligeKort[] {
  return [...kort].sort((a, b) => VERDI_RANGERING[hentKortVerdi(a)] - VERDI_RANGERING[hentKortVerdi(b)])
}

/**
 * Teller frekvensen av hver kortverdi i hånden
 * @returns Objekt som mapper verdi til antall (f.eks {"k": 2, "a": 1})
 */
function tellerVerdier(kort: MuligeKort[]): Record<string, number> {
  const teller: Record<string, number> = {}
  for (const k of kort) {
    const verdi = hentKortVerdi(k)
    teller[verdi] = (teller[verdi] || 0) + 1
  }
  return teller
}

/**
 * Sjekker om alle kort har samme farge (flush)
 */
function erFlush(kort: MuligeKort[]): boolean {
  const farge = hentKortFarge(kort[0]) // Bruker første kort som referanse
  return kort.every(k => hentKortFarge(k) === farge) // Sammenlign alle med første
}

/**
 * Sjekker om kortene danner en straight
 * Håndterer både normal straight og A-2-3-4-5 (wheel)
 */
function erStraight(kort: MuligeKort[]): boolean {
  const sorterte = sorterKortEtterVerdi(kort)
  const verdier = sorterte.map(k => VERDI_RANGERING[hentKortVerdi(k)])

  // Sjekk normal straight: hver verdi er forrige + 1
  for (let i = 1; i < verdier.length; i++) {
    if (verdier[i] !== verdier[i-1] + 1) {
      break
    }
    if (i === 4) return true
  }

  // Sjekk wheel hvor ess teller som 1
  if (verdier[0] === 2 && verdier[1] === 3 && verdier[2] === 4 && verdier[3] === 5 && verdier[4] === 14) {
    return true
  }

  return false
}

/**
 * Sjekker om hånden er en royal flush (A-K-Q-J-10 i samme farge)
 */
function erRoyalFlush(kort: MuligeKort[]): boolean {
  if (!erFlush(kort)) return false
  const verdier = kort.map(k => hentKortVerdi(k)).sort()
  // Sammenlign med sortert array av royal flush verdier
  return JSON.stringify(verdier) === JSON.stringify(['a', 'j', 'k', 'q', 't'])
}

const HAND_EVALUATORS: HandEvaluator[] = [
  {
    type: 'royal-flush',
    rangering: 10,
    sjekk: (kort) => erFlush(kort) && erRoyalFlush(kort),
    beskrivelse: () => 'Royal flush'
  },
  {
    type: 'straight-flush',
    rangering: 9,
    sjekk: (kort) => erFlush(kort) && erStraight(kort),
    beskrivelse: () => 'Straight flush'
  },
  {
    type: 'quads',
    rangering: 8,
    sjekk: (_, teller) => Object.values(teller).includes(4),
    beskrivelse: (_, teller) => {
      const verdi = Object.entries(teller)
        .filter(([_, count]) => count === 4)
        .map(([verdi]) => verdi)
        .sort((a, b) => VERDI_RANGERING[b] - VERDI_RANGERING[a])[0]
      return `Quads: ${verdi?.toUpperCase()}`
    }
  },
  {
    type: 'hus',
    rangering: 7,
    sjekk: (_, teller) => {
      const antall = Object.values(teller).sort((a, b) => b - a) // Sorterer fallende
      return antall[0] === 3 && antall[1] === 2
    },
    beskrivelse: (_, teller) => {
      // Sorter etter verdi-rangering
      const trelike = Object.entries(teller)
        .filter(([_, count]) => count === 3)
        .map(([verdi]) => verdi)
        .sort((a, b) => VERDI_RANGERING[b] - VERDI_RANGERING[a])[0]?.toUpperCase()
      const par = Object.entries(teller)
        .filter(([_, count]) => count === 2)
        .map(([verdi]) => verdi)
        .sort((a, b) => VERDI_RANGERING[b] - VERDI_RANGERING[a])[0]?.toUpperCase()
      return `Hus: ${trelike} over ${par}`
    }
  },
  {
    type: 'flush',
    rangering: 6,
    sjekk: (kort) => erFlush(kort),
    beskrivelse: () => 'Flush'
  },
  {
    type: 'straight',
    rangering: 5,
    sjekk: (kort) => erStraight(kort),
    beskrivelse: () => 'Straight'
  },
  {
    type: 'tre-like',
    rangering: 4,
    sjekk: (_, teller) => Object.values(teller).includes(3),
    beskrivelse: (_, teller) => {
      const verdi = Object.entries(teller)
        .filter(([_, count]) => count === 3)
        .map(([verdi]) => verdi)
        .sort((a, b) => VERDI_RANGERING[b] - VERDI_RANGERING[a])[0]
      return `Tre ${verdi?.toUpperCase()}`
    }
  },
  {
    type: 'to-par',
    rangering: 3,
    sjekk: (_, teller) => {
      const par = Object.values(teller).filter(count => count === 2)
      return par.length === 2
    },
    beskrivelse: (_, teller) => {
      const par = Object.entries(teller)
        .filter(([_, count]) => count === 2)
        .map(([verdi]) => verdi)
        .sort((a, b) => VERDI_RANGERING[b] - VERDI_RANGERING[a])
        .map(verdi => verdi.toUpperCase())
      return `To par: ${par.join(' og ')}`
    }
  },
  {
    type: 'ett-par',
    rangering: 2,
    sjekk: (_, teller) => Object.values(teller).includes(2),
    beskrivelse: (_, teller) => {
      const parVerdi = Object.entries(teller)
        .filter(([_, count]) => count === 2)
        .map(([verdi]) => verdi)
        .sort((a, b) => VERDI_RANGERING[b] - VERDI_RANGERING[a])[0]
      return `Ett par ${parVerdi?.toUpperCase() ?? ''}`
    }
  },
  {
    type: 'høy-kort',
    rangering: 1,
    sjekk: () => true,
    beskrivelse: (kort) => {
      const høyeste = sorterKortEtterVerdi(kort)[4]
      return `Høy kort: ${hentKortVerdi(høyeste).toUpperCase()}`
    }
  }
]

/**
 * Analyserer en pokerhånd og returnerer komplett hånd-objekt
 */
export function analyserHand(kort: MuligeKort[]): PokerHand {
  if (kort.length !== 5) {
    throw new Error('En pokerhånd må ha nøyaktig 5 kort')
  }

  const teller = tellerVerdier(kort)

  for (const evaluator of HAND_EVALUATORS) {
    if (evaluator.sjekk(kort, teller)) {
      return {
        kort,
        type: evaluator.type,
        rangering: evaluator.rangering,
        beskrivelse: evaluator.beskrivelse(kort, teller)
      }
    }
  }

  throw new Error('Kunne ikke analysere hånd')
}

/**
 * Sammenligner to pokerhender for sortering
 * Bruker først rangering, deretter høye kort ved uavgjort
 * @returns Negativt tall hvis hånd1 er bedre, positivt hvis hånd2 er bedre, 0 ved uavgjort
 */
function sammenliknHander(hand1: PokerHand, hand2: PokerHand): number {
  // Først sammenlign på rangering
  if (hand1.rangering !== hand2.rangering) {
    return hand2.rangering - hand1.rangering // Høyere først
  }

  // Ved like rangeringer, sammenlign høye kort
  const kort1 = sorterKortEtterVerdi(hand1.kort).reverse()
  const kort2 = sorterKortEtterVerdi(hand2.kort).reverse()

  // Sammenlign kort for kort fra høyest til lavest
  for (let i = 0; i < 5; i++) {
    const verdi1 = VERDI_RANGERING[hentKortVerdi(kort1[i])]
    const verdi2 = VERDI_RANGERING[hentKortVerdi(kort2[i])]
    if (verdi1 !== verdi2) {
      return verdi2 - verdi1
    }
  }

  return 0
}

/**
 * Finner vinneren av en konkuranse mellom flere pokerhender
 */
export function finnVinner(hender: PokerHand[]): HandSammenligning {
  if (hender.length < 2) {
    throw new Error('Trenger minst 2 hender for å sammenligne')
  }

  const sorterte = [...hender].sort(sammenliknHander)
  const vinner = sorterte[0]

  return {
    hender,
    vinner,
    beskrivelse: `${vinner.beskrivelse} vinner`
  }
}