import { type MuligeKort, KORT_FARGER, KORT_VERDIER } from "../types";

/**
 * Genererer en komplett kortstokk med alle 52 kort
 */
function genererKortstokk(): MuligeKort[] {
  // flatMap for kartesisk produkt uten nesting
  // [[2k, 2r, 2h, 2s], [3k, 3r, 3h, 3s]] => [2k, 2r, 2h, 2s, 3k, 3r, 3h, 3s]
  const kortstokk: MuligeKort[] = KORT_VERDIER.flatMap(verdi =>
    KORT_FARGER.map(farge => `${verdi}${farge}` as MuligeKort)
  )
  return kortstokk
}

/**
 * Stokker kortene ved hjelp av Fisher-Yates algoritme
 */
function stokkeKort(kortstokk: MuligeKort[]): MuligeKort[] {
  // kopi for å unngå mutering
  const stokket = [...kortstokk]

  // Fisher-Yates stokking: start fra slutten og bytt med tilfeldig tidligere
  for (let i = stokket.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // bytt elementene. dette trengs for å ikke velge samme element to ganger
    [stokket[i], stokket[j]] = [stokket[j], stokket[i]]
  }
  return stokket
}

/**
 * Deler ut et spesifisert antall kort fra toppen av stokken
 */
function delUtKort(kortstokk: MuligeKort[], antall: number): MuligeKort[] {
  return kortstokk.slice(0, antall)
}

/**
 * Genererer en komplett pokerhånd (5 kort)
 */
export function genererPokerHand(): MuligeKort[] {
  const kortstokk = genererKortstokk()
  const stokket = stokkeKort(kortstokk)
  return delUtKort(stokket, 5)
}