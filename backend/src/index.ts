import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { generatePokerHand } from './logic/stokk'
import { analyseHand, findWinner } from './logic/poker'
import { saveHand, getAllHands, getHandsById } from './services/hand'
import { handleError } from './utils/error-handler'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

const app = new Hono().basePath("/api")

app.use('*', cors())

app.post('/new', async (c) => {
  try {
    const cards = generatePokerHand()
    const hand = analyseHand(cards)
    const savedHand = saveHand(hand)
    return c.json(savedHand)
  } catch (error) {
    const { message, status } = handleError(error)
    return c.json({ error: message }, status as ContentfulStatusCode)
  }
})

app.get('/all', async (c) => {
  try {
    const hands = getAllHands()
    return c.json(hands)
  } catch (error) {
    const { message, status } = handleError(error)
    return c.json({ error: message }, status as ContentfulStatusCode)
  }
})

app.post('/compare', async (c) => {
  try {
    const { ids } = await c.req.json()

    // må være array med minst 2 elementer
    if (!Array.isArray(ids) || ids.length < 2) {
      return c.json({ error: 'Must provide at least 2 hand IDs' }, 400)
    }

    const hands = getHandsById(ids)

    if (hands.length !== ids.length) {
      return c.json({ error: 'One or more hands were not found' }, 404)
    }

    const comparison = findWinner(hands)
    return c.json(comparison)
  } catch (error) {
    const { message, status } = handleError(error)
    return c.json({ error: message }, status as ContentfulStatusCode)
  }
})


export default {
  port: 3001,
  fetch: app.fetch,
}