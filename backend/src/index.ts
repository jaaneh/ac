import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { genererPokerHand } from './logikk/stokk'
import { analyserHand, finnVinner } from './logikk/poker'
import { lagreHand, hentAlleHender, hentHenderMedId } from './tjenester/hand'
import { handleError } from './utils/error-handler'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

const app = new Hono().basePath("/api")

app.use('*', cors())

app.post('/hand', async (c) => {
  try {
    const kort = genererPokerHand()
    const hand = analyserHand(kort)
    const lagretHand = lagreHand(hand)
    return c.json(lagretHand)
  } catch (error) {
    const { message, status } = handleError(error)
    return c.json({ error: message }, status as ContentfulStatusCode)
  }
})

app.get('/hender', async (c) => {
  try {
    const hender = hentAlleHender()
    return c.json(hender)
  } catch (error) {
    const { message, status } = handleError(error)
    return c.json({ error: message }, status as ContentfulStatusCode)
  }
})

app.post('/sammenlign', async (c) => {
  try {
    const { ider } = await c.req.json()

    // må være array med minst 2 elementer
    if (!Array.isArray(ider) || ider.length < 2) {
      return c.json({ error: 'Du må oppgi minst 2 hånd-IDer' }, 400)
    }

    const hender = hentHenderMedId(ider)

    if (hender.length !== ider.length) {
      return c.json({ error: 'En eller flere hender ble ikke funnet' }, 404)
    }

    const sammenligning = finnVinner(hender)
    return c.json(sammenligning)
  } catch (error) {
    const { message, status } = handleError(error)
    return c.json({ error: message }, status as ContentfulStatusCode)
  }
})


export default {
  port: 3001,
  fetch: app.fetch,
}