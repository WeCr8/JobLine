/**
 * Composable for tracking element size changes
 */
import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';

export function useElementSize(elementRef: Ref<HTMLElement | null>) {
  const width = ref(0);
  const height = ref(0);
  
  let resizeObserver: ResizeObserver | null = null;
  
  const updateSize = () => {
    if (elementRef.value) {
      const rect = elementRef.value.getBoundingClientRect();
      width.value = rect.width;
      height.value = rect.height;
    }
  };
  
  onMounted(() => {
    updateSize();
    
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(updateSize);
      
      if (elementRef.value) {
        resizeObserver.observe(elementRef.value);
      }
    } else {
      // Fallback for browsers without ResizeObserver
      window.addEventListener('resize', updateSize);
    }
    
    // Watch for element reference changes
    watch(elementRef, (newEl, oldEl) => {
      if (resizeObserver) {
        if (oldEl) {
          resizeObserver.unobserve(oldEl);
        }
        if (newEl) {
          resizeObserver.observe(newEl);
          updateSize();
        }
      }
    });
  });
  
  onUnmounted(() => {
    if (resizeObserver) {
      if (elementRef.value) {
        resizeObserver.unobserve(elementRef.value);
      }
      resizeObserver.disconnect();
    } else {
      window.removeEventListener('resize', updateSize);
    }
  });
  
  return { width, height };
}

import { watch } from 'vue';