<template>
  <div 
    class="slider-container" 
    :class="{ 'slider-disabled': disabled }"
    :data-orientation="vertical ? 'vertical' : 'horizontal'"
  >
    <label v-if="label" :for="id" class="slider-label">{{ label }}</label>
    
    <div 
      ref="trackRef"
      class="slider-track"
      :class="{ 'slider-track-vertical': vertical }"
      @click="handleTrackClick"
    >
      <!-- Track background -->
      <div class="slider-track-bg"></div>
      
      <!-- Track fill -->
      <div 
        class="slider-track-fill" 
        :style="trackFillStyle"
      ></div>
      
      <!-- Range thumbs -->
      <template v-if="range">
        <div
          ref="minThumbRef"
          role="slider"
          tabindex="0"
          :id="`${id}-min`"
          class="slider-thumb"
          :class="{ 'slider-thumb-active': activeThumb === 'min' }"
          :style="minThumbStyle"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-valuenow="Array.isArray(modelValue) ? modelValue[0] : modelValue"
          :aria-labelledby="ariaLabelledby"
          :aria-label="ariaLabel ? `${ariaLabel} minimum value` : undefined"
          :aria-disabled="disabled"
          @keydown="handleKeyDown($event, 'min')"
          @mousedown="handleThumbMouseDown($event, 'min')"
          @touchstart="handleThumbTouchStart($event, 'min')"
          @focus="activeThumb = 'min'"
          @blur="activeThumb = null"
        ></div>
        
        <div
          ref="maxThumbRef"
          role="slider"
          tabindex="0"
          :id="`${id}-max`"
          class="slider-thumb"
          :class="{ 'slider-thumb-active': activeThumb === 'max' }"
          :style="maxThumbStyle"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-valuenow="Array.isArray(modelValue) ? modelValue[1] : modelValue"
          :aria-labelledby="ariaLabelledby"
          :aria-label="ariaLabel ? `${ariaLabel} maximum value` : undefined"
          :aria-disabled="disabled"
          @keydown="handleKeyDown($event, 'max')"
          @mousedown="handleThumbMouseDown($event, 'max')"
          @touchstart="handleThumbTouchStart($event, 'max')"
          @focus="activeThumb = 'max'"
          @blur="activeThumb = null"
        ></div>
      </template>
      
      <!-- Single thumb -->
      <template v-else>
        <div
          ref="thumbRef"
          role="slider"
          tabindex="0"
          :id="id"
          class="slider-thumb"
          :class="{ 'slider-thumb-active': activeThumb === 'single' }"
          :style="thumbStyle"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-valuenow="Array.isArray(modelValue) ? undefined : modelValue"
          :aria-labelledby="ariaLabelledby"
          :aria-label="ariaLabel"
          :aria-disabled="disabled"
          @keydown="handleKeyDown($event, 'single')"
          @mousedown="handleThumbMouseDown($event, 'single')"
          @touchstart="handleThumbTouchStart($event, 'single')"
          @focus="activeThumb = 'single'"
          @blur="activeThumb = null"
        ></div>
      </template>
    </div>
    
    <!-- Value display -->
    <div v-if="showValue" class="slider-value">
      <span v-if="range && Array.isArray(modelValue)">{{ modelValue[0] }} - {{ modelValue[1] }}</span>
      <span v-else>{{ modelValue }}</span>
    </div>
    
    <!-- Tick marks -->
    <div v-if="showTicks" class="slider-ticks" :class="{ 'slider-ticks-vertical': vertical }">
      <div 
        v-for="tick in ticks" 
        :key="tick.value" 
        class="slider-tick"
        :class="{ 'slider-tick-active': isTickActive(tick.value) }"
        :style="getTickStyle(tick.value)"
      >
        <span v-if="tick.label" class="slider-tick-label">{{ tick.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useElementSize } from '../../composables/useElementSize';

interface Props {
  modelValue: number | number[];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  vertical?: boolean;
  range?: boolean;
  showValue?: boolean;
  showTicks?: boolean;
  ticks?: { value: number; label?: string }[];
  id?: string;
  label?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  vertical: false,
  range: false,
  showValue: false,
  showTicks: false,
  ticks: () => [],
  id: `slider-${Math.random().toString(36).substring(2, 9)}`
});

