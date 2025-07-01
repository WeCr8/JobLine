// Error normalization utility
export interface NormalizedError {
  message: string
  stack?: string
  cause?: unknown
  original?: unknown
}

export function normalizeError(err: unknown): NormalizedError {
  if (err instanceof Error) {
    return {
      message: err.message,
      stack: err.stack,
      cause: (err as any).cause,
      original: err
    }
  }
  if (typeof err === 'string') {
    return { message: err, original: err }
  }
  return { message: 'Unknown error', original: err }
}

// Placeholder for remote error reporting (e.g., Sentry)
export function reportError(error: NormalizedError, context?: Record<string, any>) {
  // Integrate with Sentry, Bugsnag, etc. here
  // Example: Sentry.captureException(error, { extra: context })
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error('[reportError]', error, context)
  }
} 