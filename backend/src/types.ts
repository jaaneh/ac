export const KORT_FARGER = ['k', 'r', 'h', 's'] as const
export const KORT_VERDIER = ['2', '3', '4', '5', '6', '7', '8', '9', 't', 'j', 'q', 'k', 'a'] as const

export type KortFarger = (typeof KORT_FARGER)[number]
export type KortVerdier = (typeof KORT_VERDIER)[number]
export type MuligeKort = `${KortVerdier}${KortFarger}`

export interface Kort {
  verdi: KortVerdier
  farge: KortFarger
  rangering: number // Numerisk rangering for sammenligning (2=2, a=14)
}

// Union type for alle mulige pokerhender
export type PokerHandType =
  | 'høy-kort'
  | 'ett-par'
  | 'to-par'
  | 'tre-like'
  | 'straight'
  | 'flush'
  | 'hus'
  | 'quads'
  | 'straight-flush'
  | 'royal-flush'

export interface PokerHand {
  id?: number                // Database ID (valgfri for nye hender)
  kort: MuligeKort[]         // Array med 5 kort i string format
  type: PokerHandType        // Analysert håndtype
  rangering: number          // Styrke 1-10 (10 = royal flush)
  beskrivelse: string        // Menneskelesbar beskrivelse
  opprettet?: string         // Tidsstempel fra database
}

export interface HandSammenligning {
  hender: PokerHand[]        // Alle hender som ble sammenlignet
  vinner: PokerHand          // Den sterkeste hånden
  beskrivelse: string        // Forklaring av resultatet
}

export interface HandEvaluator {
  type: PokerHandType
  rangering: number
  sjekk: (kort: MuligeKort[], teller: Record<string, number>) => boolean
  beskrivelse: (kort: MuligeKort[], teller: Record<string, number>) => string
}