const emit = defineEmits<{
  'update:modelValue': [value: number | number[]];
  'change': [value: number | number[]];
}>();

// Refs
const trackRef = ref<HTMLElement | null>(null);
const thumbRef = ref<HTMLElement | null>(null);
const minThumbRef = ref<HTMLElement | null>(null);
const maxThumbRef = ref<HTMLElement | null>(null);
const activeThumb = ref<'single' | 'min' | 'max' | null>(null);

// Track size
const { width: trackWidth, height: trackHeight } = useElementSize(trackRef);

// Computed values
const normalizedValue = computed(() => {
  if (props.range) {
    const value = props.modelValue as number[];
    return [
      Math.max(props.min, Math.min(props.max, value[0])),
      Math.max(props.min, Math.min(props.max, value[1]))
    ];
  } else {
    const value = props.modelValue as number;
    return Math.max(props.min, Math.min(props.max, value));
  }
});

const valueToPosition = (value: number): number => {
  const range = props.max - props.min;
  const percentage = ((value - props.min) / range) * 100;
  return Math.max(0, Math.min(100, percentage));
};

const thumbStyle = computed(() => {
  if (props.vertical) {
    const position = 100 - valueToPosition(normalizedValue.value as number);
    return { top: `${position}%` };
  } else {
    const position = valueToPosition(normalizedValue.value as number);
    return { left: `${position}%` };
  }
});

const minThumbStyle = computed(() => {
  if (props.vertical) {
    const position = 100 - valueToPosition((normalizedValue.value as number[])[0]);
    return { top: `${position}%` };
  } else {
    const position = valueToPosition((normalizedValue.value as number[])[0]);
    return { left: `${position}%` };
  }
});

const maxThumbStyle = computed(() => {
  if (props.vertical) {
    const position = 100 - valueToPosition((normalizedValue.value as number[])[1]);
    return { top: `${position}%` };
  } else {
    const position = valueToPosition((normalizedValue.value as number[])[1]);
    return { left: `${position}%` };
  }
});

const trackFillStyle = computed(() => {
  if (props.range) {
    const minPos = valueToPosition((normalizedValue.value as number[])[0]);
    const maxPos = valueToPosition((normalizedValue.value as number[])[1]);
    
    if (props.vertical) {
      return {
        bottom: `${minPos}%`,
        height: `${maxPos - minPos}%`
      };
    } else {
      return {
        left: `${minPos}%`,
        width: `${maxPos - minPos}%`
      };
    }
  } else {
    const position = valueToPosition(normalizedValue.value as number);
    
    if (props.vertical) {
      return {
        height: `${100 - position}%`
      };
    } else {
      return {
        width: `${position}%`
      };
    }
  }
});

// Methods
const positionToValue = (position: number): number => {
  const trackSize = props.vertical ? trackHeight.value : trackWidth.value;
  const percentage = Math.max(0, Math.min(100, (position / trackSize) * 100));
  
  // Adjust for vertical orientation
  const adjustedPercentage = props.vertical ? 100 - percentage : percentage;
  
  const range = props.max - props.min;
  let value = (adjustedPercentage / 100) * range + props.min;
  
  // Snap to step
  value = Math.round(value / props.step) * props.step;
  
  return Math.max(props.min, Math.min(props.max, value));
};

const handleTrackClick = (event: MouseEvent) => {
  if (props.disabled) return;
  
  const rect = trackRef.value!.getBoundingClientRect();
  const position = props.vertical
    ? event.clientY - rect.top
    : event.clientX - rect.left;
  
  const newValue = positionToValue(position);
  
  if (props.range) {
    const [min, max] = normalizedValue.value as number[];
    const midpoint = (min + max) / 2;
    
    if (newValue <= midpoint) {
      emit('update:modelValue', [newValue, max]);
      emit('change', [newValue, max]);
    } else {
      emit('update:modelValue', [min, newValue]);
      emit('change', [min, newValue]);
    }
  } else {
    emit('update:modelValue', newValue);
    emit('change', newValue);
  }
};

