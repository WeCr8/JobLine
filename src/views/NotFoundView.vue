<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1 class="not-found-title">404</h1>
      <h2 class="not-found-subtitle">Page Not Found</h2>
      <p class="not-found-message">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="not-found-actions">
        <Button @click="goBack" variant="secondary" :icon-left="ArrowLeftIcon">
          Go Back
        </Button>
        <Button @click="goHome" variant="primary">
          Go to Dashboard
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Button } from '../components/ui';

const router = useRouter();

const goBack = () => {
  router.back();
};

const goHome = () => {
  router.push('/dashboard');
};

function ArrowLeftIcon() {
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    'stroke-width': '1.5',
    stroke: 'currentColor'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18'
    })
  ]);
}

import { h } from 'vue';
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #f9fafb;
}

.not-found-content {
  max-width: 28rem;
  text-align: center;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.not-found-title {
  font-size: 6rem;
  font-weight: 700;
  line-height: 1;
  color: #3b82f6;
  margin: 0 0 1rem;
}

.not-found-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem;
}

.not-found-message {
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 2rem;
}

.not-found-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .not-found-title {
    font-size: 4rem;
  }
  
  .not-found-subtitle {
    font-size: 1.25rem;
  }
  
  .not-found-actions {
    flex-direction: column;
  }
}

/* iOS optimizations */
:global(.ios-device) .not-found {
  padding-top: env(safe-area-inset-top, 0);
  padding-bottom: env(safe-area-inset-bottom, 0);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .not-found {
    background-color: #111827;
  }
  
  .not-found-content {
    background-color: #1f2937;
  }
  
  .not-found-title {
    color: #60a5fa;
  }
  
  .not-found-subtitle {
    color: #f9fafb;
  }
  
  .not-found-message {
    color: #9ca3af;
  }
}
</style>