import { db } from '../db'
import { type PokerHand } from '../types'

/**
 * Lagrer en pokerhånd i databasen og returnerer hånden med ID
 */
export function saveHand(hand: PokerHand): PokerHand {
  const stmt = db.prepare(`
    INSERT INTO hands (card, type, ranking, description)
    VALUES (?, ?, ?, ?)
  `)

  const result = stmt.run(
    JSON.stringify(hand.card),
    hand.type,
    hand.ranking,
    hand.description
  )

  return {
    ...hand,
    id: result.lastInsertRowid as number
  }
}

/**
 * Henter alle pokerhender fra databasen sortert etter opprettelsestid (nyest først)
 */
export function getAllHands(): PokerHand[] {
  const stmt = db.prepare(`
    SELECT id, card, type, ranking, description, created_at
    FROM hands
    ORDER BY id DESC
  `)

  const rows = stmt.all() as any[]

  return rows.map(row => ({
    id: row.id,
    card: JSON.parse(row.card),
    type: row.type,
    ranking: row.ranking,
    description: row.description,
    opprettet: row.opprettet
  }))
}

/**
 * Henter flere pokerhender basert på en array av IDer
 * Brukes for sammenligning av spesifikke hender
 * @returns Array med pokerhender som matcher IDene
 */
export function getHandsById(ider: number[]): PokerHand[] {
  const placeholders = ider.map(() => '?').join(',')
  const stmt = db.prepare(`
    SELECT id, card, type, ranking, description, created_at
    FROM hands
    WHERE id IN (${placeholders})
  `)

  // Sender hver ID som separat parameter
  const rows = stmt.all(...ider) as any[]

  return rows.map(row => ({
    id: row.id,
    card: JSON.parse(row.card),
    type: row.type,
    ranking: row.ranking,
    description: row.description,
    created_at: row.created_at
  }))
}