const handleThumbMouseDown = (event: MouseEvent, thumb: 'single' | 'min' | 'max') => {
  if (props.disabled) return;
  
  event.preventDefault();
  activeThumb.value = thumb;
  
  const handleMouseMove = (e: MouseEvent) => {
    const rect = trackRef.value!.getBoundingClientRect();
    const position = props.vertical
      ? e.clientY - rect.top
      : e.clientX - rect.left;
    
    updateValueFromPosition(position, thumb);
  };
  
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

const handleThumbTouchStart = (event: TouchEvent, thumb: 'single' | 'min' | 'max') => {
  if (props.disabled) return;
  
  event.preventDefault();
  activeThumb.value = thumb;
  
  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    const rect = trackRef.value!.getBoundingClientRect();
    const position = props.vertical
      ? touch.clientY - rect.top
      : touch.clientX - rect.left;
    
    updateValueFromPosition(position, thumb);
  };
  
  const handleTouchEnd = () => {
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };
  
  document.addEventListener('touchmove', handleTouchMove);
  document.addEventListener('touchend', handleTouchEnd);
};

const updateValueFromPosition = (position: number, thumb: 'single' | 'min' | 'max') => {
  const newValue = positionToValue(position);
  
  if (props.range) {
    const [min, max] = normalizedValue.value as number[];
    
    if (thumb === 'min') {
      // Ensure min doesn't exceed max
      const updatedValue = Math.min(newValue, max);
      emit('update:modelValue', [updatedValue, max]);
      emit('change', [updatedValue, max]);
    } else {
      // Ensure max doesn't go below min
      const updatedValue = Math.max(newValue, min);
      emit('update:modelValue', [min, updatedValue]);
      emit('change', [min, updatedValue]);
    }
  } else {
    emit('update:modelValue', newValue);
    emit('change', newValue);
  }
};

const handleKeyDown = (event: KeyboardEvent, thumb: 'single' | 'min' | 'max') => {
  if (props.disabled) return;
  
  const step = event.shiftKey ? props.step * 10 : props.step;
  let newValue: number | number[];
  
  if (props.range) {
    const [min, max] = normalizedValue.value as number[];
    
    if (thumb === 'min') {
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          newValue = [Math.min(min + step, max), max];
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = [Math.max(min - step, props.min), max];
          break;
        case 'Home':
          newValue = [props.min, max];
          break;
        case 'End':
          newValue = [max, max];
          break;
        default:
          return;
      }
    } else {
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          newValue = [min, Math.min(max + step, props.max)];
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = [min, Math.max(max - step, min)];
          break;
        case 'Home':
          newValue = [min, min];
          break;
        case 'End':
          newValue = [min, props.max];
          break;
        default:
          return;
      }
    }
  } else {
    const value = normalizedValue.value as number;
    
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(value + step, props.max);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(value - step, props.min);
        break;
      case 'Home':
        newValue = props.min;
        break;
      case 'End':
        newValue = props.max;
        break;
      default:
        return;
    }
  }
  
  event.preventDefault();
  emit('update:modelValue', newValue);
  emit('change', newValue);
};

// Tick marks
const isTickActive = (tickValue: number) => {
  if (props.range) {
    const [min, max] = normalizedValue.value as number[];
    return tickValue >= min && tickValue <= max;
  } else {
    const value = normalizedValue.value as number;
    return tickValue <= value;
  }
};

const getTickStyle = (tickValue: number) => {
  const position = valueToPosition(tickValue);
  
  if (props.vertical) {
    return { top: `${100 - position}%` };
  } else {
    return { left: `${position}%` };
  }
};

// Ensure the initial value is valid
onMounted(() => {
  if (props.range) {
    const value = props.modelValue as number[];
    if (!Array.isArray(value) || value.length !== 2) {
      console.warn('Slider: range mode requires modelValue to be an array of two numbers');
      emit('update:modelValue', [props.min, props.max]);
    } else if (value[0] > value[1]) {
      emit('update:modelValue', [value[1], value[0]]);
    }
  }
});

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (props.range) {
    const value = newValue as number[];
    if (!Array.isArray(value) || value.length !== 2) {
      console.warn('Slider: range mode requires modelValue to be an array of two numbers');
      emit('update:modelValue', [props.min, props.max]);
    } else if (value[0] > value[1]) {
      emit('update:modelValue', [value[1], value[0]]);
    }
  }
}, { deep: true });
</script>

