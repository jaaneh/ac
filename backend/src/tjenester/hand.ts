import { db } from '../db'
import { type PokerHand } from '../types'

/**
 * Lagrer en pokerhånd i databasen og returnerer hånden med ID
 */
export function lagreHand(hand: PokerHand): PokerHand {
  const stmt = db.prepare(`
    INSERT INTO hender (kort, type, rangering, beskrivelse)
    VALUES (?, ?, ?, ?)
  `)

  const result = stmt.run(
    JSON.stringify(hand.kort),
    hand.type,
    hand.rangering,
    hand.beskrivelse
  )

  return {
    ...hand,
    id: result.lastInsertRowid as number
  }
}

/**
 * Henter alle pokerhender fra databasen sortert etter opprettelsestid (nyest først)
 */
export function hentAlleHender(): PokerHand[] {
  const stmt = db.prepare(`
    SELECT id, kort, type, rangering, beskrivelse, opprettet
    FROM hender
    ORDER BY id DESC
  `)

  const rows = stmt.all() as any[]

  return rows.map(row => ({
    id: row.id,
    kort: JSON.parse(row.kort),
    type: row.type,
    rangering: row.rangering,
    beskrivelse: row.beskrivelse,
    opprettet: row.opprettet
  }))
}

/**
 * Henter flere pokerhender basert på en array av IDer
 * Brukes for sammenligning av spesifikke hender
 * @returns Array med pokerhender som matcher IDene
 */
export function hentHenderMedId(ider: number[]): PokerHand[] {
  const placeholders = ider.map(() => '?').join(',')
  const stmt = db.prepare(`
    SELECT id, kort, type, rangering, beskrivelse, opprettet
    FROM hender
    WHERE id IN (${placeholders})
  `)

  // Sender hver ID som separat parameter
  const rows = stmt.all(...ider) as any[]

  return rows.map(row => ({
    id: row.id,
    kort: JSON.parse(row.kort),
    type: row.type,
    rangering: row.rangering,
    beskrivelse: row.beskrivelse,
    opprettet: row.opprettet
  }))
}