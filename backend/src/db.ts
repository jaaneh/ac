import { Database } from 'bun:sqlite'

export const db = new Database(':memory:')

db.run(`
  CREATE TABLE IF NOT EXISTS hender (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kort TEXT NOT NULL,
    type TEXT NOT NULL,
    rangering INTEGER NOT NULL,
    beskrivelse TEXT NOT NULL,
    opprettet DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)