<style scoped>
.slider-container {
  position: relative;
  width: 100%;
  padding: 1rem 0;
  touch-action: none;
}

.slider-container[data-orientation="vertical"] {
  height: 200px;
  width: auto;
  padding: 0 1rem;
}

.slider-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--slider-label-color, #374151);
}

.slider-track {
  position: relative;
  height: 0.25rem;
  background-color: var(--slider-track-bg, #e5e7eb);
  border-radius: 9999px;
  cursor: pointer;
}

.slider-track-vertical {
  width: 0.25rem;
  height: 100%;
}

.slider-track-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 9999px;
  background-color: var(--slider-track-bg, #e5e7eb);
}

.slider-track-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 9999px;
  background-color: var(--slider-fill-color, #3b82f6);
  transition: width 0.1s ease, left 0.1s ease, height 0.1s ease, bottom 0.1s ease;
}

.slider-track-vertical .slider-track-fill {
  width: 100%;
  height: auto;
  bottom: 0;
}

/* Disable transitions for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .slider-track-fill {
    transition: none;
  }
}

.slider-thumb {
  position: absolute;
  width: 1rem;
  height: 1rem;
  background-color: var(--slider-thumb-color, #3b82f6);
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: grab;
  transform: translate(-50%, -50%);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  z-index: 1;
  touch-action: none;
}

.slider-track-vertical .slider-thumb {
  transform: translate(-50%, 50%);
}

.slider-thumb:hover,
.slider-thumb:focus {
  box-shadow: 0 0 0 5px rgba(59, 130, 246, 0.2);
}

.slider-thumb:active,
.slider-thumb-active {
  cursor: grabbing;
  transform: translate(-50%, -50%) scale(1.1);
  box-shadow: 0 0 0 5px rgba(59, 130, 246, 0.3);
}

.slider-track-vertical .slider-thumb:active,
.slider-track-vertical .slider-thumb-active {
  transform: translate(-50%, 50%) scale(1.1);
}

.slider-value {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--slider-value-color, #374151);
  text-align: center;
}

.slider-ticks {
  position: relative;
  width: 100%;
  height: 1rem;
  margin-top: 0.5rem;
}

.slider-ticks-vertical {
  width: 1rem;
  height: 100%;
  margin-top: 0;
  margin-left: 0.5rem;
  position: absolute;
  top: 0;
  right: 0;
}

.slider-tick {
  position: absolute;
  width: 1px;
  height: 0.5rem;
  background-color: var(--slider-tick-color, #9ca3af);
  transform: translateX(-50%);
}

.slider-ticks-vertical .slider-tick {
  width: 0.5rem;
  height: 1px;
  transform: translateY(50%);
}

.slider-tick-active {
  background-color: var(--slider-tick-active-color, #3b82f6);
}

.slider-tick-label {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--slider-tick-label-color, #6b7280);
  white-space: nowrap;
}

.slider-ticks-vertical .slider-tick-label {
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  margin-top: 0;
  margin-left: 0.25rem;
}

.slider-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.slider-disabled .slider-track,
.slider-disabled .slider-thumb {
  cursor: not-allowed;
}

/* Mobile optimizations */
@media (hover: none) {
  .slider-thumb {
    width: 1.25rem;
    height: 1.25rem;
  }
}

/* iOS optimizations */
:global(.ios-device) .slider-thumb {
  width: 1.5rem;
  height: 1.5rem;
}

/* Android optimizations */
:global(.android-device) .slider-thumb {
  width: 1.25rem;
  height: 1.25rem;
}

/* High contrast mode */
@media (prefers-contrast: more) {
  .slider-track {
    background-color: #000;
  }
  
  .slider-track-fill {
    background-color: #0000FF;
  }
  
  .slider-thumb {
    background-color: #0000FF;
    border: 2px solid #FFFFFF;
    box-shadow: 0 0 0 2px #000000;
  }
  
  .slider-tick {
    background-color: #000;
  }
  
  .slider-tick-active {
    background-color: #0000FF;
  }
}
</style>