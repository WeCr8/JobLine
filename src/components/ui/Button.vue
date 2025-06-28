<template>
  <component
    :is="as"
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
    v-bind="$attrs"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <span v-if="loading" class="button-spinner" aria-hidden="true">
      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    
    <!-- Left icon -->
    <span v-if="iconLeft && !loading" class="button-icon button-icon-left">
      <component :is="iconLeft"></component>
    </span>
    
    <!-- Button content -->
    <span class="button-content" :class="{ 'sr-only': loading && loadingText }">
      <slot>{{ label }}</slot>
    </span>
    
    <!-- Loading text -->
    <span v-if="loading && loadingText" class="button-loading-text">{{ loadingText }}</span>
    
    <!-- Right icon -->
    <span v-if="iconRight && !loading" class="button-icon button-icon-right">
      <component :is="iconRight"></component>
    </span>
    
    <!-- Ripple effect container -->
    <span v-if="ripple" ref="rippleRef" class="button-ripple-container"></span>
  </component>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { prefersReducedMotion } from '../../utils/accessibility';

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  as?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  rounded?: boolean;
  iconLeft?: any;
  iconRight?: any;
  ripple?: boolean;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  as: 'button',
  type: 'button',
  disabled: false,
  loading: false,
  loadingText: '',
  fullWidth: false,
  rounded: false,
  ripple: true
});

const emit = defineEmits<{
  'click': [event: MouseEvent];
}>();

// Ripple effect
const rippleRef = ref<HTMLElement | null>(null);
const rippleEnabled = computed(() => props.ripple && !prefersReducedMotion());

// Button classes
const buttonClasses = computed(() => {
  return [
    'button',
    `button-${props.variant}`,
    `button-${props.size}`,
    {
      'button-disabled': props.disabled,
      'button-loading': props.loading,
      'button-full-width': props.fullWidth,
      'button-rounded': props.rounded,
      'button-with-icon-left': props.iconLeft,
      'button-with-icon-right': props.iconRight,
      'button-with-ripple': rippleEnabled.value
    }
  ];
});

// Handle click with ripple effect
const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return;
  
  if (rippleEnabled.value && rippleRef.value) {
    createRippleEffect(event);
  }
  
  emit('click', event);
};

// Create ripple effect
const createRippleEffect = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLElement;
  const rippleContainer = rippleRef.value!;
  
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  
  const rect = button.getBoundingClientRect();
  const left = event.clientX - rect.left - radius;
  const top = event.clientY - rect.top - radius;
  
  const ripple = document.createElement('span');
  ripple.style.width = ripple.style.height = `${diameter}px`;
  ripple.style.left = `${left}px`;
  ripple.style.top = `${top}px`;
  ripple.classList.add('button-ripple');
  
  // Remove existing ripples
  const existingRipples = rippleContainer.querySelectorAll('.button-ripple');
  existingRipples.forEach(r => r.remove());
  
  rippleContainer.appendChild(ripple);
  
  // Remove ripple after animation
  setTimeout(() => {
    ripple.remove();
  }, 600);
};

// Clean up any remaining ripples
onUnmounted(() => {
  if (rippleRef.value) {
    const ripples = rippleRef.value.querySelectorAll('.button-ripple');
    ripples.forEach(r => r.remove());
  }
});
</script>

<style scoped>
.button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 0.375rem;
  transition-property: color, background-color, border-color, box-shadow;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
  cursor: pointer;
  overflow: hidden;
  outline: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

/* Sizes */
.button-xs {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  line-height: 1rem;
}

.button-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.button-md {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  line-height: 1.5rem;
}

.button-lg {
  padding: 0.625rem 1.25rem;
  font-size: 1rem;
  line-height: 1.5rem;
}

.button-xl {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
}

