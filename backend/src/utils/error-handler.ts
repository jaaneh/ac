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
    if (error.message.includes('må ha nøyaktig 5 kort')) {
      return { message: 'Ugyldig hånd: må ha 5 kort', status: 400 }
    }
    if (error.message.includes('minst 2 hender')) {
      return { message: 'Trenger minst 2 hender for sammenligning', status: 400 }
    }
    return { message: error.message, status: 500 }
  }

  return { message: 'Ukjent feil oppstod', status: 500 }
}