import { ref } from 'vue'
import { normalizeError, reportError, NormalizedError } from '../utils/error.utils'

export function useErrorHandler() {
  const error = ref<NormalizedError | null>(null)

  function handleError(err: unknown, context?: Record<string, any>) {
    const normalized = normalizeError(err)
    error.value = normalized
    reportError(normalized, context)
  }

  function resetError() {
    error.value = null
  }

  return {
    error,
    handleError,
    resetError
  }
} 