/* Variants */
.button-primary {
  background-color: var(--button-primary-bg, #3b82f6);
  color: var(--button-primary-text, #ffffff);
  border: 1px solid var(--button-primary-border, #3b82f6);
}

.button-primary:hover:not(.button-disabled):not(.button-loading) {
  background-color: var(--button-primary-hover-bg, #2563eb);
  border-color: var(--button-primary-hover-border, #2563eb);
}

.button-primary:focus-visible {
  outline: 2px solid var(--button-primary-focus-ring, rgba(59, 130, 246, 0.5));
  outline-offset: 2px;
}

.button-primary:active:not(.button-disabled):not(.button-loading) {
  background-color: var(--button-primary-active-bg, #1d4ed8);
  border-color: var(--button-primary-active-border, #1d4ed8);
}

.button-secondary {
  background-color: var(--button-secondary-bg, #ffffff);
  color: var(--button-secondary-text, #374151);
  border: 1px solid var(--button-secondary-border, #d1d5db);
}

.button-secondary:hover:not(.button-disabled):not(.button-loading) {
  background-color: var(--button-secondary-hover-bg, #f9fafb);
  border-color: var(--button-secondary-hover-border, #9ca3af);
}

.button-secondary:focus-visible {
  outline: 2px solid var(--button-secondary-focus-ring, rgba(156, 163, 175, 0.5));
  outline-offset: 2px;
}

.button-secondary:active:not(.button-disabled):not(.button-loading) {
  background-color: var(--button-secondary-active-bg, #f3f4f6);
  border-color: var(--button-secondary-active-border, #6b7280);
}

.button-ghost {
  background-color: transparent;
  color: var(--button-ghost-text, #374151);
  border: 1px solid transparent;
}

.button-ghost:hover:not(.button-disabled):not(.button-loading) {
  background-color: var(--button-ghost-hover-bg, rgba(0, 0, 0, 0.05));
}

.button-ghost:focus-visible {
  outline: 2px solid var(--button-ghost-focus-ring, rgba(156, 163, 175, 0.5));
  outline-offset: 2px;
}

.button-ghost:active:not(.button-disabled):not(.button-loading) {
  background-color: var(--button-ghost-active-bg, rgba(0, 0, 0, 0.1));
}

.button-danger {
  background-color: var(--button-danger-bg, #ef4444);
  color: var(--button-danger-text, #ffffff);
  border: 1px solid var(--button-danger-border, #ef4444);
}

.button-danger:hover:not(.button-disabled):not(.button-loading) {
  background-color: var(--button-danger-hover-bg, #dc2626);
  border-color: var(--button-danger-hover-border, #dc2626);
}

.button-danger:focus-visible {
  outline: 2px solid var(--button-danger-focus-ring, rgba(239, 68, 68, 0.5));
  outline-offset: 2px;
}

.button-danger:active:not(.button-disabled):not(.button-loading) {
  background-color: var(--button-danger-active-bg, #b91c1c);
  border-color: var(--button-danger-active-border, #b91c1c);
}

.button-success {
  background-color: var(--button-success-bg, #10b981);
  color: var(--button-success-text, #ffffff);
  border: 1px solid var(--button-success-border, #10b981);
}

.button-success:hover:not(.button-disabled):not(.button-loading) {
  background-color: var(--button-success-hover-bg, #059669);
  border-color: var(--button-success-hover-border, #059669);
}

.button-success:focus-visible {
  outline: 2px solid var(--button-success-focus-ring, rgba(16, 185, 129, 0.5));
  outline-offset: 2px;
}

.button-success:active:not(.button-disabled):not(.button-loading) {
  background-color: var(--button-success-active-bg, #047857);
  border-color: var(--button-success-active-border, #047857);
}

.button-warning {
  background-color: var(--button-warning-bg, #f59e0b);
  color: var(--button-warning-text, #ffffff);
  border: 1px solid var(--button-warning-border, #f59e0b);
}

.button-warning:hover:not(.button-disabled):not(.button-loading) {
  background-color: var(--button-warning-hover-bg, #d97706);
  border-color: var(--button-warning-hover-border, #d97706);
}

.button-warning:focus-visible {
  outline: 2px solid var(--button-warning-focus-ring, rgba(245, 158, 11, 0.5));
  outline-offset: 2px;
}

.button-warning:active:not(.button-disabled):not(.button-loading) {
  background-color: var(--button-warning-active-bg, #b45309);
  border-color: var(--button-warning-active-border, #b45309);
}

.button-info {
  background-color: var(--button-info-bg, #3b82f6);
  color: var(--button-info-text, #ffffff);
  border: 1px solid var(--button-info-border, #3b82f6);
}

.button-info:hover:not(.button-disabled):not(.button-loading) {
  background-color: var(--button-info-hover-bg, #2563eb);
  border-color: var(--button-info-hover-border, #2563eb);
}

.button-info:focus-visible {
  outline: 2px solid var(--button-info-focus-ring, rgba(59, 130, 246, 0.5));
  outline-offset: 2px;
}

.button-info:active:not(.button-disabled):not(.button-loading) {
  background-color: var(--button-info-active-bg, #1d4ed8);
  border-color: var(--button-info-active-border, #1d4ed8);
}

/* States */
.button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.button-loading {
  cursor: wait;
}

.button-full-width {
  width: 100%;
}

.button-rounded {
  border-radius: 9999px;
}

/* Icons */
.button-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.button-icon-left {
  margin-right: 0.5rem;
}

.button-icon-right {
  margin-left: 0.5rem;
}

.button-icon svg {
  width: 1em;
  height: 1em;
}

/* Loading spinner */
.button-spinner {
  display: inline-flex;
  margin-right: 0.5rem;
}

.button-loading-text {
  margin-left: 0.5rem;
}

/* Ripple effect */
.button-ripple-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
}

.button-ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  background-color: rgba(255, 255, 255, 0.7);
  animation: ripple 0.6s linear;
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

/* Mobile optimizations */
@media (hover: none) {
  .button {
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
  }
}

/* iOS optimizations */
:global(.ios-device) .button {
  /* Ensure buttons are large enough for touch */
  min-height: 2.5rem;
}

/* Android optimizations */
:global(.android-device) .button {
  /* Material Design-like elevation */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }
  
  .button-ripple {
    animation: none;
    opacity: 0;
  }
}

/* High contrast mode */
@media (prefers-contrast: more) {
  .button {
    border-width: 2px;
  }
  
  .button-primary {
    background-color: #0000FF;
    color: #FFFFFF;
    border-color: #000000;
  }
  
  .button-secondary {
    background-color: #FFFFFF;
    color: #000000;
    border-color: #000000;
  }
  
  .button-ghost {
    color: #000000;
    border-color: #000000;
  }
  
  .button-danger {
    background-color: #FF0000;
    color: #FFFFFF;
    border-color: #000000;
  }
  
  .button-success {
    background-color: #008000;
    color: #FFFFFF;
    border-color: #000000;
  }
  
  .button-warning {
    background-color: #FFA500;
    color: #000000;
    border-color: #000000;
  }
  
  .button-info {
    background-color: #0000FF;
    color: #FFFFFF;
    border-color: #000000;
  }
}
</style>