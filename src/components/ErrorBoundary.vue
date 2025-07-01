<template>
  <div>
    <slot v-if="!error" />
    <div v-else class="error-boundary-fallback">
      <h2>Something went wrong.</h2>
      <p>{{ errorMessage }}</p>
      <button @click="resetError">Try Again</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue'

export default defineComponent({
  name: 'ErrorBoundary',
  props: {
    fallback: {
      type: String,
      default: 'An unexpected error occurred.'
    }
  },
  setup(props, { slots }) {
    const error = ref<Error | null>(null)
    const errorMessage = ref(props.fallback)

    function resetError() {
      error.value = null
      errorMessage.value = props.fallback
    }

    // Vue 3 errorCaptured hook
    function errorCaptured(err: unknown) {
      if (err instanceof Error) {
        error.value = err
        errorMessage.value = err.message
      } else {
        error.value = new Error(String(err))
        errorMessage.value = String(err)
      }
      // Prevent further propagation
      return false
    }

    // Watch for slot changes to reset error
    watchEffect(() => {
      if (!slots.default) return
      // Reset error when slot content changes
      resetError()
    })

    return {
      error,
      errorMessage,
      resetError,
      errorCaptured
    }
  },
  errorCaptured(err) {
    // Call setup's errorCaptured
    // @ts-ignore
    return this.errorCaptured(err)
  }
})
</script>

<style scoped>
.error-boundary-fallback {
  padding: 2rem;
  background: #fff3f3;
  border: 1px solid #ffcccc;
  border-radius: 8px;
  text-align: center;
}
.error-boundary-fallback h2 {
  color: #d32f2f;
  margin-bottom: 0.5rem;
}
.error-boundary-fallback button {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: #d32f2f;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.error-boundary-fallback button:hover {
  background: #b71c1c;
}
</style> 