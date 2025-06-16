interface ErrorHandler {
  message: string
  status: number
}

/**
 * Sentralisert feilhåndtering som konverterer ukjente feil til konsistente HTTP responses
 * @param error - Ukjent feil objekt fra try-catch blokker
 * @returns Objekt med brukervenlig melding og passende HTTP statuskode
 */
export function handleError(error: unknown): ErrorHandler {
  if (error instanceof Error) {
    if (error.message.includes('must have exactly 5 cards')) {
      return { message: 'Invalid hand: must have 5 cards', status: 400 }
    }
    if (error.message.includes('must have at least 2 hands')) {
      return { message: 'Must have at least 2 hands for comparison', status: 400 }
    }
    return { message: error.message, status: 500 }
  }

  return { message: 'An unknown error occurred', status: 500 }
}