import { Database } from 'bun:sqlite'

export const db = new Database(':memory:')

db.run(`
  CREATE TABLE IF NOT EXISTS hands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card TEXT NOT NULL,
    type TEXT NOT NULL,
    ranking INTEGER NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)