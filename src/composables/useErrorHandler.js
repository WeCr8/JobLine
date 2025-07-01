import { ref } from 'vue';
import { normalizeError, reportError } from '../utils/error.utils';
export function useErrorHandler() {
    const error = ref(null);
    function handleError(err, context) {
        const normalized = normalizeError(err);
        error.value = normalized;
        reportError(normalized, context);
    }
    function resetError() {
        error.value = null;
    }
    return {
        error,
        handleError,
        resetError
    };
}
